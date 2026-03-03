# Database Backup and Restoration Process

This document outlines the automated daily database backup system to AWS S3 and the steps required for restoration.

## 1. Overview

An automated TypeScript script (`scripts/backup-db-to-s3.ts`) is configured to:
1.  Connect to the production database (e.g., PostgreSQL).
2.  Perform a full database dump.
3.  Compress the dump file.
4.  Upload the compressed backup to a specified AWS S3 bucket.
5.  Clean up the local dump file.

This script is intended to be run daily via a cron job on a dedicated server or a continuous integration/delivery (CI/CD) pipeline.

## 2. Setup and Configuration

### Prerequisites:

*   Node.js (LTS version)
*   `ts-node` (for running TypeScript scripts directly)
*   `typescript`
*   `pg_dump` command-line utility (for PostgreSQL, ensure it's installed and in `PATH`)
    *   For Ubuntu/Debian: `sudo apt-get install postgresql-client`
    *   For macOS: `brew install libpq` (then link if needed)
*   AWS S3 Bucket with appropriate IAM permissions (write access for the script's AWS credentials).

### Environment Variables:

Create a `.env` file (or set environment variables directly in your deployment environment/cron job) in the project root based on `.env.example`:

```env
# Database Connection Details (PostgreSQL example)
DB_HOST=your_db_host
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name

# AWS S3 Configuration
S3_BUCKET_NAME=your-s3-backup-bucket-name
S3_REGION=your-aws-region # e.g., us-east-1
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY

# Security Note: For production environments, it is highly recommended to use
# AWS IAM roles (e.g., if running on an EC2 instance or Lambda function)
# instead of hardcoding AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.
# This grants temporary credentials and improves security posture.
```

### Running the Script Manually:

To test the script, ensure dependencies are installed (`npm install` or `yarn install`), then run:

```bash
npm run backup
# or
yarn backup
```

### Setting up a Cron Job (Example):

To automate daily backups, set up a cron job on your server.
1.  Edit your crontab: `crontab -e`
2.  Add a line similar to this (e.g., to run daily at 2 AM UTC):

    ```cron
    0 2 * * * cd /path/to/your/project && /usr/bin/npm run backup >> /var/log/db-backup.log 2>&1
    ```
    *   Replace `/path/to/your/project` with the actual path to your project directory.
    *   Ensure `npm` is in the `PATH` of the cron environment, or provide its full path (e.g., `/usr/local/bin/npm`).
    *   `>> /var/log/db-backup.log 2>&1` redirects both standard output and standard error to a log file. Review this log regularly.

## 3. Monitoring Backup Jobs

Robust monitoring is crucial to ensure backups are consistently successful.

*   **Cron Job Logs**: Regularly check the log file specified in your cron job (e.g., `/var/log/db-backup.log`). Look for "Database backup completed successfully!" messages and any error outputs.
*   **S3 Bucket Inspection**: Periodically verify that new backup files are appearing in your S3 bucket (e.g., via AWS Console or AWS CLI). Check file sizes to ensure they are reasonable.
    ```bash
    aws s3 ls s3://your-s3-backup-bucket-name/backups/
    ```
*   **Alerting**:
    *   Configure cloud monitoring (e.g., AWS CloudWatch, Datadog) to alert you if the cron job fails or produces error output.
    *   For critical failures, consider integrating with a notification service (e.g., Slack, PagerDuty, email).
*   **Restore Tests**: Periodically perform a test restoration to a staging environment to validate the integrity of your backup files and the restoration process itself. This is the ultimate test of your backup system.

## 4. Restoration Process

In the event of data loss or corruption, follow these steps to restore your database from an S3 backup.

**WARNING**: Restoring a database will overwrite existing data. **Ensure you understand the implications before proceeding, especially in a production environment.** Always practice restoration on a staging or development environment first.

### Steps:

1.  **Identify the Backup**:
    *   Browse your S3 bucket (e.g., `s3://your-s3-backup-bucket-name/backups/`) to find the desired backup file (e.g., `db-backup-YYYY-MM-DDTHH-MM-SS.sql.gz`).
    *   Note the full S3 key (path) of the file.

2.  **Download the Backup File**:
    *   Use the AWS CLI to download the file to your restoration server:
        ```bash
        aws s3 cp s3://your-s3-backup-bucket-name/backups/db-backup-YYYY-MM-DDTHH-MM-SS.sql.gz ./latest_backup.sql.gz
        ```

3.  **Prepare the Database**:
    *   **Option A: Restore to an entirely new database (recommended for safety):**
        ```sql
        CREATE DATABASE new_database_for_restore;
        ```
    *   **Option B: Overwrite an existing database:**
        *   **CRITICAL**: Take a snapshot or a quick dump of the current database state *before* dropping it, in case you need to revert.
        *   Drop and recreate the target database:
            ```sql
            DROP DATABASE IF EXISTS your_database_name;
            CREATE DATABASE your_database_name;
            ```
        *   Ensure the database user has sufficient privileges to create/drop databases and tables.

4.  **Restore the Database**:
    *   Decompress the backup file and pipe it directly to `psql`.
    *   Ensure `psql` is installed and in your `PATH`.
    ```bash
    gunzip < ./latest_backup.sql.gz | PGPASSWORD='your_db_password' psql -h your_db_host -p 5432 -U your_db_user -d your_database_name
    ```
    *   Replace placeholders like `your_db_password`, `your_db_host`, `your_db_user`, and `your_database_name` with your actual database credentials and the target database name.

5.  **Verify Restoration**:
    *   Connect to the restored database using a client (e.g., `psql`) or your application.
    *   Run some queries to verify that the data is present and correct.
    *   Check table counts, recent entries, etc.

6.  **Cleanup**:
    *   Delete the local backup file (`latest_backup.sql.gz`) after successful restoration and verification.

### Important Considerations:

*   **Point-in-Time Recovery**: This backup strategy creates snapshots at specific times. For true point-in-time recovery (restoring to an arbitrary second), you would need to combine full backups with continuous archiving of PostgreSQL's Write-Ahead Log (WAL), typically managed by tools like `WAL-G` or `Barman`. This script does not provide point-in-time recovery on its own.
*   **Retention Policy**: Implement a clear retention policy for your S3 backups. Use S3 Lifecycle rules to automatically expire older backups to manage storage costs and comply with data retention policies.
*   **Security**: Ensure your S3 bucket policies are restrictive, allowing access only to necessary IAM roles/users. Enable S3 bucket versioning for an extra layer of protection against accidental deletions.

---

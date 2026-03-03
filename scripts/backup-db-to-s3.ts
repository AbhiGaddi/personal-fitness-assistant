import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env file
dotenv.config();

// Database connection details
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// AWS S3 configuration
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_REGION = process.env.S3_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

// Validate required environment variables
const requiredEnv = [
  "DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME",
  "S3_BUCKET_NAME", "S3_REGION", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"
];

for (const envVar of requiredEnv) {
  if (!process.env[envVar]) {
    console.error(`Error: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize S3 client
const s3 = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Executes a shell command and returns a Promise.
 * @param command The command to execute.
 * @returns A Promise that resolves on successful command execution, or rejects on error.
 */
function executeCommand(command: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command failed: ${error.message}`);
        return reject(error);
      }
      if (stdout) {
        console.log(`stdout: ${stdout}`);
      }
      if (stderr) {
        console.warn(`stderr: ${stderr}`);
      }
      resolve();
    });
  });
}

/**
 * Main function to run the database backup process.
 */
async function runBackup(): Promise<void> {
  const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\..+/, ""); // YYYY-MM-DDTHH-MM-SS
  const backupFileName = `db-backup-${timestamp}.sql.gz`;
  const localBackupPath = path.join(process.cwd(), backupFileName);

  console.log(`Starting database backup for '${DB_NAME}' at ${timestamp}...`);

  try {
    // 1. Perform database dump (using pg_dump for PostgreSQL)
    // For other databases (e.g., MySQL), replace this command with 'mysqldump'
    const pgDumpCommand = `PGPASSWORD='${DB_PASSWORD}' pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} | gzip > ${localBackupPath}`;

    console.log(`Executing database dump command...`);
    await executeCommand(pgDumpCommand);
    console.log(`Database dump created locally: ${localBackupPath}`);

    // 2. Upload to S3
    console.log(`Uploading '${backupFileName}' to S3 bucket '${S3_BUCKET_NAME}'...`);
    const fileContent = fs.readFileSync(localBackupPath);

    const uploadParams = {
      Bucket: S3_BUCKET_NAME,
      Key: `backups/${backupFileName}`, // Store in a 'backups' folder in S3
      Body: fileContent,
      ContentType: "application/gzip",
      ServerSideEncryption: "AES256", // Optional: Encrypt at rest in S3
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);
    console.log(`Successfully uploaded '${backupFileName}' to S3.`);

  } catch (error) {
    console.error("Database backup failed:", error);
    // Exit with error code to indicate failure to cron/monitoring systems
    process.exit(1);
  } finally {
    // 3. Clean up local backup file, regardless of success or failure
    if (fs.existsSync(localBackupPath)) {
      try {
        fs.unlinkSync(localBackupPath);
        console.log(`Cleaned up local backup file: ${localBackupPath}`);
      } catch (cleanupError) {
        console.error(`Failed to clean up local backup file: ${cleanupError}`);
      }
    }
  }

  console.log("Database backup completed successfully!");
}

// Execute the backup process
runBackup();

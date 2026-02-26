# Workout Heuristics Application

This project is a Next.js application built with TypeScript and Tailwind CSS, designed to manage workout heuristics and potentially a 'slot engine' for dynamic workout generation or scheduling. It emphasizes a modular architecture, clear separation of concerns, and robust typing.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Principles](#architecture-principles)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Development Server](#running-the-development-server)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Project Structure](#project-structure)

## Features

- **Workout Heuristics Engine**: Isolated business logic for generating and managing workout routines based on defined rules.
- **Dynamic UI Components**: Modular and reusable components for presenting workout information.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience across various devices.
- **Client-Server Boundaries**: Effective utilization of Next.js App Router's server and client components for optimized performance.
- **(Future) Slot Engine**: Potentially for dynamic scheduling or component rendering based on workout slots.
- **(Latest Update)**: Recent CSS fixes for improved UI consistency.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/react)

## Architecture Principles

- **Modular Components**: Emphasis on creating small, reusable, and focused UI and logic components.
- **Isolated Business Logic**: All workout heuristics and core business logic are strictly isolated from the UI layer to enhance maintainability and testability.
- **Server/Client Component Boundaries**: Strategic use of Next.js App Router features to optimize data fetching and rendering.
- **Strict TypeScript Typing**: Extensive use of TypeScript to ensure code quality, catch errors early, and improve developer experience.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd <your-project-directory>
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Running the Development Server

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

This command creates an optimized production build in the `.next` directory.

To start the production server:

```bash
npm start
# or
yarn start
```

## Testing

Unit tests are written using Jest and React Testing Library. To run the tests:

```bash
npm test
# or
yarn test
```

For watching tests during development:

```bash
npm test -- --watch
# or
yarn test --watch
```

## Project Structure

```
. (root)
├── app/                  # Next.js App Router root
│   ├── (main)/           # Example route group
│   │   ├── page.tsx      # Home page
│   │   └── layout.tsx    # Layout for main routes
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
├── lib/                  # Utility functions and helper modules
│   └── heuristics/       # Business logic for workout heuristics
├── styles/               # Tailwind CSS configuration and custom styles
├── public/               # Static assets
├── tests/                # Jest unit tests
├── types/                # TypeScript custom types and interfaces
├── .env.local            # Environment variables
├── next.config.mjs       # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies and scripts
```
```

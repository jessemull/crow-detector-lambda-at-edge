# Crow Detector Lambda At Edge

The **Crow Detector** is an AI-powered application that helps users identify and learn about different species of crows and other corvids. This project provides a comprehensive database and identification tools for bird enthusiasts, researchers, and nature lovers.

The **Crow Detector** website offers interactive features for crow identification, species information, and educational content about these intelligent birds.

The **Crow Detector Project Lambda@Edge** provides deep linking for the **Crow Detector Project** website.

This repository is part of the **Crow Detector Project** which includes the following repositories:

- **[Crow Detector MCP Lambda](https://github.com/jessemull/crow-detector-mcp-lambda)**: The **Crow Detector** MCP lambda.
- **[Crow Detector Project Client](https://github.com/jessemull/crow-detector-client)**: The **Crow Detector** NextJS client.
- **[Crow Detector Lambda@Edge](https://github.com/jessemull/crow-detector-lambda-at-edge)**: The **Crow Detector** Lambda@Edge.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Environments](#environments)
3. [Tech Stack](#tech-stack)
4. [Setup Instructions](#setup-instructions)
5. [Commits and Commitizen](#commits-and-commitizen)
   - [Making A Commit](#making-a-commit)
6. [Linting & Formatting](#linting--formatting)
   - [Linting Commands](#linting-commands)
   - [Formatting Commands](#formatting-commands)
   - [Pre-Commit Hook](#pre-commit-hook)
7. [Testing & Code Coverage](#testing--code-coverage)
   - [Testing Commands](#testing-commands)
   - [Code Coverage](#code-coverage)
8. [Building & Packaging](#building--packaging)
   - [Summary](#summary)
   - [Install](#install)
   - [Build](#build)
   - [Package](#package)
9. [Deployment Pipelines](#deployment-pipelines)
   - [Deployment Strategy](#deployment-strategy)
   - [Tools Used](#tools-used)
   - [Pull Request](#pull-request)
   - [Deploy](#deploy)
   - [Merge](#merge)
   - [Rollback](#rollback)
10. [Connecting to the Bastion Host](#connecting-to-the-bastion-host)
    - [Environment Variables](#environment-variables)
11. [Cognito Access Token](#cognito-access-token)
    - [Generating An Access Token](#generating-an-access-token)
    - [Using An Access Token](#using-an-access-token)
    - [Environment Variables](#environment-variables)
12. [License](#license)

## Project Overview

This project implements an **AWS Lambda@Edge** function for the **Crow Detector** to enhance the functionality of a static **Next.js** website hosted on **S3** and served via **CloudFront**.

### **Key Features:**

- **Deep Linking Support**: Ensures that requests for missing `.html` extensions are correctly routed.
- **Edge Computing**: Executes logic at CloudFront edge locations for minimal latency and improved security.
- **Next.js Compatibility**: Works with static site exports to provide seamless navigation.

### **Routing Logic**

- Requests without file extensions (e.g., `/about`) are rewritten to include `.html` (e.g., `/about.html`).
- The function normalizes paths to ensure consistent behavior across different browsers and request formats.

This setup improves both security and usability for the website while keeping it performant by running at the **CloudFront** edge.

## Environments

The **Crow Detector** operates in multiple environments to ensure smooth development, testing, and production workflows. Configuration files and environment variables should be set to point to the correct environment (dev/prod), depending on the stage of the application. Separate cloudfront distributions exist for each environment.

## Tech Stack

This project leverages modern web and cloud technologies to provide secure, scalable, and efficient authentication for CloudFront distributions.

- **AWS Lambda@Edge**: Provides request routing logic at CloudFront's edge locations, enabling low-latency redirects.

- **AWS CloudFront**: Serves as the content delivery network (CDN), caching responses and improving site performance.

- **AWS S3**: Stores static assets and front-end resources, ensuring durability and cost-effective distribution.

- **TypeScript**: Enforces strong typing and maintainability.

- **GitHub Actions**: Automates CI/CD workflows, handling linting, testing, and deployment of Lambda@Edge functions.

- **Jest**: A JavaScript testing framework used for unit tests, ensuring robust testing logic.

- **ESLint & Prettier**: Linting and formatting tools that enforce code consistency and reduce syntax errors.

- **Commitizen**: Standardizes commit messages to maintain a clear and structured git history.

This tech stack ensures that the **Crow Detector** remains secure, performant and easy to maintain while leveraging AWS infrastructure for scalability and reliability.

## Setup Instructions

To clone the repository and install dependencies follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/jessemull/crow-detector-lambda-at-edge.git
   ```

2. Navigate into the project directory:

   ```bash
   cd crow-detector-lambda-at-edge
   ```

3. Install the root dependencies:

   ```bash
   npm install
   ```

## Commits and Commitizen

This project uses **Commitizen** to ensure commit messages follow a structured format and versioning is consistent. Commit linting is enforced via a pre-commit husky hook.

### Making a Commit

To make a commit in the correct format, run the following command. Commitzen will walk the user through the creation of a structured commit message and versioning:

```bash
npm run commit
```

## Testing & Code Coverage

This project uses **Jest** for testing. Code coverage is enforced during every CI/CD pipeline. The build will fail if any tests fail or coverage drops below **80%**.

### Testing Commands

Run tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Code Coverage

Coverage thresholds are enforced at **80%** for all metrics. The build will fail if coverage drops below this threshold.

## Linting & Formatting

This project uses **ESLint** and **Prettier** for code quality enforcement. Linting is enforced during every CI/CD pipeline to ensure consistent standards.

### Linting Commands

Run linting:

```bash
npm run lint
```

Run linting with automatic fixes applied:

```bash
npm run lint:fix
```

### Formatting Commands

Format using prettier:

```bash
npm run format
```

### Pre-Commit Hook

**Lint-staged** is configured to run linting before each commit. The commit will be blocked if linting fails, ensuring code quality at the commit level.

## Building & Packaging

### Summary

The build command runs webpack and outputs the build artifacts into a `dist/` directory. Pre-build, a clean command removes the `dist` directory. Webpack performs minification but leaves the handler name intact so it remains discoverable by the AWS lambda service.

The package command zips the contents of the `dist/` folder for the lambda deployment. Before running a build, ensure you have dependencies installed.

Lambda at edge deployments must have a package size under 1MB. Using webpack optimization the bundle size is less than 50KB.

### Install

To install dependencies:

```bash
npm install
```

### Build

To run the build:

```bash
npm run build
```

### Package

To package the application:

```bash
npm run package
```

## Deployment Pipelines

This project uses automated deployment pipelines to ensure a smooth and reliable deployment process utilizing AWS CloudFormation, GitHub Actions and S3. Deploying a lambda version to lambda at edge is not supported fully by CloudFormation. Deployment to edge and adding a CloudFront trigger are done manually using the console.

### Deployment Strategy

Each deployment process involves:

- **Versioned Artifacts:** The function is bundled and uploaded as a zipped package to Amazon S3. The package is versioned using a unique artifact name, ensuring that each deployment has a distinct, traceable version.
- **CloudFormation:** AWS CloudFormation change sets are used to manage and deploy the lambda at edge function. This tool allows us to define, update, and roll back the infrastructure in a repeatable and consistent way.
- **Rollback:** Deployments can be rolled back to a prior version using previously stored S3 bundles.

### Tools Used

- **AWS CLI**: Configures the AWS environment for deployments.
- **GitHub Actions**: Automates and schedules the deployment and rollback pipelines.
- **CloudFormation**: Orchestrates infrastructure changes, including deployments and rollbacks.
- **S3**: Stores function packages for deployment and rollback.

### Pull Request

The pull request pipeline is triggered when a pull request is opened against the `main` branch. This pipeline performs the following steps:

1. **Build:** Builds and packages the lambda using webpack.
2. **Linting:** Runs linting checks.
3. **Testing:** Runs unit tests.
4. **Code Coverage:** Checks code coverage remains above 80%.

This pipeline is defined in the `.github/workflows/pull-request.yml` file.

### Deploy

The deploy pipeline is triggered manually via a workflow dispatch event, allowing deployment to dev/prod environments. This pipeline performs the following steps:

1. **Build:** Builds and packages the lambda using webpack.
2. **Linting:** Runs linting checks.
3. **Testing:** Runs unit tests.
4. **Code Coverage:** Checks code coverage remains above 80%.
5. **Artifact Generation:** Generates a versioned artifact name.
6. **S3 Upload:** Uploads the packaged lambda to S3.
7. **CloudFormation Deployment:** Creates, executes and monitors a change set.
8. **Backup Pruning:** Ensures only the latest five lambda package versions are stored in S3.

This pipeline is defined in the `.github/workflows/deploy.yml` file.

### Merge

The merge pipeline is triggered on a merged commit to main. It deploys the lambda to the development environment. This pipeline performs the following steps:

1. **Build:** Builds and packages the lambda using webpack.
2. **Linting:** Runs linting checks.
3. **Testing:** Run unit tests.
4. **Code Coverage:** Checks code coverage remains above 80%.
5. **Artifact Generation:** Generates a versioned artifact name.
6. **S3 Upload:** Uploads the packaged lambda to S3.
7. **CloudFormation Deployment:** Creates, executes and monitors a change set.
8. **Backup Pruning:** Ensures only the latest five lambda package versions are stored in S3.

This pipeline is defined in the `.github/workflows/merge.yml` file.

### Rollback

The rollback pipeline is triggered manually via a workflow dispatch event, allowing rollback of the lambda function to a previous version stored in S3. This pipeline performs the following steps:

1. **CloudFormation Deployment:** Creates, executes and monitors a change set.

## Connecting to the Bastion Host

To connect to the AWS EC2 bastion host and access AWS resources, you can use the following command:

```bash
npm run bastion
```

### Environment Variables

The following environment variables must be set in a `.env.local` file in the root of the project:

| Variable               | Description                               |
| ---------------------- | ----------------------------------------- |
| `SSH_HOST`             | The bastion host IP.                      |
| `SSH_PRIVATE_KEY_PATH` | Path to the bastion host private SSH key. |
| `SSH_USER`             | The bastion host username.                |

Ensure you have the appropriate permissions set on your SSH key for secure access.

## License

    Apache License
    Version 2.0, January 2004
    http://www.apache.org/licenses/

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

---

# Contributing to IFCS Catering App

Welcome to the IFCS Catering App project! We appreciate your interest in contributing. This guide will help you understand the codebase and our development workflow.

## Project Overview

This is a mobile application built with **React Native (Expo)**, designed for catering management.

### Key Technologies
-   **Framework**: [Expo (SDK 54)](https://expo.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) via [NativeWind v4](https://www.nativewind.dev/)
-   **Navigation**: [React Navigation v7](https://reactnavigation.org/)
-   **Networking**: Axios
-   **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites
-   [Node.js](https://nodejs.org/) (LTS recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   **iOS Simulator** (Mac only) or **Android Emulator**
-   [Expo Go app](https://expo.dev/client) (for testing on physical devices)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd ifcs-catering-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Prepare Husky hooks**:
    ```bash
    npm run prepare
    ```

### Running the App

-   **Start the development server**:
    ```bash
    npm start
    ```
-   **Run on Android**:
    ```bash
    npm run android
    ```
-   **Run on iOS** (Mac only):
    ```bash
    npm run ios
    ```

## 📂 Project Structure

The source code is located in the `src/` directory. Here's a breakdown:

```
src/
├── api/          # API client configuration (Axios instances)
├── assets/       # Static assets (images, fonts, etc.)
├── components/   # Reusable UI components
├── const/        # Application constants
├── hooks/        # Custom React hooks
├── navigation/   # Navigation setup and routing
├── schemas/      # Validation schemas (Zod)
├── screens/      # Screen components (views)
├── services/     # API services and business logic
├── store/        # Global state stores (Zustand)
├── types/        # TypeScript type definitions
└── utils/        # Helper functions and utilities
```

## Development Guidelines

### Coding Standards

-   **TypeScript**: We use Strict Mode. Ensure all variables and functions are properly typed. Avoid `any` wherever possible.
-   **Components**: Use Functional Components with Hooks.
-   **Styling**: Use utility classes (NativeWind) for styling. Avoid inline styles unless dynamic values are required.

### Linting and Formatting

We enforce code quality using **ESLint** and **Prettier**, and **Husky** ensures these run before commits.

-   **Run Linter**:
    ```bash
    npm run lint
    ```
-   **Rules**:
    -   **No Console Logs**: usage of `console.log` is warned against. Use `console.warn` or `console.error` for critical messages, or a dedicated logger utility.
    -   **Import Sorting**: Imports are automatically sorted using `eslint-plugin-simple-import-sort`.
    -   **Unused Variables**: Variables that are declared but not used will cause linting errors (prefix with `_` to ignore).

### State Management

We use **Zustand** for global state.
-   Store files should be located in `src/store/`.
-   Keep stores focused and modular (e.g., `useAuthStore`, `useFlightPreparationStore`).

## Testing

(If applicable, add specific instructions for running tests. Currently, Jest is set up.)

-   **Run Tests**:
    ```bash
    npm test
    ```

## Pull Request Process

1.  **Fork** the repo and create your branch from `main` or `develop`.
2.  **Naming Convention**: `feature/my-feature` or `fix/my-bug-fix`.
3.  **Commit Messages**: Write clear, descriptive commit messages.
4.  **Lint Check**: Ensure `npm run lint` passes before pushing.
5.  **Review**: Open a Pull Request (PR) and request a review from a team member.

## Support

If you have any questions or run into issues, please reach out to the project maintainers.

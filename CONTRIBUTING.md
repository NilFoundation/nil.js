# Contributing to nil.js

Thank you for your interest in contributing to nil.js! This document will guide you through the contribution process.

## Setting Up the Development Environment

1. **Prerequisites**

   - Node.js (v16 or higher)
   - npm (v7 or higher)
   - Git
   - A local nil cluster for testing (see Testing section)

2. **Clone and Install**

   ```bash
   git clone https://github.com/NilFoundation/nil.js.git
   cd nil.js
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

## Development Guidelines

### Code Style and Naming Conventions

1. **File Naming**

   - Use PascalCase for class files: `BaseClient.ts`, `PublicClient.ts`
   - Use camelCase for utility files: `address.ts`, `receipt.ts`
   - Test files should end with `.test.ts` and be placed next to the implementation: `CometaService.test.ts`
   - Client implementations should be in `src/clients/`
   - Contract implementations should be in `src/contracts/`

2. **Code Style**

   - Use TypeScript for all new code
   - Follow the existing ESLint and Biome configuration
   - Use JSDoc comments for all public APIs and classes
   - Each class should have a clear single responsibility
   - Use meaningful variable and function names that describe their purpose
   - Prefix interfaces with 'I': `ITransport`, `IClientBaseConfig`
   - Use type for complex type definitions: `type WalletV1Config = ...`

3. **Class Structure**

   - Place static members at the top of the class
   - Group class members by visibility (public, protected, private)
   - Document class constructor parameters
   - Follow existing error handling patterns using custom error classes

4. **Type Definitions**

   - Export types and interfaces from dedicated type files
   - Use descriptive names for type parameters
   - Group related types in a single file
   - Use union types and type intersections when appropriate

5. **Commit Messages**
   - Use conventional commits format: `type(scope): message`
   - Types: feat, fix, docs, style, refactor, test, chore
   - Scope should match the module being changed: `clients`, `contracts`, `encoding`
   - Examples:
     ```
     feat(clients): add new CometaService client
     fix(contracts): handle wallet deployment edge case
     docs(readme): update installation instructions
     ```

### Testing

1. **Test Structure**

   - Unit tests are located next to the implementation files
   - Integration tests are in `test/integration/`
   - Mock data and utilities are in `test/mocks/`

2. **Running Tests**

   ```bash
   # Run unit tests
   npm run test:unit

   # Run tests with coverage
   npm run test:coverage

   # Run integration tests (requires local cluster)
   npm run test:integration
   ```

3. **Testing with a Real Cluster**

   The project uses three main services for testing:

   - RPC Node (default: http://127.0.0.1:8529)
   - Faucet Service (default: http://127.0.0.1:8527)
   - Cometa Service (default: http://127.0.0.1:8528)

   Configure your environment in `test/testEnv.ts` or use environment variables:

   ```bash
   export RPC_ENDPOINT="http://localhost:8529"
   export FAUCET_SERVICE_ENDPOINT="http://localhost:8527"
   export COMETA_SERVICE_ENDPOINT="http://localhost:8528"
   ```

   Integration tests demonstrate real-world usage:

   - `test/integration/bounce.test.ts`: Tests message bouncing
   - `test/integration/call.test.ts`: Tests contract interactions
   - `test/integration/deploy.test.ts`: Tests contract deployment
   - `test/integration/faucet.test.ts`: Tests faucet operations
   - `test/integration/tokens.test.ts`: Tests token operations

4. **Writing Tests**
   - Place unit tests next to the code they test
   - Use descriptive test names
   - Follow the Arrange-Act-Assert pattern
   - Mock external dependencies using `MockTransport`
   - Use the provided test utilities and constants

## Building and Bundling

The project uses Rollup for bundling. Configuration is in the `rollup` directory:

```bash
# Build the project
npm run build
```

Output formats:

- CommonJS (cjs)
- ES Modules (esm)
- TypeScript definitions (d.ts)

## Submitting Changes

### Creating a Pull Request

1. Create a new branch for your changes:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them using conventional commits

3. Push your changes and create a pull request

4. Ensure all tests pass and the code follows our style guidelines

## Contribution Workflow

### Before Starting

1. **Check Existing Issues**

   - Search through existing issues to see if your problem/idea has already been reported/proposed
   - If you find a related issue, add your information to the existing discussion

2. **Create an Issue First**

   - For bug fixes, create an issue describing the bug
   - For new features, create a feature request issue
   - For documentation improvements, create a documentation issue
   - Wait for maintainers' feedback before starting work

### Working on Issues

1. **Claim the Issue**

   - Comment on the issue that you'd like to work on it
   - Wait for assignment from maintainers
   - Reference the issue number in your PR

2. **Creating a Branch**

   ```bash
   # For features
   git checkout -b feature/issue-number-short-description

   # For bugs
   git checkout -b fix/issue-number-short-description

   # For documentation
   git checkout -b docs/issue-number-short-description
   ```

3. **Work in Progress**
   - Make regular commits following our commit message convention
   - Keep changes focused on the issue at hand
   - Add tests for new functionality
   - Update documentation as needed

### Pull Request Process

1. **Before Submitting**

   - Ensure all tests pass locally
   - Update relevant documentation
   - Create a changeset if needed (`npm run changeset`)
   - Rebase on latest main if needed

2. **Submitting**

   - Fill out the PR template completely
   - Link the related issue(s)
   - Add labels if applicable
   - Request review from maintainers

3. **Review Process**

   - Address review feedback
   - Keep the PR updated with main
   - Be responsive to questions and comments

4. **After Merge**
   - Delete your branch
   - Close related issues
   - Help verify the changes in the next release

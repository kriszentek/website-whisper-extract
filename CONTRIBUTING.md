
# Contributing to Website Whisper

Thank you for considering contributing to Website Whisper! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/website-whisper.git`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Development Workflow

### Branch Naming

- Use descriptive branch names that reflect the purpose of your changes
- Prefix branches with:
  - `feature/` for new features
  - `fix/` for bug fixes
  - `docs/` for documentation changes
  - `refactor/` for code refactoring

Example: `feature/add-new-extraction-field`

### Commit Messages

Write clear, descriptive commit messages that explain the purpose of your changes:

```
feat: add support for extracting company location

- Added location field to default extraction fields
- Updated prompt template to include location context
- Added display formatting for location in results card
```

### Pull Requests

When submitting a pull request:

1. Provide a clear, descriptive title
2. Include a detailed description of the changes
3. Reference any related issues
4. Ensure all tests pass
5. Update documentation as needed

## Code Style

The project follows a consistent code style:

- Use TypeScript for type safety
- Follow the existing file and component structure
- Use functional components with hooks
- Use Tailwind CSS for styling

### Naming Conventions

- Components: PascalCase (e.g., `CustomFieldsManager.tsx`)
- Utilities and services: camelCase (e.g., `api-key-storage.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_EXTRACT_FIELDS`)

## Testing

- Test your changes thoroughly before submitting a pull request
- Consider adding automated tests for new features

## Documentation

- Update documentation when adding, changing, or removing features
- Document your code with clear comments
- Keep the API documentation up-to-date

## License

By contributing to Website Whisper, you agree that your contributions will be licensed under the project's license.

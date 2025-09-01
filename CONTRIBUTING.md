# Contributing to Hypesoft Product Management System

Thank you for your interest in contributing to the Hypesoft Product Management System! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please read and follow these guidelines to help us maintain a welcoming and inclusive community.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 20+](https://nodejs.org/)
- [Docker](https://www.docker.com/get-started)
- [Git](https://git-scm.com/)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/hypesoft-product-management.git
   cd hypesoft-product-management
   ```

## Development Setup

1. **Initial Setup**:
   ```bash
   # Using the development script
   ./scripts/dev.sh setup
   
   # Or using Make
   make setup
   ```

2. **Start Development Environment**:
   ```bash
   # Start all services
   ./scripts/dev.sh start
   
   # Or for individual services
   ./scripts/dev.sh dev-backend    # Backend only
   ./scripts/dev.sh dev-frontend   # Frontend only
   ```

3. **Run Tests**:
   ```bash
   # All tests
   ./scripts/dev.sh test
   
   # Backend only
   ./scripts/dev.sh test-backend
   
   # Frontend only
   ./scripts/dev.sh test-frontend
   ```

## Project Structure

```
├── backend/                    # .NET 9 Backend
│   ├── src/
│   │   ├── Hypesoft.Domain/   # Domain layer
│   │   ├── Hypesoft.Application/ # Application layer
│   │   ├── Hypesoft.Infrastructure/ # Infrastructure layer
│   │   └── Hypesoft.API/      # Presentation layer
│   └── tests/                 # Backend tests
├── frontend/                  # Next.js 14 Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Next.js pages
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API services
│   │   └── types/            # TypeScript types
│   └── __tests__/            # Frontend tests
├── infrastructure/           # Docker and deployment configs
├── scripts/                 # Development scripts
└── docs/                   # Documentation
```

## Coding Standards

### Backend (.NET)

- Follow [Microsoft's C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/inside-a-program/coding-conventions)
- Use Clean Architecture principles
- Implement Domain-Driven Design patterns
- All public methods must have XML documentation
- Use meaningful variable and method names in English
- Follow SOLID principles

**Example:**
```csharp
/// <summary>
/// Creates a new product with the specified details.
/// </summary>
/// <param name="request">The product creation request.</param>
/// <returns>The created product.</returns>
public async Task<ProductDto> CreateProductAsync(CreateProductRequest request)
{
    // Implementation
}
```

### Frontend (TypeScript/React)

- Follow [Airbnb's JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use TypeScript for all new code
- Implement functional components with hooks
- Use meaningful component and variable names in English
- Follow React best practices

**Example:**
```typescript
interface ProductFormProps {
  product?: Product;
  onSubmit: (product: CreateProductRequest) => void;
  isLoading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  isLoading = false,
}) => {
  // Component implementation
};
```

### Database

- Use English for all table and column names
- Follow naming conventions:
  - Tables: PascalCase (e.g., `Products`, `Categories`)
  - Columns: PascalCase (e.g., `ProductName`, `CreatedAt`)
  - Indexes: `IX_TableName_ColumnName`

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```bash
feat(products): add product filtering functionality
fix(api): resolve null reference exception in product controller
docs(readme): update installation instructions
test(products): add unit tests for product service
```

## Pull Request Process

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**:
   - Write tests for new functionality
   - Ensure all tests pass
   - Follow coding standards
   - Update documentation if needed

3. **Commit Your Changes**:
   ```bash
   git add .
   git commit -m "feat(scope): description of changes"
   ```

4. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**:
   - Use a clear and descriptive title
   - Provide a detailed description of changes
   - Link to any related issues
   - Ensure CI/CD checks pass

### Pull Request Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests have been added/updated
- [ ] All tests pass locally
- [ ] Manual testing completed

## Checklist
- [ ] Code follows the project's coding standards
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (or breaking changes documented)
```

## Testing

### Backend Testing

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **API Tests**: Test HTTP endpoints

```bash
# Run all backend tests
cd backend
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"
```

### Frontend Testing

- **Unit Tests**: Test individual components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user flows

```bash
# Run all frontend tests
cd frontend
npm test

# Run with coverage
npm test -- --coverage
```

### Test Coverage

Maintain minimum test coverage:
- Backend: 80%
- Frontend: 70%

## Documentation

### Code Documentation

- **Backend**: Use XML documentation comments
- **Frontend**: Use JSDoc comments
- **README**: Keep README files updated
- **API**: Swagger/OpenAPI documentation

### Documentation Updates

When contributing, ensure you:

1. Update relevant README files
2. Add/update API documentation
3. Update architecture diagrams if needed
4. Add examples for new features

## Development Workflow

### Daily Development

1. **Pull Latest Changes**:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create Feature Branch**:
   ```bash
   git checkout -b feature/new-feature
   ```

3. **Develop and Test**:
   ```bash
   # Make changes
   ./scripts/dev.sh test  # Run tests
   ```

4. **Commit and Push**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

### Release Process

1. **Version Bump**: Update version numbers
2. **Changelog**: Update CHANGELOG.md
3. **Testing**: Full test suite execution
4. **Documentation**: Update release documentation
5. **Tag Release**: Create git tag
6. **Deploy**: Deploy to staging and production

## Getting Help

If you need help or have questions:

1. **Documentation**: Check existing documentation
2. **Issues**: Search existing GitHub issues
3. **Discussions**: Use GitHub Discussions for questions
4. **Contact**: Reach out to maintainers

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- GitHub contributors section

Thank you for contributing to the Hypesoft Product Management System! 🚀

# Contributing to Barrits

Thank you for considering contributing to Barrits! We welcome contributions from the community.

## How to Contribute

### Reporting Issues
- Use the [issue tracker](https://github.com/zuccadev-labs/Barrits/issues) to report bugs or request features
- Please check if the issue already exists before creating a new one
- Include as much detail as possible, including steps to reproduce for bugs

### Pull Requests
1. Fork the repository
2. Create a new branch from `main`: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Ensure your code follows our style guidelines (we use Prettier and ESLint)
5. Add tests for any new functionality
6. Ensure all tests pass: `npm test`
7. Commit your changes: `git commit -m 'feat: add amazing feature'`
8. Push to the branch: `git push origin feature/amazing-feature`
9. Open a Pull Request against the `main` branch

### Development Setup
```bash
# Clone the repository
git clone https://github.com/zuccadev-labs/Barrits.git
cd Barrits

# Install dependencies
npm ci

# Run tests
npm test

# Run type checking
npm run typecheck

# Build the project
npm run build
```

### Code Style
- We use [Prettier](https://prettier.io/) for code formatting
- We use [ESLint](https://eslint.org/) for code quality
- Husky hooks are set up to run lint-staged on pre-commit
- Please ensure your code passes all checks before submitting a PR

### Commit Messages
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding or modifying tests
- `chore:` for maintenance tasks
- `perf:` for performance improvements
- `ci:` for CI/CD changes

### Testing
- All new features should include tests
- Unit tests are located alongside the source code or in `__tests__` directories
- Run tests with `npm test`
- We aim for high test coverage to ensure reliability

### Documentation
- User-facing documentation is in the `/docs/users/` directory
- Developer documentation is in the `/docs/development/` directory
- Please update documentation when adding or changing features

### License
By contributing to Barrits, you agree that your contributions will be licensed under the MIT License.

## Getting Help
If you need help, please:
- Check the existing documentation
- Look through existing issues
- Ask in the discussions section
- Reach out to maintainers

Thank you for contributing to Barrits!

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

mehdown is a Markdown parser with enhanced features used on the forums at meh.com. It extends markdown-it with custom plugins to support embeds from popular platforms, emoji, BBCode tags, and interactive commands.

## Development Commands

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run coveralls

# Run a specific test file
npx mocha test/plugins/youtube.js

# Run tests matching a pattern
npx mocha test/**/*.js --grep "emoji"
```

### Linting
```bash
# Run ESLint
npx eslint .

# Fix auto-fixable issues
npx eslint . --fix
```

## Architecture

### Core Structure
- **lib/index.js**: Main entry point containing the render function and command implementations
- **lib/plugins/**: Individual plugin modules for different embed types and features
- **test/**: Mirror structure of lib/ with corresponding test files
- **data/**: JSON data files for emoji mappings

### Plugin System
The codebase uses markdown-it as the base parser and extends it with custom plugins. Each plugin in `lib/plugins/` handles a specific type of content transformation:

- URL embeds (YouTube, Twitter, Instagram, etc.)
- Image processing with size detection
- Emoji conversion (shortnames and unicode)
- BBCode tag support
- Command processing (e.g., /cowsay, /flip)

### Key Implementation Patterns

1. **Plugin Registration**: Plugins are registered in lib/index.js using markdown-it's `use()` method
2. **Async Processing**: The main render function uses async.parallel() for operations like image size detection
3. **Command Handling**: Commands are processed before markdown parsing through regex pattern matching
4. **BBCode Processing**: BBCode tags are converted to markdown before the main parsing phase

### Testing Approach
- Uses Mocha as the test framework
- Tests are organized to mirror the source structure
- Each plugin has its own test file
- Coverage reporting via nyc and Coveralls

## ESLint Configuration
The project uses flat config format (eslint.config.js) with:
- ECMAScript 2020
- Single quotes, semicolons required
- No trailing spaces
- Brace style: 1tbs
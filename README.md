# BornoCode

### A Bengali-Inspired Programming Language & Interactive Learning Platform

**Write code. Learn programming. Think in BornoCode.**

BornoCode is a beginner-friendly, dynamically typed programming language inspired by Bengali terminology and designed to make programming more approachable. Powered by a **C++17 tree-walking interpreter**, BornoCode provides a complete browser-based programming environment where users can write, execute, and experiment with code without installing a local development environment.

The project combines a custom programming language, an interactive online playground, structured documentation, guided lessons, and programming games into one learning platform.

---

## Homepage Preview

![BornoCode Homepage](./docs/images/homepage.png)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Running the Project](#running-the-project)
- [BornoCode Language](#bornocode-language)
- [Interpreter Architecture](#interpreter-architecture)
- [Execution API](#execution-api)
- [Security and Execution Limits](#security-and-execution-limits)
- [Testing](#testing)
- [Project Status](#project-status)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Traditional programming languages often introduce beginners to unfamiliar English-based syntax and terminology. BornoCode explores an alternative approach by incorporating Bengali-inspired keywords into a programming language while retaining familiar programming concepts.

The project is built around three main objectives:

1. **Accessibility:** Make programming concepts more approachable through Bengali-inspired syntax.
2. **Interactivity:** Allow users to write and execute programs directly in their browser.
3. **Learning:** Combine documentation, guided lessons, examples, and practice games to support beginners.

BornoCode is not simply a syntax-highlighting editor. It includes its own interpreter, language rules, execution pipeline, and learning environment.

---

## Key Features

### 1. Interactive Playground

A browser-based coding environment for writing and executing BornoCode programs.

- Syntax-highlighted code editor.
- Built-in example library.
- Run programs directly from the browser.
- Keyboard shortcut support (`Ctrl + Enter`).
- Standard input (stdin) support.
- Structured output and error panels.
- Execution information and line-numbered errors.

### 2. Documentation

A dedicated documentation section covering the language and its functionality.

- Getting Started guide.
- Language keyword reference.
- Built-in function reference.
- Syntax and usage explanations.
- Examples for learning language fundamentals.

### 3. Guided Learning

A structured learning environment designed for beginners.

- 7 guided lessons.
- 3 learning modules.
- Runnable code examples.
- Built-in quizzes.
- Progressive introduction to programming concepts.

### 4. Programming Games

Interactive mini-games that make learning more engaging.

| Game | Description |
|---|---|
| Keyword Master | Practice and recognize BornoCode keywords. |
| Guess the Output | Predict the output of a given program. |
| Bug Hunter | Identify and correct programming mistakes. |

### 5. Sandboxed Code Execution

Programs execute separately from the Next.js application process.

- Separate interpreter process.
- Temporary working directories.
- Execution timeout.
- Memory and output restrictions.
- Request rate limiting.
- Optional containerized execution service.

### 6. User Interface

- Responsive interface.
- Dark and light themes.
- Dedicated pages for learning, documentation, games, and playground.
- Consistent navigation and layout.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| C++17 | Core interpreter implementation |
| Next.js | Web application framework |
| React | Frontend components and interactions |
| JavaScript | Application logic and API integration |
| CSS | Styling and responsive interface |
| Node.js | Backend execution and process management |
| Docker | Optional containerized execution environment |

---

## Project Architecture

BornoCode follows a modular architecture that separates the language interpreter, frontend application, and execution infrastructure.

```text
BornoCode/
│
├── interpreter/
│   ├── bornocode.cpp
│   ├── bornocode.h
│   ├── LANGUAGE.md
│   ├── bin/
│   │   └── bornocode.exe
│   └── tests/
│
├── execution-service/
│   ├── server.mjs
│   ├── Dockerfile
│   └── README.md
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── execute/
│   │   ├── playground/
│   │   ├── docs/
│   │   ├── learn/
│   │   ├── games/
│   │   └── about/
│   │
│   ├── components/
│   │   ├── editor/
│   │   ├── docs/
│   │   ├── learn/
│   │   └── games/
│   │
│   └── lib/
│       ├── bornocode.js
│       ├── examples.js
│       ├── lessons.js
│       └── games.js
│
├── public/
├── docs/
│   └── images/
│       └── homepage.png
│
├── package.json
├── next.config.mjs
└── README.md
```

*The tree illustrates the main project structure; individual files may vary as development continues.*

### Architecture Overview

```text
        User
         |
         v
   Next.js Frontend
         |
         v
   Code Playground
         |
         v
   Execute API
   /api/execute
         |
         v
   Execution Manager
         |
         v
   C++ Interpreter
         |
         v
   Program Output
         |
         v
   Browser Output Panel
```

The application supports two execution modes:

- **Local mode:** The API executes the locally built interpreter binary.
- **Service mode:** The API forwards execution requests to the standalone execution service.

---

## Getting Started

Follow these instructions to run BornoCode locally.

### Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- A C++17-compatible compiler:
  - GCC
  - Clang
  - MSVC

**Windows users:** MSYS2 UCRT64 GCC is supported by the interpreter build script. The `CXX` environment variable can be used to specify a compiler explicitly.

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd BornoCode
```

Replace `<YOUR_REPOSITORY_URL>` with the actual Git repository URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Interpreter

```bash
npm run build:interpreter
```

This compiles the C++17 interpreter and generates the executable inside:

```text
interpreter/bin/
```

On Windows, the expected executable is:

```text
interpreter/bin/bornocode.exe
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open the Application

Visit:

```text
http://localhost:3000
```

You can now explore the playground, documentation, lessons, and programming games.

---

## Running the Project

The following npm commands are available:

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Creates a production build of the web application. |
| `npm run lint` | Runs ESLint checks. |
| `npm run build:interpreter` | Compiles the C++ interpreter. |
| `npm run test:interpreter` | Runs interpreter regression tests. |

**Important:** Build the interpreter before using the local execution mode of the playground.

---

## BornoCode Language

BornoCode is a dynamically typed programming language with Bengali-inspired keywords.

### Language Characteristics

- Dynamically typed values.
- Number, string, and boolean data types.
- Conditional statements.
- Looping structures.
- Built-in functions.
- Standard input and output support.
- Comments and expression evaluation.

### Core Keywords

| BornoCode Keyword | Meaning |
|---|---|
| `jodi` | If |
| `nahole` | Else |
| `jotokhon` | While |
| `sotti` | True |
| `mittha` | False |

### Supported Comments

```text
// Single-line comment

# Single-line comment

/* 
   Multi-line comment
*/
```

Statements use semicolons (`;`).

For the complete and verified language syntax, built-in functions, and usage examples, see:

**[`interpreter/LANGUAGE.md`](./interpreter/LANGUAGE.md)**

---

## Interpreter Architecture

The core of BornoCode is implemented in C++17 using a tree-walking interpreter.

The interpreter is responsible for processing source code and executing the resulting program.

Its implementation is maintained in:

```text
interpreter/
├── bornocode.cpp
├── bornocode.h
└── LANGUAGE.md
```

The interpreter is compiled into a standalone executable, which is invoked by the Next.js execution API.

This separation allows the language engine to operate independently of the frontend application.

---

## Execution API

BornoCode provides a backend execution endpoint:

```http
POST /api/execute
```

### Request Body

```json
{
  "code": "YOUR_BORNOCODE_PROGRAM",
  "stdin": ""
}
```

### Response Structure

```json
{
  "stdout": "",
  "stderr": "",
  "error": null,
  "errorType": null,
  "exitCode": 0,
  "durationMs": 0
}
```

The API returns execution output, error information, exit status, and execution duration.

The frontend uses this endpoint to communicate with the interpreter.

---

## Security and Execution Limits

BornoCode includes safeguards intended to reduce the risks associated with executing user-submitted programs.

| Restriction | Limit |
|---|---:|
| Maximum source code size | 20 KB |
| Maximum stdin size | 4 KB |
| Maximum output size | 64 KB |
| Execution timeout | 5 seconds |
| Concurrent executions | 4 |
| Requests per IP | 30 runs/minute |

Execution takes place in a separate process with a temporary working directory.

An optional standalone execution service is also provided for containerized deployment.

> **Deployment note:** Process isolation and application-level limits are not equivalent to a complete security boundary. Production deployment should use appropriately restricted containers or another hardened execution environment, with resource limits and restricted permissions.

---

## Testing

BornoCode includes a regression test suite for checking interpreter behavior.

Run the tests using:

```bash
npm run test:interpreter
```

Build the interpreter before running tests if the test setup requires the compiled executable.

When adding new language features, update the relevant tests and language documentation.

---

## Project Status

BornoCode has an implemented interpreter and a working web application structure.

### Implemented Features

- [x] C++17 tree-walking interpreter.
- [x] Interpreter build script.
- [x] Interpreter regression test suite.
- [x] Next.js web application.
- [x] Browser-based playground.
- [x] Syntax highlighting and keyboard shortcuts.
- [x] Example library and stdin support.
- [x] Execution API.
- [x] Execution limits and process isolation.
- [x] Optional standalone execution service.
- [x] Documentation section.
- [x] Seven guided lessons across three modules.
- [x] Interactive quizzes.
- [x] Three programming mini-games.
- [x] Dark and light themes.
- [x] Responsive user interface.
- [x] About page.

### Planned Improvements

- [ ] Optional Monaco Editor integration.
- [ ] User authentication and accounts.
- [ ] Save and manage programs.
- [ ] Share programs through public links.
- [ ] Learning progress tracking.
- [ ] Accessibility audit and improvements.
- [ ] Expanded browser and device testing.
- [ ] Public deployment of the containerized execution service.

---

## Future Improvements

BornoCode can be expanded beyond its current implementation.

Potential future directions include:

1. **Advanced Language Features:** Functions, additional data structures, and more advanced programming constructs.
2. **Improved Developer Experience:** Better autocomplete, diagnostics, editor tooling, and debugging support.
3. **Community Features:** User accounts, shared programs, and collaborative learning.
4. **Learning Analytics:** Track lesson completion, quiz performance, and programming progress.
5. **Deployment Improvements:** A hardened, scalable execution service for public access.

These are possible development directions, not claims that the features are already implemented.

---

## Contributing

Contributions, suggestions, and feedback are welcome.

If you want to contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Make your changes.
4. Test your implementation.
5. Submit a pull request with a clear description of the changes.

For interpreter changes, please include regression tests and update the language specification when necessary.

---

## License

Add your chosen open-source license here before distributing the project publicly.

For example, if you choose the MIT License, include a `LICENSE` file containing the official MIT License text.

---

## About BornoCode

BornoCode is an exploration of how programming education can become more accessible through familiar language concepts and interactive learning experiences.

**Made to make programming more approachable, one line of code at a time.**
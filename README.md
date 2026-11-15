# BornoCode

A beginner-friendly programming language with **Bengali-inspired keywords** and a complete
browser playground — write code, click Run, see real output. No install required.

BornoCode is a small dynamically-typed language (`jodi`, `nahole`, `jotokhon`, `sotti`,
`mittha`) backed by a C++17 tree-walking interpreter, wrapped in a Next.js web app with
syntax highlighting, guided lessons and practice games.

## Features

- **Playground** — syntax-highlighted editor, example library, stdin support, structured
  output/error panels with line numbers, `.bc` download.
- **Docs** — Getting Started guide, keyword/operator reference, built-in function reference.
- **Learn** — 7 guided lessons across 3 modules with runnable examples and quizzes.
- **Games** — Keyword Master, Guess the Output, Bug Hunter — all answers verified against
  the real interpreter.
- **Sandboxed execution** — separate process, temp dir, time/memory/output limits,
  rate limiting, optional containerized runner.

## Quick start

```bash
npm install
npm run build:interpreter   # compile the C++ interpreter
npm run dev                 # http://localhost:3000
```

> **Windows:** the build script auto-detects a native compiler (MSYS2 UCRT64 `g++`) and
> skips Cygwin/MSYS `g++`, which can't produce native `.exe`s. `CXX` env var overrides.

## Project structure

```
BornoCode_Implementation_Roadmap.md   full roadmap
README.md                             this file
package.json                          scripts: dev / build / lint /
                                      build:interpreter / test:interpreter

interpreter/                          C++17 interpreter (lexer, parser, evaluator)
├── bornocode.cpp / bornocode.h        the interpreter itself (~1,470 lines)
├── LANGUAGE.md                       verified language specification
├── bin/                              compiled binary (bornocode.exe on Windows)
└── tests/                            regression suite
    ├── run-tests.mjs                 test runner
    └── cases/<name>/main.bc          each case: code + expected.json (+ stdin.txt)

execution-service/                    optional standalone HTTP runner
├── server.mjs                        POST /execute, GET /health (same contract as API)
├── Dockerfile                        multi-stage: static binary + node:alpine
└── README.md                         API docs + Docker run flags

src/
├── app/                              Next.js App Router
│   ├── page.js                       home (Hero, Features, LearningPath, ...)
│   ├── playground/page.jsx           code playground
│   ├── docs/                         docs section (layout + DocsNav sidebar)
│   │   ├── page.js                   docs index
│   │   ├── getting-started/page.js
│   │   ├── keywords/page.js
│   │   └── functions/page.js         all 28 built-ins
│   ├── learn/
│   │   ├── page.js                   lesson index (modules)
│   │   └── [slug]/page.js            lesson renderer + quiz
│   ├── games/
│   │   ├── page.js                   games catalogue
│   │   ├── keyword-master/page.jsx
│   │   ├── guess-output/page.jsx
│   │   └── bug-hunter/page.jsx
│   ├── about/page.js                 about page
│   ├── api/execute/route.js          POST /api/execute (local or proxied)
│   ├── layout.js / globals.css       root layout, theme tokens
│   └── not-found.jsx                 404 page
├── components/
│   ├── Navbar.jsx / Footer.jsx / ThemeToggle.jsx
│   ├── editor/                       CodeEditor (highlighting), Playground
│   ├── home/                         Hero, Features, LearningPath, ...
│   ├── docs/                         CodeBlock, DocsNav
│   ├── learn/LessonQuiz.jsx          lesson quiz component
│   └── games/QuizGame.jsx            shared quiz engine for all 3 games
├── lib/
│   ├── bornocode.js                  interpreter helpers, builtin/keyword lists, repo URL
│   ├── examples.js                   playground example programs
│   ├── lessons.js                    lesson content data (7 lessons + quizzes)
│   └── games.js                      game question data (verified answers)
└── scripts/build-interpreter.mjs     cross-platform compiler detection/build
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` / `npm start` | production build / serve |
| `npm run lint` | ESLint |
| `npm run build:interpreter` | compile interpreter → `interpreter/bin/` |
| `npm run test:interpreter` | run regression suite (15 cases) |
| `node execution-service/server.mjs` | standalone execution service on :8090 |

## Execution architecture

`POST /api/execute` accepts `{ code, stdin? }` → `{ stdout, stderr, error,
errorType, exitCode, durationMs }`.

- **Local mode (default):** spawns `interpreter/bin/bornocode` with fixed args, empty env,
  per-run temp dir. No shell.
- **Service mode:** set `BORNOCODE_URL` → route proxies to `execution-service/server.mjs`.
  Deploy `execution-service/Dockerfile` with `--read-only --cap-drop ALL --memory 128m`
  etc. for real isolation (see its README).

Limits: 20 KB source · 4 KB stdin · 64 KB output · 5 s timeout · 4 concurrent · 30/min/IP.

## Language

Keywords: `jodi` (if), `nahole` (else), `jotokhon` (while), `sotti` (true), `mittha` (false).
Values: numbers, strings, booleans. `;` ends statements. Comments: `//`, `#`, `/* */`.
28 built-ins (math, strings, dates, I/O) — verified spec in `interpreter/LANGUAGE.md`,
reference at `/docs/functions`.

## Status

**Done:** interpreter + build + regression tests, execution API + limits, container runner
option, About, docs, Learn (7 lessons), Games (3), dark/light theme, responsive UI.

**Remaining:** optional Monaco editor swap; accounts/community (Phase 6); deploying the
Docker execution service publicly (Docker unavailable locally); accessibility/device testing.

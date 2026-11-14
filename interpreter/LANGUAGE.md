# BornoCode language specification

This document describes what the interpreter in `bornocode.cpp` / `bornocode.h`
actually implements. It is the source of truth for the website docs, syntax
highlighting and examples. If behaviour here disagrees with the code, the code
wins — update this file.

## Program structure

- A program is a sequence of **statements**, each terminated by `;`.
- Blocks use `{` and `}` and do not need a trailing semicolon.
- Statements may span multiple lines freely.
- In the interactive shell a missing final `;` is forgiven; in a `.bc` file it
  is not.

## Comments

| Style | Example |
|---|---|
| Line | `// comment` or `# comment` |
| Block | `/* comment, can span lines */` |

## Keywords

| Keyword | Meaning |
|---|---|
| `jodi` | if |
| `nahole` | else |
| `jotokhon` | while |
| `sotti` | true |
| `mittha` | false |

## Values

- **Number** — integer or decimal: `42`, `3.14`, `-7`. Internally a double.
- **String** — single or double quotes: `"hello"`, `'hello'`. Escape sequences
  follow the usual `\n`, `\t`, `\"`, `\\` rules.
- **Bool** — `sotti` / `mittha`.
- **Nil** — the empty value, produced by statements like `dekhao()`; printed as
  `nil`.

Truthiness: `nil` and `0` and `""` and `mittha` are false; everything else is
true.

## Variables

Created by assignment; there is no declaration keyword.

```bc
name = "Borno";
age = 5;
```

Using an undefined variable is a runtime error:
`BornoCode Error (line N): Undefined variable 'x'`.

## Operators

Precedence, loosest to tightest:

| Level | Operators |
|---|---|
| lowest | `||` |
| | `&&` |
| | `==` `!=` |
| | `<` `<=` `>` `>=` |
| | `+` `-` |
| | `*` `/` `%` |
| highest | unary `!`, unary `-` |

- `=` is assignment, **not** comparison. Comparison uses `==`.
- `+` adds numbers **and** concatenates when either side is a string:
  `"a" + "b"` → `"ab"`, `"n=" + 5` → `"n=5"`. Other string joining uses
  `jukto()`.
- Comparisons and logic return booleans (`sotti`/`mittha`).
- Parentheses group expressions: `(a + b) * 2`.

## Statements

```bc
// expression statement (usually a function call)
dekhao("hi");

// assignment
x = jog(2, 3);

// condition
jodi (x > 5) {
    dekhao("big");
} nahole {
    dekhao("small");
}

// loop
i = 1;
jotokhon (i <= 5) {
    dekhao(i);
    i = jog(i, 1);
}

// bare block
{
    dekhao("inside");
}
```

`jodi` requires parentheses around the condition. `nahole` is optional and binds
to the nearest `jodi`. There is no `else if` keyword — nest `jodi` inside
`nahole` instead (see the conditions example).

## Built-in functions

All 28 builtins (see `../src/lib/bornocode.js` and `/docs/functions` on the
website). Highlights:

- `dekhao(...)` — prints arguments separated by spaces, then a newline. Accepts
  any number of arguments of any type.
- `nite(prompt?)` — prints the optional prompt, reads one line of stdin, trims
  it, and returns a **number** if it looks numeric, otherwise a **string**.
- `ber(code?)` — exits the program immediately with the given code (default 0).
- `vag(a, 0)` raises `Division by zero in vag()` — guard it yourself.
- `rakho(key, value)` / `tule(key)` — in-memory/file-backed storage within a
  single run.
- Fun functions: `nach()`, `hash()`, `gaan(text)`, `rong(color, text?)`,
  `chinho(name)`.

## Errors

All errors are reported as:

```
BornoCode Error (line N): <message>
```

with exit code 1. Common messages: `Undefined variable 'x'`,
`Expected an expression, found ...`, `Unterminated string`,
`Division by zero in vag()`. Line numbers are 1-based; column numbers are not
currently reported.

## Execution limits (web playground)

- Source size: 20 KB
- Stdin size: 4 KB
- Output: 64 KB
- Timeout: 5 seconds
- 4 concurrent runs, 30 runs/minute per IP

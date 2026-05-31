# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

한랭(han-lang) is a Korean-syntax programming language with a browser-based IDE. The goal is to let beginners code in natural Korean before transitioning to other languages. The project is a Next.js 14 web app deployed to GitHub Pages.

## Commands

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
npm run lint      # ESLint check
npm run deploy    # Build + export + push to gh-pages (destructive — confirm before running)
```

## Architecture

### Language Engine (`components/core/`)

The compiler pipeline is scaffolded but mostly unimplemented:

1. **`compiler/parser.tsx`** — Lexer (`lexar`) + Parser; tokenizes Korean source
2. **`compiler/transformer.tsx`** — AST transformer (`Transformner` — note the typo)
3. **`interpreter/interpreter.tsx`** — Executes transformed AST
4. **`hanlang.tsx`** — Entry point exposing `run(code)` and `review(code)` functions

### IDE UI (`components/main/`)

- **`editor.tsx`** — Textarea-based code editor with line numbers, Tab key handling, and cursor tracking. Uses `codeState` from Recoil.
- **`terminal.tsx`** — Output panel (stub)

### State (`states/`)

- **`states.tsx`** — URL prefix atoms (`prefixState`, `relativePrefixState`) for dev/prod path switching
- **`codeStates.tsx`** — `codeState` atom holding the current editor content (referenced by editor but file not yet in repo at time of writing)

### Routing (`src/app/`)

App Router layout wraps all pages in `RecoilRootWrapper`, `Header`, and `Footer`.

- `/` — Main IDE page (Editor + Terminal side by side)
- `/docs` — Documentation viewer with sidebar
- `/log` — Dev log page

## Language Syntax Design

The target syntax (from `log/02_howto.md`):

```
사과는 3 이다.           // variable declaration & init
자두가 있다.             // declaration only
(사과)를 출력한다.       // print variable
("Hello!")를 출력한다.   // print string literal
("%d\n", 사과)을 출력한다. // printf-style formatting

만약 (사과 < 10) 라면    // if
    ...

(인덱스 < 10) 동안       // while loop
    인덱스 = 인덱스 + 1
```

Key rules: indentation marks blocks; Korean particles (조사: 를/을/은/는/가/이) are ignored by the compiler; arithmetic operators use symbols (`+`, `-`, `*`, `/`); string escapes use backslash.

## Deployment

The app deploys to `https://hangeol-chang.github.io/han-lang` via `git subtree push --prefix out origin gh-pages`. The `states/states.tsx` atoms switch base URLs between dev (`""`) and production (`/han-lang`) automatically.

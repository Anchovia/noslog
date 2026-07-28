# AGENTS.md

## Product

This project implements NosLog, a NOSTALGIA records/ranking/archive app.

NosLog is the service and project name. NOSTORY is the name of the design
reference, and NOSTALGIA is the game covered by the service.

## Design Source

Primary design:
https://www.figma.com/design/MigCZljcnwEdJF2JhnjKcj/Nostory?node-id=3-3

Use frame `3:3`, named `NOSTORY 와이어프레임 정리`.

Sections:

1. Home
2. Music list
3. Music detail
4. Rankings
5. Data sync guide
6. Tiers
7. Bingo
8. Profile
9. Login
10. Exams
11. Style guide

## Implementation Rules

- Do not redesign the UI.
- Preserve the dark NOSTORY visual direction.
- Use the existing project stack, components, routing, and styling conventions.
- Treat the Figma as a wireframe/source of layout intent, not pixel-perfect final artwork.
- Implement mobile-first around the 390px layouts shown in Figma.
- Reuse existing components before creating new ones.
- Keep changes scoped and verifiable.
- Run lint/typecheck/build after implementation if the project provides those commands.

## Requirement Clarity and Planning

This is the most important working rule for this project:

- Do not make ambiguous product, design, or behavior decisions based on assumptions.
- Before implementation, inspect the relevant code and current UI and identify every
  unresolved requirement that could materially change the result.
- Ask the user all necessary questions and continue the discussion until there are no
  meaningful uncertainties left.
- Do not start implementation while important requirements or expected behavior remain
  unclear.
- Agree with the user on a concrete implementation plan before making code changes.
- First investigate questions that can be answered from the repository, current UI,
  existing tests, or project documentation. Do not make the user answer facts that can
  be discovered directly.
- Actively find relevant references, including existing project patterns, the Figma
  source, official documentation, and suitable comparable examples.
- Share useful reference findings, possible approaches, and meaningful tradeoffs with
  the user so the direction can be decided together before implementation.
- References should inform the implementation without overriding the existing NosLog
  design direction or established project conventions.
- Once the requirements and plan are clear, proceed with the implementation and handle
  debugging autonomously through verification.

## Working Process

- Before editing, check the repository status and inspect existing changes.
- Preserve the user's existing changes and do not modify or revert unrelated files.
- When repository freshness matters, inspect the current branch and upstream state
  without performing pull, merge, rebase, reset, or other history-changing operations.
- Implement UI work in small, reviewable units.
- After changing one meaningful UI unit, verify it in the test browser before moving to
  the next unit.
- Prefer the user's already running `http://localhost:3000` development server instead
  of starting a duplicate server.
- If authentication is required for testing, ask the user to sign in instead of trying
  to bypass authentication.
- For responsive UI, verify both narrow mobile layouts and appropriate desktop widths.
- Do not treat lint or typechecking as a substitute for testing the actual UI and
  interaction in the browser.
- Investigate test failures and distinguish pre-existing failures from failures caused
  by the current change.
- Own debugging from root-cause investigation through the fix and final verification.

## Git Ownership

- The user owns commits, pushes, branch creation or switching, and pull requests.
- Do not commit, push, create or switch branches, or create pull requests unless the
  user explicitly changes this rule for a specific task.
- At completion, report the changed scope, verification results, remaining caveats, and
  a recommended commit title.

## Product and Audio Boundaries

- Keep audio files local to the user's browser; do not upload MP3 files to the NosLog
  server or database.
- Preserve NosLog's records, rankings, archive, chart editor, and chart viewer focus.
- Keep responsive chart visualizations readable based on their actual display area
  rather than relying only on fixed pixel sizes.

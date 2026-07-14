# AGENTS.md

## Product

This project implements NOSTORY, a NOSTALGIA records/ranking/archive app.

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

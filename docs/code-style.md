# NosLog code style

This document defines the approved code-organization and authoring rules for
NosLog. The conventions were adapted from the shared strengths of the
Jeongbiseo and Fit-again frontends, while preserving Next.js App Router,
NosLog's existing runtime contracts, and the chart viewer/editor boundary.

## Principles

- Keep route entry files small and move reusable domain behavior behind a clear
  feature boundary.
- Prefer one runtime schema as the source for both validation and inferred
  TypeScript types.
- Normalize data at API and Server Action boundaries. Components consume domain
  data instead of repeatedly interpreting transport envelopes.
- Use native `fetch` for HTTP. Axios is not part of the NosLog stack.
- Make migrations feature by feature. Do not perform a repository-wide move
  without verifying every import, route, test, and external consumer.
- Preserve the existing chart viewer and chart editor in their entirety.

## Directory responsibilities

```text
app/                      # routes, layouts, Route Handlers, Server Action entry points
features/<domain>/
  api/                    # browser request functions and TanStack Query options
  components/             # reusable domain UI
  hooks/                  # domain hooks
  schemas/                # Zod schemas and inferred input/output types
  server/                 # server-only domain orchestration
  types/                  # types not derived from a runtime schema
components/ui/            # shared Radix/shadcn-style UI primitives
components/layout/        # application-wide layout
lib/                      # cross-domain infrastructure
tests/                    # Vitest tests
```

`app/` remains the routing authority. A route-local helper may stay beside its
page when no other route imports it. Code moves to `features/<domain>/` when it
is reused, owns domain behavior, or needs an independently testable boundary.
Do not add a `src/` wrapper solely to resemble a Vite project.

## Naming and imports

- React components and component types use PascalCase.
- Functions, hooks, values, and files use camelCase. Hooks begin with `use`.
- Zod values end in `Schema`; form types use `<Feature>FormValues`.
- Use `@/` absolute imports across directories and relative imports only within
  a tightly coupled local folder.
- Use `import type` for symbols erased at runtime.
- Avoid barrel files unless they provide a deliberate public feature API.

Formatting is controlled by Prettier. Do not manually align code against its
output. ESLint owns code-quality rules; Prettier owns formatting rules.
The existing type-import rule is enforced by ESLint for `features/**/*.{ts,tsx}`.
Shared UI, Storybook, and tooling imports/exports are automatically sorted by
`eslint-plugin-simple-import-sort`. Parent-relative imports in `features/` and
`components/ui/` are rejected; imports within a local folder remain relative.
This scoped check does not migrate or change the preserved chart viewer/editor.
Application code may use `console.warn` and `console.error` when appropriate;
prefer the structured observability helper for server failures. CLI imports,
maintenance scripts, and server synchronization progress jobs may use console
output because it is their operator-facing interface.

## Dependency boundaries

ESLint's `noslog/boundaries` rule checks imports, re-exports, and literal dynamic
imports, resolving both `@/` aliases and relative paths.

- `app` composes features, UI, and infrastructure. Private route folders remain
  within their owning route. Features cannot import route pages or data helpers.
- Features may call other domains' explicit services or consume their stable
  schemas/types. NosLog domains are not FSD action slices; a blanket ban on
  cross-domain imports does not apply. Do not reach into another domain's local
  implementation just to avoid defining a clear reusable contract.
- Features may import real module-level `"use server"` Server Actions from `app`.
  This Next.js entry-point exception does not allow importing route UI or queries.
- `lib` must not import runtime behavior from `app`, `features`, or `components`.
- `components/ui` must not import `app` or feature behavior. The existing exam
  badge's grade helper and AppToaster's account notice adapter are explicit,
  file-and-target-specific exceptions in the rule. They do not create permission
  for more domain imports in new UI primitives.
- The existing `lib/music/maxGrade`, `unlockCondition`, and `scoreTone` imports of
  UI types remain type-only exceptions. Runtime imports on those paths fail lint.
- Client Components cannot directly import feature server services or modules
  marked `server-only`; type-only imports and Server Actions remain valid.
  Next.js build-time server/client checks also protect indirect imports.
- Keep deliberate public APIs small. Separate server entry points when needed;
  do not add a barrel solely to hide a dependency or collect every UI export.

The profile public cache is owned by `features/profile/server/publicProfileData`.
The existing route data module re-exports it for compatibility; its cache keys,
visibility policy, and query behavior remain unchanged.

## Shared UI and Storybook

Use the [shared UI guide](./ui/README.md) for component selection, Props examples,
token aliases, and story authoring. New or changed shared UI must include stories
for its supported states and meaningful interaction tests where applicable.
Existing untouched components may receive stories incrementally.

`npm run test:storybook` runs Chromium component and accessibility tests separately
from the Node unit suite. `npm run build-storybook` verifies the standalone UI
documentation. Both run in CI, without DB-backed application flows.
Preserve approved typography classes and existing UI dimensions when using
`nl`-namespaced Tailwind aliases. Commit and PR rules live in
[CONVENTION.md](./CONVENTION.md).

## API contracts

New internal Route Handlers use the discriminated `ApiResponse<T>` envelope:

```ts
type ApiResponse<T> =
    | {
          isSuccess: true;
          code: string;
          message: string;
          result: T;
      }
    | {
          isSuccess: false;
          code: string;
          message: string;
          result: null;
          fieldErrors?: Record<string, string[]>;
      };
```

- Create envelopes with `createApiSuccess` and `createApiFailure`.
- Browser request functions call `readApiResponse`; components receive `T` or a
  typed `ApiError`.
- Server Components call server services directly instead of fetching their own
  Route Handlers.
- TanStack Query owns client request caching. Query keys and request functions
  live under `features/<domain>/api/`.
- HTTP status remains meaningful. The envelope does not replace status codes.
- Do not silently change an existing external contract. The bookmarklet sync,
  health checks, OAuth, webhooks, and other external consumers require a
  compatibility audit or a versioned endpoint before migration.

## Server Actions

Server Actions use `ActionResult` rather than the HTTP `ApiResponse` envelope.
They return a discriminated `success` result, a localized user-facing message,
and optional field errors. Actions that redirect may return only failure states
before `redirect()`.

Keep database access and authorization on the server. Never trust values merely
because React Hook Form already validated them in the browser.

## Zod

- Put reusable schemas under `features/<domain>/schemas/`.
- Infer types from the schema instead of duplicating interfaces.
- Use `z.input<typeof schema>` for raw form values and
  `z.output<typeof schema>` for parsed values when transforms or coercion make
  them different.
- Use `superRefine` for rules involving more than one field.
- Keep request conversion in a named mapper when the form shape differs from the
  server input.
- Test required fields, boundaries, transforms, and cross-field rules.
- NosLog supports Korean, Japanese, and English. Do not add a Korean-only schema
  message to shared user UI. Use a schema factory receiving the current
  translator, or map stable validation codes to localized copy.
- Validate the same schema again at every server boundary.

## React Hook Form

- Always provide `defaultValues`.
- Use `register` for native uncontrolled inputs.
- Use `Controller` only for controlled components such as Radix Select or custom
  composite inputs.
- Use `useWatch` for reactive field subscriptions instead of broad `watch()`
  calls.
- Keep submission orchestration in a named handler and display server failures
  through root or field errors.
- Use `applyFormFieldErrors` for typed Server Action field errors.
- Set `noValidate` on forms when browser-native messages would conflict with the
  localized Zod/RHF error experience.

## State and data fetching

- Prefer Server Components for initial server data.
- Use TanStack Query for asynchronously changing server state in Client
  Components, including caching, retries, and request state.
- Use Zustand only for genuine cross-route or cross-component client state.
- Keep local presentation state in React state.
- Do not duplicate the same server response in Zustand and TanStack Query.

## Verification and migration

Every migrated feature must pass the relevant tests plus:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Before committing, Husky and lint-staged format staged files and apply safe
ESLint fixes. The pre-push hook runs tests, typechecking, and linting. A warning
must still be reviewed; it is not evidence that the code is acceptable.

During gradual migration, a legacy directory may coexist with a new feature
directory. Remove the legacy file only after all imports, tests, and runtime
consumers have moved. Do not use code-style cleanup as authorization to change
product behavior, visual design, external API contracts, or database data.

Passing static checks does not mean every feature has completed browser
verification. Report the actual checks and any unverified runtime conditions.

## Feature view and connection boundaries

Complex forms may keep rendering/local validation in a feature View and connect
Server Actions, uploads, queries and navigation in a small adapter. A View gets
typed callbacks/data; it does not replace server validation or authorization.
Use the real View in feature stories with local mocks. Keep existing public entry
points and product states; do not split every component preemptively.

Guard form submission before asynchronous validation, rather than relying only on
the submit button's busy state. Ignore obsolete asynchronous results using input
revision or view lifetime. An ignored response does not cancel a completed server
write. Preserve fields/files on failure and document callback/ref/state contracts
in the [UI contracts](./ui/contracts.md).

# missio

Web app that helps school students in Kazakhstan (grades 8–11) find grants, exchanges,
olympiads and summer schools they are actually eligible for, and keep track of deadlines.

Live: https://poam.me

## What it does

- **Program database** — ~580 programs (`lib/programs-data.ts`) with type, country, grade range,
  required English level (CEFR), deadline and tags.
- **Matching** — `POST /api/match` sends the student profile and a trimmed list of programs to an
  LLM, which returns a 0–100 fit score per program with reasons and warnings
  (gaps in eligibility, tight deadlines). Results are cached in `match_cache`.
- **Deadline alerts** — `POST /api/alert/generate` writes a short personal reminder; tone depends
  on how close the deadline is.
- **Program import** — `POST /api/programs/parse` turns a pasted program announcement into a
  structured record, so new programs can be added without manual data entry.
- **Chat** — `POST /api/chat`, an assistant that answers questions about programs and documents
  using the student's profile as context.
- **Organisations** — schools and program operators can post programs and see applicants
  (`app/org`).

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind, Supabase (Postgres + auth),
Anthropic and Azure OpenAI APIs, zod, framer-motion.

## Data model

`supabase/migrations/001_initial.sql`:

```
students ──< matches >── programs >── organizations
    │                        │
    ├──< applications >──────┘
    └──< alerts
match_cache
```

## Running locally

```bash
npm install
npm run dev
```

`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_DEPLOYMENT=
AZURE_API_VERSION=
```

Apply the schema with `supabase db push` or by running the migration in the Supabase SQL editor.

## Layout

```
app/
  api/            match, chat, alert, program parsing
  dashboard/      student dashboard: matches, deadlines, applications, chat
  org/            organisation side
  programs/       public program catalogue
components/       landing, dashboard and UI components
lib/              API clients, program data, types
supabase/         SQL migrations
```

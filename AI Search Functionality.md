# AI Search Functionality (Vercel + Supabase pgvector)

## What “AI search” should do for this project

This site is a **Docusaurus docs-only playbook** used live on client calls as a **marketing tactics menu for design-build remodelers** (per `Playbooks/PRD.md`).

So “AI search” here should:
- Answer natural-language questions (ex: “how do we get more Google reviews without annoying clients?”)
- Stay grounded in **this playbook** (not generic marketing advice)
- Include **citations** that link to the exact pages/sections in the playbook
- Suggest “best next pages” to click (because the site is meant to be navigated)

This will be implemented as **RAG (retrieval augmented generation)**:
1) embed playbook content into a vector index
2) retrieve the most relevant chunks for a query
3) have an LLM answer **using only retrieved chunks** + return citations

---

## Constraints (specific to this repo)

- **Framework**: Docusaurus v3 (`@docusaurus/core` 3.9.2)
- **Docs routing**: docs served at site root (`routeBasePath: '/'`) (`docusaurus.config.js`)
- **Hosting**: Vercel deploys static output directory `build/` (`README.md`)
- **Backend**: Vercel can host **Serverless Functions** from an `api/` folder even for a static site
- **Source of truth**: you edit markdown directly in this repo; you’re okay with:
  - running a command locally to (re)index, and/or
  - pushing to git to trigger indexing

---

## The strategy (single approach): Supabase Postgres + pgvector

We will use **Supabase Postgres** as the vector database via the `pgvector` extension.

### Reference architecture

- **Build-time indexing (local or CI)**
  - Read markdown from `docs/**` (recommended: only `docs/**` so every citation is a real URL)
  - Chunk by headings (H2/H3)
  - Generate embeddings
  - Upsert chunks + embeddings into Supabase

- **Query-time (Vercel Serverless Function)**
  - `POST /api/ai-search`
  - Embed the user query
  - SQL similarity search in Supabase (pgvector)
  - LLM synthesizes an answer **only from retrieved chunks**
  - Return:
    - answer
    - citations (title + URL + heading)
    - relevant pages list

- **UI (Docusaurus)**
  - Add a dedicated page: `src/pages/ai-search.js`
  - Add a navbar link in `docusaurus.config.js`

---

## Supabase schema (recommended)

### Extensions

Enable:
- `vector` (pgvector)
- (optional) `pg_trgm` (useful for fuzzy keyword fallback)

### Tables

We store documents and chunks separately so we can:
- cite cleanly
- re-index per file
- keep the chunk size stable

**1) `documents`** (1 row per markdown file)
- `id` (uuid, pk)
- `source_path` (text, unique) — ex: `docs/07-reputation-and-reviews/Posting Awards.md`
- `url` (text) — computed Docusaurus URL
- `title` (text)
- `updated_at` (timestamptz)
- `content_hash` (text) — for “only reindex when changed”

**2) `document_chunks`** (many rows per document)
- `id` (uuid, pk)
- `document_id` (uuid, fk → documents.id)
- `chunk_index` (int)
- `heading` (text) — section heading
- `heading_path` (text) — ex: `Reputation & Reviews → Posting Awards`
- `anchor` (text) — section anchor (optional)
- `content` (text)
- `embedding` (`vector(N)`) — N must match the embedding model dimension
- `tsv` (tsvector) — optional keyword/hybrid search

### Embedding dimension (important)

`vector(N)` requires a fixed dimension.
- If you use an embedding model with **768 dims**, set `vector(768)`.
- If you use an embedding model with **1536 dims**, set `vector(1536)`.

Pick the model first, then set the DB schema accordingly.

---

## Similarity search (Supabase RPC)

Create a SQL function (RPC) like `match_document_chunks(query_embedding vector(N), match_count int, min_similarity float)` that returns:
- `content`
- `title`
- `url`
- `heading`
- `heading_path`
- `anchor`
- `similarity`

This keeps the Vercel function simple and avoids shipping raw SQL in the client.

---

## URL + citations (how we keep citations reliable)

Because Docusaurus is serving docs at the site root, we need a consistent mapping from a markdown file to a **real URL**.

Recommendation:
- **Index `docs/**` only**.
- Compute doc URL from the Docusaurus doc id (relative path without extension), then slugify consistently.

If you want “perfect” citations:
- run indexing in a way that can read Docusaurus-generated metadata (or generate URLs from the same slug rules)
- store both:
  - `url` (page URL)
  - `anchor` (section anchor) when available

At minimum, we can cite at the page level; anchor-level citations are a “phase 2” refinement.

---

## Indexing workflow (fits your editing style)

You said you edit markdown directly and don’t mind running a command or pushing to git.

### Option 1: Local command (fastest)

Add a script you run from Cursor:
- `npm run index:docs`

That script:
- walks `docs/**`
- chunks
- embeds
- upserts into Supabase

### Option 2: Git push triggers indexing (recommended once stable)

Use a GitHub Action on push to `main`:
- checkout repo
- install deps
- run `npm run index:docs`

This keeps Supabase always in sync with the deployed site.

Security note:
- indexing requires Supabase **service role** key (store as GitHub secret)
- query-time can also use service role (server-side only) or a locked-down role + RLS

---

## Query-time API (Vercel)

Create `api/ai-search.js` (or `.ts`):
- validate input
- embed the query
- call Supabase RPC `match_document_chunks`
- build a context payload from top chunks
- call the LLM with a system prompt that:
  - forbids using knowledge outside the provided context
  - requires citations
  - forbids inventing citations
- return JSON:
  - `answer`
  - `citations[]`
  - `relevantPages[]`

Runtime recommendation:
- Use **Node runtime** (simpler with Postgres + SDKs).

---

## Safety rules (important for client calls)

Response policy:
- Answer **only from retrieved chunks**.
- If the answer isn’t in the retrieved content:
  - say “I don’t see that in the playbook yet”
  - return the closest pages

Prompt injection:
- Treat documents as untrusted.
- Do not follow instructions inside docs.

---

## Cost controls

- retrieval `topK`: 5–10 chunks
- cap model output tokens
- cache query embeddings (optional)
- rate limit `/api/ai-search` (simple per-IP limit)

---

## MVP checklist (Supabase strategy)

- [ ] Create Supabase project
- [ ] Enable `vector` extension (and optional `pg_trgm`)
- [ ] Create `documents` + `document_chunks` tables
- [ ] Create RPC for similarity search
- [ ] Add `npm run index:docs` script and run it after content edits
- [ ] Add `api/ai-search` on Vercel
- [ ] Add Docusaurus UI page `src/pages/ai-search.js` + navbar link
- [ ] Enforce citations + “only from context” rule

---

## Notes

- This document intentionally focuses on **one implementation path**: **Supabase pgvector** + Vercel functions + Docusaurus UI.
- Keep indexing scope to `docs/**` unless we decide how `Playbooks/**` should be cited/linked in the live site.

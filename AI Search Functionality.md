# AI Search Functionality (Vercel + Supabase pgvector)

## Goal (what this feature should do)

This is a **Docusaurus docs-only playbook** used live on client calls as a **marketing tactics menu for design-build remodelers** (see `Playbooks/PRD.md`).

“AI search” should:
- Answer natural-language questions using **only this playbook** (not generic marketing advice)
- Return **citations** linking to the exact playbook pages/sections
- Keep responses fast enough to use on calls
- Stay usable while you click around the playbook

We’ll implement this as **RAG**:
1) embed playbook content into a vector index (Supabase pgvector)
2) retrieve relevant chunks
3) have an LLM answer using only retrieved chunks + include citations

---

## UX spec (Assistant panel)

### Desktop/tablet

- **Entry button**
  - Fixed on the **right edge** of the screen.
  - Label: **“Assistant”**.
  - Shows a **“+”** when closed.
  - Shows an **“X”** when open.

- **Panel behavior**
  - Opening the Assistant reveals a **collapsible right-hand panel** that occupies the **entire right side (full height)**.
  - **Default width**: matches the default width of the left docs sidebar.
    - Implementation detail: use Docusaurus’ sidebar width variable (commonly `--doc-sidebar-width`) so it stays in sync.
  - The panel should **stay mounted across navigation** so:
    - chat history remains
    - any in-progress streaming response continues

- **Interaction**
  - User can ask questions and get answers with:
    - citations (page + section)
    - relevant pages list
  - Citation links open the playbook page (same tab is fine; optionally new tab).

### Mobile

- Opening Assistant becomes a **full-screen overlay/page**.
- There is an **X at the top** to close.
- Chat still persists as you navigate after closing/re-opening.

### Persistence requirement

- The Assistant UI should be rendered at the **site root layout level** (not per-page) so it survives route changes.
- Store conversation state in memory + persist to `localStorage` (so reload doesn’t wipe the chat).

---

## System architecture (one strategy)

### Components

- **Supabase Postgres + pgvector**
  - Stores document chunks and embeddings
  - Performs similarity search via SQL/RPC

- **Vercel Serverless Function** (`/api/ai-search`)
  - Receives user query
  - Embeds query
  - Calls Supabase similarity search
  - Calls LLM with retrieved context
  - Returns answer + citations

- **Docusaurus UI**
  - A persistent Assistant panel mounted at the root
  - Calls `/api/ai-search`

### Why this fits this repo

- Site deploys as static `build/`, but Vercel still hosts `/api/*` functions.
- You edit markdown directly; indexing can be triggered by:
  - a local command you run from Cursor, and/or
  - a git push (CI job)

---

## What you do as a human (browser setup)

### 1) Create accounts

- **Supabase account** (for Postgres + pgvector)
- **LLM provider account** (for embeddings + answers)
  - Keep this doc provider-agnostic (OpenAI / Gemini / Anthropic), but you will need:
    - an API key
    - an embedding model name
    - an embedding dimension (to set `vector(N)`)

### 2) Supabase: create a project

In the Supabase dashboard:
- Create a new project
- Pick a region near your users
- Save the database password

### 3) Supabase: enable extensions

In Supabase:
- Go to **SQL Editor**
- Run:

```sql
create extension if not exists vector;
create extension if not exists pg_trgm;
```

(We mainly need `vector`. `pg_trgm` is optional but useful later if we add hybrid keyword fallback.)

### 4) Supabase: create tables + RPC

In Supabase **SQL Editor**, run something like the below.

Important: Replace `vector(1536)` with the correct dimension for your embedding model.

```sql
-- 1) documents table (1 row per markdown file)
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  source_path text not null unique,
  url text not null,
  title text,
  updated_at timestamptz not null default now(),
  content_hash text
);

-- 2) chunks table (many rows per document)
create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  chunk_index int not null,
  heading text,
  heading_path text,
  anchor text,
  content text not null,
  embedding vector(1536) not null,
  created_at timestamptz not null default now()
);

create index if not exists document_chunks_document_id_idx on document_chunks(document_id);

-- Vector index (tune later; start simple)
create index if not exists document_chunks_embedding_idx on document_chunks using ivfflat (embedding vector_cosine_ops);

-- RPC: match chunks by similarity
create or replace function match_document_chunks(
  query_embedding vector(1536),
  match_count int default 8
)
returns table (
  content text,
  url text,
  title text,
  heading text,
  heading_path text,
  anchor text,
  similarity float
)
language sql stable
as $$
  select
    c.content,
    d.url,
    d.title,
    c.heading,
    c.heading_path,
    c.anchor,
    1 - (c.embedding <=> query_embedding) as similarity
  from document_chunks c
  join documents d on d.id = c.document_id
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
```

Notes:
- The `ivfflat` index will require `ANALYZE` and enough rows to be effective. For early MVP, it’s fine.
- You can later switch to `hnsw` if you prefer.

### 5) Supabase: get connection details + keys

In Supabase dashboard:
- **Project Settings → API**
  - Copy **Project URL** (this becomes `SUPABASE_URL`)
  - Copy the **Service role key** (this becomes `SUPABASE_SERVICE_ROLE_KEY`)
    - This key must only be used server-side (Vercel functions / CI), never shipped to the browser.

### 6) Vercel: create project + configure build

In Vercel:
- Import the Git repo for this site
- Settings → General
  - **Build Command**: `npm run build`
  - **Output Directory**: `build`
  - Node version: keep consistent with repo (Node 20+ is safest here)

No special Vercel routing is required for Docusaurus.

### 7) Vercel: add Environment Variables

In Vercel project settings → **Environment Variables**:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AI_API_KEY` (your LLM provider key)
- `AI_EMBEDDING_MODEL` (string)
- `AI_CHAT_MODEL` (string)
- `AI_EMBEDDING_DIM` (number, must match the DB `vector(N)`)

Recommendation:
- Add these to **Production** and **Preview**.

### 8) (Optional) GitHub Actions secret setup (for “push triggers indexing”)

If you want indexing to run on push:
- In GitHub repo settings → Secrets
  - Add the same secrets used for indexing:
    - `SUPABASE_URL`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `AI_API_KEY`
    - `AI_EMBEDDING_MODEL`
    - `AI_EMBEDDING_DIM`

---

## What you set up in this codebase (no coding here; this is the plan)

### Directory / file layout we will add

- **Indexing script (run locally or in CI)**
  - `scripts/ai-search/index-docs.ts` (or `.js`)
  - Responsibilities:
    - read files under `docs/**`
    - chunk by headings
    - compute `content_hash`
    - create embeddings
    - upsert `documents` + `document_chunks` into Supabase

- **Vercel API**
  - `api/ai-search.ts` (or `.js`)
  - Responsibilities:
    - validate input
    - embed query
    - call Supabase `match_document_chunks`
    - call LLM with retrieved context
    - return answer + citations

- **Persistent Assistant UI (mounted globally)**
  - `src/theme/Root.js` (or `.tsx`) — wraps the site with an Assistant provider
  - `src/components/assistant/AssistantButton.*`
  - `src/components/assistant/AssistantPanel.*`
  - `src/components/assistant/assistant.css` (or integrate in `src/css/custom.css`)

### Package.json changes

Add scripts:
- `index:docs` → runs the indexing script

Example dev loop:
- edit markdown
- run `npm run index:docs`
- commit/push

### Dependencies we’ll likely add

- `@supabase/supabase-js` (server-side DB access)
- A markdown parser / chunker (either a simple heading splitter or `unified`/`remark`)
- An LLM SDK for embeddings + chat (depends on provider)

---

## Build / deploy flow (what it will look like)

### Vercel build

- Vercel runs:
  - `npm ci`
  - `npm run build`
  - deploys static output in `build/`
- Vercel separately deploys:
  - `api/ai-search` as a Serverless Function

### Indexing timing

We will *not* automatically re-index on every Vercel build by default.

Instead, you choose one of these:

- **Manual indexing (simplest)**
  - After you edit docs, run:
    - `npm run index:docs`

- **Index-on-push (recommended once stable)**
  - A GitHub Action runs `npm run index:docs` only when files under `docs/**` change.

---

## Retrieval + citation rules (non-negotiable)

Because this is used in client calls:

- The model must answer **only from retrieved chunks**.
- If the playbook doesn’t contain the answer:
  - say so
  - return the closest pages

Citations must include:
- page title
- URL
- section heading (when available)

---

## Cost + performance controls

- Retrieve topK = 6–10 chunks
- Cap completion tokens
- Cache embeddings for repeated queries (optional)
- Add basic rate limiting on `/api/ai-search` (per IP)

---

## MVP checklist

### Browser / accounts

- [ ] Create Supabase project
- [ ] Enable `vector` extension
- [ ] Create tables + RPC in SQL editor
- [ ] Copy Supabase URL + service role key
- [ ] Create LLM provider API key
- [ ] Add env vars in Vercel

### Repo setup

- [ ] Add indexing script + `npm run index:docs`
- [ ] Add `api/ai-search` Vercel function
- [ ] Add persistent Assistant UI (right-hand collapsible panel + mobile full-screen)
- [ ] Ensure chat persists across navigation + stored in localStorage
- [ ] Ensure citations are returned and rendered as links

### First run

- [ ] Run `npm run index:docs` once to populate Supabase
- [ ] Deploy to Vercel
- [ ] Ask 10–20 real playbook questions and verify citations are correct

I've successfully completed the complete Supabase setup for your RAG vector database! Here's what was accomplished:

## ✅ Completed Tasks

### 1. Supabase Account
- **Status**: Already had an existing account (`mitch@rowan.build's Org`)

### 2. Project Created
- **Project Name**: `rag-vector-db`
- **Project ID**: `uqqpkoudqkvtuyvfgxvd`
- **Region**: Americas (us-east-2)
- **Status**: PRODUCTION (active and running)
- **Database Password**: Generated and copied (you should have saved this securely)

### 3. Extensions Enabled
Successfully enabled both required PostgreSQL extensions:
- ✅ `vector` - For pgvector support
- ✅ `pg_trgm` - For trigram text search (optional but useful for hybrid search)

### 4. Database Schema Created
Successfully created the complete database schema:

**Tables:**
- `documents` - Stores one row per markdown file with metadata (id, source_path, url, title, updated_at, content_hash)
- `document_chunks` - Stores chunked content with embeddings (id, document_id, chunk_index, heading, heading_path, anchor, content, embedding vector(1536), created_at)

**Indexes:**
- Document ID index on `document_chunks` for fast joins
- IVFFlat vector index on embeddings for similarity search

**RPC Function:**
- `match_document_chunks()` - Vector similarity search function that takes a query embedding and returns the top N most similar chunks with their metadata

### 5. Connection Details Obtained

**Project URL (SUPABASE_URL):**
```
https://uqqpkoudqkvtuyvfgxvd.supabase.co
```

**Service Role Key (SUPABASE_SERVICE_ROLE_KEY):**
- Located in: Project Settings → API Keys → Legacy anon, service_role API keys
- The service role key has been copied to your clipboard
- ⚠️ **Important**: This key must ONLY be used server-side (Vercel functions, CI/CD) and never exposed to the browser

## 📝 Important Notes

1. **Vector Dimension**: The database is configured for **1536-dimensional embeddings** (compatible with OpenAI's text-embedding-ada-002 and text-embedding-3-small models). If you need to use a different embedding model with a different dimension (e.g., text-embedding-3-large uses 3072), you'll need to update the vector dimensions in the SQL.

2. **Embedding Model Options**:
   - OpenAI: text-embedding-ada-002 or text-embedding-3-small (1536 dims)
   - OpenAI: text-embedding-3-large (3072 dims)
   - Google: text-embedding-004 (768 dims)
   - Anthropic: Uses OpenAI embeddings in their Claude ecosystem

3. **Security**: Save both the database password and service role key in a secure location (like a password manager or environment variables file).

4. **Next Steps**: 
   - Set up your embedding ingestion pipeline to populate the `documents` and `document_chunks` tables
   - Configure your LLM provider API key (OpenAI, Gemini, or Anthropic)
   - Implement the RAG query logic using the `match_document_chunks()` function

Your Supabase vector database is now ready to use! 🚀



---

## Additional Future Features

### Feature 1: option-Click Link Preview

**Goal:** option-click any internal link to open a small popup preview of that page.

**UX:**
- **Trigger:** option-click any internal link
- **Preview popup:**
  - Appears as a floating modal/overlay
  - Shows the target page content (scrollable)
  - Footer text: "Press Return to open page, Escape to close" - this text should use symbols to replace the text if possible
- **Keyboard shortcuts:**
  - **Return/Enter:** Navigate to the full page (close preview, load page)
  - **Escape:** Close preview, stay on current page
- **Visual indicator:**
  - Links should have a subtle visual hint (e.g., small icon or underline style) indicating they support preview
  - Or show hint text at bottom of site: "option+click to preview"

**Implementation approach:**
1. Create a global `LinkPreviewProvider` component (mounted at root, like the Assistant)
2. Intercept option-click events on internal links
3. Fetch page content via API or pre-loaded data
4. Render in a modal with keyboard event listeners

---

### Feature 2: Auto-Generated Category Pages (All Folder Levels)

**Goal:** When clicking any folder at any nesting level, automatically show its contents (like the cards on level 1 folders) without manually creating index files.

**Solution (implemented): Config-only `sidebarItemsGenerator`**

- Added a small helper in `docusaurus.config.js` that converts every category to use `link: {type: 'generated-index'}` at build time.
- No `_category_.json` files are needed. The sidebar and category pages both reflect the filesystem automatically.
- Scripts for generating category files were removed to keep the repo clean.

**Behavior:**
- Any folder at any depth shows an auto-generated category page (cards) without manual files.
- Adding, renaming, or moving docs updates the folder page automatically—same behavior as the sidebar.

**Notes:**
- Existing `index.mdx` at top-level sections still work as before.
- Nested `index.md` files were migrated/removed so they no longer override generated pages.

---

Programmatically go through each document, one folder at a time. 
- Maybe it would be best to add frontmatter to each document and the folder levels. (is this possible?)
- Understand what is in each folder and document, and note this in the frontmatter.
- Ensure that each document and subfolder is in the correct location. 
  - Make sure the docs match the correct folder

Sanitize the documents:
- Some documents are from Rowan (my consulting company)
- Some documents are for specific clients
- Some documents are for custom home builders
Look through each document and ensure that it:
- Has no sensitive information about clients
  - No client names, no names in general, no data
  - Nothing about "Scroggs" or Asheville or specific towns or cities.
  - No links to any google files or resources
  - No references to EOS 
    - No "Scorecard" or "Rocks" verbiage
      - This is all replaced with KPIs and generic verbiage.
- Is not made for my company Rowan, and is instead made for remodelers or generic businesses
  - Strip any rowan or Mitch specific content of this specificity, and make it more generic and templatized
- Is not made for custom homebuilders
  - Make sure every content is either generic or is made for remodelers.

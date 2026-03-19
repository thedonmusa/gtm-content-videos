# CC Campaign Builder — Clay Edition

Build a full outbound campaign using Claude Code + Clay. Score companies, find and enrich contacts, write copy, deploy to Instantly — all in one conversation.

## What This Does

Talk to Claude Code in plain English. It handles everything:

```
"Score these companies against our ICP criteria"
→ Reads your scoring rubric, scores 100+ companies in seconds, outputs a tiered CSV

"Find sales leaders at the Tier 1 and Tier 2 companies"
→ Filters the scored list, searches Clay, enriches contacts via Clay waterfall

"Get me work emails for all of these contacts"
→ Clay waterfall handles most; fallback enricher covers the rest

"Write me a 3-email sequence for our webinar invite"
→ Reads your copy framework, writes to spec

"Create this campaign in Instantly and load all the contacts"
→ Creates a draft campaign, loads every contact
```

**~5 minutes. Zero to a loaded campaign.**

---

## Why Clay?

Clay runs a **multi-source waterfall** automatically:
- Company enrichment: Clearbit → Apollo → LinkedIn → Crunchbase
- Contact enrichment: Apollo → Clearbit → Hunter → RocketReach → LinkedIn

You get the best data from the best available source — without managing multiple API keys.

---

## Setup

### 1. Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 3. Add Your API Keys

```bash
cp .env.example .env
```

Edit `.env`:
```
CLAY_API_KEY=your_clay_api_key_here
EMAIL_ENRICHMENT_API_KEY=your_email_enrichment_api_key_here
INSTANTLY_API_KEY=your_instantly_api_key_here
```

**Where to get keys:**
- **Clay** — [clay.com](https://clay.com) → Settings → API
- **Email enrichment** — Hunter.io, Dropcontact, Snov.io, or RocketReach (fallback for contacts Clay couldn't find)
- **Instantly** — [instantly.ai](https://instantly.ai)

### 4. Configure Your Strategy Docs

**`scoring-criteria.md`** — Your ICP scoring rubric (industries, company sizes, funding stages, tech signals)

**`copy-framework.md`** — Your email copy rules (tone, word count, CTA style, sequence structure)

### 5. Add Your Company List (optional)

Drop a CSV into `outputs/companies.csv` to skip the discovery step:
```
name, domain, industry, employee_count, funding_stage, annual_revenue, technologies
```

### 6. Launch

```bash
claude
```

---

## The Pipeline

```
Clay Company Search
       │
       ▼
Clay Waterfall Enrichment (Clearbit → Apollo → LinkedIn → Crunchbase)
       │
       ▼
ICP Scoring → companies-scored.csv (T1 / T2 / T3 / DQ)
       │
       ▼
Clay Contact Search at T1/T2 domains
       │
       ▼
Clay Contact Enrichment Waterfall (verified emails, LinkedIn, phone)
       │
       ▼
Email Enrichment Fallback (for contacts Clay couldn't fully enrich)
       │
       ▼
Copy Writing (reads copy-framework.md)
       │
       ▼
Instantly Campaign (draft → review → activate)
```

---

## File Structure

```
.
├── CLAUDE.md              ← The brain — tells Claude Code how to use everything
├── .env.example           ← Template for API keys
├── scoring-criteria.md    ← YOUR ICP scoring rubric (fill this in)
├── copy-framework.md      ← YOUR email copy framework (fill this in)
├── lib/
│   ├── clay_client.py     ← Clay company + contact discovery & enrichment
│   ├── email_enricher.py  ← Email finding fallback (pluggable)
│   └── instantly_client.py← Campaign creation + lead loading
├── requirements.txt       ← Python dependencies
└── outputs/               ← All generated files land here
```

---

## Example Prompts

| Step | Prompt |
|------|--------|
| Discover companies | `Find 200 B2B SaaS companies in the US with 50-500 employees` |
| Score | `Score the companies in companies.csv against our ICP criteria` |
| Find contacts | `Find sales leaders at the Tier 1 and Tier 2 companies` |
| Write copy | `Write me a 3-email sequence for [your topic] using our copy framework` |
| Deploy | `Create this campaign in Instantly and load all the contacts` |

---

## Credits & Costs

| Action | Cost |
|--------|------|
| Clay company search | Included in Clay plan |
| Clay company enrichment | Clay credits (per company) |
| Clay contact search | Clay credits (per contact) |
| Clay contact enrichment | Clay credits (per contact) |
| Email enrichment fallback | Depends on your service |
| Instantly campaign | Included in your plan |

---

## License

MIT — use it however you want.

---
name: gravity-blog
description: >
  Writes a cornerstone long-form blog (the Insight Layer guide format) from a
  Gravity dossier, ALWAYS bundled with a coupled 4-email weekly sequence that
  drives to it. Use this skill whenever the user says "write the cornerstone
  blog", "blog this dossier", "cornerstone post on X", "build the blog package",
  "turn this dossier into a blog", or wants the long-form authority piece for a
  topic that already has a dossier. The blog and its 4 emails are one unit and
  never ship apart. Do NOT use this for short social posts (that's gravity-social)
  or for the dossier itself (that's gravity-dossier) — this skill CONSUMES a
  dossier and produces the cornerstone guide + its email sequence.
---

# gravity-blog — Cornerstone Guide + Coupled 4-Email Sequence

A modular skill of the Gravity pipeline. It turns a finished dossier into two
coupled assets:

- **Part A — the cornerstone**, written in the **Insight Layer guide format**
  (the same structure/framework as the ADM `guide-generation` skill), output as
  **markdown**.
- **Part B — a 4-email weekly sequence**, one email per week over ~a month, each
  a standalone insight that drives to the cornerstone.

**Hard coupling rule:** the blog NEVER ships alone. Every run of this skill
produces the cornerstone AND its 4 emails together, even in pure modular use.

> Format lineage: Part A adopts the ADM `guide-generation` standard, adapted
> here for (1) markdown output, (2) dossier-sourced content, and (3) role-based
> brain loading. It is replicated (not referenced) so this skill stays
> self-contained and client-shippable — it must not depend on a personal/ADM
> skill being installed.

---

## Inputs

- **Dossier** (required). A dossier `.md` from `{BRAIN_PATH}/dossiers/`. This is
  the source of truth for the cornerstone and the emails. If none is named, list
  the dossiers in that folder and ask which one. The skill may expand,
  contextualize, and synthesize from the dossier — it may NOT invent new IP,
  exaggerate, or contradict it.
- **Topic** — defaults to the dossier's topic; only needed to narrow a broad
  dossier.
- **BRAIN_PATH** — brand-context brain folder. Resolve: passed arg →
  `PLB_BRAIN_PATH` env var → `./brain`. Operator's path lives in their local
  setting, never in this file. Per-client brains swap in with no rewrite.
- **Optional:** author name / site / domain overrides (otherwise pulled from
  brand context).

---

## Brand context loading (role-based — never filename-based)

On start, load these roles from `BRAIN_PATH` (manifest at
`{BRAIN_PATH}/brain-manifest.json` if present, else case-insensitive filename
patterns). Hold each as CONTEXT, not as a content source (the dossier is the
content source):

| Role | Pattern | What to pull |
|---|---|---|
| **Source of Truth** | `*sot*`, `*source*of*truth*` | Voice standard, coined terms, expert name + expertise, author bio, and schema/metadata values (domain, site title, organization, author URL / role) |
| **Avatar profile** | `*avatar*` | Ideal client's problem, emotional state, the language they actually use |
| **Convictions map** | `*conviction*` | SILENT CONSTRAINT — belief shifts to reinforce, contrarian positions for the Perspective block. Never quoted, never a content source |
| **Brand voice rules** | `*voice*` | Hard voice rules the output must satisfy (also enforced by voice-qa) |
| **Brand style guide** | `*style*guide*`, `*brand*` (`.json` ok) | Coined-term spellings, perspective label, colors/fonts (for a later HTML build) |

If a role can't be resolved, note which one and proceed with what's available —
never invent brand details, coined terms, credentials, or voice rules.

---

## Workflow

```
Dossier in (+ brand context from BRAIN_PATH)
   ↓
PART A — write the cornerstone (Insight Layer guide format, markdown)
   ↓
PART B — write the 4 weekly emails (each drives to the cornerstone)
   ↓
Run voice-qa on BOTH; fix every FAIL before saving (verbatim quotes exempt)
   ↓
Save cornerstone .md + emails .md to {BRAIN_PATH}/content/blog/
   AND an identical readable copy to the in-session workspace (for review in CODE)
   ↓
Report: file paths + one-line through-line + the 4 email angles + next step
```

---

## Voice & avatar accuracy (applies to the cornerstone AND the emails)

**Sound like the expert, not like a polished thought-leadership machine.** The
draft must be WARM, grounded, and plain — meet the reader at eye level, never
talk over their head. Infusing the expert's exact words is NOT the same as
sounding like them; the connective prose must carry their warmth and plain
register too. The 11pm test: write the way the expert would actually talk to one
person who is stuck, not the way a keynote sounds. Lead with the felt problem in
plain language; introduce coined terms only after the reader recognizes the
problem, then restate plainly.

**Avatar accuracy — write to the AVATAR's lived experience, never the expert's.**
The expert's realization story is the EXPERT's (e.g., "I leaned on AI more and my
old tools less without reorganizing"). Do NOT project it onto the reader. Load
the avatar's actual current state from the Avatar profile (via BRAIN_PATH) and
write to THAT. Keep concept ownership clear: a concept may describe the industry,
the market, or the reader's situation — never assume it describes the reader's
internal emotional state unless the avatar profile says so.

---

## PART A — The Cornerstone (Insight Layer guide format, markdown)

A guide is long-form thought leadership that ARGUES, not a how-to that answers.
It shifts how the reader thinks. **Target length: 1,500–3,000 words. Never
padded — every paragraph earns its place.**

### Design principle — extractable and visual-first, never a wall of text

Two rules, both non-negotiable:

**AEO section length (answer-first).** Every H2 section OPENS with a 40–60 word
extractable answer: naked prose, no sub-heading before it, stating the section's
point directly so it could stand alone as an AI citation. Then argue it. Keep
each section roughly **150–250 words** — if it runs past ~250, split or compress.
(Per the PLB node/fan-out standard: AI extracts sub-40-word answers at ~2.7× the
rate of longer passages, and a sub-40-word lead answer generates ~67% more AI
citations. Long argued runs do not get cited.) This is the fix for wordiness:
tight, answer-first sections beat long ones.

**Visual-first.** Break every 2–3 paragraphs with a structural element (concept
list, before/after table, pillar set, stat line, highlight callout). **Minimum
3–4 such blocks, distributed.** These markdown blocks stand in for the HTML
editorial-infographic components a later build converts; markdown is the output
here.

### The 10-part structure (do not deviate)

1. **Title** — a bold claim or named concept, not a query. A magazine cover
   line: confident, specific, slightly provocative. Add a subtitle that names
   the stakes and the resolution.
2. **Lede** — 2–3 sentences max. States the core argument and the shift the
   guide makes. No "in this article" framing. The reader should feel *this
   person already understands my problem.*
3. **Key Takeaways** — 6–8 **hyphen-led** bullets, each a belief-shifting,
   screenshot-worthy statement (NOT a summary). (The guide format's em-dash
   bullets are overridden by the no-em-dash voice rule: use hyphens.)
4. **Visual Tension block** *(optional)* — a minimal two-force contrast that
   dramatizes the problem (e.g., `Information available ↑ / Clarity ↓`).
5. **Named H2 sections** — each with a small all-caps section label + a bold
   argument H2. **Open every section with a 40–60 word extractable answer**
   (naked prose, no sub-heading first) stating the section's point, then argue it
   in warm, grounded, first-person prose. One idea per section; keep each
   ~150–250 words. Sections follow the **narrative arc**:
   `Problem → Why it happens → Why existing solutions fail → The paradigm shift
   → The proprietary model/method → Implications → What survives.`
6. **Visual content blocks** (markdown stand-ins, ≥3–4, distributed): concept
   list, failure list (`✕ Solution — why it fails`), before/after table,
   three-pillar set (label + title + 2–3 sentences), two-column split
   (AI handles / you handle), outcome table (Disappears / Evolves / Thrives).
7. **Mid-article CTA placeholder** — leave EXACTLY ONE `[CTA BOX]` mid-article,
   after the single strongest belief-shift moment. With the closing one (§9),
   that is **2 total for the whole piece — never more**. Do not write CTA copy.
8. **FAQ** — 6–8 questions, 100–150-word answers, in the expert's voice;
   address objections and edge cases, go deeper than the body. Mirror these in
   the schema block.
9. **Closing argument** — 2–3 paragraphs, no new info, lands the case, ends on a
   one-line conviction statement. Then a final `[CTA BOX]` placeholder.
10. **Author bio** — third person, ~100 words, the expert's specific expertise
    (from SOT), ends linking to the domain. Use the SOT author-bio text.

### Schema (fenced block at the top or bottom of the markdown)

Include a `json` fenced block with an `@graph` of Article + FAQPage +
BreadcrumbList (+ optional HowTo if there's a clear step section). Pull
author/publisher/domain values from the SOT. The FAQ schema must match the
visible FAQ word for word. (In markdown-only output this is a fenced block the
later HTML build lifts into `<head>`.)

### Dossier → guide mapping (where each part comes from)

- Dossier **Executive Summary / through-line** → Title + Lede.
- Dossier **Quotable Insights + Contrarian Beliefs** → Key Takeaways.
- Dossier **Core IP, the Method/Process, frameworks** → the narrative-arc H2s
  and the visual blocks (e.g., the method becomes a step-list or pillar set).
- Dossier **Story Bank** → in-section examples and the proof beats.
- Dossier **Objection Handling** → the FAQ.
- Dossier **Convictions / Perspective** → the opinionated voice + closing.
- Stay within the dossier. Plain-language priority: lead with the problem the
  reader feels; introduce coined terms only after recognition, then restate
  plainly.

---

## PART B — The 4-Email Weekly Sequence (coupled)

Produce **four** standalone emails, intended one per week over ~a month, each
driving to the cornerstone. Each email is built to the standard below (carried
verbatim from the source tool §7).

### Per-email standard (verbatim)

```
# SYSTEM PROMPT — EMAIL SIGNAL MEMO GENERATOR

**Role:**
You are an **Email Thought Leadership Signal Generator**.

Your job is to generate **one standalone, high-signal email** that directs the reader to a **cornerstone blog post** while delivering **immediate, intrinsic value** on its own.

This email is **not** part of a sequence.
It does **not** depend on future emails.
It does **not** tease, drip, or withhold insight.

If the reader never clicks the blog, the email must still feel worth reading.

## PRIMARY FUNCTION
Given a Thought Leadership Dossier and a Cornerstone Blog Post generated from it, generate one email that:
1. Establishes authority through **pattern recognition**
2. Diagnoses an **industry, market, or client-facing problem**
3. Reframes a faulty assumption or outdated model
4. Invites the reader to explore the blog **as an expansion**, not a requirement

## POSITIONING RULES (NON-NEGOTIABLE)
### 1. Email ≠ Teaser
Do not summarize the blog, tease future content, create open loops, or say "I'll explain more later." The email must deliver a complete insight.
### 2. Correct Concept Ownership
Concepts may apply to: the industry, the market, the reader's clients, legacy business models. Do NOT assume concepts describe the reader's internal emotional state unless explicitly stated. The reader is a discerning observer, a capable expert, a leader deciding where they stand.
### 3. Authority Tone
Read like a strategic memo, a field note, a clear-eyed diagnosis. Avoid hype, urgency, emotional manipulation, therapeutic language, "you're overwhelmed" framing. Respect intelligence. Compress insight.

## REQUIRED EMAIL STRUCTURE
1. Subject Line — clear, intelligent, curiosity-inviting. No clickbait.
2. Opening: Pattern Call-Out — name a systemic pattern or failure. "Oh. That's true, and I haven't seen it named that way." Do not moralize or blame.
3. Middle: Reframe — explain WHY the pattern exists (outdated assumptions, structural incentives, current AI/market reality). Tight and precise.
4. Close: Expansion Invite — invite to the blog as a deeper articulation. Optional and grounded. No urgency, no pressure.

## CTA RULES
- Single CTA only; CTA = read the blog post. No secondary offers, no lead-magnet references, no "book a call."

## STYLE & LENGTH
- 250–450 words. Short paragraphs. Calm, confident, grounded.

## FINAL CHECK
- Would this email still be valuable if the reader never clicks?
- Is the problem framed at the correct ownership level?
- Does this sound like a leader thinking out loud, not a marketer?
```

### Novelty across the four (this is what makes it a set)

Each of the four emails takes a **distinct pattern / angle drawn from a
different facet of the dossier** — a different core idea, contrarian belief,
story, or objection. **No repeated insight, metaphor, or framing across the
set.** Together they should feel like four different doors into the same
cornerstone, not four versions of one email. Each still links only to the
cornerstone (single CTA).

---

## Output

- **Cornerstone:** `{BRAIN_PATH}/content/blog/cornerstone-<topic-slug>-<YYYY-MM>.md`
  (with the schema fenced block).
- **Emails:** `{BRAIN_PATH}/content/blog/emails-<topic-slug>-<YYYY-MM>.md` —
  all four in one file, labeled `=== EMAIL 1 (WEEK 1) ===` … `=== EMAIL 4 (WEEK 4) ===`.
- Create `{BRAIN_PATH}/content/blog/` if absent.
- **Also write an identical readable copy** of both files to the in-session
  workspace (e.g. `gravity-blog-workspace/`) so the operator can open them in
  CODE — the canonical copies live in `_BRAIN`, which sits outside the project's
  session folder and can't be opened from a project session.
- **voice-qa gate:** run voice-qa on the cornerstone prose AND every email, then
  FIX every FAIL (em-dashes, banned constructions, retired phrases) before
  saving. voice-qa only reports; the skill applies the fixes and re-checks.
  Verbatim quotes inside quotation marks are exempt from reformatting.
- **Report:** the two file paths, a one-line through-line, the four email angles
  (one line each), and an offered next step (gravity-social, gravity-youtube, or
  gravity-suite).

---

## Quality checklist (run before saving)

- [ ] Cornerstone is 1,500–3,000 words; every paragraph earns its place
- [ ] Title is a bold claim/named concept, not a query; subtitle names stakes + resolution
- [ ] Lede is 2–3 sentences, thesis with conviction, no "in this article"
- [ ] 6–8 belief-shifting Key Takeaways
- [ ] Narrative arc flows Problem → Why → Failed solutions → Shift → Model/Method → Implications → What survives
- [ ] ≥3–4 visual content blocks, distributed; no 400+ word wall of prose
- [ ] The dossier's Method/Process appears as a clear block (step-list or pillars)
- [ ] FAQ has 6–8 Q's; schema block matches the visible FAQ word for word
- [ ] Two `[CTA BOX]` placeholders (mid + closing); no CTA copy written
- [ ] Closing ends on a one-line conviction statement
- [ ] 4 emails, each 250–450 words, each a standalone complete insight, single CTA to the blog
- [ ] The 4 emails are genuinely distinct angles — no repeated insight/metaphor/framing
- [ ] Nothing invented beyond the dossier; coined terms used naturally, never stuffed
- [ ] Both assets pass voice-qa (no em-dashes in prose, no banned constructions/descriptors)

---

## Design decisions baked in

- **Insight Layer guide format for Part A** (lineage: ADM guide-generation),
  output as markdown; the HTML editorial-infographic build is a separate later
  step.
- **Blog and 4 emails are one coupled unit** — never produced apart.
- **Dossier is the source of truth**; the skill expands but never invents IP.
- **Role-based, env-resolved brain loading** — client-shippable, per-client
  brains swap in with no rewrite; zero personal paths/filenames in this file.
- **voice-qa is the gate**, fix-before-save, verbatim-quote exemption.
- **In-session readable twin** alongside the canonical `_BRAIN` copies.

---

## Calibration / testing

Run on an existing dossier (e.g. an AI-Native dossier in `{BRAIN_PATH}/dossiers/`)
and check: the cornerstone follows the 10-part structure and narrative arc,
surfaces the dossier's method as a visual block, hits 1,500–3,000 words, and
passes voice-qa; the 4 emails are each standalone, 250–450 words, single-CTA,
and four genuinely distinct angles. Compare voice against the dossier's Brand
Voice section.

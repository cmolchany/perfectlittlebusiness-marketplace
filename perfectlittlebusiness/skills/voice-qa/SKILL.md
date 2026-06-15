---
name: voice-qa
description: >
  Quality gate for any brand-voiced draft (post, page, email, newsletter,
  dossier, sales copy). Scores a draft against your brand's voice rules AND the
  universal "don't sound like AI" tells, returning a pass/fail with line-level
  flags so nothing ships that breaks your standards. Use whenever you want to QA
  a draft: "voice check", "check the voice", "run voice QA", "is this on brand",
  "did I use any em-dashes", or as the final step after generating brand-voiced
  content. Reads your brand voice rules from your brain (BRAIN_PATH); your rules
  always win.
---

# Voice QA - Brand Voice Gate

The QA step for any brand-voiced output. It scores a draft against your brand's
voice rules and the universal AI-writing tells, flagging every violation with a
line reference so nothing ships that breaks your standards.

The output is a **report, not a rewrite.** It flags and scores. It proposes
fixes only when asked, and never edits silently.

---

## Source of truth - your brand's voice rules

Load your brand voice rules from `BRAIN_PATH`. Resolve in order:
1. a path passed explicitly by the user, else
2. the `PLB_BRAIN_PATH` environment variable, else
3. `./brain` (relative fallback).

Find the rules by role (never by a hard-coded filename): read the role to
filename map at `{BRAIN_PATH}/brain-manifest.json` if present, else fall back to
the case-insensitive filename pattern `*voice*`. Read that file in full every
run. **It is the authority.** The universal checks in this skill sit underneath
it. If the brand voice file can't be resolved, run the universal pass anyway and
say plainly that the brand-specific rules were unavailable.

This skill names ZERO specific brand files or brand terms. Your brand's banned
words, retired phrases, approved terminology, descriptor preferences, and any
pricing or trademark policy live in your voice file, never in this skill.

---

## How to run

1. Read your brand voice rules from `BRAIN_PATH` (role: `*voice*`).
2. Run the deterministic universal scan:
   `python3 scripts/voice_check.py <draft_file>`
   (catches em/en-dashes, universal filler/amplifiers, and AI-slop constructions).
3. Apply your brand's OWN rules from the voice file: any banned terms, retired
   phrases, required or approved terminology, audience/descriptor preferences,
   and pricing or trademark policy your brand specifies. These are brand-specific,
   so they come from your file, not from this skill.
4. Apply the judgment checks the script can't do: zombie nouns, voice feel,
   demonstrate-don't-narrate, and descriptor misuse in context.
5. Produce the scored report below.
6. Propose fixes only if asked, as a diff or corrected draft. Never apply fixes
   unprompted.

**Verbatim-quote exemption:** if the caller says the draft contains verbatim
quotes inside quotation marks (e.g. a dossier preserving an interviewee's words),
treat the text inside quotation marks as exempt from reformatting. Flag the
draft's own prose, not the quotations.

---

## FAIL vs FLAG

- **FAIL (must fix before ship):** an em-dash or en-dash anywhere (the strongest
  "written by AI" tell), plus anything your brand voice rules mark as a hard
  violation.
- **FLAG (revise unless deliberate):** the universal filler/amplifiers and
  AI-slop constructions below, zombie nouns, and your brand's soft rules.

A draft **passes** only with zero FAILs. FLAGs are reported with a count and
locations; you decide which are deliberate.

---

## Universal checks (always on, brand-agnostic)

These are the "sounds like a person, not like AI" defaults. Your brand voice
file can override any of them. The deterministic script in
`scripts/voice_check.py` is the canonical list; the notes below are a summary.

**Punctuation (FAIL):** no em-dash (—), no en-dash (–) used for emphasis.
Hyphens in compound words are fine. Use a colon in headings and labels
(`Section 1: Title`, not a dash).

**Banned constructions (FLAG):** "It's not X. It's Y" and variants · "Here's the
thing" / "Here's what most people miss" · "The truth is" / "What if I told you" ·
"Imagine this" / "Picture this / yourself" · "In a world where" · "Let me
explain" / "Let's break this down" · "Whether you're X or Y" · "More than just X"
/ "Not your average X" · "Look," / "Listen," openers · "Trust me when I say" /
"Let's be honest" · "That's where X comes in" · a rhetorical question answered
immediately · repeated tricolons.

**Filler / AI amplifiers (FLAG):** empty intensifiers and hype clichés -
leverage (v), navigate (v), robust, seamless, elevate, unleash, unlock,
transformative, deep dive, crucial, vital, essential, truly, really, very,
actually, powerful, revolutionary, cutting-edge, next-level, world-class,
ultimate, and similar. See `scripts/voice_check.py` for the full pattern list.

**Zombie nouns (FLAG, judgment):** -tion / -ment / -ity / -ance / -ence / -ness
/ -ization nouns hiding a shorter verb. Exempt product, deliverable, and
coined-term names.

**Demonstrate don't narrate (FLAG, judgment):** no meta-copy announcing the
brand's own values ("I don't believe in teasers"). Enact the value; don't
announce it.

---

## Report format

```
VOICE QA - [date]

VERDICT: PASS ✅  /  FAIL ❌ (N must-fix)

MUST FIX (FAIL)
- [line ~N] [rule] "...offending text..."  → why it fails

REVISE (FLAG) - N total
- [line ~N] [rule] "...text..."  → suggested direction

NOTES
- Brand voice file: [loaded / not found]
- Brand-specific rules applied: [list, or none]

ONE-LINE SUMMARY: [pass, or the single most important thing to fix]
```

Keep the report tight. Lead with the verdict. No preamble.

---

## Design decisions baked in

- **Brand-agnostic, client-shippable** - zero brand terms or personal paths in
  this skill; your brand's specifics load from your brain via `BRAIN_PATH`.
- **Report, not a rewrite** - flags and scores; proposes fixes only when asked.
- **Universal pass is mechanical, brand pass is judgment** - the script catches
  the AI tells deterministically; the model applies your brand rules from your
  voice file on top.
- **Your brand voice file is the final authority** - it overrides any universal
  default here.

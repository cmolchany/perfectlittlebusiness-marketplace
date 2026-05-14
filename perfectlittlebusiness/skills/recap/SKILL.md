---
name: recap
description: The "where am I" rescue skill. Produces a 60-second briefing of recent session history, learnings, decisions, and open items. Use when returning to a project after time away or when you've lost the thread mid-session.
---

# /perfectlittlebusiness:recap — Where Am I Lifeline

## Purpose

Quickly orient the user. Where were they? What did they decide? What's open? What did they learn? Use when returning after time away, when context is lost, or when overwhelmed.

## When To Use

- Returning to a project after several days or weeks
- Feeling lost mid-session
- Before a big decision (want to remember recent context)
- After running multiple sessions in parallel and getting confused

## Execution Instructions

### Step 1: Read Recent History

1. Read the **last 5 entries** in MEMORY.md (most recent first)
2. Read the **last 5 entries** in brain/learnings.md (across all sections)
3. Read the **last 3 entries** in brain/decisions.md
4. Read the **last 3 entries** in brain/wins.md
5. Run `git log -10 --oneline` for recent commits
6. Run `git status` for uncommitted state

### Step 2: Produce the Briefing

Output in this format:

```
**🧭 RECAP — [PROJECT_NAME]**

**Recent sessions (most recent first):**
- [Date] — [Brief summary from MEMORY.md]
- [Date] — [Brief summary]
- [Date] — [Brief summary]
- (etc., up to 5)

**Recent decisions in play:**
- [Date] — [Brief decision title]: [One-line summary]
- [Date] — [Brief decision title]: [One-line summary]

**Recent learnings to keep in mind:**
- [Learning bullet]
- [Learning bullet]
- [Learning bullet]

**Recent wins:**
- [Win bullet]
- [Win bullet]

**Open items:**
[From most recent MEMORY.md entry's "Open items" section]

**Current state:**
- Uncommitted changes: [yes/no — what they are]
- Last commit: [date and message]

---

Where do you want to pick back up?
```

### Step 3: Wait

Wait for the user's response. Do not proceed with work yet.

---

## Notes for Claude Executing This Skill

- Keep it scannable. The user is trying to orient quickly.
- If sections are empty (e.g., no decisions yet), omit that section rather than printing "(no decisions logged)".
- This is a read-only skill. Do not write to any files.
- If the project is very new (less than 5 entries in MEMORY.md), show what's there. Don't pad.
- This is a longer report than /perfectlittlebusiness:start. /perfectlittlebusiness:start is "where are we today." /perfectlittlebusiness:recap is "where have we been."

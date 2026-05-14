---
name: hygiene
description: Weekly health check. Audits the project for drift, clutter, stale files, uncommitted work, and brain freshness. Run once per week (Sundays recommended).
---

# /perfectlittlebusiness:hygiene — Weekly Health Check

## Purpose

Audit the project for drift, clutter, stale files, and missed self-improvement captures. Keep the operating system clean and reliable.

## When To Use

- Once per week (Sundays recommended)
- Before major work blocks
- After returning from time away
- When something feels off

## Execution Instructions

Execute in this order:

### Step 1: Git Audit

1. Run `git status` and capture output.
2. Run `git log -5 --oneline` and capture recent commits.
3. Check for unpushed commits (`git log origin/main..HEAD` if remote exists).

### Step 2: CLAUDE.md Freshness

Check the modification date of CLAUDE.md. Flag if older than 30 days — the project has likely evolved beyond what's documented.

### Step 3: Brain Folder Audit

Check modification dates of:
- brain/source-of-truth.md
- brain/convictions.md
- brain/avatar-profile.md
- brain/learnings.md
- brain/decisions.md
- brain/wins.md

**Critical check:** If learnings.md hasn't been updated in 14+ days, this is a self-improvement leak. Sessions without captured learnings are missed compound interest. Flag it.

Check if voice-samples/ has at least 2 files. If not, flag it — voice-matching quality depends on samples.

### Step 4: MEMORY.md Continuity

1. Read the last entry. Confirm it's recent.
2. Check for gaps — sessions that ended without `/perfectlittlebusiness:end`.

### Step 5: Clutter Check

Look for:
- Unexpected files at project root (anything not in the expected structure)
- Noise files (.DS_Store, .tmp, swap files, .log)
- Large files that shouldn't be in the repo (zips, raw recordings, etc.)
- Files outside the structure that should be in brain/reference/

### Step 6: Report in Three Buckets

Output the report in this exact format:

```
🔴 URGENT (address today)
[list, or "Nothing urgent — system is healthy"]

🟡 ROUTINE (address this week)
[list, or "Nothing routine"]

🟢 OPTIONAL (improvements)
[list, or "Nothing optional"]
```

For each item, suggest a specific action.

Urgent examples:
- Uncommitted work older than 3 days
- Sensitive files exposed (.env at root, API keys in committed files)
- Setup files missing

Routine examples:
- learnings.md stale (no updates in 14+ days)
- CLAUDE.md older than 30 days
- No voice samples added
- Sessions without `/perfectlittlebusiness:end` (gaps in MEMORY.md)

Optional examples:
- Clutter at project root
- Outdated reference files
- Templates folder still empty after a month

### Step 7: Ask

End with: "Want me to address any of these? Approve one at a time."

---

## Notes for Claude Executing This Skill

- Do not auto-fix anything without approval.
- Never delete files without explicit user confirmation.
- If learnings.md is stale, gently remind the user this is the self-improvement file — that's the leak that matters most.
- Don't make the report long. Three buckets, concise items, clear next actions.
- If everything is healthy, say so clearly: "🟢 Your operating system is in great shape. Keep going."

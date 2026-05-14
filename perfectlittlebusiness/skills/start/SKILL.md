---
name: start
description: Session opener. Loads CLAUDE.md, the entire brain/ folder, and git status at the beginning of every session. Run this first in every session.
---

# /perfectlittlebusiness:start — Session Opener

## Purpose

Load full project context at the beginning of every session so Claude knows exactly where the user left off, who they are, what they believe, and what they've discovered.

## When To Use

- Every single session, as the very first command
- After any context loss
- Returning to a project after time away

## Execution Instructions

Execute in this exact order:

### Step 1: Read Core Files

1. Read `CLAUDE.md` from the project root.
2. Read all files in `brain/`:
   - source-of-truth.md
   - convictions.md
   - avatar-profile.md
   - learnings.md
   - decisions.md
   - wins.md
3. Note (but don't read every file in) voice-samples/, reference/, templates/. Just note what's there.

### Step 2: Check Project State

1. Run `git status` to see uncommitted changes.
2. Read the last 2 entries in MEMORY.md (most recent first).

### Step 3: Produce a Session Briefing

Output exactly this format. Fill in dynamically from what you read:

```
**Project:** [name from CLAUDE.md]
**Last session:** [date and brief summary from MEMORY.md]
**Open items from last session:** [from most recent MEMORY.md entry, if any]
**Recent learnings to keep in mind:** [1-3 key items from learnings.md, if any]
**Recent decisions in play:** [1-2 from decisions.md, if any]
**Uncommitted changes:** [yes/no — what they are if yes]

Ready to work. What are we focused on today?
```

### Step 4: Wait

Do not proceed to any work until the user responds.

---

## Notes for Claude Executing This Skill

- If any file is missing, flag it but don't fail. Note: "brain/learnings.md not found — you may want to create it."
- If MEMORY.md only has the setup entry, that's expected for a new project. Briefing should say: "First working session in this project."
- Briefing should be scannable — the user is starting their session, not reading a report.
- If learnings.md or decisions.md are empty, omit those briefing lines rather than printing "(empty)".

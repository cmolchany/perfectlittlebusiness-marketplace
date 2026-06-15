---
name: end
description: Session closer. Updates MEMORY.md with what happened, captures new learnings into brain/learnings.md, captures wins into brain/wins.md, and commits everything. Run this at the end of every session before closing Claude Code.
---

# /end — Session Closer (Self-Improvement Loop)

## Purpose

Close every session cleanly. Update MEMORY.md with what happened. Capture new learnings and wins. Commit everything. **This is what makes the system self-improving. Skipping it means losing the compound effect.**

## When To Use

- At the END of every session
- Anytime you're stepping away and might lose context
- After completing a major piece of work

## Execution Instructions

### Phase 1: Ask Four Questions

Ask one at a time. Wait for each answer.

**Q1:** "What did we accomplish this session? Give me a brief summary."

**Q2:** "Any new learnings or discoveries about your business this session? Patterns, market signals, positioning shifts, things that worked or didn't? (Say 'none' if nothing new.)"

**Q3:** "Anything to celebrate? A win to log? (Say 'none' if nothing to log.)"

**Q4:** "Anything uncommitted or pending deploy I should note?"

### Phase 2: Update MEMORY.md

Append (do not overwrite) a new entry:

```markdown

---

## [TODAY'S_DATE] — [Brief Session Title]

**What happened:**
[USER_ANSWER_1]

**Git state:**
[USER_ANSWER_4 — or "All committed and pushed" if clean]

**Open items for next session:**
[Anything pending, half-finished, or needing follow-up]

**Captured:** [learnings: yes/no | wins: yes/no]
```

### Phase 3: Update learnings.md (Conditional)

**If Q2 answer was substantive (not "none"):**

1. Read brain/learnings.md
2. Determine which section the insight fits:
   - What's Working
   - What's Not Working
   - Market Signals
   - Positioning Refinements
   - Strategic Pivots
   - Open Questions

3. Draft a concise bullet (1-3 sentences)

4. Show the user:
```
I'm adding this to brain/learnings.md under [SECTION]:

> [Draft bullet]

Approve, edit, or skip?
```

5. After approval, append to the section and update "Last updated" date.

**If Q2 was "none":** Skip this phase. Note in MEMORY entry: "No new learnings captured."

### Phase 4: Update wins.md (Conditional)

**If Q3 answer was substantive (not "none"):**

1. Read brain/wins.md
2. Draft a concise win entry:
```
## [TODAY'S_DATE] — [Brief win title]

[1-2 sentence description of the win and what enabled it]
```

3. Show the user the draft. Get approval. Append.

**If Q3 was "none":** Skip.

### Phase 5: Commit

Run:

```bash
git add .
git commit -m "Session [DATE]: [brief description]"
```

If a remote is configured, also push. If not, just commit locally and note: "No remote configured — committed locally only."

If the commit fails (no git repo initialized), note it but do not block session close.

### Phase 6: Final Confirmation

Output:

```
✅ Session closed cleanly.

**Saved:**
- MEMORY.md updated with today's entry
[- learnings.md updated with new insight] (if applicable)
[- wins.md updated with new win] (if applicable)
- Changes committed: [commit message]
[- Pushed to remote] (if applicable)

**For next session:** Type /start. The system picks up exactly where we left off.

See you next time.
```

---

## Notes for Claude Executing This Skill

- **Never** skip the learnings question or wins question. Even if both return "none," asking builds the habit.
- **Always** show proposed additions before writing. User owns the framing.
- **Always** append to MEMORY.md, never overwrite.
- Keep MEMORY entries concise. Detail belongs in learnings.md/decisions.md.
- If git push fails (no remote, network issue), commit locally and note it.
- After completion, this is end-of-session. Do not continue with other work in the same response.

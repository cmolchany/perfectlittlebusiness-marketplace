---
name: learn
description: Capture an insight or learning mid-session without ending the session. Use whenever you notice a pattern, discovery, or insight you want logged before it evaporates. Updates brain/learnings.md immediately.
---

# /learn — Mid-Session Capture

## Purpose

Capture an insight the moment it strikes, without waiting for `/end`. Insights are perishable. This skill makes capture frictionless.

## When To Use

- You notice a pattern in client behavior
- A market signal becomes clear
- You realize something isn't working
- Positioning shifts in your mind
- You discover what's actually converting

## Execution Instructions

### Step 1: Get the Insight

If the user typed `/learn` alone with no content, ask: "What did you just learn or notice?"

If the user typed `/learn [content]`, use the content directly.

### Step 2: Categorize

Read brain/learnings.md. Determine which section the insight fits:
- What's Working
- What's Not Working
- Market Signals
- Positioning Refinements
- Strategic Pivots
- Open Questions

### Step 3: Draft and Confirm

Propose a refined version. Keep it concise (1-3 sentences). Real insight, not vague.

Show:
```
Adding to brain/learnings.md under [SECTION]:

> [Refined insight, dated]

Approve, edit, or change section?
```

### Step 4: Write

After approval, append to the appropriate section with today's date prefix. Update "Last updated" at the bottom.

### Step 5: Return to Work

Output: "Captured. Back to what we were doing."

Then return control to the user without further action.

---

## Notes for Claude Executing This Skill

- This is a fast skill. Total interaction should be 2-3 turns max.
- Never write to learnings.md without showing the proposed addition first.
- If the user's insight is genuinely vague ("things are going well"), ask one clarifying question before writing. But just one.
- Don't break flow. The user is mid-work. Capture and return them to it.

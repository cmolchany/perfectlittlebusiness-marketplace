---
name: decide
description: Log a meaningful business or strategic decision with full context and rationale. Captures what you chose, what you chose against, and why. Updates brain/decisions.md. Use after any significant decision.
---

# /perfectlittlebusiness:decide — Decision Logger

## Purpose

Capture meaningful decisions with their full context and rationale so you can revisit them later. Six months from now, you'll want to know *why* you chose what you chose. This is that file.

## When To Use

- Pricing decisions
- Strategic pivots
- Offer changes
- Tech stack decisions
- Hiring or partnering decisions
- Anything you might second-guess later

Do not use for trivial decisions. Decision log only for things that matter.

## Execution Instructions

### Step 1: Get the Decision

Ask three questions, one at a time:

**Q1:** "What did you decide?"

**Q2:** "What was the context? What were the alternatives you considered?"

**Q3:** "Why did you choose this over the alternatives? What's the reasoning?"

### Step 2: Draft the Entry

Format:

```markdown
## [TODAY'S_DATE] — [Brief decision title]

**Decision:** [USER_ANSWER_1]

**Context & alternatives considered:**
[USER_ANSWER_2]

**Rationale:**
[USER_ANSWER_3]

**To revisit if:** [Conditions under which this should be reconsidered — Claude infers from context]
```

For the "To revisit if" line, infer reasonable revisit conditions based on the decision. Examples:
- A pricing decision → "If conversion rates drop below X% or competitive pricing shifts significantly"
- A positioning decision → "If audience response patterns change or new market data emerges"
- A tech decision → "If the tool becomes unreliable, costs change, or better alternatives emerge"

### Step 3: Show and Confirm

Show the user the draft entry. Ask: "Approve, edit, or refine the revisit condition?"

### Step 4: Write

After approval, append to brain/decisions.md.

### Step 5: Optional: Flag a Learning

Ask: "Want to also capture a learning from this decision in brain/learnings.md?"

If yes, transition to the `/perfectlittlebusiness:learn` workflow.

If no, output: "Decision logged. Carry on."

---

## Notes for Claude Executing This Skill

- Don't accept vague rationale. If Q3 is too thin ("it felt right"), ask one follow-up: "What signal made it feel right?"
- "To revisit if" should be realistic, not exhaustive. Inferring well here is part of the skill's value.
- decisions.md is append-only. Never overwrite or rewrite past decisions — even if the user later thinks they made the wrong call. Their reasoning at the time matters.
- If a past decision is being reversed, that becomes a NEW decision entry that references the prior one.

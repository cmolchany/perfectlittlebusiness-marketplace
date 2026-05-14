---
name: digest
description: Generate a personal weekly summary from your MEMORY, learnings, decisions, and wins from the past 7 days. Use Sunday for a Monday-clarity reset, or any time you want a one-screen view of recent work.
---

# /perfectlittlebusiness:digest — Personal Weekly Summary

## Purpose

Produce a one-screen weekly summary so the user can see what they did, learned, decided, and won — without having to scroll through MEMORY.md. This is one of the "test-drive" automations: works immediately, requires no brain content beyond CLAUDE.md.

## When To Use

- Sunday evening (Monday-clarity reset)
- End of a work sprint
- Before a strategy session
- Anytime you want to feel oriented

## Execution Instructions

### Step 1: Gather the Past 7 Days

1. Read MEMORY.md. Extract all entries from the past 7 days.
2. Read brain/learnings.md. Identify entries added or updated in the past 7 days.
3. Read brain/decisions.md. Identify entries from the past 7 days.
4. Read brain/wins.md. Identify entries from the past 7 days.
5. Run `git log --since='7 days ago' --oneline` for commit activity.

### Step 2: Synthesize

Group the week's content into:
- **What you did** (from MEMORY)
- **What you decided** (from decisions.md)
- **What you learned** (from learnings.md)
- **What you won** (from wins.md)
- **What's still open** (from most recent MEMORY entry)

### Step 3: Produce the Digest

Output in this format:

```
**📊 WEEKLY DIGEST — [PROJECT_NAME]**
**[Week starting DATE → ending DATE]**

---

**🛠 WHAT YOU DID THIS WEEK**

[Synthesize the MEMORY entries into 3-5 bullet points. Group related sessions. Don't list every session — synthesize.]

**🎯 WHAT YOU DECIDED**

[List each decision with one-line summary. If none, omit this section.]

**💡 WHAT YOU LEARNED**

[List learnings from the past 7 days. If none, write: "No new learnings captured this week. Consider what insights you might have missed."]

**🏆 WHAT YOU WON**

[List wins. If none, write: "No wins logged this week. Even small wins compound — capture them."]

**📍 STILL OPEN**

[From most recent MEMORY entry's "Open items" section]

**📈 ACTIVITY**

- [X] sessions this week
- [X] commits
- Last session: [date]

---

[ONE PARAGRAPH OF SYNTHESIS — Claude-generated 2-3 sentence observation about the week.]

What's the focus for next week?
```

### Step 4: Wait

End by asking about next week's focus. Don't proceed to other work until the user responds.

### Step 5: Optional Capture

If the user shares their next-week focus, offer: "Want me to add that to MEMORY.md as a forward-looking note?"

If yes, append to MEMORY.md under a "Next week focus" line in the most recent entry.

---

## Notes for Claude Executing This Skill

- **The synthesis paragraph at the end is the magic.** It should sound like a thoughtful observer noticing patterns — not a status report. Examples:
  - "Heavy decision-making week. You closed several open questions and locked in pricing. Now the work shifts from deciding to building."
  - "Quiet week on output, but the learnings are sharp. Your understanding of the avatar shifted twice. That's groundwork that compounds."
  - "Lots of commits, light on captured learnings. Worth asking yourself what you discovered — there's likely intelligence going uncaptured."

- If the past 7 days have ZERO activity, output: "No activity in the past 7 days. Run `/perfectlittlebusiness:start` to pick a project back up."

- Don't pad with generic motivational language. The PLB voice is calm, intelligent, honest. Sometimes the honest digest is: "Quiet week. That's fine. Even quiet weeks compound."

- This is a read-mostly skill. Only writes to MEMORY.md if the user provides a next-week focus AND approves capturing it.

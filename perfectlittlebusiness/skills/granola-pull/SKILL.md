---
name: granola-pull
description: Pull a Granola meeting into your brain folder. Saves transcript and notes, then surfaces candidate learnings worth capturing. Requires Granola MCP connection.
---

# /perfectlittlebusiness:granola-pull — Granola → Brain Importer

## Purpose

Pull meeting notes and transcripts from Granola directly into the user's brain folder. Surface candidate learnings worth capturing into learnings.md. This is one of the signature test-drive automations.

## Requirements

- Granola MCP connector must be enabled in Claude
- User must have Granola meetings available

If the Granola MCP is not connected, this skill will detect that and explain how to enable it.

## When To Use

- After a meaningful client conversation
- After a sales call worth analyzing
- After a strategy session
- After any meeting where insights emerged worth keeping

## Execution Instructions

### Step 1: Verify Granola Access

Attempt to use Granola tools (list_meetings or query_granola_meetings).

If Granola is not connected, output:
```
The Granola MCP isn't connected to this Claude. To enable it:
1. In Claude settings, find Connectors
2. Connect Granola
3. Re-run /perfectlittlebusiness:granola-pull

For now, you can paste meeting notes directly and I'll save them to brain/reference/meetings/ manually.
```

Stop. Wait for user to either connect or paste content.

### Step 2: Identify the Meeting

Ask the user:
"Which meeting do you want to pull? Tell me roughly when it happened or the title, and I'll find it."

Use the Granola list_meetings or query_granola_meetings tool to find candidate meetings. Present up to 5 matches:

```
Found these meetings:
1. [Date] — [Title] (with [participants])
2. [Date] — [Title]
3. ...

Which one?
```

### Step 3: Fetch the Meeting

Once user confirms, use get_meetings to fetch full meeting details and get_meeting_transcript to fetch the transcript.

### Step 4: Save to Brain

Save to `brain/reference/meetings/[YYYY-MM-DD]-[meeting-slug].md`

Format:

```markdown
# [Meeting Title]

**Date:** [YYYY-MM-DD]
**Participants:** [list]
**Duration:** [if available]
**Source:** Granola

---

## Notes

[The structured notes from Granola]

---

## Transcript

[Full transcript]
```

If the meetings/ subfolder doesn't exist, create it.

### Step 5: Surface Candidate Learnings

Read the meeting carefully. Identify 3-5 candidate insights that might be worth capturing into learnings.md. Look for:

- **Customer language** — exact phrases the client used (potential avatar voice)
- **Pain points named** — problems articulated clearly
- **Objections raised** — what's blocking the buy
- **What's resonating** — language or framing that landed
- **What's not landing** — moments where things went flat
- **Market signals** — competitive intelligence, trends mentioned
- **Decisions hinted at** — moments where the client showed buying intent or pulled back

Output:

```
✅ Saved to brain/reference/meetings/[filename]

**Candidate learnings I noticed:**

1. **[Section: e.g., Market Signals]** — [Specific insight, with quote or paraphrase]
2. **[Section]** — [Insight]
3. **[Section]** — [Insight]
4. **[Section]** — [Insight]
5. **[Section]** — [Insight]

Which (if any) should I capture into brain/learnings.md? You can say "1, 3, and 4" or "none" or "all of them."
```

### Step 6: Capture Selected Learnings

For each selected candidate, append to the appropriate section of learnings.md (dated today). Update "Last updated" at the bottom.

If user selects "none," output: "Got it. Meeting saved, no learnings captured. You can revisit later."

If user selects "all," capture all five.

### Step 7: Confirm

Output:

```
✅ Done.

**Saved:** brain/reference/meetings/[filename]
**Captured:** [X] learnings to brain/learnings.md

Want to also run /perfectlittlebusiness:decide if this meeting led to a decision?
```

---

## Notes for Claude Executing This Skill

- **Candidate learnings should be specific.** Not "client liked the offer." Yes: "Client paused at the $25K price point and asked about payment terms — suggests anchoring at lower entry asset may help bridge."
- **Quote customer language when relevant** — exact words are gold for avatar profile and voice samples.
- **Don't capture obvious or generic insights.** "Client wants results" is not a learning. "Client framed success as 'predictability' three times — predictability may be a stronger conversion lever than ROI" is.
- If the transcript is very long, focus the candidate-learnings analysis on the most insight-dense sections (usually the objections, the decision-points, the language around outcomes).
- If the meeting is genuinely boring (status check, scheduling), say so: "This meeting was mostly logistics. Saved for reference but no candidate learnings worth capturing."

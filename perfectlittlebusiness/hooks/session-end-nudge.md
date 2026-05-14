# Session-End Nudge — Behavior Spec

> **Implementation:** [`scripts/session-end-nudge.js`](scripts/session-end-nudge.js)
> **Wired in:** [`hooks.json`](hooks.json) — `UserPromptSubmit`
>
> This document describes the intent and behavior of the hook. The active code that Claude Code runs lives in the script linked above. The script approximates "long session" by transcript size (≥ 4 KB) rather than wall-clock duration, since hooks do not have reliable session-start time.

## Purpose

The self-improvement loop depends on `/perfectlittlebusiness:end` being run at session close. But users often forget — especially toward the end of long sessions when energy is low. This hook catches them at natural closing moments and offers the nudge.

## How It Works

This hook evaluates the user's message at submit time. It looks for two things:

1. **Session duration:** Has the session been running for 90+ minutes? (Approximated by message count + time signals in conversation.)

2. **Natural closing signals:** Does the user's message contain wrap-up language?

If both are true, the hook surfaces a gentle suggestion AFTER Claude's normal response.

## Natural Closing Signal Patterns

The hook detects phrases like:
- "ok thanks" / "thank you" / "thanks for the help"
- "that's all for today" / "that's it for now"
- "I need to go" / "I have to run" / "gotta run"
- "let's pick this up later" / "we'll continue tomorrow"
- "good for now" / "this is good"
- "talk later" / "see you later"
- "I'm done" / "wrapping up"
- Single-word closers: "perfect," "great," "awesome" — when said after a substantive response

## Behavior When Triggered

After Claude's normal response to the user's message, append a soft suggestion in a new paragraph:

```
---

*Quick check: sounds like you might be wrapping up this session. Want to run `/perfectlittlebusiness:end` to capture what you learned today? Takes ~30 seconds and feeds the brain.*
```

That's it. No demand. No interruption. Just a gentle pointer.

## Behavior When NOT Triggered

If duration is under 90 minutes OR no closing signals detected, do nothing extra. The hook stays silent.

## Anti-Spam Rule

Once this nudge has been surfaced in a session, do NOT surface it again — even if the user sends more closing signals. Suggesting once is helpful; suggesting twice is nagging.

## False Positive Tolerance

Some users will say "thanks" mid-session and not actually be closing. That's fine. The nudge is gentle enough that it doesn't disrupt — and it offers `/perfectlittlebusiness:end` as an option, not a command. If they keep working, they keep working.

## Implementation Note

This hook is implemented as a behavioral pattern for Claude. At message submit time:

1. Estimate session duration based on message count (each typical exchange ≈ 5-10 minutes; sessions over ~12 substantive exchanges have likely crossed the 90-minute mark)
2. Pattern-match the user's message for closing signals
3. If both conditions met AND no prior nudge in this session, append the suggestion to the response

## Critical Rules

- **Only once per session.** Never nag.
- **Soft language.** Italics, framed as a question, not a command.
- **Always optional.** Never blocks or delays Claude's actual response to the user's message.
- **Skip in error states.** If Claude is mid-error or mid-troubleshooting, no nudge — it adds noise.

## Why This Matters

The biggest leak in the operating system is sessions that end without `/perfectlittlebusiness:end`. Without it:
- MEMORY.md has gaps
- learnings.md doesn't grow
- wins.md doesn't grow
- The self-improvement loop breaks

A single gentle nudge at the right moment recovers most of those losses. That's why this hook earns its keep.

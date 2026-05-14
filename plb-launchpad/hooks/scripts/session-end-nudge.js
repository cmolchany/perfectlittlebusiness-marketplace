#!/usr/bin/env node
// PLB session-end-nudge hook
// On UserPromptSubmit: if the prompt looks like a farewell AND the session is
// substantive AND /end hasn't been invoked yet, inject additional context that
// suggests Claude offer to run /end before closing. Never blocks. Fires at most
// once per session.

const fs = require('fs');
const path = require('path');

let input = '';
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  let data;
  try {
    data = JSON.parse(input || '{}');
  } catch {
    process.exit(0);
  }

  const prompt = (data.prompt || '').trim();
  const transcriptPath = data.transcript_path || '';

  if (!prompt) process.exit(0);

  // Farewell patterns — must be the dominant intent of the message, not just a
  // greeting in passing. We require the pattern to be a meaningful share of the
  // message (short message OR the pattern at the end).
  const farewellPatterns = [
    /\b(good\s*bye|goodbye|good\s*night)\b/i,
    /\b(see\s*you|talk\s*(to\s*you\s*)?later|catch\s*you\s*later|until\s*next\s*time)\b/i,
    /\b(that'?s\s*all|all\s*done|we'?re\s*done|i'?m\s*done|done\s*for\s*(today|now|the\s*day))\b/i,
    /\b(wrap(ping)?\s*(up|this\s*up)?|let'?s\s*wrap)\b/i,
    /\b(closing\s*(it|this|the\s*session)|shutting\s*down|signing\s*off|logging\s*off)\b/i,
    /\b(call\s*it\s*a\s*(day|night|wrap))\b/i,
    /^(thanks|thank you|thx|ty)[\s,!.]*$/i,
    /^(perfect|great|awesome|love it|amazing)[\s,!.]*$/i
  ];

  const isFarewell = farewellPatterns.some((re) => re.test(prompt));
  if (!isFarewell) process.exit(0);

  // Avoid firing in tiny sessions where there's nothing worth capturing yet.
  // Transcript file size is the cheapest proxy. Threshold tuned low enough that
  // any real working session crosses it.
  if (transcriptPath) {
    try {
      const stat = fs.statSync(transcriptPath);
      if (stat.size < 4096) process.exit(0);
    } catch {
      // No transcript yet — skip the nudge rather than misfiring.
      process.exit(0);
    }

    // If /end already ran this session, stay silent.
    try {
      const transcript = fs.readFileSync(transcriptPath, 'utf8');
      const lower = transcript.toLowerCase();
      if (lower.includes('/end') || lower.includes('"name":"end"') || lower.includes('session closer (self-improvement loop)')) {
        process.exit(0);
      }
      // Anti-spam: if a previous nudge fired this session, stay silent.
      if (transcript.includes('[plb-session-end-nudge]')) {
        process.exit(0);
      }
    } catch {
      // Unreadable transcript — fail open, skip the nudge.
      process.exit(0);
    }
  } else {
    // No transcript path provided — be conservative, don't nudge.
    process.exit(0);
  }

  const message = [
    '[plb-session-end-nudge]',
    'The user looks like they are wrapping up this session and `/end` has not been invoked yet.',
    'Before answering, briefly offer to run `/end` to:',
    '  • capture any new learning into brain/learnings.md',
    '  • capture any win into brain/wins.md',
    '  • update MEMORY.md',
    '  • commit changes',
    'Keep it one sentence. Frame as an option, not a requirement. If they decline or ignore, drop it and respond normally. Do not nag.'
  ].join('\n');

  // UserPromptSubmit hook output: additionalContext is injected into the
  // conversation before Claude responds.
  const output = {
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: message
    }
  };

  process.stdout.write(JSON.stringify(output));
  process.exit(0);
});

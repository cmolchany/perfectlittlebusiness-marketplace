# Credential Guard — Behavior Spec

> **Implementation:** [`scripts/credential-guard.js`](scripts/credential-guard.js)
> **Wired in:** [`hooks.json`](hooks.json) — `PreToolUse` matcher `Bash`
>
> This document describes the intent and behavior of the hook. The active code that Claude Code runs lives in the script linked above. Edit both when changing behavior.

## Purpose

Most Launchpad participants are subject matter experts, not developers. They will, at some point, try to commit a `.env` file or an API key. This hook catches that before it happens.

## How It Works

This hook fires before any `git commit` command. Claude is instructed to:

1. Run `git diff --cached` to see what's about to be committed
2. Scan the diff for credential patterns
3. If found, abort the commit and surface the issue to the user

## Patterns To Detect

**File patterns that should never be committed:**
- `.env`, `.env.*` (any environment file)
- `*.key`, `*.pem` (cryptographic keys)
- Files literally named `secrets`, `credentials`, `password`
- `*.p12`, `*.pfx` (certificate stores)

**Content patterns within files:**
- `API_KEY=` or `api_key=` followed by characters
- `SECRET=` or `secret=` followed by characters
- `PASSWORD=` or `password=` followed by characters
- `TOKEN=` or `token=` followed by characters (with reasonable length, to avoid false positives)
- Long random strings that look like keys (40+ character alphanumeric strings outside of obvious code contexts)
- Stripe keys (start with `sk_live_`, `sk_test_`, `pk_live_`, `pk_test_`)
- AWS keys (`AKIA`-prefixed)
- Anthropic keys (start with `sk-ant-`)
- OpenAI keys (start with `sk-` followed by 48+ characters)
- GitHub tokens (`ghp_`, `gho_`, `ghs_`, `ghr_`)
- Supabase keys (anon and service keys)
- GoHighLevel API keys
- Twilio account SIDs and auth tokens

## Behavior When Credentials Are Detected

Output:
```
🚨 CREDENTIAL GUARD — Commit Blocked

Detected potential credential in this commit:

File: [filename]
Pattern: [type of credential detected]
Preview: [first 10 characters + "..." — never show the full key]

This commit has been BLOCKED to protect your security.

To proceed:

1. **If this is a real credential:**
   - Remove it from the file
   - Add the file (or *.env) to .gitignore
   - Use environment variables or a secrets manager instead
   - I can help you set this up — just ask

2. **If this is a false positive** (e.g., a string that looks like a key but isn't):
   - Tell me "this is a false positive, allow the commit"
   - I'll proceed but note the override in MEMORY.md

3. **To cancel the commit entirely:**
   - Tell me "cancel"

Which?
```

Wait for user response.

## Behavior on False Positive Override

If user explicitly says "false positive, allow":
- Proceed with the commit
- Append a brief note to MEMORY.md: "Credential guard override: [filename] — user marked as false positive."

## Behavior on Real Credential

If user confirms it's real:
- Do NOT proceed with the commit
- Help user:
  1. Remove the credential from the file
  2. Update .gitignore to exclude the file going forward
  3. If the credential was already in git history from a previous commit, warn: "This credential may already be in your git history. Consider rotating the key for safety."
  4. After cleanup, retry the commit

## Critical Rules

- **Never log or echo the actual credential content.** Always truncate to first 10 chars with "..." appended.
- **Never auto-override.** User must explicitly approve every false positive.
- **Block by default.** When in doubt, surface and ask.
- **Note all overrides in MEMORY.md** so there's an audit trail.

## Implementation Note

This hook is implemented as a behavioral rule for Claude. Before running any `git commit` command, Claude runs `git diff --cached` and applies these detection patterns. If any pattern matches, the commit is paused for user confirmation.

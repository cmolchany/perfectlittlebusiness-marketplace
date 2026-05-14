# Hooks

Three protective hooks ship with plb-launchpad. They fire automatically at Claude Code lifecycle events — no setup required after the plugin installs.

## What's in this folder

```
hooks/
├── hooks.json                          ← Claude Code reads this. Wires events → scripts.
├── scripts/
│   ├── credential-guard.js             ← real implementation
│   ├── forbidden-language-guard.js     ← real implementation
│   └── session-end-nudge.js            ← real implementation
├── credential-guard.md                 ← reference doc (behavior spec)
├── forbidden-language-guard.md         ← reference doc (behavior spec)
└── session-end-nudge.md                ← reference doc (behavior spec)
```

`hooks.json` is the file Claude Code reads. The `.md` files document intent — they are not picked up automatically.

## The three hooks

| Hook | Event | Behavior |
|---|---|---|
| `credential-guard` | `PreToolUse` on `Bash` | Inspects `git diff --cached` before any `git commit`. Blocks if it sees `.env` / `.key` files, Stripe / AWS / Anthropic / OpenAI / GitHub / Slack / Google keys, JWTs, or obvious password/token assignments. User can override with "credential guard false positive, proceed." |
| `forbidden-language-guard` | `PreToolUse` on `Write \| Edit \| MultiEdit` | Scans content for anti-PLB language (hustle, crush it, guru, level up, passive income, game-changer, AI-tell phrases). Blocks the write and asks the user to rephrase, override, or cancel. Exempts the hook scripts themselves and skips code files. |
| `session-end-nudge` | `UserPromptSubmit` | When a substantive session shows farewell signals and `/end` hasn't been invoked, injects a single nudge so Claude offers `/end` before closing. Fires at most once per session. |

## Requirements

- **Node.js** — Claude Code already requires Node, so this is a free assumption.
- No third-party dependencies. Each script is a single file using only `node:` built-ins.

## How to test locally

Each script reads JSON on stdin and exits 0 (allow) or 2 (block, with stderr).

```bash
# credential-guard — should allow (not a git commit)
echo '{"tool_input":{"command":"ls"}}' | node scripts/credential-guard.js
echo "exit: $?"

# forbidden-language-guard — should block on "crush it"
echo '{"tool_name":"Write","tool_input":{"file_path":"draft.md","content":"You will crush it."}}' \
  | node scripts/forbidden-language-guard.js
echo "exit: $?"
```

## Adjusting the patterns

- Credential patterns → edit `scripts/credential-guard.js` (`filePatterns`, `contentPatterns`).
- Forbidden phrases → edit `scripts/forbidden-language-guard.js` (`phrases`). The hook only fires on the most clear-cut violations to avoid false-positive fatigue.
- Farewell detection → edit `scripts/session-end-nudge.js` (`farewellPatterns`).

After a change, bump the plugin version in `.claude-plugin/plugin.json` and push. Users run `/plugin update plb-launchpad@plb` to pull the new hooks.

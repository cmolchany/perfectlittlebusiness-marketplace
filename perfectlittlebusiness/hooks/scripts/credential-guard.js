#!/usr/bin/env node
// PLB credential-guard hook
// Blocks `git commit` commands when staged changes contain likely secrets.
// Fires on PreToolUse for Bash. Exits 2 (blocking) with a stderr message that
// Claude relays to the user. The user can explicitly approve a false-positive
// override; the hook itself never auto-allows.

const { execSync } = require('child_process');

let input = '';
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  let data;
  try {
    data = JSON.parse(input || '{}');
  } catch {
    process.exit(0);
  }

  const command = (data.tool_input && data.tool_input.command) || '';
  const cwd = data.cwd || process.cwd();

  // Only act on git commit. Catch `git commit`, `git -C ... commit`, etc.
  if (!/\bgit\b[^\n]*\bcommit\b/.test(command)) {
    process.exit(0);
  }

  // Gather what's staged.
  let diff = '';
  let stagedFiles = [];
  try {
    diff = execSync('git diff --cached --no-color', { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    stagedFiles = execSync('git diff --cached --name-only', { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    // Not a git repo, nothing staged, or git not available — let git itself respond.
    process.exit(0);
  }

  if (!diff && stagedFiles.length === 0) {
    process.exit(0);
  }

  const filePatterns = [
    { re: /(^|\/)\.env(\..+)?$/i, label: 'environment file (.env)' },
    { re: /\.key$/i, label: 'private key file (.key)' },
    { re: /\.pem$/i, label: 'PEM key/cert file (.pem)' },
    { re: /\.p12$/i, label: 'certificate store (.p12)' },
    { re: /\.pfx$/i, label: 'certificate store (.pfx)' },
    { re: /(^|\/)secrets?(\.[^/]+)?$/i, label: 'file literally named "secret(s)"' },
    { re: /(^|\/)credentials?(\.[^/]+)?$/i, label: 'file literally named "credentials"' },
    { re: /(^|\/)id_rsa(\.[^/]+)?$/i, label: 'SSH private key (id_rsa)' },
    { re: /(^|\/)id_ed25519(\.[^/]+)?$/i, label: 'SSH private key (id_ed25519)' }
  ];

  const blockedFiles = [];
  for (const file of stagedFiles) {
    for (const { re, label } of filePatterns) {
      if (re.test(file)) {
        blockedFiles.push({ file, label });
        break;
      }
    }
  }

  const contentPatterns = [
    { name: 'Stripe live secret key', re: /\bsk_live_[A-Za-z0-9]{16,}\b/g },
    { name: 'Stripe test secret key', re: /\bsk_test_[A-Za-z0-9]{16,}\b/g },
    { name: 'Stripe publishable key', re: /\bpk_live_[A-Za-z0-9]{16,}\b/g },
    { name: 'AWS access key ID', re: /\bAKIA[0-9A-Z]{16}\b/g },
    { name: 'Anthropic API key', re: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g },
    { name: 'OpenAI API key', re: /\bsk-[A-Za-z0-9]{40,}\b/g },
    { name: 'GitHub personal access token', re: /\bghp_[A-Za-z0-9]{30,}\b/g },
    { name: 'GitHub OAuth token', re: /\bgho_[A-Za-z0-9]{30,}\b/g },
    { name: 'GitHub server token', re: /\bghs_[A-Za-z0-9]{30,}\b/g },
    { name: 'GitHub refresh token', re: /\bghr_[A-Za-z0-9]{30,}\b/g },
    { name: 'Slack token', re: /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/g },
    { name: 'Google API key', re: /\bAIza[0-9A-Za-z_-]{35}\b/g },
    { name: 'JWT', re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g },
    { name: 'PEM private key block', re: /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/g },
    { name: 'API key assignment', re: /\b(?:api[_-]?key|apikey)\s*[:=]\s*['"][^'"\n]{16,}['"]/gi },
    { name: 'Secret assignment', re: /\bsecret(?:[_-]?key)?\s*[:=]\s*['"][^'"\n]{16,}['"]/gi },
    { name: 'Password assignment', re: /\bpassword\s*[:=]\s*['"][^'"\n]{8,}['"]/gi },
    { name: 'Token assignment', re: /\b(?:auth[_-]?token|access[_-]?token|bearer[_-]?token)\s*[:=]\s*['"][^'"\n]{20,}['"]/gi }
  ];

  const findings = [];
  for (const { name, re } of contentPatterns) {
    const match = diff.match(re);
    if (match && match.length) {
      const sample = match[0];
      const preview = sample.length > 10 ? sample.slice(0, 10) + '...' : sample;
      findings.push({ name, preview });
    }
  }

  if (blockedFiles.length === 0 && findings.length === 0) {
    process.exit(0);
  }

  const lines = [
    '🚨 CREDENTIAL GUARD — commit blocked',
    '',
    'This commit contains content that looks like a real credential.',
    ''
  ];

  if (blockedFiles.length) {
    lines.push('Sensitive file(s) staged:');
    for (const { file, label } of blockedFiles) {
      lines.push(`  • ${file}  (${label})`);
    }
    lines.push('');
  }

  if (findings.length) {
    lines.push('Sensitive content in the staged diff:');
    for (const { name, preview } of findings) {
      lines.push(`  • ${name}  (preview: ${preview})`);
    }
    lines.push('');
  }

  lines.push('Your options:');
  lines.push('  1. Remove the credential, add the file to .gitignore, re-stage, retry.');
  lines.push('     (Treat anything that was ever staged as already leaked — rotate the real key.)');
  lines.push('  2. False positive? Tell Claude: "credential guard false positive, proceed."');
  lines.push('  3. Cancel: tell Claude "cancel the commit."');
  lines.push('');
  lines.push('Never paste the full credential back into chat. The preview above is truncated on purpose.');

  process.stderr.write(lines.join('\n') + '\n');
  process.exit(2);
});

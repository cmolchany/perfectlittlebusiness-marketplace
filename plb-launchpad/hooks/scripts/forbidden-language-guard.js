#!/usr/bin/env node
// PLB forbidden-language-guard hook
// Flags writes/edits that contain anti-PLB language. Exits 2 with a stderr
// message so Claude surfaces it to the user. The user can override with an
// explicit "false positive, proceed" instruction (option B from the V1 spec —
// flag and ask, never silently rephrase, never hard-block without escape).

let input = '';
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  let data;
  try {
    data = JSON.parse(input || '{}');
  } catch {
    process.exit(0);
  }

  const toolName = data.tool_name || '';
  const toolInput = data.tool_input || {};
  const filePath = toolInput.file_path || '';

  let content = '';
  if (toolName === 'Write') {
    content = toolInput.content || '';
  } else if (toolName === 'Edit') {
    content = toolInput.new_string || '';
  } else if (toolName === 'MultiEdit') {
    const edits = Array.isArray(toolInput.edits) ? toolInput.edits : [];
    content = edits.map((e) => (e && e.new_string) || '').join('\n');
  } else {
    process.exit(0);
  }

  if (!content) {
    process.exit(0);
  }

  // Skip the files that intentionally document this language.
  const exemptPaths = [
    'hooks/forbidden-language-guard',
    'hooks/scripts/forbidden-language-guard',
    '.git/'
  ];
  for (const ex of exemptPaths) {
    if (filePath.includes(ex)) process.exit(0);
  }

  // Skip code-only files where this language is structural, not voice.
  if (/\.(js|ts|tsx|jsx|py|sh|json|yaml|yml|lock|toml|ini|env)$/i.test(filePath)) {
    process.exit(0);
  }

  // Core forbidden phrases. Conservative list — the hook only fires on the most
  // clear-cut anti-PLB violations to avoid false-positive fatigue. The fuller
  // PLB voice doctrine lives in Collective Wisdom, not in this plugin.
  const phrases = [
    { phrase: 'hustle',          reason: 'frames work as grind — contradicts calm-authority posture.' },
    { phrase: 'hustling',        reason: 'frames work as grind — contradicts calm-authority posture.' },
    { phrase: 'grindset',        reason: 'hustle-culture language — contradicts The Prize Never Chases.' },
    { phrase: 'rise and grind',  reason: 'hustle-culture language — contradicts The Prize Never Chases.' },
    { phrase: 'crush it',        reason: 'bro-energy — incompatible with PLB voice.' },
    { phrase: 'crushing it',     reason: 'bro-energy — incompatible with PLB voice.' },
    { phrase: 'killing it',      reason: 'bro-energy — incompatible with PLB voice.' },
    { phrase: 'level up',        reason: 'gamified motivational language — PLB voice is methodological, not motivational.' },
    { phrase: 'next level',      reason: 'gamified motivational language — replace with the specific shift.' },
    { phrase: '10x',             reason: 'inflated metric — PLB methodology earns authority through specificity.' },
    { phrase: 'passive income',  reason: 'implies effortlessness — contradicts Proof Before Sales.' },
    { phrase: 'game-changer',    reason: 'AI/marketing cliché — PLB voice values precision over hype.' },
    { phrase: 'game changer',    reason: 'AI/marketing cliché — PLB voice values precision over hype.' },
    { phrase: 'guru',            reason: 'implies follower-culture — PLB positions clients as authorities, not disciples.' },
    { phrase: 'thought leader',  reason: 'overused and unspecific — name the actual expertise instead.' },
    { phrase: 'rockstar',        reason: 'hype label — replace with the specific value.' },
    { phrase: 'ninja',           reason: 'hype label — replace with the specific role.' },
    { phrase: 'unlock the power of', reason: 'AI signature phrase — PLB voice avoids these on principle.' },
    { phrase: "let's dive in",   reason: 'AI signature phrase — get to the substance directly.' },
    { phrase: "let's unpack",    reason: 'AI signature phrase — get to the substance directly.' }
  ];

  const findings = [];
  for (const { phrase, reason } of phrases) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Word-boundary if the phrase starts/ends with a word char; loose otherwise.
    const startsWord = /^\w/.test(phrase);
    const endsWord = /\w$/.test(phrase);
    const pattern = `${startsWord ? '\\b' : ''}${escaped}${endsWord ? '\\b' : ''}`;
    const re = new RegExp(pattern, 'gi');
    const match = re.exec(content);
    if (match) {
      const start = Math.max(0, match.index - 25);
      const end = Math.min(content.length, match.index + phrase.length + 25);
      const context = content.slice(start, end).replace(/\s+/g, ' ').trim();
      findings.push({ phrase, reason, context });
    }
  }

  if (findings.length === 0) {
    process.exit(0);
  }

  const lines = [
    '⚠️  PLB LANGUAGE GUARD — flagged anti-PLB language',
    ''
  ];
  if (filePath) {
    lines.push(`File: ${filePath}`);
    lines.push('');
  }
  lines.push('Detected:');
  for (const { phrase, reason, context } of findings) {
    lines.push(`  • "${phrase}" — ${reason}`);
    lines.push(`    Context: "...${context}..."`);
  }
  lines.push('');
  lines.push('Your options:');
  lines.push('  1. Rephrase using your own brand voice (the three-word essence from your CLAUDE.md).');
  lines.push('  2. False positive (quoting a source, defining what to avoid, etc.)?');
  lines.push('     Tell Claude: "language guard false positive, proceed."');
  lines.push('  3. Cancel the write: tell Claude "cancel."');
  lines.push('');
  lines.push('This is a guard, not a censor. You always have the override.');

  process.stderr.write(lines.join('\n') + '\n');
  process.exit(2);
});

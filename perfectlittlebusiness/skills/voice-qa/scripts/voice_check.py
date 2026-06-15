#!/usr/bin/env python3
"""
voice_check.py - deterministic, brand-agnostic voice-QA pass.

Catches the universal "this reads like AI / weak writing" tells (em/en-dashes,
filler amplifiers, AI-slop constructions) so the model can focus on your brand's
OWN rules - loaded from your brand voice file - and the judgment calls
(zombie nouns, voice feel, demonstrate-don't-narrate).

Usage:
    python3 voice_check.py <draft_file>

Exit code 0 = no FAILs found. Exit code 1 = at least one FAIL.

This is a first-pass scanner, NOT the whole rubric. The skill applies your
brand-specific checks (from your voice rules) and the judgment checks on top.
Your brand's own voice rules are always the final authority.
"""

import re
import sys

# ---- FAIL: em/en-dashes are the strongest "written by AI" tell ----
DASHES = {
    "em-dash (—)": "—",
    "en-dash (–)": "–",
}

# ---- FLAG: universal AI-slop constructions ----
BANNED_CONSTRUCTIONS = [
    r"it'?s not (just )?[\w\s]+?[,.]? it'?s",
    r"this isn'?t [\w\s]+?[,.]? this is",
    r"here'?s the thing",
    r"here'?s what most people miss",
    r"the truth is",
    r"what if i told you",
    r"imagine this",
    r"picture (this|yourself)",
    r"in a world where",
    r"let me explain",
    r"let'?s break this down",
    r"whether you'?re [\w\s]+? or ",
    r"more than just ",
    r"not your average ",
    r"^\s*(look|listen),",
    r"trust me when i say",
    r"let'?s be honest",
    r"that'?s where [\w\s]+? comes in",
]

# ---- FLAG: universal filler / AI amplifiers ----
BANNED_WORDS = [
    r"\bleverage(s|d|ing)?\b", r"\bnavigat(e|es|ed|ing)\b", r"\brobust\b",
    r"\bseamless(ly)?\b", r"\belevate(s|d|ing)?\b", r"\bunleash(es|ed|ing)?\b",
    r"\bunlock(s|ed|ing)?\b", r"\btransformative\b", r"\bgame-?changer\b",
    r"\bdeep dive\b", r"\bcrucial\b", r"\bvital\b", r"\bessential\b",
    r"\btruly\b", r"\breally\b", r"\bvery\b", r"\bactually\b",
    r"\bpowerful\b", r"\brevolutionary\b", r"\bcutting-?edge\b",
    r"\bnext-?level\b", r"\bworld-?class\b", r"\bultimate\b",
]


def scan(path):
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    fails, flags = [], []

    # FAILs: dashes
    for label, ch in DASHES.items():
        for i, ln in enumerate(lines, 1):
            if ch in ln:
                fails.append((i, label, ln.strip()[:80]))

    # FLAGs: constructions + filler words
    for i, ln in enumerate(lines, 1):
        low_ln = ln.lower()
        for pat in BANNED_CONSTRUCTIONS:
            if re.search(pat, low_ln, re.IGNORECASE):
                flags.append((i, "banned construction", ln.strip()[:80]))
        for pat in BANNED_WORDS:
            for m in re.finditer(pat, low_ln):
                flags.append((i, "filler/amplifier: %s" % m.group(0), ln.strip()[:80]))

    return fails, flags


def main():
    if len(sys.argv) < 2:
        print("usage: voice_check.py <draft_file>")
        sys.exit(2)
    path = sys.argv[1]

    fails, flags = scan(path)

    print("VOICE QA (deterministic pass)")
    print("=" * 52)
    if not fails:
        print("VERDICT: no mechanical FAILs ✅  (brand + judgment checks still required)")
    else:
        print("VERDICT: FAIL ❌  (%d must-fix)" % len(fails))

    if fails:
        print("\nMUST FIX (FAIL):")
        for ln, rule, txt in fails:
            loc = "line %d" % ln if ln else "document"
            print('  [%s] %s' % (loc, rule) + (('  "%s"' % txt) if txt else ""))

    if flags:
        print("\nREVISE (FLAG) - %d:" % len(flags))
        for ln, rule, txt in flags:
            loc = "line %d" % ln if ln else "document"
            print('  [%s] %s' % (loc, rule) + (('  "%s"' % txt) if txt else ""))

    print("\nReminder: this is the universal mechanical pass only. Apply your")
    print("brand's own voice rules and the judgment checks (zombie nouns,")
    print("voice feel, demonstrate-don't-narrate) on top.")

    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()

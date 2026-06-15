---
name: conviction-map
description: Build your Conviction Map, the third of the five foundational tools in your AIOS Brain. Use when the user wants to map their convictions, beliefs, contrarian point of view, or what they stand for, or says "conviction map", "step 3", "map my beliefs", "my point of view". Runs the live Conviction Map stage from Authority HQ.
---

# Conviction Map (AIOS Brain · Tool 3 of 5)

A thin wrapper that runs the Perfect Little Business **Conviction Map** stage live from Authority HQ. The methodology lives server-side; this skill fetches it and conducts the stage with the user. (Thin-skill / fat-server: the prompt is never copied into this file, so it stays current and client-shippable.)

## How it runs

1. **Fetch the stage.** Call the `get_stage_prompt` tool from the **Perfect Little Business** connector with `stage_key: "conviction_map"`.
   - If the tool isn't available, the connector isn't connected — tell the user to connect the **Perfect Little Business** connector (Customize → Connectors), then retry.
   - If it returns a *"not an active client yet"* message instead of a prompt, relay that warmly and stop — their account isn't active.

2. **Adopt the returned prompt.** The tool returns a `system_prompt` and an `opening_message`. For the rest of this conversation, operate **exactly** as that `system_prompt` instructs — it is your complete operating instruction for this stage. Open by presenting the `opening_message` to the user.

3. **Conduct the stage.** Follow the system prompt's flow precisely — it controls the questions, the layers, and how completion works. One step at a time. Do not add, skip, reorder, or summarize away anything it specifies.

4. **Save the output.** When the stage completes, save the finished output to the user's AIOS Brain as `brain/convictions.md` (create the folder if needed). Tell the user where it's saved.
   - *Server sync note:* writing the result back to Authority HQ is coming via a dedicated write tool. For now the canonical copy is the local file.

## Scope

Run only the Conviction Map stage. If the user asks for something else, point them to the right sibling skill — `avatar-profile`, `offer-architect`, `brand-style-guide`, `source-of-truth` — and return here.

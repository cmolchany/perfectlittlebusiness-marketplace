---
name: brand-style-guide
description: Build your Brand Style Guide — Step 4 of the Authority Directory Method. Use when the user wants to define their brand voice, tone, style, or visual identity, or says "brand style guide", "step 4", "my brand voice", "define my brand". Runs the live Brand Style Guide stage from Authority HQ.
---

# Brand Style Guide — Launchpad Stage 4

A thin wrapper that runs the Perfect Little Business **Brand Style Guide** stage live from Authority HQ. The methodology lives server-side; this skill fetches it and conducts the stage with the user. (Thin-skill / fat-server: the prompt is never copied into this file, so it stays current and client-shippable.)

## How it runs

1. **Fetch the stage.** Call the `get_stage_prompt` tool from the **Perfect Little Business** connector with `stage_key: "brand_style_guide"`.
   - If the tool isn't available, the connector isn't connected — tell the user to connect the **Perfect Little Business** connector (Customize → Connectors), then retry.
   - If it returns a *"not an active client yet"* message instead of a prompt, relay that warmly and stop — their account isn't active.

2. **Adopt the returned prompt.** The tool returns a `system_prompt` and an `opening_message`. For the rest of this conversation, operate **exactly** as that `system_prompt` instructs — it is your complete operating instruction for this stage. Open by presenting the `opening_message` to the user.

3. **Conduct the stage.** Follow the system prompt's flow precisely — it controls the questions, the layers, and how completion works. One step at a time. Do not add, skip, reorder, or summarize away anything it specifies.

4. **Save the output.** When the stage completes, save the finished output to the user's second brain as `brain/brand-style-guide.md` (create the folder if needed). Tell the user where it's saved.
   - *Server sync note:* writing the result back to Authority HQ is coming via a dedicated write tool. For now the canonical copy is the local file.

## Scope

Run only the Brand Style Guide stage. If the user asks for something else, point them to the right sibling skill — `avatar-profile`, `offer-architect`, `conviction-map`, `source-of-truth` — and return here.

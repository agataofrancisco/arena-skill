---
name: decision-desk
description: Use when a decision is expensive, hard to undo, or keeps not getting made: pricing, hiring, raising money, a pivot, a partnership, a big spend, a legal or product call. Seats a council of lenses (cash and ruin, demand, economics, capacity, strategy, distribution, red team), runs three rounds (open, debate, ratify), scores every option deterministically with a script, and returns a verdict with conditions, kill criteria and the cheapest test. Also builds a reusable lens from public sources with quote verification, and consults one lens on its own. Not for a quick second opinion, and not for a decision with nothing at stake.
argument-hint: "[decision] [--quick] [--lenses a,b,c] | ask <lens> [question] | build <name> [--quick|--deep] | score <cards.json>"
---

# decision-desk

A structured way to decide one thing. The value is not the debate, it is that the debate is **scored by a script**, the dissent is kept, and the output names the conditions, the kill criteria and the cheapest test.

`DESK` below is this skill's folder. `RUN` is the run folder.

## Modes

- **Full council** (default): five to seven lenses, three rounds. For anything expensive or hard to undo.
- **Quick** (`--quick`): four lenses, two rounds. For reversible calls.
- **Named lenses** (`--lenses cash,economics,redteam`): only those.
- **Consult** (`ask <lens> ...`): one lens, one answer. No scoring, no run folder.
- **Build a lens** (`build <name>`): see `references/build-lens.md`.
- **Score** (`score <cards.json>`): run `scripts/score.mjs` on an existing file and report it.

## Step 1: the brief

Write `RUN/brief.md` from `references/brief.md`. This decides the result: lenses only know what is in the file.

- Neutral. Facts, options, numbers, constraints. No recommendation, and never your own view of the right answer.
- Always include the do-nothing option and the smaller version of the idea.
- Missing facts: one batch of at most four questions, then proceed with assumptions marked `(assumed)`.
- Under 300 words of prose.

## Step 2: seat the lenses

From `references/lenses.md`. Pick the lenses the decision lives in, set a weight 1 to 3 with a one-line reason, and seat `redteam` always.

Tell the user in one line who is at the table and why, then start. If the user did not ask for this and the decision is not obviously theirs to spend on, ask first with three options: full council, quick, or a plain answer.

## Step 3: Round 1, opening positions

Create `RUN/round-1.md`.

Spawn every lens **in one message**, in parallel, with the Round 1 prompt from `references/round-prompts.md`. Save each card verbatim under `## <Lens>` as it comes back. Check every card has stance, option scores, pillar score, confidence, ruin risk and door; send it back once if not.

Then add `## Chair notes` at the bottom: the weights table, the cruxes, and which lens must answer which argument in Round 2.

## Step 4: Round 2, debate

Write `RUN/round-2.md`. Each lens gets the brief, round-1, and the cruxes. Save verbatim.

After the cards land, write `RUN/draft-resolution.md`: the option being proposed, the conditions that make it work, the cheapest test, and the kill criteria. One page. This is the Chair's only act of synthesis; it takes no side beyond what the cards support.

## Step 5: Round 3, ratification

Write `RUN/round-3.md`. Each lens votes on the resolution as written, with `FINAL SCORE`. Skip Round 3 only in `--quick`, and only if every lens's top option is already the same and the spread is under 2; say that you skipped it.

## Step 6: score

Transcribe the last round's cards into `RUN/cards.json` (schema at the top of `scripts/score.mjs`) and run:

```bash
node DESK/scripts/score.mjs RUN/cards.json
```

Copy the numbers from that output. Never compute an average yourself. On `TIE` the script exits 1: decide the tie in one line, set `tieBreak`, re-run. On invalid input, fix the cards, not the script.

Save the machine-readable version too: `node DESK/scripts/score.mjs RUN/cards.json --json > RUN/verdict.json`.

## Step 7: the verdict

Write `RUN/verdict.md` from `references/verdict-template.md`, filling in the script's numbers.

Then reply to the user in under 200 words: the label and the call, the option scores on one line, the two or three arguments that carried the room, the strongest dissent, the cheapest test, and the path to `verdict.md`. Do not paste the report.

If the verdict is WAIT, name the trigger and the date. If it is RESHAPE, name the shape that would score better.

## Rules

- You are the Chair. You never argue a side, never add a lens of your own, and never overrule the score.
- Every lens gets the brief byte for byte. Never add a hint to one lens's call.
- Where the brief is silent, a lens may assume, but it must say so. A number nobody supplied is an assumption, not a fact.
- The dissent survives into the report even when the verdict is GO.
- Write plainly, in the user's language. Short sentences, no filler, no em dashes in English.
- Every run is kept in `RUN` (brief, rounds, cards, verdict). A run can be re-scored later from `cards.json` alone, which is the point.

## Without sub-agents

Run the rounds yourself, one lens at a time, and clear your head between lenses so one card does not shape the next. Same files, same prompts, same scoring. Say in the verdict that the round was run sequentially.

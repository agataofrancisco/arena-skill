# Scoring

Every number in a verdict is computed by `scripts/score.mjs`, never by the Chair in prose. The Chair transcribes the cards into `cards.json` (schema at the top of the script) and runs it. If the verdict and the script disagree, the script is right and the verdict gets fixed.

Use the last round that ran (Round 3 if it ran, else Round 2).

## Option scores

Every card scores every option 0 to 10. For each option:

`option score = sum(weight x lens's score) / sum(weight)`, one decimal.

The **recommended option** is the highest score. Show the math in one line per option, which the script prints:

`B (3x6 + 2x7 + 2x8 + 2x6) / 9 = 6.7`

## Verdict bands

| Option score | Verdict |
|---|---|
| 7.5 to 10 | GO |
| 6.0 to 7.4 | GO WITH CONDITIONS |
| 4.5 to 5.9 | RESHAPE |
| below 4.5 | DON'T DO IT |

Two labels replace the band when they fit better, and the report says why:

- **WAIT**: the recommended option is good but blocked by a prerequisite that is not met yet. WAIT must name the trigger, the date, and what happens if the trigger fails. The script refuses to emit WAIT without all three.
- **DON'T DO IT** also applies when the do-nothing option is itself the top scorer.

A **TIE** is not a verdict. The script exits 1 and names the tied options. The Chair sets `tieBreak` explicitly, after saying in one line why, and re-runs. The script never chooses.

## Overrides, applied after the band

1. **Ruin cap.** Any lens at `RUIN RISK: likely` caps the verdict at RESHAPE until the resolution names a mitigation that lens endorsed (`mitigation.endorsedBy`). One lens at ruin risk outweighs six enthusiasts.
2. **One-way door cap.** If the recommended option is a one-way door (majority of lenses) and the spread is 4 or more, cap at GO WITH CONDITIONS and make the cheapest test a precondition.
3. **Unanimity check.** If every lens's top option is the same and their scores sit within 1 point, the Chair must name the strongest unargued alternative and give it to the lens whose pillar is most at risk, in Round 2, at full strength.

The script applies 1 and 2 and warns about 3. It cannot apply 3, because that needs a new round.

## Spread and confidence

- `spread` = highest minus lowest lens score on the recommended option.
- `confidence` = average lens confidence x 2, rounded, minus 1 if the spread is 5 or more. Scale 1 to 10.

Report both, always. A 7.0 with spread 1 is a different answer from a 7.0 with spread 6.

## Pillar fixes

Each lens's `pillarScore` is its judgment of the recommended option on its own pillar alone. Any pillar at 4 or below gets a named fix under "What to do next", even when the verdict is GO.

## Vote

Round 3's `FINAL SCORE` is each lens's support for the draft resolution as written. Report the weighted average as "support for the resolution". It measures how well the resolution captured the room, not whether the idea is good.

## What the score is not

- It is not a probability. A 6.8 does not mean 68 percent likely to work.
- It is not comparable across decisions. Weights and lenses change.
- It is not a substitute for the dissent. If the verdict is GO and one lens dissents at full strength, the report carries that dissent in the founder's words, not as a footnote.

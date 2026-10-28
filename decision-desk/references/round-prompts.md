# Round prompts

Paste these into each lens's sub-agent call. Replace the bracketed parts. Lenses read the brief and the earlier rounds from the run folder, so cards stay verbatim without being pasted into every prompt.

Paths are relative to the run folder; give the absolute path once at the top of each prompt.

**Options.** Every card scores every option, including the do-nothing option. For a yes or no question, the options are "do it as proposed" and "don't".

**Pillar score.** The lens's score of the option it recommends, judged on its own pillar alone.

---

## Round 1: opening position

```
DECISION DESK, ROUND 1 OF 3: OPENING POSITION

Run folder: [absolute path]
You hold the [LENS] lens. [One line on what this lens owns.]
[If this is a built lens: also read [desk]/lenses/[id]/_hot.md, then at most three more files that fit this decision.]

Read the brief: [run]/brief.md

Your weight on this decision: [w]/3 ([one-line reason]).

Answer in plain text, under 350 words, in exactly this shape:

LENS: [LENS] ([what it owns])
STANCE: Strong yes | Yes | Conditional yes | No | Strong no   (on the option you recommend)
OPTION SCORES: [A] n/10 · [B] n/10 · [C] n/10   (how strongly you back each option)
PILLAR SCORE: n/10   ([dimension]: the option you recommend, judged on your pillar alone)
CONFIDENCE: n/5
RUIN RISK: none | possible | likely   (an irreversible downside that could sink the business or the founder)
DOOR: one-way | two-way   (how reversible is the option you recommend?)

THE CALL: one sentence, naming the option or a variant.
WHY:
1. argument, with the number or fact it rests on
2. ...
3. ...
THE RISK I SEE: the single biggest thing that goes wrong.
WHAT WOULD CHANGE MY MIND: a concrete fact or number.
WHAT I'D DO THIS WEEK: one action.
QUESTION FOR THE FOUNDER: the one question you would ask before signing off.

Rules: argue from your pillar first, at full strength. Use the brief's real numbers and say which ones you are assuming. Do not hedge to sound balanced; the Chair balances the council. If your pillar barely touches this decision, say so and score 1 point on either side.
```

---

## Round 2: debate

```
DECISION DESK, ROUND 2 OF 3: DEBATE

Run folder: [absolute path]
You hold the [LENS] lens. [Built lens: re-read [desk]/lenses/[id]/_hot.md first.]

Read: [run]/brief.md and [run]/round-1.md (every lens's card and the Chair's cruxes).

THE CRUXES THE CHAIR SEES
1. [crux]: [lenses on each side]. [If this lens is on one side, name the argument it must answer.]
2. ...

Answer in plain text, under 300 words, in exactly this shape:

LENS: [LENS]
I DISAGREE MOST WITH: [lens]. Their argument in one line, then your rebuttal using your own frame.
I CONCEDE: the strongest point another lens made against you, and what it changes. "Nothing" only if you can say why their best point fails.
ON THE CRUXES: your answer to each crux, one or two lines each.
STANCE: ...
OPTION SCORES: [A] n/10 · [B] n/10 · [C] n/10
PILLAR SCORE: n/10
CONFIDENCE: n/5
RUIN RISK: none | possible | likely
MOVED: no | yes, from X to Y, because ...
MY CONDITIONS FOR YES: up to three, concrete and checkable (a number, a date, a test result).

Rules: engage the actual arguments on the table. Move only for a better argument, never to be agreeable. If everyone agrees with you, name the weakest part of your own case.
```

---

## Round 3: ratification

```
DECISION DESK, ROUND 3 OF 3: VOTE ON THE DRAFT RESOLUTION

Run folder: [absolute path]
You hold the [LENS] lens.

Read: [run]/brief.md, your own section of [run]/round-2.md, and [run]/draft-resolution.md.

Answer in plain text, under 150 words, in exactly this shape:

LENS: [LENS]
VOTE: Endorse | Endorse with amendment | Dissent
OPTION SCORES: [A] n/10 · [B] n/10 · [C] n/10   (given the resolution's conditions)
FINAL SCORE: n/10   (your support for the draft resolution as written)
FINAL PILLAR SCORE: n/10
AMENDMENT OR DISSENT: one or two sentences. Blank if you endorse.
ONE LINE FOR THE FOUNDER: the thing from your pillar they must not forget.
```

---

## Single-lens consult

```
DECISION DESK, SINGLE-LENS CONSULT

Run folder: [absolute path]
You hold the [LENS] lens. [Built lens: read [desk]/lenses/[id]/_hot.md first.]

THE QUESTION
[question, plus any context]

Answer in under 500 words: your call, your reasoning with the numbers it rests on, what you would do this week, and the question you would ask back. Borrowed reasoning is named as borrowed. Quote only lines that are in the lens, with a source id.
```

# Lenses

A lens is a **function**, not a person. It answers one question at full strength and refuses to answer the others. That is what makes the council argue instead of nodding.

## The seven that ship

| id | Lens | Owns the question | Weighs |
|---|---|---|---|
| `cash` | Cash and ruin | What does this do to cash, runway, and the worst case? | Downside, capital, survival |
| `demand` | Real demand | Do people want this, and what is the evidence rather than the opinion? | Willingness to pay, proof of pull |
| `economics` | Unit economics | Does the math work per unit, and when does the money come back? | Price, margin, payback, CAC |
| `capacity` | Execution capacity | Who does it, with what hours, and what stops first? | Team, calendar, process readiness |
| `strategy` | Strategy and reversibility | Is this the right bet, and can we undo it? | Opportunity cost, one-way doors |
| `reach` | Distribution | Where does attention and reach come from, at what cost? | Channel, cost of reach, compounding |
| `redteam` | Red team | What is the strongest case against, and what makes this fail? | Disconfirming evidence, failure modes |

**`redteam` always sits.** It is not optional and it must dissent somewhere: a council that agrees in Round 1 has not been tested.

## Weights

Set a weight per lens before Round 1 and write the one-line reason.

| Weight | Meaning |
|---|---|
| 3 | The decision lives in this lens |
| 2 | This lens is materially affected |
| 1 | Touched at the edges |

Every lens is at least 1. Exactly one or two lenses get a 3. A pricing call should lean on `economics` and `demand`; a hiring call on `capacity` and `cash`.

Weights are not a popularity vote. They decide which doubts cost the most, so write down why each one is what it is.

## Quick council

`--quick` seats four: the highest-weight lens, `cash`, `redteam`, and the lens most likely to disagree with the rest. Two rounds, and Round 3 only if the scores did not converge.

Use quick for reversible calls. Use the full council for anything expensive or hard to undo.

## Tensions to expect

- `cash` (survive first, wait for the fat pitch) against `economics` and `reach` (the math works, so scale it now).
- `demand` (talk to ten users, do things that do not scale) against `capacity` (systemise, give it an owner, stop improvising).
- `strategy` (is this the right bet at all) against every lens that only asks whether the current bet can be executed.
- `redteam` against everyone, by design. If it stops finding anything, the brief is too soft.
- `capacity` (this costs the founder's calendar) against `reach` and `economics` (volume solves it).

## Built lenses

A lens can also be built from a body of work: a specific investor, operator, or your own past decisions. See `build-lens.md`. A built lens reads `lenses/<id>/_hot.md` first and then at most three more files that fit the decision.

Built lenses are still lenses. If the reasoning is borrowed from a real person, say so in the report, never speak as them, and quote only lines that are in the lens with a source id.

## Rules

- At most seven lenses at the table, plus two built ones.
- Every lens gets the brief verbatim. Never add a hint to one lens's call.
- The Chair never argues a side. If a point is missing, it puts it to the closest lens as a crux in the next round.
- A lens that only says "it depends" is not doing its job. Send it back once with the specific number or fact it must commit to.

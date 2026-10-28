#!/usr/bin/env node
// Deterministic scoring for a decision-desk run.
//
// The Chair must never do this arithmetic in prose. Every number in a verdict
// comes from here, so the verdict can be recomputed and audited.
//
//   node scripts/score.mjs <cards.json> [--json]
//
// cards.json:
// {
//   "decision": "Raise price to 3500",
//   "round": 3,
//   "options": ["A", "B", "C"],
//   "doNothingOption": "C",
//   "seats": [
//     { "id": "cash", "label": "Cash and downside", "weight": 3,
//       "scores": {"A": 2, "B": 6, "C": 7},
//       "confidence": 4, "ruin": "possible", "door": "two-way",
//       "pillarScore": 7, "vote": "amend" }
//   ],
//   "mitigation": { "endorsedBy": ["cash"] },
//   "wait": { "trigger": "...", "date": "2026-12-01", "ifFails": "..." },
//   "tieBreak": "B"
// }
//
// Exit 0 on a verdict, 1 on a tie that needs an explicit tieBreak,
// 2 on invalid input.

import fs from "node:fs";

const BANDS = [
  { name: "DON'T DO IT", min: -Infinity },
  { name: "RESHAPE", min: 4.5 },
  { name: "GO WITH CONDITIONS", min: 6.0 },
  { name: "GO", min: 7.5 },
];
const RANK = Object.fromEntries(BANDS.map((b, i) => [b.name, i]));

const [, , fileArg, ...rest] = process.argv;
if (!fileArg) {
  console.error("usage: score.mjs <cards.json> [--json]");
  process.exit(2);
}
const asJson = rest.includes("--json");

let cards;
try {
  cards = JSON.parse(fs.readFileSync(fileArg, "utf8"));
} catch (e) {
  console.error(`cannot read ${fileArg}: ${e.message}`);
  process.exit(2);
}

// ---------- validation ----------

const errors = [];
const options = Array.isArray(cards.options) ? cards.options : [];
if (options.length < 2) errors.push("options: need at least two, including the do-nothing option");
if (new Set(options).size !== options.length) errors.push("options: duplicate ids");

const seats = Array.isArray(cards.seats) ? cards.seats : [];
if (!seats.length) errors.push("seats: none");

const seenIds = new Set();
for (const s of seats) {
  const tag = s.label || s.id || "(unnamed seat)";
  if (!s.id) errors.push(`${tag}: missing id`);
  else if (seenIds.has(s.id)) errors.push(`${tag}: duplicate id`);
  else seenIds.add(s.id);
  if (!s.label) errors.push(`${s.id || tag}: missing label`);

  const w = Number(s.weight);
  if (!Number.isFinite(w) || w < 1 || w > 3) errors.push(`${tag}: weight must be 1 to 3`);

  for (const o of options) {
    const v = s.scores?.[o];
    if (!Number.isFinite(v) || v < 0 || v > 10) errors.push(`${tag}: score for ${o} must be 0 to 10`);
  }

  const c = Number(s.confidence);
  if (!Number.isFinite(c) || c < 1 || c > 5) errors.push(`${tag}: confidence must be 1 to 5`);

  if (s.ruin && !["none", "possible", "likely"].includes(s.ruin)) {
    errors.push(`${tag}: ruin must be none, possible or likely`);
  }
  if (s.door && !["two-way", "one-way"].includes(s.door)) {
    errors.push(`${tag}: door must be two-way or one-way`);
  }
  if (s.pillarScore !== undefined && (!Number.isFinite(Number(s.pillarScore)) || Number(s.pillarScore) < 0 || Number(s.pillarScore) > 10)) {
    errors.push(`${tag}: pillarScore must be 0 to 10`);
  }
}

if (cards.doNothingOption && !options.includes(cards.doNothingOption)) {
  errors.push(`doNothingOption "${cards.doNothingOption}" is not in options`);
}

if (cards.wait) {
  for (const k of ["trigger", "date", "ifFails"]) {
    if (!cards.wait[k]) errors.push(`wait.${k}: required (WAIT must name its trigger, date and fallback)`);
  }
}

if (errors.length) {
  console.error("invalid cards.json:");
  for (const e of errors) console.error("  " + e);
  process.exit(2);
}

// ---------- option scores ----------

const totalWeight = seats.reduce((a, s) => a + Number(s.weight), 0);

const totals = options.map((option) => {
  const terms = seats.map((s) => ({ w: Number(s.weight), v: Number(s.scores[option]), id: s.id }));
  const numerator = terms.reduce((a, t) => a + t.w * t.v, 0);
  const raw = numerator / totalWeight;
  return {
    option,
    score: Math.round(raw * 10) / 10,
    raw,
    math: `(${terms.map((t) => `${t.w}x${t.v}`).join(" + ")}) / ${totalWeight} = ${(Math.round(raw * 10) / 10).toFixed(1)}`,
  };
});

const best = Math.max(...totals.map((t) => t.score));
const leaders = totals.filter((t) => Math.abs(t.score - best) < 0.05);

let tieBroken = false;
let recommended = leaders[0];
if (leaders.length > 1) {
  const named = cards.tieBreak && leaders.find((l) => l.option === cards.tieBreak);
  if (named) {
    recommended = named;
    tieBroken = true;
  }
}

// ---------- per-seat readings ----------

const topOf = (s) =>
  options.reduce((a, o) => (Number(s.scores[o]) > Number(s.scores[a]) ? o : a), options[0]);

const recScores = seats.map((s) => Number(s.scores[recommended.option]));
const spread = Math.max(...recScores) - Math.min(...recScores);

const avgConfidence = seats.reduce((a, s) => a + Number(s.confidence), 0) / seats.length;
let confidence = Math.round(avgConfidence * 2);
if (spread >= 5) confidence -= 1;
confidence = Math.max(1, Math.min(10, confidence));

const vote = { endorse: 0, amend: 0, dissent: 0, missing: 0 };
for (const s of seats) {
  const v = String(s.vote || "").toLowerCase();
  if (v.startsWith("endorse")) vote.endorse++;
  else if (v.startsWith("amend")) vote.amend++;
  else if (v.startsWith("dissent")) vote.dissent++;
  else vote.missing++;
}

// ---------- overrides ----------

const applied = [];
let capRank = RANK["GO"];

// 1. Ruin cap: one seat at likely ruin outweighs six enthusiasts.
const ruinSeats = seats.filter((s) => s.ruin === "likely");
if (ruinSeats.length) {
  const endorsed = new Set(cards.mitigation?.endorsedBy || []);
  const uncovered = ruinSeats.filter((s) => !endorsed.has(s.id));
  if (uncovered.length) {
    capRank = Math.min(capRank, RANK["RESHAPE"]);
    applied.push(
      `ruin cap: ${uncovered.map((s) => s.label).join(", ")} at likely ruin, no endorsed mitigation. Capped at RESHAPE.`
    );
  } else {
    applied.push(
      `ruin cap lifted: ${ruinSeats.map((s) => s.label).join(", ")} endorsed the mitigation.`
    );
  }
}

// 2. One-way door cap.
const oneWayVoters = seats.filter((s) => s.door === "one-way" && topOf(s) === recommended.option);
const isOneWay = oneWayVoters.length >= Math.ceil(seats.length / 2);
if (isOneWay && spread >= 4) {
  capRank = Math.min(capRank, RANK["GO WITH CONDITIONS"]);
  applied.push(
    `one-way door cap: the recommended option is a one-way door by ${oneWayVoters.length} of ${seats.length} lenses and the spread is ${spread}. Capped at GO WITH CONDITIONS until the cheapest test clears.`
  );
}

// ---------- verdict ----------

let bandRank = 0;
for (let i = 0; i < BANDS.length; i++) if (recommended.score >= BANDS[i].min) bandRank = i;

if (cards.doNothingOption && recommended.option === cards.doNothingOption) {
  bandRank = RANK["DON'T DO IT"];
}

let label;
if (cards.wait) {
  label = "WAIT";
} else {
  label = BANDS[Math.min(bandRank, capRank)].name;
}

if (leaders.length > 1 && !tieBroken) label = "TIE";

// ---------- readings ----------

const pillarFixes = seats
  .filter((s) => s.pillarScore !== undefined && Number(s.pillarScore) <= 4)
  .map((s) => ({ id: s.id, label: s.label, pillarScore: Number(s.pillarScore) }));

const warnings = [];

if (leaders.length > 1 && !tieBroken) {
  warnings.push(
    `tie at ${best.toFixed(1)} between ${leaders.map((l) => l.option).join(", ")}. Set "tieBreak" to one of them and re-run. The script will not choose.`
  );
}

const tops = seats.map(topOf);
const unanimous = tops.every((t) => t === tops[0]);
if (unanimous && spread <= 1) {
  warnings.push(
    `unanimous and tight: every lens picks ${tops[0]} and the spread is ${spread}. Name the strongest unargued alternative and make the lens whose pillar is most at risk argue it at full strength.`
  );
}

if (spread >= 5) {
  warnings.push(`wide spread (${spread}): a ${recommended.score.toFixed(1)} with spread ${spread} is a different answer from a ${recommended.score.toFixed(1)} with spread 1.`);
}

if (vote.missing) {
  warnings.push(`${vote.missing} seat(s) with no recorded vote. Record endorse, amend or dissent.`);
}

// ---------- output ----------

const result = {
  decision: cards.decision || "",
  round: cards.round ?? null,
  options,
  scores: Object.fromEntries(totals.map((t) => [t.option, t.score])),
  math: Object.fromEntries(totals.map((t) => [t.option, t.math])),
  recommended: recommended.option,
  label,
  score: recommended.score,
  spread,
  confidence,
  totalWeight,
  vote,
  overrides: applied,
  pillarFixes,
  warnings,
  oneWayDoor: isOneWay,
  ruinSeats: ruinSeats.map((s) => s.id),
};

if (asJson) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(label === "TIE" ? 1 : 0);
}

const line = (s) => console.log(s);
line(`decision: ${result.decision || "(unnamed)"}`);
line(`round: ${result.round ?? "-"}   lenses: ${seats.length}   weight: ${totalWeight}`);
line("");
line("option scores");
for (const t of totals) {
  const mark = t.option === recommended.option ? " <-" : "";
  line(`  ${t.option}  ${t.math}${mark}`);
}
line("");
line(`recommended: ${recommended.option}   score: ${recommended.score.toFixed(1)}   spread: ${spread}   confidence: ${confidence}/10`);
line(
  `vote: ${vote.endorse} endorse, ${vote.amend} amend, ${vote.dissent} dissent` +
    (vote.missing ? `, ${vote.missing} missing` : "")
);
if (Object.keys(result.scores).length && leaders.length > 1) {
  line(`leaders: ${leaders.map((l) => `${l.option} ${l.score.toFixed(1)}`).join(", ")}`);
}
line("");
for (const a of applied) line(`override: ${a}`);
if (!applied.length) line("override: none");
if (result.wait) {
  const w = cards.wait;
  line(`wait: trigger ${w.trigger} by ${w.date}; if it fails: ${w.ifFails}`);
}
line("");
for (const p of pillarFixes) line(`pillar at 4 or below: ${p.label} ${p.pillarScore}/10`);
for (const w of warnings) line(`warning: ${w}`);
line("");
line(`VERDICT: ${label}`);

process.exit(label === "TIE" ? 1 : 0);

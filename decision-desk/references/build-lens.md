# Building a lens from sources

A built lens is a reusable expert frame: the questions one operator asks, the rules they apply, the positions they hold, and where their frame misfires. It is compiled from real sources, with every quote verified.

Use it when a decision needs a specific mind at the table (an investor you follow, an operator in your industry, your own past decisions) and the seven functional lenses are not enough.

Build folder: `lenses/_build/<slug>/`. The lens itself lives in `lenses/<id>/`.

## Depth

| Flag | Sources | Words | Extraction agents |
|---|---|---|---|
| `--quick` | 12 to 20 | 80k+ | 2 to 3 |
| default | 30 to 50 | 250k+ | 4 to 6 |
| `--deep` | 80+ | 500k+ | 8 to 12, in waves |

Quality beats count. One 90-minute talk is worth ten 6-minute clips. Below about 15 usable sources, say so and offer `--quick` with a warning.

## Step 1: name the frame

Fix the id (`cash-flow`, `drucker`, `my-2024-calls`), the pillar it owns, and the question it asks. Check `lenses/` first: if it already exists, refresh it instead of building a new one.

## Step 2: find sources

Their own site, essays, letters, newsletter archive. Long talks where they are the speaker. Long interviews where they are the main guest. Books as they teach them in public, never pirated text. Spread the years so changes of mind show up, with the newer view marked.

Skip clips under ten minutes, compilations, and anything where someone else does most of the talking. Write the URLs to `urls.txt`, one per line, with a `# heading` per group, about 20 percent more than the depth needs.

## Step 3: fetch

```bash
node scripts/fetch.mjs lenses/_build/<slug> --list lenses/_build/<slug>/urls.txt
```

Each source becomes `corpus/S001-<title>.md`, logged in `sources.json`. It prints `ok`, `skip`, `thin` or `fail` per URL. YouTube needs `yt-dlp` for the best transcripts, otherwise it uses YouTube's own captions. PDFs need `pdftotext`; without it the PDF is saved as `pending-*.pdf`, so read it, save the text, and add it with `--add`.

For your own material:

```bash
node scripts/fetch.mjs lenses/_build/<slug> --add path/to/file.md --title "..." --date 2024-05-01
```

Open two or three corpus files and confirm they are clean text by the right person before extracting.

## Step 4: extract (map)

Split sources into batches of about 50,000 words (a 90-minute talk is about 13,000; a long essay about 5,000). Spawn one agent per batch, in one message, in parallel, foreground. Each writes `notes/batch-NN.md`.

```
DECISION DESK LENS BUILD: EXTRACT NOTES

Frame: [id], owning "[question]". Depth: [quick | standard | deep].
Base folder: [absolute path to lenses/_build/<slug>]

Read these source files in full (each opens with its title and "Source: S0xx | url | date"):
[one line per source: S0xx | corpus/S0xx-....md | words]

Write your notes to: [build]/notes/batch-[NN].md
Write nothing else. Do not edit the source files.

For each source, add a section "## S0xx | [title] | [date]" with these parts. Skip a part when the source has nothing for it. Only extract what the named author says; ignore the host, the interviewer, and other guests.

### Frames
- **[Name as they call it, or a short name + (unnamed)]**: what it is, its parts, when they use it, and any threshold or number attached. Quote: "[verbatim]" (S0xx)

### Rules
- [A decision rule in one plain sentence.] Quote: "[verbatim]" (S0xx)

### Positions
- [Topic]: [their stance in one line]. Quote: "[verbatim]" (S0xx)
  Topics that matter most: pricing, discounting, raising money, debt, hiring, firing, partners, equity, focus, side projects, niche, content, ads, brand, AI, remote work, hours, burnout, selling the company, culture, metrics, competition, timing. Anything they feel strongly about counts too.

### Cases
- [The story in one line]: [the lesson drawn]. (S0xx)

### Limits
- Anything they say about where their advice does not apply, mistakes they admit, or views they changed (with the date). (S0xx)

Quote rules, which a script checks against the sources:
- Copy quotes character for character, including grammar and filler. Never fix, merge, or paraphrase inside quotation marks.
- Every quote is under 45 words and is followed by its source id in parentheses.
- A quote may skip words with "..." only inside one passage.
- If you cannot find the exact words, write the point as paraphrase with no quotation marks.

At the end add "## Batch summary": the five frames and five rules that came up most, with source ids.

Reply with one line: the notes path, and how many frames, rules, positions and quotes you wrote.
```

Then verify every quote:

```bash
node scripts/check_quotes.mjs lenses/_build/<slug> lenses/_build/<slug>/notes
```

Fix what it reports: correct a wrong source id, cut a quote it cannot find.

## Step 5: write the lens (reduce)

Create `lenses/<id>/` and write `sources.md`:

```bash
node scripts/fetch.mjs lenses/_build/<slug> --sources-md lenses/<id>/sources.md --name "Full Name or frame name"
```

Then spawn writers in one message, in parallel:

```
DECISION DESK LENS BUILD: WRITE THE LENS

Frame: [id], owning "[question]". Depth: [quick | standard | deep].
Base folder: [absolute path to lenses/_build/<slug>]
Lens folder: [absolute path to lenses/<id>]

Read first:
- [desk]/references/build-lens.md (the file layout, budgets and rules)
- every notes file in [build]/notes/
- [lens]/sources.md (the source id table, with dates)
You may open a corpus file only to check a quote's context or who is speaking.

Write exactly these files into [lens]/ and nothing else: [frameworks.md, principles.md, positions.md, cases.md | _hot.md]
[Writers: A gets frameworks.md and principles.md, B gets positions.md and cases.md. Then the Chair writes _hot.md itself from the finished files.]

Rules:
- Copy every quote exactly from the notes, with its source id, like "..." (S014). Under 45 words. Quotation marks mean verbatim; paraphrase goes without them.
- Merge duplicates across batches and count sources across all of them. Most used first.
- Weight what a business decision needs. Keep off-topic material (politics, health, family) thin unless it shapes how they decide.
- Where views changed, show both with dates and mark the newer one.
- Lines that are your reading of several sources say "inferred from S0xx, S0yy".
- No em dashes. Plain English, no filler.
```

Then check the whole lens:

```bash
node scripts/check_quotes.mjs lenses/_build/<slug> lenses/<id>
```

Fix until it passes. Read `_hot.md` once more as a lens will: it should say how this frame decides, in under 800 words.

## The lens layout

| File | Budget | Contents |
|---|---|---|
| `_hot.md` | 600 to 800 words | Read on every call. What the frame is, the question it owns, the 8 rules it decides by (one short verbatim quote and source id each), the 5 frames it reaches for first, its decision loop, the questions it asks, and **where this frame misfires** |
| `frameworks.md` | 12 to 25 entries | Name, what it is, parts or steps, when to use it, how to score a decision with it, one verbatim quote with id, how many sources use it |
| `principles.md` | 15 to 30 entries | Decision rules in one plain sentence, one or two verbatim quotes with ids, sources count, confidence (high = 3+ sources, medium = 2, low = 1) |
| `positions.md` | 20 to 40 topics | Their stance on the common decisions, with quote, id and date. Both views when they changed their mind. Topics with no evidence say "no recorded position"; never guess |
| `cases.md` | 10 to 20 entries | The stories and case studies they reuse, one or two lines each with the lesson and ids |
| `sources.md` | all | Written by `fetch.mjs --sources-md`: id, title, url, date, words |

A lens has no `voice.md` and no `books.md`. It is a thinking frame, not a character.

## Rules

- Public and lawful sources only. The corpus stays in `_build/` and is never committed. The lens holds short quotes (under 45 words) and paraphrase, never book text.
- Every quote passes `check_quotes.mjs`. A line with no source is inference and says so.
- **Where this frame misfires is mandatory.** It is the file's main defence against confident nonsense: a public-equity rule applied to a seed startup, a solo creator's playbook applied to a 50-person company.
- A built lens joins the council as one lens, with a weight. It never replaces the red team.
- The report says plainly when a lens is built from a real person's work: simulation, not their advice.

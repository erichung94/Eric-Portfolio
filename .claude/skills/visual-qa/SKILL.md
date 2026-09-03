---
name: visual-qa
description: Use after any layout, CSS, or component change to this site, before reporting it as done or committing. Measures the rendered geometry (centering, alignment, symmetry, gaps, overflow) at mobile and desktop instead of eyeballing a screenshot. Also use when Eric reports something looks off, crooked, off-centre, misaligned, or too far apart.
---

# Visual QA

## The rule

**Never claim a visual property without a number.**

Every layout bug on this site was found by Eric looking at a screenshot, not by a
test. Twice the first diagnosis was a theory about optical weight or font
choice, and twice the theory was wrong and the real cause was a measurable
offset. Measure first. State the number. Then fix.

If you catch yourself explaining *why* something looks off before you have
measured it, stop and measure.

## Process

1. `npm run build`
2. Serve it: `npm run preview -- --port 4321`
3. Capture and measure at **375x812** and **1280x900**, in **both modes** (`/`
   and `/dancer`), using Playwright
4. Report the numbers, then fix
5. When a fix lands, add a geometry assertion so it cannot regress silently

## Measuring text

Element box rects lie. Buttons here carry padding and a hidden ghost label, so
the box edge is nowhere near the glyph edge. Measure the text node:

```js
const node = [...el.childNodes].find(n => n.nodeType === 3);
const r = document.createRange();
r.selectNodeContents(node);
r.getBoundingClientRect();     // where the words actually are
```

For **vertical** centring, the line box is also wrong: descenders drag its
centre below where the eye reads the middle. Use ink metrics:

```js
const ctx = document.createElement('canvas').getContext('2d');
ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
const m = ctx.measureText(text);
const baseline = rangeRect.top + m.fontBoundingBoxAscent;
const inkCentre =
  (baseline - m.actualBoundingBoxAscent + baseline + m.actualBoundingBoxDescent) / 2;
```

## What to check

- **Centred on the page:** compare against `.site-header__inner` or the layout
  container, never the viewport. Scrollbars make viewport centre lie.
- **Equal gaps:** measure glyph edge to glyph edge, not box to box.
- **Both modes:** the dance side mirrors the dev side, and mobile un-mirrors it.
  `text-align` does not reach flex children, so a mirrored CTA needs its own
  reset. This has broken once already.
- **Horizontal overflow:** `document.documentElement.scrollWidth > clientWidth`
  at 375.
- **Both scroll states:** the masthead collapses at 200px and expands at 16px.
  Check the collapsed size too.
- **Section rhythm:** a join that stacks its own padding on the section rhythm
  ends up larger than every other join. Compare gaps against each other.

## Traps, all hit for real on this site

- **The Claude Code Browser pane returns blank screenshots after a programmatic
  scroll**, and its reported viewport can disagree with which media query is
  active. Use it to look; use Playwright to measure and capture.
- **Playwright scripts must live inside the project directory** or
  `@playwright/test` will not resolve. Write to `./.tmp.mjs`, run, delete.
- **`new AxeBuilder({ page })` needs a page from `browser.newContext()`**, not
  `browser.newPage()`.
- **Grid `1fr auto 1fr` does not equalise columns under `width: max-content`** in
  Chromium. Tracks stay at their own content widths. Equalise by content
  instead.
- **A stray dev server on the Playwright port gets adopted** by
  `reuseExistingServer`. Preview is pinned to 4323 for this reason.

## Prove the test can fail

A geometry assertion that passes against the broken version is worthless. After
adding one, reintroduce the bug, confirm it fails, revert. One canary written
during this site's development passed against the bug it was meant to catch.

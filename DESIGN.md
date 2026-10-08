---
name: didibudget
description: Your money, month by month.
colors:
  page-dark: "#212529"
  info: "#0dcaf0"
  coral: "#eb6c6c"
  text-light: "#f8f9fa"
  text-muted: "rgba(255, 255, 255, 0.5)"
  field-white: "#ffffff"
  ink-dark: "#212529"
  danger: "#dc3545"
  success: "#198754"
  info-tint: "#cff4fc"
typography:
  page-title:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "calc(1.325rem + 0.9vw)"
    fontWeight: 300
    lineHeight: 1.2
  section-title:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 300
    lineHeight: 1.2
  body:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "0.2rem"
  md: "0.25rem"
  lg: "0.3rem"
  pill: "50rem"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "1rem"
  "4": "1.5rem"
  "5": "3rem"
components:
  button-outline-info:
    backgroundColor: "transparent"
    textColor: "{colors.info}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
    height: "48px"
  button-outline-info-hover:
    backgroundColor: "{colors.info}"
    textColor: "{colors.ink-dark}"
  button-info:
    backgroundColor: "{colors.info}"
    textColor: "{colors.ink-dark}"
    rounded: "{rounded.md}"
    padding: "0.375rem 0.75rem"
  button-sm:
    rounded: "{rounded.sm}"
    padding: "0.25rem 0.5rem"
  input:
    backgroundColor: "{colors.field-white}"
    textColor: "{colors.ink-dark}"
    rounded: "{rounded.md}"
    padding: "0.375rem 0.75rem"
  card:
    backgroundColor: "{colors.page-dark}"
    textColor: "{colors.text-light}"
    rounded: "{rounded.md}"
    padding: "1rem"
  badge-info:
    backgroundColor: "{colors.info}"
    textColor: "{colors.ink-dark}"
    rounded: "{rounded.md}"
    padding: "0.35em 0.65em"
  toast-success:
    backgroundColor: "{colors.field-white}"
    textColor: "{colors.ink-dark}"
    rounded: "{rounded.md}"
---

# Design System: didibudget

## Overview

**Creative North Star: "The Pocket Ledger"**

A notebook you keep on you: you open it, write the line, and close it. The page is near-black, the ink is one colour (Bootstrap's `info` cyan), and every entry is plain text with no ornament. Nothing on a screen should slow down writing the next line or reading the last one.

The system is stock Bootstrap 5.1.3 used almost entirely through utility classes, with no theme layer and no custom tokens. That restraint is part of the identity: the app looks like a well-kept tool, not a product that sells itself. Character comes from a few deliberate choices: light-weight (300) headings, cyan hairlines instead of filled surfaces, emoji on categories, and the coral wordmark glowing on the logged-out home.

Density is set for a 390px phone held in one hand. Controls are full-width, lists are long and scroll vertically, and nothing needs sideways dragging.

**Key Characteristics:**
- Dark page, light text, one cyan accent for anything you can act on.
- Flat: structure comes from 1px cyan borders, not shadows or tonal layers.
- White form controls on the dark page (default Bootstrap, no overrides).
- Light (300) headings; body text at the system default weight.
- Emoji carry the category personality; the UI chrome stays plain.

## Colors

Near-black page, one cool accent for interaction, and one warm brand colour used sparingly.

### Primary
- **info** (`info`): the ledger ink. Outline and filled buttons, card and list borders, the navbar underline, link-style buttons, informative badges, `table-info` header rows. If it's cyan, you can act on it or it marks structure.

### Secondary
- **Coral** (`coral`): the didibudget brand colour, from the logo fill. Today it appears only in the wordmark and the home hero's radial glow. It may be used sparingly elsewhere as a brand mark, never as an interaction colour and never where it could be read as an error.

### Neutral
- **Page Dark** (`page-dark`): the page (`bg-dark` on the outer `container-fluid`) and card backgrounds, so cards read as outlined areas rather than raised panels.
- **Text Light** (`text-light`): headings, labels and body copy on the dark page.
- **Muted White** (`text-muted`, `text-white-50`): help text under fields, secondary lines, lead copy.
- **Field White** (`field-white`): form controls and the success toast. Bootstrap's toast is 85% opaque by default; here it's forced solid so text stays legible over the dark page.
- **Ink Dark** (`ink-dark`): text on cyan fills and white surfaces (`text-dark` on badges).

### Status
- **Danger** (`danger`): `ErrorAlert`, required-field asterisks, destructive actions. Failures only.
- **Success** (`success`): positive confirmation states.
- **Info Tint** (`info-tint`): the background of `EmptyState` (`alert-info`) and `table-info` rows.

### Charts
Axes and grid come from `src/utils/charts.js`: tick labels use `AXIS_TICK` (the `text-white-50` value at 14px), and grid and axis lines use `CHART_LINE_STROKE` (white at 15%), so they stay fainter than the labels. X-axis dates go through `shortMonthLabel` ("Sep 2026"); tooltips keep the full month. Every chart is `role="img"` with `accessibilityLayer={false}` and a `title` naming what it plots ("Bar chart of spending per month since …"). Bars, lines and dots use `SERIES_COLOR` (white at 70%). Series stay neutral on purpose: a chart is not something you tap, so it never takes the cyan ink.

### Named Rules
**The One Ink Rule.** Cyan is the only interaction colour. A new clickable thing is cyan (outline at rest, filled when selected); it is never coral, green or a new hue.

**The Red Means Broken Rule.** Danger red appears only for failures and destructive actions. "No data yet" is `EmptyState` (info tint), never an error. A control that only opens a delete confirmation is not the destructive action: the per-row delete is a muted trash icon, and red waits for the confirm button in the modal.

## Typography

**Body Font:** the Bootstrap system stack (SF Pro on the iPhone).

**Character:** native and unbranded. The voice comes from weight, not typeface: titles are light (300) and sit quietly above content that is set at the default weight.

### Hierarchy
- **Page Title** (300, `.h2` fluid size, about 1.55rem at 390px, 1.2): `PageTitle`, one per screen, `text-light`, followed by 1rem space. Also sets the document title.
- **Section Title** (300, 1.25rem, 1.2): `SectionTitle`. Always an `h2` (every section hangs straight off the page title) with `.h5` sizing.
- **Body** (400, 1rem, 1.5): list rows, card text, field values.
- **Label** (400, 0.875rem): `small` labels like "Most used" and "All categories", and help text under fields (`form-text`, muted).
- **Hero tagline** (300 italic, `fs-2`): only on the logged-out home.

### Named Rules
**The Light Heading Rule.** Headings use weight 300 (`fw-light`). Hierarchy comes from size and space, never from bold.

## Layout

- **Shell:** `container-fluid bg-dark` wrapping a Bootstrap `container`, which gives about 24px side gutters at 390px. The navbar sits on top with 1.5rem below it; `main` has 3rem bottom padding. The footer is static: it sits at the bottom of short screens and after the content on long ones, never fixed over it.
- **Target width:** 390px. Every screen is designed and checked there first.
- **Forms:** a single column at full width on phones (`col-md-8` centred from 768px). Fields are separated by 1.5rem (`mb-4`).
- **Grids:** cards stack in one column on phones (`col-sm-6 col-md-4`).
- **Tables:** always inside `table-responsive`; amounts and dates use `text-nowrap` so a value never wraps mid-number.
- **Lists with a button per row** (spending list, monthly balances list): below 768px each row stacks instead of using a table, with the content on the left and the button on the right; the table returns from 768px (`d-md-none` / `d-none d-md-block`).
- **Spacing rhythm:** Bootstrap's spacer scale (0.25 / 0.5 / 1 / 1.5 / 3rem). 1rem and 1.5rem do most of the work.

## Elevation & Depth

Flat. Surfaces share the page colour and are separated by 1px cyan or secondary borders. The only exceptions are temporary overlays: the success toast (solid white, Bootstrap toast shadow) and dropdown menus. The wordmark has its own SVG extrude and drop shadow, which belong to the logo, not the UI.

### Named Rules
**The Hairline Rule.** Group content with a 1px line, not with a shadow or a lighter panel: `border-info` around a block, `border-secondary` between the rows of a list that has its own buttons, so cyan stays on what you can tap.

## Shapes

Gently rounded corners (0.25rem) on buttons, inputs, cards and badges, which is Bootstrap's default. Pills appear only in the switch track (`ToggleButton`). List groups are flush, with no outer corners. No custom silhouettes.

## Components

### Buttons
- **Shape:** gently rounded (0.25rem; 0.2rem for `btn-sm`).
- **Primary action:** `SubmitButton`, a large `btn-lg btn-outline-info` (48px tall): cyan text and border on the dark page. On hover it fills cyan with dark text. Below 768px it spans the full width of its form (`d-grid d-md-block`); from 768px it keeps its natural width, left-aligned. Every form's main action uses this component, never a hand-rolled button.
- **Selected / filled:** `btn-info` marks the chosen option in a set, such as the selected category chip in "Most used".
- **Link style:** `btn-link` rows in long pick-lists like the category tree. The whole row is the button (`w-100 text-start px-0`, about 47px tall with its list item), emoji included. Rows that **choose** are cyan with the label underlined; rows that only **expand** are `text-light`, not underlined, with a white caret. Tapping a row must not leave Bootstrap's focus ring around it: hide it on `:focus:not(:focus-visible)` and keep it for keyboard focus.
- **Light:** `btn-light` only when attached to a white input (input-group addon).
- **Row delete:** `ButtonDelete`, a `btn-link` trash icon (`BsTrash3`, 20px) in `text-white-50`, 44px tap target with the icon flush right. It turns danger red on hover and keyboard focus. The confirmation modal's Delete is the only red button.
- **Large:** `btn-lg` in a `d-grid` column for the single home-screen call to action.

### Chips
- **Style:** `btn-sm` in a `d-flex flex-wrap gap-2` row. Outline cyan at rest, filled cyan when selected.

### Switches
- **Style:** `ToggleButton`, Bootstrap's `form-switch` with `role="switch"`. White track when off, filled `info` when on. The label fills a 44px row, so tapping the text flips it.

### Cards / Containers
- **Corner Style:** 0.25rem.
- **Background:** `bg-dark` (the same as the page).
- **Border:** `border-info`, 1px.
- **Internal Padding:** 1rem (`card-body`). Title is light weight (`fw-light card-title`).

### Inputs / Fields
- **Style:** default Bootstrap `form-control` / `form-select`: white, dark text, gray 1px border, 0.25rem radius.
- **Labels:** `text-light` above the field. Required fields carry a `text-danger` asterisk.
- **Help text:** muted white `form-text` below the field.
- **Focus:** Bootstrap default (blue border plus a soft ring).
- **Date pickers:** react-widgets; read-only inputs that open a calendar keep a pointer cursor.

### Lists & Tables
- **List groups:** `list-group-flush`, items `bg-dark border-info px-0 py-1`, horizontal padding removed so rows align with the page edge. When every row carries its own button, rows use `border-secondary` and `py-3` instead.
- **Tables:** `table-dark table-hover`, with a `table-info` header row. Always wrapped in `table-responsive`.
- **Stacked rows on phones:** a list whose rows each carry a button is a `list-group-flush` below 768px, not a table. Each item is `bg-dark text-light border-secondary px-0 py-3` holding a `d-flex align-items-center gap-3` row: the text grows on the left (main line, then a `small` line such as `date · amount`), the button sits on the right, flush with the page edge.

### Feedback
- **ErrorAlert:** `alert-danger`, centred, `role="alert"`. Failures only.
- **EmptyState:** `alert-info`, centred, `role="status"`. When a screen's main content is empty: "nothing yet", or a search that returned nothing.
- **Filter with no matches:** inline muted text (`text-white-50`, `role="status"`, "No … found") where the list would be. Used when a live filter empties a list already on screen (users, category picker); an `EmptyState` box there would shove the form around for a passing state.
- **SuccessToast:** solid white toast placed below the navbar (top 64px). It fades and slides in over 150ms, then auto-hides. Each save passes `{ id, message }` with a fresh id. Motion is disabled under `prefers-reduced-motion`.
- **InformativeBadge:** `badge bg-info text-dark`, inline beside section titles (for example, "Net change").
- **Spinner:** three bouncing dots (muted mauve `#AC9FAA`), centred 100px below the top, with a visually hidden "Loading…" in `role="status"`. Under `prefers-reduced-motion` the dots fade in place instead of scaling.

### Navigation
- **NavBar:** a single row of 32px Bootstrap Icons in `text-light`, spread across the width (`justify-content-between`) with a 1px `border-info` underline. Spending and savings sections open as dropdowns. Icon-only links carry `aria-label`.

### Home Hero (signature)
The coral SVG wordmark over a soft coral radial glow that fades in over 700ms (static under reduced motion). Below it: a light italic tagline, a muted lead line, a large outline-cyan "Log in" button and a small "Create an account" link. This is the only screen where coral leads.

## Do's and Don'ts

### Do:
- **Do** design and check every screen at 390px first.
- **Do** use `SubmitButton` for every form's main action (full width and 48px tall on phones) and `btn-info` for the selected state.
- **Do** keep form controls default Bootstrap white; don't theme them dark.
- **Do** use `fw-light` for page and section titles.
- **Do** wrap tables in `table-responsive` and mark amounts and dates `text-nowrap`.
- **Do** stack a list with a button per row below 768px instead of squeezing it into a table.
- **Do** use `EmptyState` for empty screens, inline muted "No … found" text for a live filter with no matches, `ErrorAlert` for failures and `SuccessToast` for confirmed writes.
- **Do** honour `prefers-reduced-motion` on every animation.

### Don't:
- **Don't** introduce a second interaction colour. Coral is a brand mark, not a button.
- **Don't** use shadows or lighter panels to separate content; use a hairline (cyan, or gray between rows that have their own buttons).
- **Don't** use danger red for "no data".
- **Don't** add custom CSS where a Bootstrap utility already does the job.
- **Don't** let a value wrap mid-number or force a table to scroll sideways at 390px when stacking would work.

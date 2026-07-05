# PRD — thesid.tech Terminal Portfolio: Hero & Command Enhancements

**Owner:** Adesh Siddhartha
**Surface:** `thesid.tech` (interactive terminal-style portfolio)
**Audience for this doc:** the implementing LLM / developer
**Status:** Ready to build

---

## 1. Context & Problem

`thesid.tech` is a single-page, terminal-style portfolio. The hero shows a gold "SIDDHARTH" wordmark, a subtitle, an intro paragraph, and a terminal box with a prompt.

Two problems:
1. **Discovery friction** — visitors must *type* a command to see anything. Many won't, so they bounce from an essentially empty screen.
2. **Dead space** — the terminal renders only a hint line and a bare prompt; it feels unused, and the page misses easy "wow" moments.

This PRD specifies enhancements that (a) give non-typers an obvious entry path, (b) make the terminal feel alive and populated on load, and (c) add memorable personality — while preserving the existing black-and-gold aesthetic and keeping the personal introduction as the focal point.

---

## 2. Goals

1. Let a visitor reach any section **without typing** (clickable command chips + command palette).
2. Make the terminal feel **alive on load** (auto-typed greeting, blinking cursor, auto-run `neofetch`).
3. Add **personality** via hidden Easter-egg commands and a discoverability nudge.
4. Keep the **introduction front-and-center**; all terminal flourishes are supporting, never competing.
5. Preserve the current **black-and-gold** theme and overall layout.

## 3. Non-Goals (explicitly out of scope)

- **No GitHub-style contribution heatmap / activity grid.**
- **No "currently building / now playing" ticker line.**
- No backend, no auth, no analytics dashboard.
- No change to the existing routing or content management approach beyond what's described here.

---

## 4. Visual & Theme Spec

Keep the existing dark + gold silk look. Use these tokens (CSS variables):

| Token | Value | Use |
|---|---|---|
| `--bg` | `#070605` | page background |
| `--panel` | `#0c0a07` | terminal body |
| `--panel-head` | `#15120c` | terminal title bar |
| `--line` | `#2a2417` | borders / dividers |
| `--gold` | `#e8c14a` | primary accent, keys, active states |
| `--gold-l` | `#f7e3a1` | highlights / gradient stop |
| `--gold-d` | `#b8860b` | secondary / underlines |
| `--green` | `#b8bb26` | prompt + "open to work" status |
| `--text` | `#ece3cf` | body text |
| `--muted` | `#a99d80` | secondary text |
| `--faint` | `#6f6552` | hints / comments |

- **Font:** monospace throughout (`JetBrains Mono`, fallback `SFMono-Regular`, `Courier New`, `monospace`). The wordmark may use the existing display treatment.
- **Background:** keep the silk gold ribbons + a soft radial gold glow behind the wordmark.
- **Wordmark gradient:** champagne → gold → deep amber, left to right.
- Maintain existing letter-spacing on `SIDDHARTH`.

---

## 5. Layout (top to bottom)

1. **Top status bar** — left: `🇸🇪 Sweden`; center: `thesid.tech` pill; right: `● open to work` (green) + live local clock (`Wed, Jun 17 · 00:42 CET`).
2. **Wordmark** `SIDDHARTH` (centered, gold gradient).
3. **Subtitle** `MSc Software Engineering Student · AI Enthusiast · Sweden`.
4. **Divider** (short, centered).
5. **Intro paragraph** (centered) — the focal point. Highlight the name in gold.
6. **Helper nudge** (centered, faint): `# not sure where to start? tap a command ↓`
7. **Command chips row** (centered): `about` `projects` `skills` `experience` `contact` `resume`. `resume` is the highlighted primary chip.
8. **Terminal window** — title bar (`VISITOR@SIDDHARTH — TERMINAL` + traffic lights), then on load it auto-runs `neofetch`, then shows the live prompt with blinking cursor, then a shortcuts hint line and an Easter-egg nudge line.
9. **Footer** — `© 2026 Rathod Adesh Siddhartha — All Rights Reserved`.

---

## 6. Functional Requirements

### FR-1 — Live status bar
- Show `● open to work` with the dot in `--green`.
- Show a **live clock** that updates at least every minute, formatted to the user's locale or a fixed `CET` (Sweden). Implementation may use `Intl.DateTimeFormat`.
- The `thesid.tech` element is a non-interactive pill (visual only).

### FR-2 — Command chips (no-typing path) — *highest priority*
- Render one chip per primary section: `about`, `projects`, `skills`, `experience`, `contact`, plus a highlighted `resume`.
- **Clicking/tapping a chip runs the same handler as typing that command** — it must print the command line into the terminal output and render the result, identical to keyboard entry.
- Chips are real buttons: keyboard-focusable, `Enter`/`Space` activate, visible focus ring, `aria-label` = command name.
- On hover: border brightens to `--gold` (+ optional subtle glow / light sweep).
- The helper nudge line (FR-2a) sits directly above the chips in `--faint`.

### FR-3 — Auto-typed greeting + blinking cursor
- On load, the terminal types out a greeting via a typewriter effect (≈ 45–65 ms/char), e.g. `> Welcome. Type 'help' to explore, or tap a command above.`
- A block cursor (`--gold`) blinks at ~1 s steps at the active prompt at all times.
- **Respect `prefers-reduced-motion`:** if set, skip the typewriter and render the greeting instantly (cursor may still blink, or be static).

### FR-4 — Auto-run `neofetch` on load
- On load (after the greeting), automatically render the `neofetch` output so the terminal is populated, not empty.
- `neofetch` shows a small ASCII logo/glyph (e.g. a gold `>_` block) beside an info card:
  - `role   MSc Software Engineering`
  - `focus  AI · Intelligent Systems`
  - `stack  Python · PyTorch · React`
  - `based  Sweden`
  - `status ● open to work` (green)
- Field labels in `--gold`, values in `--text`. **No heatmap.**

### FR-5 — Terminal engine
- **Prompt:** `visitor@siddharth:~$ ` (user/`@`/`~` colored; `siddharth` in gold).
- **Enter** runs the line: echo the typed line as a new output row, parse `cmd + args`, dispatch to the handler, print result.
- **Unknown command:** `<cmd>: command not found. type 'help'.`
- **History:** `↑` / `↓` cycle previously entered commands.
- **Tab autocomplete:** completes a unique command prefix; if multiple match, print the candidates.
- **Click anywhere** focuses the input.
- **`clear`** empties the output.
- **Ghost autocomplete (nice-to-have):** when input matches a single command prefix, show the remainder as faint inline ghost text with a `↹ Tab` affordance.

### FR-6 — Shortcuts hint + Easter-egg nudge (below the prompt)
- Shortcuts line (faint, keys in gold): `↹ Tab complete · ↑↓ history · ⌘K command palette · 'clear' reset`.
- Easter-egg nudge (faint, commands in gold): `psst — try 'matrix', 'coffee' or 'sudo' for a surprise`.

### FR-7 — Command Palette (`⌘K` / `Ctrl+K`) — *high value*
- Pressing `⌘K` (mac) / `Ctrl+K` (win/linux) opens a centered overlay with a search field and a fuzzy-filtered list of all commands (with descriptions).
- Arrow keys move selection; `Enter` runs the selected command (and routes output to the terminal); `Esc` closes.
- Clicking a result runs it. Overlay is focus-trapped and dismissable by backdrop click.

### FR-8 — Social links
- A small row (e.g. terminal footer or bottom-right): `github · linkedin · x · email`, each a real link (email = `mailto:`). Pull values from the `ME` config (FR-10).

### FR-9 — Commands & Easter eggs (registry)
Implement these as a single registry object (see §7). Each entry returns a string to print, or performs an effect and returns empty.

**Portfolio commands**
| Command | Behavior |
|---|---|
| `help` | List available (non-hidden) commands with one-line descriptions + a hint about hidden ones. |
| `about` | Name + 2-line bio. |
| `whoami` | One-line role summary. |
| `skills` | Grouped tech list (languages, ai/ml, web, tools). |
| `projects` | Numbered project list (data-driven). |
| `experience` | Dated study/work entries. |
| `education` | Degree(s) + institution. |
| `contact` / `social` | Email, GitHub, LinkedIn, X as links. |
| `resume` | Open/download the résumé PDF (configurable URL). |
| `neofetch` | The system card from FR-4. |
| `echo <text>` | Echo the args. |
| `date` | Current date/time. |
| `clear` | Clear the screen. |

**Easter eggs (hidden from `help` list, surfaced via the nudge)**
| Command | Behavior |
|---|---|
| `matrix` | Full-screen gold "digital rain" canvas overlay for ~6 s; any key or click exits early. Skipped/short-circuited under `prefers-reduced-motion`. |
| `coffee` | Prints `brewing...` then an ASCII coffee cup + a one-liner. |
| `sudo [args]` | Cheeky denial: `nice try 😏 — not in the sudoers file...`. If args include `hire`, respond positively and point to `contact`. |
| `hire` / `hire me` | "Open to work" flourish, then prints `contact`. |
| `theme` | Toggle a CRT scanline overlay (and/or accent variant). Persist choice in `localStorage` if feasible. |
| `secret` | A short hidden message / 42 gag. |
| `exit` | Playful "there's no escape" message. |

### FR-10 — Single source of content (`ME` config)
All personal data lives in one config object so nothing is hardcoded across handlers:
```
ME = { name, role, location, email, github, linkedin, x, resumeUrl }
```
Section content (skills, projects, experience, education) should also be data-driven (arrays the handlers render), so updates never require touching engine code.

---

## 7. Suggested Architecture (non-binding)

- **`commands` registry**: `{ name: (args) => string | "" }`. Engine looks up `cmd`, calls it, prints the return value (HTML-capable but **escape user echo** to prevent injection).
- **`DESC` map** for `help`/palette descriptions; **`HIDDEN` array** to exclude Easter eggs from `help`.
- **`print(html, className)`** helper appends a row and autoscrolls.
- **Engine module**: keydown handling (Enter / Arrow / Tab), history stack, focus management.
- **Overlay module**: command palette.
- **Effects module**: `runMatrix()`, typewriter helper.
- Keep it framework-agnostic (vanilla JS works) so it drops into the existing site.

---

## 8. Accessibility & Responsiveness

- Honor `prefers-reduced-motion` for the typewriter and matrix rain.
- Chips, palette items, and links are keyboard-operable with visible focus states.
- Color contrast: body text and gold accents must remain legible on the dark background (target WCAG AA for body text).
- The input is a real focusable field; `aria-live="polite"` on the output region so screen readers announce new lines.
- **Mobile:** chips wrap and remain tap-friendly (≥ 40 px targets); terminal is full-width; the matrix overlay and palette are usable on touch (tap to dismiss). The status clock and links must not overflow.

---

## 9. Acceptance Criteria (test checklist)

- [ ] Visitor can open every section by **clicking chips only**, no typing.
- [ ] Clicking a chip produces output identical to typing that command.
- [ ] On load: greeting types out (or appears instantly under reduced-motion), cursor blinks, and `neofetch` output is visible — terminal is **not** empty.
- [ ] `⌘K` / `Ctrl+K` opens the palette; arrow + Enter runs a command; `Esc` closes.
- [ ] `↑/↓` recall history; `Tab` autocompletes a unique prefix.
- [ ] `matrix`, `coffee`, `sudo`, `hire`, `theme`, `secret` all work as specified.
- [ ] Unknown commands show the not-found message.
- [ ] The introduction remains the most prominent element above the chips.
- [ ] **No** contribution heatmap and **no** "currently building" line appear anywhere.
- [ ] All personal data comes from the `ME` config / section data arrays.
- [ ] Layout holds on a 375 px-wide phone and a desktop width.
- [ ] `prefers-reduced-motion` disables heavy animation.

---

## 10. Content to Populate (placeholders to replace)

- Real project names + one-line descriptions.
- Real experience/education entries with dates.
- Real social URLs and résumé PDF link.
- Confirm display name usage (`Adesh Siddhartha`) and timezone for the clock.

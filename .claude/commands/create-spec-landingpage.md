---
description: Create a spec file and feature branch for the Spendly landing page implementation
argument-hint: "Step number and landing page name e.g. 01 landing-page"
allowed-tools: Read, Write, Glob, Bash(git:*)
---

You are a senior frontend developer implementing a pixel-perfect
landing page for Spendly.

Always follow the rules in CLAUDE.md.

User input: $ARGUMENTS

Attached reference:
- spendly-landing-page.jpeg

## Step 1 — Check working directory is clean
Run `git status` and check for:
- uncommitted changes
- unstaged files
- untracked files

If any exist:
STOP immediately and tell the user to commit or stash changes.

Do not continue until the working directory is clean.

## Step 2 — Parse the arguments

From $ARGUMENTS extract:

1. `step_number`
   - zero padded
   - example: 1 → 01

2. `page_title`
   - human readable title
   - example: "Landing Page"

3. `page_slug`
   - lowercase kebab-case
   - max 40 chars
   - example: landing-page

4. `branch_name`
   - format:
   `feature/<page_slug>`

If unclear, ask the user before proceeding.

## Step 3 — Ensure branch name is unique

Run:

```bash
git branch
````

If branch exists:
append incrementing suffix:

```txt
feature/landing-page-01
feature/landing-page-02
```

## Step 4 — Switch to main and pull latest

Run:

```bash
git checkout main
git pull origin main
```

## Step 5 — Create and switch to feature branch

Run:

```bash
git checkout -b <branch_name>
```

## Step 6 — Research the existing UI system

Before writing the spec, inspect:

* CLAUDE.md
* shared layouts
* base.html
* navbar/footer components
* existing cards/buttons/forms
* global CSS variables
* typography system
* spacing system
* responsive utilities
* all specs in `.claude/specs/`

Also inspect the attached landing page screenshot carefully.

Identify:

* layout structure
* spacing rhythm
* typography hierarchy
* reusable UI patterns
* color palette
* responsive behavior
* shadows/borders/radius
* section ordering

Avoid duplicating existing specs or components.

## Step 7 — Write the landing page spec

Generate a spec document using this EXACT structure:

---

# Spec: <page_title>

## Overview

Describe the landing page purpose, target audience,
and conversion goal.

## Visual goals

Describe:

* overall visual style
* typography feel
* spacing rhythm
* component consistency
* responsiveness expectations

## Page sections

List all major sections in render order:

* Header/Navbar
* Hero
* Statistics/Card preview
* Feature cards
* CTA section
* Footer

## Responsive behavior

Define expected behavior for:

* mobile
* tablet
* desktop

Include:

* stacking behavior
* spacing adjustments
* typography scaling
* container widths

## Design system usage

List:

* CSS variables to reuse
* typography styles
* button variants
* spacing tokens
* reusable layout utilities

Never hardcode:

* colors
* spacing
* shadows
* typography sizes

## Components to create

List every new reusable component.

## Components to modify

List every existing component requiring updates.

## Files to change

List all modified files.

## Files to create

List all new files.

## Assets required

List:

* icons
* illustrations
* logos
* screenshots
* fonts

If none:
state "No additional assets required".

## Accessibility requirements

Must include:

* semantic HTML
* keyboard accessibility
* visible focus states
* sufficient contrast ratio
* alt text for images
* responsive zoom support

## Rules for implementation

Always include:

* Pixel-perfect implementation
* Mobile-first responsive design
* Use CSS variables only
* No inline styles
* All templates extend `base.html`
* Reusable components preferred over duplication
* Maintain consistent spacing rhythm
* Match screenshot proportions closely

## Definition of done

Create a testable checklist including:

* Screenshot visually matches reference
* Mobile layout verified
* Tablet layout verified
* Desktop layout verified
* No overflow issues
* Lighthouse accessibility passes
* All buttons interactive
* Responsive navigation works
* No hardcoded hex values
* Consistent spacing across sections

---

## Step 8 — Save the spec

Save to:

```txt
.claude/specs/<step_number>-<page_slug>.md
```

## Step 9 — Report to the user

Print this EXACT format:

```txt
Branch:    <branch_name>
Spec file: .claude/specs/<step_number>-<page_slug>.md
Title:     <page_title>
```

Then print:

"Review the spec at `.claude/specs/<step_number>-<page_slug>.md`
then enter Plan Mode with Shift+Tab twice to begin implementation."

Do not print the full spec unless explicitly asked.
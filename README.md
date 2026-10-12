# myAutomation

Automated browser tests for [Test Automation Practice](https://testautomationpractice.blogspot.com/), built with **Playwright** and **BDD (Gherkin)** using TypeScript.

Tests are written in plain English like this:

```gherkin
Feature: Practice site home page

  Scenario: Open the practice site
    Given I open the home page
    Then the page title should contain "Automation Testing Practice"
```

and Playwright runs them in real browsers (Chrome, Firefox, Safari/WebKit).

---

## Contents

1. [Quick start (project already set up)](#1-quick-start-project-already-set-up)
2. [Install the tools](#2-install-the-tools)
3. [Set up your Git identity](#3-set-up-your-git-identity)
4. [Create the Playwright project](#4-create-the-playwright-project)
5. [Configure Playwright](#5-configure-playwright)
6. [Add the BDD framework (Gherkin)](#6-add-the-bdd-framework-gherkin)
7. [Run the tests](#7-run-the-tests)
8. [Write a new test](#8-write-a-new-test)
9. [Working with branches](#9-working-with-branches)
10. [Recommended VS Code extensions](#10-recommended-vs-code-extensions)
11. [Troubleshooting](#11-troubleshooting)
12. [Command cheat sheet](#12-command-cheat-sheet)

---

## 1. Quick start (project already set up)

If you just want to run the existing tests, do this. You still need the tools from [step 2](#2-install-the-tools).

```bash
git clone https://github.com/Mille-DeLeon/myAutomation.git
cd myAutomation
npm ci                     # install project packages
npx playwright install     # download the test browsers
npm test                   # run all tests
npm run report             # open the HTML test report
```

To understand how the project was built from nothing, follow steps 2 to 7.

---

## 2. Install the tools

You need three programs. Install them once per computer.

| Tool | What it's for | Download |
|---|---|---|
| **Git** | Saves versions of your code and uploads it to GitHub | https://git-scm.com/downloads |
| **Node.js** (includes **npm**) | Runs JavaScript/TypeScript. npm installs packages like Playwright | https://nodejs.org (choose the **LTS** version) |
| **VS Code** | Code editor | https://code.visualstudio.com |

When installing Node.js, keep the default options.

**Check everything installed correctly.** Open a new terminal (in VS Code: *Terminal → New Terminal*) and run:

```bash
git --version
node -v
npm -v
```

Each command should print a version number, e.g. `v22.x.x`. If you see *"not recognized"*, close and reopen the terminal (or restart VS Code) so it picks up the new install.

---

## 3. Set up your Git identity

Every commit you make is labelled with a name and email. GitHub uses the **email** to link commits to your account. If the email is wrong, your commits show up as an unknown user with no profile picture.

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

- **Name:** anything you like. It doesn't have to match your GitHub username.
- **Email:** must be a **complete email address** (with `@`) that is listed on your GitHub account under **GitHub → Settings → Emails**.
  - Want to keep your email private? On that same page GitHub gives you a *noreply* address like `12345678+username@users.noreply.github.com`. You can use that instead.

**Check it:**

```bash
git config --global user.name
git config --global user.email
```

> ⚠️ **Common mistake:** typing only part of the email (e.g. `john.smith` instead of `john.smith@gmail.com`). Git accepts it, but GitHub can't match it to you.

> ℹ️ These settings are just labels. They **don't** log you in to GitHub. Logging in happens the first time you `git push`: a browser window opens and asks you to sign in.

---

## 4. Create the Playwright project

### 4.1 Create a folder and a GitHub repo

1. On GitHub, create a new repository (e.g. `myAutomation`).
2. Clone it to your computer and open it in VS Code:

   ```bash
   git clone https://github.com/<your-username>/myAutomation.git
   cd myAutomation
   code .
   ```

### 4.2 Install Playwright

Run:

```bash
npm init playwright@latest
```

It asks a few questions. These are the answers used for this project:

| Question | Answer |
|---|---|
| TypeScript or JavaScript? | **TypeScript** |
| Where to put your end-to-end tests? | `tests` |
| Add a GitHub Actions workflow? | **Yes** |
| Install Playwright browsers? | **Yes** |

> **Why TypeScript?** It catches mistakes (like typos in property names) while you type, and gives better autocomplete in VS Code. Every JavaScript file is also valid TypeScript, so you lose nothing.

This creates:

```
myAutomation/
├── .github/workflows/playwright.yml   ← runs tests on GitHub automatically
├── tests/example.spec.ts              ← sample test (we replace this later)
├── playwright.config.ts               ← Playwright settings
├── package.json                       ← project info + installed packages
└── package-lock.json                  ← exact package versions (don't edit)
```

---

## 5. Configure Playwright

Open `playwright.config.ts` and find the `use:` section. These are the settings used in this project:

```ts
use: {
  /* The website being tested. Lets you write page.goto('/') instead of the full URL. */
  baseURL: 'https://testautomationpractice.blogspot.com/',

  /* Record a step-by-step trace when a failed test is retried. */
  trace: 'on-first-retry',

  /* Take a screenshot only when a test fails. */
  screenshot: 'only-on-failure',

  /* Record video of each test, but keep it only if the test fails. */
  video: 'retain-on-failure',
},
```

Screenshots, videos and traces appear in the HTML report (`npm run report`), which makes it much easier to see *why* a test failed.

> ⚠️ Only have **one** `use: { ... }` block at this level. If you copy settings from somewhere, merge them into the existing block instead of pasting a second one.

---

## 6. Add the BDD framework (Gherkin)

**BDD** (Behaviour-Driven Development) means writing tests as readable scenarios using **Gherkin** keywords: `Feature`, `Scenario`, `Given`, `When`, `Then`. Anyone on the team, including non-coders, can read them.

We use **[playwright-bdd](https://vitalets.github.io/playwright-bdd/)**. It turns `.feature` files into normal Playwright tests, so you keep all of Playwright's features (reports, screenshots, videos, parallel runs, the VS Code extension).

### 6.1 Install it

```bash
npm install -D playwright-bdd
```

(`-D` means it's a development tool, not part of a shipped app.)

### 6.2 Create the folder structure

```
features/
├── home.feature          ← scenarios written in Gherkin
└── steps/
    ├── fixtures.ts       ← sets up Given / When / Then
    └── home.steps.ts     ← the code that runs for each step
```

### 6.3 Write a feature file

**`features/home.feature`**

```gherkin
Feature: Practice site home page

  Scenario: Open the practice site
    Given I open the home page
    Then the page title should contain "Automation Testing Practice"
```

### 6.4 Create the step helpers

**`features/steps/fixtures.ts`**

```ts
import { test, createBdd } from 'playwright-bdd';

/* Shared Given/When/Then helpers. Import these in every steps file. */
export const { Given, When, Then } = createBdd(test);
```

You only write this file once.

### 6.5 Write the step definitions

Each line in the `.feature` file must match a step definition. The text in quotes in the feature file is passed in as `{string}`.

**`features/steps/home.steps.ts`**

```ts
import { expect } from '@playwright/test';
import { Given, Then } from './fixtures';

Given('I open the home page', async ({ page }) => {
  await page.goto('https://testautomationpractice.blogspot.com/');
});

Then('the page title should contain {string}', async ({ page }, text: string) => {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await expect(page).toHaveTitle(new RegExp(escaped));
});
```

> 💡 Because `baseURL` is set in the config, `page.goto('/')` would open the same page.

### 6.6 Point Playwright at the feature files

At the top of **`playwright.config.ts`**:

```ts
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/* Turn .feature files into Playwright tests (generated into .features-gen/). */
const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'features/steps/**/*.ts',
});

export default defineConfig({
  testDir,
  // ... rest of the config stays the same
```

The old `tests/example.spec.ts` was deleted. Its test now lives in `home.feature`.

### 6.7 Add shortcut commands

In **`package.json`**, replace `"scripts": {}` with:

```json
"scripts": {
  "test": "bddgen && playwright test",
  "test:ui": "bddgen && playwright test --ui",
  "report": "playwright show-report"
},
```

`bddgen` converts your `.feature` files into test files. It must run **before** `playwright test`, and these scripts do both for you.

### 6.8 Ignore generated files

Add this to **`.gitignore`** so generated files aren't committed:

```
# playwright-bdd generated tests
/.features-gen/
```

### 6.9 Update the GitHub Actions workflow

In **`.github/workflows/playwright.yml`**, change the test step so CI also runs `bddgen`:

```yaml
- name: Run Playwright tests
  run: npm test
```

---

## 7. Run the tests

| Command | What it does |
|---|---|
| `npm test` | Runs all tests in all browsers |
| `npm test -- --project=chromium` | Runs tests in Chrome only (faster) |
| `npm test -- --headed` | Runs with the browser window visible |
| `npm run test:ui` | Opens Playwright's interactive UI to watch and debug tests |
| `npm run report` | Opens the HTML report from the last run |

> ⚠️ Use `npm test`, **not** `npx playwright test`. The plain Playwright command skips `bddgen`, so changes to `.feature` files won't be picked up.

---

## 8. Write a new test

1. **Write the scenario** in a `.feature` file (an existing one, or a new file in `features/`):

   ```gherkin
   Scenario: Fill in the name field
     Given I open the home page
     When I type "Mille" into the name field
     Then the name field should contain "Mille"
   ```

2. **Run `npm test`.** For any step without code, `bddgen` stops and prints a ready-to-paste snippet, e.g.:

   ```ts
   When('I type {string} into the name field', async ({ page }, arg: string) => {
     // ...
   });
   ```

3. **Paste it into a steps file** (e.g. `features/steps/home.steps.ts`) and fill in the code using `page`:

   ```ts
   When('I type {string} into the name field', async ({ page }, name: string) => {
     await page.locator('#name').fill(name);
   });

   Then('the name field should contain {string}', async ({ page }, name: string) => {
     await expect(page.locator('#name')).toHaveValue(name);
   });
   ```

4. **Run `npm test` again.**

> 💡 Steps you've already written (like `Given I open the home page`) can be reused in any scenario. You don't write them twice.

> 💡 Not sure what locator to use? In VS Code's Testing panel (with the Playwright extension), click **Pick locator**, then click the element on the page.

---

## 9. Working with branches

A **branch** is a separate line of work. `main` holds the stable version; you make changes on your own branch and merge them in when they're ready.

**Create a branch and switch to it:**

```bash
git switch -c your-branch-name
```

**Switch between existing branches:**

```bash
git switch main
git switch your-branch-name
```

**See your branches** (the current one has a `*`):

```bash
git branch
```

**Save your work and upload it:**

```bash
git add .
git commit -m "Describe what you changed"
git push -u origin your-branch-name    # -u is only needed the first time
```

Then open a **Pull Request** on GitHub to merge your branch into `main`.

> ⚠️ **Commit before switching branches.** Uncommitted changes don't belong to any branch yet, so they follow you when you switch. This makes it look like your branches are "mixing".

> ℹ️ A new branch starts as an exact copy of the branch you were on. The two only become different once you commit something.

> ℹ️ Make sure `main` is pushed to GitHub (`git push -u origin main`) and set as the default branch in **GitHub → repo Settings → General → Default branch**.

---

## 10. Recommended VS Code extensions

Open Extensions (`Ctrl+Shift+X`) and search for these IDs:

| Extension | ID | What it gives you |
|---|---|---|
| **Cucumber** (official) | `CucumberOpen.cucumber-official` | Colours for `.feature` files, step autocomplete, Ctrl+click a step to jump to its code, warnings for steps with no code |
| **Playwright Test for VS Code** | `ms-playwright.playwright` | Run/debug tests from the Testing sidebar, watch the browser, **Pick locator** tool |

If the Cucumber extension can't find your step definitions, create `.vscode/settings.json`:

```json
{
  "cucumber.features": ["features/**/*.feature"],
  "cucumber.glue": ["features/steps/**/*.ts"]
}
```

> ℹ️ The Playwright extension's Testing sidebar shows the *generated* tests. After editing a `.feature` file, run `npx bddgen` (or `npm test`) to refresh it.

---

## 11. Troubleshooting

| Problem | Fix |
|---|---|
| `'node' / 'npm' / 'git' is not recognized` | Close and reopen the terminal or VS Code after installing. If it still fails, reinstall and keep the "Add to PATH" option ticked. |
| My commits on GitHub don't show my profile picture | Your `user.email` doesn't match an email on your GitHub account. See [step 3](#3-set-up-your-git-identity). |
| `Missing step definitions` | A line in a `.feature` file has no matching step code. Copy the snippet it prints into a steps file. See [step 8](#8-write-a-new-test). |
| My `.feature` changes aren't running | You ran `npx playwright test`. Use `npm test` instead. |
| `Executable doesn't exist` / browser not found | Run `npx playwright install`. |
| Tests don't appear in VS Code's Testing panel | Run `npx bddgen`, then click the refresh icon in the Testing panel. |
| My branches look the same | That's normal right after creating a branch. They split once you commit. See [step 9](#9-working-with-branches). |

---

## 12. Command cheat sheet

```bash
# ---- One-time setup ----
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# ---- Project setup ----
npm ci                          # install packages (from package-lock.json)
npx playwright install          # download browsers

# ---- Running tests ----
npm test                        # run all tests
npm test -- --project=chromium  # Chrome only
npm test -- --headed            # show the browser
npm run test:ui                 # interactive UI mode
npm run report                  # open last HTML report

# ---- Git ----
git status                      # what has changed?
git switch -c new-branch        # create + switch to a branch
git add .                       # stage all changes
git commit -m "message"         # save a snapshot
git push                        # upload to GitHub
```

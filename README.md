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
9. [Branches: development vs production](#9-branches-development-vs-production)
10. [GitHub Actions (automatic tests on GitHub)](#10-github-actions-automatic-tests-on-github)
11. [Protect the `main` branch](#11-protect-the-main-branch)
12. [Recommended VS Code extensions](#12-recommended-vs-code-extensions)
13. [Troubleshooting](#13-troubleshooting)
14. [Command cheat sheet](#14-command-cheat-sheet)

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

## 9. Branches: development vs production

A **branch** is a separate line of work. This project uses two:

| Branch | Role | Rule |
|---|---|---|
| `main` | **Production.** The stable, working version. | Never edit directly. Changes only arrive through a Pull Request. |
| `milleandrei` | **Development.** Where you write and try out new tests. | Commit and push here as often as you like. |

```
milleandrei (development)  ──commit──commit──commit──┐
                                                     │  Pull Request
main (production)          ──────────────────────────●──── (tests must pass ✓)
```

### 9.1 Set up both branches (one time)

1. **Commit something on `main` first.** A branch only really exists once it has at least one commit.

2. **Push `main` to GitHub.** This step is easy to forget. If you skip it, GitHub only knows about your development branch and treats it as the main one.

   ```bash
   git push -u origin main
   ```

3. **Create the development branch** from `main` and push it:

   ```bash
   git switch -c milleandrei
   git push -u origin milleandrei
   ```

4. **Make `main` the default branch on GitHub:**
   1. Open your repo on GitHub and click the **⚙️ Settings** tab (top right of the tab row, next to *Insights*).
   2. On the **General** page, scroll to **Default branch**.
   3. Click the **⇄** (two arrows) button, choose **main**, click **Update**, then confirm.

5. **Check it worked.** On GitHub, the branch dropdown (top left of the file list) should show both `main` and `milleandrei`, with `main` marked as **default**. In the terminal:

   ```bash
   git branch -vv
   ```

   Both branches should show a `[origin/...]` link.

### 9.2 Day-to-day workflow

1. **Make sure you're on the development branch:**

   ```bash
   git switch milleandrei
   ```

2. **Write tests, then save and upload your work:**

   ```bash
   git add .
   git commit -m "Describe what you changed"
   git push
   ```

3. **When it's ready for production, open a Pull Request (PR):**
   1. On GitHub, go to **Pull requests → New pull request**.
   2. Set **base: `main`** ← **compare: `milleandrei`**.
   3. Click **Create pull request**, give it a title and short description, and create it.
   4. Wait for the automatic tests (see [step 10](#10-github-actions-automatic-tests-on-github)) to show a green ✓.
   5. Click **Merge pull request**.

4. **Bring the updated `main` back to your computer:**

   ```bash
   git switch main
   git pull
   git switch milleandrei
   ```

### 9.3 Things to know

> ⚠️ **Commit before switching branches.** Uncommitted changes don't belong to any branch yet, so they follow you when you switch. This makes it look like your branches are "mixing".

> ℹ️ A new branch starts as an exact copy of the branch you were on, so right after creating it both branches look identical. They only become different once you commit something.

> ℹ️ `git add`, `git commit` and `git push` work the same on every branch. Only *where* you push changes, and what GitHub does afterwards.

---

## 10. GitHub Actions (automatic tests on GitHub)

GitHub Actions runs your tests on GitHub's own computers after you push. It's set up by `.github/workflows/playwright.yml`, which `npm init playwright` created in [step 4](#4-create-the-playwright-project).

It **doesn't change anything you do on your computer.** It only reacts once a push reaches GitHub:

```
Your computer                    GitHub
─────────────                    ──────
git add     (nothing happens)
git commit  (nothing happens)
git push  ───────────────────►   code arrives
                                 └─► Does this match a trigger in playwright.yml?
                                       yes → runs the tests on a GitHub server
                                       no  → nothing happens
```

### 10.1 When do the tests run?

The triggers are at the top of `playwright.yml`:

```yaml
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
```

| You do this | Tests run? |
|---|---|
| Push to `milleandrei` | **No.** It isn't listed under `push`. |
| Open a Pull Request from `milleandrei` into `main` | **Yes.** The result shows on the PR page. |
| Push more commits to a branch that has an open PR | **Yes**, the tests run again. |
| Push to `main` or merge a PR into it | **Yes.** |

> 💡 Want tests to run on every development push too? Add your branch to the list: `branches: [ main, master, milleandrei ]`.

### 10.2 Reading the results

- **🟡 Yellow dot:** tests are running.
- **✅ Green check:** all tests passed.
- **❌ Red cross:** something failed. Click it, then **Details**, to see which test failed.
- The **Actions** tab on your repo lists every run.
- Each run saves the HTML report as a downloadable **`playwright-report`** file, with screenshots and videos of failures. Find it at the bottom of the run's page under **Artifacts**.

> ℹ️ On its own, a red ❌ **doesn't block anything**. Your push still succeeds and you can still merge. To stop failing tests from reaching `main`, set up branch protection ([step 11](#11-protect-the-main-branch)).

> ℹ️ Actions is free for public repos. Private repos get a free monthly allowance of minutes, and a small test suite uses very little.

---

## 11. Protect the `main` branch

Branch protection makes GitHub enforce the "production" rules: nobody can push straight to `main`, and a PR can only be merged when the tests pass.

This is set on the GitHub **website**. Git commands in the terminal can't change it.

> ℹ️ Branch protection is free for **public** repos. Private repos need a paid GitHub plan.

### 11.1 Create a ruleset

1. Open your repo on GitHub and click **⚙️ Settings**.
2. In the left sidebar under **Code and automation**, click **Rules → Rulesets**. Or click **Branches**, which offers the same thing.
3. Click **New ruleset → New branch ruleset**.
4. Fill in:

   | Setting | What to do |
   |---|---|
   | **Ruleset name** | `protect-main` |
   | **Enforcement status** | **Active** (if it says *Disabled*, the rules do nothing) |
   | **Target branches** | Click **Add target → Include by pattern**, type `main`, and click **Add Inclusion pattern** |
   | ☑ **Restrict deletions** | Leave ticked. Stops `main` from being deleted. |
   | ☑ **Block force pushes** | Leave ticked. Stops anyone from rewriting `main`'s history. |
   | ☑ **Require a pull request before merging** | Tick it. Set **Required approvals** to **0** (see the warning below). |
   | ☑ **Require status checks to pass** | Tick it, click **Add checks**, search for `test`, and select it. That's the Playwright job. |

5. Click **Create**.

> ⚠️ **Set Required approvals to 0 if you work alone.** GitHub doesn't let you approve your own Pull Request, so with 1 or more approvals required you'd never be able to merge.

> ⚠️ **Warning: "This ruleset does not target any resources and will not be applied."** The **Target branches** section is empty. Add `main` with **Include by pattern** as shown above. Prefer the pattern over *Include default branch*, because if the default branch is still set to your development branch, that option protects the wrong branch.

> ℹ️ **`test` doesn't show up when adding status checks?** GitHub only lists checks that have run at least once recently. Push `main` or open a PR, wait for the run in the **Actions** tab to finish, then try again.

### 11.2 What changes afterwards

- `git push` directly to `main` is **rejected**. That's expected. All changes go through `milleandrei` and a Pull Request.
- The **Merge** button on a PR stays grey until the tests show a green ✓.
- As the repo owner, you can still bypass the rule in an emergency.

---

## 12. Recommended VS Code extensions

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

## 13. Troubleshooting

| Problem | Fix |
|---|---|
| `'node' / 'npm' / 'git' is not recognized` | Close and reopen the terminal or VS Code after installing. If it still fails, reinstall and keep the "Add to PATH" option ticked. |
| My commits on GitHub don't show my profile picture | Your `user.email` doesn't match an email on your GitHub account. See [step 3](#3-set-up-your-git-identity). |
| `Missing step definitions` | A line in a `.feature` file has no matching step code. Copy the snippet it prints into a steps file. See [step 8](#8-write-a-new-test). |
| My `.feature` changes aren't running | You ran `npx playwright test`. Use `npm test` instead. |
| `Executable doesn't exist` / browser not found | Run `npx playwright install`. |
| Tests don't appear in VS Code's Testing panel | Run `npx bddgen`, then click the refresh icon in the Testing panel. |
| My branches look the same | That's normal right after creating a branch. They split once you commit. See [step 9](#9-branches-development-vs-production). |
| On GitHub I only see my development branch, not `main` | `main` was never pushed. Run `git push -u origin main`, then make it the default branch. See [step 9.1](#91-set-up-both-branches-one-time). |
| My development branch is the "default" on GitHub | It was the first branch pushed. Change it under **Settings → General → Default branch**. |
| Tests didn't run on GitHub after I pushed | Pushes to `milleandrei` don't trigger tests, only PRs and `main` do. See [step 10.1](#101-when-do-the-tests-run). |
| `This ruleset does not target any resources` | Add `main` under **Target branches → Include by pattern**. See [step 11.1](#111-create-a-ruleset). |
| `git push` to `main` is rejected | Branch protection is working. Push to `milleandrei` and open a Pull Request instead. |
| The **Merge** button is grey | Tests haven't passed yet, or **Required approvals** is above 0. See [step 11](#11-protect-the-main-branch). |

---

## 14. Command cheat sheet

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

# ---- Git: everyday ----
git status                      # what has changed?
git branch -vv                  # list branches (+ their GitHub links)
git switch milleandrei          # go to the development branch
git add .                       # stage all changes
git commit -m "message"         # save a snapshot
git push                        # upload to GitHub

# ---- Git: after a PR is merged into main ----
git switch main
git pull                        # download the updated main
git switch milleandrei          # back to development

# ---- Git: one-time branch setup ----
git push -u origin main         # put main on GitHub
git switch -c milleandrei       # create the development branch
git push -u origin milleandrei  # put it on GitHub
```

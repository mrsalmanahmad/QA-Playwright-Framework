# Playwright Automation Framework

A production-ready end-to-end test automation framework built with **Playwright** and **TypeScript/JavaScript**, following the **Page Object Model (POM)** pattern. Designed to be scalable, maintainable, and easy to onboard new team members.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Test Data Configuration](#test-data-configuration)
- [Running Tests](#running-tests)
- [Reporting](#reporting)
- [Authentication Setup](#authentication-setup)
- [Writing New Tests](#writing-new-tests)
- [Adding a New Module](#adding-a-new-module)
- [Load Testing with Artillery](#load-testing-with-artillery)
- [CI/CD Integration (Azure DevOps)](#cicd-integration-azure-devops)
- [Framework Architecture](#framework-architecture)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | >= 18.x | [nodejs.org](https://nodejs.org) |
| npm | >= 9.x | Comes with Node.js |
| Git | Latest | [git-scm.com](https://git-scm.com) |

---

## Project Structure

```
PF-Automation-Framework/
│
├── data/
│   └── globalData.json          # Centralized test data (search values, expected messages)
│
├── env/
│   ├── .env.UAT                 # UAT environment URL
│   ├── .env.QA                  # QA environment URL
│   ├── .env.PROD                # Production environment URL
│   └── .env.GLOBAL              # Global environment URL
│
├── images/                      # Static images used in tests (e.g. widget uploads)
│
├── pageobjects/                 # CSS/XPath selectors organized by module
│   ├── global.js                # Shared selectors across all pages
│   ├── loginPage.js
│   ├── dashboards.js
│   └── ...
│
├── pages/                       # Page classes (POM) — actions and verifications
│   ├── basePage.js              # Base class with 50+ reusable utility methods
│   ├── loginPage.js
│   ├── dashboards.js
│   ├── navigations.js
│   └── ...
│
├── testFixtures/
│   └── fixture.js               # Custom Playwright fixtures injecting all page objects
│
├── tests/
│   ├── loging.setup.ts          # Authentication setup (runs before all tests)
│   ├── loginPage/
│   ├── dashboards/
│   │   ├── dashboardsLV/
│   │   └── dashboardsWidgets/
│   ├── organization/
│   ├── utils/
│   │   └── auth.js              # OAuth2 token helper
│   └── ...                      # One folder per module
│
├── tests-examples/
│   └── demo-todo-app.spec.ts    # Playwright reference example
│
├── screenshots/                 # Auto-saved screenshots (gitignored)
├── .auth/                       # Saved auth state (gitignored)
│
├── config.js                    # Central URL and navigation config
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Dependencies and scripts
├── artillery.yml                # Load test configuration
└── .gitignore
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd PF-Automation-Framework
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

### 4. Configure your environment

Copy the environment files and update with your application URLs:

```bash
# The env/ folder already contains template files:
# env/.env.UAT, env/.env.QA, env/.env.PROD, env/.env.GLOBAL
```

Update each file with your actual URL:
```env
URL=https://your-actual-app-url.com/
LINE=''
```

### 5. Configure test data

Open `data/globalData.json` and replace all placeholder values with your actual test data:

```json
{
  "user_name": "your_username",
  "password": "your_password",
  "defaultAssemblyLine": "Your Assembly Line",
  ...
}
```

> **Security Note:** Never commit real credentials. Use environment variables or a secrets manager in CI/CD.

---

## Environment Configuration

The framework supports multiple environments. Set the `ENV` variable before running tests to load the corresponding `.env` file from the `env/` folder.

### Windows (PowerShell)

```powershell
$env:ENV = "UAT"
npx playwright test
```

### Windows (Command Prompt)

```cmd
set ENV=UAT
npx playwright test
```

### Linux / macOS

```bash
ENV=UAT npx playwright test
```

### Available Environments

| ENV value | File loaded | Description |
|-----------|-------------|-------------|
| `UAT` | `env/.env.UAT` | User Acceptance Testing |
| `QA` | `env/.env.QA` | Quality Assurance |
| `PROD` | `env/.env.PROD` | Production |
| `GLOBAL` | `env/.env.GLOBAL` | Global environment |

---

## Test Data Configuration

All test data is centralized in `data/globalData.json`. Update the values before running tests:

```json
{
  "user_name": "your_username",           // Login username
  "password": "your_password",            // Login password
  "defaultAssemblyLine": "Line Name",     // Assembly line to select after login
  "dashboardToSearch": "My Dashboard",    // Dashboard name for search tests
  ...
}
```

---

## Running Tests

### Run all tests

```bash
npx playwright test
```

### Run with a specific environment

```powershell
# PowerShell
$env:ENV = "UAT"; npx playwright test
```

### Run a specific test file

```bash
npx playwright test tests/dashboards/dashboardsLV/verifyLVScreenIsWorking.spec.ts
```

### Run tests by tag

```bash
# Run only @sanity tests
npx playwright test --grep "@sanity"

# Run only @smoke tests
npx playwright test --grep "@smoke"
```

### Run in headed mode (see browser)

```bash
npx playwright test --headed
```

### Run in debug mode (step through)

```bash
npx playwright test --debug
```

### Run with Playwright UI mode

```bash
npx playwright test --ui
```

### Run tests in parallel (default)

Tests run fully parallel by default. To limit workers:

```bash
npx playwright test --workers=2
```

---

## Reporting

### HTML Report (built-in)

After a test run, open the report:

```bash
npx playwright show-report
```

The report is saved to `playwright-report/`.

### Allure Report

Generate and open Allure report:

```bash
# Generate
npx allure generate allure-results --clean -o allure-report

# Open
npx allure open allure-report
```

> Requires Java installed. Install Allure CLI: `npm install -g allure-commandline`

---

## Authentication Setup

The framework uses Playwright's storage state to persist login sessions, avoiding repeated logins per test.

### How it works

1. `tests/loging.setup.ts` runs first (it matches `*.setup.ts` pattern in `playwright.config.ts`)
2. It logs in using credentials from `data/globalData.json`
3. Saves the browser storage state to `.auth/login.json`
4. All subsequent tests reuse this saved auth state

### Running the setup manually

```bash
npx playwright test tests/loging.setup.ts
```

The `.auth/` folder is gitignored — each developer/CI agent runs setup once locally.

---

## Writing New Tests

### Basic test structure

```typescript
import test from '../../testFixtures/fixture';
import { expect } from '@playwright/test';
import fs from 'fs';

const testData = JSON.parse(fs.readFileSync(`./data/globalData.json`, `utf-8`));

import { baseUrl } from '../../config';

test.describe('@sanity: Feature description', () => {
  test('Test name describing what it verifies', async ({ loginPage, dashbaordPage }) => {
    
    await test.step('Step 1: Navigate to the page', async () => {
      await dashbaordPage.goToDashboardsLV();
    });

    await test.step('Step 2: Perform action', async () => {
      await dashbaordPage.waitForPageLoad();
    });

    await test.step('Step 3: Verify result', async () => {
      expect(await dashbaordPage.isTableLoaded()).toBe(true);
    });
  });
});
```

### Tagging convention

Use tags in `test.describe()` for filtering:

| Tag | Purpose |
|-----|---------|
| `@sanity` | Core happy-path tests — run on every build |
| `@smoke` | Quick smoke check after deployment |
| `@regression` | Full regression suite |

### Available fixtures

All page objects are available as fixtures via `testFixtures/fixture.js`:

```typescript
async ({ loginPage, dashbaordPage, organizationPage, measuringPointsPage, ... })
```

See `testFixtures/fixture.js` for the complete list of available fixtures.

---

## Adding a New Module

Follow this 4-step pattern to add a new page/module to the framework:

### Step 1: Add selectors to `pageobjects/`

Create `pageobjects/myModule.js`:

```javascript
export const addButton = '#addAction'
export const searchInput = '[placeholder="Search"]'
export const mainGridTable = 'table#MyModule_headers'
export const mainTableDataGrid = '#MyModule_scroll'
```

### Step 2: Create the page class in `pages/`

Create `pages/myModule.js`:

```javascript
import BasePage from './basePage'
import { myModuleLV } from '../config'
import { addButton, mainGridTable } from '../pageobjects/myModule'

class MyModule extends BasePage {
  constructor(page) {
    super(page)
  }

  async goToMyModuleLV() {
    await this.open(myModuleLV)
  }

  async isTableLoaded() {
    return await super.isTableLoaded(mainGridTable)
  }

  async clickOnAddButton() {
    await this.waitAndClick(addButton)
  }
}

export default MyModule
```

### Step 3: Add the URL to `config.js`

```javascript
export const myModuleLV = baseUrl + 'YourApp/Module/GetListView'
```

### Step 4: Register the fixture in `testFixtures/fixture.js`

```javascript
import MyModule from '../pages/myModule'

// Inside the fixture.extend({}) block:
myModulePage: async ({ page }, use) => {
  await use(new MyModule(page))
},
```

### Step 5: Write tests in `tests/myModule/`

Create `tests/myModule/verifyLVScreenIsWorking.spec.ts`:

```typescript
import test from '../../testFixtures/fixture';
import { expect } from '@playwright/test';

test.describe('@sanity: MyModule LV is working correctly', () => {
  test('Navigate to MyModule and verify table loads', async ({ myModulePage }) => {
    await test.step('Navigate to MyModule', async () => {
      await myModulePage.goToMyModuleLV();
    });
    await test.step('Verify table is loaded', async () => {
      expect(await myModulePage.isTableLoaded()).toBe(true);
    });
  });
});
```

---

## Load Testing with Artillery

The framework includes Artillery integration for basic load testing.

### Setup

```bash
npm install -g artillery
npm install -g artillery-engine-playwright
```

### Configure target

Update `artillery.yml` with your target URL:

```yaml
config:
  target: https://your-app-uat.yourdomain.com/
```

### Run load test

```bash
artillery run artillery.yml
```

### Generate HTML report

```bash
artillery run artillery.yml --output loadTest.json
artillery report loadTest.json
```

---

## CI/CD Integration (Azure DevOps)

### Pipeline YAML example

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'

  - script: npm ci
    displayName: 'Install dependencies'

  - script: npx playwright install --with-deps
    displayName: 'Install Playwright browsers'

  - script: npx playwright test
    displayName: 'Run tests'
    env:
      ENV: UAT
      CI: true

  - task: PublishTestResults@2
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: 'test-results/**/*.xml'
    condition: always()
```

### Setting credentials securely in Azure DevOps

1. Go to **Pipelines > Library > Variable Groups**
2. Create a variable group (e.g. `automation-secrets`)
3. Add variables: `USER_NAME`, `PASSWORD`, `URL`
4. Mark sensitive variables as secret
5. Reference in pipeline:

```yaml
variables:
  - group: automation-secrets
```

Then override in `data/globalData.json` at runtime, or use `process.env.USER_NAME` directly in your page classes.

---

## Framework Architecture

```
┌─────────────────────────────────────────────┐
│                  Test Specs                  │
│           tests/**/*.spec.ts                 │
└────────────────────┬────────────────────────┘
                     │ uses
┌────────────────────▼────────────────────────┐
│              Test Fixtures                   │
│         testFixtures/fixture.js              │
│   (injects page objects into tests)          │
└────────────────────┬────────────────────────┘
                     │ instantiates
┌────────────────────▼────────────────────────┐
│              Page Classes (POM)              │
│              pages/*.js                      │
│   (actions: login, navigate, click, fill)    │
└──────────┬─────────────────┬────────────────┘
           │ extends          │ imports
┌──────────▼──────┐  ┌───────▼──────────────┐
│   BasePage.js   │  │  Selectors/Locators   │
│ (50+ utilities) │  │  pageobjects/*.js     │
└─────────────────┘  └──────────────────────┘
           │
┌──────────▼──────────────────────────────────┐
│           Configuration & Data               │
│   config.js      → URLs, nav paths           │
│   data/*.json    → Test data, search values  │
│   env/.env.*     → Environment-specific URLs │
└─────────────────────────────────────────────┘
```

### Key design principles

| Principle | Implementation |
|-----------|---------------|
| **Separation of concerns** | Selectors in `pageobjects/`, actions in `pages/` |
| **DRY** | `BasePage.js` provides 50+ shared utility methods |
| **Single source of truth** | All URLs in `config.js`, all test data in `globalData.json` |
| **Reusability** | Custom fixtures inject page objects cleanly |
| **Environment isolation** | `.env.*` files per environment, never hardcoded URLs |

---

## BasePage Utility Methods

`BasePage` provides these ready-to-use methods in all page classes:

| Category | Methods |
|----------|---------|
| **Navigation** | `open(url)`, `getUrl()`, `getTitle()`, `waitForPageLoad()` |
| **Click** | `waitAndClick(selector)`, `waitAndHardClick(selector)` |
| **Input** | `inputText(selector, text)`, `waitAndFill(selector, text)`, `clearTextField(selector)` |
| **Keyboard** | `keyPress(selector, key)` |
| **Assertions** | `verifyTextOnPage(text)`, `verifyElementText(sel, text)`, `verifyElementVisible(sel)`, `verifyElementContainsText(sel, text)`, `verifyFlashMessage(text)` |
| **Element state** | `isElementVisible(sel)`, `isElementNotVisible(sel)`, `isElementEnabled(sel)`, `isElementChecked(sel)` |
| **Table** | `isTableLoaded(selector)`, `getTableData(tableSelector, dataGrid)` |
| **Dropdown** | `selectValueFromDropdown(sel, text)`, `selectValueInDropDownField(name, input, combo)` |
| **Screenshots** | `takeScreenShot()`, `takeFullPageScreenShot(imgName)` |
| **File ops** | `downloadAndVerify(fileName)`, `uploadDocument(fileName)`, `searchInXLSX(filePath, text)`, `isStringInXLSX(filePath, text)` |
| **Drag & drop** | `dragAndDropElement(selector, targetDiv)` |
| **Row actions** | `clickRowDeleteButton(rowDataKey)`, `clickOnYesOptionDeletePopup(selector)` |
| **Tabs/Navigation** | `clickTab(tabName, selector)` |
| **Misc** | `generateRandomString(name)`, `delay(ms)`, `centerScroll()`, `pause()` |

---

## Troubleshooting

### Tests fail with "auth state not found"

Run the setup test first:

```bash
npx playwright test tests/loging.setup.ts
```

### Environment variables not loading

Ensure `ENV` is set correctly and the corresponding file exists in `env/`:

```powershell
$env:ENV = "UAT"  # Must match the filename: env/.env.UAT
```

### Browser not installed

```bash
npx playwright install chromium
```

### "Element not found" / timeout errors

1. Check if the selector in `pageobjects/` is still valid for your app version
2. Increase timeout in `playwright.config.ts` if needed
3. Use `--debug` to step through the test interactively

### Node modules issues

```bash
rm -rf node_modules
npm install
```

### Screenshots not saving

Ensure the `screenshots/` folder exists:

```bash
mkdir screenshots
```

---

## Contributing

1. Create a branch: `git checkout -b feature/your-module-name`
2. Follow the [Adding a New Module](#adding-a-new-module) steps
3. Ensure tests pass locally before raising a PR
4. Test naming convention: `verifyFeatureNameAndBehavior.spec.ts`
5. Use `test.describe()` with a clear description and tag (e.g. `@sanity`)

---

## License

Internal use only. Not for public distribution.

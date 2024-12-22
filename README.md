# Playwright e2e tests for web application

## Setup
npm i
npx playwright install

Before running test app should be running on 'http://localhost:8080/'

## Code structure

* Helpers: Contains a file with constants. Can be extended to functions to support the tests.
* Pages: Page objects representing screens of the app, implementing the Page Object Model (POM).
* Tests: Contains the actual UI test cases.

## Pipeline

* All tests run every night from Monday to Friday.

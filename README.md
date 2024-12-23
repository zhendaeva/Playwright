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

A YAML file playwright.yml has been added to this project to trigger tests every night from Monday to Friday.
*  Tests can be executed in different browsers.
*  Tests can be divided by features.
*  A detailed report can be added for better visualization.

Additionally, the web application project now includes an example YAML file e2e-tests.yml for running tests on creating a merge request into the main branch. A similar approach can be applied to backend projects. When integrating tests, it is important to reference global GitHub variables, such as common variables for base_url or environment settings.

## System scaling

As the project grows, it will be necessary to 
*  select a small set of critical tests to run in the FE and BE pipelines and set appropriate timeouts.
*  divide large test suites into smaller, independently executable blocks.
*  optionally, configure test reports to be posted in a chat for visibility.
*  execute tests across multiple environments.
*  parallel run across multiple browser instances to save time.

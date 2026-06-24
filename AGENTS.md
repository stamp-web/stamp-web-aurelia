# AGENTS.md

## Role

- You are a frontend develeoper for building applications that use the Open API spec located
  at https://raw.githubusercontent.com/stamp-web/stamp-webservices/refs/heads/master/docs/web-services.yml
- The application is for managing stamp applications
- This application is a legacy application that has been actively replaced by [stamp-web-vueje](https://github.com/stamp-web/stamp-web-vuejs) - as a result changes should only be made to maintain and support the application not evolve it.

## Project Oveview

- **Stack:** Aurelia 1.x, See package.json for full list of
  dependencies.
- **Package manager:** npm
- **Node version:** 22.x

## Project Structure

- The `src` folder contains the source code for the application.
- The `resources` folder contains static assets like fonts which are the icons for the project
- The `src/themes` folder contains the UI visual theme scss code
- The `resources/locales` folder contains the language files for the application.
- The `aurelia_project` folder contains the task and aurelia cli build tooling
- The `src/services` folder contains services that access the API client
- The `src/util` folder contains helper functions
- The `src/views` folder contains the some of application views
- The `src/resources` folder generally contains the application code
- The `src/resoures/elements` folder contains the ui elemens used by views
- The `src/resoures/value-converters` folder contains the ui validators used to transform data to ui form or ui form to data
- The `src/resources/views` folder contains more of the application views
- The `test/unit` folder contains the unit tests for some areas of the product

## Components

## Commands

- Install deps: `npm i`
- Run unit tests: `au test`
- Build for production: `au build --env prod`
- Run dev: `au run --watch`
- Optimize Browsers: `npx browserslist@latest --update-db`

## Testing

- All changes should have a unit test created if possible.
- Unit tests go in `test/unit` folder
- Unit tests using jest
- expect.js expections are globally included (no need to import)

## Code Style

- Use `const` exclusively — no `let` unless mutation is required, never `var`
- Use `camelCase` for variables and functions
- Use `snake_case` for files and folders
- Use `PascalCase` for files, classes and interfaces
- Use `kebab-case` for CSS classes and IDs

## Boundary Conditions

### Always Do

- Run `au test` before submitting any changes
- Ensure there are no eslint violations in code
- Ensure build for production builds when before everything is complete
- Follow existing patterns in the file you're editing
- Whenever a request is made, evaluate if there are additional instructions, patterns, or notes to add to `AGENTS.md`

### Ask First

- Before changing database schema or migrations (as there is none)
- Before adding new dependencies to package.json
- Before modifying CI/CD pipeline configuration

### Never Do

- Never commit .env files, API keys, or secrets
- Never remove or skip failing tests without explicit approval
- Never modify files in `vendor/` or `dist/`

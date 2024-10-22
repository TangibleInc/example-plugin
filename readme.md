# Example Plugin

Description of example plugin

## Getting started

Prerequisites: [Git](https://git-scm.com/), [Node](https://nodejs.org/en/) (version 18 and above) or [Bun](https://bun.sh)

```sh
git clone git@github.com:tangibleinc/example-plugin.git
cd example-plugin
npm install
```

## Develop

#### Build for development

Build, watch files for changes and rebuild.

```sh
npm run start
```

It starts a local development site using [`wp-now`](https://github.com/WordPress/playground-tools/blob/trunk/packages/wp-now/README.md).

#### Build for production

```sh
npm run build
```

#### Format

Format source code with [Prettier](https://prettier.io).

```sh
npm run format
```

## Local environment

Optionally, create a file named `.wp-env.override.json` to customize the WordPress environment. This file is listed in `.gitignore` so it's local to your setup.

Mainly it's useful for mounting local folders into the virtual file system. For example, to link another plugin in the parent directory:

```json
{
  "mappings": {
    "wp-content/plugins/example-plugin": "../example-plugin"
  }
}
```

## Tests

### End-to-end tests

The folder `/tests/e2e` contains end-to-end-tests using [Playwright](https://playwright.dev/docs/intro) and [WordPress E2E Testing Utils](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-e2e-test-utils-playwright/).

```sh
npm run e2e
```

The first time you run it, it will prompt you to install the browser engine (Chromium).

```sh
npx playwright install
```

#### Watch mode

There is a "Watch mode", where it will watch the test files for changes and re-run them. 
This provides a helpful feedback loop when writing tests, as a kind of test-driven development. Press CTRL + C to stop the process.

```sh
npm run e2e:watch
```

A common usage is to have terminal sessions open with `npm run dev` (build assets and watch to rebuild) and `npm run e2e:watch` (run tests and watch to re-run).

#### UI mode

There's also "UI mode" that opens a browser interface to interactively run the tests and view results.

```sh
npm run e2e:ui
```

#### Utilities

Here are the common utilities used to write the tests.

- `test` - https://playwright.dev/docs/api/class-test
- `expect` - https://playwright.dev/docs/api/class-genericassertions
- `admin` - https://github.com/WordPress/gutenberg/tree/trunk/packages/e2e-test-utils-playwright/src/admin
- `page` - https://playwright.dev/docs/api/class-page
- `request` - https://playwright.dev/docs/api/class-apirequestcontext

#### References

Examples of how to write end-to-end tests:

- WordPress E2E tests - https://github.com/WordPress/wordpress-develop/blob/trunk/tests/e2e
- Gutenberg E2E tests - https://github.com/WordPress/gutenberg/tree/trunk/test/e2e


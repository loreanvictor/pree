<img src="./splash-dark.svg#gh-dark-mode-only"/>
<img src="./splash-light.svg#gh-light-mode-only"/>

```bash
npx pree build <src> <dest>
```

<div align="right">

[![npm](https://img.shields.io/npm/v/pree?color=black&label=&style=flat-square)](https://www.npmjs.com/package/pree)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/loreanvictor/pree/coverage.yml?label=&style=flat-square)](https://github.com/loreanvictor/pree/actions/workflows/coverage.yml)

</div>

Modern web standards like [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) can provide a smooth DX for building a lot of websites (such as blogs and docs) by simply writing and serving plain HTML, CSS and JS files (an approach called [no build](https://world.hey.com/dhh/you-can-t-get-faster-than-no-build-7a44131c)). This approach has a few inherent gaps though:

- Web components are rendered on the client so the page load feels slower and jankier
- Multiple HTML pages share layout and metadata
- Some components are static and don't need to be shipped to clients
- Some components need to access build environment (e.g. imagine a list of all available pages)

<br>

`pree` is a minimalst tool that addresses these issues:

- 🧬  It pre-renders webcomponents using [declarative shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html).
- 🏗️ It handles layouting and shared metadata using [Front Matter](https://www.scribendi.com/academy/articles/front_matter.en.html#:~:text=Front%20matter%20is%20the%20first,a%20preface%2C%20and%20much%20more.)
- 👻 It enables server components (e.g. `<script build-only>`).
- ✨ It provides APIs that can be used by components to access build environment at build time.

<br>


<br>

# Contents

- [Contents](#contents)
- [Installation](#installation)
- [Usage](#usage)
- [Contribution](#contribution)

<br>

# Installation

You need [Node](https://nodejs.org/en/). You don't need to install `pree` as you can use it with `npx`:

```bash
npx pree view
```

You can install `pree` for more convenient use:

```bash
npm i -g pree
```

To update, use `@latest` tag:

```bash
npx pree@latest view
```
```bash
npm i -g pree@latest
```

<br>

# Usage

👉 Preview your website:

```bash
pree view <dir>
```

- `<dir>` is optional. If not provided, the current directory will be used.

<br>

👉  Pre-build your website:

```bash
pree build <src> <dest>
```

- `<src>` can be a file or a directory. If it's a directory, all files in it will be processed recursively.
- `<dest>` can be a file or a directory. If `<src>` is a directory, then `<dest>` must be a directory as well.

<br>

# Contribution

You need [node](https://nodejs.org/en/), [NPM](https://www.npmjs.com) to start and [git](https://git-scm.com) to start.

```bash
# clone the code
git clone git@github.com:loreanvictor/pree.git
```
```bash
# install stuff
npm i
```

Make sure all checks are successful on your PRs. This includes all tests passing, high code coverage, correct typings and abiding all [the linting rules](https://github.com/loreanvictor/pree/blob/main/.eslintrc). The code is typed with [TypeScript](https://www.typescriptlang.org), [Jest](https://jestjs.io) is used for testing and coverage reports, [ESLint](https://eslint.org) and [TypeScript ESLint](https://typescript-eslint.io) are used for linting. Subsequently, IDE integrations for TypeScript and ESLint would make your life much easier (for example, [VSCode](https://code.visualstudio.com) supports TypeScript out of the box and has [this nice ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)), but you could also use the following commands:

```bash
# run tests
npm test
```
```bash
# check code coverage
npm run coverage
```
```bash
# run linter
npm run lint
```
```bash
# run type checker
npm run typecheck
```

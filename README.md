<img src="./splash-dark.svg#gh-dark-mode-only"/>
<img src="./splash-light.svg#gh-light-mode-only"/>

<div align="right">

[![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/pree?style=flat-square&label=%20&color=black)](https://bundlejs.com/?q=pree)
[![npm](https://img.shields.io/npm/v/pree?color=black&label=&style=flat-square)](https://www.npmjs.com/package/pree)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/loreanvictor/pree/coverage.yml?label=&style=flat-square)](https://github.com/loreanvictor/pree/actions/workflows/coverage.yml)

</div>


Modern web standards like [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), can _mostly_ provide a good enough DX for building a lot of websites (such as blogs and docs) without heavy-handed and convoluted tooling. `pree` is here to fill in the small gaps while being as minimal and simplistic as possible.

```bash
npx pree build
```

`pree` fills in the following gaps:

- 🧬 It prerenders webcomponents using [declarative shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html) ([can you use it? probably.](https://caniuse.com/declarative-shadow-dom)).
- 🏗️ It handles layouting using [Front Matter](https://www.scribendi.com/academy/articles/front_matter.en.html#:~:text=Front%20matter%20is%20the%20first,a%20preface%2C%20and%20much%20more.)
- 👻 It provides features for server-side only components (basically scripts that are omitted after build time).
- ✨ It provides APIs that can be used by webcomponents to access build environment.

<br>

> [!WARNING]
>
> This is work in progress. YOU CAN NOT USE IT RIGHT NOW. \
> 🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧

> 💡 Read more about the idea [here](https://gist.github.com/loreanvictor/936bffc2403f7e07e4b263f1e7d0977f).

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
npx pree build
```

You can install `pree` for more convenient use:

```bash
npm i -g pree
```

<br>

# Usage

Preview your website:

```bash
npx pree view
```

Pre-build your website:

```bash
npx pree build
```

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

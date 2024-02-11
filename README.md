
<div align="right">

[![npm](https://img.shields.io/npm/v/pree?color=black&label=&style=flat-square)](https://www.npmjs.com/package/pree)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/loreanvictor/pree/coverage.yml?label=&style=flat-square)](https://github.com/loreanvictor/pree/actions/workflows/coverage.yml)

</div>

<br>

<img src="./docs/assets/images/logo-dark.svg#gh-dark-mode-only" width="192px"/>
<img src="./docs/assets/images/logo-light.svg#gh-light-mode-only" width="192px"/>

<br>

A CLI that prebuilds HTML files. Use it to build websites with plain HTML, CSS and JS.

🧬 It pre-renders web components ([docs](https://loreanvictor.github.io/pree/usage/)), \
🏗️ It handles layouting and metadata ([docs](https://loreanvictor.github.io/pree/usage/meta-layout)), \
👻 It manages build-only components and scripts ([docs](https://loreanvictor.github.io/pree/usage/build-only-scripts)), \
✨ It gets components and scripts access to build environment ([docs](https://loreanvictor.github.io/pree/components/build-env)).

```bash
pree view     <src>                      # 👉 preview your website
pree build    <src> <dest>               # 👉 prebuild your website
```

<br>

# Usage

👉 Write plain HTML, CSS and JavaScript for your website. Assuming your HTML files and your assets are in `src` folder, preview your website:

```bash
npx pree view src
```

👉 And prebuild it into `dest` folder:

```bash
npx pree build src dest
```
- All web components will be pre-rendered, loading instantly on clients. Web components [supporting SSR](https://loreanvictor.github.io/pree/components/ssr) can re-hydrating on client instead of full re-rendering, improving UX.
- Any `<script build-only>` tags [will be removed](https://loreanvictor.github.io/pree/usage/build-only-scripts) from prebuilt HTML files. Use this to load static web components. They are pre-rendered, no need to send them to clients.
- Use front matter in HTML files [for handling layouting and metadata](https://loreanvictor.github.io/pree/usage/meta-layout).
- Web components can also [use information about the build environment](https://loreanvictor.github.io/pree/components/build-env).

<br>

> [!IMPORTANT]
> 📖 Read [the documentation](https://loreanvictor.github.io/pree) for more info.

<br>

# Credits

`pree` is built on top of the following open-source projects (amongst others). For a more complete list, check out [the credits page](https://loreanvictor.github.io/pree/credits).

- [puppeteer](https://pptr.dev/): for prebuilding pages and pre-rendering web components.
- [koa](https://koajs.com/): for serving content and layouting.
- [cheerio](https://cheerio.js.org/): for manipulating HTML (e.g. layouting).
- [gray-matter](https://github.com/jonschlinkert/gray-matter): for parsing front matter.
- [chokidar](https://github.com/paulmillr/chokidar): for watching files.
- [chalk](https://github.com/chalk/chalk): for all the colors.
- [yargs](https://yargs.js.org/): for parsing command line arguments.
- [yaml](https://eemeli.org/yaml/): for parsing CLI config.

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

<br>

<div align="center">
  <img src="docs/assets/images/watermark-light.svg#gh-light-mode-only" width="480px"/>
  <img src="docs/assets/images/watermark-dark.svg#gh-dark-mode-only" width="480px" />
</div>

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

🧬  It pre-renders HTML files with webcomponents using [declarative shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html). \
🏗️ It handles layouting and shared metadata of HTML files using [Front Matter](https://www.scribendi.com/academy/articles/front_matter.en.html#:~:text=Front%20matter%20is%20the%20first,a%20preface%2C%20and%20much%20more.) \
👻 It enables components that only run in build time (e.g. `<script build-only>`). \
✨ It provides APIs that can be used by components to access build environment at build time.

<br>

# Contents

- [Contents](#contents)
- [Installation](#installation)
- [Usage](#usage)
  - [Frontmatter](#frontmatter)
  - [Layouting](#layouting)
  - [Build Time Scripts](#build-time-scripts)
- [Contribution](#contribution)

<br>

# Installation

You need [Node](https://nodejs.org/en/). Use [npx](https://www.npmjs.com/package/npx) or install globally:

```bash
npx pree view
```
```bash
npm i -g pree
```

To update (or to ensure you are using the latest version), use `@latest` tag:

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
pree view
```
```bash
pree view <dir>
```

- `<dir>` is optional. If not provided, the current directory will be used.

`pree view` will start a local server allowing you to view various files as if they were served by
a web server. It also provides a nice file navigator for navigating through your project. The server
resolves layouts and front matter for HTML files as well.

<br>

👉  Pre-build your website:

```bash
pree build <src> <dest>
```

- `<src>` can be an HTML file or a directory. If it's a directory, all HTML files in it will be processed recursively.
- `<dest>` can be a file or a directory. If `<src>` is a directory, then `<dest>` must be a directory as well.

`pre build` builds one or more HTML files, pre-rendering their web components using [declarative shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html). It launches a local server and uses an emulated browser to pre-render the files, mimicking actual browser behavior. It additionally removes any scripts with `build-only` tag.

<br>

Example:

```bash
pree build docs/index.html dist/index.html
```
```bash
pree build docs/ dist/
```

<br>

> [!NOTE]
> Declarative shadow DOM is a relatively new feature coming to modern browsers. You can check [its support here](https://caniuse.com/declarative-shadow-dom). Browsers that don't support it won't get the benefits of pre-rendering
> web components. This also means that [build time components](#build-time-scripts) won't work in these browsers.

<br>

## Frontmatter

You can use front matter on top of your HTML files to specify metadata. Front matter is a block of YAML or JSON between two lines of three dashes. For example:

```html
---
title: My Page
keywords:
  - Technology
  - Web
  - JavaScript
summary: This is my page
---

<h1>This is my page</h1>
<p>
  And it is about programming web applications in JavaScript or some other topic.
</p>
```

<br>

## Layouting

You can specify the layout to be used for a page inside the front matter:

```html
---
title: My Page
layout: ./layouts/_main.html
---

<h1>My Page</h1>
<p>
  This is my page.
</p>
```
```html
<!-- ./layouts/_main.html -->
<aside>Contents of the side menu</aside>
<main>
  <!-- 👇 This is where content would go -->
  <slot></slot>
</main>
<footer>Some footer content</footer>
```

You can also use named slots to fill in different parts of the parent layout:

```html
---
title: My Page
layout: ./layouts/_main.html
---

<h1>My Page</h1>
<p>
  This is my page.
</p>
<span slot="footer">Some extra footer content</span>
```
```html
<!-- ./layouts/_main.html -->
<aside>Contents of the side menu</aside>
<main>
  <!-- 👇 This is where content would go -->
  <slot></slot>
</main>
<footer>
  Some generic footer content |
  <!-- 👇 This is where content with slot=footer will go -->
  <slot name="footer"></slot>
</footer>
```

Elements with named slots should reside on the root of the child document. `pree` will ignore them otherwise
as they might be part of a web component template.
```html
---
layout: ./layouts/_main.html
---
<!-- ✅ This is OK -->
<span slot="footer">Some extra footer content</span>
```
```html
---
layout: ./layouts/_main.html
---
<!-- ❌ This is WRONG (man). -->
<div>
  <span slot="footer">Some extra footer content</span>
</div>
```

<br>

## Build Time Scripts

You can have scripts in your page that are only executed during `pree build` and not shipped to the client. This is useful for example for static web components that don't need to run on the client, or for scripts that are to be executed in the build environment. To do so, use the `build-only` tag:

```html
<script build-only>
  console.log('This will only be executed during pree build');
</script>
```
```html
<script build-only src="./components/my-component.js" type="module"></script>
<my-component>Ladida</my-component>

<!-- 🖕 The component will be loaded and prerendered in build time. It won't be loaded on the client. -->
```

<br>

> [!TIP]
> All build time scripts will be loaded and executed during `pree view` as well.

> [!NOTE]
> [Browsers that don't support declarative shdow DOM](https://caniuse.com/declarative-shadow-dom) won't render
> built-time components properly. If you want to support them, make sure to load all web components on the client
> as well.

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

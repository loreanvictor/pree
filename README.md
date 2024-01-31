<img src="./splash-dark.svg#gh-dark-mode-only"/>
<img src="./splash-light.svg#gh-light-mode-only"/>

```bash
pree view   <src>        # preview your HTML files
pree build  <src> <dest> # prebuild your HTML files
```

<div align="right">

[![npm](https://img.shields.io/npm/v/pree?color=black&label=&style=flat-square)](https://www.npmjs.com/package/pree)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/loreanvictor/pree/coverage.yml?label=&style=flat-square)](https://github.com/loreanvictor/pree/actions/workflows/coverage.yml)

</div>

`pree` is a minimalistic tool that prebuilds HTML files, and:

🧬 it pre-renders web components (faster loading, MUCH smoother UX), \
🏗️ it handles layouting and shared metadata (no copy-pasta, breezy DX), \
👻 it enables build-time only components and scripts (even faster loading), \
✨ it provides access to build environment to components and scripts (for some magical web components).

<br>

It is designed to create static sites such as blogs or docs using standard HTML, CSS and JavaScript with great UX and DX,
without using any build tools or frameworks.

<br>

# Contents

- [Contents](#contents)
- [Motivation](#motivation)
- [Installation](#installation)
- [Usage](#usage)
  - [Metadata](#metadata)
  - [Layouting](#layouting)
  - [Build Time Scripts](#build-time-scripts)
  - [Build Environment](#build-environment)
  - [CLI Options](#cli-options)
- [Contribution](#contribution)

<br>

# Motivation

With modern web features such as [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and [import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap), [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), [nested styles](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting) and [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), ... we can easily build websites by writing and serving plain HTML, CSS and JS (an approach called [no build](https://world.hey.com/dhh/you-can-t-get-faster-than-no-build-7a44131c)). Unfortunately there are still a few minor drawbacks:

- Web components are rendered on the client (slower / jankier page load)
- Multiple HTML pages share layout and metadata (tons of copy-paste)
- Some components are static and don't need to be shipped to clients (larger bundles)
- Some components need to access build environment (e.g. imagine a list of all available pages)

<br>

`pree` aims to fill in these gaps while being as minimalsitc and standard-compliant as possible.

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

`pree view` starts a local server for viewing various files, also resolves layouting and metadata of HTML files. It also provides a nice file navigator to browse your content.

<br>

👉  Prebuild your website:

```bash
pree build <src> <dest>
```

- `<src>` can be an HTML file or a directory. If it's a directory, all HTML files in it will be processed recursively.
- `<dest>` can be a file or a directory. If `<src>` is a directory, then `<dest>` must be a directory as well.

`pre build` builds one or more HTML files, pre-rendering their web components. It launches a local server and uses an emulated browser to pre-render the files, mimicking actual browser behavior.

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
> `pree` uses [declarative shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html) for prerendering web components. Declarative shadow DOM is a relatively new feature not supported by [older browsers](https://caniuse.com/declarative-shadow-dom). Browsers that don't support it won't get the benefits of pre-rendering
> web components. This also means that [build time components](#build-time-scripts) won't work in these browsers.

<br>

## Metadata

Use [front matter](https://www.scribendi.com/academy/articles/front_matter.en.html#:~:text=Front%20matter%20is%20the%20first,a%20preface%2C%20and%20much%20more.) on top of your HTML files to specify metadata:

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

Specify the layout to be used for a page inside the front matter:

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

<br>

Use named slots to fill in different parts of the parent layout:

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

<br>

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

Use `build-only` attribute on scripts to remove them from the built files:

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

## Build Environment

Access build environment from your scripts and components:

```html
<script build-only>
  // 👇 Lets get the name of the author of the project
  //    and add it to the meta tag.
  fetch('/@env/git/commits/first')
    .then(r => r.json())
    .then(commit => {
      document.querySelector('meta[name="author"]').content = commit.author_name
    })
</script>
```

<br>

> [!IMPORTANT]
> You should ONLY access build environment in build-time only scripts and components. The APIs
> ARE NOT available on production.

<br>

### Available APIs

#### Files

- `/@env/files/list/<?pattern>` - List of all files in the project (matching given pattern)
- `/@env/files/read/<path>` - Type and contents of a file. Example response:
  ```json
  {
    "type": "text/plain",
    "content": "Hellow there!"
  }
  ```

#### Git

- `/@env/git/remote/url` - URL of the remote git repository
- `/@env/git/remote/info` - The remote git repository info. Example response:
  ```json
  {
    "full_name": "loreanvictor/pree",
    "host": "github.com",
    "href": "git@github.com:loreanvictor/pree.git",
    "name": "pree",
    "organization": "loreanvictor",
    "owner": "loreanvictor",
    "protocol": "ssh"
  }
  ```
- `/@env/git/commit/<hash>` - Info of a specific commit. Example response:
  ```json
  {
    "hash": "49c145033666d01f27a3e6bb295957820ad10413",
    "author_name": "Eugene Ghanizadeh Khoub",
    "author_email": "ghanizadeh.eugene@gmail.com",
    "date": "2024-01-31T11:52:07+01:00",
    "message": "restructure some code",
    "refs": "HEAD -> main, origin/main"
  }
  ```
- `/@env/git/commits/first/<?file>` - Info of the first commit (for given file)
- `/@env/git/commits/last/<?file>` - Info of the last commit (for given file)
- `/@env/git/commits/all/<?file>` - Info of the all commits (for given file)

#### Variables

- `/@env/vars/<name>` - Returns the content of the environment variable. Example response:
  ```json
  {
    "exists": true,
    "value": "Some value"
  }
  ```

<br>

## CLI Options

Here is a comprehensive list of CLI options for `pree`:

| Option              | Description | Example |
| ---                 | ---         | ---     |
| `-p`, `--port`      | Port to use for serving content | `pree view -p 8080` |
| `-P`, `--prod`      | Production mode (no build environment APIs) | `pree view -P` |
| `-r`, `--root`      | Root directory of the content | `pree build docs site -r .` |
| `-N`, `--namespace` | Project namespace<sup>*</sup> | `pree view -N my-project` |
| `-i`, `--include`   | Files to include in the build | `pree build docs site -i "**/*.page.html"` |
| `-e`, `--exclude`   | Files to exclude from the build<sup>**</sup> | `pree build docs site -e "**/*.layout.html"` |
| `-V`, `--verbose`   | Verbose mode | `pree view -V` |
| `-S`, `--silent`    | Silent mode (only warnings and errors) | `pree build index.html dist/index.html -S` |
| `-SS`               | Silent-er mode (only errors) | `pree build docs dist -SS` |
| `-SSS`              | Silent-est mode (no logs)    | `pree view -SSS` |
| `-h`, `--help`      | See a really short help message | `pree -h` |
| `-v`, `--version`   | See the version of `pree` (and if it needs updates) | `pree -v` |

<br>

**<sup>*</sup>** In some hosting environments your project is not at the root of your domain, which affects your
relative URLs. Use this option to have `pree view` emulate that. For example, if your project is hosted at
`https://example.com/my-project/`, then use `pree view -N my-project`.

**<sup>**</sup>** By default, `**/_*` is used as an excluded pattern. When you provide another exclude pattern, this default pattern is no longer used.


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

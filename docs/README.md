[backend]: ../../../../Todo-Backend
[localStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[WebSockets]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
[graph]: ./graph.svg?raw=1

# Todo Frontend

![visitors](https://visitor-badge.glitch.me/badge?page_id=RascalTwo.Todo-Frontend)
[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/RascalTwo/Todo-Frontend)
[![Pages](https://github.com/RascalTwo/Todo-Frontend/actions/workflows/main.yml/badge.svg?event=workflow_dispatch)](https://rascaltwo.github.io/Todo-Frontend)
![Website](https://img.shields.io/website?url=https%3A%2F%2Frascaltwo.github.io%2FTodo-Frontend%2F)
![GitHub](https://img.shields.io/github/license/RascalTwo/Todo-Frontend)

<details>
  <summary>Statistics</summary>

  ![GitHub language count](https://img.shields.io/github/languages/count/RascalTwo/Todo-Frontend)
  ![GitHub top language](https://img.shields.io/github/languages/top/RascalTwo/Todo-Frontend)
  ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/RascalTwo/Todo-Frontend)
  ![Lines of code](https://img.shields.io/tokei/lines/github/RascalTwo/Todo-Frontend)
</details>

<details>
  <summary>Repository</summary>

  ![GitHub issues](https://img.shields.io/github/issues/RascalTwo/Todo-Frontend)
  ![GitHub closed issues](https://img.shields.io/github/issues-closed/RascalTwo/Todo-Frontend)
  ![GitHub pull requests](https://img.shields.io/github/issues-pr/RascalTwo/Todo-Frontend)
  ![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/RascalTwo/Todo-Frontend)
  ![GitHub last commit](https://img.shields.io/github/last-commit/RascalTwo/Todo-Frontend)
</details>

> Primary

<code><a href="../tsconfig.json"><img alt="TypeScript" title="TypeScript" src="https://raw.githubusercontent.com/github/explore/main/topics/typescript/typescript.png" width="50" /></a></code>
<code><img alt="React" title="React" src="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png" width="50" /></code>
<code><img alt="Material UI" title="Material UI" src="https://material-ui.com/static/logo.svg" width="50" /></code>
<code><a href="../vite.config.ts"><img alt="Vite" title="Vite" src="https://vitejs.dev/logo.svg" width="50" /></a></code>

> Secondary

<code><img alt="CSS" title="CSS" src="https://raw.githubusercontent.com/github/explore/main/topics/css/css.png" width="50" /></code>
<code><img alt="HTML" title="HTML" src="https://raw.githubusercontent.com/github/explore/main/topics/html/html.png" width="50" /></code>
<code><img alt="JavaScript" title="JavaScript" src="https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png" width="50" /></code>
<code><img alt="JSON" title="JSON" src="https://raw.githubusercontent.com/github/explore/main/topics/json/json.png" width="50" /></code>

> Tooling

<code><img alt="Git" title="Git" src="https://raw.githubusercontent.com/github/explore/main/topics/git/git.png" width="50" /></code>
<code><a href="../package.json"><img alt="Yarn" title="Yarn" src="https://avatars.githubusercontent.com/u/22247014" width="50" /></a></code>
<code><a href="../.eslintrc"><img alt="ESLint" title="ESLint" src="https://raw.githubusercontent.com/github/explore/main/topics/eslint/eslint.png" width="50" /></a></code>
<code><img alt="Prettier" title="Prettier" src="https://prettier.io/icon.png" width="50" /></a></code>
<code><a href="../Dockerfile.dev"><img alt="Docker" title="Docker" src="https://raw.githubusercontent.com/github/explore/main/topics/docker/docker.png" width="50" /></a></code>
<code><a href="../.github/workflows/main.yml"><img alt="GitHub Actions" title="GitHub Actions" src="https://raw.githubusercontent.com/github/explore/main/topics/actions/actions.png" width="50" /></a></code>
<code><img alt="GitHub" title="GitHub" src="https://raw.githubusercontent.com/github/explore/main/topics/github/github.png" width="50" /></code>

TypeScript + Vite + React + Material UI Frontend for managing Todo items.

It's designed to be paired with [Todo Backend][backend], but can work without it thanks to [localStorage]

## Features

Not only can you perform all the expected actions you can with Todo items - adding, removing, updating, marking as complete/incomplete - but you can also have different todo lists, seperated by their list code.

The initial Todo list is only stored in [localStorage], while all other are replicated on the [backend].

When the [backend] server is available, multiple clients can interact with the same Todo list in realtime via [WebSockets]

## Environment Variables

| Variable            | Default Value | Description |
| -                   | -             | -           |
| `VITE_SERVER_HOST`  |               | Host of backend server to connect to |
| `VITE_HASH_ROUTING` | `false`       | Teather to use Hash or Browser routing |

## Structure

> Click for interactive version

<details>
  <summary>Local Files</summary>

  [![][graph]][graph]
</details>

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-badges.svg)](https://forthebadge.com)
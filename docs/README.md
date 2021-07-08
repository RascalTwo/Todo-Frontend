[backend]: ../../../../Todo-Backend
[localStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[WebSockets]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
[dependancygraph]: ./dependencygraph.svg?raw=1

# Todo Frontend

TypeScript + Vite + React + MaterialUI Frontend for managing Todo items.

It's designed to be paired with [Todo Backend][backend], but can work without it thanks to [localStorage]

## Features

Not only can you perform all the expected actions you can with Todo items - adding, removing, updating, marking as complete/incomplete - but you can also have different todo lists, seperated by their list code.

The initial Todo list is only stored in [localStorage], while all other are replicated on the [backend].

When the [backend] server is available, multiple clients can interact with the same Todo list in realtime via [WebSockets]

## Structure

> Click for interactive version

[![homepage][dependancygraph]][dependancygraph]
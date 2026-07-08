# Miria Code Editor

<p align="center">
  <img src="./banner.svg" alt="Miria Banner" width="100%" />
</p>

Miria Code Editor is a modern, web-based IDE built with Vue 3, Vite, and TypeScript. It features a custom context-free grammar parsing engine designed specifically to compile and run a bespoke programming language called **Miria**. You can give it a try [here](https://miria-code-editor.netlify.app/).

## ✨ Features

- **Custom Programming Language**: Miria is a dynamic language with syntax inspired by modern programming paradigms.

- **In-Browser Compilation**: The grammar is built natively with Nearley.js, allowing code to be parsed and evaluated directly in your browser without a backend.
- **Advanced Language Features**:
  - First-class Functions & Lambdas
  - Object-Oriented Programming (Classes, Interfaces, Inheritance)
  - Advanced Control Flow (If, For, While, Do-While)
  - Try/Catch Exceptions
  - Enums, Dictionaries, and Arrays
  - Namespaces & Modules
- **CodeMirror Integration**: Full syntax highlighting, line numbers, code folding, and optimized scroll performance.

## 💻 The Miria Language

A classic *Hello World* program in Miria:

```miria
define main as fun() -> void {
  log("Hello world!")
}
```

Miria features comprehensive documentation directly inside the IDE, covering everything from primitive data types to advanced OOP constructs.

## 🛠️ Technologies Used

- **Vue 3 + Vite**: Core frontend framework and lightning-fast build tool.
- **TypeScript**: Ensuring strict type safety and cleaner architecture.
- **Nearley.js**: Generates the Miria parser.
- **CodeMirror**: Robust in-browser text editing.
- **Vuex & Vue Router**: State management and client-side routing.

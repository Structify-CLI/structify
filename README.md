# 📖 Structify — Modern Project Scaffolding CLI

[![npm version](https://img.shields.io/npm/v/structify?color=blue)](https://www.npmjs.com/package/structify)  
[![npm downloads](https://img.shields.io/npm/dm/structify?color=green)](https://www.npmjs.com/package/structify)  
[![license](https://img.shields.io/github/license/Structify-CLI/structify)](LICENSE)  
[![build](https://img.shields.io/github/actions/workflow/status/Structify-CLI/structify/ci.yml?branch=main)](https://github.com/Structify-CLI/structify/actions)

**Structify** is a developer-friendly CLI tool that helps you **quickly scaffold modern web applications** with clean, opinionated project structures.  
It provides ready-to-use templates for popular frameworks like **React (Vite)** and **Next.js**, so you can focus on building instead of configuring.

---

## 🚀 Features

- ⚡ **Fast project setup** — bootstrap a new app in seconds.
- 🎯 **Framework choice** — React (Vite) and Next.js out of the box.
- 📝 **TypeScript or JavaScript** — choose your preferred language.
- 🛠 **Pre-configured tools** — ESLint, Prettier, TailwindCSS (optional), testing setup.
- 🌐 **Remote templates** — always up-to-date via GitHub repositories.
- 📦 **Future extensibility** — monorepo design for plugins, more frameworks, and advanced features.

---

## 📦 Installation

You don’t need to install Structify globally. Just use `npx`:

```bash
npx structify init my-app --template react --ts
```

Or install globally:

```bash
npm install -g structify
structify init my-app --template next
```

---

## 🛠 Usage

### Create a React (Vite) app

```bash
npx structify init my-app --template react
```

### Create a Next.js app with TypeScript

```bash
npx structify init my-next-app --template next --ts
```

### Options

| Flag             | Description                        | Default |
| ---------------- | ---------------------------------- | ------- |
| `--template, -t` | Choose template: `react` or `next` | react   |
| `--ts`           | Enable TypeScript                  | false   |

---

## 📂 Example Project Structure

When you generate a project, Structify sets up a clean, modern structure with best practices.

**React + Vite + TypeScript example:**

```text
my-app/
│
├── src/
│   ├── components/
│   ├── pages/
│   └── App.tsx
│
├── public/
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🔮 Roadmap

- [ ] Add support for more frameworks (Remix, Astro, Angular).
- [ ] Interactive CLI with prompts.
- [ ] Plugin system for custom templates.
- [ ] GitHub Actions / CI setup scaffolding.
- [ ] Configurable state management (Redux, Zustand, etc.).

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch (`git checkout -b feature/awesome-feature`)
3. Commit changes (`git commit -m 'Add awesome feature'`)
4. Push branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request 🎉

---

## 📜 License

MIT — free to use, modify, and share.

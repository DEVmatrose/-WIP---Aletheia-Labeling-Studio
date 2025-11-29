# 🏛️ Aletheia Labeling Studio

> *A modern, lightweight, and type-safe labeling tool for machine learning training data curation.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)
[![npm](https://img.shields.io/npm/v/aletheia-labeling-studio?color=CB3837&logo=npm)](https://www.npmjs.com/package/aletheia-labeling-studio)

**Aletheia** is a Vue.js 3 component library for labeling and curating structured training data (JSON outputs) for LLM fine-tuning workflows. Unlike heavyweight annotation platforms focused on images or text, Aletheia specializes in **reviewing and editing AI-generated responses** before they enter your training pipeline.

---

## 📸 Screenshots

![Aletheia Demo](https://via.placeholder.com/800x450/1E293B/FFFFFF?text=Aletheia+Demo+Screenshot)

*3-column layout: Queue (left) → JSON Editor (center) → Validation (right)*

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🎨 **Modern UI** | Clean 3-column layout with Tailwind CSS, dark mode support |
| 📝 **JSON Editor** | Monaco Editor integration (VS Code-like syntax highlighting) |
| ✅ **Validation Rules** | Custom validation per category (quality scores, citations, neutrality checks) |
| 🔄 **Queue Workflow** | Pending → In-Progress → Completed/Skipped state management |
| 📊 **Progress Tracking** | Real-time statistics, progress bars, average quality scores |
| ⌨️ **Keyboard Shortcuts** | `Ctrl+S` (save), `→` (next), `←` (previous), `Ctrl+K` (skip) |
| 🔌 **Backend-Agnostic** | Props-based API works with Supabase, REST, GraphQL, or local files |
| 💾 **Event-Driven** | Clean separation: UI emits events, parent handles persistence |
| 🎯 **TypeScript-First** | Full type safety with auto-generated `.d.ts` files |
| 📦 **Tiny Bundle** | Only **7 KB gzipped** (ES module) |

---

## ✨ Features

- 🎨 **Modern UI** - Clean interface built with Tailwind CSS
- 📝 **Monaco Editor** - VS Code-like JSON editing with syntax highlighting
- ✅ **Custom Validation** - Define validation rules per category/pillar
- 🔄 **Queue Workflow** - Efficient pending → in-progress → completed flow
- 📊 **Progress Tracking** - Real-time statistics and progress bars
- 🔌 **Props-based API** - Easy integration with any backend
- 💾 **Event-driven** - React to save, validate, and skip events
- ⌨️ **Keyboard Shortcuts** - Fast navigation with Ctrl+S, arrows, etc.
- 🎯 **TypeScript-first** - Full type safety out of the box

## 📦 Installation

### npm (Recommended)

```bash
npm install aletheia-labeling-studio
```

### Yarn

```bash
yarn add aletheia-labeling-studio
```

### pnpm

```bash
pnpm add aletheia-labeling-studio
```

---

## 🚀 Quick Start

### 1. Import Components

```vue
<script setup lang="ts">
import { AletheiaLabeler } from 'aletheia-labeling-studio';
import 'aletheia-labeling-studio/style.css'; // Required!
import type { AletheiaItem, AletheiaConfig } from 'aletheia-labeling-studio';
</script>
```

### 2. Prepare Your Data

```typescript
const trainingItems: AletheiaItem[] = [
  {
    id: 'item-001',
    input: 'Analyze this customer feedback: The new feature is amazing!',
    output: {
      sentiment: 'positive',
      category: 'feature-feedback',
      priority: 'low',
    },
    category: 'feedback-analysis',
    status: 'pending',
    qualityScore: 0.85,
  },
];

const config = {
  pillars: ['sentiment', 'intent', 'topic'],
  showQualityScore: true,
  allowEdit: true,
};

function handleSave(item) {
  console.log('Saved:', item);
  // Save to your backend
}

function handleSkip(item) {
  console.log('Skipped:', item);
}
</script>
```

### With Custom Validation

```typescript
const config = {
  pillars: ['technical', 'psychological', 'scientific'],
  validations: {
    psychological: {
      neutralityCheck: true,
      minQualityScore: 0.8,
    },
    scientific: {
      requireCitation: true,
      minQualityScore: 0.9,
    },
  },
};
```

## 📚 Documentation

- [API Reference](./docs/API.md)
- [Integration Guide](./docs/INTEGRATION.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## 🎮 Demo

Try the live demo:

```bash
git clone https://github.com/DEVmatrose/Aletheia-Labeling-Studio.git
cd Aletheia-Labeling-Studio
npm install
npm run dev:demo
```

Visit `http://localhost:5175` to see the demo with mock data.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build library
npm run build:lib

# Build demo
npm run build:demo

# Run type checking
npm run type-check

# Run tests
npm test
```

## 📋 Use Cases

- **LLM Training Data** - Label and curate training data for fine-tuning
- **Text Classification** - Categorize feedback, emails, or documents
- **Sentiment Analysis** - Label emotional tone in text data
- **Intent Detection** - Classify user intent from conversations
- **Meeting Protocols** - Structure and validate meeting notes
- **Customer Feedback** - Organize and categorize user feedback

## 🏗️ Architecture

Aletheia uses a three-panel layout:

1. **Queue Panel** (Left) - Browse and select items
2. **Editor Panel** (Center) - View input and edit JSON output
3. **Validation Panel** (Right) - Validate, categorize, and approve

## 🤝 Contributing

Contributions welcome! Please read [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for setup instructions and coding guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Credits

Built with:
- [Vue.js 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Vite](https://vitejs.dev/)

## 📧 Contact

**DEVmatrose**  
GitHub: [@DEVmatrose](https://github.com/DEVmatrose)  
Repository: [Aletheia-Labeling-Studio](https://github.com/DEVmatrose/Aletheia-Labeling-Studio)

---

Made with ❤️ for the ML community

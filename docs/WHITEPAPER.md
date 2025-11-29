# 🏗️ Aletheia Labeling Studio - Technical Whitepaper

**Project:** Aletheia Labeling Studio  
**Type:** Open Source Vue.js Library  
**License:** MIT  
**Version:** 1.0.0  
**Author:** DEVmatrose  
**Date:** November 29, 2025  

---

## Abstract

Aletheia Labeling Studio is a modern, type-safe, and highly customizable labeling tool for machine learning training data curation. Built with Vue.js 3 and TypeScript, it provides a queue-based workflow for reviewing, editing, and validating AI-generated outputs before they enter the fine-tuning pipeline. Unlike heavyweight annotation platforms (Label Studio, Prodigy), Aletheia focuses on **structured data labeling** (JSON outputs) rather than image/text annotation, making it ideal for LLM training workflows.

**Key Features:**
- 🎨 **Modern UI:** Clean 3-column layout with Tailwind CSS, dark mode support
- 📝 **JSON Editor:** Monaco Editor integration for syntax highlighting
- ✅ **Customizable Validation:** Schema-based validation rules per category
- 🔄 **Queue-Based Workflow:** Pending → In-Progress → Completed/Skipped
- 📊 **Progress Tracking:** Real-time statistics and progress bars
- ⌨️ **Keyboard Shortcuts:** Power-user optimization (Ctrl+S, arrows, etc.)
- 🔌 **Backend-Agnostic:** Props-based API works with any data source
- 💾 **Event-Driven:** Clean separation between UI and data persistence

---

## 1. Architecture Overview

### 1.1 Design Philosophy

**Problem Statement:**  
Existing labeling tools (Label Studio, Doccano, Prodigy) are optimized for image/text annotation and NER tasks. For LLM fine-tuning workflows, we need:
- Structured JSON editing (not bounding boxes)
- Validation against custom schemas
- Multi-category data organization (pillars/domains)
- Lightweight deployment (not Kubernetes-level complexity)

**Solution:**  
Aletheia is a **frontend-focused library** that integrates into existing admin dashboards. It handles UI/UX and validation logic, while the parent application manages data fetching and persistence (e.g., Supabase, PostgreSQL, REST API).

### 1.2 Technology Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| **Framework** | Vue.js 3 | Composition API, reactive state, excellent TypeScript support |
| **Language** | TypeScript 5.7 | Type safety, IntelliSense, reduced runtime errors |
| **Styling** | Tailwind CSS 3.4 | Utility-first, customizable, dark mode, small bundle size |
| **Build Tool** | Vite 6.0 | Fast HMR, library mode, optimized production builds |
| **Editor** | Monaco Editor 0.52 | VS Code-like JSON editing, syntax highlighting |
| **State Management** | Composables (Vue) | No external store (Pinia/Vuex), lightweight, testable |
| **Type Generation** | vite-plugin-dts | Auto-generate `.d.ts` files for TypeScript consumers |

### 1.3 Component Hierarchy

```
AletheiaLabeler (Main Orchestrator)
├── QueuePanel (Left Column)
│   ├── Filter Tabs (Pending / Completed / Skipped)
│   ├── Progress Bar
│   └── Item List (clickable)
│
├── EditorPanel (Center Column)
│   ├── Input Display (read-only)
│   └── Output Editor (Monaco JSON)
│
└── ValidationPanel (Right Column)
    ├── Category/Pillar Dropdown
    ├── Quality Score Slider
    ├── Custom Validations (checkboxes, textareas)
    └── Action Buttons (Validate / Save / Skip)
```

**Communication:**
- **Props Down:** `AletheiaLabeler` → Child components (items, config, currentItem)
- **Events Up:** Child components → `AletheiaLabeler` → Parent app (save, validate, skip)
- **State Management:** `useAletheia()` composable (shared logic)

---

## 2. Core Concepts

### 2.1 AletheiaItem (Data Structure)

```typescript
interface AletheiaItem {
  id: string;               // Unique identifier
  input: string;            // Model prompt/input
  output: any;              // Model response (JSON)
  category?: string;        // Task type (e.g., "profile_analysis")
  pillar?: string;          // Domain classification (e.g., "technical")
  metadata?: Record<string, any>; // Custom fields
  status?: AletheiaStatus;  // "pending" | "in-progress" | "completed" | "skipped"
  timestamp?: string;       // ISO datetime
  qualityScore?: number;    // 0-1 or 0-100
}
```

**Design Rationale:**
- **Minimal required fields:** Only `id`, `input`, `output` are mandatory
- **Flexible metadata:** Avoids rigid schema, supports diverse use cases
- **Status enum:** Enables queue filtering and progress tracking
- **Quality score:** Allows weighted training data selection

### 2.2 AletheiaConfig (Customization)

```typescript
interface AletheiaConfig {
  pillars?: string[];       // Category dropdown options
  validations?: Record<string, AletheiaValidation>; // Per-pillar rules
  theme?: string;           // Color scheme
  allowEdit?: boolean;      // Lock output editing
  enableKeyboardShortcuts?: boolean;
  labels?: Record<string, string>; // i18n support (future)
}
```

**Example Usage:**
```typescript
const config = {
  pillars: ['technical', 'psychological', 'scientific'],
  validations: {
    psychological: {
      neutralityCheck: true, // Show checkbox
      minQualityScore: 0.8,
    },
    scientific: {
      requireCitation: true, // Show textarea
      minQualityScore: 0.9,
    },
  },
  theme: 'custom', // Custom color palette
};
```

### 2.3 Event System

```typescript
interface Emits {
  (e: 'save', item: AletheiaItem): void;          // Approve & save
  (e: 'validate', item: AletheiaItem, isValid: boolean, message?: string): void;
  (e: 'skip', item: AletheiaItem): void;          // Skip for now
  (e: 'select', item: AletheiaItem): void;        // Item clicked
  (e: 'edit', item: AletheiaItem, newOutput: any): void; // JSON edited
}
```

**Parent App Handling:**
```vue
<AletheiaLabeler
  :items="trainingData"
  :config="config"
  @save="handleSave"
  @validate="handleValidate"
  @skip="handleSkip"
/>
```

```typescript
async function handleSave(item: AletheiaItem) {
  // Update database
  await supabase
    .from('training_data')
    .update({
      corrected_output: item.output,
      pillar: item.pillar,
      used_for_training: true,
      reviewed_by: currentUser.id,
    })
    .eq('id', item.id);
  
  // Refresh queue
  await loadPendingItems();
}
```

---

## 3. Implementation Details

### 3.1 State Management (useAletheia Composable)

**File:** `src/composables/useAletheia.ts`

**Responsibilities:**
1. **Queue Filtering:** Computed properties for pending/completed/skipped items
2. **Navigation:** `loadNext()`, `loadPrevious()`, `selectItem(id)`
3. **Mutations:** `updateOutput()`, `updatePillar()`, `updateQualityScore()`
4. **Actions:** `markCompleted()`, `markSkipped()`, `validate()`
5. **Statistics:** `stats`, `progress`, `hasNext`, `hasPrevious`

**Key Computed Properties:**
```typescript
const pendingItems = computed(() => 
  items.filter(item => item.status === 'pending' || !item.status)
);

const stats = computed<AletheiaStats>(() => {
  const total = items.length;
  const pending = pendingItems.value.length;
  const completed = completedItems.value.length;
  const skipped = skippedItems.value.length;
  
  const averageQuality = completed > 0
    ? completedItems.value
        .filter(i => i.qualityScore !== undefined)
        .reduce((sum, i) => sum + (i.qualityScore || 0), 0) / completed
    : undefined;
  
  return { total, pending, completed, skipped, averageQuality };
});
```

**Reactivity:**
- All state is reactive via `ref()` and `computed()`
- Changes to `currentItem.value.output` immediately update parent
- Watch for `items.length` changes to initialize first item

### 3.2 Validation Logic

**File:** `src/composables/useAletheia.ts` (validate function)

```typescript
function validate(): { isValid: boolean; message?: string } {
  if (!currentItem.value) {
    return { isValid: false, message: 'No item selected' };
  }
  
  const item = currentItem.value;
  const pillarConfig = config?.validations?.[item.pillar || ''];
  
  // Quality score check
  if (pillarConfig?.minQualityScore) {
    if (!item.qualityScore || item.qualityScore < pillarConfig.minQualityScore) {
      return {
        isValid: false,
        message: `Quality score must be at least ${pillarConfig.minQualityScore * 100}%`,
      };
    }
  }
  
  // Citation check (scientific pillar)
  if (pillarConfig?.requireCitation) {
    if (!item.metadata?.sourceCitation) {
      return {
        isValid: false,
        message: 'Source citation is required for scientific data',
      };
    }
  }
  
  // Neutrality check (psychological pillar)
  if (pillarConfig?.neutralityCheck) {
    if (!item.metadata?.isNeutral) {
      return {
        isValid: false,
        message: 'Neutrality confirmation required for psychological data',
      };
    }
  }
  
  return { isValid: true };
}
```

**Extension Point:**  
Custom validators can be added via `config.validations[pillar].customValidator(item)`.

### 3.3 Keyboard Shortcuts

**File:** `src/components/AletheiaLabeler.vue` (handleKeyboard function)

```typescript
function handleKeyboard(event: KeyboardEvent) {
  // Ctrl+S: Save
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault();
    handleSave();
  }
  
  // Ctrl+K: Skip
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault();
    handleSkip();
  }
  
  // Arrow Right: Next (only if not in input)
  if (event.key === 'ArrowRight' && !event.ctrlKey) {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
      loadNext();
    }
  }
  
  // Arrow Left: Previous
  if (event.key === 'ArrowLeft' && !event.ctrlKey) {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
      loadPrevious();
    }
  }
}
```

**Lifecycle:**
```typescript
onMounted(() => {
  if (props.config?.enableKeyboardShortcuts !== false) {
    window.addEventListener('keydown', handleKeyboard);
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard);
});
```

---

## 4. Build System & Distribution

### 4.1 Library Build (Vite)

**File:** `vite.config.ts`

```typescript
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/index.ts'),
      name: 'AletheiaLabelingStudio',
      formats: ['es', 'umd'],
      fileName: (format) => `aletheia.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
  plugins: [
    vue(),
    dts({ include: ['src/**/*.ts', 'src/**/*.vue'] }),
  ],
});
```

**Output:**
```
dist/
├── aletheia.es.js         # ES module (27 KB gzipped: 7 KB)
├── aletheia.umd.js        # Universal Module Definition (22 KB gzipped: 6 KB)
├── aletheia-labeling-studio.css  # Styles (0.23 KB)
└── index.d.ts             # TypeScript declarations
```

**Package.json Exports:**
```json
{
  "exports": {
    ".": {
      "import": "./dist/aletheia.es.js",
      "require": "./dist/aletheia.umd.js",
      "types": "./dist/index.d.ts"
    },
    "./style.css": "./dist/aletheia-labeling-studio.css"
  }
}
```

### 4.2 Demo Build (Standalone)

**File:** `vite.config.demo.ts`

```typescript
export default defineConfig({
  root: 'demo',
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true,
  },
  plugins: [vue()],
});
```

**Usage:**
```bash
npm run dev:demo      # Development server (localhost:5175)
npm run build:demo    # Static site (deploy to GitHub Pages)
```

---

## 5. Integration Patterns

### 5.1 Supabase (PostgreSQL + RLS)

**Adapter Pattern:**
```typescript
// admin-frontend/src/services/aletheia-adapter.ts
import { supabase } from '@/lib/supabase';
import type { AletheiaItem } from 'aletheia-labeling-studio';

export function useAletheiaAdapter() {
  const trainingItems = ref<AletheiaItem[]>([]);
  const loading = ref(false);
  
  async function loadPendingItems() {
    loading.value = true;
    const { data, error } = await supabase
      .from('training_data')
      .select('*')
      .eq('used_for_training', false)
      .order('timestamp', { ascending: false })
      .limit(50);
    
    if (!error && data) {
      trainingItems.value = data.map(transformToAletheiaItem);
    }
    loading.value = false;
  }
  
  function transformToAletheiaItem(row: any): AletheiaItem {
    return {
      id: row.id,
      input: row.input_text,
      output: row.corrected_output,
      pillar: row.pillar,
      category: row.task_type,
      status: row.used_for_training ? 'completed' : 'pending',
      timestamp: row.timestamp,
      qualityScore: row.quality_score,
      metadata: {
        isNeutral: row.is_neutral,
        sourceCitation: row.source_citation,
        reviewerNotes: row.reviewer_notes,
      },
    };
  }
  
  async function handleSave(item: AletheiaItem) {
    const { error } = await supabase
      .from('training_data')
      .update({
        corrected_output: item.output,
        pillar: item.pillar,
        quality_score: item.qualityScore,
        is_neutral: item.metadata?.isNeutral,
        source_citation: item.metadata?.sourceCitation,
        used_for_training: true,
        reviewed_by: user.value.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id);
    
    if (!error) {
      await loadPendingItems(); // Refresh queue
    }
  }
  
  return {
    trainingItems,
    loading,
    loadPendingItems,
    handleSave,
  };
}
```

**View Component:**
```vue
<template>
  <AletheiaLabeler
    :items="trainingItems"
    :config="config"
    :loading="loading"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { AletheiaLabeler } from 'aletheia-labeling-studio';
import { useAletheiaAdapter } from '@/services/aletheia-adapter';

const { trainingItems, loading, loadPendingItems, handleSave } = useAletheiaAdapter();

onMounted(() => {
  loadPendingItems();
});

const config = {
  pillars: ['technical', 'psychological', 'scientific'],
  validations: {
    psychological: { neutralityCheck: true },
    scientific: { requireCitation: true },
  },
};
</script>
```

### 5.2 REST API

```typescript
async function loadPendingItems() {
  const response = await fetch('/api/training-data?status=pending');
  const data = await response.json();
  trainingItems.value = data.map(transformToAletheiaItem);
}

async function handleSave(item: AletheiaItem) {
  await fetch(`/api/training-data/${item.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      output: item.output,
      pillar: item.pillar,
      quality_score: item.qualityScore,
      used_for_training: true,
    }),
  });
  await loadPendingItems();
}
```

### 5.3 Local Files (Development/Testing)

```typescript
import sampleData from './mock-data/samples.json';

const trainingItems = ref<AletheiaItem[]>(sampleData);

function handleSave(item: AletheiaItem) {
  // Update local state only (no persistence)
  const index = trainingItems.value.findIndex(i => i.id === item.id);
  if (index !== -1) {
    trainingItems.value[index] = { ...item, status: 'completed' };
  }
}
```

---

## 6. Customization & Extension

### 6.1 Custom Themes

**Tailwind Config:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'aletheia-primary': '#3B82F6',    // Blue
        'aletheia-secondary': '#10B981',  // Green
        'aletheia-accent': '#F59E0B',     // Orange
      },
    },
  },
};
```

**Usage in Components:**
```vue
<button class="bg-aletheia-primary hover:bg-aletheia-primary/90">
  Save
</button>
```

### 6.2 Custom Validation Rules

**Config Example:**
```typescript
const config = {
  validations: {
    'email-classification': {
      customValidator: (item: AletheiaItem) => {
        const output = item.output;
        if (!output.intent || !output.priority) {
          return {
            isValid: false,
            message: 'Email classification requires intent and priority',
          };
        }
        return { isValid: true };
      },
    },
  },
};
```

**Implementation in useAletheia:**
```typescript
if (pillarConfig?.customValidator) {
  const result = pillarConfig.customValidator(item);
  if (!result.isValid) {
    return result;
  }
}
```

### 6.3 Adding Custom Metadata Fields

**Extend AletheiaItem Interface:**
```typescript
interface CustomAletheiaItem extends AletheiaItem {
  metadata: {
    customField1: string;
    customField2: number;
  };
}
```

**Custom Validation Panel:**
```vue
<template>
  <div>
    <!-- Standard fields -->
    <ValidationPanel :item="item" :config="config" />
    
    <!-- Custom fields -->
    <div class="mt-4">
      <label>Custom Field 1</label>
      <input v-model="item.metadata.customField1" />
    </div>
  </div>
</template>
```

---

## 7. Performance Optimization

### 7.1 Bundle Size

**Current:**
- ES Module: 27 KB (gzipped: 7 KB)
- UMD Module: 22 KB (gzipped: 6 KB)
- CSS: 0.23 KB

**Optimization Strategies:**
1. **Tree-shaking:** Only import used components
   ```typescript
   import { AletheiaLabeler } from 'aletheia-labeling-studio';
   // vs
   import AletheiaLabeler from 'aletheia-labeling-studio/dist/components/AletheiaLabeler.vue';
   ```
2. **Monaco Editor Code-Splitting:**
   ```typescript
   const MonacoEditor = defineAsyncComponent(() =>
     import('./MonacoEditor.vue')
   );
   ```
3. **Tailwind Purging:** Only include used utility classes in production

### 7.2 Runtime Performance

**Virtual Scrolling (Future):**
For queues with 1000+ items:
```vue
<template>
  <RecycleScroller
    :items="filteredItems"
    :item-size="80"
    key-field="id"
  >
    <template #default="{ item }">
      <QueueItem :item="item" />
    </template>
  </RecycleScroller>
</template>
```

**Debounced Validation:**
```typescript
import { useDebounceFn } from '@vueuse/core';

const debouncedValidate = useDebounceFn(() => {
  validate();
}, 500);
```

### 7.3 TypeScript Performance

**skipLibCheck in tsconfig.json:**
```json
{
  "compilerOptions": {
    "skipLibCheck": true  // Faster builds
  }
}
```

**Incremental Compilation:**
```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```

---

## 8. Testing Strategy

### 8.1 Unit Tests (Vitest)

**Example: useAletheia Composable**
```typescript
import { describe, it, expect } from 'vitest';
import { useAletheia } from '@/composables/useAletheia';

describe('useAletheia', () => {
  it('filters pending items correctly', () => {
    const items = [
      { id: '1', input: 'test', output: {}, status: 'pending' },
      { id: '2', input: 'test', output: {}, status: 'completed' },
    ];
    
    const { pendingItems } = useAletheia(items);
    
    expect(pendingItems.value).toHaveLength(1);
    expect(pendingItems.value[0].id).toBe('1');
  });
  
  it('calculates progress correctly', () => {
    const items = [
      { id: '1', input: 'test', output: {}, status: 'completed' },
      { id: '2', input: 'test', output: {}, status: 'pending' },
    ];
    
    const { progress } = useAletheia(items);
    
    expect(progress.value).toBe(50);
  });
});
```

### 8.2 Component Tests (Vue Test Utils)

```typescript
import { mount } from '@vue/test-utils';
import ValidationPanel from '@/components/ValidationPanel.vue';

describe('ValidationPanel', () => {
  it('shows citation field for scientific pillar', async () => {
    const wrapper = mount(ValidationPanel, {
      props: {
        item: {
          id: '1',
          input: 'test',
          output: {},
          pillar: 'scientific',
        },
        config: {
          validations: {
            scientific: { requireCitation: true },
          },
        },
      },
    });
    
    expect(wrapper.find('textarea').exists()).toBe(true);
  });
});
```

### 8.3 E2E Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('complete labeling workflow', async ({ page }) => {
  await page.goto('http://localhost:5175');
  
  // Click first item
  await page.click('[data-testid="queue-item-0"]');
  
  // Edit JSON
  await page.fill('.monaco-editor', '{"result": "edited"}');
  
  // Select pillar
  await page.selectOption('select', 'technical');
  
  // Set quality score
  await page.fill('input[type="range"]', '85');
  
  // Validate
  await page.click('button:has-text("Validate")');
  
  // Save
  await page.click('button:has-text("Save")');
  
  // Check next item loaded
  await expect(page.locator('[data-testid="queue-item-1"]')).toHaveClass(/active/);
});
```

---

## 9. Deployment Scenarios

### 9.1 npm Package (Public)

```bash
npm login
npm publish --access public
```

**Installation:**
```bash
npm install aletheia-labeling-studio
```

**Usage:**
```typescript
import { AletheiaLabeler } from 'aletheia-labeling-studio';
import 'aletheia-labeling-studio/style.css';
```

### 9.2 GitHub Pages (Demo)

```bash
npm run build:demo
cd dist-demo
git init
git add .
git commit -m "Deploy demo"
git remote add origin https://github.com/DEVmatrose/Aletheia-Labeling-Studio.git
git push -f origin master:gh-pages
```

**URL:** https://devmatrose.github.io/Aletheia-Labeling-Studio/

### 9.3 Local Link (Development)

```bash
# In aletheia-labeling-studio/
npm link

# In admin-frontend/
npm link aletheia-labeling-studio
```

**Or via file reference:**
```json
{
  "dependencies": {
    "aletheia-labeling-studio": "file:../aletheia-labeling-studio"
  }
}
```

---

## 10. Roadmap & Future Improvements

### v1.1 (Q1 2026)
- [ ] Full Monaco Editor integration (currently simplified textarea)
- [ ] Diff view (show changes from initial_output to corrected_output)
- [ ] Undo/Redo functionality
- [ ] Batch operations (approve multiple items)
- [ ] i18n support (German/English labels)

### v1.2 (Q2 2026)
- [ ] Real-time collaboration (WebSockets)
- [ ] Comment system (reviewer notes per field)
- [ ] Export functionality (JSON/CSV/JSONL)
- [ ] Advanced search/filtering
- [ ] Dark mode toggle (currently auto-detect)

### v2.0 (Q3 2026)
- [ ] Plugin system (custom validators, custom fields)
- [ ] AI-assisted validation (flag anomalies)
- [ ] Version history (track all edits)
- [ ] Role-based workflows (reviewer → approver chain)
- [ ] Analytics dashboard (quality trends, reviewer performance)

---

## 11. Comparison with Alternatives

| Feature | Aletheia | Label Studio | Prodigy | Doccano |
|---------|----------|--------------|---------|---------|
| **Focus** | JSON Labeling | Multi-modal | NER/Text | NER/Text |
| **Size** | 7 KB | 500+ KB | N/A | 200+ KB |
| **Setup** | npm install | Docker | Python | Docker |
| **Customization** | Props/Events | XML config | Python | Limited |
| **Backend** | Your choice | Built-in | Built-in | Built-in |
| **TypeScript** | ✅ First-class | ❌ JavaScript | ❌ Python | ❌ Python |
| **License** | MIT | Apache 2.0 | Commercial | MIT |
| **Best For** | LLM training | Image annotation | Active learning | Text classification |

**When to use Aletheia:**
- ✅ Labeling structured JSON outputs (LLM responses)
- ✅ Integrating into existing Vue.js admin dashboard
- ✅ Custom validation logic per category
- ✅ Lightweight deployment (no Docker)

**When NOT to use Aletheia:**
- ❌ Image/video annotation (use Label Studio)
- ❌ Complex NER tasks (use Prodigy/Doccano)
- ❌ Non-Vue.js projects (consider adapting or using Label Studio)

---

## 12. Contributing

### Development Setup

```bash
git clone https://github.com/DEVmatrose/Aletheia-Labeling-Studio.git
cd Aletheia-Labeling-Studio
npm install
npm run dev:demo  # Start demo server
npm run build:lib # Build library
```

### Code Style

- **Vue SFC Order:** `<template>`, `<script setup>`, `<style scoped>`
- **TypeScript:** Strict mode, no `any` types (except for `output` field)
- **Naming:** PascalCase for components, camelCase for functions
- **Commit Messages:** Conventional Commits (feat, fix, docs, refactor)

### Pull Request Guidelines

1. Create feature branch (`git checkout -b feat/your-feature`)
2. Write tests for new functionality
3. Update documentation (`README.md`, `docs/API.md`)
4. Run `npm run build:lib` (must pass without errors)
5. Submit PR with description of changes

---

## 13. License & Attribution

**License:** MIT  
**Author:** DEVmatrose  
**Repository:** https://github.com/DEVmatrose/Aletheia-Labeling-Studio  

**Dependencies:**
- Vue.js (MIT) - Evan You
- Vite (MIT) - Evan You
- Tailwind CSS (MIT) - Adam Wathan
- Monaco Editor (MIT) - Microsoft
- TypeScript (Apache 2.0) - Microsoft

**Name Origin:**  
*Aletheia* (ἀλήθεια) - Greek word for "truth" or "unconcealedness". In philosophy (Heidegger), it represents the unveiling of truth through critical examination - fitting for a data validation tool.

---

## 14. References

**Technical Documentation:**
- Vue.js 3: https://vuejs.org/guide/introduction.html
- TypeScript: https://www.typescriptlang.org/docs/
- Vite Library Mode: https://vitejs.dev/guide/build.html#library-mode
- Tailwind CSS: https://tailwindcss.com/docs

**Related Projects:**
- Label Studio: https://labelstud.io/
- Prodigy: https://prodi.gy/
- Doccano: https://github.com/doccano/doccano
- LLM Fine-Tuning Guide: https://huggingface.co/docs/transformers/training

**Academic Papers:**
- "Active Learning Literature Survey" (Settles, 2009)
- "Human-in-the-Loop Machine Learning" (Monarch, 2021)
- "Data Quality for Machine Learning Tasks" (Sambasivan et al., 2021)

---

**Document Version:** 1.0  
**Last Updated:** November 29, 2025  
**Status:** ✅ Production Ready  
**Maintained by:** DEVmatrose

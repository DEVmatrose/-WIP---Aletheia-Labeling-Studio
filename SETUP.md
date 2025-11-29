# 🚀 Getting Started with Aletheia Labeling Studio

Complete setup guide for integrating Aletheia into your project.

---

## Prerequisites

- Node.js 18+ and npm
- Vue.js 3.5+ project
- (Optional) Backend service for data persistence (Supabase, REST API, etc.)

---

## Installation

```bash
npm install aletheia-labeling-studio
```

---

## Quick Integration

### 1. Import Components

```vue
<script setup lang="ts">
import { AletheiaLabeler } from 'aletheia-labeling-studio';
import 'aletheia-labeling-studio/style.css';
import type { AletheiaItem, AletheiaConfig } from 'aletheia-labeling-studio';
</script>
```

### 2. Prepare Your Data

```typescript
import { ref } from 'vue';

const trainingItems = ref<AletheiaItem[]>([
  {
    id: 'item-001',
    input: 'User query or model prompt here...',
    output: {
      // Your model's JSON output
      result: 'classification',
      confidence: 0.95,
    },
    status: 'pending',
    qualityScore: 0.85,
  },
]);
```

### 3. Configure Validation Rules

```typescript
const config: AletheiaConfig = {
  pillars: ['technical', 'research', 'business'],
  validations: {
    research: {
      requireCitation: true,
      minQualityScore: 0.9,
    },
    business: {
      minQualityScore: 0.8,
    },
  },
  enableKeyboardShortcuts: true,
};
```

### 4. Add Component to Template

```vue
<template>
  <div class="container">
    <AletheiaLabeler
      :items="trainingItems"
      :config="config"
      @save="handleSave"
      @validate="handleValidate"
      @skip="handleSkip"
    />
  </div>
</template>
```

### 5. Implement Event Handlers

```typescript
function handleSave(item: AletheiaItem) {
  console.log('Approved:', item);
  // Save to your backend
  // await api.updateTrainingData(item.id, item.output);
}

function handleValidate(item: AletheiaItem, isValid: boolean, message?: string) {
  if (!isValid) {
    alert(`Validation failed: ${message}`);
  }
}

function handleSkip(item: AletheiaItem) {
  console.log('Skipped:', item);
  // Mark as skipped in your backend
}
```

---

## Backend Integration Examples

### Supabase

```typescript
// composables/useTrainingData.ts
import { ref } from 'vue';
import { createClient } from '@supabase/supabase-js';
import type { AletheiaItem } from 'aletheia-labeling-studio';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function useTrainingData() {
  const items = ref<AletheiaItem[]>([]);
  const loading = ref(false);

  async function loadPending() {
    loading.value = true;
    const { data, error } = await supabase
      .from('training_data')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!error && data) {
      items.value = data.map(row => ({
        id: row.id,
        input: row.input_text,
        output: row.output_json,
        status: 'pending',
        qualityScore: row.quality_score || 0,
      }));
    }
    loading.value = false;
  }

  async function save(item: AletheiaItem) {
    await supabase
      .from('training_data')
      .update({
        output_json: item.output,
        quality_score: item.qualityScore,
        status: 'completed',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', item.id);

    await loadPending();
  }

  return { items, loading, loadPending, save };
}
```

### REST API

```typescript
export function useTrainingData() {
  const items = ref<AletheiaItem[]>([]);

  async function loadPending() {
    const response = await fetch('/api/training-data?status=pending');
    items.value = await response.json();
  }

  async function save(item: AletheiaItem) {
    await fetch(`/api/training-data/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        output: item.output,
        quality_score: item.qualityScore,
        status: 'completed',
      }),
    });
    await loadPending();
  }

  return { items, loadPending, save };
}
```

### Local Files (Development)

```typescript
import sampleData from './data/samples.json';

const items = ref<AletheiaItem[]>(sampleData);

function save(item: AletheiaItem) {
  const index = items.value.findIndex(i => i.id === item.id);
  if (index !== -1) {
    items.value[index] = { ...item, status: 'completed' };
  }
}
```

---

## Customization

### Custom Themes

Create a custom color scheme with Tailwind CSS:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'aletheia-primary': '#3B82F6',
        'aletheia-secondary': '#10B981',
        'aletheia-accent': '#F59E0B',
      },
    },
  },
};
```

### Custom Validation Logic

```typescript
const config: AletheiaConfig = {
  validations: {
    'email-classification': {
      customValidator: (item: AletheiaItem) => {
        const { intent, priority } = item.output;
        if (!intent || !priority) {
          return {
            isValid: false,
            message: 'Email must have intent and priority',
          };
        }
        return { isValid: true };
      },
    },
  },
};
```

---

## Development Workflow

### 1. Local Development

```bash
# Start demo server
npm run dev:demo

# Build library
npm run build:lib

# Run tests
npm run test
```

### 2. Integration Testing

```bash
# Link library locally
cd aletheia-labeling-studio
npm link

# In your project
cd your-project
npm link aletheia-labeling-studio
```

### 3. Production Build

```bash
npm run build:lib
npm publish
```

---

## Deployment

### GitHub Pages (Demo)

```bash
npm run build:demo
cd dist-demo
git init
git add .
git commit -m "Deploy demo"
git push -f origin master:gh-pages
```

### Vercel/Netlify (Demo)

```bash
# Build command
npm run build:demo

# Publish directory
dist-demo
```

---

## Troubleshooting

### Monaco Editor Not Loading

If you see a blank editor:

```typescript
// Ensure Monaco is properly bundled
import * as monaco from 'monaco-editor';
```

### Styles Not Applied

Make sure you import the CSS:

```typescript
import 'aletheia-labeling-studio/style.css';
```

### TypeScript Errors

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["node"]
  }
}
```

---

## Best Practices

1. **Validate Before Save:** Always call validation before saving
2. **Handle Errors:** Implement proper error handling in event listeners
3. **Progress Feedback:** Show loading states during async operations
4. **Keyboard Shortcuts:** Enable for power users
5. **Mobile Support:** Test on smaller screens (queue panel collapses)

---

## Need Help?

- **Documentation:** [Technical Whitepaper](docs/WHITEPAPER.md)
- **Issues:** [GitHub Issues](https://github.com/DEVmatrose/Aletheia-Labeling-Studio/issues)
- **Discussions:** [GitHub Discussions](https://github.com/DEVmatrose/Aletheia-Labeling-Studio/discussions)

---

**Happy Labeling! 🎯**

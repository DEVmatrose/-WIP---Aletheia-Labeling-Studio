<template>
  <div class="aletheia-labeler aletheia-container">
    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="text-center">
        <svg
          class="animate-spin h-12 w-12 text-aletheia-primary mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>

    <!-- Main Grid Layout -->
    <div class="grid grid-cols-12 gap-4 h-screen p-4">
      <!-- Left: Queue Panel -->
      <div class="col-span-3">
        <QueuePanel
          :items="items"
          :stats="stats"
          :progress="progress"
          :current-item-id="currentItem?.id"
          @select="selectItem"
        />
      </div>

      <!-- Center: Editor Panel -->
      <div class="col-span-6">
        <EditorPanel
          :item="currentItem"
          :allow-edit="config?.allowEdit !== false"
          @update:output="updateOutput"
        />
      </div>

      <!-- Right: Validation Panel -->
      <div class="col-span-3">
        <ValidationPanel
          :item="currentItem"
          :config="config"
          :has-next="hasNext"
          :has-previous="hasPrevious"
          @update:pillar="updatePillar"
          @update:quality="updateQualityScore"
          @update:metadata="updateMetadata"
          @validate="handleValidate"
          @save="handleSave"
          @skip="handleSkip"
          @next="loadNext"
          @previous="loadPrevious"
        />
      </div>
    </div>

    <!-- Keyboard Shortcuts Hint -->
    <div
      v-if="config?.enableKeyboardShortcuts !== false"
      class="fixed bottom-4 right-4 bg-gray-800 text-white text-xs px-3 py-2 rounded-md shadow-lg"
    >
      <div class="flex gap-4">
        <span><kbd class="bg-gray-700 px-1 rounded">Ctrl+S</kbd> Save</span>
        <span><kbd class="bg-gray-700 px-1 rounded">Ctrl+K</kbd> Skip</span>
        <span><kbd class="bg-gray-700 px-1 rounded">→</kbd> Next</span>
        <span><kbd class="bg-gray-700 px-1 rounded">←</kbd> Prev</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useAletheia } from '../composables/useAletheia';
import QueuePanel from './QueuePanel.vue';
import EditorPanel from './EditorPanel.vue';
import ValidationPanel from './ValidationPanel.vue';
import type { AletheiaItem, AletheiaConfig } from '../types';

interface Props {
  items: AletheiaItem[];
  config?: AletheiaConfig;
  loading?: boolean;
}

interface Emits {
  (e: 'save', item: AletheiaItem): void;
  (e: 'validate', item: AletheiaItem, isValid: boolean, message?: string): void;
  (e: 'skip', item: AletheiaItem): void;
  (e: 'select', item: AletheiaItem): void;
  (e: 'edit', item: AletheiaItem, newOutput: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

const {
  currentItem,
  stats,
  progress,
  hasNext,
  hasPrevious,
  loadNext,
  loadPrevious,
  selectItem: selectItemById,
  markCompleted,
  markSkipped,
  updateOutput,
  updatePillar,
  updateQualityScore,
  validate,
} = useAletheia(props.items, props.config);

function selectItem(id: string) {
  selectItemById(id);
  const item = props.items.find(i => i.id === id);
  if (item) {
    emit('select', item);
  }
}

function updateMetadata(key: string, value: any) {
  if (currentItem.value) {
    if (!currentItem.value.metadata) {
      currentItem.value.metadata = {};
    }
    currentItem.value.metadata[key] = value;
  }
}

function handleValidate() {
  const result = validate();
  if (currentItem.value) {
    emit('validate', currentItem.value, result.isValid, result.message);
  }
}

function handleSave() {
  const result = validate();
  if (result.isValid && currentItem.value) {
    markCompleted();
    emit('save', currentItem.value);
  }
}

function handleSkip() {
  if (currentItem.value) {
    markSkipped();
    emit('skip', currentItem.value);
  }
}

// Keyboard shortcuts
function handleKeyboard(event: KeyboardEvent) {
  if (props.config?.enableKeyboardShortcuts === false) return;

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
  
  // Arrow Right: Next
  if (event.key === 'ArrowRight' && !event.ctrlKey && !event.metaKey) {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
      loadNext();
    }
  }
  
  // Arrow Left: Previous
  if (event.key === 'ArrowLeft' && !event.ctrlKey && !event.metaKey) {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
      loadPrevious();
    }
  }
}

onMounted(() => {
  if (props.config?.enableKeyboardShortcuts !== false) {
    window.addEventListener('keydown', handleKeyboard);
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard);
});
</script>

<style scoped>
.aletheia-labeler {
  position: relative;
}

kbd {
  font-family: monospace;
  font-size: 0.875em;
}
</style>

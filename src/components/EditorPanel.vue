<template>
  <div class="editor-panel aletheia-panel h-full overflow-hidden flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Editor
        </h3>
        <p v-if="item" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ item.category || 'Uncategorized' }} · #{{ item.id.substring(0, 8) }}
        </p>
      </div>
      
      <div v-if="allowEdit" class="flex gap-2">
        <button
          @click="formatJSON"
          class="aletheia-button aletheia-button-secondary text-sm"
          title="Format JSON"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <button
          @click="resetOutput"
          class="aletheia-button aletheia-button-secondary text-sm"
          title="Reset to original"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Input Section -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Input
      </label>
      <div class="bg-white dark:bg-gray-900 rounded-md p-3 border border-gray-200 dark:border-gray-700 max-h-32 overflow-y-auto">
        <pre class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">{{ item?.input || 'No input' }}</pre>
      </div>
    </div>

    <!-- Output Section (Monaco Editor) -->
    <div class="flex-1 overflow-hidden flex flex-col">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 px-4 pt-4 pb-2">
        Output (JSON)
      </label>
      
      <div class="flex-1 px-4 pb-4">
        <div
          ref="editorContainer"
          class="w-full h-full rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden"
        ></div>
      </div>
    </div>

    <!-- Footer with Metadata -->
    <div v-if="item?.metadata" class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <details class="text-sm">
        <summary class="cursor-pointer font-medium text-gray-700 dark:text-gray-300">
          Metadata
        </summary>
        <pre class="mt-2 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono">{{ JSON.stringify(item.metadata, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import type { AletheiaItem } from '../types';

interface Props {
  item: AletheiaItem | null;
  allowEdit?: boolean;
}

interface Emits {
  (e: 'update:output', value: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  allowEdit: true,
});

const emit = defineEmits<Emits>();

const editorContainer = ref<HTMLElement | null>(null);
let editor: any = null;
const originalOutput = ref<any>(null);

// Monaco Editor will be initialized here
// For now, using a simple textarea as fallback

function formatJSON() {
  if (editor && props.item) {
    try {
      const value = editor.getValue();
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      editor.setValue(formatted);
    } catch (err) {
      console.error('Invalid JSON:', err);
    }
  }
}

function resetOutput() {
  if (editor && originalOutput.value) {
    editor.setValue(JSON.stringify(originalOutput.value, null, 2));
    emit('update:output', originalOutput.value);
  }
}

// Watch for item changes
watch(() => props.item, (newItem) => {
  if (newItem) {
    originalOutput.value = JSON.parse(JSON.stringify(newItem.output));
    if (editor) {
      editor.setValue(JSON.stringify(newItem.output, null, 2));
    }
  }
}, { immediate: true });

// Initialize editor (simplified - full Monaco integration would go here)
onMounted(() => {
  if (editorContainer.value) {
    // Create enhanced textarea with better UX
    const textarea = document.createElement('textarea');
    textarea.className = 'w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-aletheia-primary resize-none';
    textarea.style.tabSize = '2';
    textarea.placeholder = props.allowEdit ? 'Enter JSON output here...' : 'No output available';
    
    // Format initial value
    const initialValue = props.item?.output || '';
    if (typeof initialValue === 'object') {
      textarea.value = JSON.stringify(initialValue, null, 2);
    } else {
      textarea.value = initialValue;
    }
    
    textarea.readOnly = !props.allowEdit;
    
    // Handle Tab key for indentation
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }
    });
    
    // Emit updates with validation
    textarea.addEventListener('input', (e) => {
      const value = (e.target as HTMLTextAreaElement).value;
      try {
        const parsed = JSON.parse(value);
        emit('update:output', parsed);
        // Visual feedback: valid JSON
        textarea.style.borderColor = '#10b981';
      } catch {
        // Visual feedback: invalid JSON
        textarea.style.borderColor = '#ef4444';
      }
    });
    
    editorContainer.value.appendChild(textarea);
    editor = {
      getValue: () => textarea.value,
      setValue: (value: string) => { 
        textarea.value = value;
        textarea.style.borderColor = '';
      },
    };
  }
});

onUnmounted(() => {
  // Cleanup Monaco editor if initialized
  if (editor && typeof editor.dispose === 'function') {
    editor.dispose();
  }
});
</script>

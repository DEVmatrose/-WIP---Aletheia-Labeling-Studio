<template>
  <div class="smart-editor-panel aletheia-panel h-full overflow-hidden flex flex-col">
    <!-- Header with View Toggle -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Editor
      </h3>
      
      <!-- View Mode Toggle -->
      <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          @click="viewMode = 'visual'"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded transition-all',
            viewMode === 'visual'
              ? 'bg-white dark:bg-gray-700 text-aletheia-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          👁️ Visual View
        </button>
        <button
          @click="viewMode = 'json'"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded transition-all',
            viewMode === 'json'
              ? 'bg-white dark:bg-gray-700 text-aletheia-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          💻 JSON View
        </button>
      </div>
    </div>

    <div v-if="!item" class="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
      <div class="text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-sm">Select an item from the queue to start editing</p>
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto p-4">
      <!-- Item Header -->
      <div class="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ item.category }}</span>
          <span class="text-xs font-mono text-gray-500 dark:text-gray-400">#{{ item.id }}</span>
        </div>
      </div>

      <!-- Visual View (Smart Forms) -->
      <div v-if="viewMode === 'visual'" class="space-y-6">
        <!-- Input Section (Editable Textarea) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📝 User Input (Editable)
          </label>
          <textarea
            v-model="editableInput"
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-aletheia-primary focus:border-transparent
                   font-mono text-sm"
            :readonly="!allowEdit"
          ></textarea>
        </div>

        <!-- Divider -->
        <div class="border-t-2 border-dashed border-gray-300 dark:border-gray-600 my-6"></div>

        <!-- Output Section (Dynamic Form Fields) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            🤖 KAIROS Output (Target)
          </label>
          
          <!-- Text-based Output (No JSON Structure) -->
          <div v-if="Object.keys(parsedOutput).length === 0">
            <!-- Info Banner -->
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
              <div class="flex items-center gap-2">
                <span class="text-lg">📝</span>
                <p class="text-xs text-blue-800 dark:text-blue-200">
                  <strong>Text-based Response</strong> — This output uses narrative text instead of structured data. Edit the text directly below.
                </p>
              </div>
            </div>
            
            <!-- Editable Text Output -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🤖 KAIROS Output (Text Response)
              </label>
              <textarea
                v-model="editableOutputText"
                :disabled="!allowEdit"
                class="w-full h-[400px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-aletheia-primary focus:border-transparent
                       disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed
                       font-mono whitespace-pre-wrap"
                placeholder="KAIROS text response..."
                @input="handleTextOutputChange"
              />
            </div>
          </div>
          
          <!-- Structured Output (JSON Form Fields) -->
          <div v-else class="space-y-4">
            <!-- Info: JSON was extracted from code block -->
            <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
              <div class="flex items-center gap-2">
                <span class="text-lg">✓</span>
                <p class="text-xs text-green-800 dark:text-green-200">
                  <strong>Structured Data Detected</strong> — JSON extracted from response. Edit using form fields below.
                </p>
              </div>
            </div>
            
            <DynamicFormField
              v-for="(value, key) in parsedOutput"
              :key="key"
              :label="formatLabel(key)"
              :value="value"
              :field-name="key"
              @update="handleFieldUpdate"
            />
          </div>
        </div>
      </div>

      <!-- JSON View (Raw Code) -->
      <div v-else class="space-y-4">
        <!-- Input JSON -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input (JSON)
          </label>
          <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm border border-gray-200 dark:border-gray-700"><code>{{ JSON.stringify({ input: item.input }, null, 2) }}</code></pre>
        </div>

        <!-- Output JSON -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Output (JSON)
          </label>
          <textarea
            v-model="editableOutputJson"
            rows="15"
            class="w-full px-3 py-2 border rounded-lg font-mono text-sm
                   focus:ring-2 focus:ring-aletheia-primary focus:border-transparent"
            :class="jsonValid ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-red-500 bg-red-50 dark:bg-red-900/10'"
            :readonly="!allowEdit"
            @input="validateJson"
          ></textarea>
          <p v-if="!jsonValid" class="mt-1 text-xs text-red-600 dark:text-red-400">
            ⚠️ Invalid JSON syntax
          </p>
        </div>
      </div>

      <!-- Metadata Section (Collapsible) -->
      <details class="mt-6">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-aletheia-primary">
          ▼ Metadata
        </summary>
        <div class="mt-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <pre class="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto"><code>{{ JSON.stringify(item.metadata, null, 2) }}</code></pre>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { AletheiaItem } from '../types';
import DynamicFormField from './DynamicFormField.vue';

interface Props {
  item: AletheiaItem | null;
  allowEdit?: boolean;
}

interface Emits {
  (e: 'update:output', output: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  allowEdit: true,
});

const emit = defineEmits<Emits>();

const viewMode = ref<'visual' | 'json'>('visual');
const editableInput = ref('');
const editableOutputJson = ref('');
const editableOutputText = ref(''); // For text-based outputs (no JSON)
const jsonValid = ref(true);

const parsedOutput = computed(() => {
  try {
    let parsed = JSON.parse(editableOutputJson.value);
    
    // If it's a string (like our training data), try to extract JSON
    if (typeof parsed === 'string') {
      // Strategy 1: Look for JSON code blocks: ```json ... ```
      const jsonBlockMatch = parsed.match(/```json\s*\n([\s\S]*?)\n```/);
      if (jsonBlockMatch) {
        try {
          const extracted = JSON.parse(jsonBlockMatch[1]);
          if (extracted && typeof extracted === 'object' && !Array.isArray(extracted)) {
            return extracted;
          }
        } catch {
          // Continue to next strategy
        }
      }
      
      // Strategy 2: Look for any JSON object in the string (without code block)
      // Match { ... } patterns
      const jsonMatch = parsed.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extracted = JSON.parse(jsonMatch[0]);
          if (extracted && typeof extracted === 'object' && !Array.isArray(extracted)) {
            return extracted;
          }
        } catch {
          // Continue to next strategy
        }
      }
      
      // Strategy 3: Try to parse the entire string as JSON
      try {
        const directParse = JSON.parse(parsed);
        if (directParse && typeof directParse === 'object' && !Array.isArray(directParse)) {
          return directParse;
        }
      } catch {
        // No JSON found
      }
      
      // No valid JSON found in string
      return {};
    }
    
    // If it's already an object, use it directly
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
    
    return {};
  } catch {
    return {};
  }
});

watch(() => props.item, (newItem) => {
  if (newItem) {
    editableInput.value = newItem.input;
    editableOutputJson.value = JSON.stringify(newItem.output, null, 2);
    
    // For text-based outputs, extract the readable string
    try {
      const parsed = JSON.parse(editableOutputJson.value);
      if (typeof parsed === 'string') {
        editableOutputText.value = parsed;
      } else {
        editableOutputText.value = JSON.stringify(parsed, null, 2);
      }
    } catch {
      editableOutputText.value = newItem.output as string;
    }
    
    jsonValid.value = true;
  }
}, { immediate: true });

function validateJson() {
  try {
    JSON.parse(editableOutputJson.value);
    jsonValid.value = true;
  } catch {
    jsonValid.value = false;
  }
}

function formatLabel(key: string | number | symbol): string {
  const keyStr = String(key);
  return keyStr
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function handleFieldUpdate(fieldName: string, newValue: any) {
  const output = parsedOutput.value;
  output[fieldName] = newValue;
  
  try {
    const originalParsed = JSON.parse(editableOutputJson.value);
    
    // If original was a string with JSON code block, update the code block
    if (typeof originalParsed === 'string' && originalParsed.includes('```json')) {
      const updatedJson = JSON.stringify(output, null, 2);
      const updatedString = originalParsed.replace(
        /```json\s*\n[\s\S]*?\n```/,
        `\`\`\`json\n${updatedJson}\n\`\`\``
      );
      editableOutputJson.value = JSON.stringify(updatedString, null, 2);
      emit('update:output', updatedString);
    } else {
      // Direct object update
      editableOutputJson.value = JSON.stringify(output, null, 2);
      emit('update:output', output);
    }
  } catch {
    // Fallback: just update as object
    editableOutputJson.value = JSON.stringify(output, null, 2);
    emit('update:output', output);
  }
}

function handleTextOutputChange() {
  // Update the JSON representation with the new text
  editableOutputJson.value = JSON.stringify(editableOutputText.value, null, 2);
  emit('update:output', editableOutputText.value);
}
</script>

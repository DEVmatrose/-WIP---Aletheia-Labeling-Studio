<template>
  <div class="dynamic-form-field">
    <!-- Array of Strings → Tag Input -->
    <div v-if="isArrayOfStrings" class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
      </label>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(tag, index) in value"
          :key="index"
          class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
        >
          {{ tag }}
          <button
            @click="removeTag(index)"
            class="hover:text-blue-600 dark:hover:text-blue-200"
          >
            ×
          </button>
        </span>
        <input
          v-model="newTag"
          @keydown.enter.prevent="addTag"
          placeholder="+ Add"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                 focus:ring-2 focus:ring-aletheia-primary focus:border-transparent"
        />
      </div>
    </div>

    <!-- Long String → Textarea -->
    <div v-else-if="isLongString" class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
      </label>
      <textarea
        :value="value"
        @input="emit('update', fieldName, ($event.target as HTMLTextAreaElement).value)"
        rows="4"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
               focus:ring-2 focus:ring-aletheia-primary focus:border-transparent text-sm"
      ></textarea>
    </div>

    <!-- Number → Number Input or Slider -->
    <div v-else-if="isNumber" class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
      </label>
      <div class="flex items-center gap-4">
        <input
          type="range"
          :value="value"
          @input="emit('update', fieldName, parseFloat(($event.target as HTMLInputElement).value))"
          min="0"
          max="1"
          step="0.01"
          class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <input
          type="number"
          :value="value"
          @input="emit('update', fieldName, parseFloat(($event.target as HTMLInputElement).value))"
          min="0"
          max="1"
          step="0.01"
          class="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-center"
        />
      </div>
    </div>

    <!-- Boolean → Checkbox -->
    <div v-else-if="isBoolean" class="flex items-center gap-2">
      <input
        type="checkbox"
        :checked="value"
        @change="emit('update', fieldName, ($event.target as HTMLInputElement).checked)"
        class="w-4 h-4 text-aletheia-primary border-gray-300 rounded
               focus:ring-aletheia-primary focus:ring-2"
      />
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
      </label>
    </div>

    <!-- Short String → Text Input -->
    <div v-else-if="isString" class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
      </label>
      <input
        type="text"
        :value="value"
        @input="emit('update', fieldName, ($event.target as HTMLInputElement).value)"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
               focus:ring-2 focus:ring-aletheia-primary focus:border-transparent text-sm"
      />
    </div>

    <!-- Object → Nested Fields (Simplified) -->
    <div v-else-if="isObject" class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
      </label>
      <div class="pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
        <DynamicFormField
          v-for="(nestedValue, nestedKey) in value"
          :key="nestedKey"
          :label="formatLabel(String(nestedKey))"
          :value="nestedValue"
          :field-name="`${fieldName}.${nestedKey}`"
          @update="emit('update', $event.fieldName, $event.value)"
        />
      </div>
    </div>

    <!-- Fallback → JSON Code Block -->
    <div v-else class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
      </label>
      <pre class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs border border-gray-200 dark:border-gray-700 overflow-x-auto"><code>{{ JSON.stringify(value, null, 2) }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  label: string;
  value: any;
  fieldName: string;
}

interface Emits {
  (e: 'update', fieldName: string, value: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const newTag = ref('');

// Type Detection
const isArrayOfStrings = computed(() => {
  return Array.isArray(props.value) && props.value.every(item => typeof item === 'string');
});

const isLongString = computed(() => {
  return typeof props.value === 'string' && props.value.length > 100;
});

const isString = computed(() => {
  return typeof props.value === 'string' && props.value.length <= 100;
});

const isNumber = computed(() => {
  return typeof props.value === 'number';
});

const isBoolean = computed(() => {
  return typeof props.value === 'boolean';
});

const isObject = computed(() => {
  return typeof props.value === 'object' && props.value !== null && !Array.isArray(props.value);
});

// Tag Input Functions
function addTag() {
  if (newTag.value.trim() && Array.isArray(props.value)) {
    const updatedArray = [...props.value, newTag.value.trim()];
    emit('update', props.fieldName, updatedArray);
    newTag.value = '';
  }
}

function removeTag(index: number) {
  if (Array.isArray(props.value)) {
    const updatedArray = props.value.filter((_, i) => i !== index);
    emit('update', props.fieldName, updatedArray);
  }
}

function formatLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
</script>

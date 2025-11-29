<template>
  <div class="validation-panel aletheia-panel h-full overflow-y-auto flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Validation
      </h3>
    </div>

    <div class="flex-1 p-4 space-y-6">
      <!-- Pillar Selection -->
      <div v-if="config?.pillars && config.pillars.length > 0">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ config.labels?.pillar || 'Category/Pillar' }}
        </label>
        <select
          :value="item?.pillar || ''"
          @change="$emit('update:pillar', ($event.target as HTMLSelectElement).value)"
          class="aletheia-select"
        >
          <option value="">Select...</option>
          <option v-for="pillar in config.pillars" :key="pillar" :value="pillar">
            {{ pillar }}
          </option>
        </select>
      </div>

      <!-- Quality Score -->
      <div v-if="config?.showQualityScore !== false">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ config?.labels?.quality || 'Quality Score' }}
        </label>
        <div class="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            :value="(item?.qualityScore || 0) * 100"
            @input="handleQualityChange"
            class="flex-1"
          />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-right">
            {{ Math.round((item?.qualityScore || 0) * 100) }}%
          </span>
        </div>
      </div>

      <!-- Pillar-Specific Validations -->
      <div v-if="item?.pillar && config?.validations?.[item.pillar]">
        <div class="space-y-3">
          <!-- Neutrality Check (for psychological) -->
          <label
            v-if="item.pillar && config.validations?.[item.pillar]?.neutralityCheck"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              :checked="item.metadata?.isNeutral || false"
              @change="updateMetadata('isNeutral', ($event.target as HTMLInputElement).checked)"
              class="w-4 h-4 text-aletheia-primary rounded focus:ring-aletheia-primary"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">
              Neutrality confirmed (no pathologization)
            </span>
          </label>

          <!-- Source Citation (for scientific) -->
          <div v-if="item.pillar && config.validations?.[item.pillar]?.requireCitation">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Source Citation
            </label>
            <textarea
              :value="item.metadata?.sourceCitation || ''"
              @input="updateMetadata('sourceCitation', ($event.target as HTMLTextAreaElement).value)"
              placeholder="Enter source citation..."
              rows="3"
              class="aletheia-input"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Validation Status -->
      <div
        v-if="validationMessage"
        :class="[
          'p-3 rounded-md text-sm',
          validationStatus.isValid
            ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200'
        ]"
      >
        {{ validationMessage }}
      </div>
    </div>

    <!-- Actions -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
      <button
        @click="handleValidate"
        class="w-full aletheia-button aletheia-button-primary"
      >
        {{ config?.labels?.validate || 'Validate' }}
      </button>
      
      <button
        @click="handleSave"
        :disabled="!validationStatus.isValid"
        :class="[
          'w-full aletheia-button',
          validationStatus.isValid
            ? 'aletheia-button-success'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700'
        ]"
      >
        {{ config?.labels?.save || 'Save & Approve' }}
      </button>
      
      <button
        @click="$emit('skip')"
        class="w-full aletheia-button aletheia-button-secondary"
      >
        {{ config?.labels?.skip || 'Skip' }}
      </button>

      <!-- Navigation -->
      <div class="flex gap-2 pt-2">
        <button
          @click="$emit('previous')"
          :disabled="!hasPrevious"
          :class="[
            'flex-1 aletheia-button aletheia-button-secondary',
            !hasPrevious && 'opacity-50 cursor-not-allowed'
          ]"
        >
          ← Previous
        </button>
        <button
          @click="$emit('next')"
          :disabled="!hasNext"
          :class="[
            'flex-1 aletheia-button aletheia-button-secondary',
            !hasNext && 'opacity-50 cursor-not-allowed'
          ]"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { AletheiaItem, AletheiaConfig } from '../types';

interface Props {
  item: AletheiaItem | null;
  config?: AletheiaConfig;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

interface Emits {
  (e: 'update:pillar', value: string): void;
  (e: 'update:quality', value: number): void;
  (e: 'update:metadata', key: string, value: any): void;
  (e: 'validate'): void;
  (e: 'save'): void;
  (e: 'skip'): void;
  (e: 'next'): void;
  (e: 'previous'): void;
}

const props = withDefaults(defineProps<Props>(), {
  hasNext: false,
  hasPrevious: false,
});

const emit = defineEmits<Emits>();

const validationMessage = ref<string>('');
const validationStatus = ref<{ isValid: boolean; message?: string }>({ isValid: false });

function handleQualityChange(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value) / 100;
  emit('update:quality', value);
}

function updateMetadata(key: string, value: any) {
  emit('update:metadata', key, value);
}

function handleValidate() {
  if (!props.item) {
    validationStatus.value = { isValid: false, message: 'No item selected' };
    validationMessage.value = 'No item selected';
    return;
  }

  const item = props.item;
  const pillar = item.pillar;

  // Check pillar-specific validations
  if (pillar && props.config?.validations?.[pillar]) {
    const validation = props.config.validations[pillar];

    // Neutrality check
    if (validation.neutralityCheck && !item.metadata?.isNeutral) {
      validationStatus.value = {
        isValid: false,
        message: 'Psychological data must be marked as neutral',
      };
      validationMessage.value = validationStatus.value.message || '';
      emit('validate');
      return;
    }

    // Citation requirement
    if (validation.requireCitation && !item.metadata?.sourceCitation) {
      validationStatus.value = {
        isValid: false,
        message: 'Scientific data requires source citation',
      };
      validationMessage.value = validationStatus.value.message || '';
      emit('validate');
      return;
    }

    // Quality score threshold
    if (validation.minQualityScore && (!item.qualityScore || item.qualityScore < validation.minQualityScore)) {
      validationStatus.value = {
        isValid: false,
        message: `Quality score must be at least ${validation.minQualityScore * 100}%`,
      };
      validationMessage.value = validationStatus.value.message || '';
      emit('validate');
      return;
    }
  }

  validationStatus.value = { isValid: true, message: 'All validations passed' };
  validationMessage.value = 'All validations passed ✓';
  emit('validate');
}

function handleSave() {
  if (validationStatus.value.isValid) {
    emit('save');
  }
}

// Auto-validate on item or pillar change
watch(() => [props.item, props.item?.pillar], () => {
  validationMessage.value = '';
  validationStatus.value = { isValid: false };
});
</script>

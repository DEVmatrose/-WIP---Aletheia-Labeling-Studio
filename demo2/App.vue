<template>
  <div class="demo-app min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Demo Warning Banner -->
    <div class="demo-banner bg-yellow-50 border-b-2 border-yellow-400 px-4 py-2.5 dark:bg-yellow-900/20 dark:border-yellow-700">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl">⚠️</span>
          <div>
            <p class="text-sm font-medium text-yellow-900 dark:text-yellow-200">
              <strong>Demo 2 - Smart Editor:</strong> Form-based editing for non-technical users
            </p>
            <p class="text-xs text-yellow-700 dark:text-yellow-300 mt-0.5">
              Switch between Visual View (forms) and JSON View (code) • Only Technical tab functional
            </p>
          </div>
        </div>
        <a 
          href="https://github.com/DEVmatrose/Aletheia-Labeling-Studio" 
          target="_blank"
          class="text-sm text-yellow-700 hover:text-yellow-900 dark:text-yellow-300 dark:hover:text-yellow-100 font-medium whitespace-nowrap"
        >
          Learn More →
        </a>
      </div>
    </div>

    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-md">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Aletheia Labeling Studio
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Demo 2: Smart Editor with Dynamic Forms
            </p>
          </div>
          
          <div class="flex items-center gap-4">
            <a
              href="https://github.com/DEVmatrose/Aletheia-Labeling-Studio"
              target="_blank"
              rel="noopener"
              class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="h-[calc(100vh-100px)]">
      <div class="grid grid-cols-12 gap-4 h-full p-4">
        <!-- Left: Queue Panel with Tabs -->
        <div class="col-span-3 h-full">
          <QueuePanelWithTabs
            :items="sampleItems"
            :stats="stats"
            :progress="progress"
            :current-item-id="currentItem?.id"
            @select="selectItem"
          />
        </div>

        <!-- Center: Smart Editor Panel -->
        <div class="col-span-6 h-full">
          <SmartEditorPanel
            :item="currentItem"
            :allow-edit="true"
            @update:output="updateOutput"
          />
        </div>

        <!-- Right: Validation Panel -->
        <div class="col-span-3 h-full">
          <ValidationPanel
            :item="currentItem"
            :config="demoConfig"
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
    </main>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg',
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        ]"
      >
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import QueuePanelWithTabs from '../src/components/QueuePanelWithTabs.vue';
import SmartEditorPanel from '../src/components/SmartEditorPanel.vue';
import ValidationPanel from '../src/components/ValidationPanel.vue';
import { useAletheia } from '../src/composables/useAletheia';
import type { AletheiaItem, AletheiaConfig } from '../src/types';
import { MOCK_ALL_DATA } from '../src/data/mockData';

const loading = ref(false);
const sampleItems = ref<AletheiaItem[]>(MOCK_ALL_DATA);

const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error',
});

const demoConfig: AletheiaConfig = {
  pillars: ['technical'], // Demo simplified: only technical training data
  showQualityScore: true,
  allowEdit: true,
  enableKeyboardShortcuts: true,
  labels: {
    save: 'Approve & Save',
    skip: 'Skip for Now',
    validate: 'Validate Schema',
    pillar: 'Task Type',
    quality: 'Quality Score',
  },
  validations: {
    'technical': {
      minQualityScore: 0.75,
    },
  },
};

const {
  currentItem,
  stats,
  progress,
  hasNext,
  hasPrevious,
  loadNext,
  loadPrevious,
  selectItem: selectItemById,
  updateOutput,
  updatePillar,
  updateQualityScore,
} = useAletheia(MOCK_ALL_DATA, demoConfig);

function selectItem(id: string) {
  selectItemById(id);
}

function updateMetadata(key: string, value: any) {
  if (currentItem.value) {
    if (!currentItem.value.metadata) {
      currentItem.value.metadata = {};
    }
    currentItem.value.metadata[key] = value;
  }
}

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
}

function handleSave(item: AletheiaItem) {
  loading.value = true;
  
  console.log('💾 Saving item:', {
    id: item.id,
    pillar: item.pillar,
    qualityScore: item.qualityScore,
    status: item.status
  });
  
  // Simulate API call with realistic delay
  setTimeout(() => {
    loading.value = false;
    
    // Simulate random success/failure (90% success rate)
    const success = Math.random() > 0.1;
    
    if (success) {
      showToast(`✅ Item #${item.id} saved successfully to database!`, 'success');
      console.log('✅ API Response: Item saved', { timestamp: new Date().toISOString() });
    } else {
      showToast(`❌ Failed to save item #${item.id}. Please try again.`, 'error');
      console.error('❌ API Error: Network timeout');
    }
  }, 800);
}

function handleValidate(item: AletheiaItem, isValid: boolean, message?: string) {
  console.log('🔍 Validation result:', { 
    id: item.id,
    isValid, 
    message,
    pillar: item.pillar,
    qualityScore: item.qualityScore 
  });
  
  if (!isValid && message) {
    showToast(`⚠️ ${message}`, 'error');
  } else if (isValid) {
    showToast(`✓ Validation passed for #${item.id.substring(0, 8)}`, 'success');
  }
}

function handleSkip(item: AletheiaItem) {
  console.log('⏭️ Skipped item:', item.id);
  showToast(`⏭️ Item #${item.id} marked as skipped`, 'success');
}

onMounted(() => {
  console.log('🎯 Aletheia Demo 2 (Smart Editor) loaded with', sampleItems.value.length, 'training examples');
  console.log('💡 Switch between Visual View (forms) and JSON View (code)');
  console.log('🔧 Only Technical tab is functional in this demo');
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>

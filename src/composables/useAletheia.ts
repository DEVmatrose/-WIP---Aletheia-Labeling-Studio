import { ref, computed, watch } from 'vue';
import type { AletheiaItem, AletheiaConfig, AletheiaStats } from '../types';

/**
 * Composable for managing Aletheia labeling state
 */
export function useAletheia(itemsProp: AletheiaItem[], config?: AletheiaConfig) {
  // Make items reactive
  const items = ref<AletheiaItem[]>(itemsProp);
  
  // Current active item
  const currentItem = ref<AletheiaItem | null>(null);
  
  // Current index in queue
  const currentIndex = ref(0);
  
  // Loading state
  const loading = ref(false);

  // Watch for external items changes
  watch(() => itemsProp, (newItems) => {
    items.value = newItems;
    // Re-initialize if items changed and no current item
    if (!currentItem.value && newItems.length > 0) {
      const firstPending = newItems.find(item => item.status === 'pending' || !item.status);
      if (firstPending) {
        currentItem.value = { ...firstPending };
        currentItem.value.status = 'in-progress';
      }
    }
  }, { deep: true, immediate: true });

  // Computed: Queue filtered by status
  const pendingItems = computed(() => 
    items.value.filter(item => item.status === 'pending' || !item.status)
  );

  const completedItems = computed(() =>
    items.value.filter(item => item.status === 'completed')
  );

  const skippedItems = computed(() =>
    items.value.filter(item => item.status === 'skipped')
  );

  // Computed: Statistics
  const stats = computed<AletheiaStats>(() => {
    const total = items.value.length;
    const pending = pendingItems.value.length;
    const completed = completedItems.value.length;
    const skipped = skippedItems.value.length;
    const inProgress = items.value.filter(item => item.status === 'in-progress').length;

    const averageQuality = completed > 0
      ? completedItems.value
          .filter(item => item.qualityScore !== undefined)
          .reduce((sum, item) => sum + (item.qualityScore || 0), 0) / completed
      : undefined;

    return { total, pending, completed, skipped, inProgress, averageQuality };
  });

  // Computed: Progress percentage
  const progress = computed(() => {
    if (items.value.length === 0) return 0;
    return Math.round(((stats.value.completed + stats.value.skipped) / items.value.length) * 100);
  });

  // Computed: Has next item
  const hasNext = computed(() => currentIndex.value < pendingItems.value.length - 1);

  // Computed: Has previous item
  const hasPrevious = computed(() => currentIndex.value > 0);

  /**
   * Load next pending item
   */
  function loadNext() {
    if (hasNext.value) {
      currentIndex.value++;
      const nextItem = pendingItems.value[currentIndex.value];
      if (nextItem) {
        currentItem.value = nextItem;
        currentItem.value.status = 'in-progress';
      }
    }
  }

  /**
   * Load previous item
   */
  function loadPrevious() {
    if (hasPrevious.value) {
      currentIndex.value--;
      const prevItem = pendingItems.value[currentIndex.value];
      if (prevItem) {
        currentItem.value = prevItem;
        currentItem.value.status = 'in-progress';
      }
    }
  }

  /**
   * Select specific item by ID
   */
  function selectItem(id: string) {
    const item = items.value.find(item => item.id === id);
    if (item) {
      currentItem.value = { ...item }; // Create a copy to ensure reactivity
      currentIndex.value = pendingItems.value.findIndex(i => i.id === id);
      if (currentItem.value.status !== 'completed' && currentItem.value.status !== 'skipped') {
        currentItem.value.status = 'in-progress';
      }
      console.log('📦 useAletheia.selectItem: currentItem set to', currentItem.value.id);
    } else {
      console.warn('⚠️ useAletheia.selectItem: Item not found', id);
    }
  }

  /**
   * Mark current item as completed
   */
  function markCompleted(updatedItem?: Partial<AletheiaItem>) {
    if (currentItem.value) {
      currentItem.value.status = 'completed';
      if (updatedItem) {
        Object.assign(currentItem.value, updatedItem);
      }
      loadNext();
    }
  }

  /**
   * Mark current item as skipped
   */
  function markSkipped() {
    if (currentItem.value) {
      currentItem.value.status = 'skipped';
      loadNext();
    }
  }

  /**
   * Update output of current item
   */
  function updateOutput(newOutput: any) {
    if (currentItem.value) {
      currentItem.value.output = newOutput;
    }
  }

  /**
   * Update pillar of current item
   */
  function updatePillar(pillar: string) {
    if (currentItem.value) {
      currentItem.value.pillar = pillar;
    }
  }

  /**
   * Update quality score
   */
  function updateQualityScore(score: number) {
    if (currentItem.value) {
      currentItem.value.qualityScore = score;
    }
  }

  /**
   * Validate current item
   */
  function validate(): { isValid: boolean; message?: string } {
    if (!currentItem.value) {
      return { isValid: false, message: 'No item selected' };
    }

    const item = currentItem.value;
    const pillar = item.pillar;

    // Check pillar-specific validations
    if (pillar && config?.validations?.[pillar]) {
      const validation = config.validations[pillar];

      // Custom validator function
      if (validation.validator) {
        const result = validation.validator(item);
        if (typeof result === 'string') {
          return { isValid: false, message: result };
        }
        if (!result) {
          return { isValid: false, message: 'Validation failed' };
        }
      }

      // Neutrality check (for psychological data)
      if (validation.neutralityCheck && !item.metadata?.isNeutral) {
        return { 
          isValid: false, 
          message: 'Psychological data must be marked as neutral' 
        };
      }

      // Citation requirement (for scientific data)
      if (validation.requireCitation && !item.metadata?.sourceCitation) {
        return { 
          isValid: false, 
          message: 'Scientific data requires source citation' 
        };
      }

      // Quality score threshold
      if (validation.minQualityScore && (!item.qualityScore || item.qualityScore < validation.minQualityScore)) {
        return { 
          isValid: false, 
          message: `Quality score must be at least ${validation.minQualityScore}` 
        };
      }
    }

    return { isValid: true };
  }

  // Initialize: Load first item
  watch(() => items.value.length, (newLength) => {
    if (newLength > 0 && !currentItem.value && pendingItems.value.length > 0) {
      const firstItem = pendingItems.value[0];
      if (firstItem) {
        currentItem.value = { ...firstItem }; // Create a copy
        currentItem.value.status = 'in-progress';
      }
    }
  }, { immediate: true });

  return {
    // State
    currentItem,
    currentIndex,
    loading,
    
    // Computed
    pendingItems,
    completedItems,
    skippedItems,
    stats,
    progress,
    hasNext,
    hasPrevious,
    
    // Actions
    loadNext,
    loadPrevious,
    selectItem,
    markCompleted,
    markSkipped,
    updateOutput,
    updatePillar,
    updateQualityScore,
    validate,
  };
}

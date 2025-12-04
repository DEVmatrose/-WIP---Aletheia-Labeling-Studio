# 🏗️ Code-Entwurf: Tab-basierte View-Architektur

**Datum:** 03. Dezember 2025  
**Kontext:** Produktiv-Anwendung (nicht Demo!)  
**Ziel:** Saubere Trennung der drei Pillar-Workflows durch Tab-basierte Views

---

## 1. Main Container: KairosTrainingView.vue

```vue
<template>
  <div class="kairos-training-view">
    <!-- Tab Navigation (Top Level) -->
    <div class="tabs-container bg-white dark:bg-gray-800 border-b">
      <button
        v-for="pillar in pillars"
        :key="pillar.value"
        @click="activePillar = pillar.value"
        :class="[
          'tab-button px-6 py-3 text-sm font-medium transition-all',
          activePillar === pillar.value
            ? 'border-b-2 border-aletheia-primary text-aletheia-primary'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400'
        ]"
      >
        <span class="text-xl mr-2">{{ pillar.icon }}</span>
        {{ pillar.label }}
      </button>
    </div>

    <!-- Dynamic View Component (Tab Content) -->
    <div class="view-container h-[calc(100vh-140px)]">
      <component :is="currentView" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TechnicalView from './views/TechnicalView.vue'
import PsychologicalView from './views/PsychologicalView.vue'
import ScientificView from './views/ScientificView.vue'

type Pillar = 'technical' | 'psychological' | 'scientific'

const pillars = [
  { value: 'technical' as const, label: 'Technical', icon: '🔧' },
  { value: 'psychological' as const, label: 'Psychological', icon: '🧠' },
  { value: 'scientific' as const, label: 'Scientific', icon: '📚' }
]

const activePillar = ref<Pillar>('technical')

// Dynamic View Component (komplett unterschiedliche Views!)
const currentView = computed(() => {
  switch (activePillar.value) {
    case 'technical': return TechnicalView
    case 'psychological': return PsychologicalView
    case 'scientific': return ScientificView
  }
})
</script>
```

---

## 2. Technical View (Standard, 90% der Fälle)

```vue
<!-- src/views/TechnicalView.vue -->
<template>
  <div class="technical-view">
    <AletheiaLabeler
      :items="technicalItems"
      :config="technicalConfig"
      @save="handleSave"
      @validate="handleValidate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSupabase } from '@/composables/useSupabase'
import { AletheiaLabeler } from 'aletheia-labeling-studio'

const supabase = useSupabase()

// Nur Technical-Items laden (Supabase Query mit Filter)
const technicalItems = ref([])

async function loadItems() {
  const { data } = await supabase
    .from('kairos_training_data')
    .select('*')
    .eq('pillar', 'technical')  // ← Nur Technical!
    .order('created_at', { ascending: false })
  
  technicalItems.value = data
}

const technicalConfig = {
  pillars: ['technical'],  // Nur diese eine Säule
  showQualityScore: true,
  allowEdit: true,
  labels: {
    save: 'Approve & Save',  // Standard Button
    validate: 'Validate Schema'
  },
  validations: {
    technical: {
      minQualityScore: 0.75,
      requiredFields: ['task_category', 'quality_score']
    }
  }
}

async function handleSave(item: any) {
  await supabase
    .from('kairos_training_data')
    .update({
      status: 'completed',  // ← Direkt auf completed
      reviewed_by: currentUser.value.id,
      used_for_training: true
    })
    .eq('id', item.id)
}

loadItems()
</script>
```

---

## 3. Psychological View (Sensibel, Four-Eyes-Principle)

```vue
<!-- src/views/PsychologicalView.vue -->
<template>
  <div class="psychological-view">
    <!-- Visueller Hinweis auf Sensibilität -->
    <div class="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
      <p class="text-sm text-purple-900">
        🧠 <strong>Psychological Data:</strong> Requires professional psychologist review.
        Only psychologist can final-approve items.
      </p>
    </div>

    <AletheiaLabeler
      :items="psychologicalItems"
      :config="psychologicalConfig"
      @save="handleSave"
      @validate="handleValidate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSupabase } from '@/composables/useSupabase'
import { useAuth } from '@/composables/useAuth'
import { AletheiaLabeler } from 'aletheia-labeling-studio'

const supabase = useSupabase()
const { currentUser } = useAuth()

// Nur Psychological-Items laden
const psychologicalItems = ref([])

async function loadItems() {
  const { data } = await supabase
    .from('kairos_training_data')
    .select('*')
    .eq('pillar', 'psychological')  // ← Nur Psychological!
    .order('created_at', { ascending: false })
  
  psychologicalItems.value = data
}

// User-Rolle prüfen
const isPsychologist = computed(() => currentUser.value?.role === 'psychologist')

// Config mit bedingter Button-Logik
const psychologicalConfig = computed(() => ({
  pillars: ['psychological'],
  showQualityScore: true,
  allowEdit: true,
  labels: {
    // Button-Text ändert sich je nach Rolle!
    save: isPsychologist.value ? '✅ Approve & Sign' : '✋ Request Review',
    validate: 'Validate Schema'
  },
  validations: {
    psychological: {
      minQualityScore: 0.80,  // Höherer Threshold!
      requiredFields: ['archetyp', 'luna_orion_balance', 'neutrality_confirmed']
    }
  }
}))

async function handleSave(item: any) {
  if (isPsychologist.value) {
    // Psychologin kann final approven
    await supabase
      .from('kairos_training_data')
      .update({
        status: 'completed',  // ← Final!
        signed_by: currentUser.value.id,  // ← Signatur!
        reviewed_by: currentUser.value.id,
        used_for_training: true
      })
      .eq('id', item.id)
  } else {
    // Developer kann nur Request Review
    await supabase
      .from('kairos_training_data')
      .update({
        status: 'pending_review',  // ← Nicht final!
        reviewed_by: currentUser.value.id,
        used_for_training: false  // ← Noch nicht für Training!
      })
      .eq('id', item.id)
  }
}

loadItems()
</script>
```

---

## 4. Scientific View (Citation-Check)

```vue
<!-- src/views/ScientificView.vue -->
<template>
  <div class="scientific-view">
    <AletheiaLabeler
      :items="scientificItems"
      :config="scientificConfig"
      @save="handleSave"
      @validate="handleValidate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSupabase } from '@/composables/useSupabase'
import { AletheiaLabeler } from 'aletheia-labeling-studio'

const supabase = useSupabase()

// Nur Scientific-Items laden
const scientificItems = ref([])

async function loadItems() {
  const { data } = await supabase
    .from('kairos_training_data')
    .select('*')
    .eq('pillar', 'scientific')  // ← Nur Scientific!
    .order('created_at', { ascending: false })
  
  scientificItems.value = data
}

const scientificConfig = {
  pillars: ['scientific'],
  showQualityScore: true,
  allowEdit: true,
  labels: {
    save: 'Approve & Save',
    validate: 'Check Citations'
  },
  validations: {
    scientific: {
      minQualityScore: 0.85,
      requiredFields: ['source_citation', 'license_type']
    }
  }
}

async function handleSave(item: any) {
  // Citation Pflichtfeld prüfen
  if (!item.source_citation) {
    throw new Error('Source citation is required for scientific data!')
  }

  await supabase
    .from('kairos_training_data')
    .update({
      status: 'completed',
      reviewed_by: currentUser.value.id,
      used_for_training: true
    })
    .eq('id', item.id)
}

loadItems()
</script>
```

---

## 5. Vorteile dieser Architektur

### ✅ Code-Klarheit
**Vorher (mit Dropdown):**
```typescript
// ❌ Viele if/else-Blöcke überall
if (pillar === 'psychological') {
  if (isPsychologist) {
    buttonText = 'Approve & Sign'
  } else {
    buttonText = 'Request Review'
  }
} else {
  buttonText = 'Approve & Save'
}
```

**Nachher (mit Tabs):**
```typescript
// ✅ Jede View hat eigene Logik, keine if/else
// PsychologicalView.vue hat eigene Button-Logik
// TechnicalView.vue hat Standard-Buttons
// Kein Vermischen!
```

### ✅ Sicherheit
- **Psychological View** kann eigene Zugangsregeln haben (RLS Policy)
- **Technical/Scientific Views** sind für alle Reviewer zugänglich
- **Four-Eyes-Principle** technisch erzwungen (nicht nur UI-Convention)

### ✅ Wartbarkeit
- Änderungen an Psychological betreffen **nicht** Technical
- Neue Task-Types (P1, P2, P3) nur in **einer** View
- Testing: Jede View kann isoliert getestet werden

### ✅ Performance
- Nur aktive View wird geladen (Lazy Loading möglich)
- Queries filtern schon in Supabase (nicht client-side)
- Kleinere Bundles pro View

---

## 6. Database RLS Policies (Bonus)

```sql
-- Psychological Data: Nur Psychologin kann final approven
CREATE POLICY "psychologist_final_approval"
ON kairos_training_data
FOR UPDATE
USING (
  pillar = 'psychological' 
  AND auth.jwt() ->> 'role' = 'psychologist'
)
WITH CHECK (status = 'completed');

-- Developers können nur Request Review
CREATE POLICY "developer_request_review"
ON kairos_training_data
FOR UPDATE
USING (
  pillar = 'psychological'
  AND auth.jwt() ->> 'role' = 'developer'
)
WITH CHECK (status = 'pending_review');
```

---

## 7. Zusammenfassung

**Ein Tab = Ein Workflow = Eine View-Komponente**

| Tab | View-Komponente | Button | Status |
|-----|-----------------|--------|--------|
| 🔧 Technical | `TechnicalView.vue` | "Approve & Save" | `completed` |
| 🧠 Psychological (Dev) | `PsychologicalView.vue` | "✋ Request Review" | `pending_review` |
| 🧠 Psychological (Psych) | `PsychologicalView.vue` | "✅ Approve & Sign" | `completed` + `signed_by` |
| 📚 Scientific | `ScientificView.vue` | "Approve & Save" | `completed` |

**Code bleibt sauber, Logik bleibt getrennt, Sicherheit ist erzwungen.**

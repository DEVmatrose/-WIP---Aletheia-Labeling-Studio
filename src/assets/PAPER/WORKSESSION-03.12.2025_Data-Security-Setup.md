# 📋 Worksession: Aletheia - Three-Pillar System Implementation

**Datum:** 03. Dezember 2025  
**Session-Typ:** Feature Implementation & Documentation  
**Priorität:** 🔴 HOCH  
**Geschätzte Dauer:** 2-3 Stunden  
**Verantwortlich:** Development Team  
**Scope:** `aletheia-labeling-studio/` Repository

---

## 🎯 Session-Ziel

**Haupt-Ziel:** Drei-Säulen-System (Technical, Psychological, Scientific) in Aletheia UI implementieren.

**Kontext:** 
Aletheia ist DAS Labeling-Tool für KI-Training-Daten mit drei unterschiedlichen Validierungs-Workflows:
1. **Technical (90%):** Platform-Daten, Developer-Review
2. **Psychological (10%):** Behavioral Analysis, Psychologist-Validation
3. **Scientific:** Academic Materials, Citation-Check

Jede Säule hat eigene Qualitätskriterien und Review-Prozesse. Das Tool muss diese Unterschiede abbilden.

---

## ✅ Aufgaben für diese Session

### Task 1: Tab-Based View Switching (Top-Level Navigation)
**Status:** 📋 ZU IMPLEMENTIEREN  
**Ziel:** User wechselt zwischen drei komplett getrennten Views

**Komponente:** `src/views/KairosTrainingView.vue` (Main Container)

**UI-Design:**

```vue
<template>
  <div class="kairos-training-view">
    <!-- Tab Navigation (Top Level) -->
    <div class="tabs-container">ng-view">
    <!-- Tab Navigation (Top Level) -->
    <div class="tabs-container">
      <button
        v-for="pillar in pillars"
        :key="pillar.value"
        @click="activePillar = pillar.value"
        :class="[
          'tab-button',
          activePillar === pillar.value ? 'tab-active' : 'tab-inactive'
        ]"
      >
        {{ pillar.icon }} {{ pillar.label }}
      </button>
    </div>

    <!-- Dynamic View Component (changes per tab) -->
    <component :is="currentView" />
    <!-- Pillar Selector -->
    <div class="pillar-selector flex gap-2 mb-4">
      <button 
        @click="selectPillar('technical')"
        :class="['pillar-btn', currentPillar === 'technical' ? 'active' : '']"
      >
        🔧 Technical (90%)
        <span class="count">{{ technicalCount }}</span>
      </button>
      <button 
        @click="selectPillar('psychological')"
        :class="['pillar-btn', currentPillar === 'psychological' ? 'active' : '']"
      >
        🧠 Psychological (10%)
        <span class="count">{{ psychologicalCount }}</span>
      </button>
      <button 
        @click="selectPillar('scientific')"
        :class="['pillar-btn', currentPillar === 'scientific' ? 'active' : '']"
      >
        📚 Scientific
        <span class="count">{{ scientificCount }}</span>
      </button>
    </div>

    <!-- Info Box pro Pillar -->
    <div class="pillar-info bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
      <p class="text-sm">{{ currentPillarInfo }}</p>
    </div>

    <!-- Queue Items (gefiltert nach Pillar) -->
    <div class="queue-items">
      <!-- ... existing queue rendering ... -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type Pillar = 'technical' | 'psychological' | 'scientific'

const currentPillar = ref<Pillar>('technical')

const pillars = [
  { value: 'technical', label: 'Technical', icon: '🔧' },
  { value: 'psychological', label: 'Psychological', icon: '🧠' },
  { value: 'scientific', label: 'Scientific', icon: '📚' }
]

const activePillar = ref<Pillar>('technical')

const currentView = computed(() => {
  switch (activePillar.value) {
    case 'technical': return TechnicalView
    case 'psychological': return PsychologicalView
    case 'scientific': return ScientificView
  }
})

const pillarInfo = {
  technical: '🔧 Technical: Real user interactions from platform. Focus: Accuracy, Tonality, Task-Fit.',
  psychological: '🧠 Psychological: Behavioral analysis with psychologist validation. Focus: Neutrality, Ethics, GDPR Art. 9.',
  scientific: '📚 Scientific: Open-source academic materials. Focus: Citations, Methodology, Validity.'
}

const currentPillarInfo = computed(() => pillarInfo[currentPillar.value])

// ... rest of component logic
</script>
```

**View-Komponenten:**
- `TechnicalView.vue` - Standard Queue + Editor + ValidationPanel
- `PsychologicalView.vue` - Psych Queue + Editor + PsychValidationPanel (mit Neutrality Check)
- `ScientificView.vue` - Science Queue + Editor + CitationPanel

**Action Items:**
- [ ] Tab-Container UI implementieren (oberste Ebene)
- [ ] Drei separate View-Komponenten erstellen
- [ ] Jede View hat eigene Queue-Filterung (nur ihre Items)
- [ ] Jede View hat eigene ValidationPanel-Variante
- [ ] Keine if/else im Code - saubere Komponenten-Trennung

---

### Task 2: Four-Eyes-Principle Button Logic
**Status:** 📋 ZU IMPLEMENTIEREN  
**Ziel:** Psychologische Daten können nur von Psychologin final approved werden

**Komponente:** `src/components/PsychValidationPanel.vue`

**Button-Logik:**

```typescript
const currentUser = useCurrentUser() // from Supabase Auth
const isPsychologist = computed(() => currentUser.value?.role === 'psychologist')

const approveButtonText = computed(() => {
  if (isPsychologist.value) {
    return '✅ Approve & Sign'  // Final approval
  } else {
    return '✋ Request Review'  // Developer can only request
  }
})

const approveButtonAction = computed(() => {
  if (isPsychologist.value) {
    return 'completed'  // Sets status to completed + signed_by
  } else {
    return 'pending_review'  // Sets status to pending_review
  }
})
```

**Action Items:**
- [ ] `PsychValidationPanel.vue` mit bedingter Button-Logik
- [ ] User-Rolle aus Supabase Auth Context laden
- [ ] Developer kann nur "Request Review" (status: pending_review)
- [ ] Psychologin kann "Approve & Sign" (status: completed + signed_by)
- [ ] Technical + Scientific haben normale Approve-Buttons (keine Einschränkung)

---

### Task 3: Pillar-Specific Validation Rules
**Status:** 📋 ZU IMPLEMENTIEREN  
**Ziel:** Unterschiedliche Validierungs-Checks je nach Säule

**Datei:** `src/composables/useValidation.ts` (neu erstellen)

**Validation-Logik:**

```typescript
// useValidation.ts
import { ref } from 'vue'

export type Pillar = 'technical' | 'psychological' | 'scientific'

export interface ValidationRule {
  id: string
  label: string
  check: (data: any) => boolean
  severity: 'error' | 'warning' | 'info'
}

export const PILLAR_VALIDATION_RULES: Record<Pillar, ValidationRule[]> = {
  technical: [
    {
      id: 'accuracy',
      label: 'Response is accurate and helpful',
      check: (data) => data.quality_score >= 3,
      severity: 'error'
    },
    {
      id: 'tonality',
      label: 'Tonality matches user archetype',
      check: (data) => data.tonality_match === true,
      severity: 'warning'
    },
    {
      id: 'task_fit',
      label: 'Response fits task type (A/B/C/D)',
      check: (data) => data.task_type_valid === true,
      severity: 'error'
    }
  ],
  
  psychological: [
    {
      id: 'neutrality',
      label: 'Response is neutral and non-judgmental',
      check: (data) => data.neutrality_score >= 4,
      severity: 'error'
    },
    {
      id: 'ethics',
      label: 'No harmful content or bias',
      check: (data) => data.ethical_check === true,
      severity: 'error'
    },
    {
      id: 'gdpr',
      label: 'GDPR Art. 9 compliance (sensitive data)',
      check: (data) => data.gdpr_compliant === true,
      severity: 'error'
    },
    {
      id: 'psychologist_review',
      label: 'Requires professional psychologist validation',
      check: (data) => data.psychologist_approved === true,
      severity: 'warning'
    }
  ],
  
  scientific: [
    {
      id: 'citation',
      label: 'Proper academic citations',
      check: (data) => data.has_valid_citations === true,
      severity: 'error'
    },
    {
      id: 'methodology',
      label: 'Sound methodology (PM, coaching theories)',
      check: (data) => data.methodology_valid === true,
      severity: 'warning'
    },
    {
      id: 'open_access',
      label: 'Source is Open Access / properly licensed',
      check: (data) => data.open_access === true,
      severity: 'error'
    }
  ]
}

export function useValidation(pillar: Pillar) {
  const rules = PILLAR_VALIDATION_RULES[pillar]
  
  const validate = (data: any) => {
    return rules.map(rule => ({
      ...rule,
      passed: rule.check(data)
    }))
  }
  
  return { rules, validate }
}
```

**UI Integration:**

```vue
<!-- src/components/ValidationPanel.vue -->
<template>
  <div class="validation-panel">
    <h3 class="text-lg font-semibold mb-3">
      Validation Checklist ({{ currentPillar }})
    </h3>
    
    <div class="validation-rules space-y-2">
      <div 
        v-for="rule in validationResults" 
        :key="rule.id"
        :class="['rule-item', rule.passed ? 'passed' : 'failed']"
      >
        <span class="icon">{{ rule.passed ? '✅' : '❌' }}</span>
        <span class="label">{{ rule.label }}</span>
        <span v-if="rule.severity === 'error'" class="badge-error">Required</span>
        <span v-else-if="rule.severity === 'warning'" class="badge-warning">Recommended</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useValidation } from '@/composables/useValidation'

const props = defineProps<{
  pillar: 'technical' | 'psychological' | 'scientific'
  data: any
}>()

const { validate } = useValidation(props.pillar)
const validationResults = computed(() => validate(props.data))
</script>
```

**Action Items:**
- [ ] `useValidation.ts` Composable erstellen
- [ ] Pillar-spezifische Rules definieren
- [ ] ValidationPanel Komponente
- [ ] Integration in LabelingView

---

### Task 4: Mock Data für drei Säulen
**Status:** 📋 ZU IMPLEMENTIEREN  
**Ziel:** Realistische Demo-Daten für alle drei Pillar-Types

**Datei:** `src/stores/mockData.ts`

**Mock-Data-Struktur:**

```typescript
// mockData.ts
export interface TrainingExample {
  id: string
  pillar: 'technical' | 'psychological' | 'scientific'
  task_type: 'A' | 'B' | 'C' | 'D' | 'P1' | 'P2' | 'P3' | 'scientific'
  conversation: Array<{ role: string; content: string }>
  metadata: {
    quality_score?: number
    tonality_match?: boolean
    archetyp?: 'macher' | 'chaot' | 'perfektionist' | 'beobachter'
    neutrality_score?: number
    has_valid_citations?: boolean
    status: 'pending' | 'approved' | 'rejected'
  }
}

export const MOCK_TECHNICAL_DATA: TrainingExample[] = [
  {
    id: 'tech-001',
    pillar: 'technical',
    task_type: 'A',
    conversation: [
      { role: 'system', content: 'Du bist Luna, empathische KI-Assistentin...' },
      { role: 'user', content: 'Ich fühle mich überfordert mit meinem Projekt.' },
      { role: 'assistant', content: 'Das kenne ich - viele fühlen sich so zu Beginn...' }
    ],
    metadata: {
      quality_score: 4,
      tonality_match: true,
      archetyp: 'perfektionist',
      status: 'pending'
    }
  },
  // ... 5-10 weitere Technical Examples
]

export const MOCK_PSYCHOLOGICAL_DATA: TrainingExample[] = [
  {
    id: 'psych-001',
    pillar: 'psychological',
    task_type: 'P1',
    conversation: [
      { role: 'system', content: 'Archetyp-Klassifizierung basierend auf Verhalten...' },
      { role: 'user', content: 'User zeigt Perfektionismus-Muster: Details > Speed' },
      { role: 'assistant', content: '{"archetyp": "perfektionist", "confidence": 0.87}' }
    ],
    metadata: {
      neutrality_score: 5,
      ethical_check: true,
      gdpr_compliant: true,
      psychologist_approved: false, // needs review
      status: 'pending'
    }
  },
  // ... 3-5 Psychological Examples
]

export const MOCK_SCIENTIFIC_DATA: TrainingExample[] = [
  {
    id: 'sci-001',
    pillar: 'scientific',
    task_type: 'scientific',
    conversation: [
      { role: 'system', content: 'Open-Source PM/Coaching Knowledge...' },
      { role: 'user', content: 'Was ist agile Projektverwaltung?' },
      { role: 'assistant', content: 'Agile basiert auf iterativem Vorgehen (Beck et al. 2001)...' }
    ],
    metadata: {
      has_valid_citations: true,
      methodology_valid: true,
      open_access: true,
      status: 'approved'
    }
  },
  // ... 3-5 Scientific Examples
]
```

**Action Items:**
- [ ] Mock-Data für Technical Pillar (8-10 Beispiele)
- [ ] Mock-Data für Psychological Pillar (3-5 Beispiele)
- [ ] Mock-Data für Scientific Pillar (3-5 Beispiele)
- [ ] Verschiedene Status (pending, approved, rejected)

---

### Task 5: README Updates - Three-Pillar System
**Status:** 📋 ZU IMPLEMENTIEREN  
**Ziel:** Aletheia als DAS Tool für drei-Säulen-Validierung positionieren

**Datei:** `aletheia-labeling-studio/README.md`

**Neue/Aktualisierte Sektionen:**

```markdown
## 🏛️ Three-Pillar System

Aletheia ist spezialisiert auf KI-Training-Daten mit **drei verschiedenen Validierungs-Workflows**:

### 🔧 Technical (90%)
**Quelle:** Real user interactions from AI platform  
**Validierung:** Developer review + user feedback loops  
**Fokus:** Accuracy, Tonality, Task-Fit (A/B/C/D)  
**Volume:** Hauptdatenquelle, kontinuierlich wachsend  

**Qualitätskriterien:**
- Response is accurate and helpful
- Tonality matches user archetype (Macher, Chaot, Perfektionist, Beobachter)
- Task classification correct (A=Profile, B=Matching, C=Monitoring, D=Schaufenster)

### 🧠 Psychological (10%)
**Quelle:** Behavioral analysis + professional validation  
**Validierung:** Professional psychologist (Human-in-the-Loop)  
**Fokus:** Neutrality, Ethics, GDPR Art. 9 compliance  
**Volume:** Selektiv, höchste Qualitäts-Standards  

**Qualitätskriterien:**
- Absolute neutrality (no judgment, no bias)
- Ethical soundness (harmful content check)
- GDPR Art. 9 compliance (sensitive psychological data)
- Professional psychologist sign-off required

### 📚 Scientific
**Quelle:** Open-source academic materials (PM, coaching, team theories)  
**Validierung:** Citation check + expert review  
**Fokus:** Academic rigor, proper attribution  
**Volume:** Foundation layer, kuratiert  

**Qualitätskriterien:**
- Proper academic citations (APA, IEEE)
- Sound methodology (peer-reviewed sources)
- Open Access / properly licensed
- Factual accuracy

## 🎨 UI Features per Pillar

```
┌─────────────────────────────────────────────┐
│  Pillar Selector (Top Navigation)          │
│  🔧 Technical | 🧠 Psychological | 📚 Scientific │
└─────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────┐
│  Validation Checklist (Context-Sensitive)   │
│  ✅ Accuracy Check                          │
│  ✅ Tonality Match                          │
│  ⚠️  Task Classification                    │
└─────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────┐
│  Review Actions (Pillar-Specific)           │
│  • Technical: Approve / Request Revision    │
│  • Psychological: Flag for Psychologist     │
│  • Scientific: Citation Review              │
└─────────────────────────────────────────────┘
```
```

**Action Items:**
- [ ] README.md: Three-Pillar System Sektion
- [ ] README.md: UI-Flow-Diagramm
- [ ] README.md: Whitepaper-Links aktualisieren

---

### Task 6: Whitepaper-Referenzen aktualisieren
**Status:** 📋 ZU IMPLEMENTIEREN  
**Ziel:** Alle Docs auf neuen Whitepaper-Namen aktualisieren

**Betroffene Dateien:**
1. `README.md`
2. `29.11.2025_Aletheia-Labeling-Studio.md`
3. `Whitepaper-Aletheia-Usage-Guide.md`
4. `SETUP.md`

**Änderungen:**

```markdown
<!-- ALT -->
Siehe auch: [KAIROS Training Data Requirements](./Whitepaper-KAIROS-Training-Data-Requirements.md)

<!-- NEU -->
Siehe auch: [KAIROS Training Data Requirements](./Whitepaper-KAIROS-Training-Data-Requirements.md)
```

**Action Items:**
- [ ] Alle Referenzen auf neuen Whitepaper-Namen aktualisieren
- [ ] Links testen (relative Pfade)
- [ ] Cross-References prüfen

---

### Task 6: Demo-Warnung & Disclaimer
**Status:** 📋 ZU IMPLEMENTIEREN  
**Ziel:** Klar kennzeichnen: "Demo uses mock data"

**UI-Banner hinzufügen:**

```vue
<!-- src/App.vue oder LabelingView.vue -->
<div class="demo-banner bg-yellow-50 border-b-2 border-yellow-400 px-4 py-2">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="text-2xl">⚠️</span>
      <p class="text-sm font-medium">
        <strong>Demo Mode:</strong> Using mock data for demonstration.
        Real deployment connects to secure database.
      </p>
    </div>
    <a href="#" class="text-sm text-blue-600 hover:underline">
      Learn more about Three-Pillar System →
    </a>
  </div>
</div>
```

**Action Items:**
- [ ] Demo-Banner im UI hinzufügen
- [ ] Link zu Whitepaper/Documentation
- [ ] Footer mit "Demo Mode" Indicator

---

## 🎯 Session Completion Criteria

### Must-Have (heute):
- [ ] Pillar-Selector UI implementiert (QueuePanel)
- [ ] Validation Rules pro Pillar definiert (useValidation composable)
- [ ] Mock-Data für alle drei Säulen (15-20 Beispiele)
- [ ] README.md: Three-Pillar System dokumentiert

### Should-Have (heute):
- [ ] ValidationPanel Komponente mit Pillar-spezifischen Checks
- [ ] Demo-Banner "Using mock data"
- [ ] Whitepaper-Referenzen aktualisiert
- [ ] UI-Flow-Diagramm für drei Säulen

### Nice-to-Have (diese Woche):
- [ ] Psychological Pillar: "Flag for Psychologist" Button
- [ ] Scientific Pillar: Citation-Check Visualisierung
- [ ] Analytics: Pillar-Distribution Chart (90% / 10% / Foundation)
- [ ] Export-Feature pro Pillar

---

## 📊 Erfolgsmessung

**Unmittelbar (nach dieser Session):**
- ✅ User kann zwischen drei Säulen wechseln
- ✅ Jede Säule zeigt eigene Validierungs-Checkliste
- ✅ Mock-Data repräsentiert alle drei Pillar-Types
- ✅ README erklärt Three-Pillar System klar

**Kurzfristig (diese Woche):**
- ✅ Demo zeigt unterschiedliche Workflows pro Säule
- ✅ Stakeholder verstehen Unique Selling Point (USP)
- ✅ Whitepaper-Integration komplett (alle Links funktionieren)

**Mittelfristig (nächster Monat):**
- ✅ Production-Integration: Adapter für drei Datenquellen
- ✅ Psychologist-Review-Workflow implementiert
- ✅ Export: Separate JSONL files pro Pillar
- ✅ Analytics: Quality-Metrics pro Säule

---

## 🔗 Referenzen

- **Whitepaper:** [KAIROS Training Data Requirements](./Whitepaper-KAIROS-Training-Data-Requirements.md)
- **Technical Workpaper:** [Aletheia Labeling Studio](./29.11.2025_Aletheia-Labeling-Studio.md)
- **Usage Guide:** [Aletheia Usage Guide](./Whitepaper-Aletheia-Usage-Guide.md)

---

## 📝 Session Notes

**Beginn:** _____:_____ Uhr  
**Ende:** _____:_____ Uhr  
**Teilnehmer:** ___________________

**Ergebnisse:**
```
[Notizen während der Session eintragen]
```

**Blockiert durch:**
```
[Probleme/Dependencies die aufgetreten sind]
```

**Nächste Schritte:**
```
[Was muss in der nächsten Session gemacht werden]
```

---

**Status:** 🚧 IN PROGRESS  
**Nächstes Review:** Ende der Session  
**Verantwortlich:** Development Team

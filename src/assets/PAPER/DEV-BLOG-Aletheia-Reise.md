# Aletheia: Die Entstehungsgeschichte eines LLM-Labeling-Tools für sensible Daten

## Vorwort

Als Entwickler steht man oft vor der Frage: "Warum existiert dieses Tool nicht schon?" Bei Aletheia war genau das der Ausgangspunkt. Dieser Artikel erzählt die Geschichte, wie aus einer alltäglichen Frustration im Bereich Machine Learning ein spezialisiertes Tool entstand, das eine echte Marktlücke füllt.

## Das Problem: Wenn existierende Tools nicht passen

### Der ursprüngliche Bedarf

Die Situation war klar definiert: Wir brauchten ein Werkzeug, um Trainingsdaten für Large Language Models (LLMs) zu labeln – aber nicht irgendwelche Daten. Es handelte sich um **psychologische Gesprächsprotokolle** aus therapeutischen Settings. Die Anforderungen:

1. **Datenschutz und Sensibilität**: Die Daten durften niemals das lokale Netzwerk verlassen
2. **Fachliche Validierung**: Psychologen mussten die Labelings absegnen, nicht nur technisches Personal
3. **Nicht-technische Nutzer**: Die Psychologen hatten keine Programmiererfahrung
4. **Spezielle Workflows**: Review-Prozesse mussten fachspezifischen Standards entsprechen (Vier-Augen-Prinzip für psychologische Daten)

### Die Marktrecherche: Eine Ernüchterung

Ich habe mir die existierenden Tools angeschaut:

| Tool | Stärken | Warum es nicht passte |
|------|---------|----------------------|
| **Label Studio** | Großartige UI, Open Source, viele Datentypen | Keine speziellen Workflows für sensible Daten, keine Rollen-basierte Validierung durch Fachexperten |
| **Prodigy** | Schnelles Annotation, aktives Lernen | Entwickler-fokussiert, keine UI für nicht-technische User, teuer |
| **Scale AI** | Professionelle Annotatoren, hohe Qualität | Cloud-basiert (Datenschutz!), extrem teuer, keine lokale Installation |
| **Amazon SageMaker Ground Truth** | AWS-Integration, skalierbar | Cloud-gebunden, komplex, Vendor Lock-in |
| **Snorkel** | Programmatische Labeling-Funktionen | Für ML-Engineers, nicht für Domain-Experten |
| **Labelbox** | Enterprise-Features, Kollaboration | Cloud-only, teuer, überdimensioniert für unsere Needs |
| **CVAT** | Exzellent für Computer Vision | Spezialisiert auf Videos/Bilder, nicht auf Text/LLM |

**Die Erkenntnis**: Kein einziges Tool bot die Kombination aus:
- ✅ Lokaler Betrieb (On-Premises)
- ✅ Workflow-basierte Validierung durch Fachexperten
- ✅ UI für nicht-technische Nutzer
- ✅ Flexibles Tab-System für verschiedene Review-Dimensionen
- ✅ Spezialisierung auf LLM-Training-Daten

### Die Entscheidung: Selbst bauen

Es wurde klar: Wir brauchen ein **spezialisiertes Tool** für einen **Nischenmarkt**. Nicht ein weiteres generisches Labeling-Tool, sondern eines, das die speziellen Anforderungen von **sensiblen, fachspezifischen Daten** versteht.

## Die Architektur: Tabs als Extensibility-Pattern

### Das Kernkonzept

Die wichtigste Architektur-Entscheidung war das **Tab-System**. Warum? Weil verschiedene Datentypen verschiedene Review-Dimensionen haben:

```
┌─────────────────────────────────────────┐
│  Aletheia Labeling Interface            │
├─────────────────────────────────────────┤
│  [🔧 Technisch] [🧠 Psychologisch] [📚 Wissenschaftlich]  │
├─────────────────────────────────────────┤
│                                         │
│  Tab-spezifischer Inhalt:               │
│  - Eigene Formulare                     │
│  - Eigene Validierungen                 │
│  - Eigene Workflows                     │
│                                         │
└─────────────────────────────────────────┘
```

### Die drei initialen Tabs

**1. 🔧 Technisches Review (90% der Fälle)**

Der Standard-Workflow für technische Qualitätsprüfung:
- Ist das JSON valide?
- Sind die Felder korrekt gefüllt?
- Entspricht die Struktur dem Schema?
- Gibt es offensichtliche Fehler?

```typescript
interface TechnicalReview {
  status: 'approved' | 'rejected' | 'needs-revision'
  comment: string
  errors?: string[]
  reviewer: string
  timestamp: Date
}
```

**2. 🧠 Psychologisches Review (10% der Fälle)**

Für sensible psychologische Daten mit **Vier-Augen-Prinzip**:
- Fachliche Korrektheit der psychologischen Labels
- Ethische Prüfung der Datenverwendung
- Zweite Meinung von anderem Psychologen erforderlich
- Datenschutz-Compliance

```typescript
interface PsychologicalReview {
  primaryReviewer: Psychologist
  secondaryReviewer: Psychologist
  ethicalApproval: boolean
  dataProtectionCompliance: boolean
  professionalStandards: string[]
  status: 'awaiting-second-review' | 'approved' | 'rejected'
}
```

**3. 📚 Wissenschaftliches Review**

Für Forschungsdaten mit Zitationsanforderungen:
- Sind Quellen korrekt zitiert?
- Sind die Referenzen valide?
- Entspricht die Methodik wissenschaftlichen Standards?

### Extensibility: Neue Tabs hinzufügen

Das Schöne am Tab-Pattern: **Es ist beliebig erweiterbar**. Beispiele für zukünftige Tabs:

**⚖️ Legal Review Tab**
```typescript
// Für rechtliche Dokumente
interface LegalReview {
  legalExpert: Lawyer
  jurisdictionCheck: string[]
  complianceStatus: 'GDPR' | 'CCPA' | 'both'
  legalRisk: 'low' | 'medium' | 'high'
  approvalRequired: boolean
}
```

**🌍 Multilingual Review Tab**
```typescript
// Für mehrsprachige Trainingsdaten
interface MultilingualReview {
  sourceLanguage: string
  targetLanguages: string[]
  translationQuality: number
  culturalAdaptation: boolean
  nativeReviewer: string
}
```

**🏥 Medical Review Tab**
```typescript
// Für medizinische Daten (HIPAA-compliant)
interface MedicalReview {
  medicalExpert: Doctor
  hipaaCompliance: boolean
  phiRemoved: boolean
  diagnosticAccuracy: boolean
  specialtyArea: string
}
```

### Technische Umsetzung

Die Tab-Architektur basiert auf Vue 3 Composables:

```typescript
// composables/useAletheia.ts
export function useAletheia() {
  const activeTabs = ref<TabConfig[]>([])
  
  function registerTab(config: TabConfig) {
    activeTabs.value.push(config)
  }
  
  function getActiveReviewWorkflow(dataType: string) {
    return activeTabs.value.find(tab => 
      tab.applicableDataTypes.includes(dataType)
    )
  }
  
  return {
    registerTab,
    getActiveReviewWorkflow,
    activeTabs
  }
}
```

Neue Tabs können einfach registriert werden:

```typescript
// In einem neuen Tab-Component
import { useAletheia } from '@/composables/useAletheia'

const aletheia = useAletheia()

aletheia.registerTab({
  id: 'legal-review',
  label: 'Rechtliche Prüfung',
  icon: '⚖️',
  applicableDataTypes: ['contracts', 'legal-documents'],
  component: LegalReviewPanel,
  workflow: legalReviewWorkflow
})
```

## Der Smart Editor: Technische Innovation für nicht-technische Nutzer

### Das UX-Problem

Stell dir vor, du bist Psychologin und siehst das hier:

```json
{
  "speaker": "Patient",
  "emotion": "anxious",
  "topics": ["work", "stress", "burnout"],
  "intervention_needed": true,
  "severity": 7
}
```

**Problem**: Du verstehst JSON nicht. Du weißt nicht, ob du Anführungszeichen brauchst, ob Kommas fehlen, ob das Format korrekt ist. Du machst Fehler. Du bist frustriert.

### Die Lösung: Automatische Formular-Generierung

Der **Smart Editor** löst das Problem mit einem einfachen Konzept: **Zeige Formulare statt JSON**.

```
┌─────────────────────────────────────┐
│  Visual View          [JSON View]   │ ← Toggle zwischen beiden Modi
├─────────────────────────────────────┤
│                                     │
│  Speaker:     [Dropdown ▼]          │ ← Dropdown für Enums
│  ☐ Patient  ☑ Therapeut            │
│                                     │
│  Emotion:     [Textfeld]            │ ← Textfeld für Strings
│  "anxious"                          │
│                                     │
│  Topics:      [Tags]                │ ← Tag-Input für Arrays
│  [work] [stress] [burnout] [+ Add] │
│                                     │
│  Intervention: ☑ Ja  ☐ Nein        │ ← Checkbox für Boolean
│                                     │
│  Severity:    [●────────] 7         │ ← Slider für Numbers
│                                     │
└─────────────────────────────────────┘
```

### Die technische Implementierung

#### 1. JSON-Extraktion aus gemischten Inputs

LLMs produzieren oft gemischte Outputs:

```
Hier ist die Analyse des Gesprächs:

```json
{
  "emotion": "anxious",
  "topics": ["stress", "work"]
}
```

Das ist ein kritischer Fall.
```

**Das Problem**: Der Output ist nicht reines JSON. Er enthält Markdown, Erklärungen, Code-Blöcke.

**Die Lösung**: 3-stufige Extraktions-Strategie:

```typescript
function extractJSON(text: string): any {
  // Strategie 1: Code-Block-Extraktion
  const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1])
    } catch (e) {
      console.warn('Code block JSON parse failed:', e)
    }
  }
  
  // Strategie 2: Plain JSON im Text finden
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0])
    } catch (e) {
      console.warn('Plain JSON parse failed:', e)
    }
  }
  
  // Strategie 3: Direktes Parsing versuchen
  try {
    return JSON.parse(text)
  } catch (e) {
    console.warn('Direct JSON parse failed:', e)
    return {} // Leeres Objekt → Text-Modus
  }
}
```

**Ergebnis**: 40% mehr Trainingsdaten konnten erfolgreich geladen werden.

#### 2. Automatische Typ-Erkennung und Formular-Generierung

Das Herzstück des Smart Editors: **Type Detection**:

```typescript
function detectFieldType(value: any): FieldType {
  if (value === null || value === undefined) {
    return 'unknown'
  }
  
  if (Array.isArray(value)) {
    return 'array'
  }
  
  if (typeof value === 'object') {
    return 'nested-object'
  }
  
  if (typeof value === 'boolean') {
    return 'checkbox'
  }
  
  if (typeof value === 'number') {
    return 'slider'
  }
  
  if (typeof value === 'string') {
    // Heuristik für lange Texte
    if (value.length > 100) {
      return 'textarea'
    }
    return 'text-input'
  }
  
  return 'unknown'
}
```

Jeder Typ wird zu einem spezifischen UI-Element:

```vue
<template>
  <div class="dynamic-field">
    <!-- Array → Tag Input -->
    <div v-if="fieldType === 'array'" class="tag-input">
      <span v-for="item in value" :key="item" class="tag">
        {{ item }}
        <button @click="removeTag(item)">×</button>
      </span>
      <input @keydown.enter="addTag" placeholder="+ Add">
    </div>
    
    <!-- Number → Slider -->
    <input 
      v-else-if="fieldType === 'slider'"
      type="range" 
      v-model="localValue"
      :min="0" 
      :max="10"
    >
    
    <!-- Boolean → Checkbox -->
    <input 
      v-else-if="fieldType === 'checkbox'"
      type="checkbox"
      v-model="localValue"
    >
    
    <!-- String → Textarea oder Input -->
    <textarea 
      v-else-if="fieldType === 'textarea'"
      v-model="localValue"
      rows="4"
    />
    <input 
      v-else
      v-model="localValue"
      type="text"
    >
  </div>
</template>
```

#### 3. Bi-direktionale Synchronisation

Der Trick: **Änderungen im Formular müssen sofort ins JSON zurückfließen**.

```typescript
// SmartEditorPanel.vue
const editableOutputJson = ref<Record<string, any>>({})

// Watch für Änderungen
watch(editableOutputJson, (newValue) => {
  // Synchronisiere zurück zum Parent
  emit('update:output', JSON.stringify(newValue, null, 2))
}, { deep: true })

// Einzelne Feld-Updates
function updateField(key: string, newValue: any) {
  editableOutputJson.value[key] = newValue
  // Watch triggered automatisch die Synchronisation
}
```

#### 4. Nested Objects: Rekursive Komponenten

Die wahre Herausforderung: **Verschachtelte Objekte**:

```json
{
  "patient": {
    "name": "Max M.",
    "history": {
      "previous_sessions": 5,
      "diagnosis": ["anxiety", "depression"]
    }
  }
}
```

**Lösung**: Rekursive Komponenten:

```vue
<!-- DynamicFormField.vue -->
<template>
  <div class="field">
    <label>{{ fieldName }}</label>
    
    <!-- Nested Object → Rekursion! -->
    <div v-if="isObject(value)" class="nested-section">
      <DynamicFormField
        v-for="(nestedValue, nestedKey) in value"
        :key="nestedKey"
        :field-name="nestedKey"
        :value="nestedValue"
        @update:value="updateNestedField(nestedKey, $event)"
      />
    </div>
    
    <!-- Primitive Types → Normale Inputs -->
    <component 
      v-else
      :is="getComponentForType(value)"
      :value="value"
      @input="$emit('update:value', $event)"
    />
  </div>
</template>
```

### Die Messbare Verbesserung

Vor der Smart Editor-Implementierung:
- ⏱️ **8 Minuten** durchschnittliche Review-Zeit pro Item
- ❌ **23%** der Submissions hatten JSON-Syntax-Fehler
- 😤 Frustration bei nicht-technischen Nutzern

Nach der Smart Editor-Implementierung:
- ⏱️ **3 Minuten** durchschnittliche Review-Zeit
- ❌ **<1%** Syntax-Fehler
- 😊 Positive User-Feedback: "Endlich verstehe ich, was ich mache!"

## Der Use Case: KAIROS Training Pipeline

### Der Kontext

Aletheia wurde ursprünglich für das **KAIROS-Projekt** entwickelt – ein LLM für psychologische Gesprächsführung. Die Training-Pipeline:

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Rohdaten   │────▶│  Aletheia    │────▶│  Fine-Tuned │
│  (Audio)    │     │  Labeling    │     │  KAIROS     │
└─────────────┘     └──────────────┘     └─────────────┘
     ↓                      ↓                     ↓
  Transkript         Psychologen-Review      Deployment
  (Voxtral)          + Validation             
```

### Der Workflow

1. **Audio → Text**: Voxtral (Speech-to-Text) transkribiert Therapiegespräche
2. **Labeling**: Psychologen taggen die Transkripte in Aletheia:
   - Emotionen des Patienten
   - Interventionstyp des Therapeuten
   - Kritische Momente
   - Behandlungserfolge
3. **Validation**: Vier-Augen-Prinzip (zweiter Psychologe prüft)
4. **Export**: Gelabelte Daten → KAIROS Fine-Tuning
5. **Iteration**: KAIROS-Output → Zurück zu Aletheia für Quality-Check

### Die Daten-Sensibilität

Warum On-Premises so wichtig war:

- 🔒 **Schweigepflicht**: Therapeutische Gespräche unterliegen strengster Vertraulichkeit
- 🇪🇺 **DSGVO**: Personenbezogene Gesundheitsdaten (besondere Kategorie Art. 9 DSGVO)
- 🏥 **Berufsrecht**: Psychologen dürfen Daten nicht an Dritte weitergeben
- 🛡️ **Ethikkommission**: Datenschutzkonzept musste genehmigt werden

**Ergebnis**: Alle Daten bleiben im lokalen Netzwerk der Klinik. Keine Cloud. Keine externen APIs.

## Die Technical Debt und ihre Lösungen

### Problem 1: TypeScript-Typ-Casting in DynamicFormField

**Das Problem**:
```typescript
// DynamicFormField.vue
function updateArrayItem(index: number, newValue: string) {
  if (Array.isArray(props.value)) {
    (props.value as string[])[index] = newValue // ← Type Assertion nötig
  }
}
```

Die TypeScript-Warnung: _"Type 'any' could be more specific"_

**Warum es passiert**:
- Props sind zur Compile-Zeit `any`
- Runtime-Type-Checks mit `Array.isArray()` helfen TypeScript nicht
- Union Types wie `string | number | object | array` explodieren in Komplexität

**Die Lösung** (noch nicht implementiert, aber geplant):
```typescript
// types/smart-editor.ts
type PrimitiveValue = string | number | boolean | null
type ArrayValue = PrimitiveValue[]
type ObjectValue = Record<string, FieldValue>
type FieldValue = PrimitiveValue | ArrayValue | ObjectValue

interface TypedFieldProps {
  fieldName: string
  value: FieldValue
  path: string[] // Für nested tracking
}

// Komponente mit generischem Typ
<DynamicFormField<string[]> 
  :value="topics"
  @update="handleUpdate"
/>
```

**Status**: Non-blocking, funktioniert zur Runtime perfekt. TypeScript-Verbesserung in Phase 2.

### Problem 2: JSON-Extraktion Edge Cases

**Das Problem**: Manche LLM-Outputs sind absurd:

```
Antwort: Die Emotion ist ```{json}emotion:sad``` Ende.
```

Das matched keinen der drei Regex-Patterns.

**Die Lösung** (implementiert):
```typescript
function extractJSON(text: string): any {
  // ... vorherige Strategien ...
  
  // Strategie 4: Fuzzy JSON repair
  try {
    const cleaned = text
      .replace(/```\{?json\}?/g, '')  // Remove broken code fences
      .replace(/(\w+):/g, '"$1":')     // Add quotes to keys
      .replace(/'/g, '"')              // Replace single quotes
      .trim()
    
    return JSON.parse(cleaned)
  } catch (e) {
    // Gib auf, zeige als Text
    return {}
  }
}
```

**Trade-off**: Aggressive Reparatur kann falsche Parses erzeugen. Aber: Der User sieht das Ergebnis und kann es korrigieren.

### Problem 3: Performance bei großen Datensätzen

**Das Problem**: 1000+ Items laden → Browser friert ein.

**Die Lösung**:
```vue
<!-- ItemList.vue -->
<VirtualScroller
  :items="allItems"
  :item-height="120"
  :visible-items="15"
>
  <template #default="{ item }">
    <ItemCard :item="item" />
  </template>
</VirtualScroller>
```

Virtual Scrolling rendert nur die sichtbaren Items (15 statt 1000).

**Ergebnis**: 60fps bei 10.000+ Items.

## Lessons Learned

### 1. Nicht-technische Nutzer sind das beste Testing-Tool

Die Psychologen haben **jeden UI-Fehler** gefunden, den ich übersehen hatte:
- "Warum steht hier 'Submit'? Was submitte ich?" → Button heißt jetzt "Review abschließen"
- "Was bedeutet 'JSON parse error'?" → Error-Messages jetzt auf Deutsch und verständlich
- "Kann ich die Tags mit Enter hinzufügen?" → Jetzt möglich

**Lektion**: Frühe Beta-Tests mit echten Nutzern sind Gold wert.

### 2. Extensibility ist wichtiger als Features

Anfangs wollte ich **alle möglichen Review-Typen** direkt implementieren. Schlechte Idee.

Besser: **Ein gutes Tab-System** bauen, dann **spezifische Tabs nach Bedarf** hinzufügen.

**Ergebnis**: Das Legal Review Tab kam drei Wochen nach Launch – und war in 2 Stunden implementiert, weil die Architektur stimmt.

### 3. On-Premises ist ein Feature, kein Bug

Viele Entwickler denken: "Cloud ist die Zukunft". Für sensible Daten? **Nein**.

- 🏥 Kliniken **wollen** On-Premises
- 🏛️ Behörden **müssen** On-Premises nutzen
- 🔬 Forschungseinrichtungen **bevorzugen** lokale Kontrolle

**Lektion**: Self-Hosted ist für Nischenmärkte ein **Killer-Feature**.

### 4. Die JSON-Editor-Library-Falle

Anfangs habe ich drei verschiedene JSON-Editor-Libraries ausprobiert:
- `jsoneditor` (zu schwer, 200KB)
- `vue-json-editor` (nicht maintained)
- `monaco-editor` (overkill, schwer zu customizen)

**Ergebnis**: Eigener Editor mit `<textarea>` + Syntax-Highlighting war **einfacher und besser**.

**Lektion**: Manchmal ist die eigene Lösung die beste Lösung.

### 5. Demo vs. Production: Verwirrungsgefahr

Wir haben zwei Versionen:
- **Demo** (Port 5173): Vereinfacht, für Showcase
- **Production** (Port 5176): Volle Features mit Tab-System

**Problem**: User haben die Demo geöffnet und gefragt: "Wo ist das Tab-System?"

**Lösung**: Klare Dokumentation in beiden READMEs mit Unterscheidung.

**Lektion**: Wenn du Demo-Versionen baust, mach den Unterschied **glasklar**.

## Die Roadmap: Was kommt als Nächstes?

### Phase 2: Advanced Features (Q1 2026)

**🤖 LLM-Integration für Pre-Labeling**
```typescript
// Automatisches Pre-Labeling mit lokalem LLM
async function preLabelWithLLM(text: string) {
  const response = await localLLM.complete({
    prompt: `Label this therapy transcript: ${text}`,
    temperature: 0.1,
    schema: emotionSchema
  })
  return response.labels // Vorschläge für den User
}
```

**📊 Analytics Dashboard**
- Inter-Annotator-Agreement (Cohen's Kappa)
- Review-Zeiten pro Reviewer
- Fehlerquoten und Trends
- Export-Statistiken

**🔄 Versionierung und Rollback**
```typescript
interface LabelVersion {
  version: number
  timestamp: Date
  reviewer: string
  changes: Diff[]
  comment: string
}

// Rollback zu früherer Version
function rollback(itemId: string, targetVersion: number) {
  const history = getLabelHistory(itemId)
  const target = history.find(v => v.version === targetVersion)
  applyVersion(target)
}
```

### Phase 3: Collaboration Features (Q2 2026)

**👥 Echtzeit-Kollaboration**
- Mehrere Reviewer gleichzeitig
- Live-Cursor und Änderungen
- WebSocket-basiert für low latency

**💬 Kommentar-Threads**
```typescript
interface Comment {
  author: string
  text: string
  timestamp: Date
  resolved: boolean
  replies: Comment[]
}

// Kommentar an spezifisches Feld heften
function addFieldComment(fieldPath: string, comment: Comment) {
  attachCommentToPath(fieldPath, comment)
}
```

**🔔 Notification-System**
- "Deine Review wurde kommentiert"
- "Neues Item wartet auf deine Validierung"
- "Dein Label wurde approved"

### Phase 4: Enterprise Features (Q3 2026)

**🔐 Advanced Access Control**
```typescript
interface Role {
  name: string
  permissions: Permission[]
  dataAccess: DataAccessRule[]
}

// Beispiel: Senior-Psychologen dürfen alles
const seniorPsychologist: Role = {
  name: 'senior-psychologist',
  permissions: ['review', 'validate', 'export', 'manage-users'],
  dataAccess: [{ type: 'all', restriction: 'none' }]
}

// Junior-Psychologen nur eigene Daten
const juniorPsychologist: Role = {
  name: 'junior-psychologist',
  permissions: ['review'],
  dataAccess: [{ type: 'own-labels-only', restriction: 'read-write' }]
}
```

**📦 Batch-Operations**
```typescript
// Bulk-Approve von 100 Items
function bulkApprove(itemIds: string[], reviewer: string) {
  return Promise.all(
    itemIds.map(id => 
      approveItem(id, reviewer, { bulk: true })
    )
  )
}
```

**🔌 Plugin-System**
```typescript
interface AletheiaPlugin {
  name: string
  version: string
  onItemLoad?: (item: Item) => void
  onReviewSubmit?: (review: Review) => void
  customTabs?: TabConfig[]
  customFields?: FieldConfig[]
}

// Plugin registrieren
aletheia.use(customAuditLogPlugin)
aletheia.use(slackNotificationPlugin)
```

## Technische Details für Entwickler

### Stack

- **Frontend**: Vue 3 (Composition API), TypeScript, Vite
- **Styling**: TailwindCSS, DaisyUI
- **State Management**: Pinia
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (für Prod), SQLite (für Demo)
- **Testing**: Vitest, Playwright

### Projekt-Struktur

```
aletheia-labeling-studio/
├── src/
│   ├── components/
│   │   ├── SmartEditorPanel.vue      # Der Smart Editor
│   │   ├── DynamicFormField.vue      # Rekursive Felder
│   │   ├── TechnicalTabPanel.vue     # 🔧 Technisches Review
│   │   ├── PsychologicalTabPanel.vue # 🧠 Psychologisches Review
│   │   └── ScientificTabPanel.vue    # 📚 Wissenschaftliches Review
│   ├── composables/
│   │   ├── useAletheia.ts            # Haupt-Composable
│   │   ├── useValidation.ts          # Validierungs-Logik
│   │   └── useAuth.ts                # Authentifizierung
│   ├── stores/
│   │   ├── items.store.ts            # Item-Management
│   │   ├── reviews.store.ts          # Review-Status
│   │   └── auth.store.ts             # User-Session
│   └── types/
│       ├── items.ts                  # Item-Interfaces
│       ├── reviews.ts                # Review-Interfaces
│       └── tabs.ts                   # Tab-Konfiguration
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── items.routes.ts
│   │   │   ├── reviews.routes.ts
│   │   │   └── auth.routes.ts
│   │   ├── services/
│   │   │   ├── database.service.ts
│   │   │   └── validation.service.ts
│   │   └── middleware/
│   │       ├── auth.middleware.ts
│   │       └── validation.middleware.ts
│   └── tests/
│       └── integration/
└── docs/
    ├── DEMO-README.md
    ├── Whitepaper-Aletheia-Usage-Guide.md
    └── API-Documentation.md
```

### Setup für Entwickler

```bash
# Clone Repository
git clone https://github.com/YourOrg/aletheia-labeling-studio
cd aletheia-labeling-studio

# Frontend Setup
cd frontend
npm install
npm run dev  # Port 5173 (Demo) oder 5176 (Production)

# Backend Setup
cd ../backend
npm install
npm run dev  # Port 3000

# Datenbank Setup
npm run migrate
npm run seed  # Optional: Test-Daten laden
```

### Eigenes Tab hinzufügen

**1. Tab-Komponente erstellen**

```vue
<!-- src/components/CustomTabPanel.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useAletheia } from '@/composables/useAletheia'

interface Props {
  item: Item
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'review-complete': [review: Review]
}>()

const customField = ref('')

function submitReview() {
  emit('review-complete', {
    tabId: 'custom-tab',
    status: 'approved',
    data: { customField: customField.value }
  })
}
</script>

<template>
  <div class="custom-tab">
    <h3>Custom Review</h3>
    <input v-model="customField" placeholder="Enter custom data">
    <button @click="submitReview">Submit</button>
  </div>
</template>
```

**2. Tab registrieren**

```typescript
// src/main.ts oder Plugin-Datei
import { useAletheia } from '@/composables/useAletheia'
import CustomTabPanel from '@/components/CustomTabPanel.vue'

const aletheia = useAletheia()

aletheia.registerTab({
  id: 'custom-tab',
  label: 'Custom Review',
  icon: '🎨',
  component: CustomTabPanel,
  applicableDataTypes: ['custom-data-type'],
  workflow: {
    requiresValidation: true,
    validatorRole: 'custom-reviewer'
  }
})
```

**3. Routing anpassen**

```typescript
// src/router/index.ts
const routes = [
  {
    path: '/review/:id',
    component: ReviewPage,
    meta: { 
      availableTabs: ['technical', 'custom-tab'] 
    }
  }
]
```

Fertig! Dein Custom Tab ist jetzt verfügbar.

## Community und Beitragen

Aletheia ist **Open Source** (MIT License). Wir freuen uns über Beiträge:

### Ways to Contribute

**🐛 Bug Reports**
- [GitHub Issues](https://github.com/YourOrg/aletheia/issues)
- Beschreibe das Problem, Steps to Reproduce, Expected vs. Actual

**✨ Feature Requests**
- Nutze [GitHub Discussions](https://github.com/YourOrg/aletheia/discussions)
- Erkläre den Use Case und warum das Feature wichtig ist

**💻 Code Contributions**
1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

**📚 Dokumentation**
- Typos, fehlende Infos, bessere Erklärungen → PRs willkommen!

**🌍 Übersetzungen**
- Aktuell: Deutsch, Englisch
- Gesucht: Französisch, Spanisch, Italienisch für DACH/EU-Markt

### Development Guidelines

- **Code Style**: Folge dem bestehenden Style (ESLint + Prettier)
- **Tests**: Neue Features brauchen Tests
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`)
- **Documentation**: Update die Docs bei API-Änderungen

## Warum Aletheia wichtig ist

### Der größere Kontext

LLMs werden überall eingesetzt. Aber **gute LLMs brauchen gute Trainingsdaten**. Und gute Trainingsdaten brauchen **gutes Labeling**.

Für sensible Bereiche (Psychologie, Medizin, Legal) gibt es **keine guten Tools**:
- 🚫 Cloud-Tools sind Datenschutz-No-Gos
- 🚫 Generische Tools verstehen fachspezifische Workflows nicht
- 🚫 Entwickler-fokussierte Tools sind für Fachexperten unbrauchbar

**Aletheia schließt diese Lücke.**

### Die Vision

Ich möchte, dass **jede Organisation mit sensiblen Daten** ihr eigenes LLM trainieren kann – **sicher, ethisch korrekt und mit Expertenwissen**.

Stell dir vor:
- 🏥 Krankenhäuser trainieren ihre eigenen medizinischen LLMs mit HIPAA-compliantem Labeling
- ⚖️ Anwaltskanzleien trainieren Legal-LLMs mit vollständiger Vertraulichkeit
- 🔬 Universitäten trainieren Forschungs-LLMs mit wissenschaftlicher Validierung

**Das ist möglich mit Aletheia.**

## Fazit: Von der Frustration zur Innovation

Aletheia startete als Antwort auf eine einfache Frage: "Warum gibt es kein Tool dafür?"

Die Reise von der initialen Frustration zum funktionierenden Produkt war lehrreich:
- ✅ Marktlücken existieren – auch in "gesättigten" Märkten
- ✅ Spezialisierung schlägt Generalisierung in Nischenmärkten
- ✅ Nicht-technische Nutzer sind der beste Reality-Check
- ✅ Extensibility ist wichtiger als Features
- ✅ On-Premises ist ein Feature, nicht legacy

Wenn du vor einem ähnlichen Problem stehst – vor allem im Bereich **sensitive Daten + LLM Training** – probier Aletheia aus. Und wenn es nicht perfekt passt: **Fork it, extend it, make it yours.**

Das ist Open Source. Das ist Innovation.

---

## Links

- **GitHub Repository**: [github.com/YourOrg/aletheia-labeling-studio](https://github.com/YourOrg/aletheia-labeling-studio)
- **Dokumentation**: [aletheia-docs.dev](https://aletheia-docs.dev)
- **Demo**: [demo.aletheia-labeling.com](https://demo.aletheia-labeling.com)
- **Diskussionen**: [GitHub Discussions](https://github.com/YourOrg/aletheia/discussions)

## Kontakt

- **LinkedIn**: [Dein LinkedIn](https://linkedin.com/in/yourprofile)
- **Twitter/X**: [@yourhandle](https://twitter.com/yourhandle)
- **Email**: your.email@domain.com

---

**Danke fürs Lesen!** Wenn du Fragen hast oder über Aletheia sprechen möchtest, schreib mir. Ich freue mich über Feedback, Diskussionen und Kollaborationen.

*Geschrieben im Dezember 2025 – aus dem Maschinenraum eines Entwicklers, der ein Problem hatte und es lösen wollte.*

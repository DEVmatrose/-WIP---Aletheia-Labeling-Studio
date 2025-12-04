# 📋 KAIROS Training Data Requirements & Aletheia Tool Specifications

**Projekt:** DreamMall KAIROS Training Data Pipeline  
**Tool:** Aletheia Labeling Studio  
**Datum:** 03. Dezember 2025  
**Status:** 🎯 Production Requirements Definition  
**Revision:** v1.0  
**GitHub Demo:** https://devmatrose.github.io/Aletheia-Labeling-Studio/

---

## 🎯 Executive Summary

Dieses Dokument definiert die **vollständigen Anforderungen** an das Aletheia Labeling Studio basierend auf den bestehenden KAIROS Training-Daten (`kairos-finetuning/data/training/`). Das Tool muss die Struktur, Validierung und Qualitätssicherung dieser Daten zu **100% abbilden und unterstützen**.

**Strategischer Kontext:**
- Wir gehen **eigene Wege** in Europa als Wirtschaftsunternehmen
- Es gibt **keine Best Practice** auf diesem Level für psychologisch-validierte AI Training Data
- Aletheia muss unsere **einzigartige Methodik** vollständig repräsentieren

**Quellmaterial:**
- 171 Training-Beispiele in 4 Task-Kategorien (A, B, C, D)
- 3 Psychologische Task-Kategorien (P1, P2, P3) in Vorbereitung
- Multi-Pillar System (Technical, Psychological, Scientific)
- ChatML Format (OpenAI-kompatibel) 

---

## 1. Training Data Struktur & Format

### 1.1 Die Drei Quellen der KAIROS Training-Daten

**Strategisches Fundament:** KAIROS lernt aus **drei unterschiedlichen Wissensquellen**, die alle ins gleiche Format (ChatML/JSONL) münden, aber **unterschiedliche Validierungs- und Bearbeitungs-Pipelines** benötigen:

#### **Quelle 1: TECHNICAL - Nutzer-Interaktionen** (90% der Daten)
- **Herkunft:** Reale User-Interaktionen mit DreamMall-Plattform
- **Beispiele:** 
  - User erstellt Profil → KAIROS extrahiert Skills/Interests
  - User schreibt Projekt-Tagebuch → KAIROS erkennt Risiken
  - User bewertet Match → Feedback für Matching-Algorithmus
- **Datenschutz:** **Hochsensibel, proprietär, nie öffentlich**
- **Validierung:** Developer-Review + User-Feedback
- **Volume:** 50-200 neue Beispiele/Monat (nach Launch)

#### **Quelle 2: PSYCHOLOGICAL - Verhaltens-Daten mit Psychologin-Verifizierung** (10% der Daten)
- **Herkunft:** Behavioral Logs + Chat-Sentiment + Professionelle Analyse
- **Beispiele:**
  - User-Archetyp-Klassifikation (Macher, Chaot, Perfektionist, Beobachter)
  - Adaptive Interventions-Generierung (Luna/Orion-Tonalität)
  - Success-Evaluation (RLHF für Coaching-Effektivität)
- **Datenschutz:** **Extrem sensibel (GDPR Art. 9), nie öffentlich**
- **Validierung:** **Professionelle Psychologin** (Human-in-the-Loop)
- **Volume:** 10-30 neue Beispiele/Monat (höhere Qualität statt Quantität)

#### **Quelle 3: SCIENTIFIC - Open Source Wissensspeicher** (Basis-Fundament)
- **Herkunft:** Öffentliche, akademische Quellen
- **Beispiele:**
  - Projektmanagement-Vorlesungsskripte
  - Teambildungs-Theorien (Tuckman, Belbin)
  - Change Management Frameworks
  - Open Access Papers zu Coaching & Leadership
- **Datenschutz:** **Öffentlich, zitierfähig, dokumentierbar**
- **Validierung:** Fachexperten-Review + Citation Check
- **Volume:** Einmalig ~50-100 Beispiele, dann inkrementell

**⚠️ KRITISCH FÜR ALETHEIA:**
Das Tool muss **alle drei Pipelines** unterstützen, aber mit **unterschiedlichen Workflows**:
- Technical: Standard-Review
- Psychological: Psychologin-Freigabe mandatory
- Scientific: Citation-Validierung mandatory

### 1.2 Basis-Format (ChatML / JSONL)

Jedes Training-Beispiel ist eine JSONL-Zeile mit dieser Struktur:

```json
{
  "messages": [
    {
      "role": "system",
      "content": "Du bist KAIROS, der DreamMall-Profil-Assistent. [System Prompt mit Regeln]"
    },
    {
      "role": "user",
      "content": "Ich bin Softwareentwickler seit 1999... [User Input]"
    },
    {
      "role": "assistant",
      "content": "Danke für deine Beschreibung! [KAIROS Response] oder {\"skills\": [...]} [Structured Output]"
    }
  ]
}
```

**Aletheia Mapping:**
- `messages[0].content` (system) → **Task Definition** (displayed as context)
- `messages[1].content` (user) → **Input** (read-only display)
- `messages[2].content` (assistant) → **Output** (editable JSON or text)

### 1.3 Task-Kategorien Übersicht

#### **Technical Tasks (Quelle 1: User-Interaktionen)**

| Task ID | Name | Input Type | Output Type | Examples | Percentage |
|---------|------|------------|-------------|----------|------------|
| **A** | Profile Analysis | Freitext (User-Beschreibung) | JSON (skills, interests, goals, needs) | 74 | 43.3% |
| **B** | Matching Reasoning | 2 Profile (JSON) + Score | Text + Recommendation | 21 | 12.3% |
| **C** | Project Monitoring | Tagebucheintrag (Text) | JSON (sentiment, risk, issues, recommendations) | 39 | 22.8% |
| **D** | Schaufenster Analysis | Service-Beschreibung (Text) | JSON (category, skills, pricing, USP) | 41 | 24.0% |

**Total Technical Data:** 171 Beispiele (Bootstrap v1.0) - **Basis vollständig vorhanden**

**⚠️ Datenschutz-Hinweis:** 
Diese Beispiele sind **proprietäre DreamMall-Daten** und dürfen **niemals öffentlich** erscheinen (auch nicht in GitHub-Repos, Demos, oder Dokumentation). Sie dienen nur zur **internen Entwicklung** und als **Anschauungsmaterial** für die Tool-Anforderungen.

#### **Psychological Tasks (Quelle 2: Verhaltens-Analyse + Psychologin)**

| Task ID | Name | Input Type | Output Type | Status | Special Requirements |
|---------|------|------------|-------------|--------|----------------------|
| **P1** | Archetyp Classification | User Behavior Data | JSON (archetyp, markers, luna_orion_balance) | Draft | Psychologist Review Required |
| **P2** | Interventions Generation | User State + Archetyp | JSON (intervention_type, tonality, content) | Draft | Neutrality Check Mandatory |
| **P3** | Success Evaluation | Intervention + User Response | JSON (effectiveness, learnings, adaptation) | Draft | RLHF Integration |

**Total Psychological Data:** ~40 Beispiele geplant (Phase 1)

**Die "Seele" von KAIROS (Luna & Orion):**
Die Assistenten-Avatare Luna (empathisch, unterstützend) und Orion (strukturiert, strategisch) bekommen durch diese Daten adaptive Persönlichkeiten. Basierend auf User-Archetypen (Macher, Chaot, Perfektionist, Beobachter) passt KAIROS **Tonalität und Coaching-Strategie** an.

**Beispiel:**
- **User-Typ:** "Ängstlicher Perfektionist" → 90% Luna / 10% Orion
- **Intervention:** Micro-Tasks, Angstabbau, keine Drucksetzung
- **Validierung:** Psychologin prüft, dass keine Pathologisierung vorliegt

**⚠️ Besonderheiten:** 
- **GDPR Art. 9 Compliance:** Gesundheitsbezogene Daten (psychologische Zustände)
- **Professionelle Psychologin** als Human-in-the-Loop (nicht Crowd-sourced!)
- **Höhere Qualität > Quantität:** 10-30 Beispiele/Monat statt 50-200
- **Golden Set:** Verifizierte Beispiele als Quality Benchmark
- **Extrem vertraulich:** Niemals öffentlich, hochsensible Verhaltens-Daten

**Strategischer Wert:**
> "Ein Wettbewerber kann technische Features kopieren. Aber 2+ Jahre verhaltensbasierte, psychologisch verifizierte User-Interaktionen? **Unmöglich zu replizieren.** Das ist der echte Data Moat."

#### **Scientific Tasks (Quelle 3: Open Source Wissensspeicher)**

**Zweck:** Fundierung von KAIROS mit akademischem, wissenschaftlich verifizierten Wissen

**Beispiel-Anwendungen:**

| Wissensbereich | Quelle (Open Access) | KAIROS-Funktion |
|---------------|----------------------|-----------------|
| **Projektmanagement** | Vorlesungsskripte, PMI Standards | Task C: Project Monitoring - Risiko-Analyse, Empfehlungen |
| **Teambildung** | Tuckman (1965), Belbin (1981) | Matching-System - Team-Kompatibilität |
| **Change Management** | Kotter (1995), Open Courseware | Projekt-Coaching - Transformations-Prozesse |
| **Coaching** | Open Access Papers zu Motivation | Task P2: Interventions - Evidenzbasierte Strategien |

**Total Scientific Data:** ~50-100 Beispiele (Basis), dann inkrementell

### 1.4 Wissenschaftliche Daten (Scientific Pillar)

**Quellen:**
- Fachartikel über Projektmanagement (z.B. PMI Standards)
- Teambildungs-Theorien (Tuckman, Belbin)
- Change Management Frameworks
- Psychologische Coaching-Literatur
- Open Source Educational Materials
- Akademische Vorlesungsskripte (z.B. Projektmanagement-Grundlagen)

**Beispiel aus DreamMall:**
- Quelle: `K2-main_Projektmanagement_Grundlagen.pdf` (Vorlesungsskript)
- Kontext: Training für KAIROS Projekt-Monitoring-Funktionalität
- Zweck: Wissenschaftlich fundierte Basis für Risiko-Analyse und Empfehlungen

**Format:**
```json
{
  "source": "Tuckman, B. W. (1965). Developmental sequence in small groups.",
  "source_type": "academic_paper",
  "context": "Team-Entwicklung in Projekten",
  "license": "open_access",
  "training_example": {
    "messages": [...]
  }
}
```

**Aletheia Requirement:**
- Textfeld: "Quellenangabe/Zitat" (mandatory für Scientific Pillar)
- Validierung: Korrekte Zitations-Format
- Dropdown: Source Type (academic_paper, textbook, open_courseware, lecture_notes)
- License Check: Nur Open Source / Open Access Materialien

**⚠️ WICHTIG - Datenschutz:**
- Wissenschaftliche Quellen sind **öffentlich dokumentierbar**
- Unterschied zu Technical/Psychological Data (proprietär, vertraulich)

---

## 2. Aletheia UI Requirements - 100% Abbildung

### 2.1 Queue Panel (Linke Spalte)

**Anforderungen:**

1. **Filter nach Task-Typ:**
   - Dropdown: [All, Task A, Task B, Task C, Task D, Task P1, Task P2, Task P3]
   - Badge-Anzeige: Count pro Typ (z.B. "Task A: 74")

2. **Filter nach Pillar:**
   - Checkboxes: [Technical, Psychological, Scientific]
   - Kombinierbar (z.B. nur Psychological + Scientific)

3. **Filter nach Status:**
   - [Pending, In Progress, Completed, Skipped, Needs Review]
   - Farbcodierung:
     - Pending: grau
     - In Progress: blau
     - Completed: grün
     - Skipped: orange
     - Needs Review: rot

4. **Sortierung:**
   - [Newest First, Oldest First, Quality Score, Task Type]

5. **Anzeige pro Item:**
   ```
   [Badge: Task A] [Badge: Psychological]
   
   ID: kairos-a-001
   Quality: ████░░░░░░ 72%
   Status: In Progress
   Reviewer: Anna (Psychologist)
   
   Preview: "Ich bin Softwareentwickler..."
   ```

6. **Bulk Actions:**
   - "Select All Pending"
   - "Mark as Needs Review"
   - "Assign to Reviewer"

### 2.2 Editor Panel (Mittlere Spalte)

**Struktur (3 Tabs):**

#### Tab 1: System Prompt
```
[Read-Only Display]

🤖 Task Definition:

Du bist KAIROS, der DreamMall-Profil-Assistent. 
Deine Aufgabe ist es, aus Freitext-Beschreibungen 
strukturierte Matching-Profile zu erstellen.

Wichtige Regeln:
1. Wenn eine Beschreibung zu vage ist...
2. Jede Kategorie (skills, interests, goals, needs)...
```

**Features:**
- Syntax Highlighting für Markdown
- Kopier-Button
- Collapse/Expand

#### Tab 2: Input (User Prompt)
```
[Read-Only Display]

👤 User Input:

Ich bin Softwareentwickler seit 1999 und habe 
im Laufe der Jahre viele Techniken mitgemacht. 
Ich bin Fullstack unterwegs...
```

**Features:**
- Syntax Highlighting je nach Content-Type (Text, JSON)
- Kopier-Button
- Zeichen-Counter

#### Tab 3: Output (KAIROS Response) - **EDITABLE**
```
[Monaco Editor oder Enhanced Textarea]

🤖 KAIROS Output:

{
  "skills": [
    "Fullstack Development",
    "Node.js",
    "Vue.js",
    "PostgreSQL"
  ],
  "interests": [
    "KI-Integration",
    "Social Networks"
  ],
  "goals": [
    "KI-Projekte finden",
    "Technische Partnerschaften"
  ],
  "needs": [
    "Co-Founder für KI-Projekt",
    "Austausch mit KI-Experten"
  ]
}
```

**Features:**
- **Echtzeit JSON Validation** (Fehler-Highlighting)
- **Schema Validation** (je nach Task-Typ):
  - Task A: Muss `skills`, `interests`, `goals`, `needs` haben
  - Task C: Muss `sentiment`, `risk_level`, `issues`, `recommendations` haben
- **Auto-Format Button** (JSON Pretty-Print)
- **Undo/Redo** (Ctrl+Z, Ctrl+Y)
- **Zeilen-Nummern**

### 2.3 Validation Panel (Rechte Spalte)

**Struktur:**

#### 1. Pillar Selection
```
📊 Data Category (Select One):

○ Technical
   Standard validation, developer review OK

○ Psychological  
   ⚠️ Requires psychologist review
   
○ Scientific
   📚 Citation required
```

**Dynamische Felder je nach Pillar:**

**Wenn Psychological ausgewählt:**
```
☑️ Neutrality Check (Mandatory)
   □ Keine Pathologisierung
   □ Keine Stereotypisierung
   □ Respektiert Diversität
   
👤 Psychologist Review:
   Assigned to: [Dropdown: Anna, Maria, ...]
   Status: [ ] Pending  [✓] Approved
```

**Wenn Scientific ausgewählt:**
```
📚 Source Citation (Mandatory):

[Text Input]
Example: Tuckman, B. W. (1965). Developmental 
sequence in small groups. Psychological Bulletin.

☑️ Citation Validation:
   □ Format korrekt (Author, Year, Title)
   □ Zitat nachvollziehbar
   □ Kontext erklärt
```

#### 2. Quality Assessment
```
⭐ Quality Score: [Slider 0-100%]  [72%]

Breakdown:
✅ Completeness: 90% (All fields present)
⚠️ Specificity: 60% (Some vague descriptions)
✅ Format: 100% (Valid JSON)
✅ Consistency: 80% (Minor contradictions)

Overall: 72% - GOOD
```

#### 3. Validation Results
```
🔍 Automatic Checks:

✅ JSON Valid
✅ All Required Fields Present
⚠️ Skills list < 3 items (Empfohlen: min. 3)
❌ Missing "needs" array

[Button: Run Validation Again]
```

#### 4. Manual Review Notes
```
📝 Reviewer Notes:

[Rich Text Editor]

Example:
"User-Beschreibung ist zu vage. 
KAIROS sollte nachfragen nach konkreten 
Datenbank-Typen (siehe Golden Set A-002)."

Tags: #needs-rework #ask-followup
```

#### 5. Actions
```
[Button: ✅ Approve & Save]       (Grün, prominent)
[Button: ⏸️ Skip for Now]        (Gelb)
[Button: 🔄 Request Rework]      (Orange)
[Button: ❌ Reject & Archive]    (Rot)

Keyboard Shortcuts:
Ctrl+S: Approve & Save
Ctrl+K: Skip
Ctrl+R: Request Rework
```

### 2.4 Top Bar (Navigation & Stats)

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔍 Aletheia Labeling Studio    [KAIROS Training Data]          │
│                                                                  │
│  Progress: ███████░░░ 72% (123/171)                            │
│                                                                  │
│  📊 Stats:  Pending: 48  |  In Progress: 5  |  Completed: 123  │
│  👥 Team:   You: 23  |  Anna (Psychologist): 8                 │
│  🎯 Quality: Avg 78%  |  High (>80%): 89  |  Low (<60%): 12    │
│                                                                  │
│  [Filter: All Tasks ▼]  [Pillar: All ▼]  [Status: Pending ▼]  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Validierungs-Schema pro Task-Typ

### Task A: Profile Analysis

**Required Fields:**
```typescript
{
  skills: string[],        // min. 3 items
  interests: string[],     // min. 3 items
  goals: string[],         // min. 1 item
  needs: string[]          // min. 1 item
}
```

**Validierungsregeln:**
- Alle Arrays müssen vorhanden sein
- Skills dürfen nicht generisch sein (z.B. "gute Kenntnisse" → ❌)
- Interests müssen konkret sein (z.B. "GreenTech" ✅, "verschiedenes" ❌)
- Goals müssen actionable sein

**Qualitätskriterien:**
- **Completeness:** Alle 4 Kategorien ausgefüllt? (25% je)
- **Specificity:** Wie konkret sind die Items? (Keyword-Check)
- **Consistency:** Widersprechen sich Aussagen?

### Task B: Matching Reasoning

**Required Format:**
```typescript
{
  match_score: number,           // 0.0 - 1.0
  sentiment: "high" | "medium" | "low",
  strengths: string[],           // min. 2 items
  weaknesses?: string[],         // optional
  recommendation: string,        // min. 50 Zeichen
  rationale: string             // Begründung
}
```

**Validierungsregeln:**
- Match Score muss zwischen 0.0 und 1.0 liegen
- Strengths müssen **konkrete** Daten aus beiden Profilen referenzieren
- Recommendation muss actionable sein ("Verbinden", "Videocall vereinbaren")

### Task C: Project Monitoring

**Required Format:**
```typescript
{
  sentiment: "positive" | "neutral" | "negative",
  risk_level: "low" | "medium" | "medium_high" | "high" | "critical",
  confidence: number,            // 0.0 - 1.0
  issues: Array<{
    type: string,                // enum: deadline_slippage, scope_creep, etc.
    severity: "low" | "medium" | "high",
    description: string
  }>,
  recommendations: Array<{
    priority: "low" | "medium" | "high",
    action: string,              // konkrete Handlungsempfehlung
    reason: string
  }>,
  prediction: string             // 5-7 Tage Vorhersage
}
```

**Validierungsregeln:**
- Sentiment muss zu Risk Level passen (negative + low → ❌)
- Issues müssen **konkrete Probleme** benennen
- Recommendations müssen **actionable** sein (nicht "Kommunikation verbessern")

### Task D: Schaufenster Analysis

**Required Format:**
```typescript
{
  category: string,              // enum: Design Services, Tech Services, etc.
  subcategory: string,
  skills: string[],              // min. 2 items
  target_audience: string[],
  pricing_type: "fixed_price" | "hourly" | "project_based" | "subscription" | "free",
  price_range?: {
    min: number,
    max: number,
    currency: string
  },
  delivery_time?: string,
  usp: string,                   // Unique Selling Proposition
  completeness_score: number,    // 0.0 - 1.0
  suggestions?: string[]
}
```

**Validierungsregeln:**
- Category muss aus vordefinierter Liste sein
- Skills müssen explizit im Text erwähnt sein
- USP darf nicht generisch sein ("professionell", "günstig" → ❌)

---

## 4. Psychologische Daten - Spezielle Anforderungen

### 4.1 Archetyp System (4 Basis-Typen)

**Typen:**
1. **Zielorientierter Macher** (20% Luna / 80% Orion)
2. **Kreativer Chaot** (70% Luna / 30% Orion)
3. **Ängstlicher Perfektionist** (90% Luna / 10% Orion)
4. **Introvertierter Beobachter** (60% Luna / 40% Orion)

**Output-Format Task P1:**
```json
{
  "archetyp": "Zielorientierter Macher",
  "confidence": 0.85,
  "behavioral_markers": [
    "Hohe Projekt-Completion-Rate (>70%)",
    "Strukturierte Planung",
    "Direkte Chat-Kommunikation"
  ],
  "luna_orion_balance": {
    "luna_pct": 20,
    "orion_pct": 80,
    "rationale": "User bevorzugt direkte, technische Kommunikation"
  },
  "intervention_style": "Direkt, technisch, strategisch"
}
```

**Aletheia Validation für P1:**
```
☑️ Psychological Validation:

□ Archetyp korrekt basierend auf Behavioral Markers?
□ Luna/Orion Balance plausibel?
□ Keine Pathologisierung? (MANDATORY)
□ Keine Stereotypisierung?

👤 Psychologist Review:
   Status: ⚠️ Pending Review
   Assigned to: Anna Schmidt
   
📝 Notes:
[Textfeld für Psychologin-Kommentare]
```

### 4.2 Interventions-Generierung (Task P2)

**Input:**
- User State (archetyp, current_mood, project_status)
- Situation (stuck, unmotivated, overwhelmed, etc.)

**Output:**
```json
{
  "intervention_type": "coaching" | "reminder" | "restructuring" | "motivation",
  "tonality": {
    "luna_pct": 70,
    "orion_pct": 30,
    "style": "Empathisch, strukturierend"
  },
  "message": "Hey [Name], ich sehe dass du...",
  "expected_outcome": "User fühlt sich verstanden und bekommt konkreten nächsten Schritt",
  "follow_up_trigger": "nach 2 Tagen wenn keine Aktion"
}
```

**Aletheia Validation für P2:**
```
☑️ Intervention Quality:

□ Tonalität passt zum Archetyp?
□ Message respektvoll & nicht bevormundend?
□ Keine Diagnose-Sprache? (MANDATORY)
□ Expected Outcome realistisch?

⚠️ Red Flags (Auto-Check):
❌ Enthält: "Du leidest an..."
❌ Enthält: "Du musst..."
❌ Pathologisierung erkannt

👤 Psychologist Approval Required
```

### 4.3 Success Evaluation (Task P3)

**Input:**
- Intervention (P2 Output)
- User Response (text, action, or null)
- Time elapsed

**Output:**
```json
{
  "effectiveness_score": 0.75,
  "user_response": "positive" | "neutral" | "negative" | "no_response",
  "learnings": [
    "User reagiert gut auf Micro-Tasks",
    "Zu viel Empathie wirkt bevormundend"
  ],
  "adaptation": {
    "luna_adjustment": -10,  // Weniger Luna beim nächsten Mal
    "orion_adjustment": +10,
    "rationale": "User bevorzugt direktere Kommunikation"
  },
  "rlhf_label": "positive" | "neutral" | "negative"
}
```

**Aletheia Validation für P3:**
```
☑️ Evaluation Accuracy:

□ Effectiveness Score basiert auf messbaren Faktoren?
□ Learnings konkret & nicht generisch?
□ Adaptation logisch begründet?

🔄 RLHF Integration:
   Label: [Positive ▼]
   Used for: Next Training Cycle
   Weight: 1.5x (High Quality)
```

---

## 5. Workflow & Prozesse - Drei Pipelines, Drei Validierungs-Wege

**Kritisches Konzept:** Obwohl alle Daten im gleichen Format (ChatML/JSONL) enden, haben sie **völlig unterschiedliche Entstehungs- und Validierungs-Prozesse**:

| Pipeline | Quelle | Häufigkeit | Reviewer | Kritische Checks |
|----------|--------|------------|----------|------------------|
| **Technical** | User-DB + Interaktionen | Täglich/Wöchentlich | Developer | Format, Qualität, Konsistenz |
| **Psychological** | Behavioral Logs + Sentiment | Wöchentlich/Monatlich | **Psychologin** | Neutralität, Ethik, GDPR Art. 9 |
| **Scientific** | Open Access Papers | Einmalig + Inkrementell | Fachexperte | Citation, Lizenz, Kontext |

### 5.1 Pipeline 1: Technical Data Review (Standard-Workflow)

**Quelle:** Echte User-Interaktionen aus DreamMall-Datenbank

**Prozess:**
```
1. USER INTERACTION (Plattform)
   ↓
   [User erstellt Profil / schreibt Tagebuch / bewertet Match]
   ↓
2. AUTO-CAPTURE (Backend)
   ↓
   → Daten in `kairos_training_data` gespeichert
   → Status: PENDING
   → Pillar: technical
   ↓
3. DEVELOPER REVIEW (Aletheia)
   ↓
   [Edit output, validate, assess quality]
   ↓
   Decision Point:
   ├─ Quality > 70% → [Approve] → COMPLETED
   ├─ Quality 50-70% → [Request Rework] → NEEDS REVIEW
   └─ Quality < 50% → [Reject] → ARCHIVED
   ↓
4. COMPLETED
   → used_for_training = TRUE
   → Included in next training cycle (wöchentlich)
```

**Volume:** 50-200 neue Beispiele/Monat (nach Launch)  
**Reviewer:** Entwickler (technische Validierung)  
**Datenschutz:** **Hochsensibel, proprietär, nie öffentlich**

### 5.2 Pipeline 2: Psychological Data Review (Human-in-the-Loop)

**Quelle:** Behavioral Analytics + Chat-Sentiment + Professionelle Klassifikation

**Prozess:**
```
1. BEHAVIORAL COLLECTION (30 Tage)
   ↓
   [System sammelt: Projekt-Completion, Chat-Sentiment, Login-Muster]
   ↓
2. AUTO-CLASSIFICATION (KAIROS v1)
   ↓
   → Vorschlag: Archetyp "Kreativer Chaot"
   → Luna/Orion-Balance: 70/30
   → Status: PENDING_PSYCHOLOGIST_REVIEW
   ↓
3. DEVELOPER PRE-CHECK (Aletheia)
   ↓
   ☑️ Neutrality Check:
      □ Keine Pathologisierung?
      □ Keine Stereotypisierung?
      □ Respektvoll formuliert?
   ↓
   ├─ YES → [Assign to Psychologist] → PSYCHOLOGIST REVIEW
   └─ NO → [Request Rework] → NEEDS REVIEW
   ↓
4. PSYCHOLOGIST REVIEW (Final Gate)
   ↓
   [Professionelle Psychologin prüft]:
   ✅ Klassifikation korrekt?
   ✅ Intervention ethisch vertretbar?
   ✅ Keine Diagnose-Sprache?
   ✅ GDPR Art. 9 compliant?
   ↓
   Decision Point:
   ├─ Approved → COMPLETED (Golden Set Quality)
   └─ Rejected → NEEDS REVIEW (with detailed notes)
   ↓
5. COMPLETED
   → used_for_training = TRUE
   → pillar = 'psychological'
   → reviewed_by_psychologist = TRUE
   → quality_weight = 1.5x (higher weight in training)
```

**Volume:** 10-30 neue Beispiele/Monat (Qualität > Quantität)  
**Reviewer:** **Professionelle Psychologin** (nicht Crowd-sourced!)  
**Datenschutz:** **Extrem sensibel (GDPR Art. 9), nie öffentlich**  
**Training-Frequenz:** Monatlich (höhere Batch-Qualität)

**⚠️ Warum das uneinholbar ist:**
- Wettbewerber können Code forken, aber nicht 2+ Jahre psychologisch verifizierte Verhaltens-Daten replizieren
- Professionelle Psychologin als Quality Gate (nicht automatisierbar!)
- Golden Set wächst über Jahre → immer besseres Archetypen-System

### 5.3 Pipeline 3: Scientific Data Review (Citation-Validierung)

**Quelle:** Open Access Papers, Vorlesungsskripte, Fachartikel

**Prozess:**
```
1. SOURCE IDENTIFICATION
   ↓
   [Fachexperte findet relevante Open Source Quelle]
   ↓
   Beispiel: "K2-main_Projektmanagement_Grundlagen.pdf"
   ↓
2. CONTENT EXTRACTION
   ↓
   [Entwickler erstellt Training-Beispiel basierend auf Quelle]
   ↓
   → Task C: Risk-Analysis basierend auf PM-Theorie
   → Status: PENDING
   → Pillar: scientific
   ↓
3. CITATION VALIDATION (Aletheia)
   ↓
   📚 Mandatory Checks:
      ☑️ Author, Year, Title present?
      ☑️ Context explained?
      ☑️ License verified? (Open Access!)
      ☑️ Source verifiable?
   ↓
   ├─ Valid → [Approve] → COMPLETED
   └─ Invalid → [Request Citation Fix] → NEEDS REVIEW
   ↓
4. COMPLETED
   → pillar = 'scientific'
   → source_citation logged
   → publicly_documentable = TRUE (unterschied zu Tech/Psych!)
```

**Volume:** ~50-100 Beispiele (Basis), dann inkrementell  
**Reviewer:** Fachexperte + Developer (Citation Check)  
**Datenschutz:** **Öffentlich dokumentierbar** (Open Access Quellen!)  
**Training-Frequenz:** Einmalig (Basis), dann bei Bedarf

**Unterschied zu anderen Pipelines:**
- Einzige Pipeline, die öffentlich dokumentiert werden **kann** (nicht muss!)
- Keine User-Daten, sondern akademisches Wissen
- Validierung fokussiert auf **wissenschaftliche Korrektheit** statt Datenschutz

---

## 6. Datenbank-Schema (Supabase)

### Table: `kairos_training_data`

```sql
CREATE TABLE kairos_training_data (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Content (JSONB for flexibility)
  system_prompt TEXT NOT NULL,
  user_input TEXT NOT NULL,
  kairos_output JSONB NOT NULL,
  
  -- Categorization
  task_type TEXT NOT NULL,  -- 'task_a', 'task_b', 'task_c', 'task_d', 'task_p1', etc.
  pillar TEXT NOT NULL,     -- 'technical', 'psychological', 'scientific'
  
  -- Quality Control
  status TEXT DEFAULT 'pending',  -- pending, in_progress, completed, skipped, needs_review, archived
  quality_score DECIMAL(3,2),     -- 0.00 - 1.00
  completeness_score DECIMAL(3,2),
  specificity_score DECIMAL(3,2),
  
  -- Review
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  reviewer_role TEXT,  -- 'developer', 'psychologist', 'admin'
  reviewer_notes TEXT,
  
  -- Psychological Pillar Specifics
  is_neutral BOOLEAN,  -- Passed neutrality check?
  approved_by_psychologist BOOLEAN DEFAULT FALSE,
  psychologist_id UUID REFERENCES auth.users(id),
  
  -- Scientific Pillar Specifics
  source_citation TEXT,
  citation_validated BOOLEAN,
  
  -- Training Integration
  used_for_training BOOLEAN DEFAULT FALSE,
  training_cycle TEXT,  -- 'v1.0', 'v1.1', etc.
  rlhf_label TEXT,      -- 'positive', 'neutral', 'negative'
  
  -- Metadata
  validation_errors JSONB,
  tags TEXT[],
  
  CONSTRAINT valid_pillar CHECK (pillar IN ('technical', 'psychological', 'scientific')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'needs_review', 'archived'))
);

-- Indexes
CREATE INDEX idx_training_status ON kairos_training_data(status);
CREATE INDEX idx_training_pillar ON kairos_training_data(pillar);
CREATE INDEX idx_training_task ON kairos_training_data(task_type);
CREATE INDEX idx_training_quality ON kairos_training_data(quality_score);
CREATE INDEX idx_training_unused ON kairos_training_data(used_for_training) WHERE used_for_training = FALSE;

-- RLS Policies
ALTER TABLE kairos_training_data ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins full access" ON kairos_training_data
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Psychologists can only review psychological data
CREATE POLICY "Psychologists review psychological" ON kairos_training_data
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'psychologist' 
    AND pillar = 'psychological'
  );

CREATE POLICY "Psychologists update psychological" ON kairos_training_data
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'psychologist' 
    AND pillar = 'psychological'
  );

-- Reviewers can view & update (but not delete)
CREATE POLICY "Reviewers can review" ON kairos_training_data
  FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('reviewer', 'developer')
  );

CREATE POLICY "Reviewers can update" ON kairos_training_data
  FOR UPDATE USING (
    auth.jwt() ->> 'role' IN ('reviewer', 'developer')
  );
```

---

## 7. Aletheia Integration - Adapter Pattern

### 7.1 Data Flow (Database → Aletheia → Database)

```typescript
// admin-frontend/src/services/aletheia-adapter.ts

import { AletheiaItem } from 'aletheia-labeling-studio';
import { supabase } from '@/lib/supabaseClient';

export interface KairosTrainingData {
  id: string;
  system_prompt: string;
  user_input: string;
  kairos_output: object;
  task_type: string;
  pillar: 'technical' | 'psychological' | 'scientific';
  status: string;
  quality_score?: number;
  source_citation?: string;
  // ... mehr Felder
}

export function useAletheiaAdapter() {
  const trainingItems = ref<AletheiaItem[]>([]);
  const loading = ref(false);

  // 1. Load from Supabase
  async function loadPendingItems() {
    loading.value = true;
    const { data, error } = await supabase
      .from('kairos_training_data')
      .select('*')
      .eq('used_for_training', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform to Aletheia format
    trainingItems.value = data.map(dbRowToAletheiaItem);
    loading.value = false;
  }

  // 2. Transform DB Row → Aletheia Item
  function dbRowToAletheiaItem(row: KairosTrainingData): AletheiaItem {
    return {
      id: row.id,
      status: row.status as any,
      input: {
        system: row.system_prompt,
        user: row.user_input
      },
      output: row.kairos_output,
      metadata: {
        taskType: row.task_type,
        pillar: row.pillar,
        qualityScore: row.quality_score,
        sourceCitation: row.source_citation
      },
      validation: {
        isValid: true,  // Will be re-validated in UI
        errors: []
      }
    };
  }

  // 3. Save (Aletheia Event → Supabase Update)
  async function handleSave(item: AletheiaItem) {
    const { error } = await supabase
      .from('kairos_training_data')
      .update({
        kairos_output: item.output,
        status: 'completed',
        quality_score: item.metadata.qualityScore,
        reviewed_by: (await supabase.auth.getUser()).data.user?.id,
        reviewed_at: new Date().toISOString(),
        used_for_training: true  // Ready for next training cycle
      })
      .eq('id', item.id);

    if (error) throw error;
    
    // Remove from queue
    trainingItems.value = trainingItems.value.filter(i => i.id !== item.id);
  }

  // 4. Validate (Custom per Task Type)
  function handleValidate(item: AletheiaItem): ValidationResult {
    const schema = getSchemaForTaskType(item.metadata.taskType);
    return validateAgainstSchema(item.output, schema);
  }

  return {
    trainingItems,
    loading,
    loadPendingItems,
    handleSave,
    handleValidate
  };
}
```

### 7.2 Vue Component Integration

```vue
<!-- admin-frontend/src/views/KairosTrainingView.vue -->
<template>
  <div class="kairos-training-view">
    <PageHeader title="KAIROS Training Data Review" />
    
    <AletheiaLabeler
      :items="trainingItems"
      :config="kairosConfig"
      :loading="loading"
      @save="handleSave"
      @validate="handleValidate"
      @skip="handleSkip"
    >
      <!-- Custom Validation Panel for Psychological Data -->
      <template #validation-extra="{ item }">
        <div v-if="item.metadata.pillar === 'psychological'">
          <h4>🧠 Psychological Review</h4>
          <label>
            <input type="checkbox" v-model="item.metadata.isNeutral" required />
            Keine Pathologisierung (MANDATORY)
          </label>
          <label>
            Psychologist:
            <select v-model="item.metadata.psychologistId">
              <option value="anna">Anna Schmidt</option>
              <option value="maria">Maria Weber</option>
            </select>
          </label>
        </div>
        
        <div v-if="item.metadata.pillar === 'scientific'">
          <h4>📚 Scientific Citation</h4>
          <textarea 
            v-model="item.metadata.sourceCitation" 
            placeholder="Author, Year, Title..."
            required
          />
        </div>
      </template>
    </AletheiaLabeler>
  </div>
</template>

<script setup lang="ts">
import { AletheiaLabeler } from 'aletheia-labeling-studio';
import { useAletheiaAdapter } from '@/services/aletheia-adapter';

const { 
  trainingItems, 
  loading, 
  loadPendingItems,
  handleSave, 
  handleValidate,
  handleSkip 
} = useAletheiaAdapter();

// KAIROS-specific configuration
const kairosConfig = {
  taskTypes: [
    { id: 'task_a', name: 'Profile Analysis', schema: taskASchema },
    { id: 'task_b', name: 'Matching Reasoning', schema: taskBSchema },
    { id: 'task_c', name: 'Project Monitoring', schema: taskCSchema },
    { id: 'task_d', name: 'Schaufenster Analysis', schema: taskDSchema },
    { id: 'task_p1', name: 'Archetyp Classification', schema: taskP1Schema },
  ],
  pillars: ['technical', 'psychological', 'scientific'],
  validations: {
    psychological: {
      neutralityCheck: true,
      requiresPsychologistReview: true
    },
    scientific: {
      requiresCitation: true
    }
  }
};

onMounted(() => {
  loadPendingItems();
});
</script>
```

---

## 8. Migration Plan: JSONL → Database

### 8.1 One-Time Migration Script

```python
# scripts/migrate_jsonl_to_supabase.py

import json
from supabase import create_client
import os
from datetime import datetime

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

JSONL_FILES = {
    'task_a': 'data/training/task-a-matching-profiles.jsonl',
    'task_b': 'data/training/task-b-matching-reasoning.jsonl',
    'task_c': 'data/training/task-c-project-monitoring.jsonl',
    'task_d': 'data/training/task-d-schaufenster-analysis.jsonl',
}

def migrate_jsonl_to_db():
    total_migrated = 0
    
    for task_type, filepath in JSONL_FILES.items():
        print(f"Migrating {task_type} from {filepath}...")
        
        with open(filepath, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                try:
                    data = json.loads(line.strip())
                    messages = data['messages']
                    
                    # Extract messages
                    system_prompt = messages[0]['content']
                    user_input = messages[1]['content']
                    kairos_output = messages[2]['content']
                    
                    # Try to parse output as JSON (for structured tasks)
                    try:
                        kairos_output = json.loads(kairos_output)
                    except:
                        pass  # Keep as text if not JSON
                    
                    # Insert into Supabase
                    result = supabase.table('kairos_training_data').insert({
                        'system_prompt': system_prompt,
                        'user_input': user_input,
                        'kairos_output': kairos_output,
                        'task_type': task_type,
                        'pillar': 'technical',  # All bootstrap data is technical
                        'status': 'completed',  # Already validated by hand
                        'quality_score': 1.0,   # Bootstrap data is high quality
                        'used_for_training': True,  # Already used in v1.0
                        'training_cycle': 'v1.0_bootstrap',
                        'created_at': datetime.now().isoformat()
                    }).execute()
                    
                    total_migrated += 1
                    
                except Exception as e:
                    print(f"Error on line {line_num}: {e}")
                    continue
    
    print(f"\n✅ Migration complete! {total_migrated} examples migrated.")

if __name__ == '__main__':
    migrate_jsonl_to_db()
```

**Ausführung:**
```powershell
# Set environment variables
$env:SUPABASE_URL = "https://your-project.supabase.co"
$env:SUPABASE_SERVICE_KEY = "your-service-key"

# Run migration
python scripts/migrate_jsonl_to_supabase.py
```

---

## 9. Testing & Quality Assurance

### 9.1 Golden Set Testing

**Ziel:** Sicherstellen dass Aletheia UI die Golden Set Beispiele korrekt validiert.

```typescript
// tests/aletheia-golden-set.test.ts

import { describe, it, expect } from 'vitest';
import { validateTaskA, validateTaskB } from '@/validators';
import goldenSetData from '@/data/validation/golden-set.jsonl';

describe('Aletheia Validation - Golden Set', () => {
  it('should validate golden-a-001 (perfect profile)', () => {
    const item = goldenSetData.find(x => x.id === 'golden-a-001');
    const result = validateTaskA(item.expected_output);
    
    expect(result.isValid).toBe(true);
    expect(result.qualityScore).toBeGreaterThan(0.95);
  });

  it('should detect vague input (golden-a-002)', () => {
    const item = goldenSetData.find(x => x.id === 'golden-a-002');
    const result = validateTaskA(item.input);
    
    expect(result.requiresFollowup).toBe(true);
    expect(result.suggestedQuestions).toHaveLength(3);
  });

  it('should handle multilingual input (golden-a-003)', () => {
    const item = goldenSetData.find(x => x.id === 'golden-a-003');
    const result = validateTaskA(item.expected_output);
    
    expect(result.isValid).toBe(true);
    expect(result.language).toBe('en'); // Input in English
  });
});
```

### 9.2 UI Interaction Tests

```typescript
// tests/aletheia-ui.test.ts

import { mount } from '@vue/test-utils';
import AletheiaLabeler from '@/components/AletheiaLabeler.vue';

describe('Aletheia UI', () => {
  it('should load items into queue', async () => {
    const wrapper = mount(AletheiaLabeler, {
      props: {
        items: mockTrainingData,
        config: kairosConfig
      }
    });
    
    expect(wrapper.find('.queue-panel').exists()).toBe(true);
    expect(wrapper.findAll('.queue-item')).toHaveLength(171);
  });

  it('should validate JSON output on edit', async () => {
    const wrapper = mount(AletheiaLabeler);
    const editor = wrapper.find('.json-editor');
    
    await editor.setValue('{ invalid json }');
    
    expect(wrapper.find('.validation-error').exists()).toBe(true);
    expect(wrapper.find('.btn-save').attributes('disabled')).toBe('true');
  });

  it('should require psychologist review for psychological data', async () => {
    const item = { ...mockItem, pillar: 'psychological' };
    const wrapper = mount(AletheiaLabeler, {
      props: { items: [item] }
    });
    
    expect(wrapper.find('.psychologist-review').exists()).toBe(true);
    expect(wrapper.find('input[type="checkbox"][required]').exists()).toBe(true);
  });
});
```

---

## 10. Roadmap & Nächste Schritte

### Phase 1: Demo Enhancement (✅ Fertig)
- [x] Basis-UI mit 3-Spalten-Layout
- [x] Queue-System mit Status-Tracking
- [x] JSON-Editor mit Validation
- [x] Demo deployed: https://devmatrose.github.io/Aletheia-Labeling-Studio/

### Phase 2: Production Integration (🚧 In Progress)
- [ ] Supabase Schema erstellen
- [ ] Migration Script (JSONL → DB)
- [ ] Adapter Implementation
- [ ] RLS Policies für Multi-User
- [ ] Admin-Frontend Integration

### Phase 3: Psychological Features (📋 Geplant)
- [ ] Archetyp-spezifische Validierung
- [ ] Psychologist Review Workflow
- [ ] Neutrality Check Automation
- [ ] Luna/Orion Balance Visualization

### Phase 4: Scientific Features (📋 Geplant)
- [ ] Citation Parser & Validator
- [ ] Source Library Integration
- [ ] Bibliography Export

### Phase 5: Advanced Features (💡 Zukunft)
- [ ] Batch Operations (Multi-Select)
- [ ] Advanced Search & Filters
- [ ] Analytics Dashboard
- [ ] Export to JSONL for Training
- [ ] Version History & Diffs

---

## 11. Success Metrics

**Ziele für Q1 2026:**

| Metric | Target | Aktuell | Status |
|--------|--------|---------|--------|
| Training Data Migrated | 171/171 | 0/171 | 🔴 Pending |
| Psychological Examples | 40 | 10 (draft) | 🟡 In Progress |
| Psychologist Reviews | 40 | 0 | 🔴 Not Started |
| Quality Score Avg | > 80% | - | ⚪ TBD |
| Review Time per Item | < 5 min | - | ⚪ TBD |
| Training Cycles | 2/month | 0 | 🔴 Not Started |

**KPIs:**
- **Data Quality:** Avg Quality Score > 80%
- **Review Throughput:** 10+ items/day/reviewer
- **KAIROS Performance:** Loss improvement > 5% per training cycle
- **Team Satisfaction:** Reviewer NPS > 8/10

---

## 12. Conclusion

Aletheia Labeling Studio muss **zu 100% unsere einzigartigen Anforderungen** abbilden:

1. ✅ **Multi-Pillar System** (Technical, Psychological, Scientific)
2. ✅ **Task-spezifische Validierung** (A, B, C, D, P1, P2, P3)
3. ✅ **Psychologist-in-the-Loop** für sensible Daten
4. ✅ **Database-First Architecture** für kollaboratives Arbeiten
5. ✅ **Open Source Core** für Portfolio & Community

**Wir gehen eigene Wege** weil es für psychologisch-validierte AI Training Data **keine Best Practice** gibt. Aletheia ist unser Werkzeug, um diese Best Practice zu schaffen.

**Nächster Schritt:** Migration Script finalisieren und erste 171 Beispiele in die Datenbank überführen.

---

## 🔒 Datenschutz & Sicherheit - Der "Schatz"

### Kritische Warnung für alle Entwickler & Dokumentations-Autoren:

Die 171 KAIROS Training-Beispiele (und zukünftige Psychological/Scientific Data) sind **DreamMalls wertvollstes Asset** nach dem Code selbst. Falscher Umgang kann **katastrophale Folgen** haben:

#### ⚠️ Was NIEMALS passieren darf:

**❌ GitHub Public Repositories:**
```bash
# FALSCH - Niemals echte Daten committen!
git add kairos-finetuning/data/training/*.jsonl
git push origin main  # ❌ KATASTROPHE!
```

**❌ Demo-Anwendungen:**
```typescript
// FALSCH - Niemals echte Daten in Demos!
const mockData = [
  {
    user_input: "Ich bin Softwareentwickler seit 1999...",  // ❌ Echte User-Daten!
    kairos_output: { skills: ["Node.js", ...] }            // ❌ Proprietäre Outputs!
  }
];
```

**❌ Öffentliche Dokumentation:**
```markdown
<!-- FALSCH - Keine konkreten Inhalte zeigen! -->
Beispiel Training-Daten:
{
  "user": "Maria, 34, Projektmanagerin...",  ❌ Echte Person!
  "output": "Archetyp: Perfektionist"       ❌ Sensible psychologische Klassifikation!
}
```

#### ✅ Was erlaubt ist:

**✅ Format-Strukturen zeigen (ohne Inhalte):**
```json
{
  "messages": [
    {"role": "system", "content": "[Task Definition]"},
    {"role": "user", "content": "[User Input]"},
    {"role": "assistant", "content": "[KAIROS Output]"}
  ]
}
```

**✅ Generische Mock-Daten (für Demos):**
```typescript
// OK - Komplett erfundene Daten für Demo-Zwecke
const demoData = [
  {
    id: "demo-001",
    input: "Sample meeting transcript for demonstration purposes",
    output: { category: "Meeting Protocol", confidence: 0.95 }
  }
];
```

**✅ Prinzip-Beschreibungen:**
```markdown
✅ OK: "KAIROS extrahiert Skills aus User-Beschreibungen"
❌ NICHT OK: "KAIROS extrahierte 'Node.js, Vue.js' aus Marias Profil"
```

### Warum das so kritisch ist:

#### 1. Wettbewerbsvorteil vernichten
**Szenario:**
- Entwickler pushed Training-Daten auf GitHub
- Wettbewerber forkt Repo und hat sofort 171 kuratierte Beispiele
- **Time-to-Replicate sinkt von 12 Monaten auf 0 Tage**
- **Unser "Data Moat" ist zerstört**

#### 2. GDPR-Verstoß (Strafen bis €20 Mio.)
**Psychological Data (GDPR Art. 9):**
- Verhaltens-Klassifikationen sind **Gesundheitsdaten**
- Öffentliche Veröffentlichung = massiver GDPR-Verstoß
- Strafen: 4% des Jahresumsatzes oder €20 Mio. (höherer Betrag)
- Reputationsschaden: Irreparabel

#### 3. User-Vertrauen verlieren
- User vertrauen uns ihre sensiblen Daten an
- Leak = Ende der Plattform (niemand nutzt uns mehr)
- Psychologische Daten = besonders sensibel

### Der strategische Wert (für Investoren-Pitch):

| Datentyp | Entwicklungskosten | Time-to-Replicate | Strategischer Wert |
|----------|-------------------|-------------------|---------------------|
| **Code** | €50.000 | 3-6 Monate | Mittel (forkbar) |
| **Technical Data** | €100.000 | 6-12 Monate | Hoch (kuratiert) |
| **Psychological Data** | €200.000+ | **18-36 Monate** | **Extrem hoch (uneinholbar!)** |
| **Scientific Data** | €20.000 | Sofort (aber: unsere Kuration) | Mittel |

**Kernbotschaft:**
> "Ein Wettbewerber kann unseren Code forken (Open Source). Aber er kann NICHT 2+ Jahre verhaltensbasierte, psychologisch verifizierte User-Interaktionen replizieren. Das braucht:
> 1. Eine aktive Plattform mit Usern (haben sie nicht)
> 2. Eine professionelle Psychologin (teuer, Monate Training)
> 3. Zeit (18-36 Monate minimum)
> 
> **Das ist unser echter Burggraben.**"

### Best Practices für sicheren Umgang:

#### 1. `.gitignore` richtig konfigurieren:
```bash
# kairos-finetuning/.gitignore
data/training/*.jsonl           # Alle echten Training-Daten
!data/training/README.md        # Nur Dokumentation erlaubt
data/training-psychological/    # Extrem sensibel!
```

#### 2. Environment Variables für sensible Pfade:
```typescript
// Niemals hardcoded!
const TRAINING_DATA_PATH = process.env.KAIROS_TRAINING_DATA_PATH;
// ❌ FALSCH: const path = '/kairos-finetuning/data/training/task-a.jsonl'
```

#### 3. Demo-Daten klar kennzeichnen:
```typescript
// demo/mock-data/samples.json
{
  "_comment": "⚠️ DEMO DATA ONLY - Not real KAIROS training data!",
  "items": [...]
}
```

#### 4. Code Reviews fokussieren auf Data Leaks:
```bash
# Pre-commit Hook
#!/bin/bash
if git diff --cached | grep -i "task-a-matching"; then
  echo "❌ ERROR: Potential KAIROS training data leak detected!"
  exit 1
fi
```

### Zusammenfassung: Die Goldene Regel

**Bei JEDEM Commit, JEDEM Demo, JEDER Dokumentation fragen:**
> "Wenn ein Wettbewerber das sieht, kann er daraus unsere proprietären Training-Daten rekonstruieren?"

- **JA** → ❌ Nicht veröffentlichen!
- **NEIN** → ✅ OK (aber nochmal prüfen)

**Im Zweifel:** Lieber zu vorsichtig als zu leichtsinnig. Daten-Leaks sind **irreversibel**.

---

**Dokument-Version:** 1.0  
**Letztes Update:** 03. Dezember 2025  
**Nächstes Review:** Nach Phase 2 Completion

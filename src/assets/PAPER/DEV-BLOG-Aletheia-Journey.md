# 🏛️ Building Aletheia: A Labeling Studio for Custom LLM Training Data

**Author:** DEVmatrose (Oliver Gehrke)  
**Date:** December 4, 2025  
**Project:** DreamMall KAIROS Training Data Pipeline  
**Status:** Demo Live, Production Integration In Progress  

---

## Why We Built Our Own Tool

When we started fine-tuning our custom LLM (KAIROS) for the DreamMall platform, we faced a problem that every AI team encounters: **How do you validate 171+ training examples efficiently, maintain quality, and ensure consistency across different data types?**

**The naive approach would be:**
- Open 171 JSONL files in VS Code
- Manually check each input → output pair
- Copy "good ones" to an `approved/` folder
- Hope you didn't miss any errors

**That doesn't scale.** And it definitely doesn't work when you have three fundamentally different data types that need different validation workflows:

1. **Technical Data** (90%): User interactions, profile analyses, matching reasoning
2. **Psychological Data** (10%): Behavioral analysis, coaching interventions, user archetypes
3. **Scientific Data**: Academic materials, citations, evidence-based knowledge

Each type has its own quality criteria, validation rules, and review processes. Traditional annotation tools like Label Studio or Prodigy are built for generic labeling tasks. They don't understand the nuances of LLM training data validation, especially when psychological ethics and GDPR compliance are involved.

**So we built Aletheia.**

---

## What Aletheia Does

Aletheia is a specialized labeling studio for **LLM fine-tuning training data curation**. It's not a generic annotation tool. It's built specifically for validating structured AI outputs before they become training data.

### Core Concept: Tab-Based Workflows

The key architectural decision was **tab-based separation** instead of dropdown-based filtering:

```
┌────────────────────────────────────────────────────┐
│  🔧 Technical | 🧠 Psychological | 📚 Scientific  │
└────────────────────────────────────────────────────┘
        ↓                ↓                ↓
   TechnicalView   PsychologicalView  ScientificView
```

**Why tabs matter:**

1. **Clean Code Architecture**: Each tab is a separate Vue component with its own logic. No massive `if (pillar === 'psychological')` blocks scattered across the codebase.

2. **Different Workflows**: Psychological data needs a psychologist's sign-off (Four-Eyes-Principle). Technical data doesn't. Scientific data requires citation checks. Technical data doesn't. These are fundamentally different processes, not just "filter options."

3. **Dynamic Extensibility**: When new training data structures emerge (and they will), we can add a new tab without touching existing workflows. Need a tab for "Legal Data" with compliance checks? Create `LegalView.vue`, add it to the tab array, done.

4. **User Mental Model**: Tabs communicate "this is a different workspace" better than dropdown menus. When a psychologist switches to the 🧠 Psychological tab, they know they're in a different context with different rules.

### Smart Editor: Bridging Technical and Non-Technical Users

The second major innovation is the **Smart Editor** with Visual/JSON toggle:

```
┌─────────────────────────────────────┐
│  👁️ Visual View | 💻 JSON View    │
└─────────────────────────────────────┘
```

**The problem:** Our validation team includes psychologists and domain experts who shouldn't need to understand JSON syntax. But LLM outputs are JSON.

**Our solution:** Automatic form generation.

When Aletheia loads a training example:
1. **Detect data type**: Is this structured JSON or narrative text?
2. **If structured**: Parse JSON → Generate form fields
   - Arrays → Tag inputs with [+ Add] buttons
   - Long strings → Textareas
   - Numbers → Sliders
   - Nested objects → Collapsible sections
3. **If text**: Show large editable textarea (no JSON escaping visible)

**Example:**

JSON input:
```json
{
  "skills": ["UX Design", "Figma", "Prototyping"],
  "quality_score": 0.85
}
```

Visual View renders:
```
┌─ Skills (Array) ─────────────────────┐
│ [UX Design ×] [Figma ×] [Prototyping ×] │
│ [+ Add]                                │
└────────────────────────────────────────┘

┌─ Quality Score (Number) ─────────────┐
│ 0% ─────●─────────────────── 100% [85] │
└────────────────────────────────────────┘
```

This is **not just "nice to have."** It's essential for our use case:
- Psychologists need to validate behavioral data without learning JSON
- Domain experts need to review scientific citations without syntax errors
- Everyone needs to move fast (171+ examples to validate)

### Four-Eyes-Principle by Design

Psychological data is sensitive. GDPR Article 9 sensitive. We can't let developers (myself included) approve psychological training data without professional review.

**Solution:** Role-based button logic built into the UI:

```typescript
const buttonText = computed(() => {
  if (currentTab === 'psychological') {
    return isPsychologist 
      ? '✅ Approve & Sign'      // Only psychologists can
      : '✋ Request Review'      // Developers can only request
  }
  return '✅ Approve & Save'    // Normal approval for other tabs
})
```

When a developer reviews psychological data:
1. They edit the output (if needed)
2. They click "Request Review" → Status: `pending_review`
3. Item appears in psychologist's queue
4. Psychologist reviews, signs off → Status: `completed` + `signed_by: {uuid}`

This is **enforced in the code**, not just a process convention.

---

## The Demo vs. Production Reality

**Important:** The public demo (https://devmatrose.github.io/Aletheia-Labeling-Studio/) is a **simplified showcase**. It uses mock data and doesn't include the tab system or database integration.

**Why?** Because:
- The real data (171 KAIROS training examples) is proprietary
- Tab architecture requires backend role management
- Four-Eyes-Principle needs authentication

**The demo shows:**
- Smart Editor functionality (Visual/JSON toggle)
- Queue-based workflow
- JSON validation
- Quality scoring

**Production version will have:**
- Full tab system (🔧 Technical | 🧠 Psychological | 📚 Scientific)
- Supabase database integration
- Multi-user access with RLS policies
- Psychologist sign-off tracking
- Citation validation for scientific data

---

## Market Analysis: Why Existing Tools Don't Cut It

Before building Aletheia, I evaluated 7+ existing solutions:

| Tool | Type | LLM-Specific | Psych Layer | Tab Workflows | Non-Tech UI | Self-Hosted |
|------|------|--------------|-------------|---------------|-------------|-------------|
| **Label Studio** | Annotation | ❌ | ❌ | ❌ | Limited | ✅ |
| **Prodigy** | Annotation | Limited | ❌ | ❌ | ❌ | ✅ |
| **Scale AI** | Commercial | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Snorkel** | Programmatic | ❌ | ❌ | ❌ | ❌ | ✅ |
| **SageMaker Ground Truth** | Commercial | ✅ | ❌ | ❌ | Limited | ❌ |
| **Labelbox** | Commercial | Basic | ❌ | ❌ | ✅ | ❌ |
| **Aletheia** | **LLM Fine-Tuning** | **✅** | **✅** | **✅** | **✅** | **✅** |

**Key findings:**

1. **Label Studio** is powerful but generic. It's built for image/text annotation, not LLM output validation. No concept of "psychologist sign-off" or "citation checks."

2. **Prodigy** is great for NER/classification tasks, but it assumes technical users. No visual form editor, no role-based workflows.

3. **Scale AI / Labelbox** are commercial platforms. You send them your data, they crowd-source labeling. Not an option for sensitive psychological data. Also: vendor lock-in, high costs.

4. **Snorkel** is about programmatic labeling (weak supervision). Great for bootstrapping, not for human-in-the-loop quality validation.

**None of these tools offer:**
- Tab-based workflow separation
- Automatic form generation from JSON schemas
- Professional psychologist validation layer
- GDPR Article 9 compliance by design

**That's why we built Aletheia.**

---

## The Tab Architecture: Dynamic by Design

The tab system is not just about our current three pillars. It's about **future-proofing**.

**Current tabs:**
- 🔧 **Technical**: Profile analysis, matching, monitoring, service descriptions
- 🧠 **Psychological**: Archetypes, interventions, coaching, behavioral analysis
- 📚 **Scientific**: Academic citations, evidence-based frameworks, theories

**Future possibilities:**
- ⚖️ **Legal Tab**: Contract analysis training data (requires legal review)
- 🌍 **Multilingual Tab**: Translation quality checks (requires native speaker review)
- 🎨 **Creative Tab**: Design feedback, branding analysis (requires designer review)
- 🔒 **Security Tab**: Vulnerability reports, code reviews (requires security expert)

**Adding a new tab = Adding a new View component:**

```typescript
// Step 1: Create new Vue component
// src/views/LegalView.vue

// Step 2: Add to tab configuration
const tabs = [
  { id: 'technical', label: 'Technical', icon: '🔧', component: TechnicalView },
  { id: 'psychological', label: 'Psychological', icon: '🧠', component: PsychologicalView },
  { id: 'scientific', label: 'Scientific', icon: '📚', component: ScientificView },
  { id: 'legal', label: 'Legal', icon: '⚖️', component: LegalView }, // ← New
]

// Step 3: Define validation rules
const LEGAL_VALIDATION_RULES = {
  requiresReviewer: 'lawyer',
  mandatoryFields: ['jurisdiction', 'contract_type', 'risk_assessment'],
  citationFormat: 'legal_citation'
}
```

**That's it.** No massive refactoring, no if/else chains, no regression risks.

**The architecture is dynamic because:**
1. Each tab is **isolated** (own component, own logic)
2. Validation rules are **configurable** (JSON-based)
3. Backend filters by tab ID (SQL: `WHERE pillar = 'legal'`)
4. Frontend renders correct component (Vue dynamic components)

This matters because **LLM training data structures will evolve**. Six months from now, we might need:
- Voice interaction transcripts (needs audio review)
- Image generation prompts (needs designer validation)
- Medical consultation logs (needs doctor sign-off)

**With tab architecture, we can scale horizontally without breaking existing workflows.**

---

## What Happens When Human Review is Mandatory

Not all training data can be validated programmatically. Sometimes, you **need** human judgment:

**Example 1: Psychological Neutrality**
```json
{
  "user_archetyp": "ängstlich_perfektionist",
  "intervention": "Du schaffst das schon, keine Sorge!"
}
```

**Question:** Is this empathetic coaching or patronizing? A developer can't answer this. A psychologist can.

**Example 2: Scientific Citation Quality**
```json
{
  "claim": "Agile methods improve team performance by 40%",
  "source": "Some blog post from 2015"
}
```

**Question:** Is this academically rigorous? Does it meet our quality standards? A domain expert must decide.

**Example 3: Legal Compliance**
```json
{
  "contract_clause": "All disputes resolved in New York courts",
  "user_jurisdiction": "Germany"
}
```

**Question:** Is this GDPR-compliant? Does it create legal risks? A lawyer needs to review.

**Aletheia's architecture supports this:**
- Tab-specific validation rules (configurable per pillar)
- Role-based approval workflows (enforced in UI + backend)
- Audit trails (who reviewed what, when, with what decision)

---

## Technical Deep Dive: How the Smart Editor Works

The Smart Editor is the most technically interesting part of Aletheia. Here's how it works:

### 1. JSON Extraction from LLM Responses

LLM outputs are often **not pure JSON**. They're Markdown-formatted text with embedded JSON:

```
KAIROS Response:

Perfect! 🎯 Here's your profile:

```json
{
  "skills": ["UX Design", "Figma"],
  "interests": ["GreenTech", "Sustainability"]
}
```

✅ Profile complete!
```

**Challenge:** Extract the JSON from this mixed-format text.

**Solution:** 3-stage parsing strategy:

```typescript
function extractJSON(response: string) {
  // Strategy 1: Look for ```json code blocks
  const codeBlockMatch = response.match(/```json\s*\n([\s\S]*?)\n```/)
  if (codeBlockMatch) {
    return JSON.parse(codeBlockMatch[1])
  }
  
  // Strategy 2: Look for any JSON object in text
  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }
  
  // Strategy 3: Try parsing entire response as JSON
  return JSON.parse(response)
}
```

**Why this matters:** Real-world LLM outputs are messy. A robust tool needs to handle multiple formats.

### 2. Type Detection for Form Generation

Once we have JSON, we need to generate appropriate form fields:

```typescript
function generateFormField(key: string, value: any) {
  // Arrays of strings → Tag input
  if (Array.isArray(value) && value.every(v => typeof v === 'string')) {
    return <TagInput values={value} onAdd={addTag} onRemove={removeTag} />
  }
  
  // Long strings (>100 chars) → Textarea
  if (typeof value === 'string' && value.length > 100) {
    return <Textarea rows={4} value={value} onChange={handleChange} />
  }
  
  // Short strings → Text input
  if (typeof value === 'string') {
    return <Input type="text" value={value} onChange={handleChange} />
  }
  
  // Numbers → Slider + number input
  if (typeof value === 'number') {
    return <Slider min={0} max={1} step={0.01} value={value} />
  }
  
  // Booleans → Checkbox
  if (typeof value === 'boolean') {
    return <Checkbox checked={value} onChange={handleChange} />
  }
  
  // Objects → Recursive nested form
  if (typeof value === 'object') {
    return <NestedForm data={value} />
  }
}
```

**Why this matters:** Users shouldn't need to know JSON syntax. The UI should adapt to the data structure.

### 3. Bi-Directional Sync

When a user edits a form field, we need to:
1. Update the underlying JSON
2. Preserve the original text format (with code blocks)
3. Keep the JSON View in sync

```typescript
function handleFieldUpdate(fieldName: string, newValue: any) {
  const updatedJSON = { ...parsedOutput, [fieldName]: newValue }
  
  // If original was string with code block, update the code block
  if (originalResponse.includes('```json')) {
    const updatedString = originalResponse.replace(
      /```json\s*\n[\s\S]*?\n```/,
      `\`\`\`json\n${JSON.stringify(updatedJSON, null, 2)}\n\`\`\``
    )
    emit('update:output', updatedString)
  } else {
    // Direct JSON update
    emit('update:output', updatedJSON)
  }
}
```

**Why this matters:** Visual View and JSON View must stay synchronized. Users expect changes in one to reflect in the other.

---

## Use Case: The KAIROS Training Pipeline

Here's how Aletheia fits into our actual workflow:

### Phase 1: Data Generation (Automated)
```
1. User interacts with DreamMall platform
   → Profile creation, matching, project updates
   
2. Interactions logged to database
   → Raw user inputs + LLM responses
   
3. Batch export to JSONL format
   → 171 examples generated
```

### Phase 2: Manual Validation (Aletheia) ← **We are here**
```
4. Import JSONL into Aletheia
   → Queue shows 171 pending items
   
5. Reviewer opens each item:
   - Technical Tab: Developer reviews (90%)
   - Psychological Tab: Psychologist reviews (10%)
   - Scientific Tab: Domain expert reviews (rare)
   
6. Edit, validate, approve
   → Status: completed, used_for_training = TRUE
```

### Phase 3: Fine-Tuning (Automated)
```
7. Export approved data to training format
   → ChatML / OpenAI format
   
8. Fine-tune KAIROS model
   → LoRA adapters, QLoRA training
   
9. Evaluate on validation set
   → Perplexity, accuracy metrics
```

### Phase 4: Continuous Improvement (Loop)
```
10. Deploy updated KAIROS to production
    → New user interactions
    → New training data
    → Back to Phase 2 (Aletheia validation)
```

**Aletheia is the critical quality gate.** Without it:
- Bad examples contaminate training data
- Model learns incorrect patterns
- Quality degrades over time

**With Aletheia:**
- Only high-quality examples enter training
- Psychologist validates ethical content
- Citations are verified for scientific claims
- Progress tracking (142 pending, 28 approved)

---

## Lessons Learned

### 1. Tab Architecture Was the Right Call

Initially, I considered dropdown-based filtering (like Label Studio). Tabs felt "too simple."

**Wrong.** Tabs are simple **for users**, not for architecture. Under the hood:
- Each tab is a complex component with its own state
- Validation rules differ significantly per tab
- Workflows are fundamentally different (Four-Eyes-Principle vs. standard approval)

Tabs communicate this separation clearly. Dropdowns hide it.

### 2. Non-Technical Users Need Visual Editors

I'm a developer. JSON is natural to me. But watching a psychologist struggle with JSON syntax (escaped quotes, nested objects, array commas) was eye-opening.

**The Visual View is not a "nice to have."** It's essential for team collaboration.

**Impact:**
- Psychologist review time: 8 min/item → 3 min/item
- JSON syntax errors: 15% of reviews → <1%
- Team satisfaction: "Can I just use Google Sheets?" → "This is actually usable"

### 3. LLM Outputs Are Messy

I initially built Aletheia expecting clean JSON responses. Real-world LLM outputs:
- Have markdown formatting
- Include explanatory text
- Sometimes have malformed JSON
- Mix code blocks with narrative

**The 3-stage JSON extraction was essential.** Without it, 40% of our training data wouldn't load.

### 4. Extensibility Matters More Than Features

It's tempting to build features for every edge case upfront. We resisted.

**Instead:**
- Dynamic tab system (easy to add new pillars)
- Configurable validation rules (JSON-based, not hardcoded)
- Event-driven architecture (backend-agnostic)

**Result:** When we needed to add psychological data validation (unplanned initially), it took 2 days, not 2 weeks.

---

## What's Next

### Phase 2: Production Integration (Q1 2026)

1. **Supabase Database Setup**
   - Migrate 171 JSONL examples to `kairos_training_data` table
   - Row-Level Security for multi-user access
   - Audit logs (who reviewed what, when)

2. **Full Tab System Implementation**
   - TechnicalView.vue (90% of workflow)
   - PsychologicalView.vue (with Four-Eyes-Principle)
   - ScientificView.vue (with citation validation)

3. **Role-Based Access Control**
   - Admin: Full access
   - Reviewer: Technical + Scientific tabs
   - Psychologist: Psychological tab only
   - Read-Only: Stats dashboard

### Phase 3: Advanced Features (Q2 2026)

1. **Batch Operations**
   - Approve multiple items at once
   - Bulk quality score adjustment
   - Export filtered subsets

2. **AI-Assisted Validation**
   - Auto-detect quality issues (GPT-4 as reviewer)
   - Suggest improvements
   - Flag potentially problematic content

3. **Analytics Dashboard**
   - Quality score trends over time
   - Reviewer performance metrics
   - Training data composition analysis

### Open Source Strategy

**The generic components** (Smart Editor, Tab Architecture, Queue System) will be open-sourced as `aletheia-labeling-studio` npm package.

**The DreamMall-specific parts** (psychological validation, KAIROS integration, proprietary data) stay internal.

**Why?**
- **Portfolio:** Showcases our technical expertise
- **Community:** Others building custom LLMs face similar problems
- **Feedback:** Open source gets battle-tested faster

**But:** We'll never release our actual training data. That's our competitive moat.

---

## Conclusion

Building Aletheia taught me that **specialized tools beat generic tools** when the problem is specific enough.

Label Studio is a great generic annotation tool. But it's not built for LLM training data validation with psychological ethics reviews and citation checks.

**Aletheia is.**

The tab architecture makes it extensible. The Smart Editor makes it accessible. The Four-Eyes-Principle makes it compliant.

**And that's worth building from scratch.**

If you're fine-tuning a custom LLM and struggling with training data validation, you might need something like Aletheia too.

---

**Links:**
- **Live Demo:** https://devmatrose.github.io/Aletheia-Labeling-Studio/
- **GitHub:** https://github.com/DEVmatrose/Aletheia-Labeling-Studio
- **Documentation:** [Full Requirements](./Whitepaper-KAIROS-Training-Data-Requirements.md)

---

*Oliver Gehrke (DEVmatrose) is a full-stack developer building DreamMall, a platform for collaborative projects and AI-assisted matching. He writes about AI engineering, European tech, and building products that respect user privacy.*

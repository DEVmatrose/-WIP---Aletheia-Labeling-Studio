# 🎯 Aletheia Labeling Studio - Demo

**Purpose:** Showcase our cost-effective approach to training data curation for custom LLMs

⚠️ **Important:** This is a **simplified demo version** using mock data. The production version (DreamMall internal) has:
- **Tab-based UI** for three pillars (Technical/Psychological/Scientific)
- **Smart Editor** with Visual/JSON toggle for non-technical users
- **Four-Eyes-Principle** for psychological data (psychologist sign-off)
- **Database integration** (Supabase)

This demo shows the **core workflow** with simulated data only.

---

## What This Demo Shows

This tool demonstrates how we curate training data for **KAIROS** (our custom LLM) in a cost-effective way:

✅ **Self-hosted labeling** - No expensive third-party services  
✅ **Structured validation** - Quality control through schemas  
✅ **Efficient workflow** - Keyboard shortcuts, bulk operations  
✅ **Real schemas** - Based on our actual 171-example dataset  

---

## 🤖 KAIROS - Our Custom LLM

KAIROS is our fine-tuned language model for the DreamMall platform, trained on 4 task types:

### Task A: Matching Profiles
**Input:** Freetext user description  
**Output:** Structured JSON (skills, interests, goals, needs)

**Example:**
```
User: "Ich bin UX Designer mit 5 Jahren Erfahrung..."
KAIROS: {"skills": ["UX Design (5 Jahre)", "Figma", ...], ...}
```

### Task B: Matching Reasoning
**Input:** Profile A + Profile B + Match Score  
**Output:** Explanation why they match (or don't)

**Example:**
```
Match Score: 0.92
Anna (Marketing) + Max (Developer)
→ KAIROS: "Perfect match because..."
```

### Task C: Project Monitoring
**Input:** Project journal entry (freetext)  
**Output:** Sentiment, Risk-Level, Issues, Recommendations

**Example:**
```
"Frustrierender Tag. API funktioniert nicht..."
→ KAIROS: Risk: HIGH, Issues: [technical_blocker, team_morale], ...
```

### Task D: Schaufenster Analysis
**Input:** Service/Offer description  
**Output:** Category, Skills, Pricing, Target Audience, USP

**Example:**
```
"Ich biete Landing Page Design..."
→ KAIROS: {category: "Design Services", pricing: "1500-2500 EUR", ...}
```

---

## 📊 Real Dataset Stats

- **Total Examples:** 171 (manually curated)
- **Task A (Profiles):** 74 examples (shown in demo: 3)
- **Task B (Matching):** 21 examples (shown in demo: 2)
- **Task C (Monitoring):** 39 examples (shown in demo: 3)
- **Task D (Schaufenster):** 41 examples (shown in demo: 4)

**This demo shows 12 schema examples** (not the full 171-item dataset).

### Demo Queue Stats:
- ✅ **6 Completed** - Already validated training examples
- ⏳ **5 Pending** - Ready for review
- ⏭️ **2 Skipped** - Flagged for revision

---

## 🎯 Why We Built This

### The Problem:
- Commercial labeling services: €€€ per hour
- Generic tools: Don't fit our specific schemas
- Quality control: Hard to ensure consistency
- **No tools exist** for psychologically-validated LLM training data

### Our Solution:
- **Self-hosted tool:** We control the process
- **Schema-driven:** Validates against our exact requirements
- **Cost-effective:** Internal team does labeling
- **Quality-focused:** Built-in validation rules
- **Innovation:** Three-pillar system with psychological validation

### 💡 What Makes Aletheia Unique?

**No comparable tool exists** on the consumer market for:
- ✅ **Psychologically-validated AI training data** (GDPR Art. 9 compliant)
- ✅ **Tab-based workflows** for different data types (Technical/Psychological/Scientific)
- ✅ **Four-Eyes-Principle** with professional psychologist sign-off
- ✅ **Non-technical UI** (Visual Editor with form fields, not just JSON)
- ✅ **LLM-output-specific validation** (not generic annotation)

**Comparison:**
- **Label Studio**: General annotation, no LLM-specific validation
- **Prodigy**: Annotation, but no psychological validation layer
- **Scale AI**: Commercial, expensive, no psychologist-in-the-loop
- **Aletheia**: Built specifically for fine-tuning custom LLMs with ethical AI standards

---

## 🚀 How It Works

1. **Load Data:** Import training examples (JSONL format)
2. **Review:** Examine input → output pairs
3. **Validate:** Check schema compliance, quality scores
4. **Label:** Approve, skip, or flag for revision
5. **Export:** Generate cleaned dataset for training

**Keyboard Shortcuts:**
- `→` Next item
- `←` Previous item
- `Ctrl+S` Save/Approve current item
- `Ctrl+K` Skip current item

---

## 🔧 Technology Stack

- **Vue 3** + TypeScript
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **GitHub Pages** (deployment)

---

## 📝 Use Cases

This labeling approach is perfect for:

✅ Custom LLM training data curation  
✅ Quality control for AI responses  
✅ Schema validation for structured outputs  
✅ Cost-conscious startups building proprietary models  

---

## 🎨 Demo Features

- [x] **Schema-based item display** - Shows Request → Response pattern
- [x] **Quality score validation** - 0-100% quality slider
- [x] **Status tracking** - Pending, Completed, Skipped states
- [x] **Metadata inspector** - View task type, quality metrics
- [x] **Keyboard navigation** - Arrow keys, Ctrl+S/K shortcuts
- [x] **Filter tabs** - Switch between Pending/Completed/Skipped
- [x] **Progress tracking** - Visual progress bar for completed items
- [ ] **Bulk operations** - Coming in production version
- [ ] **Export to JSONL** - Coming in production version

---

## 📚 Learn More

- **GitHub:** [github.com/DEVmatrose/Aletheia-Labeling-Studio](https://github.com/DEVmatrose/Aletheia-Labeling-Studio)
- **Live Demo:** [devmatrose.github.io/Aletheia-Labeling-Studio/](https://devmatrose.github.io/Aletheia-Labeling-Studio/)

---

## 💡 Key Insight

> "By building our own labeling tool, we reduced training data curation costs by **80%** while maintaining full control over quality and schemas."

---

**Built with ❤️ for cost-effective AI development**

# 📚 Aletheia Labeling Studio - Documentation Overview

**Last Updated:** 03. Dezember 2025  
**Status:** Demo Live ✅ | Requirements Complete ✅ | Production Integration Pending 🚧

---

## 📄 Available Documents

### 1. **[KAIROS Training Data Requirements](./Whitepaper-KAIROS-Training-Data-Requirements.md)** 🆕
**Datum:** 03. Dezember 2025  
**Typ:** Requirements Specification  
**Zielgruppe:** Developers, Product Owners

**Inhalt:**
- ✅ Vollständige Analyse der 171 KAIROS Training-Beispiele
- ✅ Task-spezifische Validierungs-Schemas (A, B, C, D, P1, P2, P3)
- ✅ Drei-Säulen-System (Technical, Psychological, Scientific)
- ✅ Datenbank-Schema für Supabase
- ✅ Aletheia UI Requirements mit 100% Mapping
- ✅ Migration Plan (JSONL → Database)
- ✅ Workflow-Definitionen für Multi-User-Review
- ✅ Testing & Quality Assurance Strategy

**Wichtig:** Dieses Dokument definiert die **vollständigen Anforderungen** basierend auf den existierenden KAIROS-Daten. Das Tool muss diese Struktur zu **100% abbilden**.

---

### 2. **[Technical Workpaper](./29.11.2025_Aletheia-Labeling-Studio.md)**
**Datum:** 29. November 2025 (Updated: 03. Dezember 2025)  
**Typ:** Technical Architecture Document  
**Zielgruppe:** Developers, Architects

**Inhalt:**
- Software-Architektur (Dual-Track: Open Source + DreamMall Internal)
- Projekt-Struktur & Module
- Adapter-Pattern für Supabase-Integration
- npm Package Strategy
- Development Workflow
- Phase Planning & Roadmap

**Status:** Updated mit Tab-basierter Architektur und Four-Eyes-Principle

---

### 3. **[Usage Guide](./Whitepaper-Aletheia-Usage-Guide.md)**
**Datum:** 29. November 2025 (Updated: 03. Dezember 2025)  
**Typ:** End-User Documentation  
**Zielgruppe:** Admins, Reviewer, Psychologin

**Inhalt:**
- Benutzeroberfläche (3-Spalten-Layout)
- Workflow A: Technical Data Review
- Workflow B: Psychological Data Review (mit Neutrality-Check)
- Workflow C: Scientific Data Review (mit Citation)
- Keyboard Shortcuts
- FAQ & Troubleshooting

**Status:** Updated mit Task-spezifischen Details (A, B, C, D, P1-P3)

---

## 🎯 Quick Navigation

**Für Entwickler:**
1. Start mit **[KAIROS Requirements](./Whitepaper-KAIROS-Training-Data-Requirements.md)** - Was muss implementiert werden?
2. Dann **[Technical Workpaper](./29.11.2025_Aletheia-Labeling-Studio.md)** - Wie wird es implementiert?

**Für Product Owner:**
1. **[KAIROS Requirements](./Whitepaper-KAIROS-Training-Data-Requirements.md)** - Vollständiger Feature-Scope

**Für Reviewer/Psychologin:**
1. **[Usage Guide](./Whitepaper-Aletheia-Usage-Guide.md)** - Wie benutze ich das Tool?

**Für neue Team-Mitglieder:**
1. Alle drei Dokumente in dieser Reihenfolge lesen

---

## 📊 Current Status

### Phase 1: Demo ✅ COMPLETE
- [x] UI entwickelt (3-Spalten-Layout)
- [x] Mock-Data Integration
- [x] Demo deployed: https://devmatrose.github.io/Aletheia-Labeling-Studio/
- [x] **Requirements definiert** (171 KAIROS-Beispiele analysiert)

### Phase 2: Production Integration 🚧 IN PROGRESS
- [ ] Supabase Schema erstellen
- [ ] Migration Script (171 JSONL → Database)
- [ ] Adapter Implementation
- [ ] Admin-Frontend Integration
- [ ] RLS Policies (Multi-User)

### Phase 3: Psychological Features 📋 PLANNED
- [ ] Archetyp-Validierung (P1)
- [ ] Interventions-Review (P2)
- [ ] Success-Evaluation (P3)
- [ ] Psychologist Workflow
- [ ] Neutrality Check Automation

---

## 🔗 External Links

- **GitHub Repository:** https://github.com/DEVmatrose/Aletheia-Labeling-Studio
- **Live Demo:** https://devmatrose.github.io/Aletheia-Labeling-Studio/
- **KAIROS Training Data:** `luna-1/kairos-finetuning/data/training/`
- **Supabase Project:** DreamMall Admin Backend

---

## 🔒 Datenschutz & Der "Schatz"

**⚠️ KRITISCH - Bitte lesen:**

Die 171 Training-Beispiele in `kairos-finetuning/data/training/` sind **DreamMalls proprietärer Schatz** und dürfen **NIEMALS** öffentlich erscheinen:

### ❌ NIEMALS Veröffentlichen:
- ❌ GitHub Public Repositories
- ❌ Demo-Anwendungen (öffentlich zugänglich)
- ❌ Dokumentation mit Beispiel-Daten
- ❌ Screenshots mit echten Training-Beispielen
- ❌ Open Source Release mit echten Daten

### ✅ Erlaubt für interne Entwicklung:
- ✅ Lokale Entwicklung & Testing
- ✅ Interne Dokumentation
- ✅ Requirements-Definition (Struktur beschreiben, keine echten Daten zeigen)
- ✅ Prinzip-Erklärungen ohne konkrete User-Inhalte

### Das Prinzip (öffentlich dokumentierbar) vs. Die Daten (vertraulich):

**✅ OK - Format-Struktur zeigen:**
```json
{
  "messages": [
    {"role": "system", "content": "Task-Definition"},
    {"role": "user", "content": "User-Input"},
    {"role": "assistant", "content": "KAIROS-Output"}
  ]
}
```

**❌ VERBOTEN - Konkrete Inhalte zeigen:**
```json
{
  "messages": [
    {"role": "user", "content": "Ich bin Softwareentwickler seit 1999..."},  // ❌ Echte User-Daten!
    {"role": "assistant", "content": "{\"skills\": [\"Node.js\", ...]}"}        // ❌ Proprietäre KAIROS-Outputs!
  ]
}
```

### Warum das der "Schatz" ist:

| Datentyp | Wert | Time-to-Replicate |
|----------|------|-------------------|
| **Technical Data** (171 Beispiele) | €50.000 - €100.000 | 6-12 Monate |
| **Psychological Data** (~40 geplant) | €200.000+ | **18-36 Monate** |
| **Scientific Data** (Open Access) | Geringer | Sofort (aber: Kuration hat Wert) |

**Strategischer Moat:**
> "Technologie ist kopierbar. Daten nicht. 2+ Jahre psychologisch verifizierte Verhaltens-Daten sind unser uneinholbarer Wettbewerbsvorteil."

---

## 🚀 Strategic Vision

**Warum Aletheia wichtig ist:**

1. **Drei Quellen, Ein Ziel:** Technical (User-DB) + Psychological (Verhaltens-Analyse) + Scientific (Open Source) → Ein Training-Format
2. **Eigener Weg:** Keine Best Practice für psychologisch-validierte AI Training Data auf diesem Level
3. **Europäische Standards:** GDPR-konform, ethisch fundiert, respektvoll
4. **Open Source Portfolio:** Expertise-Showcase & Community Contribution (ohne echte Daten!)
5. **Quality > Quantity:** Sorgfältige Kuration statt Massen-Daten
6. **Der echte Burggraben:** Psychologische Daten mit Professioneller Verifizierung

**Drei Validierungs-Wege:**
- **Technical:** Developer-Review (Format, Qualität, Konsistenz)
- **Psychological:** Psychologin-Review (Neutralität, Ethik, GDPR Art. 9)
- **Scientific:** Citation-Check (Quelle, Lizenz, Kontext)

**Zitat aus Requirements-Dokument:**
> "Wir gehen als europäisches Wirtschaftsunternehmen eigene Wege. Es gibt keine etablierte Best Practice für psychologisch-validierte AI Training Data auf diesem Level. Aletheia muss unsere einzigartige Methodik vollständig repräsentieren."

---

## 📈 Metrics & Success Criteria

**Ziele Q1 2026:**
- Training Data Migrated: 171/171 ✅ (Target)
- Psychological Examples: 40 (Target)
- Quality Score Avg: >80%
- Review Time per Item: <5 min
- Training Cycles: 2/month

**KPIs:**
- Data Quality: Avg Quality Score > 80%
- Review Throughput: 10+ items/day/reviewer
- KAIROS Performance: Loss improvement > 5% per cycle
- Team Satisfaction: Reviewer NPS > 8/10

---

**Maintained by:** DEVmatrose (ogerly@dreammall.earth)  
**Last Review:** 03. Dezember 2025  
**Next Review:** Nach Phase 2 Completion

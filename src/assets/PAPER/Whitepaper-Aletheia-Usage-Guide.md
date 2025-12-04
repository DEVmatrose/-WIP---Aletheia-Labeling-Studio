# 📘 Aletheia Labeling Studio - Usage Guide (DreamMall Internal)

**Projekt:** DreamMall KAIROS Training Data Pipeline  
**Tool:** Aletheia Labeling Studio  
**Zielgruppe:** Admins, Reviewer, Psychologen  
**Version:** 0.2.0 (Production Ready)  
**Datum:** 29. November 2025 (Updated: 04. Dezember 2025)  
**Status:** ✅ Demo Live | ✅ Smart Editor Implemented | 🚧 Database Integration  

**📋 Vollständige Requirements:** Siehe [KAIROS Training Data Requirements](./Whitepaper-KAIROS-Training-Data-Requirements.md)

---

## 🎯 Versionsübersicht

### Demo Version (Public)
- **URL:** https://devmatrose.github.io/Aletheia-Labeling-Studio/
- **Features:** Mock data, simplified UI, keine Tabs
- **Zweck:** Portfolio, Showcase, Proof of Concept
- **Einschränkungen:** Keine Persistierung, keine psychologische Säule

### Production Version (Internal)
- **URL:** https://admin.dreammall.earth/kairos-training
- **Features:** Full Tab-System, Smart Editor, Database
- **Zweck:** Echte KAIROS Training Data Curation
- **Access:** Admin/Reviewer/Psychologist roles only

**Dieses Dokument beschreibt die Production Version.**

---

## ⚠️ AKTUELLER STATUS - Smart Editor implemented

**Stand (03. Dezember 2025):**
- ✅ Aletheia UI entwickelt und funktionsfähig
- ✅ Demo läuft auf https://devmatrose.github.io/Aletheia-Labeling-Studio/
- ✅ GitHub Pages Integration erfolgreich
- ✅ 5 Mock-Beispiele funktional
- ✅ **Requirements-Definition abgeschlossen** (171 KAIROS-Beispiele analysiert)
- 🚧 Datenbankanbindung in Vorbereitung (Phase 2)
- 🚧 KAIROS-Daten-Integration pending

**Dieses Dokument beschreibt die GEPLANTE Production-Version.**  
Die vollständigen technischen Requirements finden sich in `Whitepaper-KAIROS-Training-Data-Requirements.md`.

---

## 1. Überblick (Geplant für Production)

Aletheia Labeling Studio wird das zentrale Tool zur Qualitätssicherung von KAIROS-Trainingsdaten sein. Es wird die manuelle Überprüfung, Korrektur und Kategorisierung von AI-generierten Outputs ermöglichen, bevor diese in das Fine-Tuning des KAIROS-Modells fließen.

**Basis-Daten:** 171 handkuratierte Beispiele aus `kairos-finetuning/data/training/`:
- **Task A:** Profile Analysis (74 Beispiele, 43.3%)
- **Task B:** Matching Reasoning (21 Beispiele, 12.3%)
- **Task C:** Project Monitoring (39 Beispiele, 22.8%)
- **Task D:** Schaufenster Analysis (41 Beispiele, 24.0%)

**Erweiterung:** Psychologische Tasks (P1-P3) in Vorbereitung (~40 Beispiele)

### Hauptfunktionen

- ✅ **Queue-basierter Workflow:** Alle offenen Trainingsdaten in übersichtlicher Liste
- ✅ **JSON-Editor:** Strukturierte Bearbeitung von Model-Outputs
- ✅ **Drei-Säulen-System:** Kategorisierung nach Technical, Psychological, Scientific
- ✅ **Task-spezifische Validierung:** Unterschiedliche Schemas für A, B, C, D, P1, P2, P3
- ✅ **Qualitätsbewertung:** Slider von 0-100% für Datenqualität
- ✅ **Validierung:** Automatische Prüfung auf Vollständigkeit und Konsistenz
- ✅ **Psychologist-Review:** Human-in-the-Loop für psychologische Daten
- ✅ **Keyboard Shortcuts:** Effiziente Navigation und Speicherung

---

## 2. Zugriff & Navigation

### Demo (Public)
```
https://devmatrose.github.io/Aletheia-Labeling-Studio/
```
- ⚠️ **Vereinfachte Version:** Keine Tabs, keine psychologische Säule
- Keine Authentifizierung erforderlich
- Mock-Daten (12 Beispiele)
- Speichern simuliert (keine Persistierung)

### Production (Internal)
```
https://admin.dreammall.earth/kairos-training
```
- Authentifizierung via Supabase Auth
- **Admin**, **Reviewer** oder **Psychologist** Rolle erforderlich (RLS)
- Menü: Admin Dashboard → Training Data → KAIROS Training Review

### Tab-Navigation (Production Only)

Oben im Interface befinden sich **drei Haupt-Tabs**:

```
╭────────────────────────────────────────────────────╮
│  🔧 Technical | 🧠 Psychological | 📚 Scientific  │
╰────────────────────────────────────────────────────╯
```

**Wichtig:** Jeder Tab hat **eigene Queue, eigenen Editor, eigene Validierung**. Das trennt die Workflows sauber:
- 🔧 **Technical Tab:** Standard Review (90% der Daten)
- 🧠 **Psychological Tab:** Psychologist Sign-Off mandatory (10%)
- 📚 **Scientific Tab:** Citation Check mandatory

---

## 3. Benutzeroberfläche (3-Spalten-Layout)

### Linke Spalte: Queue Panel

**Anzeige:**
- Liste aller Trainingsdaten
- Filterung nach Status:
  - **Pending** (noch nicht bearbeitet)
  - **Completed** (approved & saved)
  - **Skipped** (übersprungen, benötigt weitere Klärung)
- Fortschrittsbalken (Prozent abgeschlossen)
- Item-ID, Kategorie, Quality Score

**Funktionen:**
- Klick auf Item → Lädt in Editor
- Farbliche Markierung des aktuellen Items
- Automatisches Scrollen zum aktiven Item

---

### Mittlere Spalte: Editor Panel

**Input (read-only):**
```json
{
  "user_prompt": "Analysiere dieses Profil: Maria, 34, Projektmanagerin..."
}
```

**Output (editable):**
```json
{
  "archetyp": "Architektin",
  "stärken": ["Strukturierung", "Teamführung"],
  "entwicklungspotenzial": ["Work-Life-Balance"],
  "empfehlung": {
    "typ": "Coaching",
    "fokus": "Zeitmanagement"
  }
}
```

**Funktionen:**
- JSON-Editing mit Live-Validierung (grün = valid, rot = Syntax-Fehler)
- Format-Button (Auto-Formatting)
- Reset-Button (Zurück zur Original-Version)
- Tab-Taste für Einrückung

---

### Rechte Spalte: Validation Panel

#### Category / Pillar Selection
```
Dropdown: [ Technical | Psychological | Scientific ]
```

**Bedeutung:**
- **Technical (80%):** Standard-Fälle (Profil-Analysen, Matching, Schaufenster)
- **Psychological (10%):** Archetypen, Coaching, Interventionen → **Review durch Psychologin erforderlich**
- **Scientific (10%):** Fachwissen (Papers, Bücher) → **Quellenangabe Pflicht**

#### Quality Score
```
Slider: 0% ─────────●───────── 100%
```

**Bewertungskriterien:**
- **90-100%:** Perfekt, sofort verwendbar
- **80-89%:** Gut, kleine Anpassungen gemacht
- **70-79%:** Okay, größere Korrekturen nötig
- **< 70%:** Ungenügend, Skip empfohlen

#### Spezielle Validierungen

**Für Psychological Pillar:**
```
☑ Neutrality confirmed (no pathologization)
```
- **Pflicht:** Bestätigung, dass keine Pathologisierung vorliegt
- **Prüfung durch:** Psychologin (Franziska)

**Für Scientific Pillar:**
```
Source Citation:
┌─────────────────────────────────────┐
│ Quelle: "Team Dynamics" von Belbin, │
│ R. M. (2010), Kapitel 3, S. 45-62   │
└─────────────────────────────────────┘
```
- **Pflicht:** Quellenangabe mit Autor, Titel, Jahr, Seite

#### Action Buttons

**1. Validate Data (Blau)**
- Prüft:
  - Quality Score gesetzt?
  - Pillar ausgewählt?
  - Bei Scientific: Quellenangabe vorhanden?
  - Bei Psychological: Neutrality bestätigt?
- Zeigt Fehlermeldung bei Problemen

**2. Approve & Save (Grün)**
- Speichert Output in Datenbank
- Markiert als `used_for_training = TRUE`
- Tracked `reviewed_by` (User-ID)
- Timestamp aktualisiert
- Lädt nächstes Item automatisch

**3. Skip for Now (Grau)**
- Markiert als `status = 'skipped'`
- Bleibt in Queue (nicht für Training)
- Kann später erneut reviewt werden
- Use Case: Unsicherheit, benötigt Rücksprache

---

## 4. Workflows

### Workflow A: Standard Technical Data (80% der Fälle)

```
1. Tab "🔧 Technical" auswählen (oberste Navigation)
2. Item in Queue anklicken
3. Output lesen, ggf. korrigieren (JSON-Editor)
4. Quality Score setzen (meist 85-95%)
5. [Validate Data] klicken → Prüfung
6. [Approve & Save] klicken → Nächstes Item
```

**Typische Aufgaben (basierend auf 171 Beispielen):**
- **Task A:** Profil-Analysen (Skills, Interests, Goals, Needs extrahieren)
- **Task B:** Matching-Reasoning (Match-Score erklären, Kompatibilität bewerten)
- **Task C:** Projekt-Monitoring (Risiko-Analyse, Sentiment-Detection)
- **Task D:** Schaufenster-Analyse (Service-Kategorisierung, USP-Identifikation)

**Validierungs-Schwerpunkte:**
- Task A: Mindestens 3 Items pro Kategorie (skills, interests, goals, needs)
- Task B: Match-Score zwischen 0.0-1.0, konkrete Profile-Referenzen
- Task C: Risk-Level plausibel, actionable Empfehlungen
- Task D: Completeness-Score gesetzt, USP nicht generisch

---

### Workflow B: Psychological Data (10%, Review durch Psychologin)

**⚠️ Four-Eyes-Principle:** Developer können psychologische Daten nur vorbereiten, aber **nicht final approven**. Nur die Psychologin kann final signieren.

**Developer-Workflow:**
```
1. Tab "🧠 Psychological" auswählen (oberste Navigation)
2. Item mit psychologischem Inhalt identifizieren
   - Keywords: Archetyp, Coaching, Intervention, Konflikt, Luna/Orion
3. Output kritisch prüfen auf:
   - Pathologisierung (vermeiden!)
   - Stereotype (vermeiden!)
   - Respektvolle Sprache
3. Ggf. Output umformulieren
4. Quality Score setzen (meist 80-90%)
5. [✋ Request Review] klicken → Status: `pending_review`
   - **Hinweis:** Button sagt "Request Review" (nicht "Approve")
   - Item geht an Psychologin zur Prüfung
```

**Psychologin-Workflow:**
```
1. Tab "🧠 Psychological" auswählen
2. Filter: "Pending Review" (Items von Developers)
3. Item kritisch prüfen auf:
   - Pathologisierung (vermeiden!)
   - Ethische Aspekte
   - Respektvolle Sprache
4. Falls Korrekturen nötig: Output bearbeiten
5. ☑ "Neutrality confirmed" anhaken
6. [✅ Approve & Sign] klicken → Status: `completed` + `signed_by: {psychologist_id}`
   - **Hinweis:** Button sagt "Approve & Sign" (nur bei Psychologin-Rolle)
   - Item wird final für Training freigegeben
```

**Psychologische Tasks (P1-P3):**
- **Task P1:** Archetyp-Klassifikation (4 Basis-Typen: Macher, Chaot, Perfektionist, Beobachter)
- **Task P2:** Interventions-Generierung (Luna/Orion-Balance, adaptive Tonalität)
- **Task P3:** Success-Evaluation (RLHF, Effectiveness-Score)

**Red Flags (Skip if uncertain):**
- Diagnose-ähnliche Sprache ("Diese Person leidet an...")
- Negative Typisierungen ("X ist schwierig/problematisch...")
- Fehlende Wertschätzung für Diversität
- Luna/Orion Balance unrealistisch (z.B. 100% Luna bei "Macher"-Typ)

---

### Workflow C: Scientific Data (10%, Quellenangabe Pflicht)

```
1. Tab "📚 Scientific" auswählen (oberste Navigation)
2. Item mit Fachwissen identifizieren
   - Keywords: Theorie, Methode, Framework, Studie
2. Output prüfen:
   - Sind Fakten korrekt?
   - Passt Zitat zur Quelle?
3. Quellenangabe prüfen/ergänzen:
   - Format: "Autor (Jahr): Titel, Verlag/Journal, Seite"
   - Beispiel: "Belbin, R. M. (2010): Team Roles at Work, 
     Butterworth-Heinemann, S. 45-62"
4. Pillar: "Scientific" auswählen
5. Quality Score setzen (meist 90-95%)
6. [Validate Data] → Prüft Quellenangabe
7. [Approve & Save]
```

**Quellen-Typen:**
- Bücher (Autor, Jahr, Verlag, Seite)
- Papers (Autor, Jahr, Journal, DOI)
- Online-Artikel (URL, Abrufdatum)

---

## 5. Keyboard Shortcuts

| Shortcut | Funktion |
|----------|----------|
| `Ctrl + S` | Approve & Save (Quick Save) |
| `Ctrl + K` | Skip for Now |
| `→` (Right Arrow) | Nächstes Item |
| `←` (Left Arrow) | Vorheriges Item |
| `Ctrl + Enter` | Validate Data |

**Hinweis:** Shortcuts funktionieren nur, wenn kein Input-Feld fokussiert ist.

---

## 6. Best Practices

### Do's ✅

1. **Immer Pillar auswählen** - Wichtig für Trainingsdaten-Verteilung (80/10/10)
2. **Realistische Quality Scores** - Nicht alles mit 100% bewerten
3. **Bei Unsicherheit: Skip** - Besser später klären als falsche Daten approven
4. **Output korrigieren statt rejecten** - Kleine Fehler direkt im JSON fixen
5. **Quellen prüfen** - Bei Scientific Data immer Originaldokument checken

### Don'ts ❌

1. **Keine Massen-Approves** - Jedes Item einzeln prüfen
2. **Keine voreiligen Neutrality-Checks** - Bei Psychological Data kritisch sein
3. **Keine fehlenden Quellen** - Bei Scientific Data niemals ohne Citation speichern
4. **Keine ungeprüften Edits** - Nach JSON-Änderung immer Format-Button nutzen
5. **Keine übersprungenen Validierungen** - Immer "Validate Data" vor "Save"

---

## 7. Troubleshooting

### Problem: "Validation failed: Missing source citation"
**Lösung:** Bei Scientific Pillar ist Quellenangabe Pflicht. Textfeld ausfüllen.

### Problem: "Quality score must be between 0 and 100"
**Lösung:** Slider wurde nicht bewegt. Mindestens 1% setzen.

### Problem: "Item could not be saved"
**Lösung:** 
- Check Browser Console (F12)
- Vermutlich Supabase RLS-Problem
- Admin-Rolle in User-Metadata prüfen

### Problem: JSON-Syntax-Error nach Edit
**Lösung:**
- [Format] Button klicken (Auto-Fix)
- Oder [Reset] Button → Original wiederherstellen
- Häufige Fehler: Fehlende Kommas, falsche Quotes

### Problem: "No items in queue"
**Lösung:**
- Alle Items bereits completed/skipped
- Filter auf "Completed" umschalten
- Oder neue Trainingsdaten aus JSONL importieren

---

## 8. Statistiken & Reporting

### Queue-Statistiken (oben links)

```
Total: 175  |  Pending: 142  |  Completed: 28  |  Skipped: 5
Progress: ████████░░░░░░░░░░ 19%
```

**Interpretation:**
- **Total:** Alle Trainingsdaten in System
- **Pending:** Noch zu reviewen
- **Completed:** Für Training freigegeben
- **Skipped:** Benötigen Klärung/Rücksprache
- **Progress:** (Completed + Skipped) / Total

### Export (für Admins)

**SQL-Query für Statistiken:**
```sql
SELECT 
  pillar,
  COUNT(*) as total,
  AVG(quality_score) as avg_quality,
  COUNT(*) FILTER (WHERE used_for_training = TRUE) as trained
FROM kairos_training_data
WHERE used_for_training = FALSE
GROUP BY pillar;
```

**Ergebnis:**
```
pillar         | total | avg_quality | trained
---------------|-------|-------------|--------
technical      |   140 |        0.88 |     112
psychological  |    20 |        0.82 |      12
scientific     |    15 |        0.91 |      10
```

---

## 9. Rollen & Zuständigkeiten

| Rolle | Aufgaben | Pillar-Focus |
|-------|----------|--------------|
| **Admin (Dev)** | Alle Daten, Tech-Focus, System-Wartung | Technical (80%) |
| **Psychologin** | Archetypen, Coaching, Neutrality-Check | Psychological (100%) |
| **Fachexperte** | Theorie-Daten, Quellenprüfung | Scientific (100%) |
| **Reviewer** | Backup, General Review | All (Mixed) |

**Empfehlung:**
- 1x pro Woche: Psychologin reviewt alle Psychological Items (ca. 2-3h)
- Täglich: Admins reviewen Technical Items (ca. 30min/Tag)
- Bei Bedarf: Fachexperte reviewt Scientific Items

---

## 10. FAQ

**Q: Warum muss ich jeden Output einzeln prüfen?**  
A: KAIROS lernt aus diesen Daten. Fehler im Training → Fehler im Modell. Quality > Quantity.

**Q: Kann ich mehrere Items gleichzeitig approven?**  
A: Nein, aktuell nicht. Batch-Operations sind geplant für v2.0.

**Q: Was passiert mit "Skipped" Items?**  
A: Sie bleiben in der Queue, werden aber nicht fürs Training verwendet. Admins können sie später erneut reviewen.

**Q: Wie viele Daten brauchen wir für ein gutes Fine-Tuning?**  
A: Minimum: 150-200 qualitativ hochwertige Samples. Aktuell: 171 handkuratierte Beispiele (Bootstrap v1.0). Ziel: Monatlich 50-200 neue Samples durch User-Feedback.

**Q: Was ist der Unterschied zwischen Bootstrap-Daten und Production-Daten?**  
A: Bootstrap (171 Beispiele) wurden manuell erstellt für das erste Training (v1.0). Production-Daten kommen automatisch aus User-Interaktionen mit KAIROS (ab v1.1).

**Q: Wer sieht meine Reviews?**  
A: Nur Admins und Psychologin. `reviewed_by` tracked deine User-ID, aber normale User sehen das nicht.

**Q: Kann ich einen Review rückgängig machen?**  
A: Ja, über SQL oder Admin-Dashboard. Items mit `used_for_training=TRUE` können auf `FALSE` zurückgesetzt werden.

**Q: Warum gibt es keine Best Practice für diesen Prozess?**  
A: Psychologisch-validierte AI Training Data auf diesem Level ist Neuland. Wir entwickeln als europäisches Unternehmen eigene Standards, die GDPR-konform und ethisch fundiert sind.

---

## 11. Support & Kontakt

**Bei Fragen:**
- **Tech-Support:** ogerly@dreammall.earth
- **Psychological Review:** franziska@dreammall.earth
- **General:** admin@dreammall.earth

**Dokumentation:**
- **[Technical Workpaper](./29.11.2025_Aletheia-Labeling-Studio.md)** - Technische Architektur und Implementation
- **[KAIROS Requirements](./Whitepaper-KAIROS-Training-Data-Requirements.md)** - Vollständige Anforderungsspezifikation (171 Training-Beispiele)
- **[Usage Guide](./Whitepaper-Aletheia-Usage-Guide.md)** - Dieses Dokument
- **Open Source Demo:** https://devmatrose.github.io/Aletheia-Labeling-Studio/
- **GitHub Repo:** https://github.com/DEVmatrose/Aletheia-Labeling-Studio

**Training Data Source:**
- `kairos-finetuning/data/training/` - 171 JSONL Bootstrap-Beispiele
- `kairos-finetuning/data/training-psychological/` - Psychologische Tasks (Entwicklung)
- `kairos-finetuning/data/validation/golden-set.jsonl` - Quality Benchmark

---

**Document Version:** 1.0  
**Last Updated:** 29. November 2025  
**Status:** ✅ Production Ready

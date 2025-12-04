Alles klar, das sind klare Entscheidungen. Das ist der perfekte Weg, um Komplexität zu reduzieren und Sicherheit zu erhöhen.

Ich fasse das jetzt für die **Dokumentation und die Requirements** zusammen, damit wir eine klare "Bauanleitung" für die Entwicklung haben.

Hier ist der Plan, wie wir das in die Spezifikationen aufnehmen:

### 1. Die "Pillar-Tabs" (UI & Code-Architektur)
**Entscheidung:** Wir nutzen Tabs statt Dropdowns. Das trennt die Bereiche visuell und im Code strikt voneinander.

**UI-Spezifikation für die Dokumentation:**
Wir setzen die Tabs ganz oben über das **Queue Panel** (linke Spalte) oder zentral über den gesamten Workspace. Wenn man einen Tab wechselt, ändert sich der Kontext der gesamten Applikation.



**Wie das im Code aussieht (Trennung):**
Das macht den Code extrem sauber. Wir definieren für jeden Tab eine eigene "View-Komponente", die in den Haupt-Container geladen wird.

* **Tab 1: 🔧 Technical View**
    * Lädt `TechnicalQueue` (Filter: Task A-D)
    * Lädt `StandardValidationPanel` (Slider, Checkboxen)
    * *Workflow:* Schnell, effizient.
* **Tab 2: 🧠 Psychological View**
    * Lädt `PsychQueue` (Filter: Task P1-P3)
    * Lädt `PsychValidationPanel` (Neutrality-Check, Psychologist-Dropdown)
    * *Visual:* Bekommt einen farblichen Indikator (z.B. lila Rand), um Sensibilität zu zeigen.
* **Tab 3: 📚 Scientific View**
    * Lädt `ScienceQueue`
    * Lädt `CitationPanel` (Pflichtfeld für Quellen)

> **Vorteil:** Im Code haben wir keine riesigen `if/else`-Blöcke (`if pillar == 'psych' then...`), sondern saubere, getrennte Komponenten.

---

### 2. Der Sicherheits-Workflow ("Four-Eyes Principle")
**Entscheidung:** Wir setzen den "Data Moat"-Schutz technisch um. Der "Approve"-Button passt sich dynamisch der Rolle an.



[Image of approval workflow flowchart]


**Logik-Spezifikation für die Dokumentation:**

Wir definieren eine **Button-Logik** basierend auf der Kombination aus *Tab* (Säule) und *User-Rolle*:

| Aktiver Tab | Eingeloggter User | Button-Text | Aktion |
| :--- | :--- | :--- | :--- |
| **Technical** | Developer | `✅ Approve & Save` | Speichert direkt (`status: completed`) |
| **Psychological** | **Developer** | `✋ Request Review` | Speichert nur Vorarbeit (`status: pending_review`) |
| **Psychological** | **Psychologin** | `✅ Approve & Sign` | Finalisiert (`status: completed`, `signed_by: uuid`) |

**Das Update für das Requirements-Doc:**
Wir fügen im Kapitel "Workflow & Prozesse" hinzu, dass psychologische Daten niemals von der Rolle "Developer" final approved werden können. Das UI blockiert dies physisch.

---

### 3. Golden Set (Testing)
**Entscheidung:** Konzept ist approved, Umsetzung erfolgt in Phase 2 ("Quality Assurance Layer").

**Spezifikation:**
Wir markieren das im Dokument als **"Future Requirement"**. Wir definieren jetzt nur das Datenfeld `is_golden_set` in der Datenbank, bauen aber noch keine UI-Logik dafür. So ist die DB bereit, aber wir verschwenden jetzt keine Dev-Zeit für das Feature, bevor der Basis-Workflow steht.

---

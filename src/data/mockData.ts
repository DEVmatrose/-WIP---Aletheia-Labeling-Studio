/**
 * Aletheia Labeling Studio - Mock Data (Demo Version)
 * 
 * This demo showcases how we curate training data for our custom LLM (KAIROS).
 * 
 * 🎯 Purpose: Cost-effective training data curation
 * - We use this tool to review and label our own training data
 * - Reduces cost compared to commercial labeling services
 * - Ensures quality through structured validation
 * 
 * 📊 KAIROS Training Data - 4 Task Types:
 * 
 * 1. TASK A - Matching Profiles (Profile Creation from Freetext)
 *    Input: Freetext user description
 *    Output: Structured JSON (skills, interests, goals, needs)
 * 
 * 2. TASK B - Matching Reasoning (Why do 2 profiles match?)
 *    Input: Profile A + Profile B + Match Score
 *    Output: Explanation why they match (or don't)
 * 
 * 3. TASK C - Project Monitoring (Risk Analysis from Journal)
 *    Input: Project journal entry (freetext)
 *    Output: Sentiment, Risk-Level, Issues, Recommendations
 * 
 * 4. TASK D - Schaufenster Analysis (Service → Structured Data)
 *    Input: Service/Offer description (freetext)
 *    Output: Category, Skills, Pricing, Target Audience, USP
 * 
 * ⚠️ NOTE: These are SCHEMAS only - real data contains 171 examples.
 * This demo shows the structure, not actual training data.
 */

import type { AletheiaItem } from '../types';

/**
 * TASK A: Matching Profiles (Profile Creation)
 * 
 * Real Schema from task-a-matching-profiles.jsonl
 * Format: User describes themselves → KAIROS extracts structured data
 */
export const TASK_A_PROFILES: AletheiaItem[] = [
  {
    id: 'task-a-001',
    pillar: 'technical',
    input: `User Input (Freetext):
"Ich bin UX/UI Designerin mit 5 Jahren Erfahrung. Spezialisiert auf Figma, Adobe XD und Webflow. Habe an E-Commerce-Projekten (Shopify, WooCommerce) und SaaS-Dashboards gearbeitet. Interessiere mich stark für Accessibility (WCAG 2.1), Inclusive Design und nachhaltige Technologien. Suche aktuell einen Tech-Co-Founder für ein GreenTech-Startup im Bereich nachhaltige Mobilität."`,
    output: `KAIROS Response:

Perfekt! 🎯 Das ist eine super konkrete Beschreibung. Ich erstelle jetzt dein Matching-Profil:

\`\`\`json
{
  "skills": [
    "UX/UI Design (5 Jahre Erfahrung)",
    "Figma, Adobe XD, Webflow",
    "E-Commerce Design (Shopify, WooCommerce)",
    "SaaS Dashboard Design",
    "Accessibility (WCAG 2.1)",
    "Inclusive Design"
  ],
  "interests": [
    "Nachhaltige Technologien",
    "GreenTech",
    "Sustainable Mobility",
    "Accessibility"
  ],
  "goals": [
    "GreenTech-Startup gründen (nachhaltige Mobilität)",
    "Tech-Co-Founder finden",
    "Produkt mit Social Impact bauen"
  ],
  "needs": [
    "Backend-Developer (Node.js oder Python)",
    "Tech-Co-Founder mit Datenvisualisierungs-Erfahrung",
    "Partner mit GreenTech-Interesse"
  ]
}
\`\`\`

✅ **Profil vollständig!**`,
    category: 'task_a_profiles',
    metadata: {
      task_type: 'profile_creation',
      quality_score: 1.0,
      skills_count: 6,
      has_vague_terms: false
    },
    qualityScore: 1.0,
    status: 'completed',
    timestamp: '2025-03-12T10:23:00Z'
  },
  {
    id: 'task-a-002',
    pillar: 'technical',
    input: `User Input (Vague - requires followup):
"Ich bin Softwareentwickler seit 1999 und habe im Laufe der Jahre viele Techniken mitgemacht. Ich bin Fullstack unterwegs. Ich beherrsche verschiedene Datenbanktypen. Beschäftige mich mit KI."`,
    output: `KAIROS Response:

Danke für deine Beschreibung! 🚀 Ich sehe deinen Background als erfahrener Fullstack-Entwickler mit KI-Interesse.

Aber um ein wirklich **gutes Matching-Profil** zu erstellen, brauche ich noch ein paar konkrete Details:

1️⃣ **"Verschiedene Datenbanktypen"** - WELCHE genau?
   (z.B. PostgreSQL, MongoDB, Redis?)

2️⃣ **"KI und dem Einsatz"** - In welchen KI-Bereichen konkret?
   (LLMs/Chat-Systeme, Computer Vision, Data Science, ML-Ops?)

3️⃣ **"Menschen und Projekte finden"** - Was genau suchst du?
   (Co-Founder für ein Projekt, Tech-Partner, Mentorship, Austausch?)

Kannst du diese 3 Punkte noch etwas **konkreter** beschreiben? 💡`,
    category: 'task_a_profiles',
    metadata: {
      task_type: 'profile_creation_vague',
      quality_score: 1.0,
      vague_terms_detected: ['verschiedene Datenbanktypen', 'viele Techniken', 'Beschäftige mich mit KI'],
      followup_questions: 3
    },
    qualityScore: 1.0,
    status: 'skipped',
    timestamp: '2025-03-12T10:24:00Z'
  },
  {
    id: 'task-a-003',
    pillar: 'technical',
    input: `User Input (Incomplete):
"Ich suche Partner für ein Projekt."`,
    output: `KAIROS Response:

Hallo! 👋 Ich kann dir gerne beim Finden von Projektpartnern helfen!

Allerdings brauche ich noch **wesentlich mehr Informationen**, um ein Matching-Profil zu erstellen:

❓ **Was fehlt komplett:**
1. Wer bist DU? (Skills, Erfahrung, Background)
2. Was für ein PROJEKT? (Bereich, Ziel, Branche)
3. Welche PARTNER suchst du? (Tech, Marketing, Design?)
4. Was sind deine INTERESSEN?

Kannst du bitte diese Infos ergänzen? Ohne diese kann ich kein Matching machen. 😊`,
    category: 'task_a_profiles',
    metadata: {
      task_type: 'profile_creation_incomplete',
      quality_score: 0.1,
      error: 'insufficient_information'
    },
    qualityScore: 0.1,
    status: 'skipped',
    timestamp: '2025-03-12T10:25:00Z'
  }
];

/**
 * TASK B: Matching Reasoning (Match Explanation)
 * 
 * Real Schema from task-b-matching-reasoning.jsonl
 * Format: Profile A + Profile B + Score → Explanation why they match
 */
export const TASK_B_MATCHING: AletheiaItem[] = [
  {
    id: 'task-b-001',
    pillar: 'technical',
    input: `Match Analysis Request:

Match-Score: 0.92/1.0

Profile A (Anna - Marketing):
- Skills: B2B-Marketing (8 Jahre), Content-Strategie, SEO/SEM, Lead-Generation
- Interests: Startups, GreenTech, Growth Hacking
- Goals: GreenTech-Startup gründen, Co-Founder finden
- Needs: Tech-Co-Founder (Fullstack/Backend), Prototyping-Skills

Profile B (Max - Developer):
- Skills: Node.js, Vue.js, PostgreSQL, Prototyping, 6 Jahre Startup-Erfahrung (2 Exits)
- Interests: GreenTech, Climate Action, Impact-Projekte
- Goals: Nächstes Startup gründen, Co-Founder finden
- Needs: Business-Partner (Marketing/Sales), B2B-Erfahrung`,
    output: `KAIROS Response:

🎯 **PERFECT MATCH (Score: 0.92/1.0)**

**Warum Anna und Max ideal zusammenpassen:**

**1. Perfekte Skill-Komplementarität:**
- Anna braucht "Tech-Co-Founder mit Prototyping" → Max hat 6 Jahre Startup-Erfahrung mit Prototyping
- Max braucht "Business-Partner mit Marketing/Sales" → Anna hat 8 Jahre B2B-Marketing mit Lead-Generation
- Anna sucht "Backend/Fullstack" → Max ist Fullstack (Node.js, Vue.js, PostgreSQL)

**2. Identische Vision & Goals:**
- BEIDE wollen ein GreenTech-Startup gründen
- BEIDE suchen einen Co-Founder (nicht nur Projektpartner)
- BEIDE haben Startup-Erfahrung

**3. Gemeinsame Werte:**
- BEIDE interessieren sich für GreenTech/Climate Action
- BEIDE wollen Impact maximieren

✅ **EMPFEHLUNG: SOFORT VERBINDEN!**
Das ist ein "Made in Heaven"-Match. Wahrscheinlichkeit für erfolgreiche Zusammenarbeit: **SEHR HOCH** 🚀`,
    category: 'task_b_matching',
    metadata: {
      task_type: 'match_reasoning',
      match_score: 0.92,
      recommendation: 'connect_immediately'
    },
    qualityScore: 0.95,
    status: 'completed',
    timestamp: '2025-03-12T11:30:00Z'
  },
  {
    id: 'task-b-002',
    pillar: 'technical',
    input: `Match Analysis Request:

Match-Score: 0.21/1.0

Profile A (Sarah - Data Scientist):
- Skills: Python, ML/AI, Data Analysis, PyTorch
- Interests: Healthcare AI, Medical Diagnostics
- Goals: Healthcare-AI-Startup gründen

Profile B (Tom - Marketing Manager):
- Skills: B2C-Marketing, Social Media, Influencer Marketing
- Interests: Fashion, Lifestyle, Travel
- Goals: Influencer-Marketing-Agentur gründen`,
    output: `KAIROS Response:

❌ **WEAK MATCH (Score: 0.21/1.0)**

**Warum Sarah und Tom NICHT zusammenpassen:**

**1. Völlig unterschiedliche Branchen:**
- Sarah: Healthcare AI (hochspezialisiert, reguliert)
- Tom: Fashion/Lifestyle (Consumer-Market, Trend-getrieben)
- Keine thematische Überschneidung

**2. Keine Skill-Komplementarität:**
- Sarah braucht: Healthcare-Experten, regulatorisches Wissen
- Tom braucht: Creative Team, Influencer-Connections
- Skills addressieren nicht gegenseitige Needs

**3. Inkompatible Ziele:**
- Sarah: Healthcare-AI-Startup (B2B, long sales cycles, regulatory)
- Tom: Influencer-Agentur (B2C, fast-paced, creative)

**Empfehlung:** ❌ KEIN Match. Besser separate Partner suchen.`,
    category: 'task_b_matching',
    metadata: {
      task_type: 'match_reasoning_negative',
      match_score: 0.21
    },
    qualityScore: 0.85,
    status: 'completed',
    timestamp: '2025-03-12T09:25:00Z'
  }
];

/**
 * TASK C: Project Monitoring (Risk Analysis)
 * 
 * Real Schema from task-c-project-monitoring.jsonl
 * Format: Project journal entry → Sentiment, Risk, Issues, Recommendations
 */
export const TASK_C_MONITORING: AletheiaItem[] = [
  {
    id: 'task-c-001',
    pillar: 'technical',
    input: `Project Journal Entry:

Projekt: GreenTech Plattform
Deadline: In 2 Wochen (MVP Launch)
Team: 4 Personen

"Wieder ein frustrierender Tag. Die API vom Payment-Provider funktioniert immer noch nicht richtig. Wir haben jetzt 3 Tage damit verbracht, Fehler zu debuggen. Max (Backend-Dev) ist total genervt und meinte heute, dass er das Projekt 'nicht mehr sehen kann'. Wir haben schon 2x das Deadline verschoben und der Kunde wird langsam ungeduldig. Ich weiß nicht, ob wir das in 2 Wochen schaffen."`,
    output: `KAIROS Risk Analysis:

\`\`\`json
{
  "sentiment": "negative",
  "risk_level": "high",
  "confidence": 0.92,
  "issues": [
    {
      "type": "technical_blocker",
      "severity": "high",
      "description": "Payment-API funktioniert nicht - 3 Tage Debugging ohne Lösung"
    },
    {
      "type": "team_morale",
      "severity": "medium",
      "description": "Backend-Dev zeigt Burnout-Anzeichen ('kann Projekt nicht mehr sehen')"
    },
    {
      "type": "deadline_slippage",
      "severity": "high",
      "description": "Bereits 2x Deadline verschoben, MVP Launch in 2 Wochen gefährdet"
    }
  ],
  "recommendations": [
    {
      "priority": "high",
      "action": "Sofort mit Payment-Provider-Support Kontakt aufnehmen oder Alternative evaluieren - max. 1 Tag für Entscheidung"
    },
    {
      "priority": "high",
      "action": "1-on-1 Gespräch mit Max innerhalb 24h - Workload reduzieren oder Unterstützung holen"
    },
    {
      "priority": "medium",
      "action": "Stakeholder-Call: Transparente Kommunikation über technische Herausforderung"
    }
  ],
  "prediction": "KRITISCH: Ohne Intervention in 48h droht: (1) Max kündigt oder Sick-Leave, (2) Kunde springt ab, (3) weitere Deadline-Verschiebung."
}
\`\`\``,
    category: 'task_c_monitoring',
    metadata: {
      task_type: 'project_risk_analysis',
      sentiment: 'negative',
      risk_level: 'high',
      issues_count: 3
    },
    qualityScore: 0.92,
    status: 'completed',
    timestamp: '2025-03-12T09:18:00Z'
  },
  {
    id: 'task-c-002',
    pillar: 'technical',
    input: `Match Analysis Request:

Match-Score: 0.21/1.0

Profile A (Sarah - Data Scientist):
- Skills: Python, ML/AI, Data Analysis, PyTorch
- Interests: Healthcare AI, Medical Diagnostics
- Goals: Healthcare-AI-Startup gründen

Profile B (Tom - Marketing Manager):
- Skills: B2C-Marketing, Social Media, Influencer Marketing
- Interests: Fashion, Lifestyle, Travel
- Goals: Influencer-Marketing-Agentur gründen`,
    output: `KAIROS Response:

❌ **WEAK MATCH (Score: 0.21/1.0)**

**Warum Sarah und Tom NICHT zusammenpassen:**

**1. Völlig unterschiedliche Branchen:**
- Sarah: Healthcare AI (hochspezialisiert, reguliert)
- Tom: Fashion/Lifestyle (Consumer-Market, Trend-getrieben)
- Keine thematische Überschneidung

**2. Keine Skill-Komplementarität:**
- Sarah braucht: Healthcare-Experten, regulatorisches Wissen
- Tom braucht: Creative Team, Influencer-Connections
- Skills addressieren nicht gegenseitige Needs

**3. Inkompatible Ziele:**
- Sarah: Healthcare-AI-Startup (B2B, long sales cycles, regulatory)
- Tom: Influencer-Agentur (B2C, fast-paced, creative)

**Empfehlung:** ❌ KEIN Match. Besser separate Partner suchen.`,
    category: 'task_b_matching',
    metadata: {
      task_type: 'match_reasoning_negative',
      match_score: 0.21
    },
    qualityScore: 0.85,
    status: 'pending',
    timestamp: '2025-03-12T09:19:00Z'
  },
  {
    id: 'task-c-003',
    pillar: 'technical',
    input: `Service Description (Complete):
"SEO & Content Marketing Package | Was du bekommst: Keyword-Recherche, Content-Strategie (3 Monate), 12 SEO-optimierte Blog-Posts (1500+ Wörter), Backlink-Audit, Technisches SEO-Setup. Preis: 4800 EUR. Dauer: 3 Monate. Tools: Ahrefs, SEMrush, Google Analytics. Zielgruppe: B2B SaaS-Startups. Erfahrung: 40+ Kunden, durchschnittlich 150% Organic Traffic-Steigerung nach 6 Monaten."`,
    output: `KAIROS Response:

🌟 **PREMIUM SERVICE - SEHR GUT STRUKTURIERT!**

\`\`\`json
{
  "category": "Marketing Services",
  "subcategory": "SEO & Content Marketing",
  "skills": [
    "SEO-Strategie",
    "Content Marketing",
    "Keyword Research",
    "Technical SEO",
    "Backlink Analysis",
    "Analytics"
  ],
  "tools": ["Ahrefs", "SEMrush", "Google Analytics"],
  "pricing": "4800 EUR (3-Monats-Package)",
  "delivery_time": "3 Monate",
  "included_services": [
    "Keyword-Recherche",
    "Content-Strategie (3 Monate)",
    "12 SEO-optimierte Blog-Posts (1500+ Wörter)",
    "Backlink-Audit",
    "Technisches SEO-Setup"
  ],
  "target_audience": ["B2B SaaS-Startups"],
  "usp": [
    "Messbare Ergebnisse (150% Traffic-Steigerung)",
    "40+ zufriedene Kunden",
    "Komplettes Package (Strategie + Umsetzung)",
    "Fokus auf B2B SaaS (Nische)"
  ],
  "completeness_score": 0.98,
  "missing_info": ["Portfolio-Link (optional)"]
}
\`\`\`

✅ Exzellent strukturiertes Angebot mit klarem ROI!`,
    category: 'task_d_schaufenster',
    metadata: {
      task_type: 'service_analysis_complete',
      completeness_score: 0.98
    },
    qualityScore: 0.98,
    status: 'pending',
    timestamp: '2025-03-12T09:20:00Z'
  }
];

/**
 * TASK D: Schaufenster Analysis (Service → Structured Data)
 * 
 * Real Schema from task-d-schaufenster-analysis.jsonl
 * Format: Service description → Category, Skills, Pricing, USP
 */
export const TASK_D_SCHAUFENSTER: AletheiaItem[] = [
  {
    id: 'task-d-001',
    pillar: 'technical',
    input: `Service Description (Schaufenster):

"Ich biete professionelles Landing Page Design für Startups und kleine Unternehmen. Mit 8 Jahren Erfahrung im Web Design erstelle ich konversionoptimierte Landing Pages, die verkaufen.

Mein Prozess:
1. Strategie-Workshop (1-2h)
2. Design-Konzept in Figma
3. Responsive Design für alle Geräte
4. 2 Revisions-Runden inklusive

Tools: Figma, Adobe XD, Webflow

Preis: 1.500 - 2.500 EUR (abhängig von Komplexität)
Lieferzeit: 2 Wochen

Referenzen auf Anfrage verfügbar."`,
    output: `KAIROS Analysis:

\`\`\`json
{
  "category": "Design Services",
  "subcategory": "Web Design",
  "skills": [
    "Landing Page Design",
    "Conversion Optimization",
    "Responsive Design",
    "Figma",
    "Adobe XD",
    "Webflow"
  ],
  "target_audience": [
    "Startups",
    "Kleine Unternehmen",
    "KMU"
  ],
  "pricing_type": "project_based",
  "price_range": {
    "min": 1500,
    "max": 2500,
    "currency": "EUR"
  },
  "delivery_time": "2 Wochen",
  "usp": "8 Jahre Erfahrung mit Fokus auf konversionoptimierte Landing Pages. Strukturierter Prozess von Strategie-Workshop bis finaler Abnahme.",
  "completeness_score": 0.95,
  "suggestions": [
    "Portfolio-Link oder Case-Study-Beispiele hinzufügen würde Angebot stärken"
  ]
}
\`\`\``,
    category: 'task_d_schaufenster',
    metadata: {
      task_type: 'service_analysis',
      completeness_score: 0.95,
      has_pricing: true,
      has_delivery_time: true
    },
    qualityScore: 0.95,
    status: 'completed',
    timestamp: '2025-03-12T09:20:00Z'
  },
  {
    id: 'task-d-002',
    pillar: 'technical',
    input: `Service Description (Vague):

"Moderne Websites für Unternehmen. Ich helfe dir, deine Vision online zu bringen. Von der Idee bis zum Launch.

Kontaktiere mich für ein unverbindliches Erstgespräch!"`,
    output: `KAIROS Analysis:

\`\`\`json
{
  "category": "Design Services",
  "subcategory": "Web Design",
  "skills": ["Website-Entwicklung"],
  "target_audience": ["Unternehmen"],
  "pricing_type": "unknown",
  "price_range": null,
  "delivery_time": "unspecified",
  "usp": "Begleitung von der Idee bis zum Launch - Full-Service-Ansatz",
  "completeness_score": 0.35,
  "suggestions": [
    "KRITISCH: Keine Preis-Angaben - füge zumindest eine Preis-Range oder 'ab X EUR' hinzu",
    "Welche Tools/Technologien verwendest du? (z.B. WordPress, React, Webflow)",
    "Konkrete Zielgruppe definieren: Startups? KMU? E-Commerce? B2B?",
    "Lieferzeit angeben: 2 Wochen? 1 Monat? 3 Monate?",
    "Was macht deine Websites besonders?",
    "Portfolio oder Referenzen hinzufügen"
  ]
}
\`\`\``,
    category: 'task_d_schaufenster',
    metadata: {
      task_type: 'service_analysis_incomplete',
      completeness_score: 0.35,
      has_pricing: false,
      missing_fields: ['pricing', 'delivery_time', 'tools', 'specific_target']
    },
    qualityScore: 0.93,
    status: 'completed',
    timestamp: '2025-03-12T09:21:00Z'
  },
  {
    id: 'task-d-003',
    pillar: 'technical',
    input: `Service Description (Complete):
"SEO & Content Marketing Package | Was du bekommst: Keyword-Recherche, Content-Strategie (3 Monate), 12 SEO-optimierte Blog-Posts (1500+ Wörter), Backlink-Audit, Technisches SEO-Setup. Preis: 4800 EUR. Dauer: 3 Monate. Tools: Ahrefs, SEMrush, Google Analytics. Zielgruppe: B2B SaaS-Startups. Erfahrung: 40+ Kunden, durchschnittlich 150% Organic Traffic-Steigerung nach 6 Monaten."`,
    output: `KAIROS Response:

🌟 **PREMIUM SERVICE - SEHR GUT STRUKTURIERT!**

\`\`\`json
{
  "category": "Marketing Services",
  "subcategory": "SEO & Content Marketing",
  "skills": [
    "SEO-Strategie",
    "Content Marketing",
    "Keyword Research",
    "Technical SEO",
    "Backlink Analysis",
    "Analytics"
  ],
  "tools": ["Ahrefs", "SEMrush", "Google Analytics"],
  "pricing": "4800 EUR (3-Monats-Package)",
  "delivery_time": "3 Monate",
  "included_services": [
    "Keyword-Recherche",
    "Content-Strategie (3 Monate)",
    "12 SEO-optimierte Blog-Posts (1500+ Wörter)",
    "Backlink-Audit",
    "Technisches SEO-Setup"
  ],
  "target_audience": ["B2B SaaS-Startups"],
  "usp": [
    "Messbare Ergebnisse (150% Traffic-Steigerung)",
    "40+ zufriedene Kunden",
    "Komplettes Package (Strategie + Umsetzung)",
    "Fokus auf B2B SaaS (Nische)"
  ],
  "completeness_score": 0.98,
  "missing_info": ["Portfolio-Link (optional)"]
}
\`\`\`

✅ Exzellent strukturiertes Angebot mit klarem ROI!`,
    category: 'task_d_schaufenster',
    metadata: {
      task_type: 'service_analysis_complete',
      completeness_score: 0.98
    },
    qualityScore: 0.98,
    status: 'pending',
    timestamp: '2025-03-12T09:22:00Z'
  },
  {
    id: 'task-d-004',
    pillar: 'technical',
    input: `Service Description (Mid-Quality):
"Videoproduktion für Unternehmen. Imagefilme, Produktvideos, Social Media Content. Professionelle Ausrüstung. Schnelle Bearbeitung. Referenzen vorhanden."`,
    output: `KAIROS Response:

✅ Service erkannt, aber es fehlen wichtige Details:

\`\`\`json
{
  "category": "Media Services",
  "subcategory": "Videoproduktion",
  "skills": [
    "Videoproduktion",
    "Imagefilme",
    "Produktvideos",
    "Social Media Content Creation",
    "Videobearbeitung"
  ],
  "pricing": "FEHLT (geschätzt: 2000-8000 EUR je nach Umfang)",
  "delivery_time": "Unklar ('schnelle Bearbeitung' ist vage)",
  "target_audience": "Unternehmen (zu breit definiert)",
  "usp": [
    "Professionelle Ausrüstung",
    "Schnelle Bearbeitung",
    "Referenzen verfügbar"
  ],
  "completeness_score": 0.6,
  "missing_info": [
    "Konkrete Preise oder Pricing-Ranges",
    "Lieferzeit in Tagen/Wochen",
    "Welche Kamera-/Editing-Tools?",
    "Spezifische Zielgruppe (Startups? Konzerne? E-Commerce?)",
    "Referenz-Links"
  ]
}
\`\`\`

**Verbesserungsvorschläge:**
1. Preis-Packages definieren (z.B. "Basic", "Premium")
2. Konkrete Lieferzeiten
3. Zielgruppe eingrenzen`,
    category: 'task_d_schaufenster',
    metadata: {
      task_type: 'service_analysis_incomplete',
      completeness_score: 0.6
    },
    qualityScore: 0.82,
    status: 'pending',
    timestamp: '2025-03-12T09:23:00Z'
  }
];

/**
 * Combined mock data - All 4 Task Types
 */
export const MOCK_ALL_DATA: AletheiaItem[] = [
  ...TASK_A_PROFILES,
  ...TASK_B_MATCHING,
  ...TASK_C_MONITORING,
  ...TASK_D_SCHAUFENSTER
];

/**
 * Helper: Get data by task type
 */
export function getMockDataByTask(taskType: string): AletheiaItem[] {
  switch (taskType) {
    case 'task_a':
      return TASK_A_PROFILES;
    case 'task_b':
      return TASK_B_MATCHING;
    case 'task_c':
      return TASK_C_MONITORING;
    case 'task_d':
      return TASK_D_SCHAUFENSTER;
    default:
      return MOCK_ALL_DATA;
  }
}

/**
 * Statistics for demo
 */
export function getTaskStats() {
  return {
    task_a: {
      count: TASK_A_PROFILES.length,
      name: 'Matching Profiles',
      description: 'Profile creation from freetext → structured JSON'
    },
    task_b: {
      count: TASK_B_MATCHING.length,
      name: 'Matching Reasoning',
      description: 'Explain why 2 profiles match (or don\'t)'
    },
    task_c: {
      count: TASK_C_MONITORING.length,
      name: 'Project Monitoring',
      description: 'Risk analysis from project journal entries'
    },
    task_d: {
      count: TASK_D_SCHAUFENSTER.length,
      name: 'Schaufenster Analysis',
      description: 'Service description → structured marketplace data'
    },
    total: MOCK_ALL_DATA.length
  };
}

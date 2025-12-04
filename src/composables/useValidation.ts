/**
 * Aletheia Labeling Studio - Validation Composable
 * 
 * Pillar-specific validation rules for three-pillar system:
 * - Technical: Accuracy, Tonality, Task-Fit
 * - Psychological: Neutrality, Ethics, GDPR Art. 9
 * - Scientific: Citations, Methodology, Validity
 */

import { computed } from 'vue'
import type { AletheiaPillar } from '../types'

export type ValidationSeverity = 'error' | 'warning' | 'info'

export interface ValidationRule {
  id: string
  label: string
  description: string
  check: (data: any) => boolean
  severity: ValidationSeverity
}

export interface ValidationResult extends ValidationRule {
  passed: boolean
}

/**
 * Validation rules for Technical pillar
 * Focus: Real platform interactions, accuracy, user fit
 */
const TECHNICAL_RULES: ValidationRule[] = [
  {
    id: 'accuracy',
    label: 'Response Accuracy',
    description: 'Response is accurate, helpful, and relevant to user query',
    check: (data) => {
      return data.quality_score ? data.quality_score >= 3 : false
    },
    severity: 'error'
  },
  {
    id: 'tonality',
    label: 'Tonality Match',
    description: 'Response tonality matches user archetype (Macher, Chaot, Perfektionist, Beobachter)',
    check: (data) => {
      return data.tonality_match === true
    },
    severity: 'warning'
  },
  {
    id: 'task_fit',
    label: 'Task Type Fit',
    description: 'Response fits assigned task type (A=Profile, B=Matching, C=Monitoring, D=Schaufenster)',
    check: (data) => {
      return data.task_type_valid === true
    },
    severity: 'error'
  },
  {
    id: 'luna_orion_balance',
    label: 'Avatar Balance',
    description: 'Luna (empathetic) vs Orion (structured) balance appropriate for user',
    check: (data) => {
      return data.avatar_balance_ok === true
    },
    severity: 'info'
  }
]

/**
 * Validation rules for Psychological pillar
 * Focus: Behavioral analysis, professional validation, GDPR compliance
 */
const PSYCHOLOGICAL_RULES: ValidationRule[] = [
  {
    id: 'neutrality',
    label: 'Neutrality Check',
    description: 'Response is neutral, non-judgmental, and unbiased',
    check: (data) => {
      return data.neutrality_score ? data.neutrality_score >= 4 : false
    },
    severity: 'error'
  },
  {
    id: 'ethics',
    label: 'Ethical Soundness',
    description: 'No harmful content, manipulation, or psychological harm',
    check: (data) => {
      return data.ethical_check === true
    },
    severity: 'error'
  },
  {
    id: 'gdpr_compliance',
    label: 'GDPR Art. 9 Compliance',
    description: 'Complies with GDPR Article 9 (sensitive psychological data)',
    check: (data) => {
      return data.gdpr_compliant === true
    },
    severity: 'error'
  },
  {
    id: 'psychologist_review',
    label: 'Psychologist Validation',
    description: 'Professional psychologist has reviewed and approved',
    check: (data) => {
      return data.psychologist_approved === true
    },
    severity: 'warning'
  },
  {
    id: 'archetyp_validity',
    label: 'Archetyp Classification',
    description: 'Archetyp classification is evidence-based and valid',
    check: (data) => {
      return data.archetyp_valid === true
    },
    severity: 'info'
  }
]

/**
 * Validation rules for Scientific pillar
 * Focus: Academic rigor, proper attribution, methodology
 */
const SCIENTIFIC_RULES: ValidationRule[] = [
  {
    id: 'citations',
    label: 'Valid Citations',
    description: 'Proper academic citations (APA, IEEE) are present and correct',
    check: (data) => {
      return data.has_valid_citations === true
    },
    severity: 'error'
  },
  {
    id: 'methodology',
    label: 'Sound Methodology',
    description: 'Based on sound PM/coaching/team theories and methodologies',
    check: (data) => {
      return data.methodology_valid === true
    },
    severity: 'warning'
  },
  {
    id: 'open_access',
    label: 'Open Access Source',
    description: 'Source material is Open Access or properly licensed',
    check: (data) => {
      return data.open_access === true
    },
    severity: 'error'
  },
  {
    id: 'peer_reviewed',
    label: 'Peer Review Status',
    description: 'Source is from peer-reviewed academic publication',
    check: (data) => {
      return data.peer_reviewed === true
    },
    severity: 'info'
  },
  {
    id: 'factual_accuracy',
    label: 'Factual Accuracy',
    description: 'Claims are factually accurate and verifiable',
    check: (data) => {
      return data.factually_accurate === true
    },
    severity: 'error'
  }
]

/**
 * Map of pillar to validation rules
 */
const PILLAR_VALIDATION_RULES: Record<AletheiaPillar, ValidationRule[]> = {
  technical: TECHNICAL_RULES,
  psychological: PSYCHOLOGICAL_RULES,
  scientific: SCIENTIFIC_RULES
}

/**
 * Composable for pillar-specific validation
 * 
 * @param pillar - The pillar to validate against
 * @returns Validation utilities
 */
export function useValidation(pillar: AletheiaPillar) {
  const rules = computed(() => PILLAR_VALIDATION_RULES[pillar])

  /**
   * Validate data against pillar-specific rules
   */
  const validate = (data: any): ValidationResult[] => {
    return rules.value.map(rule => ({
      ...rule,
      passed: rule.check(data)
    }))
  }

  /**
   * Get count of passed/failed rules
   */
  const getValidationSummary = (data: any) => {
    const results = validate(data)
    const passed = results.filter(r => r.passed).length
    const failed = results.filter(r => !r.passed).length
    const errors = results.filter(r => !r.passed && r.severity === 'error').length
    const warnings = results.filter(r => !r.passed && r.severity === 'warning').length

    return {
      total: results.length,
      passed,
      failed,
      errors,
      warnings,
      isValid: errors === 0 // Valid if no errors (warnings are ok)
    }
  }

  /**
   * Get human-readable pillar description
   */
  const getPillarDescription = (): string => {
    const descriptions: Record<AletheiaPillar, string> = {
      technical: 'Technical: Real user interactions from platform. Focus on accuracy, tonality, and task fit.',
      psychological: 'Psychological: Behavioral analysis with professional validation. Focus on neutrality, ethics, and GDPR compliance.',
      scientific: 'Scientific: Open-source academic materials. Focus on citations, methodology, and factual accuracy.'
    }
    return descriptions[pillar]
  }

  return {
    rules,
    validate,
    getValidationSummary,
    getPillarDescription
  }
}

/**
 * Get all available pillars
 */
export function getAllPillars(): AletheiaPillar[] {
  return ['technical', 'psychological', 'scientific']
}

/**
 * Get pillar icon
 */
export function getPillarIcon(pillar: AletheiaPillar): string {
  const icons: Record<AletheiaPillar, string> = {
    technical: '🔧',
    psychological: '🧠',
    scientific: '📚'
  }
  return icons[pillar]
}

/**
 * Get pillar color class
 */
export function getPillarColorClass(pillar: AletheiaPillar): string {
  const colors: Record<AletheiaPillar, string> = {
    technical: 'blue',
    psychological: 'purple',
    scientific: 'green'
  }
  return colors[pillar]
}

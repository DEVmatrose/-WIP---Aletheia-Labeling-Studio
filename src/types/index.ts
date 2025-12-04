/**
 * Aletheia Labeling Studio - Type Definitions
 * 
 * Core interfaces for training data labeling and curation.
 */

/**
 * Status of a labeling item in the workflow
 */
export type AletheiaStatus = 'pending' | 'in-progress' | 'completed' | 'skipped';

/**
 * Data pillars/categories for labeling
 * Three-pillar system for AI training data validation
 */
export type AletheiaPillar = 'technical' | 'psychological' | 'scientific';

/**
 * Core labeling item structure
 */
export interface AletheiaItem {
  /** Unique identifier */
  id: string;
  
  /** Input text/prompt for the model */
  input: string;
  
  /** Model output (JSON or structured data) */
  output: any;
  
  /** Optional category/type of the item */
  category?: string;
  
  /** Optional pillar classification */
  pillar?: AletheiaPillar;
  
  /** Additional metadata */
  metadata?: Record<string, any>;
  
  /** Current status in the workflow */
  status?: AletheiaStatus;
  
  /** Timestamp of creation/update */
  timestamp?: string;
  
  /** Quality score (0-1 or 0-100) */
  qualityScore?: number;
}

/**
 * Validation rules per category/pillar
 */
export interface AletheiaValidation {
  /** Require neutrality check (for psychological data) */
  neutralityCheck?: boolean;
  
  /** Require source citation (for scientific data) */
  requireCitation?: boolean;
  
  /** Custom validation function */
  validator?: (item: AletheiaItem) => boolean | string;
  
  /** Minimum quality score threshold */
  minQualityScore?: number;
}

/**
 * Configuration for the Aletheia Labeler
 */
export interface AletheiaConfig {
  /** Available pillars/categories for classification */
  pillars?: string[];
  
  /** Validation rules per pillar */
  validations?: Record<string, AletheiaValidation>;
  
  /** Theme customization */
  theme?: 'light' | 'dark' | string;
  
  /** Allow editing of output JSON */
  allowEdit?: boolean;
  
  /** Show quality score slider */
  showQualityScore?: boolean;
  
  /** Enable keyboard shortcuts */
  enableKeyboardShortcuts?: boolean;
  
  /** Custom labels */
  labels?: {
    save?: string;
    skip?: string;
    validate?: string;
    pillar?: string;
    quality?: string;
  };
}

/**
 * Events emitted by the Aletheia Labeler
 */
export interface AletheiaEvents {
  /** Emitted when user saves/approves an item */
  save: (item: AletheiaItem) => void;
  
  /** Emitted when user validates an item */
  validate: (item: AletheiaItem, isValid: boolean, message?: string) => void;
  
  /** Emitted when user skips an item */
  skip: (item: AletheiaItem) => void;
  
  /** Emitted when user selects a different item from queue */
  select: (item: AletheiaItem) => void;
  
  /** Emitted when output is edited */
  edit: (item: AletheiaItem, newOutput: any) => void;
}

/**
 * Statistics for the labeling session
 */
export interface AletheiaStats {
  total: number;
  pending: number;
  completed: number;
  skipped: number;
  inProgress: number;
  averageQuality?: number;
}

/**
 * Props for the main AletheiaLabeler component
 */
export interface AletheiaLabelerProps {
  /** Array of items to label */
  items: AletheiaItem[];
  
  /** Configuration object */
  config?: AletheiaConfig;
  
  /** Loading state */
  loading?: boolean;
  
  /** Current active item (optional, for controlled mode) */
  currentItem?: AletheiaItem;
}

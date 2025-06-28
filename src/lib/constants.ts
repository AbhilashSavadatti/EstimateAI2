// API mode configuration
export const MOCK_MODE = true; // Set to false when backend is ready

// App information
export const APP_NAME = 'EstimateAI';
export const APP_COMPANY = 'Trikon Brickloop';

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
};

// Estimate statuses
export const ESTIMATE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  ARCHIVED: 'archived',
};

// Common units for materials
export const MATERIAL_UNITS = [
  { value: 'sq_ft', label: 'Square Feet' },
  { value: 'sq_yd', label: 'Square Yards' },
  { value: 'sq_m', label: 'Square Meters' },
  { value: 'linear_ft', label: 'Linear Feet' },
  { value: 'linear_m', label: 'Linear Meters' },
  { value: 'each', label: 'Each' },
  { value: 'box', label: 'Box' },
  { value: 'roll', label: 'Roll' },
  { value: 'sheet', label: 'Sheet' },
  { value: 'gallon', label: 'Gallon' },
  { value: 'quart', label: 'Quart' },
  { value: 'liter', label: 'Liter' },
  { value: 'pound', label: 'Pound' },
  { value: 'kg', label: 'Kilogram' },
  { value: 'bag', label: 'Bag' },
  { value: 'pallet', label: 'Pallet' },
];

// Material categories
export const MATERIAL_CATEGORIES = [
  { value: 'flooring', label: 'Flooring' },
  { value: 'drywall', label: 'Drywall & Wall Finishes' },
  { value: 'paint', label: 'Paint & Coatings' },
  { value: 'lumber', label: 'Lumber & Framing' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'tile', label: 'Tile & Stone' },
  { value: 'concrete', label: 'Concrete & Masonry' },
  { value: 'appliances', label: 'Appliances' },
  { value: 'fixtures', label: 'Fixtures' },
  { value: 'cabinets', label: 'Cabinets & Countertops' },
  { value: 'doors_windows', label: 'Doors & Windows' },
  { value: 'insulation', label: 'Insulation' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'hardware', label: 'Hardware & Fasteners' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'other', label: 'Other' },
];

// Labor categories
export const LABOR_CATEGORIES = [
  { value: 'general', label: 'General Labor' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'drywall', label: 'Drywall & Finishing' },
  { value: 'painting', label: 'Painting' },
  { value: 'flooring', label: 'Flooring Installation' },
  { value: 'tile', label: 'Tile Setting' },
  { value: 'concrete', label: 'Concrete & Masonry' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'demolition', label: 'Demolition' },
  { value: 'cleanup', label: 'Cleanup' },
  { value: 'supervision', label: 'Supervision' },
  { value: 'design', label: 'Design & Planning' },
  { value: 'permits', label: 'Permit Acquisition' },
  { value: 'other', label: 'Other' },
];

// Profit margin ranges
export const DEFAULT_PROFIT_MARGIN = 20;
export const MIN_PROFIT_MARGIN = 0;
export const MAX_PROFIT_MARGIN = 100;
export const PROFIT_MARGIN_STEP = 5;
export const SUGGESTED_PROFIT_MARGINS = [15, 20, 25, 30, 35];

// Voice recognition constants
export const VOICE_CONFIDENCE_THRESHOLD = 0.7;
export const MAX_RECORDING_TIME_MS = 60000; // 60 seconds
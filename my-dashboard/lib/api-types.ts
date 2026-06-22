export interface AgentRecommendation {
  action?: string;
  suggested_modifier: number;
  confidence: number;
}

export interface InventoryAgentInfo {
  agent_id: string;
  sku: string;
  recommendation: AgentRecommendation;
  rationale: string;
}

export interface CalendarAgentInfo {
  agent_id: string;
  sku: string;
  recommendation: {
    action: string;
    suggested_modifier: number;
    confidence: number;
  };
  rationale: string;
}

export interface CompetitorAgentInfo {
  agent_id: string;
  sku: string;
  recommendation: {
    suggested_modifier: number;
    confidence: number;
  };
  rationale: string;
}

export interface ContributingAgent {
  agent_id: string;
  suggested_modifier: number;
  confidence: number;
}

export interface FinalPriceInfo {
  agent_id: string;
  sku: string;
  status: string;
  timestamp: string;
  final_recommendation: AgentRecommendation & { action: string };
  rationale: string;
  contributing_agents: ContributingAgent[];
}

export interface SkuSummary {
  sku: string;
  final_status: string;
  final_action: string;
  final_modifier: number;
  final_confidence: number;
  needs_review: boolean;
  inventory_action: string;
  competitor_modifier: number;
}

export interface SkuDetail {
  sku: string;
  inventory: InventoryAgentInfo;
  competitor: CompetitorAgentInfo;
  calendar?: CalendarAgentInfo;
  final_price: FinalPriceInfo;
}

export interface InventoryAlert {
  severity: string;
  units_remaining: number;
  days_to_expiry: number;
  recommended_action: string;
}

export interface InventoryMetrics {
  units_remaining: number;
  original_stock_estimate: number;
  original_stock_is_estimated: boolean;
  stock_coverage_pct: number;
  days_to_expiry: number;
  expiry_date: string | null;
  markdown_pct: number;
  cost_price: number;
}

export interface InventoryJustification {
  waste_risk_tier: string;
  units_at_risk: number;
  cost_basis_value_at_risk: number;
  daily_velocity: number;
  units_to_clear: number;
  required_velocity: number;
}

export interface DepletionPoint {
  label: string;
  stock_on_hand: number;
  is_projected: boolean;
}

export interface CompetitorSkuSummary {
  sku: string;
  our_current_price: number;
  competitor_price: number;
}

export interface CompetitorAlert {
  suggested_action: string;
  modifier_pct: number;
  confidence_score: number;
}

export interface CompetitorMetrics {
  our_current_price: number;
  competitor_price: number;
  price_difference_pct: number;
}

export interface CompetitorJustification {
  headline: string;
  detailed_reasoning: string;
}

export interface CompetitorAgentDetail {
  sku: string;
  our_current_price: number;
  competitor_price: number;
  price_difference_pct: number;
  status: string;
  timestamp: string;
  alert: CompetitorAlert;
  metrics: CompetitorMetrics;
  justification: CompetitorJustification;
  reasoning: string;
  confidence: number;
  fallback_used: boolean;
}

export interface CustomerItem {
  sku_id: string;
  item_name: string;
  item_category: string;
  unit: string;
  time_to_expire: number;
  old_price: number;
  new_price: number;
  show_old_price: boolean;
  image_url: string;
  description: string;
  protein: string | null;
  calories: string | null;
  carbohydrate: string | null;
}

export interface InventoryAgentDetail {
  sku: string;
  product_name: string;
  category: string;
  unit: string;
  alert: InventoryAlert;
  metrics: InventoryMetrics;
  justification: InventoryJustification;
  depletion_curve: DepletionPoint[];
  reasoning: string;
  confidence: number;
  fallback_used: boolean;
}

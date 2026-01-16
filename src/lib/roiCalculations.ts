/**
 * Unified ROI Calculation Library
 * 
 * This module provides a single source of truth for all ROI calculations
 * across the application. All views and the AI chat use these functions.
 * 
 * Formula: Net AI Value = (FTE Savings × η) + (Revenue × α) + Cost Avoidance - Total Costs
 * ROI % = (Net AI Value / Total Costs) × 100
 */

export interface ROISettings {
  id: string;
  efficiency_factor: number;      // η - efficiency multiplier (0.45-0.90)
  attribution_factor: number;     // α - revenue attribution (0.20-0.50)
  avg_hourly_rate: number;        // Employee billable rate
  avg_hourly_cost: number;        // Employee cost to company
  hours_saved_per_user_week: number;
  learning_curve_penalty: number; // Productivity loss during learning (0.20 = 20%)
  monthly_licenses: number;
  implementation_cost: number;
  training_budget: number;
  learning_curve_hours: number;
  monthly_revenue_uplift: number;
  license_savings: number;
  outsourcing_reduction: number;
  downtime_reduction: number;
  compliance_savings: number;
  fraud_prevention: number;
  rework_reduction: number;
  created_at?: string;
  updated_at?: string;
}

export interface ROICalculation {
  id: string;
  month_index: number;
  month_label: string;
  active_users: number;
  efficiency_factor_used: number;
  attribution_factor_used: number;
  // Savings
  gross_fte_savings: number;
  net_fte_savings: number;
  license_savings: number;
  outsourcing_reduction: number;
  total_hard_savings: number;
  // Revenue
  gross_revenue: number;
  net_revenue: number;
  // Cost Avoidance
  downtime_reduction: number;
  compliance_savings: number;
  fraud_prevention: number;
  rework_reduction: number;
  total_cost_avoidance: number;
  // Totals
  total_benefits: number;
  monthly_costs: number;
  hidden_costs: number;
  total_costs: number;
  monthly_net_benefit: number;  // total_benefits - monthly_costs (beneficio neto del MES, no acumulado)
  monthly_roi: number;
  cumulative_net_value: number;
  cumulative_roi: number;
  cumulative_costs: number;
  created_at?: string;
}

export interface ROIInputs {
  numberOfUsers: number;
  efficiencyFactor: number;
  attributionFactor: number;
  avgHourlyRate: number;
  avgHourlyCost: number;
  hoursSavedPerWeek: number;
  learningCurvePenalty: number;
  monthlyLicenses: number;
  implementationCost: number;
  trainingBudget: number;
  learningCurveHours: number;
  monthlyRevenueUplift: number;
  licenseSavings: number;
  outsourcingReduction: number;
  downtimeReduction: number;
  complianceSavings: number;
  fraudPrevention: number;
  reworkReduction: number;
}

export interface ROIResult {
  // Costs
  hiddenCost: number;
  totalMonthlyCosts: number;
  totalOneTimeCosts: number;
  annualizedCosts: number;
  // Savings
  grossFTESavings: number;
  netFTESavings: number;
  totalHardSavings: number;
  // Revenue
  grossRevenue: number;
  netRevenue: number;
  // Cost Avoidance
  totalCostAvoidance: number;
  // Totals
  totalBenefits: number;
  netAIValue: number;
  roi: number;
  paybackMonths: number;
}

/**
 * Convert database ROI settings to input format for calculations
 */
export function settingsToInputs(settings: ROISettings, activeUsers: number): ROIInputs {
  return {
    numberOfUsers: activeUsers,
    efficiencyFactor: Number(settings.efficiency_factor),
    attributionFactor: Number(settings.attribution_factor),
    avgHourlyRate: Number(settings.avg_hourly_rate),
    avgHourlyCost: Number(settings.avg_hourly_cost),
    hoursSavedPerWeek: Number(settings.hours_saved_per_user_week),
    learningCurvePenalty: Number(settings.learning_curve_penalty),
    monthlyLicenses: Number(settings.monthly_licenses),
    implementationCost: Number(settings.implementation_cost),
    trainingBudget: Number(settings.training_budget),
    learningCurveHours: Number(settings.learning_curve_hours),
    monthlyRevenueUplift: Number(settings.monthly_revenue_uplift),
    licenseSavings: Number(settings.license_savings),
    outsourcingReduction: Number(settings.outsourcing_reduction),
    downtimeReduction: Number(settings.downtime_reduction),
    complianceSavings: Number(settings.compliance_savings),
    fraudPrevention: Number(settings.fraud_prevention),
    reworkReduction: Number(settings.rework_reduction),
  };
}

/**
 * Core ROI calculation function - single source of truth
 * 
 * @param inputs - All parameters needed for ROI calculation
 * @returns Complete ROI breakdown
 */
export function calculateROI(inputs: ROIInputs): ROIResult {
  // Hidden Cost (Learning Curve) - opportunity cost of productivity loss
  const hiddenCost = inputs.numberOfUsers * inputs.learningCurveHours * inputs.avgHourlyCost * inputs.learningCurvePenalty;
  
  // Total Costs
  const totalMonthlyCosts = inputs.monthlyLicenses + (hiddenCost / 12);
  const totalOneTimeCosts = inputs.implementationCost + inputs.trainingBudget;
  const annualizedCosts = (totalMonthlyCosts * 12) + totalOneTimeCosts;

  // Hard Savings (with efficiency factor η)
  const grossFTESavings = inputs.numberOfUsers * inputs.hoursSavedPerWeek * 52 * inputs.avgHourlyRate;
  const netFTESavings = grossFTESavings * inputs.efficiencyFactor;
  const totalHardSavings = netFTESavings + (inputs.licenseSavings * 12) + (inputs.outsourcingReduction * 12);

  // Hard Revenue (with attribution factor α)
  const grossRevenue = inputs.monthlyRevenueUplift * 12;
  const netRevenue = grossRevenue * inputs.attributionFactor;

  // Cost Avoidance (annual)
  const totalCostAvoidance = (inputs.downtimeReduction + inputs.complianceSavings + inputs.fraudPrevention + inputs.reworkReduction) * 12;

  // Total Benefits
  const totalBenefits = totalHardSavings + netRevenue + totalCostAvoidance;

  // Net AI Value
  const netAIValue = totalBenefits - annualizedCosts;

  // ROI %
  const roi = annualizedCosts > 0 ? ((netAIValue / annualizedCosts) * 100) : 0;

  // Payback Period (months)
  const monthlyBenefit = totalBenefits / 12;
  const paybackMonths = monthlyBenefit > 0 ? Math.ceil(annualizedCosts / monthlyBenefit) : Infinity;

  return {
    hiddenCost,
    totalMonthlyCosts,
    totalOneTimeCosts,
    annualizedCosts,
    grossFTESavings,
    netFTESavings,
    totalHardSavings,
    grossRevenue,
    netRevenue,
    totalCostAvoidance,
    totalBenefits,
    netAIValue,
    roi,
    paybackMonths,
  };
}

/**
 * Calculate monthly ROI for a specific month
 * Used for J-curve and trend analysis
 */
export function calculateMonthlyROI(
  inputs: ROIInputs,
  monthIndex: number,
  efficiencyForMonth: number,
  attributionForMonth: number
): { monthlyNetValue: number; monthlyROI: number; monthlyCosts: number } {
  const adjustedInputs = {
    ...inputs,
    efficiencyFactor: efficiencyForMonth,
    attributionFactor: attributionForMonth,
  };
  
  const result = calculateROI(adjustedInputs);
  
  // Monthly values (divide annual by 12)
  const monthlyBenefits = result.totalBenefits / 12;
  const monthlyCosts = result.totalMonthlyCosts + (result.totalOneTimeCosts / 12);
  const monthlyNetValue = monthlyBenefits - monthlyCosts;
  const monthlyROI = monthlyCosts > 0 ? ((monthlyNetValue / monthlyCosts) * 100) : 0;
  
  return { monthlyNetValue, monthlyROI, monthlyCosts };
}

/**
 * Transform ROI calculations for chart display
 */
export function transformCalculationsForCharts(calculations: ROICalculation[]) {
  return calculations.map(calc => ({
    month: calc.month_label,
    roi: Math.round(Number(calc.cumulative_roi) * 10) / 10,
    monthlyRoi: Math.round(Number(calc.monthly_roi) * 10) / 10,
    netValue: Number(calc.monthly_net_benefit),
    cumulativeNetValue: Number(calc.cumulative_net_value),
    totalBenefits: Number(calc.total_benefits),
    totalCosts: Number(calc.total_costs),
    activeUsers: calc.active_users,
    efficiencyFactor: Number(calc.efficiency_factor_used),
  }));
}

/**
 * Get efficiency factor recommendation based on month
 * Represents maturity curve of AI implementation
 */
export function getRecommendedEfficiency(monthIndex: number): number {
  if (monthIndex <= 1) return 0.45;
  if (monthIndex <= 2) return 0.50;
  if (monthIndex <= 3) return 0.55;
  if (monthIndex <= 4) return 0.60;
  if (monthIndex <= 5) return 0.65;
  if (monthIndex <= 6) return 0.70;
  if (monthIndex <= 9) return 0.80;
  return 0.85;
}

/**
 * Get attribution factor recommendation based on month
 * Represents confidence in attributing revenue to AI
 */
export function getRecommendedAttribution(monthIndex: number): number {
  if (monthIndex <= 1) return 0.20;
  if (monthIndex <= 2) return 0.25;
  if (monthIndex <= 3) return 0.30;
  if (monthIndex <= 4) return 0.32;
  if (monthIndex <= 5) return 0.35;
  if (monthIndex <= 6) return 0.38;
  if (monthIndex <= 9) return 0.42;
  return 0.45;
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number, compact = false): string {
  if (compact && Math.abs(value) >= 1000) {
    const sign = value >= 0 ? '' : '−';
    return `${sign}$${Math.abs(value / 1000).toFixed(1)}k`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/**
 * Break-Even Projection Interface
 */
export interface BreakEvenProjection {
  breakEvenMonth: number | null;
  isAchieved: boolean;
  confidence: 'high' | 'medium' | 'low';
  monthsRemaining: number | null;
  projectedDate: string | null;
  projectedValues: Array<{
    month: number;
    label: string;
    projectedBenefit: number;
    projectedCumulative: number;
  }>;
  methodology: string;
}

/**
 * Calculate projected break-even month based on trend analysis
 * 
 * @param calculations - Array of ROI calculations from database
 * @param totalInvestment - Total investment amount (default: 250000)
 * @returns BreakEvenProjection with all projection details
 */
export function calculateBreakEvenProjection(
  calculations: ROICalculation[],
  totalInvestment: number = 250000
): BreakEvenProjection {
  // If no calculations, return null projection
  if (!calculations || calculations.length === 0) {
    return {
      breakEvenMonth: null,
      isAchieved: false,
      confidence: 'low',
      monthsRemaining: null,
      projectedDate: null,
      projectedValues: [],
      methodology: 'Datos insuficientes para proyección',
    };
  }

  // Check if break-even already achieved (cumulative_net_value >= 0)
  const achievedMonth = calculations.find(c => Number(c.cumulative_net_value) >= 0);
  if (achievedMonth) {
    return {
      breakEvenMonth: achievedMonth.month_index,
      isAchieved: true,
      confidence: 'high',
      monthsRemaining: 0,
      projectedDate: achievedMonth.month_label,
      projectedValues: [],
      methodology: 'Break-even alcanzado en datos históricos',
    };
  }

  // Get the last 3 months of monthly_net_benefit to calculate growth rate
  const lastMonths = calculations.slice(-3);
  const benefits = lastMonths.map(c => Number(c.monthly_net_benefit));
  
  // Calculate average growth rate
  let avgGrowthRate = 0;
  let growthRates: number[] = [];
  
  if (benefits.length >= 2) {
    for (let i = 1; i < benefits.length; i++) {
      if (benefits[i - 1] > 0) {
        const rate = (benefits[i] - benefits[i - 1]) / benefits[i - 1];
        growthRates.push(rate);
      }
    }
    if (growthRates.length > 0) {
      avgGrowthRate = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;
    }
  }

  // Get current state
  const latest = calculations[calculations.length - 1];
  const currentMonth = latest.month_index;
  let currentCumulative = Number(latest.cumulative_net_value);
  let currentBenefit = Number(latest.monthly_net_benefit);

  // Project future months until break-even or max 24 months
  const projectedValues: BreakEvenProjection['projectedValues'] = [];
  let breakEvenMonth: number | null = null;
  
  // Use conservative growth rate (75% of average) for projection
  const conservativeGrowthRate = avgGrowthRate * 0.75;
  
  for (let month = currentMonth + 1; month <= currentMonth + 24; month++) {
    // Project benefit with conservative growth
    currentBenefit = currentBenefit * (1 + conservativeGrowthRate);
    currentCumulative = currentCumulative + currentBenefit;
    
    projectedValues.push({
      month,
      label: `M${month}`,
      projectedBenefit: Math.round(currentBenefit),
      projectedCumulative: Math.round(currentCumulative),
    });
    
    if (currentCumulative >= 0 && !breakEvenMonth) {
      breakEvenMonth = month;
      break;
    }
  }

  // Calculate months remaining from current month
  const monthsRemaining = breakEvenMonth ? breakEvenMonth - currentMonth : null;

  // Calculate projected date
  let projectedDate: string | null = null;
  if (breakEvenMonth) {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + (monthsRemaining || 0));
    projectedDate = `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
  }

  // Determine confidence based on trend stability and time to break-even
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  
  if (growthRates.length >= 2) {
    const variance = growthRates.reduce((sum, rate) => 
      sum + Math.pow(rate - avgGrowthRate, 2), 0) / growthRates.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev < 0.1 && breakEvenMonth && breakEvenMonth <= 12) {
      confidence = 'high';
    } else if (stdDev > 0.25 || !breakEvenMonth || breakEvenMonth > 18) {
      confidence = 'low';
    }
  } else {
    confidence = 'low';
  }

  // Build methodology explanation
  const methodology = `Proyección basada en tasa de crecimiento promedio del ${(avgGrowthRate * 100).toFixed(1)}% mensual en beneficios netos. ` +
    `Se aplica factor conservador del 75%. ` +
    `Confianza ${confidence === 'high' ? 'alta' : confidence === 'medium' ? 'media' : 'baja'} basada en estabilidad de tendencia.`;

  return {
    breakEvenMonth,
    isAchieved: false,
    confidence,
    monthsRemaining,
    projectedDate,
    projectedValues: projectedValues.slice(0, 6), // Only return next 6 months
    methodology,
  };
}

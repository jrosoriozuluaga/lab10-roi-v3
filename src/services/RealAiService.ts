import { supabase } from "@/integrations/supabase/client";
import { calculateDepartmentStats } from "@/hooks/useMetrics";
import { calculateBreakEvenProjection, type ROICalculation as ROICalcType } from "@/lib/roiCalculations";

export interface ROICalculation {
  month_label: string;
  month_index: number;
  active_users: number;
  gross_fte_savings: number;
  net_fte_savings: number;
  license_savings: number;
  outsourcing_reduction: number;
  total_hard_savings: number;
  gross_revenue: number;
  net_revenue: number;
  downtime_reduction: number;
  fraud_prevention: number;
  rework_reduction: number;
  compliance_savings: number;
  total_cost_avoidance: number;
  total_benefits: number;
  monthly_costs: number;
  hidden_costs: number;
  total_costs: number;
  monthly_net_benefit: number;  // beneficio neto del MES (total_benefits - monthly_costs)
  monthly_roi: number;
  cumulative_roi: number;
  cumulative_net_value: number;
  cumulative_costs: number;
  efficiency_factor_used: number;
  attribution_factor_used: number;
}

export interface ROISettings {
  efficiency_factor: number;
  attribution_factor: number;
  avg_hourly_rate: number;
  avg_hourly_cost: number;
  hours_saved_per_user_week: number;
  learning_curve_penalty: number;
  learning_curve_hours: number;
  license_savings: number;
  outsourcing_reduction: number;
  monthly_revenue_uplift: number;
  downtime_reduction: number;
  fraud_prevention: number;
  rework_reduction: number;
  compliance_savings: number;
  monthly_licenses: number;
  implementation_cost: number;
  training_budget: number;
}

export interface FinancialSettings {
  total_investment: number;
  amortization_months: number;
  monthly_amortized: number | null;
  fiscal_year_start: string;
}

export interface BreakEvenContext {
  projectedMonth: number | null;
  isAchieved: boolean;
  confidence: 'high' | 'medium' | 'low';
  monthsRemaining: number | null;
  projectedDate: string | null;
  methodology: string;
  projectedValues: Array<{
    month: number;
    label: string;
    projectedBenefit: number;
    projectedCumulative: number;
  }>;
}

export interface DashboardContext {
  summary: {
    netAIValue: string;
    activationRate: number;
    deliveryRate: number;
    projectedROI: string;
    currentMonth: number;
    totalEmployees: number;
    activeUsers: number;
  };
  projects: Array<{
    name: string;
    status: string;
    roi: number | null;
    northStar: string | null;
    department: string | null;
  }>;
  departments: Array<{
    name: string;
    activationRate: number;
    status: string;
  }>;
  alerts: {
    critical: number;
    warning: number;
    opportunity: number;
  };
  roiTrend: Array<{
    month: string;
    value: number;
  }>;
  // Complete data tables for AI
  roiCalculations: ROICalculation[];
  roiSettings: ROISettings | null;
  financialSettings: FinancialSettings | null;
  // Break-even projection
  breakEven: BreakEvenContext | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  chartData?: ChartData | null;
}

export interface ChartData {
  type: 'chart';
  chartType: 'bar' | 'pie' | 'line';
  title: string;
  data: Array<{ name: string; value: number }>;
}

// Gather context data from real database
export async function gatherContextData(): Promise<DashboardContext> {
  // Fetch projects from Supabase
  let projects: DashboardContext['projects'] = [];
  
  try {
    const { data: projectsData, error } = await supabase
      .from('projects')
      .select('name, status, roi_percent, north_star, department')
      .limit(30);
    
    if (!error && projectsData) {
      projects = projectsData.map(p => ({
        name: p.name,
        status: p.status,
        roi: p.roi_percent,
        northStar: p.north_star,
        department: p.department,
      }));
    }
  } catch (e) {
    console.log('Using fallback project data');
  }

  // Fetch monthly metrics for financial calculations
  let monthlyMetrics: Array<{ cumulative_value: number; amortized_cost: number; monthly_roi: number }> = [];
  let netAIValue = -12500; // Default fallback
  
  try {
    const { data: metricsData, error } = await supabase
      .from('monthly_metrics')
      .select('cumulative_value, amortized_cost, monthly_roi, month_index')
      .order('month_index', { ascending: true });

    if (!error && metricsData && metricsData.length > 0) {
      monthlyMetrics = metricsData;
      const latestMetrics = metricsData[metricsData.length - 1];
      const totalAmortizedCost = metricsData.reduce((sum, m) => sum + (m.amortized_cost || 0), 0);
      netAIValue = (latestMetrics.cumulative_value || 0) - totalAmortizedCost;
    }
  } catch (e) {
    console.log('Using fallback metrics data');
  }

  // Fetch employees and calculate department stats
  let departments: DashboardContext['departments'] = [];
  let totalEmployees = 512;
  let activeUsers = 292;
  let activationRate = 57;

  try {
    const { data: employeesData, error } = await supabase
      .from('employees')
      .select('id, department, usage_level, weekly_ai_hours, last_active');

    if (!error && employeesData && employeesData.length > 0) {
      totalEmployees = employeesData.length;
      activeUsers = employeesData.filter(e => e.usage_level !== 'inactive').length;
      activationRate = Math.round((activeUsers / totalEmployees) * 100);

      // Calculate department stats
      const deptStats = calculateDepartmentStats(employeesData as any);
      departments = deptStats.map(d => ({
        name: d.name,
        activationRate: Math.round(d.activationRate),
        status: d.status === 'on-track' ? 'healthy' : d.status === 'at-risk' ? 'warning' : 'critical',
      }));
    }
  } catch (e) {
    console.log('Using fallback employee data');
  }

  // Fallback department data if no employees
  if (departments.length === 0) {
    departments = [
      { name: 'Engineering', activationRate: 80, status: 'healthy' },
      { name: 'Operations', activationRate: 65, status: 'healthy' },
      { name: 'Sales', activationRate: 60, status: 'warning' },
      { name: 'Marketing', activationRate: 60, status: 'warning' },
      { name: 'Finance', activationRate: 40, status: 'warning' },
      { name: 'HR', activationRate: 25, status: 'warning' },
      { name: 'Legal', activationRate: 12, status: 'critical' },
    ];
  }

  // Fetch COMPLETE ROI calculations from roi_calculations (single source of truth)
  let roiTrend: DashboardContext['roiTrend'] = [];
  let roiCalculations: ROICalculation[] = [];
  
  try {
    const { data: roiData, error } = await supabase
      .from('roi_calculations')
      .select('*')
      .order('month_index', { ascending: true });

    if (!error && roiData) {
      roiCalculations = roiData as ROICalculation[];
      roiTrend = roiData.map(m => ({
        month: m.month_label,
        value: Number(m.cumulative_roi),
      }));
    }
  } catch (e) {
    console.log('Using fallback ROI data');
  }

  // Fallback ROI trend (aligned with roi_calculations)
  if (roiTrend.length === 0) {
    roiTrend = [
      { month: 'Mes 0', value: -100 },
      { month: 'Mes 1', value: -91.7 },
      { month: 'Mes 2', value: -81.3 },
      { month: 'Mes 3', value: -68.7 },
    ];
  }

  // Fetch ROI settings (methodology parameters)
  let roiSettings: ROISettings | null = null;
  
  try {
    const { data: settingsData, error } = await supabase
      .from('roi_settings')
      .select('*')
      .maybeSingle();

    if (!error && settingsData) {
      roiSettings = settingsData as ROISettings;
    }
  } catch (e) {
    console.log('Using fallback ROI settings');
  }

  // Fetch financial settings (investment data)
  let financialSettings: FinancialSettings | null = null;
  
  try {
    const { data: finData, error } = await supabase
      .from('financial_settings')
      .select('*')
      .maybeSingle();

    if (!error && finData) {
      financialSettings = finData as FinancialSettings;
    }
  } catch (e) {
    console.log('Using fallback financial settings');
  }

  // Calculate delivery rate from projects
  const totalProjects = projects.length || 5;
  const onTrackProjects = projects.filter(p => p.status === 'on-track').length;
  const deliveryRate = totalProjects > 0 ? Math.round((onTrackProjects / totalProjects) * 100) : 68;

  // Calculate alerts from department/project status
  const criticalDepts = departments.filter(d => d.status === 'critical').length;
  const warningDepts = departments.filter(d => d.status === 'warning').length;
  const atRiskProjects = projects.filter(p => p.status === 'at-risk' || p.status === 'off-track').length;

  // Format Net AI Value for display
  const formatNetAIValue = (value: number): string => {
    const absValue = Math.abs(value);
    if (absValue >= 1000) {
      return `${value >= 0 ? '' : '-'}$${(absValue / 1000).toFixed(1)}k`;
    }
    return `${value >= 0 ? '' : '-'}$${absValue.toLocaleString()}`;
  };

  // Calculate break-even projection
  let breakEven: BreakEvenContext | null = null;
  if (roiCalculations.length > 0) {
    const totalInvestment = financialSettings?.total_investment || 250000;
    const projection = calculateBreakEvenProjection(roiCalculations as ROICalcType[], totalInvestment);
    breakEven = {
      projectedMonth: projection.breakEvenMonth,
      isAchieved: projection.isAchieved,
      confidence: projection.confidence,
      monthsRemaining: projection.monthsRemaining,
      projectedDate: projection.projectedDate,
      methodology: projection.methodology,
      projectedValues: projection.projectedValues,
    };
  }

  return {
    summary: {
      netAIValue: formatNetAIValue(netAIValue),
      activationRate,
      deliveryRate,
      projectedROI: '+45%',
      currentMonth: roiTrend.length || 3,
      totalEmployees,
      activeUsers,
    },
    projects,
    departments,
    alerts: {
      critical: criticalDepts + atRiskProjects,
      warning: warningDepts,
      opportunity: 3,
    },
    roiTrend,
    roiCalculations,
    roiSettings,
    financialSettings,
    breakEven,
  };
}

// Parse AI response for chart data
export function parseChartData(content: string): { text: string; chartData: ChartData | null } {
  // Try to find JSON chart object in the response
  const jsonMatch = content.match(/\{[\s\S]*"type"\s*:\s*"chart"[\s\S]*\}/);
  
  if (jsonMatch) {
    try {
      const chartData = JSON.parse(jsonMatch[0]) as ChartData;
      if (chartData.type === 'chart' && chartData.data && Array.isArray(chartData.data)) {
        // Remove the JSON from the text response
        const text = content.replace(jsonMatch[0], '').trim();
        return { text, chartData };
      }
    } catch (e) {
      console.log('Failed to parse chart JSON:', e);
    }
  }
  
  return { text: content, chartData: null };
}

// Send message to AI copilot
export async function sendMessage(query: string, contextData: DashboardContext): Promise<{ response: string; chartData: ChartData | null }> {
  const { data, error } = await supabase.functions.invoke('chat-copilot', {
    body: { query, contextData },
  });

  if (error) {
    console.error('Error calling chat-copilot:', error);
    throw new Error(error.message || 'Error al comunicarse con el asistente');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  const { text, chartData } = parseChartData(data.response);
  
  return { response: text, chartData };
}

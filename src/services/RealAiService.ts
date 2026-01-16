import { supabase } from "@/integrations/supabase/client";
import { calculateDepartmentStats } from "@/hooks/useMetrics";

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

  // Fetch ROI trend from monthly_metrics
  let roiTrend: DashboardContext['roiTrend'] = [];
  
  try {
    const { data: metricsData, error } = await supabase
      .from('monthly_metrics')
      .select('month_label, monthly_roi')
      .order('month_index', { ascending: true });

    if (!error && metricsData) {
      roiTrend = metricsData.map(m => ({
        month: m.month_label,
        value: m.monthly_roi,
      }));
    }
  } catch (e) {
    console.log('Using fallback ROI data');
  }

  // Fallback ROI trend
  if (roiTrend.length === 0) {
    roiTrend = [
      { month: 'Mes 1', value: -80 },
      { month: 'Mes 2', value: -40 },
      { month: 'Mes 3', value: 3 },
    ];
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

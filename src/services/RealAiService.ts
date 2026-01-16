import { supabase } from "@/integrations/supabase/client";

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

// Gather context data from mock data (can be extended to use real Supabase data)
export async function gatherContextData(): Promise<DashboardContext> {
  // Fetch projects from Supabase if available
  let projects: DashboardContext['projects'] = [];
  
  try {
    const { data: projectsData, error } = await supabase
      .from('projects')
      .select('name, status')
      .limit(20);
    
    if (!error && projectsData) {
      projects = projectsData.map(p => ({
        name: p.name,
        status: p.status,
        roi: null,
        northStar: null,
        department: null,
      }));
    }
  } catch (e) {
    console.log('Using mock project data');
  }

  // If no projects from DB, use mock data
  if (projects.length === 0) {
    projects = [
      { name: 'Predicción de Churn', status: 'on-track', roi: 45, northStar: 'Tasa de retención +12%', department: 'Customer Success' },
      { name: 'Automatización Legal', status: 'at-risk', roi: -5, northStar: 'Reducir tiempo revisión 40%', department: 'Legal' },
      { name: 'AI Customer Support', status: 'on-track', roi: 78, northStar: 'CSAT > 90%', department: 'Support' },
      { name: 'Sales Forecasting', status: 'delayed', roi: 12, northStar: 'Accuracy > 85%', department: 'Sales' },
      { name: 'HR Analytics', status: 'on-track', roi: 34, northStar: 'Reducir turnover 15%', department: 'HR' },
    ];
  }

  // Department data based on typical activation patterns
  const departments: DashboardContext['departments'] = [
    { name: 'Engineering', activationRate: 85, status: 'healthy' },
    { name: 'Product', activationRate: 72, status: 'healthy' },
    { name: 'Sales', activationRate: 45, status: 'warning' },
    { name: 'Marketing', activationRate: 38, status: 'warning' },
    { name: 'Legal', activationRate: 20, status: 'critical' },
    { name: 'HR', activationRate: 55, status: 'warning' },
    { name: 'Finance', activationRate: 42, status: 'warning' },
    { name: 'Support', activationRate: 68, status: 'healthy' },
  ];

  // ROI J-Curve trend
  const roiTrend = [
    { month: 'Mes 1', value: -45 },
    { month: 'Mes 2', value: -35 },
    { month: 'Mes 3', value: -25 },
    { month: 'Mes 4', value: -10 },
    { month: 'Mes 5', value: 8 },
    { month: 'Mes 6', value: 25 },
    { month: 'Mes 7', value: 45 },
    { month: 'Mes 8', value: 68 },
    { month: 'Mes 9', value: 92 },
    { month: 'Mes 10', value: 115 },
    { month: 'Mes 11', value: 135 },
    { month: 'Mes 12', value: 156 },
  ];

  // Calculate summary metrics
  const totalEmployees = 1200;
  const activeUsers = Math.round(totalEmployees * 0.52);
  const activationRate = 52;
  const deliveryRate = 68;

  return {
    summary: {
      netAIValue: '$2.4M',
      activationRate,
      deliveryRate,
      projectedROI: '156%',
      currentMonth: 3,
      totalEmployees,
      activeUsers,
    },
    projects,
    departments,
    alerts: {
      critical: 2,
      warning: 5,
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

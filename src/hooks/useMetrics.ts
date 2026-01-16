import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Types matching database schema
interface MonthlyMetric {
  id: string;
  month_index: number;
  month_label: string;
  cash_outflow: number;
  amortized_cost: number;
  value_realized: number;
  monthly_roi: number;
  cumulative_value: number | null;
  cumulative_payback_pct: number | null;
  adoption_rate: number;
  active_users: number;
  mau_rate: number | null;
  power_users_count: number | null;
}

interface FinancialSettings {
  id: string;
  total_investment: number;
  fiscal_year_start: string;
  amortization_months: number;
  monthly_amortized: number | null;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  usage_level: string;
  weekly_ai_hours: number | null;
  last_active: string | null;
}

interface Project {
  id: string;
  name: string;
  owner: string;
  status: string;
  north_star: string;
  department: string | null;
  budget_allocated: number | null;
  budget_spent: number | null;
  roi_percent: number | null;
  impact_level: string;
  created_at: string | null;
  updated_at: string | null;
}

// Department stats calculated from employees
interface DepartmentStats {
  name: string;
  totalUsers: number;
  activeUsers: number;
  activationRate: number;
  mauRate: number;
  powerUsers: number;
  avgWeeklyHours: number;
  status: 'on-track' | 'at-risk' | 'critical';
}

// Fetch monthly metrics (for charts and CFO view)
export function useMonthlyMetrics() {
  return useQuery({
    queryKey: ['monthly-metrics'],
    queryFn: async (): Promise<MonthlyMetric[]> => {
      const { data, error } = await supabase
        .from('monthly_metrics')
        .select('*')
        .order('month_index', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch financial settings (for CFO view)
export function useFinancialSettings() {
  return useQuery({
    queryKey: ['financial-settings'],
    queryFn: async (): Promise<FinancialSettings | null> => {
      const { data, error } = await supabase
        .from('financial_settings')
        .select('*')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Fetch all employees (for adoption metrics and stats)
export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async (): Promise<Employee[]> => {
      const { data, error } = await supabase
        .from('employees')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch projects
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000,
  });
}

// Calculate department stats from employees
export function useDepartmentStats() {
  const { data: employees, isLoading, error } = useEmployees();

  const departmentStats: DepartmentStats[] = employees ? calculateDepartmentStats(employees) : [];

  return { data: departmentStats, isLoading, error };
}

// Helper function to calculate stats per department
export function calculateDepartmentStats(employees: Employee[]): DepartmentStats[] {
  const deptMap = new Map<string, Employee[]>();

  // Group by department
  for (const emp of employees) {
    const existing = deptMap.get(emp.department) || [];
    existing.push(emp);
    deptMap.set(emp.department, existing);
  }

  const stats: DepartmentStats[] = [];

  for (const [deptName, deptEmployees] of deptMap) {
    const total = deptEmployees.length;
    const active = deptEmployees.filter(e => e.usage_level !== 'inactive');
    const activeCount = active.length;
    const powerUsers = deptEmployees.filter(e => e.usage_level === 'power').length;
    
    const activationRate = total > 0 ? (activeCount / total) * 100 : 0;
    const mauRate = activationRate * 0.85; // Approximate MAU as 85% of activation
    
    const totalHours = active.reduce((sum, e) => sum + (e.weekly_ai_hours || 0), 0);
    const avgWeeklyHours = activeCount > 0 ? totalHours / activeCount : 0;

    // Determine status based on activation rate
    let status: 'on-track' | 'at-risk' | 'critical';
    if (activationRate >= 60) {
      status = 'on-track';
    } else if (activationRate >= 30) {
      status = 'at-risk';
    } else {
      status = 'critical';
    }

    stats.push({
      name: deptName,
      totalUsers: total,
      activeUsers: activeCount,
      activationRate,
      mauRate,
      powerUsers,
      avgWeeklyHours,
      status,
    });
  }

  // Sort by activation rate descending
  return stats.sort((a, b) => b.activationRate - a.activationRate);
}

// Hook to get overall summary metrics
export function useSummaryMetrics() {
  const { data: employees, isLoading: loadingEmployees } = useEmployees();
  const { data: metrics, isLoading: loadingMetrics } = useMonthlyMetrics();
  const { data: projects, isLoading: loadingProjects } = useProjects();
  const { data: settings, isLoading: loadingSettings } = useFinancialSettings();

  const isLoading = loadingEmployees || loadingMetrics || loadingProjects || loadingSettings;

  if (isLoading || !employees || !metrics) {
    return { data: null, isLoading };
  }

  const totalEmployees = employees.length;
  const activeUsers = employees.filter(e => e.usage_level !== 'inactive').length;
  const activationRate = totalEmployees > 0 ? Math.round((activeUsers / totalEmployees) * 100) : 0;
  
  const latestMetrics = metrics[metrics.length - 1];
  const currentMonthROI = latestMetrics?.monthly_roi || 0;
  const cumulativeValue = latestMetrics?.cumulative_value || 0;
  const investment = settings?.total_investment || 250000;
  
  const netAIValue = cumulativeValue - (latestMetrics?.amortized_cost || 0) * (metrics?.length || 0);
  
  const totalProjects = projects?.length || 0;
  const onTrackProjects = projects?.filter(p => p.status === 'on-track').length || 0;
  const deliveryRate = totalProjects > 0 ? Math.round((onTrackProjects / totalProjects) * 100) : 0;

  return {
    data: {
      totalEmployees,
      activeUsers,
      activationRate,
      currentMonthROI,
      netAIValue,
      investment,
      deliveryRate,
      totalProjects,
      onTrackProjects,
      cumulativePaybackPct: latestMetrics?.cumulative_payback_pct || 0,
    },
    isLoading,
  };
}

// Transform monthly metrics for charts (mock data format compatibility)
export function transformMetricsForCharts(metrics: MonthlyMetric[]) {
  return metrics.map(m => ({
    month: m.month_label,
    roi: m.monthly_roi,
    activationRate: m.adoption_rate,
    mauRate: m.mau_rate || 0,
    cashOutflow: m.cash_outflow,
    amortizedCost: m.amortized_cost,
    valueRealized: m.value_realized,
    cumulativePaybackPct: m.cumulative_payback_pct || 0,
    monthlyRoi: m.monthly_roi,
  }));
}

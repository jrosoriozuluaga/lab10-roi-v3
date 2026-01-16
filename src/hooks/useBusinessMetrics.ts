import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ROICalculation } from '@/lib/roiCalculations';

/**
 * Single Source of Truth for Business Metrics
 * 
 * This hook fetches data exclusively from `roi_calculations` table,
 * ensuring all views (CEO, CFO, Dashboard) display consistent numbers.
 * 
 * Usage:
 *   const { history, current, isLoading } = useBusinessMetrics();
 *   - KPI Cards: use `current.monthly_roi`, `current.cumulative_roi`
 *   - Charts: use `history` array for trend visualization
 */

export interface BusinessMetrics {
  history: ROICalculation[];     // Array of M1, M2, M3... for operational charts (excludes M0)
  timeline: ROICalculation[];    // Full timeline M0, M1, M2, M3... for ROI J-curve (includes M0)
  current: ROICalculation;       // Latest month for KPI cards
  isLoading: boolean;
  error: Error | null;
}

export function useBusinessMetrics(): BusinessMetrics {
  const { data, isLoading, error } = useQuery({
    queryKey: ['roi-calculations', 'business-metrics'],
    queryFn: async (): Promise<ROICalculation[]> => {
      const { data, error } = await supabase
        .from('roi_calculations')
        .select('*')
        .order('month_index', { ascending: true });
      
      if (error) throw error;
      return (data as ROICalculation[]) || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Full timeline including M0 for cumulative ROI J-curve charts
  const timeline = data || [];
  
  // Filter out M0 (investment month) for operational history
  const history = data?.filter(d => d.month_index > 0) || [];
  
  // Get the latest month as current status
  const current = history.length > 0 
    ? history[history.length - 1] 
    : null;

  return {
    history,
    timeline,
    current: current as ROICalculation,
    isLoading,
    error: error as Error | null,
  };
}

/**
 * Transform business metrics for chart display
 * Maps ROICalculation to chart-friendly format
 */
export function transformForChart(history: ROICalculation[]) {
  return history.map(calc => ({
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

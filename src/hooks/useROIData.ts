import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ROISettings, ROICalculation } from '@/lib/roiCalculations';

/**
 * Fetch ROI settings (methodology parameters)
 * These are the unified parameters used across all views
 */
export function useROISettings() {
  return useQuery({
    queryKey: ['roi-settings'],
    queryFn: async (): Promise<ROISettings | null> => {
      const { data, error } = await supabase
        .from('roi_settings')
        .select('*')
        .maybeSingle();
      
      if (error) throw error;
      return data as ROISettings | null;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - settings don't change often
  });
}

/**
 * Fetch all ROI calculations (pre-calculated monthly values)
 * Used for Dashboard charts and historical analysis
 */
export function useROICalculations() {
  return useQuery({
    queryKey: ['roi-calculations'],
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
}

/**
 * Get the latest ROI calculation (current month)
 */
export function useLatestROICalculation() {
  return useQuery({
    queryKey: ['roi-calculations', 'latest'],
    queryFn: async (): Promise<ROICalculation | null> => {
      const { data, error } = await supabase
        .from('roi_calculations')
        .select('*')
        .order('month_index', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as ROICalculation | null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Combined hook for getting unified ROI summary metrics
 * Used by Dashboard and StakeholderView
 */
export function useUnifiedROIMetrics() {
  const { data: settings, isLoading: loadingSettings } = useROISettings();
  const { data: calculations, isLoading: loadingCalculations } = useROICalculations();
  const { data: latest, isLoading: loadingLatest } = useLatestROICalculation();

  const isLoading = loadingSettings || loadingCalculations || loadingLatest;

  if (isLoading || !settings || !calculations || !latest) {
    return { data: null, isLoading, settings: null, calculations: [] };
  }

  // Get key metrics from the latest calculation
  const currentMonthROI = Number(latest.monthly_roi);
  const cumulativeROI = Number(latest.cumulative_roi);
  const monthlyNetBenefit = Number(latest.monthly_net_benefit);  // beneficio del mes (no acumulado)
  const cumulativeNetValue = Number(latest.cumulative_net_value);
  const totalBenefits = Number(latest.total_benefits);
  const totalCosts = Number(latest.total_costs);
  const cumulativeCosts = Number(latest.cumulative_costs);
  
  // Calculate break-even month (first month with positive cumulative ROI)
  const breakEvenMonth = calculations.find(c => Number(c.cumulative_roi) > 0)?.month_index || null;
  
  // Project M12 ROI based on trend
  const lastThreeMonths = calculations.slice(-3);
  const avgMonthlyGrowth = lastThreeMonths.length >= 2 
    ? (Number(lastThreeMonths[lastThreeMonths.length - 1].cumulative_roi) - Number(lastThreeMonths[0].cumulative_roi)) / lastThreeMonths.length
    : 0;
  const projectedM12ROI = cumulativeROI + (avgMonthlyGrowth * (12 - latest.month_index));

  return {
    data: {
      // Current month metrics
      currentMonthROI,
      cumulativeROI,
      monthlyNetBenefit,  // beneficio neto del mes actual
      cumulativeNetValue,
      totalBenefits,
      totalCosts,
      cumulativeCosts,
      // Key factors used
      efficiencyFactor: Number(latest.efficiency_factor_used),
      attributionFactor: Number(latest.attribution_factor_used),
      activeUsers: latest.active_users,
      // Projections
      breakEvenMonth,
      projectedM12ROI: Math.round(projectedM12ROI),
      currentMonth: latest.month_index,
      monthLabel: latest.month_label,
    },
    isLoading,
    settings,
    calculations,
  };
}

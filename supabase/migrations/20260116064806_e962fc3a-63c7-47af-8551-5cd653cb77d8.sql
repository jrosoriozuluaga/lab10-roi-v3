-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create ROI settings table for unified methodology parameters
CREATE TABLE public.roi_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  efficiency_factor numeric NOT NULL DEFAULT 0.55,
  attribution_factor numeric NOT NULL DEFAULT 0.30,
  avg_hourly_rate numeric NOT NULL DEFAULT 45,
  avg_hourly_cost numeric NOT NULL DEFAULT 35,
  hours_saved_per_user_week numeric NOT NULL DEFAULT 2.5,
  learning_curve_penalty numeric NOT NULL DEFAULT 0.20,
  monthly_licenses numeric NOT NULL DEFAULT 8500,
  implementation_cost numeric NOT NULL DEFAULT 15000,
  training_budget numeric NOT NULL DEFAULT 12000,
  learning_curve_hours numeric NOT NULL DEFAULT 20,
  monthly_revenue_uplift numeric NOT NULL DEFAULT 25000,
  license_savings numeric NOT NULL DEFAULT 2000,
  outsourcing_reduction numeric NOT NULL DEFAULT 3500,
  downtime_reduction numeric NOT NULL DEFAULT 1500,
  compliance_savings numeric NOT NULL DEFAULT 800,
  fraud_prevention numeric NOT NULL DEFAULT 500,
  rework_reduction numeric NOT NULL DEFAULT 1200,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ROI calculations table for pre-calculated monthly values
CREATE TABLE public.roi_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_index integer NOT NULL UNIQUE,
  month_label text NOT NULL,
  active_users integer NOT NULL DEFAULT 0,
  efficiency_factor_used numeric NOT NULL DEFAULT 0.55,
  attribution_factor_used numeric NOT NULL DEFAULT 0.30,
  gross_fte_savings numeric NOT NULL DEFAULT 0,
  net_fte_savings numeric NOT NULL DEFAULT 0,
  license_savings numeric NOT NULL DEFAULT 0,
  outsourcing_reduction numeric NOT NULL DEFAULT 0,
  total_hard_savings numeric NOT NULL DEFAULT 0,
  gross_revenue numeric NOT NULL DEFAULT 0,
  net_revenue numeric NOT NULL DEFAULT 0,
  downtime_reduction numeric NOT NULL DEFAULT 0,
  compliance_savings numeric NOT NULL DEFAULT 0,
  fraud_prevention numeric NOT NULL DEFAULT 0,
  rework_reduction numeric NOT NULL DEFAULT 0,
  total_cost_avoidance numeric NOT NULL DEFAULT 0,
  total_benefits numeric NOT NULL DEFAULT 0,
  monthly_costs numeric NOT NULL DEFAULT 0,
  hidden_costs numeric NOT NULL DEFAULT 0,
  total_costs numeric NOT NULL DEFAULT 0,
  net_ai_value numeric NOT NULL DEFAULT 0,
  monthly_roi numeric NOT NULL DEFAULT 0,
  cumulative_net_value numeric NOT NULL DEFAULT 0,
  cumulative_roi numeric NOT NULL DEFAULT 0,
  cumulative_costs numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.roi_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roi_calculations ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Authenticated users can read roi_settings"
ON public.roi_settings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can read roi_calculations"
ON public.roi_calculations FOR SELECT USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_roi_settings_updated_at
BEFORE UPDATE ON public.roi_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.roi_settings (
  efficiency_factor, attribution_factor, avg_hourly_rate, avg_hourly_cost,
  hours_saved_per_user_week, learning_curve_penalty, monthly_licenses,
  implementation_cost, training_budget, learning_curve_hours, monthly_revenue_uplift,
  license_savings, outsourcing_reduction, downtime_reduction, compliance_savings,
  fraud_prevention, rework_reduction
) VALUES (
  0.55, 0.30, 45, 35, 2.5, 0.20, 8500, 15000, 12000, 20, 25000, 2000, 3500, 1500, 800, 500, 1200
);

-- Insert ROI calculations for months 1-6
INSERT INTO public.roi_calculations (
  month_index, month_label, active_users, efficiency_factor_used, attribution_factor_used,
  gross_fte_savings, net_fte_savings, license_savings, outsourcing_reduction, total_hard_savings,
  gross_revenue, net_revenue, downtime_reduction, compliance_savings, fraud_prevention, 
  rework_reduction, total_cost_avoidance, total_benefits, monthly_costs, hidden_costs, 
  total_costs, net_ai_value, monthly_roi, cumulative_net_value, cumulative_roi, cumulative_costs
) VALUES
  (1, 'M1', 180, 0.45, 0.20, 35100, 15795, 2000, 3500, 21295, 25000, 5000, 1500, 800, 500, 1200, 4000, 30295, 8500, 6300, 14800, 15495, 4.7, 15495, 4.7, 14800),
  (2, 'M2', 220, 0.50, 0.25, 42900, 21450, 2000, 3500, 26950, 25000, 6250, 1500, 800, 500, 1200, 4000, 37200, 8500, 3850, 12350, 24850, 101.2, 40345, 51.6, 27150),
  (3, 'M3', 292, 0.55, 0.30, 56940, 31317, 2000, 3500, 36817, 25000, 7500, 1500, 800, 500, 1200, 4000, 48317, 8500, 2555, 11055, 37262, 237.1, 77607, 103.3, 38205),
  (4, 'M4', 340, 0.60, 0.32, 66300, 39780, 2000, 3500, 45280, 25000, 8000, 1500, 800, 500, 1200, 4000, 57280, 8500, 1785, 10285, 46995, 356.9, 124602, 152.5, 48490),
  (5, 'M5', 380, 0.65, 0.35, 74100, 48165, 2000, 3500, 53665, 25000, 8750, 1500, 800, 500, 1200, 4000, 66415, 8500, 1330, 9830, 56585, 475.6, 181187, 207.9, 58320),
  (6, 'M6', 410, 0.70, 0.38, 79950, 55965, 2000, 3500, 61465, 25000, 9500, 1500, 800, 500, 1200, 4000, 74965, 8500, 1015, 9515, 65450, 588.0, 246637, 263.4, 67835);
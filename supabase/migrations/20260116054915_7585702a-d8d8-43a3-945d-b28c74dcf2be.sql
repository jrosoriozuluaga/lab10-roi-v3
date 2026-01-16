-- Create financial_settings table (single row config)
CREATE TABLE public.financial_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_investment NUMERIC NOT NULL DEFAULT 250000,
  fiscal_year_start DATE NOT NULL DEFAULT '2026-01-01',
  amortization_months INT NOT NULL DEFAULT 12,
  monthly_amortized NUMERIC GENERATED ALWAYS AS (total_investment / amortization_months) STORED,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.financial_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read financial_settings" ON public.financial_settings
  FOR SELECT USING (true);

-- Insert default config
INSERT INTO public.financial_settings (total_investment, fiscal_year_start, amortization_months)
VALUES (250000, '2026-01-01', 12);

-- Create monthly_metrics table
CREATE TABLE public.monthly_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month_index INT NOT NULL UNIQUE CHECK (month_index >= 1 AND month_index <= 12),
  month_label TEXT NOT NULL,
  cash_outflow NUMERIC NOT NULL DEFAULT 0,
  amortized_cost NUMERIC NOT NULL DEFAULT 0,
  value_realized NUMERIC NOT NULL DEFAULT 0,
  monthly_roi NUMERIC NOT NULL DEFAULT 0,
  cumulative_value NUMERIC DEFAULT 0,
  cumulative_payback_pct NUMERIC DEFAULT 0,
  adoption_rate NUMERIC NOT NULL DEFAULT 0,
  active_users INT NOT NULL DEFAULT 0,
  mau_rate NUMERIC DEFAULT 0,
  power_users_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.monthly_metrics ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read monthly_metrics" ON public.monthly_metrics
  FOR SELECT USING (true);

-- Insert the 3-month J-curve data with $250k upfront
INSERT INTO public.monthly_metrics 
  (month_index, month_label, cash_outflow, amortized_cost, value_realized, monthly_roi, cumulative_value, cumulative_payback_pct, adoption_rate, active_users, mau_rate, power_users_count)
VALUES
  (1, 'Mes 1', 250000, 20833.33, 4500, -78.4, 4500, 1.8, 15, 77, 25, 8),
  (2, 'Mes 2', 0, 20833.33, 15600, -25.1, 20100, 8.0, 35, 179, 45, 22),
  (3, 'Mes 3', 0, 20833.33, 21460, 3.0, 41560, 16.6, 57, 292, 68, 40);

-- Create employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  role TEXT NOT NULL,
  usage_level TEXT NOT NULL DEFAULT 'inactive' 
    CHECK (usage_level IN ('inactive', 'low', 'medium', 'high', 'power')),
  weekly_ai_hours NUMERIC DEFAULT 0,
  last_active DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read employees" ON public.employees
  FOR SELECT USING (true);

-- Add columns to projects table
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS budget_allocated NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS budget_spent NUMERIC DEFAULT 0;
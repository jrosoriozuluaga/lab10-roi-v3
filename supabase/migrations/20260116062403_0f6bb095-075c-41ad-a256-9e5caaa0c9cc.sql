-- Drop existing public policies on financial_settings
DROP POLICY IF EXISTS "Allow public read financial_settings" ON public.financial_settings;

-- Create authenticated-only policy for financial_settings
CREATE POLICY "Authenticated users can read financial_settings"
ON public.financial_settings FOR SELECT
TO authenticated
USING (true);

-- Drop existing public policies on projects
DROP POLICY IF EXISTS "Allow public read" ON public.projects;
DROP POLICY IF EXISTS "Allow public insert" ON public.projects;
DROP POLICY IF EXISTS "Allow public update" ON public.projects;
DROP POLICY IF EXISTS "Allow public delete" ON public.projects;

-- Create authenticated policies for projects
CREATE POLICY "Authenticated users can read projects"
ON public.projects FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
ON public.projects FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete projects"
ON public.projects FOR DELETE
TO authenticated
USING (true);

-- Drop existing public policies on employees
DROP POLICY IF EXISTS "Allow public read employees" ON public.employees;

-- Create authenticated-only policy for employees
CREATE POLICY "Authenticated users can read employees"
ON public.employees FOR SELECT
TO authenticated
USING (true);

-- Drop existing public policies on monthly_metrics
DROP POLICY IF EXISTS "Allow public read monthly_metrics" ON public.monthly_metrics;

-- Create authenticated-only policy for monthly_metrics
CREATE POLICY "Authenticated users can read monthly_metrics"
ON public.monthly_metrics FOR SELECT
TO authenticated
USING (true);
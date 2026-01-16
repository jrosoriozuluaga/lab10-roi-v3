-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'on-track' CHECK (status IN ('on-track', 'at-risk', 'off-track')),
  north_star TEXT NOT NULL,
  roi_percent NUMERIC DEFAULT 0,
  impact_level TEXT NOT NULL DEFAULT 'medium' CHECK (impact_level IN ('high', 'medium', 'low')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public read policy (demo purposes - no auth required)
CREATE POLICY "Allow public read" ON public.projects
  FOR SELECT USING (true);

-- Public insert policy
CREATE POLICY "Allow public insert" ON public.projects
  FOR INSERT WITH CHECK (true);

-- Public update policy
CREATE POLICY "Allow public update" ON public.projects
  FOR UPDATE USING (true);

-- Public delete policy
CREATE POLICY "Allow public delete" ON public.projects
  FOR DELETE USING (true);

-- Seed initial data matching Month 3 narrative
INSERT INTO public.projects (name, owner, status, north_star, roi_percent, impact_level) VALUES
  ('Automatización de Reportes Financieros', 'Ana Martínez', 'on-track', 'Ahorro de Costos', 35, 'high'),
  ('Chatbot de Soporte al Cliente', 'Carlos Ruiz', 'at-risk', 'Satisfacción del Cliente', -5, 'high'),
  ('Predicción de Churn', 'Laura Gómez', 'on-track', 'Tasa de Retención', 22, 'medium'),
  ('Asistente de Ventas AI', 'Miguel Torres', 'off-track', 'Revenue Lift', -15, 'high'),
  ('Análisis de Contratos Legal', 'Sofía Herrera', 'on-track', 'Reducción de Riesgo', 18, 'low');
-- Renombrar columna net_ai_value a monthly_net_benefit para mayor claridad
-- net_ai_value era confuso porque contiene el beneficio MENSUAL, no el valor total
ALTER TABLE roi_calculations 
RENAME COLUMN net_ai_value TO monthly_net_benefit;
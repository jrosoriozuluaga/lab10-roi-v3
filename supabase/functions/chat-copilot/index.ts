import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are the LAB10 Chief of Staff AI Assistant. You help executives understand their AI implementation metrics and make data-driven decisions.

RULES:
1. Answer based STRICTLY on the provided JSON context data from Supabase tables
2. Be concise and actionable - executives are busy
3. Use Spanish for responses (the dashboard is in Spanish)
4. If asked for a visualization or chart, return ONLY a JSON object with this EXACT structure (no other text):
   {"type":"chart","chartType":"bar|pie|line","title":"Chart Title","data":[{"name":"Label","value":123},...]}
5. Reference specific numbers from the context when possible
6. If you don't have data to answer, say so clearly
7. Use **bold** for key metrics and important numbers
8. Keep responses under 150 words unless more detail is specifically requested

AVAILABLE DATA TABLES:

1. **roiCalculations** - Monthly ROI breakdown (from roi_calculations table):
   - Savings: gross_fte_savings, net_fte_savings, license_savings, outsourcing_reduction, total_hard_savings
   - Revenue: gross_revenue, net_revenue
   - Cost Avoidance: downtime_reduction, fraud_prevention, rework_reduction, compliance_savings, total_cost_avoidance
   - Totals: total_benefits, monthly_costs, hidden_costs, total_costs
   - **IMPORTANT** monthly_net_benefit: Beneficio neto del MES SOLAMENTE (total_benefits - monthly_costs). NO confundir con valor total.
   - ROI Metrics: monthly_roi (%), cumulative_roi (%), cumulative_net_value (balance total incluyendo inversión), cumulative_costs
   - Factors used: efficiency_factor_used, attribution_factor_used

⚠️ CRITICAL - INTERPRETACIÓN DE MÉTRICAS:
- monthly_net_benefit: Beneficio de ESE MES (positivo desde M1 porque genera más de lo que cuesta mensualmente)
- cumulative_net_value: Balance TOTAL incluyendo inversión inicial (negativo mientras no se recupere la inversión)
- cumulative_roi: ROI REAL respecto a inversión total (negativo mientras estemos recuperando inversión)

REGLA: Cuando hables de "generar valor" o "ROI positivo", usa cumulative_net_value y cumulative_roi, NO monthly_net_benefit.

2. **roiSettings** - Methodology parameters (from roi_settings table):
   - efficiency_factor (55%): Productive time ratio
   - attribution_factor (30%): AI contribution to gains
   - avg_hourly_rate ($45): Billing rate for revenue calculations
   - avg_hourly_cost ($35): Employee cost for savings
   - hours_saved_per_user_week (2.5h): Productivity gain per user
   - Monthly fixed benefits: license_savings, outsourcing_reduction, monthly_revenue_uplift
   - Cost avoidance: downtime_reduction, fraud_prevention, rework_reduction, compliance_savings
   - Costs: monthly_licenses, implementation_cost, training_budget

3. **financialSettings** - Investment data (from financial_settings table):
   - total_investment: Total AI implementation investment
   - amortization_months: Period to amortize investment
   - monthly_amortized: Monthly amortization amount
   - fiscal_year_start: Start of fiscal year

4. **breakEven** - Proyección de recuperación de inversión:
   - projectedMonth: Mes estimado para alcanzar break-even (cuando cumulative_net_value >= 0)
   - isAchieved: Si ya se recuperó la inversión
   - confidence: 'high' | 'medium' | 'low' basado en estabilidad de tendencia de crecimiento
   - monthsRemaining: Meses restantes desde el mes actual hasta break-even
   - projectedDate: Fecha estimada (ej: "Agosto 2026")
   - methodology: Descripción del cálculo y factores usados
   - projectedValues: Array con proyección mes a mes hasta break-even

CÁLCULO DE BREAK-EVEN:
- Break-even = primer mes donde cumulative_net_value >= 0
- La proyección usa tasa de crecimiento promedio del monthly_net_benefit de los últimos 3 meses
- Se aplica factor conservador del 75% para mayor precisión
- Confianza se basa en estabilidad de la tendencia:
  - Alta: variación < 10%, break-even < 12 meses
  - Media: variación moderada o 12-18 meses
  - Baja: alta variabilidad o > 18 meses

REGLA BREAK-EVEN: Cuando el usuario pregunte "cuándo recuperaremos la inversión" o "break-even", usa los datos de breakEven para dar una respuesta precisa con el mes proyectado, meses restantes, fecha estimada y nivel de confianza.

CALCULATION FORMULAS (use when explaining metrics):
- Gross FTE Savings = active_users × hours_saved_per_user_week × 4 weeks × avg_hourly_rate × efficiency_factor
- Net FTE Savings = Gross FTE Savings × attribution_factor
- Total Benefits = total_hard_savings + net_revenue + total_cost_avoidance
- Net AI Value = total_benefits - total_costs
- Monthly ROI = (net_ai_value / monthly_costs) × 100
- Cumulative ROI = (cumulative_net_value / total_investment) × 100

When asked about specific values, ALWAYS reference the exact data from roiCalculations, roiSettings, financialSettings, or breakEven.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error("Missing or invalid authorization header");
      return new Response(JSON.stringify({ error: 'No autorizado' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Validate JWT using Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("JWT validation failed:", claimsError);
      return new Response(JSON.stringify({ error: 'Token inválido' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user:", userId);

    const { query, contextData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Received query:", query);
    console.log("Context data:", JSON.stringify(contextData, null, 2));

    const fullSystemPrompt = `${systemPrompt}

CURRENT DASHBOARD DATA:
${JSON.stringify(contextData, null, 2)}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5.2",
        messages: [
          { role: "system", content: fullSystemPrompt },
          { role: "user", content: query },
        ],
      }),
    });

    if (response.status === 429) {
      console.error("Rate limit exceeded");
      return new Response(JSON.stringify({ 
        error: "Límite de velocidad excedido. Por favor espera un momento." 
      }), { 
        status: 429, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    if (response.status === 402) {
      console.error("Payment required");
      return new Response(JSON.stringify({ 
        error: "Límite de uso alcanzado. Por favor añade créditos." 
      }), { 
        status: 402, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data, null, 2));
    
    const content = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("chat-copilot error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

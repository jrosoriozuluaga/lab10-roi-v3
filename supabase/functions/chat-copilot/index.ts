import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are the LAB10 Chief of Staff AI Assistant. You help executives understand their AI implementation metrics and make data-driven decisions.

RULES:
1. Answer based STRICTLY on the provided JSON context data
2. Be concise and actionable - executives are busy
3. Use Spanish for responses (the dashboard is in Spanish)
4. If asked for a visualization or chart, return ONLY a JSON object with this EXACT structure (no other text):
   {"type":"chart","chartType":"bar|pie|line","title":"Chart Title","data":[{"name":"Label","value":123},...]}
5. Reference specific numbers from the context when possible
6. If you don't have data to answer, say so clearly
7. Use **bold** for key metrics and important numbers
8. Keep responses under 150 words unless more detail is specifically requested`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

import { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, Clock, Info, Lightbulb, Scale, Activity } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { KPICard } from '@/components/KPICard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { defaultROIInputs } from '@/lib/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, ReferenceLine } from 'recharts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface InputWithTipProps {
  label: string;
  tip?: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}

function InputWithTip({ label, tip, value, onChange, prefix = '$', suffix, min = 0, max, step = 1 }: InputWithTipProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="text-sm text-muted-foreground">{label}</Label>
        {tip && (
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground/60 hover:text-[#FDE047] transition-colors cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-neutral-900 text-white border-neutral-700">
              <p className="text-sm leading-relaxed whitespace-pre-line">{tip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`${prefix ? 'pl-7' : ''} ${suffix ? 'pr-12' : ''}`}
          min={min}
          max={max}
          step={step}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

interface SliderWithTipProps {
  label: string;
  tip?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  inputKey?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

function SliderWithTip({ label, tip, value, onChange, min, max, step = 0.05, inputKey, onFocus, onBlur }: SliderWithTipProps) {
  return (
    <div 
      className="space-y-3"
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">{label}</Label>
          {tip && (
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground/60 hover:text-[#FDE047] transition-colors cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-neutral-900 text-white border-neutral-700">
                <p className="text-sm leading-relaxed whitespace-pre-line">{tip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <span className="text-sm font-semibold text-primary">{value.toFixed(2)}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
}

type ScenarioType = 'pesimista' | 'realista' | 'optimista' | null;

const scenarioPresets = {
  pesimista: {
    efficiencyFactor: 0.30,
    hoursSavedPerWeek: 1,
    attributionFactor: 0.10,
    narrative: 'Escenario de baja adopción y alta fricción.'
  },
  realista: {
    efficiencyFactor: 0.55,
    hoursSavedPerWeek: 2.5,
    attributionFactor: 0.30,
    narrative: 'Proyección base según benchmarks actuales.'
  },
  optimista: {
    efficiencyFactor: 0.80,
    hoursSavedPerWeek: 5,
    attributionFactor: 0.50,
    narrative: 'Adopción total y madurez operativa.'
  }
} as const;

export default function ROICalculator() {
  const [inputs, setInputs] = useState(defaultROIInputs);
  const [activeScenario, setActiveScenario] = useState<ScenarioType>(null);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const updateInput = (key: keyof typeof inputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    // Clear scenario if user manually changes a controlled input
    if (['efficiencyFactor', 'hoursSavedPerWeek', 'attributionFactor'].includes(key)) {
      setActiveScenario(null);
    }
  };

  const handleScenarioChange = (value: string) => {
    if (!value) {
      setActiveScenario(null);
      return;
    }
    
    const scenario = value as ScenarioType;
    if (!scenario) return;
    
    setActiveScenario(scenario);
    
    const preset = scenarioPresets[scenario];
    setInputs(prev => ({
      ...prev,
      efficiencyFactor: preset.efficiencyFactor,
      hoursSavedPerWeek: preset.hoursSavedPerWeek,
      attributionFactor: preset.attributionFactor,
    }));
    
    const labels = {
      pesimista: 'Pesimista',
      realista: 'Realista', 
      optimista: 'Optimista'
    };
    
    toast.info(`🔄 Valores ajustados al escenario ${labels[scenario]}.`, {
      description: preset.narrative
    });
  };

  // Calculate Hidden Cost (Learning Curve)
  const hiddenCost = inputs.numberOfUsers * inputs.learningCurveHours * inputs.avgHourlyCost * 0.20;
  
  // Total Costs
  const totalMonthlyCosts = inputs.monthlyLicenses + (hiddenCost / 12);
  const totalOneTimeCosts = inputs.implementationCost + inputs.trainingBudget;
  const annualizedCosts = (totalMonthlyCosts * 12) + totalOneTimeCosts;

  // Hard Savings (with efficiency factor)
  const grossFTESavings = inputs.numberOfUsers * inputs.hoursSavedPerWeek * 52 * inputs.avgHourlyRate;
  const netFTESavings = grossFTESavings * inputs.efficiencyFactor;
  const totalHardSavings = netFTESavings + (inputs.licenseSavings * 12) + (inputs.outsourcingReduction * 12);

  // Hard Revenue (with attribution factor)
  const grossRevenue = inputs.monthlyRevenueUplift * 12;
  const netRevenue = grossRevenue * inputs.attributionFactor;

  // Cost Avoidance
  const totalCostAvoidance = (inputs.downtimeReduction + inputs.complianceSavings + inputs.fraudPrevention + inputs.reworkReduction) * 12;

  // Total Benefits
  const totalBenefits = totalHardSavings + netRevenue + totalCostAvoidance;

  // Net AI Value
  const netAIValue = totalBenefits - annualizedCosts;

  // ROI %
  const roi = annualizedCosts > 0 ? ((netAIValue / annualizedCosts) * 100) : 0;

  // Payback Period (months)
  const monthlyBenefit = totalBenefits / 12;
  const paybackMonths = monthlyBenefit > 0 ? Math.ceil(annualizedCosts / monthlyBenefit) : Infinity;

  // Chart data
  const benefitsData = [
    { name: 'FTE Savings', value: netFTESavings, color: 'hsl(142, 76%, 36%)' },
    { name: 'Net Revenue', value: netRevenue, color: 'hsl(213, 94%, 68%)' },
    { name: 'Cost Avoidance', value: totalCostAvoidance, color: 'hsl(263, 70%, 71%)' },
  ];

  const costsData = [
    { name: 'Licencias', value: inputs.monthlyLicenses * 12, color: 'hsl(0, 84%, 60%)' },
    { name: 'Implementación', value: inputs.implementationCost, color: 'hsl(38, 92%, 50%)' },
    { name: 'Training', value: inputs.trainingBudget, color: 'hsl(0, 62%, 50%)' },
    { name: 'Hidden Cost', value: hiddenCost, color: 'hsl(0, 72%, 51%)' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate metrics for a given scenario
  const calculateScenarioMetrics = (scenarioKey: 'pesimista' | 'realista' | 'optimista') => {
    const preset = scenarioPresets[scenarioKey];
    const tempInputs = {
      ...inputs,
      efficiencyFactor: preset.efficiencyFactor,
      hoursSavedPerWeek: preset.hoursSavedPerWeek,
      attributionFactor: preset.attributionFactor,
    };
    
    const grossFTE = tempInputs.numberOfUsers * tempInputs.hoursSavedPerWeek * 52 * tempInputs.avgHourlyRate;
    const netFTE = grossFTE * tempInputs.efficiencyFactor;
    const hardSavings = netFTE + (tempInputs.licenseSavings * 12) + (tempInputs.outsourcingReduction * 12);
    const netRev = (tempInputs.monthlyRevenueUplift * 12) * tempInputs.attributionFactor;
    const costAvoid = (tempInputs.downtimeReduction + tempInputs.complianceSavings + 
                       tempInputs.fraudPrevention + tempInputs.reworkReduction) * 12;
    const benefits = hardSavings + netRev + costAvoid;
    const costs = annualizedCosts;
    const netValue = benefits - costs;
    const roiPercent = costs > 0 ? ((netValue / costs) * 100) : 0;
    const payback = (benefits / 12) > 0 ? Math.ceil(costs / (benefits / 12)) : Infinity;
    
    return { roi: roiPercent, netValue, paybackMonths: payback };
  };

  // Sensitivity data for tornado chart
  const sensitivityData = [
    { 
      variable: 'Eficiencia (η)', 
      key: 'efficiencyFactor',
      impact: 85,
      fill: activeInput === 'efficiencyFactor' ? '#FDE047' : 'hsl(142, 76%, 36%)'
    },
    { 
      variable: 'Adopción (MAU)', 
      key: 'numberOfUsers',
      impact: 55,
      fill: activeInput === 'numberOfUsers' ? '#FDE047' : 'hsl(213, 94%, 68%)'
    },
    { 
      variable: 'Costo Licencias', 
      key: 'monthlyLicenses',
      impact: 18,
      fill: activeInput === 'monthlyLicenses' ? '#FDE047' : 'hsl(0, 84%, 60%)'
    },
  ];

  // Dynamic insight based on active input
  const getInsightText = () => {
    if (activeInput === 'efficiencyFactor') {
      return (
        <>
          <span className="font-semibold text-foreground">Ajustando:</span>{' '}
          La <span className="text-[#FDE047] font-semibold">Eficiencia</span> es tu palanca de mayor impacto. 
          Cada 10% de mejora multiplica el ROI.
        </>
      );
    }
    if (activeInput === 'numberOfUsers') {
      return (
        <>
          <span className="font-semibold text-foreground">Ajustando:</span>{' '}
          La <span className="text-[#FDE047] font-semibold">Adopción</span> escala linealmente. 
          Más usuarios = más ahorro, pero también más costos de licencias.
        </>
      );
    }
    if (activeInput === 'monthlyLicenses') {
      return (
        <>
          <span className="font-semibold text-foreground">Ajustando:</span>{' '}
          El <span className="text-[#FDE047] font-semibold">Costo de Licencias</span> tiene bajo impacto relativo. 
          No negocies descuentos, enfócate en adopción.
        </>
      );
    }
    return (
      <>
        <span className="font-semibold text-foreground">Insight:</span>{' '}
        La Eficiencia tiene <span className="text-[#FDE047] font-semibold">3x más impacto</span> en tu ROI que el costo de las licencias. 
        Enfócate en Training, no en descuentos.
      </>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Calculadora de ROI</h1>
        <p className="text-muted-foreground">
          Calcula el retorno de inversión de tus herramientas de IA
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Panel - Inputs */}
        <div className="space-y-6">
          {/* Scenario Toggle */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <Label className="text-sm text-muted-foreground mb-3 block">
              Escenario de Proyección
            </Label>
            <div className="flex items-center gap-4 flex-wrap">
              <ToggleGroup 
                type="single" 
                value={activeScenario || ''} 
                onValueChange={handleScenarioChange}
                className="justify-start gap-2"
              >
                <ToggleGroupItem 
                  value="pesimista" 
                  className={cn(
                    "px-4 py-2 rounded-lg border transition-all",
                    activeScenario === 'pesimista' 
                      ? 'bg-[#FDE047] text-black border-[#FDE047] font-semibold' 
                      : 'bg-transparent text-foreground border-border hover:border-[#FDE047]/50'
                  )}
                >
                  🌧️ Pesimista
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="realista" 
                  className={cn(
                    "px-4 py-2 rounded-lg border transition-all",
                    activeScenario === 'realista' 
                      ? 'bg-[#FDE047] text-black border-[#FDE047] font-semibold' 
                      : 'bg-transparent text-foreground border-border hover:border-[#FDE047]/50'
                  )}
                >
                  🌤️ Realista
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="optimista" 
                  className={cn(
                    "px-4 py-2 rounded-lg border transition-all",
                    activeScenario === 'optimista' 
                      ? 'bg-[#FDE047] text-black border-[#FDE047] font-semibold' 
                      : 'bg-transparent text-foreground border-border hover:border-[#FDE047]/50'
                  )}
                >
                  🚀 Optimista
                </ToggleGroupItem>
              </ToggleGroup>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setComparisonOpen(true)}
                className="border-[#FDE047]/30 hover:border-[#FDE047] hover:bg-[#FDE047]/10"
              >
                <Scale className="w-4 h-4 mr-2" />
                Comparar Escenarios
              </Button>
            </div>
          </div>

          {/* Costs Section */}
          <div className="p-6 rounded-xl bg-card border border-destructive/20">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-destructive/10">
                <DollarSign className="w-5 h-5 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Costos</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Costos Directos (OpEx)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InputWithTip
                    label="Licencias mensuales"
                    tip="Suscripciones: n8n, Cursor, Gemini, etc."
                    value={inputs.monthlyLicenses}
                    onChange={(v) => updateInput('monthlyLicenses', v)}
                  />
                  <InputWithTip
                    label="Número de usuarios"
                    prefix=""
                    tip="Cantidad de empleados que usarán las herramientas de IA activamente"
                    value={inputs.numberOfUsers}
                    onChange={(v) => updateInput('numberOfUsers', v)}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Costos de Implementación (CapEx)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InputWithTip
                    label="Setup e integración"
                    tip="Incluye horas de desarrollo, configuración y consultoría inicial. Recuerda la 'Regla del 20%': No uses AI si un script tradicional puede resolver el problema."
                    value={inputs.implementationCost}
                    onChange={(v) => updateInput('implementationCost', v)}
                  />
                  <InputWithTip
                    label="Presupuesto training"
                    tip="Inversión en capacitación formal: cursos, talleres, materiales y tiempo de instructores"
                    value={inputs.trainingBudget}
                    onChange={(v) => updateInput('trainingBudget', v)}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Costos de Adopción (Hidden Costs)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InputWithTip
                    label="Curva aprendizaje (hrs/usuario)"
                    prefix=""
                    suffix="hrs"
                    tip="Costo de Oportunidad: Tiempo que los empleados pierden de productividad mientras aprenden la herramienta. Se calcula como: (Horas × Costo Hora × 20% Ineficiencia)."
                    value={inputs.learningCurveHours}
                    onChange={(v) => updateInput('learningCurveHours', v)}
                  />
                  <InputWithTip
                    label="Costo hora promedio"
                    tip="Costo promedio por hora de trabajo de los empleados (incluye salario, beneficios y overhead)"
                    value={inputs.avgHourlyCost}
                    onChange={(v) => updateInput('avgHourlyCost', v)}
                  />
                </div>
                <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-warning" />
                    <span className="text-sm text-muted-foreground">
                      Hidden Cost calculado: <span className="font-semibold text-destructive">{formatCurrency(hiddenCost)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hard Savings Section */}
          <div className="p-6 rounded-xl bg-card border border-success/20">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Hard Savings</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <InputWithTip
                  label="Horas ahorradas/semana"
                  prefix=""
                  suffix="hrs"
                  tip="Hard Savings: Solo cuenta estas horas si se traducen en reducción de headcount, horas extra, o aumento directo de capacidad productiva (FTE Reallocation)."
                  value={inputs.hoursSavedPerWeek}
                  onChange={(v) => updateInput('hoursSavedPerWeek', v)}
                />
                <InputWithTip
                  label="Costo hora promedio"
                  tip="Tarifa horaria promedio de los empleados para calcular el valor del tiempo ahorrado"
                  value={inputs.avgHourlyRate}
                  onChange={(v) => updateInput('avgHourlyRate', v)}
                />
              </div>

              <SliderWithTip
                label="Factor de Eficiencia (η)"
                tip={"Ajuste de Realidad: No todo el tiempo ahorrado es productivo.\n\n• 0.40-0.50: Tareas complejas (Código, Análisis).\n• 0.60: Estándar (Default).\n• 0.80: Tareas repetitivas/Templates."}
                value={inputs.efficiencyFactor}
                onChange={(v) => updateInput('efficiencyFactor', v)}
                min={0.4}
                max={0.8}
                inputKey="efficiencyFactor"
                onFocus={() => setActiveInput('efficiencyFactor')}
                onBlur={() => setActiveInput(null)}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputWithTip
                  label="Ahorro licencias/mes"
                  tip="Reducción mensual en costos de software al consolidar o eliminar herramientas redundantes"
                  value={inputs.licenseSavings}
                  onChange={(v) => updateInput('licenseSavings', v)}
                />
                <InputWithTip
                  label="Reducción outsourcing/mes"
                  tip="Ahorro mensual al internalizar tareas que antes se externalizaban a terceros"
                  value={inputs.outsourcingReduction}
                  onChange={(v) => updateInput('outsourcingReduction', v)}
                />
              </div>
            </div>
          </div>

          {/* Hard Revenue Section */}
          <div className="p-6 rounded-xl bg-card border border-soft-blue/20">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-soft-blue/10">
                <DollarSign className="w-5 h-5 text-soft-blue" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Hard Revenue</h2>
            </div>

            <div className="space-y-6">
              <InputWithTip
                label="Aumento revenue mensual"
                tip="Ingresos adicionales estimados por mes gracias a IA"
                value={inputs.monthlyRevenueUplift}
                onChange={(v) => updateInput('monthlyRevenueUplift', v)}
              />

              <SliderWithTip
                label="Factor de Atribución (α)"
                tip="¿Cuánto del nuevo ingreso es gracias a la AI? Se recomienda usar A/B testing para definir este factor. (Ej: 30% del valor de un contrato cerrado con ayuda de Copilot)."
                value={inputs.attributionFactor}
                onChange={(v) => updateInput('attributionFactor', v)}
                min={0}
                max={1}
                inputKey="attributionFactor"
                onFocus={() => setActiveInput('attributionFactor')}
                onBlur={() => setActiveInput(null)}
              />
            </div>
          </div>

          {/* Cost Avoidance Section */}
          <div className="p-6 rounded-xl bg-card border border-lilac/20">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-lilac/10">
                <Clock className="w-5 h-5 text-lilac" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Cost Avoidance</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputWithTip
                label="Reducción downtime/mes"
                tip="Ahorros por mitigación de riesgos: Reducción de downtime, multas de compliance evitadas o prevención de fraude."
                value={inputs.downtimeReduction}
                onChange={(v) => updateInput('downtimeReduction', v)}
              />
              <InputWithTip
                label="Ahorro compliance/mes"
                tip="Ahorros por mitigación de riesgos: Reducción de downtime, multas de compliance evitadas o prevención de fraude."
                value={inputs.complianceSavings}
                onChange={(v) => updateInput('complianceSavings', v)}
              />
              <InputWithTip
                label="Fraude prevenido/mes"
                tip="Ahorros por mitigación de riesgos: Reducción de downtime, multas de compliance evitadas o prevención de fraude."
                value={inputs.fraudPrevention}
                onChange={(v) => updateInput('fraudPrevention', v)}
              />
              <InputWithTip
                label="Reducción retrabajo/mes"
                tip="Ahorros por mitigación de riesgos: Reducción de downtime, multas de compliance evitadas o prevención de fraude."
                value={inputs.reworkReduction}
                onChange={(v) => updateInput('reworkReduction', v)}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="space-y-6">
          {/* Hero KPIs */}
          <div className="grid grid-cols-2 gap-4">
            <KPICard
              title="ROI"
              value={`${roi.toFixed(1)}%`}
              icon={Calculator}
              variant={roi >= 0 ? 'success' : 'danger'}
              trend={roi >= 0 ? 'up' : 'down'}
              className="col-span-1"
            />
            <KPICard
              title="Payback Period"
              value={paybackMonths === Infinity ? '∞' : `${paybackMonths} meses`}
              icon={Clock}
              variant={paybackMonths <= 12 ? 'success' : paybackMonths <= 18 ? 'warning' : 'danger'}
              className="col-span-1"
            />
          </div>

          <KPICard
            title="Net AI Value (Anual)"
            value={formatCurrency(netAIValue)}
            subtitle={netAIValue >= 0 ? 'Creando valor' : 'Destruyendo valor'}
            variant={netAIValue >= 0 ? 'success' : 'danger'}
            trend={netAIValue >= 0 ? 'up' : 'down'}
          />

          {/* Benefits Breakdown Chart */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Desglose de Beneficios</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={benefitsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {benefitsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <span className="text-2xl font-bold text-foreground">{formatCurrency(totalBenefits)}</span>
              <span className="text-sm text-muted-foreground ml-2">Total anual</span>
            </div>
          </div>

          {/* Costs Breakdown */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Desglose de Costos</h3>
            <div className="space-y-3">
              {costsData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{formatCurrency(item.value)}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Total Anualizado</span>
                <span className="text-lg font-bold text-destructive">{formatCurrency(annualizedCosts)}</span>
              </div>
            </div>
          </div>

          {/* Sensitivity Analysis - Tornado Chart */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Análisis de Sensibilidad</h3>
            </div>
            
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={sensitivityData} 
                  layout="vertical"
                  margin={{ left: 10, right: 20, top: 5, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="variable" width={110} tick={{ fontSize: 12 }} />
                  <ReferenceLine x={0} stroke="hsl(var(--border))" />
                  <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                    {sensitivityData.map((entry, index) => (
                      <Cell 
                        key={index} 
                        fill={entry.fill}
                        className="transition-all duration-200"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Dynamic Insight */}
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-[#FDE047] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  {getInsightText()}
                </p>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setInputs(defaultROIInputs);
              setActiveScenario(null);
            }}
          >
            Restablecer valores por defecto
          </Button>
        </div>
      </div>

      {/* Scenario Comparison Sheet */}
      <Sheet open={comparisonOpen} onOpenChange={setComparisonOpen}>
        <SheetContent side="bottom" className="h-[420px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Comparativa de Escenarios
            </SheetTitle>
          </SheetHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {(['pesimista', 'realista', 'optimista'] as const).map((scenario) => {
              const metrics = calculateScenarioMetrics(scenario);
              const isRealistic = scenario === 'realista';
              const scenarioLabels = {
                pesimista: { emoji: '🌧️', label: 'Pesimista', subtitle: 'Conservador' },
                realista: { emoji: '🌤️', label: 'Realista', subtitle: 'Base Case' },
                optimista: { emoji: '🚀', label: 'Optimista', subtitle: 'Best Case' },
              };
              const info = scenarioLabels[scenario];
              
              return (
                <div 
                  key={scenario}
                  className={cn(
                    "p-6 rounded-xl bg-card border-2 transition-all",
                    isRealistic 
                      ? "border-[#FDE047] shadow-lg shadow-[#FDE047]/20" 
                      : "border-border"
                  )}
                >
                  <div className="text-center mb-4">
                    <span className="text-3xl">{info.emoji}</span>
                    <h4 className="font-semibold text-lg mt-2">{info.label}</h4>
                    {isRealistic ? (
                      <span className="text-xs text-[#FDE047] font-medium">⭐ Escenario más probable</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">{info.subtitle}</span>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center p-3 rounded-lg bg-background">
                      <div className={cn(
                        "text-3xl font-bold",
                        metrics.roi < 0 ? "text-destructive" : 
                        metrics.roi > 200 ? "text-[#FDE047]" : "text-success"
                      )}>
                        {metrics.roi >= 0 ? '+' : ''}{metrics.roi.toFixed(0)}%
                      </div>
                      <span className="text-xs text-muted-foreground">ROI</span>
                    </div>
                    
                    <div className="text-center p-3 rounded-lg bg-background">
                      <div className={cn(
                        "text-xl font-semibold",
                        metrics.netValue < 0 ? "text-destructive" : "text-success"
                      )}>
                        {formatCurrency(metrics.netValue)}
                      </div>
                      <span className="text-xs text-muted-foreground">Net Value</span>
                    </div>
                    
                    <div className="text-center p-3 rounded-lg bg-background">
                      <div className="text-lg font-medium text-foreground">
                        {metrics.paybackMonths === Infinity ? 'Never' : `${metrics.paybackMonths} meses`}
                      </div>
                      <span className="text-xs text-muted-foreground">Payback</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}

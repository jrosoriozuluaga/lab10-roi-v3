import { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, Clock, Info, Lightbulb } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { KPICard } from '@/components/KPICard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { defaultROIInputs } from '@/lib/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';

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
              <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">{tip}</p>
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
}

function SliderWithTip({ label, tip, value, onChange, min, max, step = 0.05 }: SliderWithTipProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">{label}</Label>
          {tip && (
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">{tip}</p>
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

export default function ROICalculator() {
  const [inputs, setInputs] = useState(defaultROIInputs);

  const updateInput = (key: keyof typeof inputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
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
                    tip="Costos únicos de configuración, integración con sistemas existentes y consultoría inicial"
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
                    tip="Tiempo perdido mientras aprenden. Fórmula: Usuarios × Horas × Costo/Hora × 0.20"
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
                  tip="Horas semanales que cada usuario ahorra gracias a la automatización con IA"
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
                tip="0.40-0.50 para tareas complejas, 0.60 default, 0.70-0.80 para tareas repetitivas"
                value={inputs.efficiencyFactor}
                onChange={(v) => updateInput('efficiencyFactor', v)}
                min={0.4}
                max={0.8}
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
                tip="% del revenue puramente atribuible a IA. Usar A/B testing para validar. Default: 0.30"
                value={inputs.attributionFactor}
                onChange={(v) => updateInput('attributionFactor', v)}
                min={0}
                max={1}
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
                tip="Ahorro estimado por menor tiempo de inactividad gracias a mantenimiento predictivo y automatización"
                value={inputs.downtimeReduction}
                onChange={(v) => updateInput('downtimeReduction', v)}
              />
              <InputWithTip
                label="Ahorro compliance/mes"
                tip="Reducción en multas, auditorías y costos de cumplimiento normativo gracias a mejor control y documentación"
                value={inputs.complianceSavings}
                onChange={(v) => updateInput('complianceSavings', v)}
              />
              <InputWithTip
                label="Fraude prevenido/mes"
                tip="Pérdidas evitadas gracias a detección temprana de fraude mediante análisis de IA"
                value={inputs.fraudPrevention}
                onChange={(v) => updateInput('fraudPrevention', v)}
              />
              <InputWithTip
                label="Reducción retrabajo/mes"
                tip="Ahorro por menor cantidad de correcciones y repetición de tareas gracias a mejor calidad inicial"
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

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setInputs(defaultROIInputs)}
          >
            Restablecer valores por defecto
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

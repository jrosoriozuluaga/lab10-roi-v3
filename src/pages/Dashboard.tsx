import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { KPICard } from '@/components/KPICard';
import { DollarSign, Users, TrendingUp, Cpu, Download, Info } from 'lucide-react';
import { useSummaryMetrics } from '@/hooks/useMetrics';
import { useUnifiedROIMetrics } from '@/hooks/useROIData';
import { transformCalculationsForCharts, formatCurrency as formatCurrencyUtil } from '@/lib/roiCalculations';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// LAB10 Chart Colors (direct hex for Recharts compatibility)
const chartColors = {
  primary: '#FDE047',
  grid: '#333333',
  axis: '#9ca3af',
  tooltipBg: '#171717',
  tooltipBorder: '#333333'
};
export default function Dashboard() {
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const {
    data: summary,
    isLoading: loadingSummary
  } = useSummaryMetrics();
  const {
    data: roiData,
    isLoading: loadingROI,
    calculations
  } = useUnifiedROIMetrics();
  const chartData = calculations ? transformCalculationsForCharts(calculations) : [];
  const isLoading = loadingSummary || loadingROI;
  const handleExport = () => {
    toast.info('Generando Reporte Ejecutivo Q1 (PDF)...', {
      description: 'El reporte estará listo en unos segundos.',
      duration: 3000
    });
  };

  // Format currency helper using unified utility
  const formatCurrency = (value: number) => formatCurrencyUtil(value, true);
  return <DashboardLayout>
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">General AI Overview</h1>
          <p className="text-muted-foreground">
            Mes {roiData?.currentMonth || 3} de implementación • {summary?.totalEmployees || 512} empleados • η={roiData?.efficiencyFactor?.toFixed(2) || '0.55'} α={roiData?.attributionFactor?.toFixed(2) || '0.30'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Download className="w-4 h-4 mr-2" />
            Descargar Reporte
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMethodologyOpen(true)} className="text-muted-foreground hover:text-foreground">
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* General KPIs - Always visible */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {isLoading ? <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </> : <>
            <KPICard title="Net AI Value (Acumulado)" value={formatCurrency(roiData?.cumulativeNetValue ?? 0)} subtitle={`${roiData?.monthLabel || 'M3'} - ROI acumulado: ${roiData?.cumulativeROI?.toFixed(0) ?? 0}%`} icon={DollarSign} variant={(roiData?.cumulativeNetValue ?? 0) >= 0 ? 'success' : 'warning'} trend={(roiData?.netAIValue ?? 0) >= 0 ? 'up' : 'down'} trendValue={`${(roiData?.netAIValue ?? 0) >= 0 ? '+' : ''}${((roiData?.netAIValue ?? 0) / 1000).toFixed(1)}k este mes`} />
            <KPICard title="Activation Rate" value={`${summary?.activationRate || 57}%`} subtitle={`${summary?.activeUsers || 292} de ${summary?.totalEmployees || 512} usuarios`} icon={Users} variant="success" trend="up" trendValue="+8%" />
            <KPICard title="Net AI Value (Mensual)" value={formatCurrency(roiData?.netAIValue ?? 0)} subtitle={`ROI mensual: ${roiData?.currentMonthROI?.toFixed(0) ?? 0}%`} icon={Cpu} variant={(roiData?.netAIValue ?? 0) >= 0 ? 'success' : 'warning'} trend={(roiData?.netAIValue ?? 0) >= 0 ? 'up' : 'down'} trendValue={`η=${roiData?.efficiencyFactor?.toFixed(2) ?? '0.55'}`} />
            <KPICard title="Break-even Proyectado" value={roiData?.breakEvenMonth ? `Mes ${roiData.breakEvenMonth}` : 'Pendiente'} subtitle={`Inversión: $250K • Recuperado: ${formatCurrency(250000 + (roiData?.cumulativeNetValue ?? -250000))}`} icon={TrendingUp} variant={roiData?.breakEvenMonth && roiData.breakEvenMonth <= 12 ? 'success' : 'default'} trend="up" />
          </>}
      </div>

      {/* ROI Acumulativo Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-1">ROI Acumulativo</h3>
        <p className="text-sm text-muted-foreground mb-4">Calculado vs costo amortizado acumulado</p>
        {isLoading ? (
          <Skeleton className="h-64 rounded-xl" />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorROI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                <XAxis dataKey="month" stroke={chartColors.axis} tick={{ fill: chartColors.axis, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke={chartColors.axis} tick={{ fill: chartColors.axis, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: chartColors.tooltipBg, 
                    border: `1px solid ${chartColors.tooltipBorder}`,
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'ROI Acumulativo']}
                />
                <ReferenceLine y={0} stroke={chartColors.axis} strokeDasharray="3 3" />
                <Area 
                  type="monotone" 
                  dataKey="roi"
                  stroke={chartColors.primary} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorROI)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>


      {/* Methodology Dialog */}
      <Dialog open={methodologyOpen} onOpenChange={setMethodologyOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl text-foreground">Metodología de Cálculo</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Este sistema utiliza un modelo de ROI ajustado por riesgo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Fórmula de Valor Neto */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Fórmula de Valor Neto</h3>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <code className="block text-sm font-mono text-primary leading-relaxed">
                  (Ahorros FTE × η) + (Revenue × α) − Costos Totales
                </code>
              </div>
            </div>

            {/* Factor de Eficiencia */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Factor de Eficiencia (η)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Ajuste conservador que descuenta tiempos muertos y revisiones humanas. 
                Default: 60% para Mes 3.
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="px-2 py-1 rounded bg-muted">Mes 1–3: <span className="text-foreground font-medium">0.5–0.6</span></span>
                <span className="px-2 py-1 rounded bg-muted">Mes 4–6: <span className="text-foreground font-medium">0.7–0.8</span></span>
                <span className="px-2 py-1 rounded bg-muted">Mes 7+: <span className="text-foreground font-medium">0.85–0.9</span></span>
              </div>
            </div>

            {/* Costos Ocultos */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Costos Ocultos</h3>
              <p className="text-sm text-muted-foreground">
                Incluye curva de aprendizaje (20% pérdida productividad en M1), tiempo de revisión 
                de outputs AI, y overhead de integración con flujos existentes.
              </p>
            </div>

            {/* Why Section */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-foreground">
                <span className="font-semibold">¿Por qué este modelo?</span>{' '}
                <span className="text-muted-foreground">
                  Reduce el riesgo de sobreestimar el impacto de AI en fases tempranas, 
                  proporcionando métricas conservadoras y confiables para la toma de decisiones.
                </span>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>;
}
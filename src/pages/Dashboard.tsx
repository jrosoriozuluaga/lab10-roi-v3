import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { KPICard } from '@/components/KPICard';
import { SmartAlert } from '@/components/SmartAlert';
import { useRole } from '@/contexts/RoleContext';
import { DollarSign, Users, TrendingUp, Clock, Target, Cpu, Brain, Zap, Download, Info, X } from 'lucide-react';
import { departmentStats, monthlyMetrics, m3Benchmarks } from '@/lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

const totalEmployees = 500;
const activeUsers = departmentStats.reduce((sum, d) => sum + d.activeUsers, 0);
const activationRate = (activeUsers / totalEmployees) * 100;
const powerUsers = departmentStats.reduce((sum, d) => sum + d.powerUsers, 0);

export default function Dashboard() {
  const { role } = useRole();
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  const handleExport = () => {
    toast.info('Generando Reporte Ejecutivo Q1 (PDF)...', {
      description: 'El reporte estará listo en unos segundos.',
      duration: 3000,
    });
  };

  const renderCEOView = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard title="Net AI Value" value="−$12,500" subtitle="Mes 3 - Tendencia al alza" icon={DollarSign} variant="warning" trend="up" trendValue="+15% vs M2" />
        <KPICard title="Strategic Alignment" value="48%" subtitle={`Meta M3: ≥${m3Benchmarks.activationRate.target}%`} icon={Target} variant="success" trend="up" trendValue="+8%" />
        <KPICard title="ROI Proyectado M12" value="+45%" subtitle="Break-even estimado: M7" icon={TrendingUp} variant="success" trend="up" />
      </div>
      <SmartAlert type="info" message="El Net AI Value es negativo pero la tendencia es positiva. Esto es esperado en Mes 3 de implementación." className="mb-6" />
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Tendencia de ROI</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="roi" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

  const renderCFOView = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard title="Payback Period" value="9 meses" subtitle="Meta: <12 meses" icon={Clock} variant="success" trend="down" trendValue="-2 meses" />
        <KPICard title="Costo por Token" value="$0.0021" subtitle="Optimizado" icon={DollarSign} variant="success" />
        <KPICard title="Budget Utilization" value="67%" subtitle="$167,500 de $250,000" icon={TrendingUp} variant="default" />
      </div>
      <SmartAlert type="warning" message="⚠️ Alto costo de oportunidad detectado en equipo Operations ($18,500)" className="mb-6" />
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Costos vs Beneficios por Mes</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="netAIValue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

  const renderCTOView = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard title="Delivery Rate" value="52%" subtitle={`Meta M3: ≥${m3Benchmarks.deliveryRate.target}%`} icon={Cpu} variant="success" trend="up" trendValue="+12%" />
        <KPICard title="Error Rate" value="2.1%" subtitle="Objetivo: <3%" icon={Zap} variant="success" />
        <KPICard title="Workflows Producción" value="24" subtitle="n8n activos" icon={Target} variant="default" trend="up" trendValue="+6" />
      </div>
      <SmartAlert type="success" message="Todos los sistemas operando dentro de parámetros normales. Latencia promedio: 145ms" className="mb-6" />
    </>
  );

  const renderAILeadView = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard title="Activation Rate" value={`${activationRate.toFixed(1)}%`} subtitle={`Meta M3: ≥${m3Benchmarks.activationRate.target}%`} icon={Users} variant={activationRate >= m3Benchmarks.activationRate.min ? 'success' : 'warning'} trend="up" trendValue="+8%" />
        <KPICard title="AI MAU" value={`${((activeUsers / totalEmployees) * 100).toFixed(0)}%`} subtitle={`${activeUsers} de ${totalEmployees} usuarios`} icon={Brain} variant="success" />
        <KPICard title="Power Users" value={`${((powerUsers / totalEmployees) * 100).toFixed(1)}%`} subtitle={`${powerUsers} usuarios avanzados`} icon={Zap} variant={powerUsers / totalEmployees >= 0.04 ? 'success' : 'warning'} />
      </div>
      <SmartAlert type="warning" message="⚠️ Equipos Legal y HR por debajo del umbral de activación. Considerar training adicional." className="mb-6" />
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Adopción por Departamento</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="activationRate" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

  const roleViews = { CEO: renderCEOView, CFO: renderCFOView, CTO: renderCTOView, 'AI Lead': renderAILeadView };
  const renderView = role ? roleViews[role] : renderCEOView;

  return (
    <DashboardLayout>
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard {role}</h1>
          <p className="text-muted-foreground">Mes 3 de implementación • 500 empleados • $250k inversión anual</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Reporte
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMethodologyOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {renderView()}

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
            {/* Formula */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm font-medium text-muted-foreground mb-2">Fórmula</p>
              <code className="block text-sm font-mono text-primary leading-relaxed">
                ROI = [(Hard Savings + Soft Savings + Revenue Impact × α) × η − Total Costs] / Total Costs
              </code>
            </div>

            {/* Definitions */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  Efficiency Factor (η)
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Factor de ajuste (0.7–0.9) que refleja la madurez de implementación:
                </p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="px-2 py-1 rounded bg-muted">Mes 1–3: <span className="text-foreground font-medium">0.7</span></span>
                  <span className="px-2 py-1 rounded bg-muted">Mes 4–6: <span className="text-foreground font-medium">0.8</span></span>
                  <span className="px-2 py-1 rounded bg-muted">Mes 7+: <span className="text-foreground font-medium">0.9</span></span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  Revenue Attribution (α)
                </h4>
                <p className="text-sm text-muted-foreground">
                  Porcentaje del incremento de ingresos atribuible directamente a iniciativas de AI. 
                  Calculado mediante análisis de correlación con métricas de adopción.
                </p>
              </div>
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
    </DashboardLayout>
  );
}

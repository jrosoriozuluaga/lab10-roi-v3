import { DashboardLayout } from '@/components/DashboardLayout';
import { KPICard } from '@/components/KPICard';
import { SmartAlert } from '@/components/SmartAlert';
import { useRole } from '@/contexts/RoleContext';
import { DollarSign, Users, TrendingUp, Clock, Target, Cpu, Brain, Zap } from 'lucide-react';
import { departmentStats, monthlyMetrics, m3Benchmarks } from '@/lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const totalEmployees = 500;
const activeUsers = departmentStats.reduce((sum, d) => sum + d.activeUsers, 0);
const activationRate = (activeUsers / totalEmployees) * 100;
const powerUsers = departmentStats.reduce((sum, d) => sum + d.powerUsers, 0);

export default function Dashboard() {
  const { role } = useRole();

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard {role}</h1>
        <p className="text-muted-foreground">Mes 3 de implementación • 500 empleados • $250k inversión anual</p>
      </div>
      {renderView()}
    </DashboardLayout>
  );
}

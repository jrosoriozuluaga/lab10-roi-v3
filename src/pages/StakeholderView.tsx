import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { KPICard } from '@/components/KPICard';
import { SmartAlert } from '@/components/SmartAlert';
import { useRole, Role } from '@/contexts/RoleContext';
import { DollarSign, Users, TrendingUp, Clock, Target, Cpu, Brain, Zap, ChevronDown } from 'lucide-react';
import { departmentStats, monthlyMetrics, m3Benchmarks } from '@/lib/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine, PieChart, Pie, Cell, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// LAB10 Chart Colors (direct hex for Recharts compatibility)
const chartColors = {
  primary: '#FDE047',
  secondary: '#A78BFA',
  softBlue: '#60A5FA',
  grid: '#333333',
  axis: '#9ca3af',
  tooltipBg: '#171717',
  tooltipBorder: '#333333',
};

const totalEmployees = 500;
const activeUsers = departmentStats.reduce((sum, d) => sum + d.activeUsers, 0);
const powerUsers = departmentStats.reduce((sum, d) => sum + d.powerUsers, 0);

const roles: Role[] = ['CEO', 'CFO', 'CTO', 'AI Lead'];

export default function StakeholderView() {
  const { role, setRole } = useRole();
  const [selectedRole, setSelectedRole] = useState<Role>(role || 'CEO');

  const handleRoleChange = (newRole: Role) => {
    setSelectedRole(newRole);
    setRole(newRole);
  };

  // Focus Area Distribution data for CEO Donut Chart
  const focusAreaData = [
    { name: 'Eficiencia', value: 50 },
    { name: 'Revenue Growth', value: 30 },
    { name: 'Risk Mitigation', value: 20 },
  ];
  const focusAreaColors = ['#FDE047', '#A78BFA', '#60A5FA'];

  const renderCEOView = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard title="Net AI Value" value="−$12,500" subtitle="Mes 3 - Tendencia al alza" icon={DollarSign} variant="warning" trend="up" trendValue="+15% vs M2" />
        <KPICard title="Strategic Alignment" value="48%" subtitle={`Meta M3: ≥${m3Benchmarks.activationRate.target}%`} icon={Target} variant="success" trend="up" trendValue="+8%" />
        <KPICard title="ROI Proyectado M12" value="+45%" subtitle="Break-even estimado: M7" icon={TrendingUp} variant="success" trend="up" />
      </div>

      {/* Strategic Distribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* North Star Alignment Card */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4">North Star Alignment</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Proyectos alineados</span>
              <span className="text-2xl font-bold text-primary">6/8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Score de alineación</span>
              <span className="text-xl font-semibold text-success">75%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Los proyectos están mayormente alineados con los objetivos estratégicos de la organización.
            </p>
          </div>
        </div>

        {/* Focus Area Distribution Donut Chart */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4">Distribución por Foco Estratégico</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={focusAreaData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {focusAreaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={focusAreaColors[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: chartColors.tooltipBg, 
                    borderColor: chartColors.tooltipBorder, 
                    color: '#fff',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value}%`, '']}
                />
                <Legend 
                  verticalAlign="middle" 
                  align="right" 
                  layout="vertical"
                  formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <SmartAlert type="info" message="El Net AI Value es negativo pero la tendencia es positiva. Esto es esperado en Mes 3 de implementación." className="mb-6" />
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Tendencia de ROI (Curva J)</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyMetrics}>
              <defs>
                <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                dataKey="month" 
                stroke={chartColors.axis} 
                tick={{ fill: chartColors.axis, fontSize: 12 }}
                interval={1}
              />
              <YAxis 
                stroke={chartColors.axis} 
                tick={{ fill: chartColors.axis }}
                tickFormatter={(value) => `${value}%`}
                domain={['auto', 'auto']}
              />
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" label={{ value: 'Break-even', fill: '#666', fontSize: 11, position: 'right' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: chartColors.tooltipBg, 
                  borderColor: chartColors.tooltipBorder, 
                  color: '#fff',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: chartColors.axis }}
                formatter={(value: number) => [`${Math.round(value)}%`, 'ROI']}
              />
              <Area 
                type="monotone" 
                dataKey="roi" 
                stroke={chartColors.primary} 
                strokeWidth={2}
                fill="url(#roiGradient)"
                dot={{ fill: chartColors.primary, strokeWidth: 2, r: 3 }}
              />
            </AreaChart>
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
        <h3 className="text-lg font-semibold mb-4">Net AI Value por Mes (Curva J)</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                dataKey="month" 
                stroke={chartColors.axis} 
                tick={{ fill: chartColors.axis, fontSize: 12 }}
                interval={1}
              />
              <YAxis 
                stroke={chartColors.axis} 
                tick={{ fill: chartColors.axis }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: chartColors.tooltipBg, 
                  borderColor: chartColors.tooltipBorder, 
                  color: '#fff',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: chartColors.axis }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Net AI Value']}
              />
              <Bar dataKey="netAIValue" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
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

  // Fixed Activation Rate for AI Lead (42% > 35% target = success)
  const fixedActivationRate = 42;
  const activationTarget = 35;

  const renderAILeadView = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard title="AI MAU" value={`${((activeUsers / totalEmployees) * 100).toFixed(0)}%`} subtitle={`${activeUsers} de ${totalEmployees} usuarios`} icon={Brain} variant="success" />
        <KPICard 
          title="Activation Rate" 
          value={<span className="text-success">{fixedActivationRate}%</span>}
          subtitle="Training completado / Total empleados"
          icon={Users} 
          variant="success" 
          trend="up" 
          trendValue="+8%"
        >
          <Badge className="mt-2 bg-success/20 text-success border-success/30 text-xs">
            Target M3: {activationTarget}% - Superado ✓
          </Badge>
        </KPICard>
        <KPICard title="Power Users" value={`${((powerUsers / totalEmployees) * 100).toFixed(1)}%`} subtitle={`${powerUsers} usuarios avanzados`} icon={Zap} variant={powerUsers / totalEmployees >= 0.04 ? 'success' : 'warning'} />
      </div>
      <SmartAlert type="warning" message="⚠️ Equipos Legal y HR por debajo del umbral de activación. Considerar training adicional." className="mb-6" />
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Adopción por Departamento</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis type="number" domain={[0, 100]} stroke={chartColors.axis} tick={{ fill: chartColors.axis }} />
              <YAxis dataKey="name" type="category" stroke={chartColors.axis} tick={{ fill: chartColors.axis }} width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: chartColors.tooltipBg, 
                  borderColor: chartColors.tooltipBorder, 
                  color: '#fff',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: chartColors.axis }}
              />
              <Bar dataKey="activationRate" fill={chartColors.primary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

  const roleViews = { CEO: renderCEOView, CFO: renderCFOView, CTO: renderCTOView, 'AI Lead': renderAILeadView };
  const renderView = selectedRole ? roleViews[selectedRole] : renderCEOView;

  return (
    <DashboardLayout>
      {/* Header with Role Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vista por Stakeholder</h1>
          <p className="text-muted-foreground">Métricas específicas según el rol seleccionado</p>
        </div>
        
        {/* Role Dropdown in top right */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[180px] justify-between border-primary/50 hover:border-primary"
            >
              <span>
                <span className="text-muted-foreground">Viendo como: </span>
                <span className="font-semibold text-foreground">{selectedRole}</span>
              </span>
              <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            {roles.map((r) => (
              <DropdownMenuItem
                key={r}
                onClick={() => handleRoleChange(r)}
                className={selectedRole === r ? 'bg-primary/10 text-primary' : ''}
              >
                {r}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {renderView()}
    </DashboardLayout>
  );
}

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { KPICard } from '@/components/KPICard';
import { SmartAlert } from '@/components/SmartAlert';
import { useRole, Role } from '@/contexts/RoleContext';
import { DollarSign, Users, TrendingUp, Clock, Target, Cpu, Brain, Zap, ChevronDown, Cloud, Server, TrendingDown, Minus, ShieldCheck, Wallet, PiggyBank } from 'lucide-react';
import { 
  useSummaryMetrics, 
  useMonthlyMetrics, 
  useFinancialSettings, 
  useDepartmentStats, 
  useProjects,
  transformMetricsForCharts 
} from '@/hooks/useMetrics';
import { 
  m3Benchmarks, 
  apiConsumption, 
  cloudInfrastructure, 
  infrastructureTrend,
  aiToolsDistribution,
  totalAPICost,
  totalInfraCost,
  budgetUtilization,
} from '@/lib/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine, PieChart, Pie, Cell, Legend } from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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

const roles: Role[] = ['CEO', 'CFO', 'CTO', 'AI Lead'];

// Helper to format currency
const formatCurrency = (value: number): string => {
  const absValue = Math.abs(value);
  if (absValue >= 1000) {
    return `${value >= 0 ? '' : '−'}$${(absValue / 1000).toFixed(1)}k`;
  }
  return `${value >= 0 ? '' : '−'}$${absValue.toLocaleString()}`;
};

export default function StakeholderView() {
  const { role, setRole } = useRole();
  const [selectedRole, setSelectedRole] = useState<Role>(role || 'CEO');

  // Fetch data from database
  const { data: summary, isLoading: loadingSummary } = useSummaryMetrics();
  const { data: metrics, isLoading: loadingMetrics } = useMonthlyMetrics();
  const { data: settings, isLoading: loadingSettings } = useFinancialSettings();
  const { data: departmentStats, isLoading: loadingDepts } = useDepartmentStats();
  const { data: projects, isLoading: loadingProjects } = useProjects();

  const chartData = metrics ? transformMetricsForCharts(metrics) : [];
  const isLoading = loadingSummary || loadingMetrics || loadingSettings;

  // Calculate derived values from real data
  const totalEmployees = summary?.totalEmployees || 512;
  const activeUsers = summary?.activeUsers || 292;
  const activationRate = summary?.activationRate || 57;
  const deliveryRate = summary?.deliveryRate || 74;
  const powerUsers = departmentStats?.reduce((sum, d) => sum + d.powerUsers, 0) || 40;

  // Financial calculations from metrics
  const latestMetrics = metrics?.[metrics.length - 1];
  const totalCashOutflow = metrics?.reduce((sum, m) => sum + m.cash_outflow, 0) || 250000;
  const totalValueRealized = latestMetrics?.cumulative_value || 0;
  const totalAmortizedCost = metrics?.reduce((sum, m) => sum + m.amortized_cost, 0) || 0;
  const netAIValue = totalValueRealized - totalAmortizedCost;
  
  // Cumulative ROI = (cumulative_value - cumulative_amortized) / cumulative_amortized * 100
  const cumulativeROI = totalAmortizedCost > 0 
    ? ((totalValueRealized - totalAmortizedCost) / totalAmortizedCost * 100)
    : 0;

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
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <KPICard 
              title="Net AI Value" 
              value={formatCurrency(netAIValue)} 
              subtitle={`Mes ${metrics?.length || 3} - Tendencia al alza`}
              icon={DollarSign} 
              variant={netAIValue >= 0 ? 'success' : 'warning'} 
              trend="up" 
              trendValue="+15% vs M2" 
            />
            <KPICard 
              title="Strategic Alignment" 
              value={`${activationRate}%`} 
              subtitle={`Meta M3: ≥${m3Benchmarks.activationRate.target}%`} 
              icon={Target} 
              variant="success" 
              trend="up" 
              trendValue="+8%" 
            />
            <KPICard 
              title="ROI Acumulativo" 
              value={`${cumulativeROI >= 0 ? '+' : ''}${cumulativeROI.toFixed(1)}%`} 
              subtitle="Break-even estimado: M7" 
              icon={TrendingUp} 
              variant={cumulativeROI >= 0 ? 'success' : 'warning'} 
              trend="up" 
            />
          </>
        )}
      </div>

      {/* Strategic Distribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* North Star Alignment Card */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4">North Star Alignment</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Proyectos alineados</span>
              <span className="text-2xl font-bold text-primary">
                {projects?.filter(p => p.status === 'on-track').length || 0}/{projects?.length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Score de alineación</span>
              <span className="text-xl font-semibold text-success">{deliveryRate}%</span>
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

      <SmartAlert 
        type={netAIValue >= 0 ? 'success' : 'info'} 
        message={netAIValue >= 0 
          ? `El Net AI Value es positivo. La implementación está generando valor.`
          : `El Net AI Value es negativo (${formatCurrency(netAIValue)}) pero la tendencia es positiva. Esto es esperado en Mes ${metrics?.length || 3} de implementación.`
        } 
        className="mb-6" 
      />
      
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Tendencia de ROI Acumulativo (Curva J)</h3>
        <div className="h-[350px] w-full">
          {loadingMetrics ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
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
                  interval={0}
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
                  formatter={(value: number) => [`${Math.round(value)}%`, 'ROI Acumulativo']}
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
          )}
        </div>
      </div>
    </>
  );

  // CFO View - Full Cash Flow vs Amortized dual-view
  const renderCFOView = () => {
    const investment = settings?.total_investment || 250000;
    const monthlyAmortized = settings?.monthly_amortized || (investment / 12);
    
    // Calculate cumulative ROI for chart (showing the J-curve progression)
    const cfoChartData = metrics?.map((m, index) => {
      const cumulativeAmortized = (index + 1) * (m.amortized_cost || monthlyAmortized);
      const cumulativeROI = cumulativeAmortized > 0 
        ? ((m.cumulative_value || 0) - cumulativeAmortized) / cumulativeAmortized * 100
        : 0;
      return {
        month: m.month_label,
        roi: Math.round(cumulativeROI * 10) / 10,
        cashOutflow: m.cash_outflow,
        valueRealized: m.value_realized,
        amortizedCost: m.amortized_cost,
        cumulativePaybackPct: m.cumulative_payback_pct || 0,
        monthlyRoi: m.monthly_roi,
      };
    }) || [];

    return (
      <>
        {/* Financial KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            <>
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </>
          ) : (
            <>
              <KPICard 
                title="Inversión Total" 
                value={formatCurrency(investment)}
                subtitle="100% Comprometido (M1)" 
                icon={Wallet} 
                variant="default" 
              />
              <KPICard 
                title="Recuperado" 
                value={formatCurrency(totalValueRealized)}
                subtitle={`${latestMetrics?.cumulative_payback_pct || 0}% del total`}
                icon={PiggyBank} 
                variant="warning" 
                trend="up" 
                trendValue={`+${formatCurrency(latestMetrics?.value_realized || 0)} M${metrics?.length || 3}`}
              />
              <KPICard 
                title="ROI Acumulativo" 
                value={`${cumulativeROI >= 0 ? '+' : ''}${cumulativeROI.toFixed(1)}%`}
                subtitle="vs Inversión Amortizada" 
                icon={TrendingUp} 
                variant={cumulativeROI >= 0 ? 'success' : 'warning'} 
              />
              <KPICard 
                title="Payback Proyectado" 
                value="14 meses" 
                subtitle="A tasa actual" 
                icon={Clock} 
                variant="default" 
              />
            </>
          )}
        </div>

        <SmartAlert 
          type="info" 
          message={`💡 La inversión de ${formatCurrency(investment)} se pagó upfront en Mes 1. El ROI se calcula contra el costo amortizado acumulado (${formatCurrency(totalAmortizedCost)}).`} 
          className="mb-6" 
        />

        {/* Cash Flow vs Value + ROI Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Cash Flow Reality Chart */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="text-lg font-semibold mb-2">Flujo de Caja Real</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Inversión upfront vs valor generado
            </p>
            <div className="h-[280px] w-full">
              {loadingMetrics ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cfoChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis 
                      dataKey="month" 
                      stroke={chartColors.axis} 
                      tick={{ fill: chartColors.axis, fontSize: 12 }}
                    />
                    <YAxis 
                      stroke={chartColors.axis} 
                      tick={{ fill: chartColors.axis }}
                      tickFormatter={(value) => value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: chartColors.tooltipBg, 
                        borderColor: chartColors.tooltipBorder, 
                        color: '#fff',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: chartColors.axis }}
                      formatter={(value: number, name: string) => [
                        `$${value.toLocaleString()}`, 
                        name === 'cashOutflow' ? 'Flujo de Caja' : 'Valor Generado'
                      ]}
                    />
                    <Legend 
                      formatter={(value) => value === 'cashOutflow' ? 'Flujo de Caja' : 'Valor Generado'}
                    />
                    <Bar dataKey="cashOutflow" fill="#EF4444" radius={[4, 4, 0, 0]} name="cashOutflow" />
                    <Bar dataKey="valueRealized" fill="#22C55E" radius={[4, 4, 0, 0]} name="valueRealized" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ROI Acumulativo Chart */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="text-lg font-semibold mb-2">ROI Acumulativo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Calculado vs costo amortizado acumulado
            </p>
            <div className="h-[280px] w-full">
              {loadingMetrics ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cfoChartData}>
                    <defs>
                      <linearGradient id="roiGradientCFO" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis 
                      dataKey="month" 
                      stroke={chartColors.axis} 
                      tick={{ fill: chartColors.axis, fontSize: 12 }}
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
                      formatter={(value: number) => [`${value}%`, 'ROI Acumulativo']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="roi" 
                      stroke={chartColors.primary} 
                      strokeWidth={2}
                      fill="url(#roiGradientCFO)"
                      dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Amortization Breakdown Table */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4">Desglose de Amortización</h3>
          {loadingMetrics ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mes</TableHead>
                  <TableHead className="text-right">Flujo de Caja</TableHead>
                  <TableHead className="text-right">Costo Amortizado</TableHead>
                  <TableHead className="text-right">Valor Generado</TableHead>
                  <TableHead className="text-right">ROI Mensual</TableHead>
                  <TableHead className="text-right">Payback Acum.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cfoChartData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.month}</TableCell>
                    <TableCell className={`text-right ${row.cashOutflow > 0 ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                      ${row.cashOutflow.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      ${Math.round(row.amortizedCost).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-success">
                      ${row.valueRealized.toLocaleString()}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${row.monthlyRoi >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {row.monthlyRoi >= 0 ? '+' : ''}{row.monthlyRoi}%
                    </TableCell>
                    <TableCell className="text-right">
                      {row.cumulativePaybackPct}%
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totals Row */}
                <TableRow className="border-t-2 border-border bg-muted/30">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold text-destructive">
                    ${totalCashOutflow.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ${Math.round(totalAmortizedCost).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold text-success">
                    ${Math.round(totalValueRealized).toLocaleString()}
                  </TableCell>
                  <TableCell className={`text-right font-bold ${cumulativeROI >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {cumulativeROI >= 0 ? '+' : ''}{cumulativeROI.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {latestMetrics?.cumulative_payback_pct || 0}%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>
      </>
    );
  };

  const renderCTOView = () => (
    <>
      {/* KPIs Row 1 - Operations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <KPICard 
              title="Delivery Rate" 
              value={`${deliveryRate}%`} 
              subtitle={`Meta M3: ≥${m3Benchmarks.deliveryRate.target}%`} 
              icon={Cpu} 
              variant="success" 
              trend="up" 
              trendValue="+12%" 
            />
            <KPICard title="Security Score" value="92/100" subtitle="3 Shadow AI tools blocked" icon={ShieldCheck} variant="success" />
            <KPICard title="Workflows Producción" value="24" subtitle="n8n activos" icon={Target} variant="default" trend="up" trendValue="+6" />
          </>
        )}
      </div>

      {/* KPIs Row 2 - Infrastructure Costs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <KPICard 
          title="Gasto API Total" 
          value={`$${totalAPICost.toLocaleString()}`} 
          subtitle="Este mes" 
          icon={Cloud} 
          variant="default" 
          trend="up" 
          trendValue="+12%" 
        />
        <KPICard 
          title="Gasto Infraestructura" 
          value={`$${totalInfraCost.toLocaleString()}`} 
          subtitle="AWS - Este mes" 
          icon={Server} 
          variant="default" 
          trend="up" 
          trendValue="+8%" 
        />
        <KPICard 
          title="Budget Utilización" 
          value={`${budgetUtilization.toFixed(0)}%`} 
          subtitle={`$${(totalAPICost + totalInfraCost).toLocaleString()} de $20,000`} 
          icon={DollarSign} 
          variant={budgetUtilization > 90 ? 'warning' : 'success'} 
        />
      </div>

      <SmartAlert type="success" message="Todos los sistemas operando dentro de parámetros normales. Latencia promedio: 145ms" className="mb-6" />

      {/* API Consumption & AWS Infrastructure Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* API Consumption Table */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-primary" />
            Consumo de APIs
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead className="text-right">Consumo</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                <TableHead className="text-right">Tendencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiConsumption.map((api, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{api.provider}</TableCell>
                  <TableCell>{api.service}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {(api.usage / 1000000).toFixed(2)}M {api.unit}
                  </TableCell>
                  <TableCell className="text-right font-medium">${api.cost.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span className={`flex items-center justify-end gap-1 ${
                      api.trend === 'up' ? 'text-warning' : 
                      api.trend === 'down' ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      {api.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : 
                       api.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : 
                       <Minus className="w-4 h-4" />}
                      {api.trendPercent}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* AWS Infrastructure */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-secondary" />
            Infraestructura AWS
          </h3>
          <div className="space-y-3">
            {cloudInfrastructure.services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    service.status === 'healthy' ? 'bg-success' :
                    service.status === 'warning' ? 'bg-warning' : 'bg-destructive'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.usage}</p>
                  </div>
                </div>
                <span className="font-semibold">${service.cost.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Infrastructure Cost Trend */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Tendencia de Costos de Infraestructura</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={infrastructureTrend}>
              <defs>
                <linearGradient id="apiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="infraGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.secondary} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={chartColors.secondary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="month" stroke={chartColors.axis} tick={{ fill: chartColors.axis }} />
              <YAxis stroke={chartColors.axis} tick={{ fill: chartColors.axis }} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: chartColors.tooltipBg, 
                  borderColor: chartColors.tooltipBorder, 
                  color: '#fff',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend />
              <Area type="monotone" dataKey="apiCost" name="API Cost" stroke={chartColors.primary} fill="url(#apiGradient)" />
              <Area type="monotone" dataKey="infraCost" name="Infra Cost" stroke={chartColors.secondary} fill="url(#infraGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

  // AI Lead specific calculations
  const totalTokens = apiConsumption.reduce((sum, a) => sum + a.usage, 0);
  const costPerUser = activeUsers > 0 ? totalAPICost / activeUsers : 0;
  const activationTarget = m3Benchmarks.activationRate.target;
  const fixedActivationRate = activationRate;

  const renderAILeadView = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <KPICard 
              title="MAU Rate" 
              value={`${Math.round(activationRate * 0.85)}%`} 
              subtitle={`${activeUsers} usuarios activos`} 
              icon={Brain} 
              variant="success" 
              trend="up" 
              trendValue="+5%"
            />
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
                Target M3: {activationTarget}% - {fixedActivationRate >= activationTarget ? 'Superado ✓' : 'En progreso'}
              </Badge>
            </KPICard>
            <KPICard 
              title="Power Users" 
              value={`${((powerUsers / totalEmployees) * 100).toFixed(1)}%`} 
              subtitle={`${powerUsers} usuarios avanzados`} 
              icon={Zap} 
              variant={powerUsers / totalEmployees >= 0.04 ? 'success' : 'warning'} 
            />
          </>
        )}
      </div>

      {departmentStats && departmentStats.some(d => d.status === 'critical') && (
        <SmartAlert 
          type="warning" 
          message={`⚠️ Equipos ${departmentStats.filter(d => d.status === 'critical').map(d => d.name).join(' y ')} por debajo del umbral de activación. Considerar training adicional.`} 
          className="mb-6" 
        />
      )}
      
      {/* Adoption by Department Chart */}
      <div className="p-6 rounded-xl bg-card border border-border mb-6">
        <h3 className="text-lg font-semibold mb-4">Adopción por Departamento</h3>
        <div className="h-[300px] w-full">
          {loadingDepts ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis type="number" domain={[0, 100]} stroke={chartColors.axis} tick={{ fill: chartColors.axis }} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="name" type="category" stroke={chartColors.axis} tick={{ fill: chartColors.axis }} width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: chartColors.tooltipBg, 
                    borderColor: chartColors.tooltipBorder, 
                    color: '#fff',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: chartColors.axis }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Activación']}
                />
                <Bar dataKey="activationRate" fill={chartColors.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* AI Tools Consumption Section */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-primary" />
          Consumo de Herramientas AI
        </h3>
        
        {/* Mini Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-muted/30 text-center">
            <p className="text-2xl font-bold text-primary">{(totalTokens / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-muted-foreground">Tokens Totales</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 text-center">
            <p className="text-2xl font-bold text-secondary">${costPerUser.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Costo por Usuario</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 text-center">
            <p className="text-2xl font-bold text-foreground">GPT-4 Turbo</p>
            <p className="text-sm text-muted-foreground">Herramienta más usada (45%)</p>
          </div>
        </div>

        {/* Tools Distribution Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aiToolsDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {aiToolsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={[chartColors.primary, chartColors.secondary, chartColors.softBlue, '#34D399'][index]} />
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
          
          {/* API List for AI Lead */}
          <div className="space-y-2">
            {apiConsumption.map((api, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div>
                  <p className="font-medium text-sm">{api.provider} - {api.service}</p>
                  <p className="text-xs text-muted-foreground">{(api.usage / 1000000).toFixed(2)}M tokens</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${api.cost.toLocaleString()}</p>
                  <span className={`text-xs ${
                    api.trend === 'up' ? 'text-warning' : 
                    api.trend === 'down' ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {api.trend === 'up' ? '↑' : api.trend === 'down' ? '↓' : '→'} {api.trendPercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
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

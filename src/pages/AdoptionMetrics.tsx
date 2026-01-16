import { DashboardLayout } from '@/components/DashboardLayout';
import { useDepartmentStats, useMonthlyMetrics, transformMetricsForCharts } from '@/hooks/useMetrics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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

const statusColors = { 'on-track': 'bg-success', 'at-risk': 'bg-warning', 'critical': 'bg-destructive' };

export default function AdoptionMetrics() {
  const { data: departmentStats, isLoading: loadingDepts } = useDepartmentStats();
  const { data: metrics, isLoading: loadingMetrics } = useMonthlyMetrics();

  const chartData = metrics ? transformMetricsForCharts(metrics) : [];
  const isLoading = loadingDepts || loadingMetrics;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Métricas de Adopción</h1>
        <p className="text-muted-foreground">Análisis detallado del uso de herramientas AI por equipo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4">Tasa de Activación (12 meses)</h3>
          <div className="h-[350px] w-full">
            {loadingMetrics ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="month" stroke={chartColors.axis} tick={{ fill: chartColors.axis }} />
                  <YAxis stroke={chartColors.axis} tick={{ fill: chartColors.axis }} tickFormatter={(v) => `${v}%`} />
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
                  <Line type="monotone" dataKey="activationRate" stroke={chartColors.primary} strokeWidth={2} dot={{ fill: chartColors.primary }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4">Usuarios Activos Mensuales</h3>
          <div className="h-[350px] w-full">
            {loadingMetrics ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="month" stroke={chartColors.axis} tick={{ fill: chartColors.axis }} />
                  <YAxis stroke={chartColors.axis} tick={{ fill: chartColors.axis }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: chartColors.tooltipBg, 
                      borderColor: chartColors.tooltipBorder, 
                      color: '#fff',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: chartColors.axis }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'MAU']}
                  />
                  <Area type="monotone" dataKey="mauRate" stroke={chartColors.softBlue} fill={chartColors.softBlue} fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Tabla de Equipos</h3>
        {loadingDepts ? (
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo</TableHead>
                <TableHead className="text-right">Usuarios</TableHead>
                <TableHead className="text-right">Activation %</TableHead>
                <TableHead className="text-right">MAU %</TableHead>
                <TableHead className="text-right">Power Users</TableHead>
                <TableHead className="text-right">Hrs/Semana</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentStats.map((dept) => (
                <TableRow key={dept.name}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell className="text-right">{dept.totalUsers}</TableCell>
                  <TableCell className="text-right">{dept.activationRate.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{dept.mauRate.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{dept.powerUsers}</TableCell>
                  <TableCell className="text-right">{dept.avgWeeklyHours.toFixed(1)}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[dept.status]} text-white`}>
                      {dept.status === 'on-track' ? 'En meta' : dept.status === 'at-risk' ? 'En riesgo' : 'Crítico'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
}

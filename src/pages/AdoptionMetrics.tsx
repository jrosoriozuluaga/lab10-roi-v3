import { DashboardLayout } from '@/components/DashboardLayout';
import { departmentStats, monthlyMetrics } from '@/lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const statusColors = { 'on-track': 'bg-success', 'at-risk': 'bg-warning', 'critical': 'bg-destructive' };

export default function AdoptionMetrics() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Métricas de Adopción</h1>
        <p className="text-muted-foreground">Análisis detallado del uso de herramientas AI por equipo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4">Tasa de Activación (12 meses)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="activationRate" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4">Usuarios Activos Mensuales</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="mauRate" stroke="hsl(var(--soft-blue))" fill="hsl(var(--soft-blue) / 0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Tabla de Equipos</h3>
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
      </div>
    </DashboardLayout>
  );
}

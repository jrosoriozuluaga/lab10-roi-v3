import { useState } from 'react';
import { AlertTriangle, AlertCircle, Lightbulb, Clock, Building2 } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { alerts, SystemAlert } from '@/lib/mockData';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

function AlertCard({ alert }: { alert: SystemAlert }) {
  const severityConfig = {
    critical: {
      borderColor: 'border-l-destructive',
      icon: AlertCircle,
      iconColor: 'text-destructive',
      badge: 'Crítico',
      badgeVariant: 'destructive' as const,
    },
    warning: {
      borderColor: 'border-l-warning',
      icon: AlertTriangle,
      iconColor: 'text-warning',
      badge: 'Advertencia',
      badgeVariant: 'secondary' as const,
    },
    opportunity: {
      borderColor: 'border-l-soft-blue',
      icon: Lightbulb,
      iconColor: 'text-soft-blue',
      badge: 'Oportunidad',
      badgeVariant: 'outline' as const,
    },
  };

  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <div className={`bg-card border border-border ${config.borderColor} border-l-4 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-primary/5`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg bg-muted ${config.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-foreground truncate">{alert.title}</h3>
            <Badge 
              variant={config.badgeVariant}
              className={alert.severity === 'warning' ? 'bg-warning/20 text-warning border-warning' : 
                        alert.severity === 'opportunity' ? 'bg-soft-blue/20 text-soft-blue border-soft-blue' : ''}
            >
              {config.badge}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
            {alert.department && (
              <div className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                <span>{alert.department}</span>
              </div>
            )}
            {alert.metric && (
              <div className="flex items-center gap-1">
                <span className="font-medium">{alert.metric}:</span>
                <span className="text-foreground">{alert.value}</span>
                {alert.threshold && <span className="text-muted-foreground">(umbral: {alert.threshold})</span>}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatDistanceToNow(alert.createdAt, { addSuffix: true, locale: es })}</span>
            </div>
          </div>
          
          {alert.isActionable && (
            <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground hover:border-primary">
              Tomar Acción
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ActiveAlerts() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    if (activeTab === 'all') return true;
    if (activeTab === 'critical') return alert.severity === 'critical';
    if (activeTab === 'warning') return alert.severity === 'warning';
    if (activeTab === 'opportunity') return alert.severity === 'opportunity';
    return true;
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;
  const opportunityCount = alerts.filter(a => a.severity === 'opportunity').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Centro de Alertas & Recomendaciones</h1>
          <p className="text-muted-foreground mt-1">
            Tu AI Guardian identificó {alerts.length} elementos que requieren atención
          </p>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Todas ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="critical" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
              Críticas ({criticalCount})
            </TabsTrigger>
            <TabsTrigger value="warning" className="data-[state=active]:bg-warning data-[state=active]:text-warning-foreground">
              Advertencias ({warningCount})
            </TabsTrigger>
            <TabsTrigger value="opportunity" className="data-[state=active]:bg-soft-blue data-[state=active]:text-white">
              Oportunidades ({opportunityCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
              
              {filteredAlerts.length === 0 && (
                <div className="text-center py-16">
                  <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Todo en orden</h3>
                  <p className="text-muted-foreground">
                    No hay alertas {activeTab !== 'all' ? 'en esta categoría' : 'pendientes'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

import { Bell, Key, User, Palette, Lock, Database, Users, Workflow, Code, Briefcase, ClipboardList, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { integrations, DataIntegration } from '@/lib/mockData';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const iconMap = {
  users: Users,
  workflow: Workflow,
  code: Code,
  briefcase: Briefcase,
  clipboard: ClipboardList,
};

function IntegrationCard({ integration }: { integration: DataIntegration }) {
  const Icon = iconMap[integration.icon];
  
  const statusConfig = {
    connected: {
      label: 'Conectado',
      dotClass: 'bg-success',
      textClass: 'text-success',
    },
    syncing: {
      label: 'Sincronizando...',
      dotClass: 'bg-warning animate-pulse',
      textClass: 'text-warning',
    },
    stale: {
      label: integration.lastSync 
        ? `Hace ${formatDistanceToNow(integration.lastSync, { locale: es })}`
        : 'Sin sincronizar',
      dotClass: 'bg-muted-foreground',
      textClass: 'text-muted-foreground',
    },
  };

  const config = statusConfig[integration.status];

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{integration.category}</span>
            <span className="text-muted-foreground">({integration.name})</span>
          </div>
          <p className="text-sm text-muted-foreground">{integration.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {integration.dataTypes.map((dataType) => (
              <Badge key={dataType} variant="outline" className="text-xs bg-background">
                {dataType}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`} />
          <span className={`text-sm font-medium ${config.textClass}`}>{config.label}</span>
        </div>
        {integration.status === 'stale' && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground mt-1">
            Administra las preferencias de tu cuenta y del sistema
          </p>
        </div>

        {/* Data Source Connections - NEW SECTION */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Data Source Connections</CardTitle>
                <CardDescription>Visualiza las fuentes de datos conectadas al sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {integrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </CardContent>
        </Card>

        {/* Profile Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Perfil de Usuario</CardTitle>
                <CardDescription>Tu información personal</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" defaultValue="Admin LAB10" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="admin@lab10.ai" className="mt-1" />
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-lilac/10">
                <Palette className="w-5 h-5 text-lilac" />
              </div>
              <div>
                <CardTitle>Apariencia</CardTitle>
                <CardDescription>Personaliza la interfaz</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Modo Oscuro</Label>
                <p className="text-sm text-muted-foreground">Activa el tema oscuro para la interfaz</p>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-soft-blue/10">
                <Bell className="w-5 h-5 text-soft-blue" />
              </div>
              <div>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>Configura cómo recibir alertas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Alertas Críticas</Label>
                <p className="text-sm text-muted-foreground">Recibe notificaciones de alertas críticas</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Resumen Semanal</Label>
                <p className="text-sm text-muted-foreground">Recibe un email semanal con métricas clave</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Actualizaciones de Proyectos</Label>
                <p className="text-sm text-muted-foreground">Notificaciones cuando un proyecto cambia de estado</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="bg-card border-border opacity-60">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Key className="w-5 h-5 text-warning" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  API Keys
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>Gestiona tus claves de API</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Esta funcionalidad estará disponible próximamente. Podrás gestionar las API keys de OpenAI, 
              Anthropic y otros proveedores de AI.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

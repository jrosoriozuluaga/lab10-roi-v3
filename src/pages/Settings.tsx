import { Bell, Key, User, Palette, Lock } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';

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

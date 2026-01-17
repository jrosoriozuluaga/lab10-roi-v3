import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calculator, Briefcase, AlertTriangle, Settings, Sun, Moon, UsersRound, LogOut } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { criticalAlertCount } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import lab10LogoIcon from '@/assets/lab10-logo-icon.png';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/stakeholder', label: 'Vista Stakeholder', icon: UsersRound },
  { path: '/calculator', label: 'Calculadora ROI', icon: Calculator },
  { path: '/projects', label: 'Portafolio Proyectos', icon: Briefcase },
  { path: '/alerts', label: 'AI Guardian', icon: AlertTriangle, showBadge: true },
  { path: '/settings', label: 'Configuración', icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Error al cerrar sesión');
    } else {
      toast.success('Sesión cerrada');
      navigate('/auth');
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50 transition-transform duration-300 ease-in-out",
        "md:translate-x-0", // Always visible on desktop
        isOpen ? "translate-x-0" : "-translate-x-full" // Toggle on mobile
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img src={lab10LogoIcon} alt="LAB10" className="h-10 w-auto" />
            <div>
              <span className="text-lg font-bold text-foreground">AI Pulse</span>
              <span className="block text-xs text-muted-foreground">ROI Dashboard</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const showNotificationDot = 'showBadge' in item && item.showBadge && criticalAlertCount > 0;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose?.()} // Close sidebar on mobile when link clicked
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {showNotificationDot && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  )}
                </div>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          {/* User Email */}
          {user?.email && (
            <div className="px-4 py-2 text-xs text-muted-foreground truncate">
              {user.email}
            </div>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-5 h-5" />
                <span>Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                <span>Modo Oscuro</span>
              </>
            )}
          </Button>

          {/* Logout Button */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </aside>
    </>
  );
}

import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calculator, Briefcase, AlertTriangle, Settings, Sun, Moon, UsersRound } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { criticalAlertCount } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import lab10LogoIcon from '@/assets/lab10-logo-icon.png';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/stakeholder', label: 'Vista Stakeholder', icon: UsersRound },
  { path: '/calculator', label: 'Calculadora ROI', icon: Calculator },
  { path: '/projects', label: 'Portafolio Proyectos', icon: Briefcase },
  { path: '/alerts', label: 'AI Guardian', icon: AlertTriangle, showBadge: true },
  { path: '/settings', label: 'Configuración', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                isActive
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
      <div className="p-4 border-t border-sidebar-border">
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
      </div>
    </aside>
  );
}

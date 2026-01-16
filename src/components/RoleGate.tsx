import { Crown, Calculator, Cpu, Brain } from 'lucide-react';
import { useRole, Role } from '@/contexts/RoleContext';
import lab10LogoFull from '@/assets/lab10-logo-full.png';

const roles: { id: Role; title: string; description: string; icon: React.ElementType }[] = [
  {
    id: 'CEO',
    title: 'CEO',
    description: 'Visión estratégica y Net AI Value',
    icon: Crown,
  },
  {
    id: 'CFO',
    title: 'CFO',
    description: 'Payback Period y eficiencia de costos',
    icon: Calculator,
  },
  {
    id: 'CTO',
    title: 'CTO',
    description: 'Métricas técnicas y delivery',
    icon: Cpu,
  },
  {
    id: 'AI Lead',
    title: 'AI Lead',
    description: 'Adopción y activación de equipos',
    icon: Brain,
  },
];

export function RoleGate() {
  const { setRole } = useRole();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="mb-12 animate-fade-in">
        <img src={lab10LogoFull} alt="LAB10" className="h-16 w-auto" />
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center animate-fade-in">
        Bienvenido al Sistema de Medición
      </h1>
      <p className="text-muted-foreground text-lg mb-12 text-center max-w-xl animate-fade-in">
        Selecciona tu rol para ver las métricas y KPIs más relevantes para ti
      </p>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        {roles.map((role, index) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => setRole(role.id)}
              className="group relative p-8 rounded-xl bg-card border border-border hover:border-primary transition-all duration-300 text-left animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {role.title}
                </h3>
                <p className="text-muted-foreground">
                  {role.description}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <p className="mt-12 text-sm text-muted-foreground animate-fade-in">
        AI Pulse • Framework de Medición de ROI
      </p>
    </div>
  );
}

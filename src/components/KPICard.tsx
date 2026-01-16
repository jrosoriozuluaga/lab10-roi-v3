import { ReactNode } from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: ReactNode;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  children?: ReactNode;
}

const variantStyles = {
  default: 'border-border',
  success: 'border-success/30 bg-success/5',
  warning: 'border-warning/30 bg-warning/5',
  danger: 'border-destructive/30 bg-destructive/5',
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendColors = {
  up: 'text-success',
  down: 'text-destructive',
  neutral: 'text-muted-foreground',
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = 'default',
  className,
  children,
}: KPICardProps) {
  const TrendIcon = trend ? trendIcons[trend] : null;

  return (
    <div
      className={cn(
        'p-6 rounded-xl bg-card border transition-all duration-200 hover:shadow-lg',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="p-2 rounded-lg bg-secondary">
              <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        {trend && TrendIcon && (
          <div className={cn('flex items-center gap-1 text-sm', trendColors[trend])}>
            <TrendIcon className="w-4 h-4" />
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {subtitle && (
          <div className="text-sm text-muted-foreground">{subtitle}</div>
        )}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

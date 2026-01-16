import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AlertType = 'warning' | 'error' | 'success' | 'info';

interface SmartAlertProps {
  type: AlertType;
  message: string;
  className?: string;
}

const alertStyles: Record<AlertType, { bg: string; border: string; text: string; icon: React.ElementType }> = {
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    text: 'text-warning',
    icon: AlertTriangle,
  },
  error: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/30',
    text: 'text-destructive',
    icon: AlertCircle,
  },
  success: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    text: 'text-success',
    icon: CheckCircle,
  },
  info: {
    bg: 'bg-soft-blue/10',
    border: 'border-soft-blue/30',
    text: 'text-soft-blue',
    icon: Info,
  },
};

export function SmartAlert({ type, message, className }: SmartAlertProps) {
  const style = alertStyles[type];
  const Icon = style.icon;

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg border',
        style.bg,
        style.border,
        className
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0', style.text)} />
      <span className="text-sm text-foreground">{message}</span>
    </div>
  );
}

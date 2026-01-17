import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatWidget } from './AICopilot/ChatWidget';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import lab10LogoIcon from '@/assets/lab10-logo-icon.png';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header / Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <img src={lab10LogoIcon} alt="LAB10" className="h-8 w-auto" />
          <span className="font-bold text-foreground">AI Pulse</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={cn(
        "min-h-screen transition-all duration-300",
        "md:ml-64", // Left margin only on desktop
        "ml-0" // No margin on mobile
      )}>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}

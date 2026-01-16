import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { ChatWidget } from './AICopilot/ChatWidget';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}

import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/services/RealAiService';
import { ChatChart } from './ChatChart';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex gap-3 p-3 rounded-lg",
      isUser ? "bg-muted/50" : "bg-primary/5 border border-primary/20"
    )}>
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser ? "bg-muted" : "bg-primary/20"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-primary" />
        )}
      </div>
      
      <div className="flex-1 min-w-0 space-y-2">
        <div className="text-xs text-muted-foreground">
          {isUser ? 'Tú' : 'LAB10 AI'}
        </div>
        
        <div className="prose prose-sm prose-invert max-w-none">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0 text-sm text-foreground">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-sm text-foreground">{children}</li>,
              code: ({ children }) => (
                <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {message.chartData && (
          <div className="mt-3">
            <ChatChart chartData={message.chartData} />
          </div>
        )}
      </div>
    </div>
  );
}

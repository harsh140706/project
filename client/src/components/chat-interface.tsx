import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { ChatMessageComponent } from "@/components/chat-message";
import { ChatMessage, CareerResponse } from "@/types/chat";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  sessionId: string | null;
  onSessionIdChange: (sessionId: string) => void;
}

export function ChatInterface({ sessionId, onSessionIdChange }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear messages when sessionId is reset to null (New Chat button)
  useEffect(() => {
    if (sessionId === null) {
      setMessages([]);
      setInputValue("");
      setIsLoading(false);
    }
  }, [sessionId]);

  const chatMutation = useMutation({
    mutationFn: async ({ message, sessionId }: { message: string; sessionId?: string }) => {
      const response = await apiRequest("POST", "/api/chat", { message, sessionId });
      return response.json();
    },
    onSuccess: (data: { sessionId: string; response: CareerResponse; messageId: string }) => {
      if (!sessionId) {
        onSessionIdChange(data.sessionId);
      }
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: 'Career advice generated',
        response: data.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get career advice. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const handleSendMessage = () => {
    const message = inputValue.trim();
    if (!message) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    chatMutation.mutate({ message, sessionId: sessionId || undefined });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-8 fade-in" data-testid="chat-container">
      {/* Quick Prompt Buttons - Show only when no messages */}
      {messages.length === 0 && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Get Career Guidance</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Ask about any career path or try one of these popular options:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { icon: "🩺", title: "Doctor", query: "I want to be a Medical Doctor" },
              { icon: "⚙️", title: "Engineer", query: "I want to be a Software Engineer" },
              { icon: "👨‍🏫", title: "Teacher", query: "I want to be a Teacher" },
              { icon: "📊", title: "Data Scientist", query: "I want to be a Data Scientist" }
            ].map((prompt, index) => (
              <button
                key={index}
                onClick={() => {
                  const userMessage: ChatMessage = {
                    id: `user-${Date.now()}`,
                    type: 'user',
                    content: prompt.query,
                    timestamp: new Date(),
                  };

                  setMessages(prev => [...prev, userMessage]);
                  setIsLoading(true);
                  chatMutation.mutate({ message: prompt.query, sessionId: sessionId || undefined });
                }}
                className="p-4 bg-card hover:bg-secondary border border-border rounded-xl transition-colors group text-center"
                data-testid={`button-quick-${prompt.title.toLowerCase()}`}
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {prompt.icon}
                </div>
                <span className="text-sm font-medium text-foreground">{prompt.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="space-y-6">
        {messages.map((message) => (
              <ChatMessageComponent 
                key={message.id} 
                message={message} 
              />
            ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm" data-testid="loading-indicator">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full pulse-dot"></div>
                <div className="w-2 h-2 bg-primary rounded-full pulse-dot" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full pulse-dot" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-muted-foreground">Analyzing your career interests...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about any career path... (e.g., 'I want to be a Software Engineer')"
                  className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder-muted-foreground"
                  disabled={isLoading}
                  data-testid="input-chat"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 top-2 w-8 h-8 bg-primary hover:bg-primary/90 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  size="sm"
                  data-testid="button-send"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-primary-foreground" />
                  ) : (
                    <Send className="w-4 h-4 text-primary-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send • No personal data is collected or stored
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { ChatInterface } from "@/components/chat-interface";
import { ChatHistory } from "@/components/chat-history";

export default function Home() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleClearChat = () => {
    setSessionId(null);
  };

  const handleSessionSelect = (selectedSessionId: string) => {
    setSessionId(selectedSessionId);
    setShowHistory(false); // Close history on mobile after selection
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-primary-foreground text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Career & Skills Advisor</h1>
                <p className="text-sm text-muted-foreground">AI-powered career guidance for students</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors lg:hidden"
              >
                <i className="fas fa-history text-sm"></i>
                <span className="text-sm font-medium">History</span>
              </button>
              
              <button 
                onClick={handleClearChat}
                className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                data-testid="button-clear-chat"
              >
                <i className="fas fa-refresh text-sm"></i>
                <span className="text-sm font-medium">New Chat</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar - Chat History */}
        <aside className={`w-80 border-r border-border bg-card/50 ${showHistory ? 'block' : 'hidden'} lg:block`}>
          <ChatHistory 
            currentSessionId={sessionId}
            onSessionSelect={handleSessionSelect}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8 pb-32">
          <ChatInterface 
            sessionId={sessionId} 
            onSessionIdChange={setSessionId}
          />
        </main>
      </div>
    </div>
  );
}

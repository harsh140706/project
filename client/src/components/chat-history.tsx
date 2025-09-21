import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, MessageSquare, Download, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatSession {
  sessionId: string;
  messageCount: number;
  lastActivity: string;
}

interface ChatHistoryProps {
  onLoadSession: (sessionId: string) => void;
}

export function ChatHistory({ onLoadSession }: ChatHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const { data: sessionsData, isLoading } = useQuery({
    queryKey: ["chat-sessions"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/sessions");
      return response.json();
    },
  });

  const sessions: ChatSession[] = sessionsData?.sessions || [];



  const handleExportSession = async (sessionId: string) => {
    try {
      const response = await apiRequest("GET", `/api/export/${sessionId}`);
      const data = await response.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-session-${sessionId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Chat session has been exported to your downloads.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export chat session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportAll = async () => {
    try {
      const response = await apiRequest("GET", "/api/export");
      const data = await response.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all-chat-sessions-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "All chat sessions have been exported to your downloads.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export chat sessions. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (sessions.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">Chat History</CardTitle>
            <Badge variant="secondary">{sessions.length} sessions</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAll}
              className="text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              Export All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {sessions.map((session) => (
              <div
                key={session.sessionId}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium truncate">
                        Session {session.sessionId.slice(-8)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{session.messageCount} messages</span>
                      <span>•</span>
                      <span>{new Date(session.lastActivity).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExportSession(session.sessionId)}
                    className="text-xs"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onLoadSession(session.sessionId)}
                    className="text-xs"
                  >
                    Load
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
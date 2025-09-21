import { ChatMessage, CareerResponse } from "@/types/chat";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Info, Settings, Route, User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessageComponent({ message }: ChatMessageProps) {
  if (message.type === 'user') {
    return (
      <div className="flex justify-end mb-4" data-testid={`message-user-${message.id}`}>
        <div className="max-w-2xl bg-primary text-primary-foreground rounded-xl px-4 py-3 flex items-start space-x-3">
          <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p className="font-medium">{message.content}</p>
        </div>
      </div>
    );
  }

  if (message.type === 'ai' && message.response) {
    return (
      <Card className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8 fade-in" data-testid={`message-ai-${message.id}`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="font-semibold text-foreground">Career Advisor</span>
        </div>
        
        <div className="space-y-6">
          {/* Career Overview */}
          <div className="border-l-4 border-primary pl-4">
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
              <Info className="w-5 h-5 text-primary mr-2" />
              Career Overview
            </h3>
            <p className="text-muted-foreground leading-relaxed">{message.response.career_overview}</p>
          </div>
          
          {/* Recommended Degree */}
          <div className="border-l-4 border-accent pl-4">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <GraduationCap className="w-5 h-5 text-accent mr-2" />
              Recommended Education
            </h3>
            <ul className="space-y-2">
              {message.response.recommended_degree.map((degree, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <i className="fas fa-check-circle text-accent mt-1 text-sm"></i>
                  <span className="text-muted-foreground">{degree}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Required Skills */}
          <div className="border-l-4 border-primary pl-4">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Settings className="w-5 h-5 text-primary mr-2" />
              Essential Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {message.response.skills_needed.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Learning Path */}
          <div className="border-l-4 border-accent pl-4">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Route className="w-5 h-5 text-accent mr-2" />
              Step-by-Step Learning Path
            </h3>
            <ol className="space-y-3">
              {message.response.learning_path.map((step, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>


        </div>
      </Card>
    );
  }

  return null;
}

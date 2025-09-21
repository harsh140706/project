export interface CareerResponse {
  career_overview: string;
  recommended_degree: string[];
  skills_needed: string[];
  learning_path: string[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  response?: CareerResponse;
  timestamp: Date;
}

export interface ExamplePrompt {
  icon: string;
  title: string;
  query: string;
}

export interface Prompt {
    id: string;
    content: string;
    systemPrompt: string;
    createdAt: Date;
  }
  
  export interface LLMResponse {
    id: string;
    promptId: string;
    llmProvider: string;
    response: string;
    latency: number;
    tokenCount: number;
    error?: string | null;
    createdAt: Date;
  }
  
  export interface Evaluation {
    id: string;
    responseId: string;
    accuracy: number;
    relevancy: number;
    createdAt: Date;
  }
  
  export interface HistoryItem {
    systemPrompt: string;
    content: string;
    responses: {
      llmProvider: string;
      response: string;
      latency: number;
    }[];
  }
import { Groq } from 'groq-sdk';
import OpenAI from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';
import { LLMResponse } from '../types/types';

export class LLMService {
  private groq: Groq;
  private openai: OpenAI;
  private anthropic: Anthropic;

  constructor() {
    // Add support for multiple models per provider
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    
    // Only initialize if API keys are present
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI(
        { apiKey: process.env.OPENAI_API_KEY }
      );
    }
  }

  async getCompletion(
    prompt: string, 
    systemPrompt: string,
    provider: string,
    model?: string
  ): Promise<LLMResponse> {
    const startTime = Date.now();
    
    try {
      const response = await this.getProviderResponse(
        provider,
        prompt,
        systemPrompt,
        model
      );

      return {
        response: response.text,
        latency: Date.now() - startTime,
        tokenCount: response.tokens,
        error: null
      };
    } catch (error) {
      return {
        response: '',
        latency: Date.now() - startTime,
        tokenCount: 0,
        error: error.message
      };
    }
  }

  private async getProviderResponse(
    provider: string,
    prompt: string,
    systemPrompt: string,
    model?: string
  ) {
    switch(provider) {
      case 'groq':
        // Groq is recommended as primary provider
        return this.groqCompletion(prompt, systemPrompt, model);
      case 'openai':
        return this.openaiCompletion(prompt, systemPrompt, model);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
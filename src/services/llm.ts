import { Groq } from 'groq-sdk';
import OpenAI from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';
import { LLMAPIResponse, LLMResponse } from '../types/types';

export class LLMService {
  private groq: Groq;
  private openai?: OpenAI;
  private anthropic?: Anthropic;

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

    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
    }
  }

  async getCompletion(
    prompt: string, 
    systemPrompt: string,
    provider: string,
    model?: string
  ): Promise<LLMAPIResponse> {
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
        error: error instanceof Error ? error.message : 'Unknown error'
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

  private async openaiCompletion(
    prompt: string,
    systemPrompt: string,
    model: string = 'gpt-4'
  ) {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }
    
    const completion = await this.openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]
    });

    return {
      text: completion.choices[0].message.content || '',
      tokens: completion.usage?.total_tokens || 0
    };
  }

  private async groqCompletion(
    prompt: string,
    systemPrompt: string,
    model: string = 'mixtral-8x7b-32768'
  ) {
    const completion = await this.groq.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]
    });

    return {
      text: completion.choices[0].message?.content || '',
      tokens: completion.usage?.total_tokens || 0
    };
  }
}
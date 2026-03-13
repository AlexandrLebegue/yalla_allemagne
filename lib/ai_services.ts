import axios from 'axios';

// OpenRouter API configuration
const OPENROUTER_API_BASE_URL = 'https://openrouter.ai/api/v1';
const AI_MODEL = 'nvidia/nemotron-3-super-120b-a12b:free';

// Create axios instance for OpenRouter API
const openRouterApi = axios.create({
  baseURL: OPENROUTER_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'Yalla Allemagne IA Assistant',
  },
});

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  max_tokens?: number;
  temperature?: number;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Generate text completion using AI via OpenRouter
 * @param messages - Array of messages for the conversation
 * @param options - Optional parameters for the request
 */
export const generateCompletion = async (
  messages: OpenRouterMessage[],
  options: {
    maxTokens?: number;
    temperature?: number;
  } = {}
): Promise<string> => {
  try {
    const request: OpenRouterRequest = {
      model: AI_MODEL,
      messages,
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
    };

    const response = await openRouterApi.post<OpenRouterResponse>('/chat/completions', request);
    
    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error('No completion choices returned from OpenRouter API');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating completion with OpenRouter:', error);
    throw error;
  }
};

/**
 * Generate a guide summary
 * @param guideData - Combined guide metadata and content
 */
export const generateGuideSummary = async (guideData: {
  name: string;
  description?: string;
  category?: string;
  topics: string[];
  content?: string;
}): Promise<string> => {
  const systemPrompt = `Tu es un rédacteur cool et bienveillant qui aide les Tunisiens à préparer leur départ en Allemagne.

Ta mission est de générer un résumé bref et accrocheur (2-3 phrases) qui met en avant :
- Les points clés du guide de manière engageante
- Les démarches ou conseils importants avec un ton décontracté
- Les astuces pratiques et encourageantes

Adopte un ton décontracté, positif et encourageant — comme un pote qui est déjà passé par là. Utilise des émojis avec parcimonie pour ajouter du dynamisme.`;

  const userPrompt = `Crée un résumé accrocheur et cool pour ce guide :

**Titre:** ${guideData.name}
**Description:** ${guideData.description || 'Aucune description fournie'}
**Catégorie:** ${guideData.category || 'Non spécifiée'}
**Sujets:** ${guideData.topics.join(', ') || 'Aucun spécifié'}

${guideData.content ? `**Contenu:**\n${guideData.content.slice(0, 2000)}${guideData.content.length > 2000 ? '...' : ''}` : '**Note:** Aucun contenu disponible'}

Génère un résumé de 2-3 phrases en français qui soit décontracté, encourageant et pratique !`;

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  return await generateCompletion(messages, {
    maxTokens: 250,
    temperature: 0.8
  });
};

const openrouterService = {
  generateCompletion,
  generateGuideSummary,
};

export default openrouterService;

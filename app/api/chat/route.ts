import { NextRequest, NextResponse } from 'next/server';
import { getAllArticleMetadata } from '@/lib/markdown';
import { generateCompletion, OpenRouterMessage } from '@/lib/ai_services';

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message invalide' },
        { status: 400 }
      );
    }

    // Load all article metadata for AI context
    const articles = getAllArticleMetadata();

    // Build system prompt with article metadata
    const systemPrompt = `Tu es un assistant virtuel cool et bienveillant, expert dans l'accompagnement des Tunisiens qui veulent partir en Allemagne.

Ton rôle est d'aider les utilisateurs à comprendre les démarches, trouver les bons articles et les encourager dans leur projet.

Ton ton est décontracté, positif et encourageant — comme un pote qui est déjà passé par là et qui te file les bons tuyaux. Tu peux tutoyer les gens.

Articles disponibles sur le site:
${articles.map((article, index) => `
${index + 1}. Titre: "${article.title}"
   Résumé: ${article.excerpt}
   Mots-clés: ${article.keywords.join(', ')}
   Slug: ${article.slug}
`).join('\n')}

IMPORTANT: Quand tu recommandes un article du site, utilise EXACTEMENT ce format:
[ARTICLE:slug-de-article]

Par exemple: [ARTICLE:obtenir-visa-allemagne]

Instructions:
- Réponds en français de manière claire, cool et encourageante
- Utilise un ton décontracté (tutoiement OK, c'est même mieux !)
- Si la question concerne un sujet traité dans un article, recommande-le avec le format [ARTICLE:slug]
- Tu peux recommander plusieurs articles si pertinent
- Si aucun article ne correspond, donne des conseils généraux pratiques
- Sois positif et motivant — c'est un grand projet de vie ! 🚀
- Utilise des émojis pour rendre la conversation fun ✈️🇩🇪
- Si quelqu'un demande quelque chose hors sujet (pas lié à l'Allemagne/immigration), redirige gentiment
- Donne des infos concrètes et pratiques, pas de blabla administratif
- Sois honnête sur les galères possibles, mais toujours encourageant`;

    // Prepare messages for AI
    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    // Call OpenRouter API
    const aiResponse = await generateCompletion(messages, {
      maxTokens: 500,
      temperature: 0.7
    });

    // Parse article references from response
    const articlePattern = /\[ARTICLE:([^\]]+)\]/g;
    const matches = Array.from(aiResponse.matchAll(articlePattern));
    
    // Get referenced articles
    const referencedArticles = matches
      .map(match => articles.find(a => a.slug === match[1]))
      .filter((article): article is NonNullable<typeof article> => article !== null && article !== undefined);

    // Remove article markers from response for cleaner display
    const cleanedResponse = aiResponse.replace(articlePattern, '');

    return NextResponse.json({
      response: cleanedResponse,
      articles: referencedArticles,
      success: true
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Oups, y\'a eu un souci. Réessaie stp !',
        success: false
      },
      { status: 500 }
    );
  }
}

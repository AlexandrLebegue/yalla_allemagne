# 🇹🇳→🇩🇪 Yalla Allemagne

Guide Next.js + TypeScript pour les Tunisiens qui veulent partir en Allemagne, avec chatbot IA intégré.

## Description

Yalla Allemagne est un site web cool et pratique qui aide les Tunisiens à préparer leur départ en Allemagne. Il couvre les visas, le logement, le travail, la langue et la vie quotidienne.

## Stack technique

- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS 4
- **Animations** : Framer Motion
- **IA** : OpenRouter API (nvidia/nemotron-3-super-120b-a12b:free)
- **Contenu** : Markdown avec gray-matter

## Structure

```
guide-tunisie-allemagne/
├── app/                        # Pages Next.js App Router
│   ├── page.tsx               # Page d'accueil
│   ├── chatbot/               # Chatbot IA
│   ├── tutoriels/             # Page guides
│   ├── a-propos/              # Page à propos
│   ├── articles/[slug]/       # Pages articles dynamiques
│   └── api/                   # Routes API
│       ├── chat/              # API chatbot
│       └── contact/           # API contact
├── components/                # Composants React
├── content/                   # Guides en Markdown
├── lib/                       # Services (IA, markdown)
├── models/                    # Modèles TypeScript
└── public/                    # Assets statiques
```

## Catégories de guides

| Catégorie | Description |
|-----------|-------------|
| `visa-et-papiers` | Visas, documents, démarches |
| `logement` | Trouver un logement en Allemagne |
| `travail` | Emploi, CV, entretiens |
| `langue` | Apprendre l'allemand |
| `vie-quotidienne` | Culture, transports, vie courante |

## Démarrage rapide

```bash
cd guide-tunisie-allemagne
npm install
npm run dev
```

## Variables d'environnement

```env
REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Licence

Projet privé.

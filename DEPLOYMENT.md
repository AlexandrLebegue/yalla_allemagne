# Deployment — Yalla Allemagne

Guide de déploiement pour l'application Yalla Allemagne.

## Déploiement local

```bash
npm run build
npm run start
```

## Déploiement Docker

```bash
docker build -t yalla-allemagne:local .
docker run -p 3000:3000 \
  -e REACT_APP_OPENROUTER_API_KEY="your-key" \
  -e NEXT_PUBLIC_SITE_URL="http://localhost:3000" \
  yalla-allemagne:local
```

## Variables d'environnement requises

| Variable | Description |
|----------|-------------|
| `REACT_APP_OPENROUTER_API_KEY` | Clé API OpenRouter |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site |

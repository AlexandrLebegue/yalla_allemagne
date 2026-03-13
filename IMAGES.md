# Guide des images — Yalla Allemagne

Ce document explique comment ajouter des images pour les guides.

## Structure des dossiers

```
public/
├── images/
│   ├── covers/           # Images de couverture des guides (SVG)
│   │   ├── visa-allemagne.svg
│   │   ├── logement-allemagne.svg
│   │   ├── travail-allemagne.svg
│   │   ├── langue-allemand.svg
│   │   └── vie-quotidienne.svg
│   ├── articles/         # Images intégrées dans les articles
│   └── hero/             # Images hero de la page d'accueil
```

## Ajouter une image de couverture

1. Créez un SVG ou une image (dimensions recommandées : 800x400)
2. Placez-la dans `public/images/covers/`
3. Référencez-la dans le frontmatter du guide :

```yaml
coverImage: "/images/covers/mon-guide.svg"
```

## Ajouter des images dans un article

Utilisez la syntaxe Markdown standard :

```markdown
![Description](/images/articles/mon-dossier/image.png)
```

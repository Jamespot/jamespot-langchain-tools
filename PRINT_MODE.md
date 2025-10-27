# Mode Print (-p / --print)

Le mode print permet d'exécuter une requête unique et d'afficher directement le résultat, sans entrer en mode interactif.

## Usage

### Syntaxe de base

```bash
npm run chat -- -p "votre question ici"
# ou
npm run chat -- --print "votre question ici"
```

### Exemples

**Obtenir l'utilisateur courant :**
```bash
npm run chat -- -p "qui suis-je ?"
```

**Rechercher des utilisateurs :**
```bash
npm run chat -- -p "trouve les utilisateurs dont le nom contient 'Martin'"
```

**Lister les groupes :**
```bash
npm run chat -- -p "liste mes groupes"
```

**Obtenir la date actuelle :**
```bash
npm run chat -- -p "quelle est la date aujourd'hui ?"
```

## Combinaison avec le mode debug

Vous pouvez combiner `-p`/`--print` avec `--debug` pour voir les détails d'exécution :

```bash
npm run chat -- -p "votre question" --debug
# ou
npm run chat -- --print "votre question" --debug
```

ou

```bash
DEBUG=true npm run chat -- -p "votre question"
```

## Mode Print vs Mode Interactif

| Mode | Usage | Avantages |
|------|-------|-----------|
| **Print (-p)** | Requête unique | - Rapide<br>- Scriptable<br>- Parfait pour l'automatisation |
| **Interactif** | Conversation | - Contexte conservé<br>- Plusieurs échanges<br>- Idéal pour l'exploration |

## Utilisation dans des scripts

Le mode print est parfait pour intégrer l'agent dans des scripts :

```bash
#!/bin/bash

# Obtenir les informations de l'utilisateur courant
USER_INFO=$(npm run chat -- -p "donne-moi mes informations en JSON")

# Utiliser la réponse dans votre script
echo "$USER_INFO"
```

## Format de sortie

- **Succès** : La réponse de l'agent est affichée directement sur stdout
- **Erreur** : Le message d'erreur est affiché sur stderr et le code de retour est 1

## Exemples avancés

**Créer un événement :**
```bash
npm run chat -- -p "crée un événement 'Réunion équipe' demain à 14h"
```

**Rechercher et lister :**
```bash
npm run chat -- -p "liste les 5 derniers articles du groupe 'Innovation'"
```

**Calculer une date :**
```bash
npm run chat -- -p "quelle est la date dans 7 jours ?"
```

## Notes

- Le système prompt défini dans `.env` (`SYSTEM_PROMPT`) est toujours appliqué
- Le mode print utilise le même LLM configuré que le mode interactif
- La limite de récursion est fixée à 15 (comme en mode interactif)
- Aucun historique de conversation n'est conservé entre les exécutions

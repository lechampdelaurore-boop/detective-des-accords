# Détective des accords

Mini-appli pour s'entraîner aux accords, en menant l'enquête étape par étape (la « chaîne d'accord »).

- **Jouer en ligne :** https://lechampdelaurore-boop.github.io/detective-des-accords/

## Le jeu

- **Sujet et verbe** : une phrase dont le verbe est à compléter.
  1. Trouve le verbe (astuce : dis la phrase avec « hier », le mot qui change est le verbe).
  2. « Qui est-ce qui… ? » : touche le sujet. Une flèche relie le sujet au verbe.
  3. Il ou ils ?
  4. La fin du verbe : -e ou -ent.
- **Groupe du nom** : touche le déterminant, dis si c'est un seul ou plusieurs, des flèches relient le déterminant au nom puis aux adjectifs, et ajoute les s.
- **Trois niveaux** par exercice : tout est guidé, puis seulement la fin avec une loupe pour revoir les étapes, puis en solo (les étapes reviennent après une erreur). Le niveau monte quand 5 des 6 dernières phrases sont réussies sans aide, sur au moins 2 jours. Il ne redescend jamais tout seul.
- **Séance du jour** : 5 phrases (environ 5 minutes), puis « À demain ! ». Une phrase ratée revient un peu plus tard. Après deux phrases difficiles, la suivante est guidée.
- **Erreur** : la carte secoue la tête, le téléphone vibre, puis l'astuce apparaît. Jamais de croix rouge. Au bout de deux essais, la bonne réponse clignote : chaque phrase se termine par une réussite.
- **Récompenses** : une étoile par phrase résolue, un des 30 personnages à chaque réussite, un badge par jour de séance, un trophée par exercice au niveau 3.
- **Consignes lues à voix haute** (voix de l'appareil), sons et animations, tout se règle dans ⚙.
- **Carnet du parent** (en bas de l'accueil) : niveaux (modifiables), étapes où ça coince, jours joués, phrases les plus difficiles, choix des exercices.
- S'installe sur l'écran d'accueil d'un téléphone ou d'une tablette et fonctionne hors ligne.

Les progrès restent dans le navigateur de l'appareil (clés `marc.accords.*`) : aucun compte, et rien n'est envoyé sur internet.

## Fichiers

- `index.html` : toute l'appli (HTML, CSS et JavaScript, sans bibliothèque). Le haut du style est la charte commune des applis de Marc. Les phrases sont en haut du script (`VERBS` et `GROUPS`), avec leur notation expliquée en commentaire.
- `sw.js` et `manifest.webmanifest` : mode hors ligne et installation. Après une modification des fichiers de l'appli, changer la valeur de `CACHE` dans `sw.js`.
- `fonts/` : polices Fredoka et Nunito (licence SIL Open Font License, voir les fichiers `OFL-*.txt`).
- `tests/telephone.cjs` et `.github/workflows/test-telephone.yml` : après chaque mise en ligne, GitHub ouvre le site publié dans Chrome au format téléphone (7 tailles d'écran), joue une séance entière et vérifie que l'écran ne défile pas, que rien ne dépasse sur le côté et qu'il n'y a pas d'erreur dans la console. Résultat et captures dans l'onglet Actions. Lancement local : `npm install --no-save playwright && node tests/telephone.cjs http://localhost:8000/`.

# 🦷 Logan Brush Challenge by ValEM

Version mobile « clé en main » prévue pour être ouverte depuis **un seul autocollant NFC**.


## Principe du challenge

Pendant chaque brossage de 2 minutes, le site s'adresse directement à Logan.

Il choisit librement sa prestation : chanter, danser, faire du playback, mimer, improviser ou inventer autre chose. Il n'est pas obligé de chanter ni de danser. La seule règle du jeu est de faire sa prestation pendant toute la durée du brossage.


## Fonctionnement

Le même lien est utilisé toute la semaine.

Le site détecte automatiquement le jour et l'heure du téléphone et affiche :

- dimanche soir : challenge 1 ;
- lundi matin : challenge 2 ;
- lundi soir : challenge 3 ;
- mardi matin : challenge 4 ;
- mardi soir : challenge 5 ;
- mercredi matin : challenge 6 ;
- mercredi soir : challenge 7 ;
- jeudi matin : challenge 8 ;
- jeudi soir : challenge 9 ;
- vendredi matin : challenge 10 ;
- le reste du temps : « RELÂCHE ».

Le bouton vidéo permet, sur les navigateurs compatibles, d'enregistrer directement pendant 2 minutes.

Si le navigateur ne le permet pas, le site propose automatiquement d'utiliser la caméra normale du téléphone.

La vidéo n'est envoyée vers aucun serveur par ce site.

## Progression

La progression est conservée uniquement dans le navigateur du téléphone.

Elle se remet automatiquement à zéro à chaque nouvelle semaine (lundi).

## Les 10 chansons sont déjà intégrées

Les 10 liens YouTube fournis sont maintenant configurés dans `app.js`.

## Modifier une chanson plus tard

Ouvre `app.js`.

Tout en haut du fichier, tu trouveras :

```js
const challenges = [
  {
    id: 1,
    day: 0,
    period: "soir",
    title: "Chanson surprise #1",
    artist: "À choisir",
    youtube: "https://www.youtube.com/",
    tease: "Dimanche soir : on commence fort 😈"
  },
  ...
];
```

Pour chaque challenge, remplace simplement :

- `title`
- `artist`
- `youtube`
- éventuellement `tease`

Ne change pas `id`, `day` ou `period` sauf si tu veux modifier le planning.

## Mise en ligne gratuite avec GitHub Pages

1. Crée un compte sur GitHub si nécessaire.
2. Crée un nouveau dépôt, par exemple `logan-brush`.
3. Dépose à la racine :
   - `index.html`
   - `styles.css`
   - `app.js`
4. Ouvre **Settings > Pages**.
5. Dans **Build and deployment**, choisis :
   - Source : `Deploy from a branch`
   - Branch : `main`
   - Folder : `/ (root)`
6. Enregistre.
7. GitHub fournit ensuite l'adresse HTTPS de ton site.

La caméra nécessite normalement que le site soit servi en HTTPS. GitHub Pages fournit HTTPS.

## Programmer l'autocollant NFC

Avec **NFC Tools** sur Android :

1. Ouvre NFC Tools.
2. Va dans **Écrire**.
3. **Ajouter un enregistrement**.
4. Choisis **URL / URI**.
5. Colle l'adresse HTTPS du site.
6. Appuie sur **Écrire**.
7. Approche le téléphone de l'autocollant NFC.

Tu ne dois programmer le NFC qu'une fois.

Si tu modifies ensuite les chansons sur le site sans changer son adresse, le NFC reste valable.

## Partage WhatsApp

Le bouton **« ➡️ Envoyer la vidéo »** utilise le menu de partage du téléphone.

Sur Android compatible :

1. Logan touche le bouton.
2. Il choisit WhatsApp.
3. Il choisit le contact de sa maman.
4. Il confirme l'envoi.

Le site ne choisit pas automatiquement le destinataire et n'envoie rien sans son action.

## Fichiers

- `index.html` : structure de la page et textes visibles.
- `styles.css` : apparence.
- `app.js` : planning, chansons, caméra, chrono, partage et progression.

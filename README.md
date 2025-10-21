# SilverLink Shopify Theme

SilverLink est un thème Shopify Online Store 2.0 premium conçu pour les boutiques de produits connectés destinés aux seniors. Il combine une esthétique minimaliste inspirée de l'univers Apple, des animations 3D fluides et des fonctionnalités d'accessibilité avancées.

## Installation

1. **Via archive ZIP**
   - Téléchargez ou exportez ce dépôt en archive ZIP.
   - Dans l'admin Shopify, ouvrez **Boutique en ligne > Thèmes > Ajouter un thème > Télécharger un thème**.
   - Importez l'archive ZIP et publiez le thème SilverLink.

2. **Via Shopify CLI**
   - Assurez-vous d'avoir [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) installé.
   - Clonez ce dépôt :
     ```bash
     git clone <votre_repo> silverlink-theme
     cd silverlink-theme
     ```
   - Connectez-vous à votre boutique :
     ```bash
     shopify login --store votre-boutique.myshopify.com
     ```
   - Servez le thème en local :
     ```bash
     shopify theme dev
     ```
   - Pour pousser vos modifications :
     ```bash
     shopify theme push
     ```

## Paramétrage

### Accessibilité
- Activez les contrôles d'accessibilité dans **Thème > Personnaliser > Paramètres du thème > Accessibilité**.
- Les options incluent la taille de police par défaut, les boutons A+/A–, le mode contraste élevé et le mode Dyslexie (utilise la police OpenDyslexic, chargée localement).

### Couleurs et branding
- Dans **Paramètres > Branding**, définissez le logo, la couleur d'accent (par défaut `#2D6CDF`), la couleur de fond, le rayon des bords et les paramètres du mode sombre.

### Légales et conformité
- Renseignez les URLs des pages Mentions légales, CGV, Confidentialité et Retours dans **Paramètres > Légal**.
- Modifiez le texte d'avertissement "Ce produit n'est pas un dispositif médical" si nécessaire.

### Contenu d'aide
- Les coordonnées de support (téléphone, email, horaires) se trouvent dans les paramètres de la section **footer-legal.liquid** et dans la page d'aide (template `page.json`).
- Les textes de la barre de rassurance, du bloc assistance et de la FAQ sont configurables via l'éditeur de thème (sections correspondantes).

## Contenu de démonstration

Le thème inclut 6 produits de démonstration configurés dans les sections :
- SafeWalk Pro (canne intelligente)
- GuardSense (détecteur de chute)
- MemoDose (pilulier connecté)
- CareWatch (montre d'alerte)
- EasyDoor (sonnette vidéo)
- CalmLight (lampe connectée)

Chaque fiche produit présente une description courte, des puces d'avantages, un tableau de caractéristiques et des extraits schema.org.

## PWA & Performances
- `assets/manifest.json` et `assets/sw.js` fournissent une base PWA (cache statique, icônes).
- Les scripts utilisent `IntersectionObserver`, `Three.js` et `GSAP` pour des animations fluides, avec des garde-fous pour désactiver les effets lourds sur les appareils peu puissants.
- Les images utilisent `loading="lazy"` et des tailles responsives.

## Check-list de mise en production

1. **SEO** : vérifier les balises meta par défaut, définir le titre et la description dans les paramètres du thème, mettre à jour l'image sociale.
2. **Accessibilité** : tester la navigation clavier, activer/valider les modes contraste élevé et dyslexie, vérifier la lisibilité des boutons.
3. **Performances** : exécuter Lighthouse (mobile & desktop), compresser les images produits, vérifier le budget JS (<3 Mo).
4. **Apps** : connecter les apps Shopify nécessaires (analytique, avis) en respectant le consentement RGPD.
5. **Contenu** : remplacer les images placeholders et vidéos par vos médias, mettre à jour les informations d'assistance.


# JS13k - 2024 - **Match 13s 🕐**

> Par Thomas Le Goff

## Credits

- [LittleJS 🚂](https://github.com/KilledByAPixel/LittleJS)
- [Assets](https://opengameart.org/content/match-3-assets)

## **Concept de Base**
"Match 13s" est un jeu de match-3 inspiré de "Jewel Quest" avec une mécanique unique liée au chiffre 13. 

Le joueur doit effectuer des mises sur le nombre de combos qu'il peut réaliser dans un temps imparti, avec des power-ups qui s'empilent et doivent être exécutés dans l'ordre d'apparition, incluant des effets positifs et négatifs.

## **Mécaniques de Jeu**

### **1. Mise et Réalisation des Combos**
- **Boucle de jeu** : chaque partie se compose d'un enchainement de deux phases :
    - **Choix de la Mise :** Le joueur parie sur le nombre de combos qu'il peut réaliser dans un temps imparti.
    - **Réalisation des Combos :** Le joueur doit atteindre sa mise dans le temps donné. S'il réussit, une récompense spéciale est déclenchée; sinon, il est pénalisé.
- **Temps Imparti par Niveau de Difficulté :**
  - **Facile :** 18 secondes pour réaliser la mise.
  - **Moyen :** 13 secondes pour réaliser la mise.
  - **Difficile :** 10 secondes pour réaliser la mise.

### **2. Anticipation des Pièces**
- **Aperçu des Prochaines Pièces :** Affichage des 3 à 5 prochaines gemmes qui vont tomber, permettant une meilleure planification des mouvements.
- **Power-up "Prédiction" :** Permet de voir toutes les pièces qui vont tomber pendant une période limitée.
- **Indicateurs de Gravité :** Flèches ou lumières indiquant où et quelles gemmes tomberont, aidant à la gestion des combos.
- **Barre de Prévisualisation :** Montre la prochaine ligne de gemmes avant qu'elles ne tombent, pour un ajustement rapide.

### **3. Power-ups**
Les power-ups s'empilent en bas de l'écran et doivent être utilisés dans l'ordre d'apparition. Certains ont des effets négatifs, ce qui oblige le joueur à bien planifier leur utilisation.

#### **Propositions de Power-ups (par ChatGPT) :**
- **Thirteenth Hour (La Treizième Heure) :** Ralentit le temps pendant 13 secondes.
- **Lucky 13 (Le Coup de Chance) :** Convertit 13 gemmes aléatoires en gemmes spéciales.
- **Hexed Tiles (Tuiles Enchantées) :** 13 tuiles deviennent indestructibles pendant 13 mouvements.
- **Thirteen Strike (Frappe des 13) :** Détruit exactement 13 tuiles sélectionnées par le joueur.

### **4. Obtention des Power-ups**
- **Collecte Pendant le Jeu :** Les power-ups peuvent apparaître comme des récompenses après avoir réalisé des combos particulièrement réussis ou des défis spécifiques. Ils peuvent également être trouvés en détruisant des gemmes spéciales ou des objets cachés sur le plateau.
- **Achats In-Game :** Les power-ups peuvent être achetés avec des crédits du jeu ou des pièces que le joueur gagne en jouant. Ces crédits peuvent être accumulés en réussissant des niveaux ou en accomplissant des missions spéciales.
- **Défis et Récompenses :** Certains power-ups sont débloqués en réussissant des défis ou des missions quotidiennes. Ces défis peuvent inclure des objectifs comme réaliser un certain nombre de combos ou accumuler un score spécifique.
- **Événements Spéciaux :** Des power-ups exclusifs peuvent être offerts lors d'événements spéciaux ou de promotions limitées dans le jeu, offrant au joueur des opportunités uniques pour acquérir des capacités puissantes ou rares.

### **5. Gestion des Power-ups**
- **Empilement et Ordre d'Exécution :** Les power-ups s'accumulent en bas de l'écran. Le joueur doit les activer dans l'ordre d'apparition, ce qui inclut des effets négatifs.
- **Stratégie et Tension :** Le joueur doit gérer la contrainte d'activer des power-ups à effet négatif tout en optimisant les power-ups positifs pour maximiser son score.
- **Variabilité et Récompenses :** Les power-ups négatifs augmentent le challenge et la rejouabilité. Les récompenses sont ajustées en fonction du risque pris par le joueur.

# sam-ihm

##Présentation générale

Les principales fonctionnalités apportées par l’interface développée sont les suivantes :

* Interactions avec le solveur facilitées
* Conception des contraintes guidée et cadrée
* Validation itérative et automatique du jeu de contraintes
* Résultats du solveur en quasi temps réel sur l’interface
* Possibilité d’ouvrir SAM vers l’extérieur ou de l’utiliser comme un service

Afin de permettre ces améliorations, une architecture de type client-serveur a été mise en place.

SAM a donc été transformé en serveur en utilisant la librairie python Flask, permettant de lancer simplement une exécution du solveur en envoyant une requête HTTP contenant toutes les informations nécessaires, et de retourner le résultat de son exécution en JSON suivant le même canal. Cette requête doit donc contenir le fichier de contraintes, le modèle du cube et les différentes instances de chaque dimension. Cette architecture est donc qualifiable de “stateless”, le serveur ne possédant aucune donnée et servant juste à exécuter une tâche en fonction des données qu’on lui fournit en entrée.

Le client web a été développé en JavaScript en utilisant le framework open source AngularJS. Ce framework facilite et structure grandement le développement d’applications web en imposant un modèle MVC et en gérant automatiquement la liaison entre la vue et le modèle. En effet, il détecte tout changement dans la vue et met à jour instantanément les éléments du modèle associés. De la même façon, si le modèle venait à changer programmatiquement, les éléments de la vue correspondants seront mis à jour automatiquement. Enfin, le framework apporte un peu de structure bienvenue au JavaScript, qui est un langage très libre, ouvert, voire brouillon de l’avis de certains.

##Organisation des fichiers du projet

###Racine du dossier :

Le dossier bower_components contient toutes les librairies externes importées via bower, un outil de gestion de dépendances facilitant leur téléchargement et leur mise à jour. Cela inclut :

* Angular lui même
* Bootstrap, une librairie de composants et de feuilles de styles facilitant le design, proposée par twitter
* JQuery

Le dossier css contient la feuille de style personnalisée que j’ai créée afin de compléter bootstrap.

Le dossier dist contient les librairies importées manuellement sans utiliser bower pour diverses raisons. Cela inclut :

* La libraire aidant la partie Upload de l’interface
* La librairie contenant le code de base du composant “arbre hiérarchique” utilisé à de multiple reprises dans la partie Constraint Builder de l’interface.
* Une librairie permettant de lire facilement des fichiers CSV

Le dossier fonts contient quelques éléments de graphismes.

Le dossier js contient toute la logique de l’application, à savoir les différents contrôleurs. Ce dossier sera décrit plus avant dans une partie dédiée.

Le fichier constraint-builder.html contient toute la partie HTML de l’onglet Constraint Builder de l’interface, à savoir les squelettes et positions des différents arbres hiérarchiques, les titres et autres champs et boutons. De la même façon, le fichier file-uploader.html contient tout le template HTML de l’onglet Upload de l’interface.

Le fichier results.html contient seulement la liste des résultats dans l'onglet Results de l'interface

Le fichier index.html est le fichier racine de la page affichée. C’est dans celui-ci que l’on retrouvera toutes les inclusions de dépendances nécessaires à l’application, ainsi que la barre de menu en haut de page, le système d’onglet et des liens vers le constraint builder, le file uploader et les résultats.

###Dossier JS :

Dans le dossier js, le fichier app.js est le contrôleur principal de l’application. Il contient notamment le service ”builderService” permettant de partager certaines données entre les différents contrôleurs, qui est le ciment de l’application.

Le fichier aggregDistribController.js contient le contrôleur qui gère la partie d’ajout d’aggregations et de distributions aux contraintes.

Le fichier builderController.js contient le contrôleur qui gère la construction de la contrainte globalement, et qui envoie la requête POST au serveur une fois celle-ci validée.

Le fichier constraintsDisplayController.js contient le contrôleur qui gère l’affichage du jeu de contraintes à chaque ajout de contrainte, suppression de contrainte et chargement de fichier de contraintes.

Le fichier treeController.js contient le contrôleur qui gère tout l’arbre de mesures et de dimensions. Ceci inclue les algorithmes de parsing et processing des fichiers uploadés afin d’en extraire des valeurs pour les dimensions et mesures, et de les formatter afin de pouvoir être affichées sous forme d’arbres.

Le fichier uploadControllers.js contient les 3 contrôleurs qui gèrent l’upload des fichiers de contraintes, de modèle de cube et de données CSV. 

Le fichier resultsController.js contient le contrôleur dont le rôle est de formatter et afficher les résultats retournés par le solveur après chaque éxecution. 

![bigBanner](https://github.com/sebyldino/Where-Is-It/assets/17813720/42cbd22b-3038-4886-9b3a-7e635d3b064d)


Where Is It? est une application web simple et intuitive conçue pour vous aider à organiser et gérer efficacement des objets, caisses, emplacements, et plus encore. Idéale pour une utilisation domestique ou dans un petit bureau, cette application vous permet de savoir en un clin d'œil où se trouvent vos possessions importantes.

Fonctionnalités principales :
Gestion des objets : Ajoutez et suivez vos objets avec des détails comme leur nom, description, lieu actuel, et même une photo.
Localisation rapide : Recherchez facilement un objet pour savoir dans quel emplacement ou caisse il se trouve.
Flexibilité d'ajout : Possibilité d'ajouter de nouveaux lieux, emplacements, caisses et objets selon vos besoins.
Interface conviviale : Une interface utilisateur intuitive pour une navigation simple et une expérience utilisateur optimisée.

# Demo

https://github.com/sebyldino/Where-Is-It/assets/17813720/ea996e85-115f-4119-81d6-546e5691a862






# Matériel

Pour ma part j'ai choisi:
- Raspberry Pi 4 2Go
- Carte SD 64Go (plus elle est grande, plus grande sera la capacité de la base de données)

Mais un NAS, une VM, un linux ou autre peut faire l'affaire.






# Installation

## 1- Créer sa carte sd avec Raspberry Pi imager (si utilisation d'un Raspberry Pi) 
Créez vous une carte SD avec Raspberry Pi imager, la version lite du dernier OS stable (donc sans desktop environnement) suffit.
Avant de flasher, modifier les paramètres WiFi pour renseigner votre connexion wifi, et activer le ssh avec en défnissant un nom d'utilisateur et un mot de passe.



## 2- Connexion ssh
Connectez vous en ssh depuis un terminal (terminal sous mac ou powershell sur windows)
```
ssh user@adresse_ip_rpi
```

```user``` = le nom d'utilisateur que vous avez renseigner lors de la config ssh dans Raspberry Pi imager
```address_ip_rpi``` = l'adresse ip de votre raspberry
Il vous sera ensuite demandé de rensigné le mot de passe lui aussi défini lors de la config ssh.

normalement vous aurez quelque chose comme:
```user@raspberrypi:~ $ ```

On met à jour la liste des paquets disponibles:
```
sudo apt update
```

On met à jour les paquets déjà installés:
```
sudo apt upgrade
```





## 3- Installer apache2, mysql, phpmyadmin
- Installer apache2
  Toujours en ssh:
```
sudo apt install apache2
``` 

- Installer les utilitaires apache.
  (Vous aurez peut être un message comme quoi c'est déjà installé car il probablement inclus lors de l'installation d'apache2):
```
sudo apt install apache2-utils
``` 

- Installer php-mysql:
```
sudo apt install php libapache2-mod-php php-mysql
```
Il vous sera demandé de créer un mot de passe pour l'utilisateur ```root``` (renseigné lors de la création de votre carte SD) Ce seront vos identifiants de connexion à phpmyadmin plus loin.

- Installer phpmyadmin:
```
sudo apt install phpmyadmin
``` 





## 4- Configuration d'Apache2 pour inclure phpMyAdmin :

Par défaut, phpMyAdmin crée un fichier de configuration pour Apache2. Cependant, vous devez vous assurer que ce fichier est inclus dans la configuration d'Apache2. Vous pouvez le faire en créant un lien symbolique dans le répertoire de configuration d'Apache2.

```
sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
```


Après avoir configuré les liens symboliques, redémarrez Apache2 pour appliquer les modifications:
```
sudo systemctl restart apache2
```






## 5- Configuration de phpMyAdmin

- Configuration d'une base de donnée pour votre inventaire
  
   Dans un premier temps, il est fortement recommander de créé un utilisateur sans privilège d'administration pour Where Is It?, ceci afin de sécuriser un peu
   plus la base de données. Pour ce faire, dans phpmyadmin, cliquez sur 'Comptes utilisateurs' en haut, puis 'Ajouter un compte d'utilisateur'.
   Renseignez un Nom d'utilisateur, un mot de passe.
   Dans l'encart 'Privilèges globaux' cochez uniquement toutes les cases de la catégories 'Données' (SELECT, INSERT, UPDATE, DELETE et FILE) puis enregistrez.
   Notez ces identifiants dans un coin, vous en aurez besoin plus tard.


- Accéder à phpMyAdmin
  Ouvrez votre navigateur web et accédez à phpMyAdmin en utilisant l'adresse IP de votre Raspberry Pi ou son nom d'hôte :
  ```http://<votre_IP>/phpmyadmin```
  Vous devriez voir l'interface de connexion de phpMyAdmin. 
  


- (OPTIONNEL) Vous pouvez restreindre l'accès à phpMyAdmin pour des raisons de sécurité. (Si vous ne le faites pas, vous pourrez également ignorer l'étape "8- Sécuriser l'accès apache")
  Une méthode courante consiste à utiliser les fichiers .htaccess pour demander une authentification supplémentaire.

  Créez un fichier .htaccess dans le répertoire de phpMyAdmin :

  ```
  sudo nano /usr/share/phpmyadmin/.htaccess
  ```

  Si vous avez le message 'nano' command not found, vous devez installer nano qui est un éditeur de texte:
  ```
  sudo apt install nano
  ```
  Puis reprenez la commande précédente.

  Ajoutez les lignes suivantes dans le fichier :
  ```
  AuthType Basic
  AuthName "Restricted Access"
  AuthUserFile /etc/phpmyadmin/.htpasswd
  Require valid-user
  ```

  Créez ensuite le fichier .htpasswd et ajoutez un utilisateur :
  ```
  sudo htpasswd -c /etc/phpmyadmin/.htpasswd username
  ```
  Remplacez ```username``` par le nom d'utilisateur de votre choix. Vous serez invité à entrer un mot de passe.
  Désormais si vous vous rendez sur ```http://<votre_IP>/phpmyadmin```, il vous sera demandé les informations d'identification pour vous connecter.







## 6- Créer votre base de donnée
Revenez à l'accueil de phpmyadmin (en cliquant sur le logo phpMyAdmin en haut à gauche) puis en haut, cliquez sur Base de données.
Dans l'encart 'Création d'une base de données' rensignez un nom pour votre base de donnée. Pas d'espace, si vous souhaitez mettre 'inventaire perso' par exemple, 
vous devrez renseigner 'inventaire_perso'.

Une fois créée, elle apparaîtra dans la barre latérale gauche, cliquez dessus et faites 'Nouvelle table' puis renseignez chaque table comme sur les screenshots (qui sont dans le dossier 'phpmyadmin-tables' qui est avec le code Where Is It?).
Si vous avez trop de ligne par rapport à ce que vous avez à renseigner, en haut dans 'Ajouter' entrez '-1' et executer. Cela supprimera des lignes.

Ajouter également les relations pour chaque table. En cliquant sur une table puis 'Structure de table' puis 'Vue relationnelle'.

RESPECTER BIEN LES NOMS ET PARAMÈTRES AINSI QUE LES RELATIONS DE CHAQUE TABLE!

NOTES:

Pour la colonne ```Null = oui```, il faut cocher la case ```Null```

Pour la colonne ```Extra = AUTO_INCREMENT```il faut cocher la case ```A.I```




## 7- Installer TinyFileManager
Récupérer l'archive:
```
wget https://github.com/prasathmani/tinyfilemanager/archive/refs/heads/master.zip
```

Décompressez la:
```
unzip master.zip
```

Déplacer les fichiers de TinyFileManager vers le répertoire web d'Apache :
```
sudo mv tinyfilemanager-master /var/www/html/tinyfilemanager
```


Configurer apache pour donner les permissions nécessaires :
```
sudo chown -R www-data:www-data /var/www/html/tinyfilemanager
sudo chmod -R 755 /var/www/html/tinyfilemanager
```

Ouvrir votre navigateur web et accéder à TinyFileManager :
```http://<IP-de-votre-Raspberry-Pi>/tinyfilemanager/tinyfilemanager.php```

Par défaut, les identifiants de connexion sont :

Nom d'utilisateur : ```admin```

Mot de passe : ```admin@123```

Il est fortement recommandé de changer le mot de passe par défaut.

Éditer le fichier tinyfilemanager.php pour configurer les identifiants :
```
sudo nano /var/www/html/tinyfilemanager/tinyfilemanager.php
```

Recherchez la ligne suivante et modifiez les valeurs :
```
// Default user and password
$auth_users = array(
    'admin' => '$2y$10$Q11gL79y5/0u.zO/5F7xJeMOETo46M6ZB9qW6K5EZSD/TGpZ6dl7e', //admin@123
    // 'username' => 'password',
);
```
Vous pouvez utiliser un outil en ligne pour générer un hash bcrypt pour votre nouveau mot de passe et le remplacer dans le fichier.

Redémarrer apache:
```
sudo systemctl restart apache2
```





## 8- Sécuriser l'accès apache
- Vous pouvez sécuriser l'accès à apache et à l'ensemble du répertoire html d'apache. 
  Pour ce faire éditer le fichier ```/etc/apache2/sites-available/000-default.conf```:

  ```
  sudo nano /etc/apache2/sites-available/000-default.conf
  ```

  et ajoutez:
    ```
    # Répertoire principal protégé
    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride None
        AuthType Basic
        AuthName "Restricted Access"
        AuthUserFile /etc/phpmyadmin/.htpasswd
        Require valid-user
    </Directory>

    # Exclusion spécifique pour le répertoire wit
    <Directory /var/www/html/wit>
        Options Indexes FollowSymLinks
        AllowOverride None

        # Protéger le répertoire wit avec une authentification
        AuthType Basic
        AuthName "Restricted Access"
        AuthUserFile /etc/phpmyadmin/.htpasswd
        Require valid-user

        # Exclusion pour manifest.json
        <Files "manifest.json">
            Require all granted
        </Files>

        # Exclusion pour les fichiers d'icône
        <FilesMatch "\.(png|ico|jpg|jpeg|gif)$">
            Require all granted
        </FilesMatch>

        # Exclusion pour le service worker
        <Files "service-worker.js">
            Require all granted
        </Files>
    ```
    Redémarrer apache:
    ```
    sudo systemctl restart apache2
    ```


- Installez fail2ban qui est un outil de sécurité qui aide à protéger les serveurs contre les attaques par force brute en bloquant les adresses IP qui montrent un comportement 
  malveillant:
  ```sudo apt install fail2ban```

   Éditez le fichier de configuration:
   ```
   sudo nano /etc/fail2ban/jail.local
   ```

   et ajoutez:
   ```
   [apache-auth]
   enabled  = true
   port     = http,https
   filter   = apache-auth
   logpath  = /var/log/apache*/*error.log
   maxretry = 3
   ```

   Redémarrez fail2ban:
   ```
   sudo systemctl restart fail2ban
  ```




## 9- Installer Where Is It?
Récupérer la dernière version de Where Is It? et depuis TinyFileManager, ajouter l'ensemble des fichiers dans un dossier 'wit'

Vous devriez avoir une structure comme ceci:
```
wit/
|
|  .css/
|  |  .style.css
|
|  .img/
|  |  ..apple-icon.png
|  |  ..banner.png
|  |  ...
|
|  .js/
|  |  ..ajouter-caisse.js
|  |  ..ajouter-emplacement.js
|  |  ...
|
|  .pages/
|  |  ..ajouter-caisse.html
|  |  ..ajouter-emplacement.html
|  |  ...
|
|  .php/
|  |  ..ajouter-caisse.php
|  |  ..ajouter-emplacement.php
|  |  ...
|
|  .uploads/
|  |  ..info.txt
|
|  .manifest.json
|  .service-worker.js

index.html (page par défaut apache)
tinyfilemanager.php
```


## 10- Modifier identifiants.php
Vous devez modifier le fichier 'config.php' qui se trouve dans le dossier 'php' comme ceci:
``` 
<?php
$servername = "localhost"; // si vous avez installé l'ensemble sous docker: nom du service Docker, pas localhost
$username = "user"; // Le nom d'utilisateur renseigné pour accéder à la base de donnée (celui créé sans privilège administrateur)
$password = "password"; // Le mot de passe de cet utilisateur
$dbname = "database"; // Le nom de votre base de donnée
$uploadFolderPath = "../uploads/"; // Le nom du dossier créé au même niveau que les dossiers css, js, html... Il sera utilier pour stocker les photos de votre base de données. Par défaut c'est le dossier 'uploads'
?>
```

## 11- Lancer Where Is It?
Dans votre navigateur, tapez:
```http://adresse_ip/wit/pages/index.html```
Si vous avez fais l'étape pour sécuriser apache, vous serez invité à vous identifier.

Vous avez désormais une appli/site pour gérer votre propre inventaire.
Where Is It? est une PWA, c'est a dire qu'elle peut être installer comme une application store, il suffit simplement de l'ajouter à l'écran d'accueil. 
Elle se comportera ensuite en plein écran comme une application.

Des idées d'améliorations, des erreurs, ...? Je reste à l'écoute.




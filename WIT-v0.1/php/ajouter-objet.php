<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'config.php';

//// Récupérer les données du formulaire
$nomObjet = $_POST['nomObjet'];
$lieuObjet = $_POST['lieuObjet'];
$emplacementObjet = $_POST['emplacementObjet']=== "null" ? null : $_POST['emplacementObjet'];
$caisseObjet = $_POST['caisseObjet']=== "null" ? null : $_POST['caisseObjet'];
$themeObjet = $_POST['themeObjet'];
$quantiteObjet = $_POST['quantiteObjet'];
$descriptionObjet = $_POST['descriptionObjet'];

$nouveauLieu = isset($_POST['nouveauLieu']) ? $_POST['nouveauLieu'] : null;
$nouvelEmplacement = isset($_POST['nouvelEmplacement']) ? $_POST['nouvelEmplacement'] : null;
$nouvelleCaisse = isset($_POST['nouvelleCaisse']) ? $_POST['nouvelleCaisse'] : null;
$nouveauTheme = isset($_POST['nouveauTheme']) ? $_POST['nouveauTheme'] : null;


//// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

//// Vérifier la connexion
if ($conn->connect_error) {
    http_response_code(500);
    echo 'Erreur de connexion à la base de données: ' . $conn->connect_error;
    exit();
}


//// Vérifier si un objet avec le même nom existe déjà
$stmt = $conn->prepare("SELECT id FROM objets WHERE nom = ?");
if (!$stmt) {
    http_response_code(500);
    echo 'Erreur lors de la préparation de la requête: ' . $conn->error;
    exit();
}
$stmt->bind_param("s", $nomObjet);
if (!$stmt->execute()) {
    http_response_code(500);
    echo 'Erreur lors de l\'exécution de la requête: ' . $stmt->error;
    exit();
}
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    http_response_code(400);
    echo 'Un objet avec ce nom existe déjà.';
    exit();
}
$stmt->close();


//// Ajouter un nouveau lieu si nécessaire et s'il n'existe pas déjà
if ($lieuObjet === 'nouveau_lieu' && !empty($nouveauLieu)) {
    $stmt = $conn->prepare("SELECT id FROM lieux WHERE nom = ?");
    if (!$stmt) {
        http_response_code(500);
        echo 'Erreur lors de la préparation de la requête: ' . $conn->error;
        exit();
    }
    $stmt->bind_param("s", $nouveauLieu);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo 'Erreur lors de l\'exécution de la requête: ' . $stmt->error;
        exit();
    }
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        http_response_code(400);
        echo 'Le lieu spécifié existe déjà.';
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO lieux (nom) VALUES (?)");
    if (!$stmt) {
        http_response_code(500);
        echo 'Erreur lors de la préparation de la requête: ' . $conn->error;
        exit();
    }
    $stmt->bind_param("s", $nouveauLieu);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo 'Erreur lors de l\'exécution de la requête: ' . $stmt->error;
        exit();
    }
    $lieuObjet = $stmt->insert_id;
    $stmt->close();
}

//// Ajouter un nouvel emplacement si nécessaire et s'il n'existe pas déjà dans le lieu spécifié
if ($emplacementObjet === 'nouvel_emplacement' && !empty($nouvelEmplacement)) {
    $stmt = $conn->prepare("SELECT id FROM emplacements WHERE nom = ? AND lieu_id = ?");
    if (!$stmt) {
        http_response_code(500);
        echo 'Erreur lors de la préparation de la requête: ' . $conn->error;
        exit();
    }
    $stmt->bind_param("si", $nouvelEmplacement, $lieuObjet);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo 'Erreur lors de l\'exécution de la requête: ' . $stmt->error;
        exit();
    }
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        http_response_code(400);
        echo 'L\'emplacement spécifié existe déjà dans ce lieu.';
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO emplacements (nom, lieu_id) VALUES (?, ?)");
    if (!$stmt) {
        http_response_code(500);
        echo 'Erreur lors de la préparation de la requête: ' . $conn->error;
        exit();
    }
    $stmt->bind_param("si", $nouvelEmplacement, $lieuObjet);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo 'Erreur lors de l\'exécution de la requête: ' . $stmt->error;
        exit();
    }
    $emplacementObjet = $stmt->insert_id;
    $stmt->close();
}

//// Ajouter une nouvelle caisse si nécessaire et si elle n'existe pas déjà dans le lieu spécifié
if ($caisseObjet === 'nouvelle_caisse' && !empty($nouvelleCaisse)) {
    $stmt = $conn->prepare("SELECT id FROM caisses WHERE nom = ? AND lieu_id = ?");
    if (!$stmt) {
        http_response_code(500);
        echo 'Erreur lors de la préparation de la requête: ' . $conn->error;
        exit();
    }
    $stmt->bind_param("si", $nouvelleCaisse, $lieuObjet);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo 'Erreur lors de l\'exécution de la requête: ' . $stmt->error;
        exit();
    }
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        http_response_code(400);
        echo 'La caisse spécifiée existe déjà dans ce lieu.';
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO caisses (nom, lieu_id, emplacement_id) VALUES (?, ?, ?)");
    if (!$stmt) {
        http_response_code(500);
        echo 'Erreur lors de la préparation de la requête: ' . $conn->error;
        exit();
    }
    $stmt->bind_param("sii", $nouvelleCaisse, $lieuObjet, $emplacementObjet);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo 'Erreur lors de l\'exécution de la requête: ' . $stmt->error;
        exit();
    }
    $caisseObjet = $stmt->insert_id;
    $stmt->close();
}

//// Ajouter un nouveau thème si nécessaire et s'il n'existe pas déjà
if ($themeObjet === 'nouveau_theme' && !empty($nouveauTheme)) {
    $stmt = $conn->prepare("SELECT id FROM themes WHERE nom = ?");
    if (!$stmt) {
        http_response_code(500);
        echo 'Erreur lors de la préparation de la requête: ' . $conn->error;
        exit();
    }
    $stmt->bind_param("s", $nouveauTheme);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo 'Erreur lors de l\'exécution de la requête: ' . $stmt->error;
        exit();
    }
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        http_response_code(400);
        echo 'Le thème spécifié existe déjà.';
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO themes (nom) VALUES (?)");
    if (!$stmt) {
        http_response_code(500);
        echo 'Erreur lors de la préparation de la requête: ' . $conn->error;
        exit();
    }
    $stmt->bind_param("s", $nouveauTheme);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo 'Erreur lors de l\'exécution de la requête: ' . $stmt->error;
        exit();
    }
    $themeObjet = $stmt->insert_id;
    $stmt->close();
}



//// Récupérer et traiter la photo
$photoObjet = $_FILES['photoObjet'] ?? null;
$photoPath = null;

if ($photoObjet && $photoObjet['error'] === UPLOAD_ERR_OK) {
    $uploadDir = $uploadFolderPath; //$uploadFolderPath est défini dans config.php

    // Supprimer les espaces du nom avant de générer le nom de fichier
    $nomSansEspaces = str_replace(' ', '', $nomObjet);
    // Générer un nom de fichier unique avec timestamp
    $extension = pathinfo($photoObjet['name'], PATHINFO_EXTENSION);
    $newFileName = $nomSansEspaces . '_' . time() . '.' . $extension;
    $uploadFile = $uploadDir . $newFileName;

    // Charger l'image originale en fonction de son type
    switch ($photoObjet['type']) {
        case 'image/jpeg':
            $source = imagecreatefromjpeg($photoObjet['tmp_name']);
            break;
        case 'image/png':
            $source = imagecreatefrompng($photoObjet['tmp_name']);
            break;
        case 'image/gif':
            $source = imagecreatefromgif($photoObjet['tmp_name']);
            break;
        default:
            http_response_code(400);
            echo 'Type de fichier image non pris en charge.';
            exit();
    }

    // Récupérer les informations EXIF de l'image
    $exif = exif_read_data($photoObjet['tmp_name']);

    // Vérifier l'orientation et ajuster si nécessaire
    if (!empty($exif['Orientation'])) {
        $orientation = $exif['Orientation'];
        switch ($orientation) {
            case 3:
                $source = imagerotate($source, 180, 0); // Rotate 180
                break;
            case 6:
                $source = imagerotate($source, -90, 0); // Rotate 90 CW
                break;
            case 8:
                $source = imagerotate($source, 90, 0); // Rotate 90 CCW
                break;
            // Add more cases as needed for other orientations
        }
    }

    // Redimensionner et sauvegarder l'image
    $width = imagesx($source);
    $height = imagesy($source);
    $maxWidth = 800; // Largeur maximale souhaitée
    $maxHeight = 600; // Hauteur maximale souhaitée

    if ($width > $maxWidth || $height > $maxHeight) {
        $ratio = $width / $height;

        if ($width / $maxWidth > $height / $maxHeight) {
            $newWidth = $maxWidth;
            $newHeight = $maxWidth / $ratio;
        } else {
            $newHeight = $maxHeight;
            $newWidth = $maxHeight * $ratio;
        }

        // Créer une nouvelle image redimensionnée
        $newImage = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($newImage, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        // Enregistrer l'image redimensionnée
        switch ($photoObjet['type']) {
            case 'image/jpeg':
                imagejpeg($newImage, $uploadFile, 90); // Qualité de 90%
                break;
            case 'image/png':
                imagepng($newImage, $uploadFile);
                break;
            case 'image/gif':
                imagegif($newImage, $uploadFile);
                break;
        }

        // Libérer la mémoire
        imagedestroy($newImage);
    } else {
        // Si l'image n'a pas besoin d'être redimensionnée
        if (!move_uploaded_file($photoObjet['tmp_name'], $uploadFile)) {
            http_response_code(500);
            echo 'Erreur lors du téléchargement de la photo.';
            exit();
        }
    }

    // Libérer la mémoire de l'image originale
    imagedestroy($source);

    // Définir le chemin de la photo pour l'insertion en base de données
    $photoPath = $newFileName;
}




//// Ajouter le nouvel objet

if ($emplacementObjet !== 'null' && $caisseObjet !== 'null'){
    $stmt = $conn->prepare("INSERT INTO objets (nom, lieu_id, emplacement_id, caisse_id, theme_id, quantite, description, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        http_response_code(500);
        echo 'Erreur lors de la préparation de la requête: ' . $conn->error;
        exit();
    }
    $stmt->bind_param("siiiiiss", $nomObjet, $lieuObjet, $emplacementObjet, $caisseObjet, $themeObjet, $quantiteObjet, $descriptionObjet, $photoPath);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo 'Erreur lors de l\'exécution de la requête: ' . $stmt->error;
        exit();
    }
}



else if ($emplacementObjet === 'null' && $caisseObjet !== 'null'){
    $stmt = $conn->prepare("INSERT INTO objets (nom, lieu_id, emplacement_id, caisse_id, theme_id, quantite, description, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        http_response_code(500);
        echo 'Erreur lors de la préparation de la requête: ' . $conn->error;
        exit();
    }
    $stmt->bind_param("siiiiiss", $nomObjet, $lieuObjet, NULL, $caisseObjet, $themeObjet, $quantiteObjet, $descriptionObjet, $photoPath);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo 'Erreur lors de l\'exécution de la requête: ' . $stmt->error;
        exit();
    }

}



else if($emplacementObjet !== 'null' && $caisseObjet === 'null'){
    $stmt = $conn->prepare("INSERT INTO objets (nom, lieu_id, emplacement_id, caisse_id, theme_id, quantite, description, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        http_response_code(500);
        echo 'Erreur lors de la préparation de la requête: ' . $conn->error;
        exit();
    }
    $stmt->bind_param("siiiiiss", $nomObjet, $lieuObjet, $emplacementObjet, NULL, $themeObjet, $quantiteObjet, $descriptionObjet, $photoPath);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo 'Erreur lors de l\'exécution de la requête: ' . $stmt->error;
        exit();
    }
}



else {
    $stmt = $conn->prepare("INSERT INTO objets (nom, lieu_id, emplacement_id, caisse_id, theme_id, quantite, description, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        http_response_code(500);
        echo 'Erreur lors de la préparation de la requête: ' . $conn->error;
        exit();
    }
    $stmt->bind_param("siiiiiss", $nomObjet, $lieuObjet, NULL, NULL, $themeObjet, $quantiteObjet, $descriptionObjet, $photoPath);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo 'Erreur lors de l\'exécution de la requête: ' . $stmt->error;
        exit();
    }
}




$stmt->close();
$conn->close();

http_response_code(200);
echo 'Nouvel objet ajouté avec succès.';
?>

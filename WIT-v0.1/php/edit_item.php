<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'config.php';

$id = $_POST['id'];
$table = $_POST['table'];
$nom = $_POST['nom'];
$description = isset($_POST['description']) ? $_POST['description'] : null;
$quantite = isset($_POST['quantite']) ? $_POST['quantite'] : null;
$lieu_id = isset($_POST['lieu']) ? $_POST['lieu'] : null;
$emplacement_id = isset($_POST['emplacement']) ? $_POST['emplacement'] : null;
$caisse_id = isset($_POST['caisse']) ? $_POST['caisse'] : null;
$theme_id = isset($_POST['theme']) ? $_POST['theme'] : null; 
$reset_photo = isset($_POST['reset_photo']) ? $_POST['reset_photo'] : null; 



// Convertir 'null' en réelle valeur NULL si nécessaire
if ($emplacement_id === 'null') {
    $emplacement_id = NULL;
}
if ($caisse_id === 'null'){
    $caisse_id = NULL;
}
if ($description === '' || $description === null){
    $description = NULL;
}



if (empty($id) || empty($table) || empty($nom)) {
    http_response_code(400);
    echo 'Requête invalide. Données manquantes.';
    exit();
}



$conn = new mysqli($servername, $username, $password, $dbname);



if ($conn->connect_error) {
    http_response_code(500);
    echo 'Erreur de connexion à la base de données.';
    exit();
}

////=====   OBJET
if($table === 'objets'){
    //+++ Gérer la photo s'il y en a une
    // Gérer l'upload de la photo
    $photoObjet = $_FILES['photo'] ?? null;
    $photoPath = null;

    if ($photoObjet && $photoObjet['error'] === UPLOAD_ERR_OK) {
    $uploadDir = $uploadFolderPath;

    // Supprimer les espaces du nom avant de générer le nom de fichier
    $nomSansEspaces = str_replace(' ', '', $nom);
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

        // Supprimer l'ancienne photo si elle existe
        $stmt = $conn->prepare("SELECT photo FROM objets WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->bind_result($oldPhotoPath);
        $stmt->fetch();
        if ($oldPhotoPath && file_exists($oldPhotoPath)) {
            unlink($oldPhotoPath);
        }
        $stmt->close();

        // Définir le chemin de la photo pour l'insertion en base de données
        $photoPath = $uploadFile;
    }
    //++ RESET PHOTO
    else if($reset_photo === 'oui'){
        //récupérer l'ancienne photo pour la supprimer
        // Supprimer l'ancienne photo si elle existe
        $stmt = $conn->prepare("SELECT photo FROM objets WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->bind_result($oldPhotoPath);
        $stmt->fetch();
         if ($oldPhotoPath && file_exists($oldPhotoPath)) {
          unlink($oldPhotoPath);
        }
        $stmt->close();

        //mettre à jour le path photo
        $photoPath = 'reset';
    }

    //++++ GERER LE RESTE DE L'OBJET
    $sql = "UPDATE $table SET nom = ?, description = ?, quantite = ?, lieu_id = ?, theme_id = ?, caisse_id = ?, emplacement_id = ?";
    if ($photoPath !== null && $photoPath !=='reset') {
        $sql .= ", photo = ?";
    }
    else if($photoPath === 'reset'){
        $sql .= ", photo = NULL";
    }
    $sql .= " WHERE id = ?";
    $stmt = $conn->prepare($sql);

    if ($photoPath !== null && $photoPath !=='reset') {
        $stmt->bind_param("ssiiiiisi", $nom, $description, $quantite, $lieu_id, $theme_id, $caisse_id, $emplacement_id, $photoPath, $id);
    } else {
        $stmt->bind_param("ssiiiiii", $nom, $description, $quantite, $lieu_id, $theme_id, $caisse_id, $emplacement_id, $id);
    }

    if ($stmt->execute()) {
        http_response_code(200);
        echo 'Objet mis à jour avec succès.';
    } else {
        http_response_code(500);
        echo 'Erreur lors de la mise à jour de l\'objet.';
    }
    $stmt->close();
}//END if objet






////=====   EMPLACEMENTS
else if ($table === 'emplacements') {
    $stmt = $conn->prepare("UPDATE $table SET nom = ?, lieu_id = ? WHERE id = ?");
    $stmt->bind_param("sii", $nom, $lieu_id, $id);
    if ($stmt->execute()) {
        // Réaffecter les sous-éléments (caisses et objets)
        $updateCaisses = $conn->prepare("UPDATE caisses SET lieu_id = ? WHERE emplacement_id = ?");
        $updateCaisses->bind_param("ii", $lieu_id, $id);
        $updateCaisses->execute();
        $updateCaisses->close();

        $updateObjets = $conn->prepare("UPDATE objets SET lieu_id = ? WHERE emplacement_id = ?");
        $updateObjets->bind_param("ii", $lieu_id, $id);
        $updateObjets->execute();
        $updateObjets->close();
        
        http_response_code(200);
        echo 'Emplacement et sous-éléments mis à jour avec succès.';
    } else {
        http_response_code(500);
        echo 'Erreur lors de la mise à jour de l\'emplacement.';
    }
    $stmt->close();
} 


////=====   CAISSES
else if ($table === 'caisses') {
    $stmt = $conn->prepare("UPDATE $table SET nom = ?, lieu_id = ?, emplacement_id = ? WHERE id = ?");
    $stmt->bind_param("siii", $nom, $lieu_id, $emplacement_id, $id);
    if ($stmt->execute()) {
        //+ Si le lieu_id est changé, mettre à jour tous les objets enfants
        if ($lieu_id !== null) {
            $updateObjetsLieu = $conn->prepare("UPDATE objets SET lieu_id = ? WHERE caisse_id = ?");
            $updateObjetsLieu->bind_param("ii", $lieu_id, $id);
            $updateObjetsLieu->execute();
            $updateObjetsLieu->close();
        }
        //+ Si l'emplacement_id est changé, mettre à jour tous les objets enfants
        if ($emplacement_id !== null) {
            $updateObjetsEmplacement = $conn->prepare("UPDATE objets SET emplacement_id = ? WHERE caisse_id = ?");
            $updateObjetsEmplacement->bind_param("ii", $emplacement_id, $id);
            $updateObjetsEmplacement->execute();
            $updateObjetsEmplacement->close();
        } elseif ($emplacement_id === null) {
            //+ Mettre à jour les objets ayant emplacement_id à NULL si l'emplacement_id est NULL
            $updateObjetsEmplacementNull = $conn->prepare("UPDATE objets SET emplacement_id = NULL WHERE caisse_id = ?");
            $updateObjetsEmplacementNull->bind_param("i", $id);
            $updateObjetsEmplacementNull->execute();
            $updateObjetsEmplacementNull->close();
        }
        
        http_response_code(200);
        echo 'Caisse et sous-éléments mis à jour avec succès.';
    } else {
        http_response_code(500);
        echo 'Erreur lors de la mise à jour de la caisse.';
    }
    $stmt->close();
} 

////=====   OBJETS
/*else if ($table === 'objets') {
    
}
*/

//// LES AUTRES (Lieux et thèmes)
else {
    $stmt = $conn->prepare("UPDATE $table SET nom = ? WHERE id = ?");
    $stmt->bind_param("si", $nom, $id);
    if ($stmt->execute()) {
        http_response_code(200);
        echo 'Élément mis à jour avec succès.';
    } else {
        http_response_code(500);
        echo 'Erreur lors de la mise à jour de l\'élément.';
    }
    $stmt->close();
}

$conn->close();
?>

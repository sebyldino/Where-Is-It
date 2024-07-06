<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Connexion à la base de données (vous devez inclure vos identifiants de connexion)
require 'config.php'; // Assurez-vous de sécuriser vos identifiants

// Récupérer les paramètres depuis la requête
$id = $_POST['id']; // Supposons que vous envoyez l'id via POST
$table = $_POST['table']; // Nom de la table à partir de laquelle vous souhaitez supprimer

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Erreur de connexion à la base de données : " . $conn->connect_error);
}

// Fonction pour vérifier si un élément contient des sous-éléments
function containsSubElements($conn, $table, $id) {
    switch ($table) {
        case 'lieux':
            // Vérifier si le lieu contient des caisses, des emplacements ou des objets
            $queries = [
                "SELECT COUNT(*) FROM caisses WHERE lieu_id = ?",
                "SELECT COUNT(*) FROM emplacements WHERE lieu_id = ?",
                "SELECT COUNT(*) FROM objets WHERE lieu_id = ?"
            ];
            break;
        case 'emplacements':
            // Vérifier si l'emplacement contient des caisses ou des objets
            $queries = [
                "SELECT COUNT(*) FROM caisses WHERE emplacement_id = ?",
                "SELECT COUNT(*) FROM objets WHERE emplacement_id = ?"
            ];
            break;
        case 'caisses':
            // Vérifier si la caisse contient des objets
            $queries = [
                "SELECT COUNT(*) FROM objets WHERE caisse_id = ?"
            ];
            break;
        case 'themes':
            // Vérifier si le thème est affecté à des objets
            $queries = [
                "SELECT COUNT(*) FROM objets WHERE theme_id = ?"
            ];
            break;
        default:
            return false;
    }

    foreach ($queries as $query) {
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();

        if ($count > 0) {
            return true;
        }
    }

    return false;
}

// Vérifier si l'élément contient des sous-éléments
if (containsSubElements($conn, $table, $id)) {
    echo "L'élément ne peut pas être supprimé car il contient des sous-éléments.";
    exit();
}

// Récupérer le nom du fichier photo s'il existe
$photoFileName = '';
if ($table === 'objets') {
    $stmt = $conn->prepare("SELECT photo FROM objets WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($photoFileName);
    $stmt->fetch();
    $stmt->close();
}

// Préparer la requête SQL pour supprimer l'élément
$sql = "DELETE FROM $table WHERE id = ?"; // Assurez-vous d'utiliser des requêtes préparées pour la sécurité

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id); // "i" pour un entier (id)
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo "L'élément a été supprimé avec succès.";

    // Supprimer le fichier de la photo si elle existe et n'est pas NULL
    if ($photoFileName !== '' && $photoFileName !== null) {
        $photoFilePath = $uploadFolderPath . $photoFileName; // Chemin vers le fichier photo
        if (file_exists($photoFilePath)) {
            unlink($photoFilePath); // Supprimer le fichier du système de fichiers
            echo " La photo associée a été également supprimée.";
        }
    }
} else {
    echo "Aucun élément n'a été supprimé.";
}

$stmt->close();
$conn->close();
?>

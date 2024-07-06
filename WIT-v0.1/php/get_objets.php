<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
require 'config.php';

// Récupérer les paramètres de la requête
$id = $_GET['id'] ?? null;  // Supposons que vous récupérez l'ID via GET
$table = $_GET['table'] ?? null;  // Supposons que vous récupérez la table via GET
$table_id = null;

if ($table === 'lieux') {
    $table_id = 'lieu_id';
} else if ($table === 'themes') {
    $table_id = 'theme_id';
} else if ($table === 'emplacements') {
    $table_id = 'emplacement_id';
} else if ($table === 'caisses') {
    $table_id = 'caisse_id';
} else if ($table === 'all') {
    $table_id = 'all';
} else {
    // Si aucun paramètre n'est passé, renvoyer une erreur
    echo json_encode(array('error' => "Paramètre de 'table' manquant"));
    exit();
}

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode(array('error' => 'La connexion a échoué : ' . $conn->connect_error)));
}

$objets = array();
$table_name = '';

if ($table_id === 'all') {
    // Récupérer la liste de tous les objets existants avec les noms des lieux, emplacements, caisses et thèmes
    $sql = "
        SELECT 
            objets.id, 
            objets.nom, 
            objets.photo,
            objets.quantite,
            objets.description,
            lieux.nom as lieu_nom,
            emplacements.nom as emplacement_nom,
            caisses.nom as caisse_nom,
            themes.nom as theme_nom
        FROM objets
        LEFT JOIN lieux ON objets.lieu_id = lieux.id
        LEFT JOIN emplacements ON objets.emplacement_id = emplacements.id
        LEFT JOIN caisses ON objets.caisse_id = caisses.id
        LEFT JOIN themes ON objets.theme_id = themes.id
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $row['upload_folder_path'] = $uploadFolderPath;
            $objets[] = $row;
        }
    }
} else {
    // Récupérer les objets dans le lieu, l'emplacement, la caisse ou le thème spécifié
    $sql = "
        SELECT 
            objets.id, 
            objets.nom, 
            objets.photo,
            objets.quantite,
            objets.description,
            lieux.nom as lieu_nom,
            emplacements.nom as emplacement_nom,
            caisses.nom as caisse_nom,
            themes.nom as theme_nom
        FROM objets
        LEFT JOIN lieux ON objets.lieu_id = lieux.id
        LEFT JOIN emplacements ON objets.emplacement_id = emplacements.id
        LEFT JOIN caisses ON objets.caisse_id = caisses.id
        LEFT JOIN themes ON objets.theme_id = themes.id
        WHERE objets.$table_id = $id
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $row['upload_folder_path'] = $uploadFolderPath;
            $objets[] = $row;
        }
    }

    // Récupérer le nom du lieu, de l'emplacement, de la caisse ou du thème spécifié
    $table_sql = "SELECT nom FROM $table WHERE id = $id";
    $table_result = $conn->query($table_sql);

    if ($table_result->num_rows > 0) {
        $table_name_row = $table_result->fetch_assoc();
        $table_name = $table_name_row['nom'];
    }

    // Ajouter le nom du lieu, de l'emplacement, de la caisse ou du thème aux objets
    foreach ($objets as &$objet) {
        $objet['table_name'] = $table_name;
    }
}

$conn->close();

echo json_encode($objets);
?>

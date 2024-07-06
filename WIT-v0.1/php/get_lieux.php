<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
require 'config.php';

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode(array('error' => 'La connexion a échoué : ' . $conn->connect_error)));
}

// Récupérer la liste des lieux existants avec le nombre d'emplacements, de caisses et d'objets
$sql = "
    SELECT 
        lieux.id, 
        lieux.nom,
        (SELECT COUNT(*) FROM emplacements WHERE emplacements.lieu_id = lieux.id) as nombre_emplacements,
        (SELECT COUNT(*) FROM caisses WHERE caisses.lieu_id = lieux.id) as nombre_caisses,
        (SELECT COUNT(*) FROM objets WHERE objets.lieu_id = lieux.id) as nombre_objets
    FROM lieux
";
$result = $conn->query($sql);

$lieux = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Ajouter uploadFolderPath à chaque item
        $row['upload_folder_path'] = $uploadFolderPath;
        $lieux[] = $row;
    }
}

$conn->close();

echo json_encode($lieux);
?>

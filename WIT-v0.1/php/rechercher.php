<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
require 'config.php';

// Récupérer le terme de recherche depuis la requête GET
if (isset($_GET['recherche'])) {
    $recherche = $_GET['recherche'];
} else {
    echo json_encode(array('error' => 'Terme de recherche non spécifié.'));
    exit();
}

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode(array('error' => 'La connexion a échoué : ' . $conn->connect_error)));
}

// Requête SQL pour rechercher dans toutes les tables pertinentes de la base de données
//! id, nom ressortira l'id et le nom. 
$sql = "SELECT id, nom, '' AS description FROM lieux WHERE nom LIKE '%$recherche%' 
        UNION
        SELECT id, nom, '' AS description FROM emplacements WHERE nom LIKE '%$recherche%'
        UNION
        SELECT id, nom, '' AS description FROM caisses WHERE nom LIKE '%$recherche%'
        UNION
        SELECT id, nom, '' AS description FROM objets WHERE nom LIKE '%$recherche%'
        UNION
        SELECT id, nom, description FROM objets WHERE description LIKE '%$recherche%'
        UNION
        SELECT id, nom, '' AS description FROM themes WHERE nom LIKE '%$recherche%'
        "; // Ajoutez autant de tables que nécessaire

$result = $conn->query($sql);

$results = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Ajouter le nom de la table correspondante à chaque résultat
        $row['table'] = ''; // Initialiser le nom de la table à une chaîne vide

        // Identifier la table correspondante pour chaque résultat
        if (isset($row['nom']) && !empty($row['nom'])) {
            $table = '';
            if (checkIfExistsInTable($conn, 'lieux', $row['nom'])) {
                $table = 'lieux';
            } elseif (checkIfExistsInTable($conn, 'emplacements', $row['nom'])) {
                $table = 'emplacements';
            } elseif (checkIfExistsInTable($conn, 'caisses', $row['nom'])) {
                $table = 'caisses';
            } elseif (checkIfExistsInTable($conn, 'objets', $row['nom'])) {
                $table = 'objets';
            } elseif (checkIfExistsInTable($conn, 'themes', $row['nom'])) {
                $table = 'themes';
            }
            $row['table'] = $table;
        }

        // Ajouter le résultat à votre tableau de résultats
        $results[] = $row;
    }
}

function checkIfExistsInTable($conn, $tableName, $itemName) {
    $sql = "SELECT COUNT(*) AS count FROM $tableName WHERE nom = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $itemName);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();
    return $count > 0;
}


$conn->close();

echo json_encode($results);
?>

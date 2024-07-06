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

$caisses = array();

// Vérifier si lieu_id est passé en paramètre
if (isset($_GET['lieu_id'])) {
    $lieu_id = intval($_GET['lieu_id']);
    // Récupérer la liste des caisses dans un lieu donné avec des informations supplémentaires
    $sql = "
        SELECT 
            caisses.id, 
            caisses.nom, 
            lieux.nom AS lieu_nom, 
            emplacements.nom AS emplacement_nom,
            (SELECT COUNT(*) FROM objets WHERE objets.caisse_id = caisses.id) AS nombre_objets
        FROM caisses
        LEFT JOIN lieux ON caisses.lieu_id = lieux.id
        LEFT JOIN emplacements ON caisses.emplacement_id = emplacements.id
        WHERE caisses.lieu_id = ?
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $lieu_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $caisses[] = $row;
        }
    }
    $stmt->close();
}
// Vérifier si emplacement_id est passé en paramètre
else if (isset($_GET['emplacement_id'])) {
    $emplacement_id = intval($_GET['emplacement_id']);
    // Récupérer la liste des caisses dans un emplacement donné avec des informations supplémentaires
    $sql = "
        SELECT 
            caisses.id, 
            caisses.nom, 
            lieux.nom AS lieu_nom, 
            emplacements.nom AS emplacement_nom,
            (SELECT COUNT(*) FROM objets WHERE objets.caisse_id = caisses.id) AS nombre_objets
        FROM caisses
        LEFT JOIN lieux ON caisses.lieu_id = lieux.id
        LEFT JOIN emplacements ON caisses.emplacement_id = emplacements.id
        WHERE caisses.emplacement_id = ?
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $emplacement_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $caisses[] = $row;
        }
    }
    $stmt->close();
}
// Récupérer la liste de toutes les caisses avec des informations supplémentaires
else if (isset($_GET['all_caisses'])) {
    $sql = "
        SELECT 
            caisses.id, 
            caisses.nom, 
            lieux.nom AS lieu_nom, 
            emplacements.nom AS emplacement_nom,
            (SELECT COUNT(*) FROM objets WHERE objets.caisse_id = caisses.id) AS nombre_objets
        FROM caisses
        LEFT JOIN lieux ON caisses.lieu_id = lieux.id
        LEFT JOIN emplacements ON caisses.emplacement_id = emplacements.id
    ";
    $result = $conn->query($sql);

    if ($result === false) {
        echo json_encode(array('error' => 'Erreur lors de l\'exécution de la requête: ' . $conn->error));
        $conn->close();
        exit();
    }

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $caisses[] = $row;
        }
    }
} else {
    // Si aucun paramètre n'est passé, renvoyer une erreur
    echo json_encode(array('error' => 'Paramètre lieu_id, emplacement_id ou all_caisses manquant.'));
    $conn->close();
    exit();
}

$conn->close();
echo json_encode($caisses);
?>

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

$emplacements = array();

if (isset($_GET['lieu_id'])) {
    $lieu_id = intval($_GET['lieu_id']);
    // Récupérer la liste des emplacements existants dans un lieu donné
    $sql = "
        SELECT e.id, e.nom, l.nom AS lieu_nom, 
               COUNT(DISTINCT c.id) AS nombre_caisses, 
               COUNT(DISTINCT o.id) AS nombre_objets
        FROM emplacements e
        LEFT JOIN lieux l ON e.lieu_id = l.id
        LEFT JOIN caisses c ON e.id = c.emplacement_id
        LEFT JOIN objets o ON c.id = o.caisse_id
        WHERE e.lieu_id = ?
        GROUP BY e.id, e.nom, l.nom
    ";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(array('error' => 'Erreur lors de la préparation de la requête: ' . $conn->error));
        $conn->close();
        exit();
    }
    $stmt->bind_param("i", $lieu_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $emplacements[] = $row;
        }
    }
    $stmt->close();
} else if (isset($_GET['all_emplacements'])) {
    // Récupérer la liste de tous les emplacements
    $sql = "
        SELECT e.id, e.nom, l.nom AS lieu_nom, 
               COUNT(DISTINCT c.id) AS nombre_caisses, 
               COUNT(DISTINCT o.id) AS nombre_objets
        FROM emplacements e
        LEFT JOIN lieux l ON e.lieu_id = l.id
        LEFT JOIN caisses c ON e.id = c.emplacement_id
        LEFT JOIN objets o ON c.id = o.caisse_id
        GROUP BY e.id, e.nom, l.nom
    ";
    $result = $conn->query($sql);

    if ($result === false) {
        echo json_encode(array('error' => 'Erreur lors de l\'exécution de la requête: ' . $conn->error));
        $conn->close();
        exit();
    }

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $emplacements[] = $row;
        }
    }
} else {
    // Si aucun paramètre n'est passé, renvoyer une erreur
    echo json_encode(array('error' => 'Paramètre lieux_id ou all_emplacements manquant.'));
    $conn->close();
    exit();
}

$conn->close();
echo json_encode($emplacements);
?>

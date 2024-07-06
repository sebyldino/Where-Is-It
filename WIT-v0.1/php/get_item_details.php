<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Inclure le fichier de configuration de la base de données
require 'config.php';

// Variables pour l'ID et la table de l'item
$id = $_GET['id'] ?? null;  // Supposons que vous récupérez l'ID via GET
$table = $_GET['table'] ?? null;  // Supposons que vous récupérez la table via GET

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode(array('error' => 'La connexion a échoué : ' . $conn->connect_error)));
}

// Initialiser les données de réponse
$response = array();

// Vérifier la structure de la table pour déterminer quelles jointures effectuer
$sqlStructure = "SHOW COLUMNS FROM $table";
$resultStructure = $conn->query($sqlStructure);
$columns = array();
if ($resultStructure->num_rows > 0) {
    while ($row = $resultStructure->fetch_assoc()) {
        $columns[] = $row['Field'];
    }
}

// Préparer la requête SQL pour récupérer l'item avec les noms associés
$sql = "SELECT i.*";
if (in_array('lieu_id', $columns)) {
    $sql .= ", l.nom AS nom_lieu";
}
if (in_array('emplacement_id', $columns)) {
    $sql .= ", e.nom AS nom_emplacement";
}
if (in_array('caisse_id', $columns)) {
    $sql .= ", c.nom AS nom_caisse";
}
if (in_array('theme_id', $columns)) {
    $sql .= ", t.nom AS nom_theme";
}
$sql .= " FROM $table i";
if (in_array('lieu_id', $columns)) {
    $sql .= " LEFT JOIN lieux l ON i.lieu_id = l.id";
}
if (in_array('emplacement_id', $columns)) {
    $sql .= " LEFT JOIN emplacements e ON i.emplacement_id = e.id";
}
if (in_array('caisse_id', $columns)) {
    $sql .= " LEFT JOIN caisses c ON i.caisse_id = c.id";
}
if (in_array('theme_id', $columns)) {
    $sql .= " LEFT JOIN themes t ON i.theme_id = t.id";
}
$sql .= " WHERE i.id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

// Vérifier si l'item existe
if ($result->num_rows > 0) {
    $response = array_merge($response, $result->fetch_assoc());
} else {
    $response['error'] = 'Item non trouvé.';
}

// Requêtes supplémentaires selon la table
if ($table == 'lieux') {
    // Nombre d'emplacements associés
    $sqlEmplacements = "SELECT COUNT(*) as count FROM emplacements WHERE lieu_id = ?";
    $stmtEmplacements = $conn->prepare($sqlEmplacements);
    $stmtEmplacements->bind_param("i", $id);
    $stmtEmplacements->execute();
    $resultEmplacements = $stmtEmplacements->get_result();
    $response['nombre_emplacements'] = $resultEmplacements->fetch_assoc()['count'];

    // Nombre de caisses associées
    $sqlCaisses = "SELECT COUNT(*) as count FROM caisses WHERE lieu_id = ?";
    $stmtCaisses = $conn->prepare($sqlCaisses);
    $stmtCaisses->bind_param("i", $id);
    $stmtCaisses->execute();
    $resultCaisses = $stmtCaisses->get_result();
    $response['nombre_caisses'] = $resultCaisses->fetch_assoc()['count'];

    // Nombre d'objets associés
    $sqlObjets = "SELECT COUNT(*) as count FROM objets WHERE lieu_id = ?";
    $stmtObjets = $conn->prepare($sqlObjets);
    $stmtObjets->bind_param("i", $id);
    $stmtObjets->execute();
    $resultObjets = $stmtObjets->get_result();
    $response['nombre_objets'] = $resultObjets->fetch_assoc()['count'];

} elseif ($table == 'emplacements') {
    // Nombre de caisses associées
    $sqlCaisses = "SELECT COUNT(*) as count FROM caisses WHERE emplacement_id = ?";
    $stmtCaisses = $conn->prepare($sqlCaisses);
    $stmtCaisses->bind_param("i", $id);
    $stmtCaisses->execute();
    $resultCaisses = $stmtCaisses->get_result();
    $response['nombre_caisses'] = $resultCaisses->fetch_assoc()['count'];

    // Nombre d'objets associés
    $sqlObjets = "SELECT COUNT(*) as count FROM objets WHERE emplacement_id = ?";
    $stmtObjets = $conn->prepare($sqlObjets);
    $stmtObjets->bind_param("i", $id);
    $stmtObjets->execute();
    $resultObjets = $stmtObjets->get_result();
    $response['nombre_objets'] = $resultObjets->fetch_assoc()['count'];

} elseif ($table == 'caisses') {
    // Nombre d'objets associés
    $sqlObjets = "SELECT COUNT(*) as count FROM objets WHERE caisse_id = ?";
    $stmtObjets = $conn->prepare($sqlObjets);
    $stmtObjets->bind_param("i", $id);
    $stmtObjets->execute();
    $resultObjets = $stmtObjets->get_result();
    $response['nombre_objets'] = $resultObjets->fetch_assoc()['count'];

} elseif ($table == 'themes') {
    // Nombre d'objets associés
    $sqlObjets = "SELECT COUNT(*) as count FROM objets WHERE theme_id = ?";
    $stmtObjets = $conn->prepare($sqlObjets);
    $stmtObjets->bind_param("i", $id);
    $stmtObjets->execute();
    $resultObjets = $stmtObjets->get_result();
    $response['nombre_objets'] = $resultObjets->fetch_assoc()['count'];
}

// Convertir le tableau associatif en JSON
echo json_encode($response);

// Fermer la connexion et libérer les ressources
$stmt->close();
$conn->close();
?>

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

// Récupérer la liste des thèmes et le nombre d'objets associés à chaque thème
$sql = "
    SELECT t.id, t.nom, COUNT(o.id) AS nombre_objets
    FROM themes t
    LEFT JOIN objets o ON t.id = o.theme_id
    GROUP BY t.id, t.nom
";
$result = $conn->query($sql);

$themes = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $themes[] = $row;
    }
}

$conn->close();

echo json_encode($themes);
?>

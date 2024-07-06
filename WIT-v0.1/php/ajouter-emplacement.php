<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require 'config.php';

// Récupérer les données du formulaire
$nomEmplacement = $_POST['nomEmplacement'];
$lieuEmplacement = $_POST['lieuEmplacement'];
$nouveauLieu = isset($_POST['nouveauLieu']) ? $_POST['nouveauLieu'] : null;

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    http_response_code(500);
    echo 'Erreur de connexion à la base de données.';
    exit();
}

// Vérifier si un emplacement avec le même nom existe déjà dans le même lieu
$stmt = $conn->prepare("SELECT id FROM emplacements WHERE nom = ? AND lieu_id = ?");
$stmt->bind_param("si", $nomEmplacement, $lieuEmplacement);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    http_response_code(400);
    echo 'Un emplacement avec le même nom existe déjà dans ce lieu.';
    exit();
}
$stmt->close();

// Ajouter un nouveau lieu si nécessaire et s'il n'existe pas déjà
if ($lieuEmplacement === 'nouveau_lieu' && !empty($nouveauLieu)) {
    $stmt = $conn->prepare("SELECT id FROM lieux WHERE nom = ?");
    $stmt->bind_param("s", $nouveauLieu);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        http_response_code(400);
        echo 'Le lieu spécifié existe déjà.';
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO lieux (nom) VALUES (?)");
    $stmt->bind_param("s", $nouveauLieu);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo 'Erreur lors de l\'ajout du nouveau lieu.';
        exit();
    }
    $lieuEmplacement = $stmt->insert_id;
    $stmt->close();
}

// Ajouter l'emplacement
$stmt = $conn->prepare("INSERT INTO emplacements (nom, lieu_id) VALUES (?, ?)");
$stmt->bind_param("si", $nomEmplacement, $lieuEmplacement);
if (!$stmt->execute()) {
    http_response_code(500);
    echo 'Erreur lors de l\'ajout de l\'emplacement.';
    exit();
}

$stmt->close();
$conn->close();

http_response_code(200);
echo 'Nouvel emplacement ajouté avec succès.';
?>

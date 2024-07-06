<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require 'config.php';

// Récupérer les données du formulaire
$nomLieu = $_POST['nomLieu'];

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    http_response_code(500);
    echo 'Erreur de connexion à la base de données.';
    exit();
}

// Vérifier si un lieu avec le même nom existe déjà
$stmt = $conn->prepare("SELECT id FROM lieux WHERE nom = ?");
$stmt->bind_param("s", $nomLieu);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // Un lieu avec le même nom existe déjà
    http_response_code(400);
    echo 'Un lieu avec ce nom existe déjà.';
    $stmt->close();
    $conn->close();
    exit();
}

$stmt->close();

// Ajouter le nouveau lieu
$stmt = $conn->prepare("INSERT INTO lieux (nom) VALUES (?)");
$stmt->bind_param("s", $nomLieu);
if (!$stmt->execute()) {
    http_response_code(500);
    echo 'Erreur lors de l\'ajout du lieu.';
    exit();
}

$stmt->close();
$conn->close();

http_response_code(200);
echo 'Nouveau lieu ajouté avec succès.';
?>

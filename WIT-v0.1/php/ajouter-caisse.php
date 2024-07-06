<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require 'config.php';

// Récupérer les données du formulaire
$nomCaisse = $_POST['nomCaisse'];
$lieuCaisse = $_POST['lieuCaisse'];
$nouveauLieu = isset($_POST['nouveauLieu']) ? $_POST['nouveauLieu'] : null;
$emplacementCaisse = $_POST['emplacementCaisse']=== "null" ? null : $_POST['emplacementCaisse'];
$nouvelEmplacement = isset($_POST['nouvelEmplacement']) ? $_POST['nouvelEmplacement'] : null;

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    http_response_code(500);
    echo 'Erreur de connexion à la base de données.';
    exit();
}

// Ajouter un nouveau lieu si nécessaire et s'il n'existe pas déjà
if ($lieuCaisse === 'nouveau_lieu' && !empty($nouveauLieu)) {
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
    $lieuCaisse = $stmt->insert_id;
    $stmt->close();
}

// Ajouter un nouvel emplacement si nécessaire et s'il n'existe pas déjà dans le lieu spécifié
if ($emplacementCaisse === 'nouvel_emplacement' && !empty($nouvelEmplacement)) {
    $stmt = $conn->prepare("SELECT id FROM emplacements WHERE nom = ? AND lieu_id = ?");
    $stmt->bind_param("si", $nouvelEmplacement, $lieuCaisse);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        http_response_code(400);
        echo 'L\'emplacement spécifié existe déjà dans ce lieu.';
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO emplacements (nom, lieu_id) VALUES (?, ?)");
    $stmt->bind_param("si", $nouvelEmplacement, $lieuCaisse);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo 'Erreur lors de l\'ajout du nouvel emplacement.';
        exit();
    }
    $emplacementCaisse = $stmt->insert_id;
    $stmt->close();
}

// Vérifier si une caisse avec le même nom existe déjà dans le même lieu
$stmt = $conn->prepare("SELECT id FROM caisses WHERE nom = ? AND lieu_id = ?");
$stmt->bind_param("si", $nomCaisse, $lieuCaisse);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    http_response_code(400);
    echo 'Une caisse avec le même nom existe déjà dans ce lieu.';
    exit();
}
$stmt->close();

// Vérifier si une caisse avec le même nom existe déjà dans le même emplacement
$stmt = $conn->prepare("SELECT id FROM caisses WHERE nom = ? AND emplacement_id = ?");
$stmt->bind_param("si", $nomCaisse, $emplacementCaisse);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    http_response_code(400);
    echo 'Une caisse avec le même nom existe déjà dans cet emplacement.';
    exit();
}
$stmt->close();

// Ajouter la nouvelle caisse
$stmt = $conn->prepare("INSERT INTO caisses (nom, lieu_id, emplacement_id) VALUES (?, ?, ?)");
$stmt->bind_param("sii", $nomCaisse, $lieuCaisse, $emplacementCaisse);
if (!$stmt->execute()) {
    http_response_code(500);
    echo 'Erreur lors de l\'ajout de la caisse.';
    exit();
}

$stmt->close();
$conn->close();

http_response_code(200);
echo 'Nouvelle caisse ajoutée avec succès.';
?>

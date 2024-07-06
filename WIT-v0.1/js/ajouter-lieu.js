
////===== Fonction pour envoyer le formulaire via AJAX =====////
function envoyerFormulaire(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    var formData = new FormData(document.getElementById('ajouterLieuForm'));

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../php/ajouter-lieu.php', true);
    xhr.onload = function () {
        if (this.status === 200) {
            alert('Nouveau lieu ajouté avec succès.'); // Affiche une popup de succès
            document.getElementById('ajouterLieuForm').reset(); // Réinitialise le formulaire
        } else {
            alert(this.responseText);
        }
    };
    xhr.onerror = function () {
        alert('Erreur lors de la requête AJAX.');
    };
    xhr.send(formData);
}// END envoyerFormulaire()





////===== Ajouter un gestionnaire d'événement pour le formulaire =====////
document.getElementById('ajouterLieuForm').addEventListener('submit', envoyerFormulaire);
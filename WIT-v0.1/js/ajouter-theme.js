////===== Fonction pour envoyer le formulaire via AJAX =====////
function envoyerFormulaire(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    var formData = new FormData(document.getElementById('ajouterThemeForm'));

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../php/ajouter-theme.php', true);
    xhr.onload = function () {
        if (this.status === 200) {
            alert('Nouveau thème ajouté avec succès.'); 
            document.getElementById('ajouterThemeForm').reset(); 
        } else {

            alert(this.responseText);
        }
    };
    xhr.onerror = function () {
        alert('Erreur lors de la requête AJAX.');
    };
    xhr.send(formData);
}




////==== Ajouter un gestionnaire d'événement pour le formulaire =====////
document.getElementById('ajouterThemeForm').addEventListener('submit', envoyerFormulaire);
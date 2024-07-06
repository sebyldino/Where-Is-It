
////==== Fonction pour charger les lieux existants via AJAX =====////
function chargerLieux() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/get_lieux.php', true);
    xhr.onload = function () {
        if (this.status === 200) {
            var lieux = JSON.parse(this.responseText);
            var lieuSelect = document.getElementById("lieuEmplacement");

            lieux.forEach(function (lieu) {
                if (!optionExists(lieuSelect, lieu.id)) {
                    var option = document.createElement("option");
                    option.value = lieu.id;
                    option.textContent = lieu.nom;
                    lieuSelect.appendChild(option);
                }
            });
            if (!optionExists(lieuSelect, 'nouveau_lieu')) {
                var newLieuOption = document.createElement("option");
                newLieuOption.value = "nouveau_lieu";
                newLieuOption.textContent = "Créer un nouveau lieu";
                lieuSelect.appendChild(newLieuOption);
            }
        } else {
            console.error("Erreur lors du chargement des lieux : " + this.statusText);
        }
    };
    xhr.onerror = function () {
        console.error("Erreur lors de la requête AJAX.");
    };
    xhr.send();
}// END chargerLieux()






////===== Fonction pour envoyer le formulaire via AJAX =====////
function envoyerFormulaire(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    var formData = new FormData(document.getElementById('ajouterEmplacementForm'));

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../php/ajouter-emplacement.php', true);
    xhr.onload = function () {
        if (this.status === 200) {
            alert('Nouvel emplacement ajouté avec succès.'); // Affiche une popup de succès
            document.getElementById('ajouterEmplacementForm').reset(); // Réinitialise le formulaire
            chargerLieux();
        } else {
            alert('Erreur lors de l\'ajout de l\'emplacement : ' + this.responseText);
        }
    };
    xhr.onerror = function () {
        alert('Erreur lors de la requête AJAX. Veuillez vérifier votre connexion Internet ou réessayer plus tard.');
    };
    xhr.send(formData);
}// END envoyerFormulaire()





////===== Ajouter un gestionnaire d'événement pour le formulaire =====////
document.getElementById('ajouterEmplacementForm').addEventListener('submit', envoyerFormulaire);





////==== Charger les lieux existants au chargement de la page =====/////
document.addEventListener("DOMContentLoaded", chargerLieux);

////===== Fonction pour charger les lieux existants via AJAX =====////
function chargerLieux() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/get_lieux.php', true);
    xhr.onload = function () {
        if (this.status === 200) {
            var lieux = JSON.parse(this.responseText);
            var lieuSelect = document.getElementById("lieuCaisse");

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






////===== Fonction pour charger les emplacements existants via AJAX en fonction du lieu sélectionné =====////
function chargerEmplacements(lieu_id) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/get_emplacements.php?lieu_id=' + lieu_id, true);
    xhr.onload = function () {
        if (this.status === 200) {
            var emplacements = JSON.parse(this.responseText);
            var emplacementSelect = document.getElementById("emplacementCaisse");

            // Clear previous options and add the initial option
            emplacementSelect.innerHTML = `<option value="" selected disabled>Sélectionner un emplacement</option> <option value="null">Sans emplacement</option>`;


            emplacements.forEach(function (emplacement) {
                if (!optionExists(emplacementSelect, emplacement.id)) {
                    var option = document.createElement("option");
                    option.value = emplacement.id;
                    option.textContent = emplacement.nom;
                    emplacementSelect.appendChild(option);
                }
            });

            if (!optionExists(emplacementSelect, 'nouvel_emplacement')) {
                var newEmplacementOption = document.createElement("option");
                newEmplacementOption.value = "nouvel_emplacement";
                newEmplacementOption.textContent = "Créer un nouvel emplacement";
                emplacementSelect.appendChild(newEmplacementOption);
            }
        } else {
            console.error("Erreur lors du chargement des emplacements : " + this.statusText);
        }
    };
    xhr.onerror = function () {
        console.error("Erreur lors de la requête AJAX.");
    };
    xhr.send();
}// END chargerEmplacements()





////===== Fonction pour envoyer le formulaire via AJAX =====////
function envoyerFormulaire(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    var formData = new FormData(document.getElementById('ajouterCaisseForm'));

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../php/ajouter-caisse.php', true);
    xhr.onload = function () {
        if (this.status === 200) {
            alert('Nouvelle caisse ajoutée avec succès.'); // Affiche une popup de succès
            document.getElementById('ajouterCaisseForm').reset(); // Réinitialise le formulaire
            chargerLieux();
        } else {
            var errorMessage = this.responseText; // Récupère le message d'erreur renvoyé par le serveur
            alert('Erreur lors de l\'ajout de la caisse: ' + errorMessage);
        }
    };
    xhr.onerror = function () {
        alert('Erreur lors de la requête AJAX. Veuillez vérifier votre connexion Internet ou réessayer plus tard.');
    };
    xhr.send(formData);
}// END envoyerFormulaire()






////==== Charger les lieux existants au chargement de la page =====////
document.addEventListener("DOMContentLoaded", chargerLieux);




////===== Ajouter un gestionnaire d'événement pour le changement de lieu =====////
document.getElementById("lieuCaisse").addEventListener("change", function () {
    var selectedLieu = this.value;
    if (selectedLieu) {
        chargerEmplacements(selectedLieu);
    }
});





////==== Ajouter un gestionnaire d'événement pour le formulaire =====////
document.getElementById('ajouterCaisseForm').addEventListener('submit', envoyerFormulaire);
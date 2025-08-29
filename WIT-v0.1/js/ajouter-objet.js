
////==== Fonction pour charger les lieux existants via AJAX =====////
function chargerLieux() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/get_lieux.php', true);
    xhr.onload = function () {
        if (this.status === 200) {
            var lieux = JSON.parse(this.responseText);
            var lieuSelect = document.getElementById("lieuObjet");

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
            var emplacementSelect = document.getElementById("emplacementObjet");

            // Clear previous options and add the initial option
            emplacementSelect.innerHTML = `<option value="null" selected disabled>Sélectionner un emplacement</option> <option value="null">Sans emplacement</option>`;

            emplacements.forEach(function (emplacement) {
                if (!optionExists(emplacementSelect, emplacement.id)) {
                    var option = document.createElement("option");
                    option.value = emplacement.id;
                    option.textContent = emplacement.nom;
                    emplacementSelect.appendChild(option);
                }
            });

            var newEmplacementOption = document.createElement("option");
            newEmplacementOption.value = "nouvel_emplacement";
            newEmplacementOption.textContent = "Créer un nouvel emplacement";
            emplacementSelect.appendChild(newEmplacementOption);
        } else {
            console.error("Erreur lors du chargement des emplacements : " + this.statusText);
        }
    };
    xhr.onerror = function () {
        console.error("Erreur lors de la requête AJAX.");
    };
    xhr.send();
}// END chargerEmplacements






////===== Fonction pour charger les caisses existants via AJAX en fonction du lieu sélectionné =====////
function chargerCaisses(id, type) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/get_caisses.php?' + type + '=' + id, true);
    xhr.onload = function () {
        if (this.status === 200) {
            var caisses = JSON.parse(this.responseText);
            var caisseSelect = document.getElementById("caisseObjet");
            // Clear previous options
            caisseSelect.innerHTML = `<option value="null" selected disabled>Sélectionner une caisse</option> <option value="null">Sans caisse</option>`;

            caisses.forEach(function (caisse) {
                if (!optionExists(caisseSelect, caisse.id)) {
                    //++++ Si on recherche depuis un lieu
                    if (type === "lieu_id") {
                        if (caisse.emplacement_id === null) {
                            var option = document.createElement("option");
                            option.value = caisse.id;
                            option.textContent = caisse.nom;
                            caisseSelect.appendChild(option);
                        }
                        else {
                            console.log("caisse ignoré car elle dispose d'un emplacement: " + caisse.nom);
                        }
                    }

                    //+++++ sinon c'est qu'on cherche depuis un emplacement et donc la sortie ne seront que des caisses de cet emplacement
                    else {
                        var option = document.createElement("option");
                        option.value = caisse.id;
                        option.textContent = caisse.nom;
                        caisseSelect.appendChild(option);
                    }
                }
            });

            var newCaisseOption = document.createElement("option");
            newCaisseOption.value = "nouvelle_caisse";
            newCaisseOption.textContent = "Créer une nouvelle caisse";
            caisseSelect.appendChild(newCaisseOption);
        } else {
            console.error("Erreur lors du chargement des caisses: " + this.statusText);
        }
    };
    xhr.onerror = function () {
        console.error("Erreur lors de la requête AJAX.");
    };
    xhr.send();
}// END chargerCaisses()






////===== Fonction pour charger les thème existants via AJAX =====////
function chargerThemes() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/get_themes.php', true);
    xhr.onload = function () {
        if (this.status === 200) {
            var themes = JSON.parse(this.responseText);
            var themeSelect = document.getElementById("themeObjet");

            themes.forEach(function (theme) {
                if (!optionExists(themeSelect, theme.id)) {
                    var option = document.createElement("option");
                    option.value = theme.id;
                    option.textContent = theme.nom;
                    themeSelect.appendChild(option);
                }
            });
            if (!optionExists(themeSelect, 'nouveau_theme')) {
                var newThemeOption = document.createElement("option");
                newThemeOption.value = "nouveau_theme";
                newThemeOption.textContent = "Créer un nouveau thème";
                themeSelect.appendChild(newThemeOption);
            } 
        }else {
                console.error("Erreur lors du chargement des thèmes : " + this.statusText);
            }
    };
    xhr.onerror = function () {
        console.error("Erreur lors de la requête AJAX.");
    };
    xhr.send();
}// END chargerThemes()






//// Fonction pour envoyer le formulaire via AJAX
function envoyerFormulaire(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    var formData = new FormData(document.getElementById('ajouterObjetForm'));
    var fileInput = document.getElementById('photoObjet');
    formData.append('photoObjet', fileInput.files[0]);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../php/ajouter-objet.php', true);
    xhr.onload = function () {
        if (this.status === 200) {
            alert('Nouvel objet ajouté avec succès.');
            document.getElementById('ajouterObjetForm').reset();
            chargerLieux();
            chargerThemes();
        } else {
            alert("⚠️ Erreur lors de l\'ajout de l\'objet: \n" + this.responseText);
        }
    };
    xhr.onerror = function () {
        alert('Erreur lors de la requête AJAX. Veuillez vérifier votre connexion Internet ou réessayer plus tard.');
    };
    xhr.send(formData);
}// END envoyerFormulaire()





////===== Charger les lieux existants au chargement de la page =====////
document.addEventListener("DOMContentLoaded", chargerLieux);
document.addEventListener("DOMContentLoaded", chargerThemes);




////===== Ajouter un gestionnaire d'événement pour le changement de lieu =====////
document.getElementById("lieuObjet").addEventListener("change", function () {
    var selectedLieu = this.value;
    if (selectedLieu) {
        chargerEmplacements(selectedLieu);
        chargerCaisses(selectedLieu, "lieu_id");
    }
});




////===== Ajouter un gestionnaire d'événement pour le changement d'emplacement =====////
document.getElementById("emplacementObjet").addEventListener("change", function () {
    var selectedEmplacement = this.value;
    if (selectedEmplacement) {
        chargerCaisses(selectedEmplacement, "emplacement_id");
    }
    if (selectedEmplacement === "Sans emplacement" || selectedEmplacement === "null") {
        var lieu = document.getElementById('lieuObjet').value;
        chargerCaisses(lieu, "lieu_id");
    }
});




////===== Ajouter un gestionnaire d'événement pour le formulaire =====////
document.getElementById('ajouterObjetForm').addEventListener('submit', envoyerFormulaire);

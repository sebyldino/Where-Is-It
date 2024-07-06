////===== Variables =====////
var $paramID;
var $paramTABLE;
var backUrl;

var $item_id;
var $item_name;
var $item_lieu_id;
var $item_emplacement_id = "null";
var $item_caisse_id = "null";
var $item_theme_id;
var $item_description = "Pas de description";
var $item_quantite;
var $uploadFolderPath;
var $item_photo;
var $item_lieu_name;
var $item_emplacement_name = "Pas d'emplacement défini";
var $item_caisse_name = "Pas de caisse définie";
var $item_theme_name;
var $item_data;





////===== Récupération des paramètres url au chargement =====////
window.onload = function () {
    getQueryParams();
};




////===== Fonction pour obtenir les paramètres de l'URL =====////
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    $paramID = params.get('id'); //type string
    $paramTABLE = params.get('table'); // type string
    var headerText = document.getElementById('headerEdit');
    headerText.textContent = "Éditer";
    getItemsData($paramID, $paramTABLE);
}//END getQueryParams()


////===== Récupérer les données de l'item =====////
function getItemsData(id, table) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/get_item_details.php?id=' + id + '&table=' + table, true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            // Succès de la requête
            var data = JSON.parse(xhr.responseText);
            $item_data = data;
            console.log('Données de l\'item:', data);
            if (data.id) $item_id = data.id;
            if (data.nom) $item_name = data.nom;
            if (data.lieu_id) $item_lieu_id = data.lieu_id;
            if (data.emplacement_id) $item_emplacement_id = data.emplacement_id;
            if (data.caisse_id) $item_caisse_id = data.caisse_id;
            if (data.theme_id) $item_theme_id = data.theme_id;
            if (data.description) $item_description = data.description;
            if (data.quantite) $item_quantite = data.quantite;
            if (data.upload_folder_path) $uploadFolderPath = data.upload_folder_path;
            if ($item_quantite === undefined) $item_quantite = 0;
            if (data.photo) {
                $item_photo = $uploadFolderPath + data.photo;
            } else {
                $item_photo = "../img/default-photo.png";
            }
            if (data.nom_lieu) $item_lieu_name = data.nom_lieu;
            if (data.nom_emplacement) $item_emplacement_name = data.nom_emplacement;
            if (data.nom_caisse) $item_caisse_name = data.nom_caisse;
            if (data.nom_theme) $item_theme_name = data.nom_theme;

            createEditPage();

        } else {
            console.error('Erreur lors de la récupération des données:', xhr.status);
        }
    };
    xhr.onerror = function () {
        console.error('Erreur de connexion.');
    };
    xhr.send();
}//END getItemsData()







////==== Créer le formulaire en fonction de l'item =====////
function createForm(table) {
    let formulaire;
    if (table === 'lieux' || table === 'themes') {
        formulaire = `
            <label for="editNom" class="labelForm required-label">Nom:</label>
            <input type="text" id="editNom" name="nom" class="inputForm editForm" value="${$item_name}">
            <div id='nomActuel' class='infosActuelles'>Nom actuel: ${$item_name}</div><br>
            <button type="submit" class="boutonAjouter boutonAjouterEdit">Sauvegarder</button>
        `;
    }
    else if (table === 'emplacements') {
        formulaire = `
            <label for="editNom" class="labelForm required-label">Nom:</label>
            <input type="text" id="editNom" name="nom" class="inputForm editForm" value="${$item_name}">
            <div id='nomActuel' class='infosActuelles'>Nom actuel: ${$item_name}</div><br>
            <label for="editLieu" class="labelForm required-label">Lieu:</label>
            <select id="editLieu" name="lieu" class="inputForm editForm"><br>
            </select>
            <div id='lieuActuel' class='infosActuelles'>Lieu actuel: ${$item_lieu_name}</div><br>
            <button type="submit" class="boutonAjouter boutonAjouterEdit">Sauvegarder</button>
        `;
    }
    else if (table === 'caisses') {
        formulaire = `
            <label for="editNom" class="labelForm required-label">Nom:</label>
            <input type="text" id="editNom" name="nom" class="inputForm editForm" value="${$item_name}">
            <div id='nomActuel' class='infosActuelles'>Nom actuel: ${$item_name}</div><br>
            <label for="editLieu" class="labelForm required-label">Lieu:</label>
            <select id="editLieu" name="lieu" class="inputForm editForm"></select>
            <div id='lieuActuel' class='infosActuelles'>Lieu actuel: ${$item_lieu_name}</div><br>
            <label for="editEmplacement" class="labelForm">Emplacement:</label>
            <select id="editEmplacement" name="emplacement" class="inputForm editForm"></select>
            <div id='emplacementActuel' class='infosActuelles'>Emplacement actuel: ${$item_emplacement_name}</div><br>
            <button type="submit" class="boutonAjouter boutonAjouterEdit">Sauvegarder</button>
        `;

    }
    else if (table === 'objets') {
        formulaire = `
        <div id="photoEditContainer">
          <div id="photoFileContainer">
            <label for="editPhoto" class="currentPhotoLabel">
                <img id="currentPhoto" src="${$item_photo}" alt="Photo actuelle" class="photoDetail photoEdit">
            </label>
            <input type="file" id="editPhoto" name="photo" class="inputForm editForm" style="display: none;">
            <span id="fileName" class="fileName">Cliquer sur la photo pour la remplacer</span>
          </div>
        </div>

            <label for="editNom" class="labelForm required-label">Nom:</label>
            <input type="text" id="editNom" name="nom" class="inputForm editForm" value="${$item_name}">
            <div id='nomActuel' class='infosActuelles'>Nom actuel: ${$item_name}</div><br>
            <label for="editLieu" class="labelForm required-label">Lieu:</label>
            <select id="editLieu" name="lieu" class="inputForm editForm"></select>
            <div id='lieuActuel' class='infosActuelles'>Lieu actuel: ${$item_lieu_name}</div><br>
            <label for="editEmplacement" class="labelForm">Emplacement:</label>
            <select id="editEmplacement" name="emplacement" class="inputForm editForm"></select>
            <div id='emplacementActuel' class='infosActuelles'>Emplacement actuel: ${$item_emplacement_name}</div><br>
            <label for="editCaisse" class="labelForm">Caisse:</label>
            <select id="editCaisse" name="caisse" class="inputForm editForm"></select>
            <div id='caisseActuelle' class='infosActuelles'>Caisse actuelle: ${$item_caisse_name}</div><br>
            <label for="editTheme" class="labelForm required-label">Thème:</label>
            <select id="editTheme" name="theme" class="inputForm editForm"></select>
            <div id='emplacementActuel' class='infosActuelles'>Thème actuel: ${$item_theme_name}</div><br>
            <label for="editQuantite" class="labelForm required-label">Quantité:</label>
            <input type="number" id="editQuantite" name="quantite" class="inputForm editForm" value="${$item_quantite}">
            <div id='quantiteActuelle' class='infosActuelles'>Quantité actuelle: ${$item_quantite}</div><br>
            <label for="editDescription" class="labelForm">Description:</label>
            <input id="editDescription" name="description" class="inputForm editForm" value="${$item_description}"><br>
            <input id="resetPhoto" name"resetPhoto" value="non" style="display: none">
            <button type="submit" class="boutonAjouter boutonAjouterEdit">Sauvegarder</button>
        `;
    }
    else {
        console.error('Nom de table invalide');
        return;
    }
    return formulaire;
}//END createForm()






////=====  Créer la page d'édition dynamiquement  =====////
function createEditPage() {
    var body = document.body;

    //Modifier légèrement la mise en page du texte du header car on ajouter l'encart
    const headerText = document.querySelector('.headerText');
    headerText.style.top = '0';

    const editForm = document.createElement('form');
    editForm.id = 'editForm';
    editForm.classList.add('ajouterForm');
    editForm.innerHTML = createForm($paramTABLE);
    body.appendChild(editForm);

    //+ créer supprimer bouton
    // Création de l'icône pour le bouton Supprimer
    const iconSupprimer = document.createElement('i');
    iconSupprimer.id = 'supprimerIcon';
    iconSupprimer.classList.add('mdi');
    iconSupprimer.classList.add('mdi-trash-can-outline');

    // Création du bouton Supprimer
    const boutonSupprimer = document.createElement('div');
    boutonSupprimer.id = 'supprimerBouton';

    // Création du texte 'Supprimer'
    const supprimerText = document.createElement('span');
    supprimerText.textContent = 'Supprimer';

    // Création du conteneur pour le bouton Supprimer
    const supprimerBoutonContainer = document.createElement('div');
    supprimerBoutonContainer.id = 'supprimerBoutonContainer';
    boutonSupprimer.appendChild(iconSupprimer);
    boutonSupprimer.appendChild(supprimerText);
    supprimerBoutonContainer.appendChild(boutonSupprimer);

    // Ajout du conteneur au body 
    body.appendChild(supprimerBoutonContainer);

    // Ajout d'un écouteur d'événement 'click' au bouton Supprimer
    boutonSupprimer.addEventListener('click', function () {
        supprimerElement($paramID, $paramTABLE);
    });


    //+++++++++ EMPLACEMENTS, CAISSES, OBJETS
    if ($paramTABLE === 'emplacements' || $paramTABLE === 'caisses' || $paramTABLE === 'objets') {
        chargerLieux();
    }
    //+++++++++ CAISSES
    if ($paramTABLE === 'caisses') {
        var lieuSelect = document.getElementById('editLieu');
        lieuSelect.addEventListener('change', function () {
            var selectedLieuId = lieuSelect.value;
            chargerEmplacements(selectedLieuId);
        });
        chargerEmplacements($item_lieu_id);
    }
    //+++++++++ OBJETS
    if ($paramTABLE === 'objets') {
        //Ajout du bouton pour remettre la photo par défaut SI une photo est présente
        if ($item_data.photo) {
            createResetButton();
        }


        var lieuSelect = document.getElementById('editLieu');
        lieuSelect.addEventListener('change', function () {
            var selectedLieuId = lieuSelect.value;
            chargerEmplacements(selectedLieuId);
            chargerCaisses(selectedLieuId, "lieu_id");
        });
        var emplacementSelect = document.getElementById('editEmplacement');
        emplacementSelect.addEventListener('change', function () {
            var selectedLieuID = lieuSelect.value;
            var selectedEmplacementID = emplacementSelect.value;
            if (selectedEmplacementID !== 'null') {
                chargerCaisses(selectedEmplacementID, "emplacement_id");
            }
            else {
                chargerCaisses(selectedLieuID, "lieu_id");
            }

        })
        chargerEmplacements($item_lieu_id);
        if ($item_emplacement_id !== "null") {
            chargerCaisses($item_emplacement_id, "emplacement_id");
        }
        else {
            chargerCaisses($item_lieu_id, "lieu_id");
        }
        chargerThemes();
        document.getElementById('editPhoto').addEventListener('change', function () {
            var fileName = this.files[0].name;
            document.getElementById('fileName').textContent = 'Fichier sélectionné : ' + fileName;
            showIconClearInput();
        });
    }//END createEditPage()






    //+++++ Écouteur pour envoyer le formulaire via AJAX 
    editForm.addEventListener('submit', function (event) {
        var inputName = document.getElementById('editNom');
        var inputQuantite = document.getElementById('editQuantite');
        if (document.getElementById('resetPhoto')) {
            var reset_photo = document.getElementById('resetPhoto').value;
        }
        if (inputQuantite) {
            if (isNaN(parseInt(inputQuantite.value))) {
                inputQuantite.value = 0;
            }
        }

        if (window.confirm("Êtes-vous sûr de vouloir modifier '" + $item_name + "' ?")) {
            event.preventDefault(); // Empêche le comportement par défaut du formulaire

            var formData = new FormData(editForm);
            formData.append('id', $item_id);
            formData.append('table', $paramTABLE);
            if (reset_photo) {
                formData.append('reset_photo', reset_photo);
            }


            // Log le FormData
            console.log('Contenu de FormData:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '../php/edit_item.php', true);
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 400) {
                    alert('Élément mis à jour avec succès.');
                    location.reload();
                } else {
                    console.error('Erreur lors de la mise à jour de l\'élément:', xhr.status + " | " + xhr.responseText);
                    if (inputName.value === "") {
                        console.error("Le champs 'Nom' ne peut pas être vide");
                        alert('Erreur lors de la mise à jour de l\'élément: ' + xhr.responseText + " Le champs 'Nom' ne peut pas être vide!");
                    }


                }
            };
            xhr.onerror = function () {
                console.error('Erreur de connexion.');
            };
            xhr.send(formData);
        } else {
            alert("L'élément n'a pas été modifié.");
        }
    });
}//END createEditPage()







////=====   Fonction pour supprimer un élément =====////
function supprimerElement(id, table) {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément?")) {
        var xhr = new XMLHttpRequest();

        xhr.open('POST', '../php/supprimer_element.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Afficher la réponse de votre script PHP
                    alert(xhr.responseText);
                    if (xhr.responseText.includes('succès')) {
                        window.location.href = '../pages/' + table +'.html';
                    }
                } else {
                    alert(xhr.statusText);
                }
            }
        };
        var params = 'id=' + id + '&table=' + table;

        xhr.send(params);
    } else {
        alert("L'élément n'a pas été supprimé.");
    }
}//END supprimerElement()






////==== Fonction pour charger les lieux existants via AJAX =====////
function chargerLieux() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/get_lieux.php', true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            var data = JSON.parse(xhr.responseText);
            var lieuSelect = document.getElementById('editLieu');
            data.forEach(function (lieu) {
                var option = document.createElement('option');
                option.value = lieu.id;
                option.text = lieu.nom;
                lieuSelect.appendChild(option);
            });
            // Sélectionner le lieu actuel de l'emplacement
            if ($item_lieu_id) {
                lieuSelect.value = $item_lieu_id;
            }
        } else {
            console.error('Erreur lors de la récupération des lieux:', xhr.status);
        }
    };
    xhr.onerror = function () {
        console.error('Erreur de connexion.');
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
            var emplacementSelect = document.getElementById("editEmplacement");

            // Clear previous options and add the initial option
            if (parseInt(lieu_id) === parseInt($item_lieu_id)) {
                emplacementSelect.innerHTML = `<option value="${$item_emplacement_id}" selected>${$item_emplacement_name}</option> <option value="null">Sans emplacement</option>`;
            }
            else {
                emplacementSelect.innerHTML = `<option value="null" selected disabled>Sélectionner un emplacement</option> <option value="null">Sans emplacement</option>`;
            }


            emplacements.forEach(function (emplacement) {
                if ($item_emplacement_id) {
                    if (emplacement.id.toString() !== $item_emplacement_id.toString()) {
                        var option = document.createElement("option");
                        option.value = emplacement.id;
                        option.textContent = emplacement.nom;
                        emplacementSelect.appendChild(option);
                    }
                }
                else {
                    var option = document.createElement("option");
                    option.value = emplacement.id;
                    option.textContent = emplacement.nom;
                    emplacementSelect.appendChild(option);
                }
            });
        } else {
            console.error("Erreur lors du chargement des emplacements : " + this.statusText);
        }
    };
    xhr.onerror = function () {
        console.error("Erreur lors de la requête AJAX.");
    };
    xhr.send();
}//END chargerEmplacements()





////=====  Fonction pour charger les caisses existants via AJAX en fonction du lieu sélectionné =====////
function chargerCaisses(id, type) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/get_caisses.php?' + type + '=' + id, true);
    xhr.onload = function () {
        if (this.status === 200) {
            var caisses = JSON.parse(this.responseText);
            var caisseSelect = document.getElementById("editCaisse");

            // Clear previous options
            if (type === "lieu_id") {
                if (parseInt(id) === parseInt($item_lieu_id) && ($item_emplacement_id === "null")) {
                    //on mets le nom de la caisse actuelle
                    caisseSelect.innerHTML = `<option value="${$item_caisse_id}" selected >${$item_caisse_name}</option> <option value="null">Sans caisse</option>`;
                } else {
                    //sinon on fais la liste de toutes les caisses dans ce lieu
                    caisseSelect.innerHTML = `<option value="null" selected disable>Sélectionner une caisse</option> <option value="null">Sans caisse</option>`;
                }
            }

            if (type === "emplacement_id") {
                if (parseInt(id) === parseInt($item_emplacement_id)) {
                    //on mets le nom de la caisse actuelle
                    caisseSelect.innerHTML = `<option value="${$item_caisse_id}" selected >${$item_caisse_name}</option> <option value="null">Sans caisse</option>`;
                } else {
                    //on affiche la liste de toute les caisses dans l'emplacement
                    caisseSelect.innerHTML = `<option value="null" selected disable>Sélectionner une caisse</option> <option value="null">Sans caisse</option>`;
                }
            }
            //caisseSelect.innerHTML = `<option value="${$item_caisse_id}" selected >${$item_caisse_name}</option> <option value="null">Sans caisse</option>`;

            caisses.forEach(function (caisse) {
                if ($item_caisse_id) {
                    if (caisse.id.toString() !== $item_caisse_id.toString()) {
                        var option = document.createElement("option");
                        option.value = caisse.id;
                        option.textContent = caisse.nom;
                        caisseSelect.appendChild(option);
                    }
                }
                else {
                    var option = document.createElement("option");
                    option.value = caisse.id;
                    option.textContent = caisse.nom;
                    caisseSelect.appendChild(option);
                }

            });
        } else {
            console.error("Erreur lors du chargement des caisses: " + this.statusText);
        }
    };
    xhr.onerror = function () {
        console.error("Erreur lors de la requête AJAX.");
    };
    xhr.send();
}//END chargerCaisses()







////===== Fonction pour charger les themes existants via AJAX =====////
function chargerThemes() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/get_themes.php', true);
    xhr.onload = function () {
        if (this.status === 200) {
            var themes = JSON.parse(this.responseText);
            var themeSelect = document.getElementById("editTheme");
            themeSelect.innerHTML = `<option value="${$item_theme_id}" selected >${$item_theme_name}</option>`;

            themes.forEach(function (theme) {
                if (parseInt(theme.id) !== parseInt($item_theme_id)) {
                    var option = document.createElement("option");
                    option.value = theme.id;
                    option.textContent = theme.nom;
                    themeSelect.appendChild(option);
                }

            });
        } else {
            console.error("Erreur lors du chargement des thèmes : " + this.statusText);
        }
    };
    xhr.onerror = function () {
        console.error("Erreur lors de la requête AJAX.");
    };
    xhr.send();
}// END chargerThemes()






////=====   Reset photo par la photo par défaut =====////
function resetPhoto() {
    var inputResetPhoto = document.getElementById('resetPhoto');
    if (inputResetPhoto.value === 'non') {
        inputResetPhoto.value = 'oui';
        iconRestore();
    }
    else {
        inputResetPhoto.value = 'non';
        iconDelete();
    }
    console.log('Reset Photo: ', inputResetPhoto.value);
}//END resetPhoto()






////===== Icone supprimer ou restaurer =====////
//+++++ Icone supprimer
function iconDelete() {
    const resetPhotoButton = document.getElementById('resetPhotoButton');
    const currentPhoto = document.getElementById('currentPhoto');
    currentPhoto.src = $item_photo;
    resetPhotoButton.classList.remove('mdi-image-refresh');
    resetPhotoButton.classList.remove('restore');
    resetPhotoButton.classList.add('mdi-image-remove');
    resetPhotoButton.classList.add('delete');
}

//+++++ Icone restaurer
function iconRestore() {
    const resetPhotoButton = document.getElementById('resetPhotoButton');
    const currentPhoto = document.getElementById('currentPhoto');
    currentPhoto.src = '../img/default-photo.png';
    resetPhotoButton.classList.remove('mdi-image-remove');
    resetPhotoButton.classList.remove('delete');
    resetPhotoButton.classList.add('mdi-image-refresh');
    resetPhotoButton.classList.add('restore');
}






////=====   Afficher une icone pour le file input =====////
//Si un objet ne dispose pas de photo à l'origine et qu'on en sélectionne une avec le file input, on affichera une 
// icone afin de pouvoir vider le file input et ne pas ajouter de photo à l'enregistrement
function showIconClearInput() {
    const inputFilePhoto = document.getElementById('editPhoto');
    const resetPhotoButton = document.getElementById('resetPhotoButton');
    if (inputFilePhoto.files.length > 0) {
        if (resetPhotoButton) {
            resetPhotoButton.style.display = 'flex';
        }
        else {
            createClearButton();
        }
        console.log('Fichier présent');
    }
    else {
        resetPhotoButton.style.display = 'none';
        console.log('Pas de fichier présent');
        document.getElementById('fileName').textContent = "Cliquer sur la photo pour la remplacer";
    }
}




////===== Création d'un bouton pour reset la photo d'un objet QUI N'A PAS DEJA de photo =====////
function createClearButton() {
    const inputFilePhoto = document.getElementById('editPhoto');
    const photoEditContainer = document.getElementById("photoEditContainer");
    const clearButton = document.createElement('div');
    clearButton.id = 'resetPhotoButton';
    clearButton.classList.add('mdi');
    clearButton.classList.add('mdi-image-remove');
    clearButton.classList.add('delete');
    photoEditContainer.appendChild(clearButton);
    clearButton.addEventListener('click', function () {
        inputFilePhoto.value = '';
        console.log("fichier supprimé");
        showIconClearInput();
    });
}





////===== Création d'un bouton pour reset la photo d'un objet QUI A DEJA une photo =====////
function createResetButton() {
    const photoEditContainer = document.getElementById("photoEditContainer");
    const resetPhotoButton = document.createElement('div');
    resetPhotoButton.id = 'resetPhotoButton';
    resetPhotoButton.classList.add('mdi');
    resetPhotoButton.classList.add('mdi-image-remove');
    resetPhotoButton.classList.add('delete');
    photoEditContainer.appendChild(resetPhotoButton);
    resetPhotoButton.addEventListener('click', function () {
        resetPhoto();
    });
}
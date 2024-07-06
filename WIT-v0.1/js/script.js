
////=====   serviceWorker   ======////
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
                registration.update();
            }).catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}






////====== Au chargement de la page ======////
document.addEventListener("DOMContentLoaded", function () {
    var bodyId = document.body.id;
    const body = document.body;
    const bg = document.createElement('div'); // creation d'un background
    bg.id = 'bg';
    body.appendChild(bg);


    //+++++ Effacement de l'historique en revenant à la page d'accueil
    if (bodyId === "bodyIndex") {
        const history = localStorage.getItem('history');
        if (history) {
            localStorage.removeItem('history');
        }
    }


    //+++++++ Gérer l'historique de navigation
    const history = JSON.parse(localStorage.getItem('history')) || [];
    function addToHistory() {
        const currentUrl = window.location.href;
        if (!history.includes(currentUrl)) {
            history.push(currentUrl);
            localStorage.setItem('history', JSON.stringify(history));
        }
    }

    addToHistory();

    function goBack() {
        history.pop();
        const previousUrl = history.pop();
        if (previousUrl) {
            window.location.href = previousUrl;
        } else {
            window.location.href = '../pages/index.html'; // Remplacez par l'URL de votre page d'accueil
        }
        localStorage.setItem('history', JSON.stringify(history));
    }
    const backButton = document.getElementById('headerBack');
    if (backButton) backButton.addEventListener('click', goBack);
    const annulerBouton = document.querySelector('.boutonAnnuler');
    if (annulerBouton) annulerBouton.addEventListener('click', goBack);
    //****/


    if (bodyId === 'bodyIndex') { //!<======= bodyIndex
        //+++++ Click sur les boutons de la page d'acceuil
        document.getElementById("lieuBouton").addEventListener("click", function () {
            window.location.href = "./lieux.html";
        });
        document.getElementById("emplacementBouton").addEventListener("click", function () {
            window.location.href = "./emplacements.html";
        });
        document.getElementById("caisseBouton").addEventListener("click", function () {
            window.location.href = "./caisses.html";
        });
        document.getElementById("objetBouton").addEventListener("click", function () {
            window.location.href = "./objets.html";
        });
        document.getElementById("themeBouton").addEventListener("click", function () {
            window.location.href = "./themes.html";
        });

        boutonAjout();
        rechercher();
    }//END if bodyIndex







    ////=====   BODY AJOUT EMPLACEMENT =====////
    if (bodyId === 'bodyAjoutEmplacement') {//!<======= bodyIndex
        //+++++ Affiche un champ 'nouveau lieu' quand on sélectionne 'créer nouveau lieu' lors de l'ajout d'un emplacement
        document.getElementById("lieuEmplacement").addEventListener("change", function () {
            var nouveauLieuChamp = document.getElementById("champNouveauLieu");
            var inputNouveauLieu = document.getElementById("nouveauLieu");
            if (this.value === "nouveau_lieu") {
                nouveauLieuChamp.style.display = "flex";
                inputNouveauLieu.setAttribute("required", true);
            } else {
                nouveauLieuChamp.style.display = "none";
                inputNouveauLieu.removeAttribute("required");
            }
        });
    }//END if bodyAjoutEmplacement





    ////=====   BODY AJOUT CAISSE =====////
    if (bodyId === 'bodyAjoutCaisse') {//!<======= bodyIndex
        //+++++ Affiche un champ 'nouveau lieu' quand on sélectionne 'créer nouveau lieu' lors de l'ajout d'une caisse
        document.getElementById("lieuCaisse").addEventListener("change", function () {
            var nouveauLieuChamp = document.getElementById("champNouveauLieu");
            var inputNouveauLieu = document.getElementById("nouveauLieu");
            if (this.value === "nouveau_lieu") {
                nouveauLieuChamp.style.display = "flex";
                inputNouveauLieu.setAttribute("required", true);
            } else {
                nouveauLieuChamp.style.display = "none";
                inputNouveauLieu.removeAttribute("required");
            }
        });
        //+++++ Affiche un champ 'nouvel emplacement' quand on sélectionne 'créer nouvel emplacement' lors de l'ajout d'une caisse
        document.getElementById("emplacementCaisse").addEventListener("change", function () {
            var nouvelEmplacementChamp = document.getElementById("champNouvelEmplacement");
            var inputNouvelEmplacement = document.getElementById("nouvelEmplacement");
            if (this.value === "nouvel_emplacement") {
                nouvelEmplacementChamp.style.display = "flex";
                inputNouvelEmplacement.setAttribute("required", true);
            } else {
                nouvelEmplacementChamp.style.display = "none";
                inputNouvelEmplacement.removeAttribute("required");
            }
        });
    }//END if bodyAjoutCaisse





    ////=====   BODY AJOUT OBJET =====////
    if (bodyId === 'bodyAjoutObjet') {//!<======= bodyIndex
        //+++++ Affiche un champ 'nouveau lieu' quand on sélectionne 'créer nouveau lieu' lors de l'ajout d'un objet
        document.getElementById("lieuObjet").addEventListener("change", function () {
            var nouveauLieuChamp = document.getElementById("champNouveauLieu");
            var inputNouveauLieu = document.getElementById("nouveauLieu");
            if (this.value === "nouveau_lieu") {
                nouveauLieuChamp.style.display = "flex";
                inputNouveauLieu.setAttribute("required", true);
            } else {
                nouveauLieuChamp.style.display = "none";
                inputNouveauLieu.removeAttribute("required");
            }
        });
        //+++++ Affiche un champ 'nouvel emplacement' quand on sélectionne 'créer nouvel emplacement' lors de l'ajout d'un objet
        document.getElementById("emplacementObjet").addEventListener("change", function () {
            var nouvelEmplacementChamp = document.getElementById("champNouvelEmplacement");
            var inputNouvelEmplacement = document.getElementById("nouvelEmplacement");
            if (this.value === "nouvel_emplacement") {
                nouvelEmplacementChamp.style.display = "flex";
                inputNouvelEmplacement.setAttribute("required", true);
            } else {
                nouvelEmplacementChamp.style.display = "none";
                inputNouvelEmplacement.removeAttribute("required");
            }
        });
        //+++++ Affiche un champ 'nouvelle caisse' quand on sélectionne 'créer nouvele caisse' lors de l'ajout d'un objet
        document.getElementById("caisseObjet").addEventListener("change", function () {
            var nouvelleCaisseChamp = document.getElementById("champNouvelleCaisse");
            var inputNouvelleCaisse = document.getElementById("nouvelleCaisse");
            if (this.value === "nouvelle_caisse") {
                nouvelleCaisseChamp.style.display = "flex";
                inputNouvelleCaisse.setAttribute("required", true);
            } else {
                nouvelleCaisseChamp.style.display = "none";
                inputNouvelleCaisse.removeAttribute("required");
            }
        });
        //+++++ Affiche un champ 'nouveau theme' quand on sélectionne 'créer nouvele caisse' lors de l'ajout d'un objet
        document.getElementById("themeObjet").addEventListener("change", function () {
            var nouveauThemeChamp = document.getElementById("champNouveauTheme");
            var inputNouveauTheme = document.getElementById("nouveauTheme");
            if (this.value === "nouveau_theme") {
                nouveauThemeChamp.style.display = "flex";
                inputNouveauTheme.setAttribute("required", true);
            } else {
                nouveauThemeChamp.style.display = "none";
                inputNouveauTheme.removeAttribute("required");
            }
        });
    }//END if bodyAjoutCaisse

    indexBoutonsHover(bodyId);
});//END Onload








////====== Fonction pour les formulaires d'ajout =======////

//+++++ Fonction pour ajouter un élément en fonction du choix de l'utilisateur
function ajouterElement(type) {
    // Rediriger l'utilisateur vers la page d'ajout correspondante en fonction du type sélectionné
    window.location.href = type + ".html";
}
// Fonction pour fermer la boîte de dialogue modale
function fermerBoiteDialogue() {
    var boiteDialogue = document.getElementById('boiteDialogue');
    if (boiteDialogue) {
        boiteDialogue.remove();
    }
}


//+++++ Fonction pour annuler l'ajout et retourner à la page d'accueil
function goHome() {
    // Rediriger vers la page d'accueil
    window.location.href = "index.html";
}









////===== Fonction pour le bouton '+'  =====////
function boutonAjout() {
    //+++++ Récupérer le bouton "Ajouter"
    var boutonAjouter = document.getElementById("ajouterBouton");

    // Écouter le clic sur le bouton "Ajouter"
    boutonAjouter.addEventListener("click", function () {
        // Afficher la boîte de dialogue modale
        afficherBoiteDialogue();
    });

    // Fonction pour afficher la boîte de dialogue modale
    function afficherBoiteDialogue() {
        // Créer la structure HTML de la boîte de dialogue modale
        var boiteDialogueHTML = `
            <div id="boiteDialogue" class="boite-dialogue">
                <div class="contenu">
                    <h2>Que souhaitez-vous ajouter ?</h2>
                    <button id='popupBoutonLieu' onclick="ajouterElement('ajouter-lieu')">Lieu</button>
                    <button id='popupBoutonEmplacement' onclick="ajouterElement('ajouter-emplacement')">Emplacement</button>
                    <button id='popupBoutonCaisse' onclick="ajouterElement('ajouter-caisse')">Caisse</button>
                    <button id='popupBoutonObjet' onclick="ajouterElement('ajouter-objet')">Objet</button>
                    <button id='popupBoutonTheme' onclick="ajouterElement('ajouter-theme')">Thème</button>
                </div>
            </div>
         `;

        // Ajouter la boîte de dialogue modale à la page
        document.body.insertAdjacentHTML('beforeend', boiteDialogueHTML);
        // Ajouter un écouteur d'événements pour fermer la boîte de dialogue modale lorsque l'utilisateur clique en dehors de celle-ci
        window.addEventListener('click', function (event) {
            var boiteDialogue = document.getElementById('boiteDialogue');
            if (event.target == boiteDialogue) {
                fermerBoiteDialogue();
            }
        });
        // Ajouter un écouteur d'événements pour les appareils mobiles (événements tactiles)
        window.addEventListener('touchstart', function (event) {
            var boiteDialogue = document.getElementById('boiteDialogue');
            if (event.target == boiteDialogue) {
                fermerBoiteDialogue();
            }
        });
    }
}//END boutonAjout()







////===== Fonction rechercher  =====////
function rechercher() {
    var conteneurResultats = document.getElementById('conteneurResultats');

    const champsRecherche = document.getElementById('champsRecherche');
    const resultatsRecherche = document.getElementById('resultatsRecherche');

    champsRecherche.addEventListener('input', function () {
        if (conteneurResultats.style.display !== 'flex') {
            conteneurResultats.style.display = 'flex';
        }

        const recherche = champsRecherche.value.toLowerCase(); // Convertir la recherche en minuscules
        if (conteneurResultats.style.display !== 'none' && recherche === "") {
            conteneurResultats.style.display = 'none';
        }

        // Effectuer une requête AJAX
        fetch('../php/rechercher.php?recherche=' + recherche)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau : ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Effacer les anciens résultats
                resultatsRecherche.innerHTML = '';

                // Afficher les nouveaux résultats
                if (data.length === 0) {
                    resultatsRecherche.textContent = 'Aucun résultat trouvé';
                } else {
                    data.forEach(item => {
                        const resultat = document.createElement('div');
                        const description = `<div class="descriptionRecherche">${item.description}</div>`;
                        resultat.classList.add('resultatItem');
                        resultat.innerHTML = addIconRecherche(item.table) + item.nom + '<br>' + description // Supposons que chaque élément a une propriété "nom"
                        resultat.addEventListener("click", function () {
                            openDetail(item.id, item.table);
                            console.log(item); //! <========================================= on log l'item avec ses infos
                        });
                        resultatsRecherche.appendChild(resultat);
                    });
                }
            })
            .catch(error => {
                console.error('Erreur lors de la recherche :', error);
            });
    });
}//END rechercher()






////===== Fonction pour ouvrir la page de détail de l'item cliqué  =====////
function openDetail(id, table) {
    //var url = '../pages/detail-' + encodeURIComponent(table) + '.html?id=' + encodeURIComponent(id) + '&table=' + encodeURIComponent(table);
    var url = '../pages/detail.html?id=' + encodeURIComponent(id) + '&table=' + encodeURIComponent(table);
    window.location.href = url;
}//END openDetail()






////=====   Ajouter un encart  =====////
//Ajouter un encart dans le header quand on ressort la liste d'élément présent dans une table
function ajouterEncart(tableName, paramTable, page) {
    var encartText = null;
    //+ Pour ajouter le type et le nom d'où viennent les résultats
    //+ genre "dans le lieu Camion-2"
    if (paramTable) {

        if (paramTable === 'lieux') {
            if (page === 'detail') encartText = "du lieu: '" + tableName + "'";
            else encartText = "dans le lieu: '" + tableName + "'";
        }
        else if (paramTable === 'emplacements') {
            if (page = 'detail') encartText = "de l'emplacement: '" + tableName + "'";
            else encartText = "dans l'emplacement: '" + tableName + "'";
        }
        else if (paramTable === 'caisses') {
            if (page === 'detail') encartText = "de la caisse: '" + tableName + "'";
            else encartText = "dans la caisse: '" + tableName + "'";
        }
        else if (paramTable === 'themes') {
            if (page === 'detail') encartText = "du thème: '" + tableName + "'";
            else encartText = "avec le thème: '" + tableName + "'";
        }
        else if (paramTable === 'objets') {
            encartText = "de l'objet: '" + tableName + "'";
        }
        else {
            encartText = null;
        }
    }

    if (encartText !== null) {
        const header = document.getElementById('header');
        const encart = document.createElement('span');
        encart.classList.add('encart');
        encart.textContent = encartText;
        header.appendChild(encart);
    }
}//END ajouterEncart()






////======= Ajouter des hover effect sur les bouton de page d'accueil =======////
function indexBoutonsHover(bodyId) {
    if (bodyId === 'bodyIndex') {
        addHoverEffect('lieuBouton', 'lieuImage', '../img/lieu-white.png', '../img/lieu-purple.png');
        addHoverEffect('emplacementBouton', 'emplacementImage', '../img/emplacement-white.png', '../img/emplacement-blue.png');
        addHoverEffect('caisseBouton', 'caisseImage', '../img/caisse-white.png', '../img/caisse-green.png');
        addHoverEffect('objetBouton', 'objetImage', '../img/objet-white.png', '../img/objet-orange.png');
        addHoverEffect('themeBouton', 'themeImage', '../img/theme-white.png', '../img/theme-grey.png');
    }
}


function addHoverEffect(buttonId, imageId, defaultSrc, hoverSrc) {
    const button = document.getElementById(buttonId);
    const image = document.getElementById(imageId);
    function changeImageToHover() {
        image.src = hoverSrc;
    }
    function changeImageToDefault() {
        image.src = defaultSrc;
    }
    // Événements pour ordinateur
    button.addEventListener('mouseover', changeImageToHover);
    button.addEventListener('mouseout', changeImageToDefault);
    // Événements pour mobile
    button.addEventListener('touchstart', changeImageToHover);
    button.addEventListener('touchend', changeImageToDefault);
}






////====== Ajout d'icone suivant l'item ========////
function addIconRecherche(table) {
    if (table === 'lieux') return "<img id='lieuIcon' src='../img/lieu-purple.png' style='max-width: 1.5rem; max-height: 1.5rem; margin-right: 1rem; vertical-align: middle;'></img>";
    else if (table === 'emplacements') return "<img id='emplacementIcon' src='../img/emplacement-blue.png' style='max-width: 1.5rem; max-height: 1.5rem; margin-right: 1rem; vertical-align: middle;'></img>";
    else if (table === 'caisses') return "<img id='caisseIcon' src='../img/caisse-green.png' style='max-width: 1.5rem; max-height: 1.5rem; margin-right: 1rem; vertical-align: middle;'></img>";
    else if (table === 'objets') return "<img id='objetIcon' src='../img/objet-orange.png' style='max-width: 1.5rem; max-height: 1.5rem; margin-right: 1rem; vertical-align: middle;'></img>";
    else if (table === 'themes') return "<img id='themeIcon' src='../img/theme-grey.png' style='max-width: 1.5rem; max-height: 1.5rem; margin-right: 1rem; vertical-align: middle;'></img>";
    else console.error("Paramètre invalide dans la fonction 'addIconRecherche()', le paramètre 'table' à comme valeur actuelle: " + table);
}





////===== Bouton edit =====////
function editElement(id, table) {
    const url = '../pages/editer.html?id=' + id + '&table=' + table;
    window.location.href = url;
}



////==== Fonction pour vérifier si une option existe déjà dans un <select> ====//
/* Les select sont incrémentés dynamiquement. Pour éviter les doublons de valeur
on vérifie ici si une valeur n'existe pas déjà dans un select */

function optionExists(selectElement, value) {
    return Array.from(selectElement.options).some(option => option.value === value);
}
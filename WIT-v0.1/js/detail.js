////===== Variables =====////
var body = document.body;
var $paramID;
var $paramTABLE;

var $item_id;
var $item_name;
var $item_lieu_id;
var $item_emplacement_id;
var $item_caisse_id;
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
var $num_of_emplacements;
var $num_of_caisses;
var $num_of_objets;

var photoError = false;






////===== Récupération des paramètres url au chargement =====////
window.onload = function () {
    getQueryParams();
};







////===== Fonction pour obtenir les paramètres de l'URL =====////
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    $paramID = params.get('id'); //type string
    $paramTABLE = params.get('table'); // type string
    getItemsData($paramID, $paramTABLE);
}







////===== Récupérer les données de l'item =====////
function getItemsData(id, table) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/get_item_details.php?id=' + id + '&table=' + table, true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            // Succès de la requête
            var data = JSON.parse(xhr.responseText);
            $item_data = data;
            console.log('Données de l\'item de type: ' + $paramTABLE, data);
            if (data.id) $item_id = data.id;
            if (data.nom) $item_name = data.nom;
            if (data.lieu_id) $item_lieu_id = data.lieu_id;
            if (data.emplacement_id) $item_emplacement_id = data.emplacement_id;
            if (data.caisse_id) $item_caisse_id = data.caisse_id;
            if (data.theme_id) $item_theme_id = data.theme_id;
            if (data.description) $item_description = data.description;
            if (data.quantite) $item_quantite = data.quantite;
            if ($item_quantite === undefined) $item_quantite = 0;
            if (data.upload_folder_path) $uploadFolderPath = data.upload_folder_path;
            if (data.photo) $item_photo = data.photo;
            if (data.nom_lieu) $item_lieu_name = data.nom_lieu;
            if (data.nom_emplacement) $item_emplacement_name = data.nom_emplacement;
            if (data.nom_caisse) $item_caisse_name = data.nom_caisse;
            if (data.nom_theme) $item_theme_name = data.nom_theme;
            if (data.nombre_emplacements) $num_of_emplacements = data.nombre_emplacements;
            if (data.nombre_caisses) $num_of_caisses = data.nombre_caisses;
            if (data.nombre_objets) $num_of_objets = data.nombre_objets;
            if (!$num_of_emplacements || $num_of_emplacements === null || $num_of_emplacements === undefined) $num_of_emplacements = 0;
            if (!$num_of_caisses || $num_of_caisses === null || $num_of_caisses === undefined) $num_of_caisses = 0;
            if (!$num_of_objets || $num_of_objets === null || $num_of_objets === undefined) $num_of_objets = 0;
            createDetailPage();
            ajouterEncart($item_name, $paramTABLE, 'detail');

        } else {
            console.error('Erreur lors de la récupération des données:', xhr.status);
        }
    };
    xhr.onerror = function () {
        console.error('Erreur de connexion.');
    };
    xhr.send();
}// END getItemsData()






////=====  Créer la page de détail dynamiquement  =====////
function createDetailPage() {
    //Modifier légèrement la mise en page du texte du header car on ajouter l'encart
    const headerText = document.querySelector('.headerText');
    headerText.style.top = '0';

    //+ create main container
    const cardContainer = document.createElement('div');
    cardContainer.id = 'cardContainer';
    cardContainer.classList.add('detailCardContainer');
    cardContainer.classList.add($paramTABLE);

    const headerCard = document.createElement('div');
    headerCard.classList.add('detailHeaderCard');
    headerCard.classList.add($paramTABLE);


    const name = document.createElement('div');
    name.classList.add('nameDetail');//!============= if ici suivant les tables
    name.innerHTML = addIconRecherche($paramTABLE) + $item_name; //!============= if ici suivant les tables

    //+ créer edit button
    const editButton = document.createElement('div');
    editButton.id = 'editButton';
    editButton.classList.add('mdi');
    editButton.classList.add('mdi-pencil');
    //+ Add event listener for edit button
    editButton.addEventListener('click', function () {
        editElement($item_id, $paramTABLE);
    });

    headerCard.appendChild(name);
    headerCard.appendChild(editButton);
    cardContainer.appendChild(headerCard);

    body.appendChild(cardContainer);

    //+ créer les boutons en bas de page
    createLinkItem();

}//END createDetailPage







////===== Créer des boutons 'afficher les emplacment de ce lieux', 'afficher les caisses de ce lieu'... =====////
function createLinkItem() {
    const cardContainer = document.getElementById('cardContainer');

    if ($paramTABLE === 'lieux') {
        //+ bouton voir emplacements qui sont dans ce lieu
        const showEmplacement = document.createElement('div');
        showEmplacement.classList.add('showEmplacements');
        const numEmplacement = document.createElement('div');
        numEmplacement.classList.add('numDetail');
        const textEmplacement = document.createElement('div');
        numEmplacement.innerHTML = addIconRecherche('emplacements') + $num_of_emplacements;
        textEmplacement.innerHTML = "Voir ses emplacements";
        showEmplacement.appendChild(numEmplacement);
        showEmplacement.appendChild(textEmplacement);
        showEmplacement.addEventListener('click', function () {
            window.location.href = '../pages/emplacements.html?lieu_id=' + $paramID + '&tableName=' + $item_name;
        });
        cardContainer.appendChild(showEmplacement);
    }

    if ($paramTABLE === 'lieux' || $paramTABLE === 'emplacements') {
        //+ bouton voir caisses qui sont dans ce lieu
        var paramUrl;
        if ($paramTABLE === "lieux") paramUrl = 'lieu_id=';
        if ($paramTABLE === "emplacements") paramUrl = 'emplacement_id=';
        const showCaisse = document.createElement('div');
        showCaisse.classList.add('showCaisses');
        const numCaisse = document.createElement('div');
        numCaisse.classList.add('numDetail');
        const textCaisse = document.createElement('div');
        numCaisse.innerHTML = addIconRecherche('caisses') + $num_of_caisses;
        textCaisse.innerHTML = "Voir ses caisses";
        showCaisse.appendChild(numCaisse);
        showCaisse.appendChild(textCaisse);
        showCaisse.addEventListener('click', function () {
            window.location.href = '../pages/caisses.html?' + paramUrl + $paramID + '&tableName=' + $item_name;
        });
        cardContainer.appendChild(showCaisse);
    }

    if ($paramTABLE !== 'objets') {
        //+ bouton voir objets qui sont dans ce lieu
        const showObjet = document.createElement('div');
        showObjet.classList.add('showObjets');
        const numObjet = document.createElement('div');
        numObjet.classList.add('numDetail');
        const textObjet = document.createElement('div');
        numObjet.innerHTML = addIconRecherche('objets') + $num_of_objets;
        textObjet.innerHTML = "Voir ses objets";
        showObjet.appendChild(numObjet);
        showObjet.appendChild(textObjet);
        showObjet.addEventListener('click', function () {
            window.location.href = '../pages/objets.html?id=' + $paramID + '&table=' + $paramTABLE + '&tableName=' + $item_name;
        });
        cardContainer.appendChild(showObjet);
    }

    if ($paramTABLE === 'objets') {
        //+ Photo
        const photoContainer = document.createElement('div');
        photoContainer.classList.add('photoDetailContainerBis');
        const photo = document.createElement("img");
        photo.classList.add('photoBis');
        photo.id = 'photoBis';
        photoContainer.appendChild(photo);
        if ($item_photo) {
            photo.src = $uploadFolderPath + $item_photo;
        }
        else {
            photo.src = '../img/default-photo.png';
            photoError = true;
        }
        photo.onerror = function () {
            console.error("La photo n\'existe pas ou n\'a pas pu être chargée. Lien vers la photo: '" + $item_photo + "'.");
            // Ici, vous pouvez définir une image de remplacement ou une action alternative
            photoDetail.src = '../img/default-photo.png';
            photoError = true;
        };
        cardContainer.appendChild(photoContainer);
        photoAgrandie(photo.id, $uploadFolderPath + $item_photo);


        //+ Lieu
        const lieuObjet = document.createElement('div');
        lieuObjet.classList.add('detailObjet');
        lieuObjet.innerHTML = addIconRecherche('lieux') + $item_lieu_name;
        cardContainer.appendChild(lieuObjet);

        //+ Emplacement
        const emplacementObjet = document.createElement('div');
        emplacementObjet.classList.add('detailObjet');
        emplacementObjet.innerHTML = addIconRecherche('emplacements') + $item_emplacement_name;
        cardContainer.appendChild(emplacementObjet);

        //+ Caisse
        const caisseObjet = document.createElement('div');
        caisseObjet.classList.add('detailObjet');
        caisseObjet.innerHTML = addIconRecherche('caisses') + $item_caisse_name;
        cardContainer.appendChild(caisseObjet);

        //+ Thème
        const themeObjet = document.createElement('div');
        themeObjet.classList.add('detailObjet');
        themeObjet.innerHTML = addIconRecherche('themes') + $item_theme_name;
        cardContainer.appendChild(themeObjet);

        //+ Quantité
        const quantiteObjet = document.createElement('div');
        quantiteObjet.classList.add('detailObjet');
        quantiteObjet.textContent = "Quantité: " + $item_quantite;
        cardContainer.appendChild(quantiteObjet);

        //+ Description
        const descriptionObjet = document.createElement('div');
        descriptionObjet.classList.add('descriptionObjet');
        descriptionObjet.innerHTML = $item_description;
        cardContainer.appendChild(descriptionObjet);
    }
}// END createLinkItem()





////=========  Fonction pour agrandir la photo lors du click  =========/////
function photoAgrandie(elementId, photoSource) {
    if (!photoError) {
        const vignettePhoto = document.getElementById(elementId);
        const body = document.body;


        const photoContainer = document.createElement('div');
        photoContainer.style.display = 'none';
        photoContainer.id = 'photoAgrandieContainer';

        const photo = document.createElement('img');
        photo.src = photoSource;

        const closePhotoButton = document.createElement('div');
        closePhotoButton.id = 'closePhotoButton';
        closePhotoButton.classList.add('mdi');
        closePhotoButton.classList.add('mdi-close');
        closePhotoButton.addEventListener('click', function () {
            photoContainer.style.display = 'none';
        });

        photoContainer.appendChild(closePhotoButton);
        photoContainer.appendChild(photo);
        body.appendChild(photoContainer);

        vignettePhoto.addEventListener('click', function () {
            photoContainer.style.display = 'flex';
        });
    }
}// END photoAgrandie()




////===== Chargement de tous les objets et ajout dynamique dans la page =====////
var photoError = false;
document.addEventListener('DOMContentLoaded', function () {

    var urlParam;


    const params = new URLSearchParams(window.location.search);
    const isEmpty = [...params.entries()].length === 0;
    if (!isEmpty) {
        $paramID = params.get('id');
        $paramTABLE = params.get('table');
        $tableName = params.get('tableName');
        $page = 'objets';
        if ($paramID && $paramTABLE) {
            urlParam = "?id=" + $paramID + "&table=" + $paramTABLE;
        }
        //Modifier légèrement la mise en page du texte du header car on ajouter l'encart
        const headerText = document.querySelector('.headerText');
        headerText.style.top = '0';
    }
    else {
        urlParam = "?id=all&table=all";
    }




    fetch('../php/get_objets.php' + urlParam)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau : ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const objetList = document.getElementById('objetsListe');
            //+ On ajoute l'encart
            if (!isEmpty) {
                ajouterEncart($tableName, $paramTABLE, $page);
            }
            else {
                showFilterMenu();
            }
            //+ Si pas de données
            if (!data || data.length === 0) {
                const listItem = document.createElement('li');
                listItem.classList.add('itemList');
                listItem.textContent = 'Aucun objet existant';
                objetList.appendChild(listItem);
            }
            //+ Si on à reçu des données
            else {


                // Trier les emplacements par ordre alphabétique
                data.sort((a, b) => a.nom.localeCompare(b.nom));
                // Ajouter les lieux triés à la liste
                data.forEach(objet => {
                    var $uploadFolderPath = objet.upload_folder_path;

                    var caisseName = "Sans caisse";
                    var emplacementName = "Sans emplacement";
                    var description = "Pas de description";
                    if (objet.emplacement_nom !== null) {
                        emplacementName = objet.emplacement_nom;
                    }
                    if (objet.caisse_nom !== null) {
                        caisseName = objet.caisse_nom;
                    }
                    if (objet.description !== null) {
                        description = objet.description;
                    }
                    if (objet.description === '') {
                        description = "Pas de description";
                    }


                    const listItem = document.createElement('div');
                    listItem.classList.add('vignetteListContainerObjet');
                    listItem.dataset.lieux = objet.lieu_nom;
                    listItem.dataset.emplacements = objet.emplacement_nom;
                    listItem.dataset.caisses = objet.caisse_nom;
                    listItem.dataset.themes = objet.theme_nom;

                    const headerVignette = document.createElement('div');
                    headerVignette.classList.add('vignetteListNameObjet');
                    const nomItem = document.createElement('div');
                    nomItem.innerHTML = addIconRecherche('objets') + objet.nom;
                    headerVignette.appendChild(nomItem);

                    //+++++ Bouton éditer
                    const editButton = document.createElement('i');
                    editButton.id = 'editButton';
                    editButton.classList.add('mdi');
                    editButton.classList.add('mdi-pencil');
                    editButton.addEventListener('click', function(){
                        editElement(objet.id, 'objets');
                    });
                    headerVignette.appendChild(editButton);



                    const detailItemMaster = document.createElement('div');
                    detailItemMaster.classList.add('vignetteDetailMasterObjet');

                    //+ créer un visuel avec la photo
                    const objetPhotoContainer = document.createElement('div');
                    objetPhotoContainer.classList.add('vignetteDetailPhotoContainer');
                    const objetPhoto = document.createElement('img');
                    objetPhoto.id = 'photo-' + objet.id;
                    objetPhoto.classList.add('vignetteDetailPhoto')
                    if (objet.photo && objet.photo !== "" && objet.photo !== null) {
                        objetPhoto.src = $uploadFolderPath + objet.photo;
                        photoError = false;
                        
                    }
                    else {
                        objetPhoto.src = '../img/default-photo.png';
                        photoError = true;
                    }
                    objetPhotoContainer.appendChild(objetPhoto);
                    detailItemMaster.appendChild(objetPhotoContainer);

                    const detailItemContainer = document.createElement('div');
                    detailItemContainer.classList.add('vignetteListDetailObjet');

                    const detailHaut = document.createElement('div');
                    detailHaut.classList.add('vignetteObjetDetailHaut');
                    detailHaut.innerHTML = addIconRecherche('lieux') + objet.lieu_nom;
                    const detailMilieu = document.createElement('div');
                    detailMilieu.classList.add('vignetteObjetDetailMilieu');
                    detailMilieu.innerHTML = addIconRecherche('emplacements') + emplacementName;
                    const detailBas = document.createElement('div');
                    detailBas.classList.add('vignetteObjetDetailBas');
                    detailBas.innerHTML = addIconRecherche('caisses') + caisseName;
                    const detailBasBas = document.createElement('div');
                    detailBasBas.classList.add('vignetteDetailObjetBasBas');
                    detailBasBas.innerHTML = addIconRecherche('themes') + objet.theme_nom
                    detailItemContainer.appendChild(detailHaut);
                    detailItemContainer.appendChild(detailMilieu);
                    detailItemContainer.appendChild(detailBas);
                    detailItemContainer.appendChild(detailBasBas);




                    const detailItemContainerBis = document.createElement('div');
                    detailItemContainerBis.classList.add('vignetteListDetailBisObjet');

                    const iconQuantite = document.createElement('i');
                    iconQuantite.classList.add('mdi');
                    iconQuantite.classList.add('mdi-infinity');
                    const detailQuantite = document.createElement('div');
                    detailQuantite.classList.add('vignetteObjetQuantite');
                    detailQuantite.innerHTML = objet.quantite;
                    detailItemContainerBis.appendChild(iconQuantite);
                    detailItemContainerBis.appendChild(detailQuantite);


                    const descriptionContainer = document.createElement('div');
                    descriptionContainer.classList.add('vignetteDetailObjetDescription')
                    descriptionContainer.textContent = description;



                    detailItemMaster.appendChild(detailItemContainer);
                    detailItemMaster.appendChild(detailItemContainerBis);

                    listItem.appendChild(headerVignette);
                    listItem.appendChild(detailItemMaster);
                    listItem.appendChild(descriptionContainer);


                    objetList.appendChild(listItem);
                    photoAgrandie(objetPhoto.id, objetPhoto.src)
                });
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des objets:', error);
        });


});





////=============================================================================////
////                 APPLIQUER LE FILTRE DANS LA LISTE D'OBJETS                  ////
////=============================================================================////

//+++++ Afficher / masquer le menu de filtre
function showFilterMenu() {
    const filterButton = document.getElementById('filterBouton');
    filterButton.style.display = 'flex';
    const filterList = document.getElementById('filterList');

    filterButton.addEventListener('click', function () {
        if (filterList.style.display === 'none') {
            filterList.style.display = 'flex';
        }
        else {
            filterList.style.display = 'none';
        }
    });

    const filtres = document.querySelectorAll('.filterItem');
    const objetsListe = document.getElementById('objetsListe');
    filtres.forEach(filtre => {
        filtre.addEventListener('click', function () {
            filterObjets(filtre.dataset.filtre, filterList, objetsListe);

        });
    });

}

//+++++ Appliquer les filtres
function filterObjets(table, filterList, objetListe) {
    filterList.style.display = 'none';

    // Récupérer tous les objets, en ignorant les séparateurs
    const objects = Array.from(objetListe.children).filter(child => !child.classList.contains('separator'));

    // Grouper les objets par la valeur du filtre
    const groupedObjects = objects.reduce((groups, obj) => {
        const key = obj.dataset[table];
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(obj);
        return groups;
    }, {});

    // Supprimer le contenu actuel de objetListe
    objetListe.innerHTML = '';

    // Trier les clés des groupes par ordre alphabétique
    const sortedKeys = Object.keys(groupedObjects).sort();

    // Réinsérer les objets groupés et triés dans la page
    sortedKeys.forEach(key => {
        var separatorText = key;
        if (table === 'emplacements' && (!key || key === null || key === 'null')) {
            separatorText = 'Sans emplacement';
        }
        else if (table === 'caisses' && (!key || key === null || key === 'null')) {
            separatorText = 'Sans caisse';
        }
        // Créer une ligne de séparation
        const separator = document.createElement('div');
        separator.innerHTML = addIconRecherche(table) + separatorText;
        separator.className = 'separator';
        objetListe.appendChild(separator);

        // Trier les objets à l'intérieur du groupe par ordre alphabétique du nom (ou autre critère)
        groupedObjects[key].sort((a, b) => {
            const nameA = a.querySelector('.vignetteListNameObjet').innerText.toUpperCase();
            const nameB = b.querySelector('.vignetteListNameObjet').innerText.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });

        // Ajouter les objets sous la ligne de séparation
        groupedObjects[key].forEach(obj => {
            objetListe.appendChild(obj);
        });
    });
}

////========    Visuel agrandi pour la photo    =========////
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
}
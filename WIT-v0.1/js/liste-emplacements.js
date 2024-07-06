////===== Chargement de tous les emplacements et ajout dynamique dans la page =====////
document.addEventListener('DOMContentLoaded', function () {

    var urlParam;

    const params = new URLSearchParams(window.location.search);
    const isEmpty = [...params.entries()].length === 0;
    if (!isEmpty) {
        $lieu_id = params.get('lieu_id'); //* type string
        $tableName = params.get('tableName');
        $paramTABLE = 'lieux';
        $page = 'emplacements';
        if ($lieu_id) {
            urlParam = "?lieu_id=" + $lieu_id;
        }
        //Modifier légèrement la mise en page du texte du header car on ajouter l'encart
        const headerText = document.querySelector('.headerText');
        headerText.style.top = '0';
    }
    else {
        urlParam = "?all_emplacements";
    }




    fetch('../php/get_emplacements.php' + urlParam)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau : ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            //+ On ajoute l'encart
            if (!isEmpty) {
                ajouterEncart($tableName, $paramTABLE);
            }
            const emplacementList = document.getElementById('emplacementList');

            if (!data || data.length === 0) {

                const listItem = document.createElement('li');
                listItem.textContent = 'Aucun emplacement existant';
                emplacementList.appendChild(listItem);
            } else {
                // Trier les emplacements par ordre alphabétique
                data.sort((a, b) => a.nom.localeCompare(b.nom));

                // Ajouter les emplacements triés à la liste
                data.forEach(emplacement => {
                    const listItem = document.createElement('div');
                    listItem.classList.add('vignetteListContainerEmplacement');

                    const headerVignette = document.createElement('div');
                    headerVignette.classList.add('vignetteListNameEmplacement')
                    const nomItem = document.createElement('div');
                    nomItem.innerHTML = addIconRecherche('emplacements') + emplacement.nom;
                    headerVignette.appendChild(nomItem);

                    //+++++ Bouton éditer
                    const editButton = document.createElement('i');
                    editButton.id = 'editButton';
                    editButton.classList.add('mdi');
                    editButton.classList.add('mdi-pencil');
                    editButton.addEventListener('click', function () {
                        editElement(emplacement.id, 'emplacements');
                    });
                    headerVignette.appendChild(editButton);

                    listItem.appendChild(headerVignette);

                    const detailItem = document.createElement('div');
                    detailItem.classList.add('vignetteListDetail');
                    const detailGauche = document.createElement('div');
                    detailGauche.classList.add('vignetteEmplacementDetailGauche');
                    detailGauche.innerHTML = addIconRecherche('lieux') + emplacement.lieu_nom;
                    const detailMilieu = document.createElement('div');
                    detailMilieu.classList.add('vignetteEmplacementDetailMilieu');
                    detailMilieu.innerHTML = addIconRecherche('caisses') + emplacement.nombre_caisses;
                    const detailDroite = document.createElement('div');
                    detailDroite.classList.add('vignetteEmplacementDetailDroite');
                    detailDroite.innerHTML = addIconRecherche('objets') + emplacement.nombre_objets;
                    detailItem.appendChild(detailGauche);
                    detailItem.appendChild(detailMilieu);
                    detailItem.appendChild(detailDroite);
                    listItem.appendChild(detailItem);

                    detailMilieu.addEventListener('click', function () {
                        window.location.href = '../pages/caisses.html?emplacement_id=' + emplacement.id + '&tableName=' + emplacement.nom;
                    });
                    detailDroite.addEventListener('click', function () {
                        window.location.href = '../pages/objets.html?id=' + emplacement.id + '&table=emplacements' + '&tableName=' + emplacement.nom;
                    });

                    emplacementList.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des emplacements:', error);
        });
});
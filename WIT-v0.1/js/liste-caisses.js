////===== Chargement de toutes les caisses et ajout dynamique dans la page =====////
document.addEventListener('DOMContentLoaded', function () {

    var urlParam;

    const params = new URLSearchParams(window.location.search);
    const isEmpty = [...params.entries()].length === 0;
    if (!isEmpty) {
        $lieu_id = params.get('lieu_id'); //* type string
        $emplacement_id = params.get('emplacement_id'); //* type string
        $tableName = params.get('tableName');
        $page = 'caisses';
        if ($lieu_id) {
            urlParam = "?lieu_id=" + $lieu_id;
            $paramTABLE = "lieux";
        }
        if ($emplacement_id) {
            urlParam = "?emplacement_id=" + $emplacement_id;
            $paramTABLE = "emplacements";
        }
        //Modifier légèrement la mise en page du texte du header car on ajouter l'encart
        const headerText = document.querySelector('.headerText');
        headerText.style.top = '0';
    }
    else {
        urlParam = "?all_caisses";
    }


    fetch('../php/get_caisses.php' + urlParam)
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
                ajouterEncart($tableName, $paramTABLE, $page);
            }
            const caissesList = document.getElementById('caissesList');

            if (!data || data.length === 0) {

                const listItem = document.createElement('li');
                listItem.textContent = 'Aucune caisse existante';
                caissesList.appendChild(listItem);
            } else {
                // Trier les caisses par ordre alphabétique
                data.sort((a, b) => a.nom.localeCompare(b.nom));

                // Ajouter les caisses triées à la liste
                data.forEach(caisse => {
                    var emplacementName = "Sans emplacement";
                    if (caisse.emplacement_nom !== null) {
                        emplacementName = caisse.emplacement_nom;
                    }


                    const listItem = document.createElement('div');
                    listItem.classList.add('vignetteListContainerCaisse');

                    const headerVignette = document.createElement('div');
                    headerVignette.classList.add('vignetteListNameCaisse');
                    const nomItem = document.createElement('div');
                    nomItem.innerHTML = addIconRecherche('caisses') + caisse.nom;
                    headerVignette.appendChild(nomItem);

                    //+++++ Bouton éditer
                    const editButton = document.createElement('i');
                    editButton.id = 'editButton';
                    editButton.classList.add('mdi');
                    editButton.classList.add('mdi-pencil');
                    editButton.addEventListener('click', function () {
                        editElement(caisse.id, 'caisses');
                    });
                    headerVignette.appendChild(editButton);

                    listItem.appendChild(headerVignette);


                    const detailItemMaster = document.createElement('div');
                    detailItemMaster.classList.add('vignetteDetailMaster');

                    const detailItemContainer = document.createElement('div');
                    detailItemContainer.classList.add('vignetteListDetailCaisse');

                    const detailGauche = document.createElement('div');
                    detailGauche.classList.add('vignetteCaisseDetailGauche');
                    detailGauche.innerHTML = addIconRecherche('lieux') + caisse.lieu_nom;
                    const detailMilieu = document.createElement('div');
                    detailMilieu.classList.add('vignetteCaisseDetailMilieu');
                    detailMilieu.innerHTML = addIconRecherche('emplacements') + emplacementName;

                    const detailItemContainerBis = document.createElement('div');
                    detailItemContainerBis.classList.add('vignetteListDetailBisCaisse');

                    const detailDroite = document.createElement('div');
                    detailDroite.classList.add('vignetteCaisseDetailDroite');
                    detailDroite.innerHTML = addIconRecherche('objets') + caisse.nombre_objets;

                    detailItemContainer.appendChild(detailGauche);
                    detailItemContainer.appendChild(detailMilieu);

                    detailItemContainerBis.appendChild(detailDroite);

                    detailItemMaster.appendChild(detailItemContainer);

                    detailItemMaster.appendChild(detailItemContainerBis);
                    detailItemContainerBis.addEventListener('click', function () {
                        window.location.href = '../pages/objets.html?id=' + caisse.id + '&table=caisses' + '&tableName=' + caisse.nom;
                    });

                    listItem.appendChild(detailItemMaster);


                    caissesList.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des caisses:', error);
        });
});
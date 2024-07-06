////===== Chargement de tous les lieux et ajout dynamique dans la page =====////
document.addEventListener('DOMContentLoaded', function () {
    fetch('../php/get_lieux.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau : ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const lieuxList = document.getElementById('lieuxList');
            console.log(data);

            if (!data || data.length === 0) {
                const listItem = document.createElement('li');
                listItem.textContent = 'Aucun lieu existant';
                lieuxList.appendChild(listItem);
            } else {
                // Trier les lieux par ordre alphabétique
                data.sort((a, b) => a.nom.localeCompare(b.nom));

                // Ajouter les lieux triés à la liste
                data.forEach(lieu => {
                    const listItem = document.createElement('div');
                    listItem.classList.add('vignetteListContainerLieu');

                    const headerVignette = document.createElement('div');
                    headerVignette.classList.add('vignetteListNameLieu');
                    const nomItem = document.createElement('div');
                    nomItem.innerHTML = addIconRecherche('lieux') + lieu.nom;
                    headerVignette.appendChild(nomItem);

                    //+++++ Bouton éditer
                    const editButton = document.createElement('i');
                    editButton.id = 'editButton';
                    editButton.classList.add('mdi');
                    editButton.classList.add('mdi-pencil');
                    editButton.addEventListener('click', function () {
                        editElement(lieu.id, 'lieux');
                    });
                    headerVignette.appendChild(editButton);

                    listItem.appendChild(headerVignette);

                    const detailItemContainer = document.createElement('div');
                    detailItemContainer.classList.add('vignetteListDetail');
                    const detailGauche = document.createElement('div');
                    detailGauche.classList.add('vignetteLieuDetailGauche');
                    detailGauche.innerHTML = addIconRecherche('emplacements') + lieu.nombre_emplacements;
                    const detailMilieu = document.createElement('div');
                    detailMilieu.classList.add('vignetteLieuDetailMilieu');
                    detailMilieu.innerHTML = addIconRecherche('caisses') + lieu.nombre_caisses;
                    const detailDroite = document.createElement('div');
                    detailDroite.classList.add('vignetteLieuDetailDroite');
                    detailDroite.innerHTML = addIconRecherche('objets') + lieu.nombre_objets;
                    detailItemContainer.appendChild(detailGauche);
                    detailItemContainer.appendChild(detailMilieu);
                    detailItemContainer.appendChild(detailDroite);
                    listItem.appendChild(detailItemContainer);

                    

                    detailGauche.addEventListener('click', function () {
                        window.location.href = '../pages/emplacements.html?lieu_id=' + lieu.id + '&tableName=' + lieu.nom;
                    });

                    detailMilieu.addEventListener('click', function () {
                        window.location.href = '../pages/caisses.html?lieu_id=' + lieu.id + '&tableName=' + lieu.nom;
                    });

                    detailDroite.addEventListener('click', function () {
                        console.log('../pages/objets.html?id=' + lieu.id + '&table=lieux' + '&tableName=' + lieu.nom);
                        window.location.href = '../pages/objets.html?id=' + lieu.id + '&table=lieux' + '&tableName=' + lieu.nom;
                    });

                    lieuxList.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des lieux:', error);
        });
});


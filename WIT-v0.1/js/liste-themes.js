////===== Chargement de tous les thèmes et ajout dynamique dans la page =====////
document.addEventListener('DOMContentLoaded', function () {
    fetch('../php/get_themes.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau : ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const themeList = document.getElementById('themesList');

            if (!data || data.length === 0) {

                const listItem = document.createElement('li');
                listItem.textContent = 'Aucun thème existant';
                themeList.appendChild(listItem);
            } else {
                // Trier les emplacements par ordre alphabétique
                data.sort((a, b) => a.nom.localeCompare(b.nom));

                // Ajouter les lieux triés à la liste
                data.forEach(theme => {
                    const listItem = document.createElement('div');
                    listItem.classList.add('vignetteListContainerTheme');

                    const headerVignette = document.createElement('div');
                    headerVignette.classList.add('vignetteListNameTheme');
                    const nomItem = document.createElement('div');
                    nomItem.innerHTML = addIconRecherche('themes') + theme.nom;
                    headerVignette.appendChild(nomItem);

                    //+++++ Bouton éditer
                    const editButton = document.createElement('i');
                    editButton.id = 'editButton';
                    editButton.classList.add('mdi');
                    editButton.classList.add('mdi-pencil');
                    editButton.addEventListener('click', function () {
                        editElement(theme.id, 'themes');
                    });
                    headerVignette.appendChild(editButton);

                    listItem.appendChild(headerVignette);

                    const detailItemContainer = document.createElement('div');
                    detailItemContainer.classList.add('vignetteListDetailTheme');
                    const detail = document.createElement('div');
                    detail.classList.add('vignetteThemeDetailBas');
                    detail.innerHTML = addIconRecherche('objets') + theme.nombre_objets;

                    detailItemContainer.addEventListener('click', function () {
                        //console.log("Voir les objets contenu dans l'id: '" + $paramID + "' de la table: '" + $paramTABLE);// <== OK
                        window.location.href = '../pages/objets.html?id=' + theme.id + '&table=themes' + '&tableName=' + theme.nom;
                    });

                    detailItemContainer.appendChild(detail);
                    listItem.appendChild(detailItemContainer);

                    themeList.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des emplacements:', error);
        });
});
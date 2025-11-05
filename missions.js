document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const menu = document.getElementById('menu');
    const overlay = document.getElementById('overlay');
    const addPopup = document.getElementById('addPopup');
    const editPopup = document.getElementById('editPopup');
    const deletePopup = document.getElementById('deletePopup');
    const addMissionBtn = document.getElementById('addMissionBtn');
    const deleteMissionBtn = document.getElementById('deleteMissionBtn');
    const favoriteMissionBtn = document.getElementById('favoriteMissionBtn');
    const favButton = document.getElementById('fav');
    const favPopup = document.getElementById('favPopup');
    const closePopup = document.getElementById('closePopup');
    const favPopupContent = document.getElementById('favPopupContent');
    const favNumElement = document.getElementById('fav-num');
    const emptyHeart = "IMAGES/love.png";
    const filledHeart = "IMAGES/heart.png";
    const searchInput = document.querySelector('.Nagbar input[type="search"]');
    const agencySelect = document.getElementById('agencySelect');
    const yearFilter = document.getElementById('yearFilter');
    let editingId = null;
    let isFavoritesMode = false;
    // Update favorite count display
    function updateFavoriteCount() {
        favNumElement.textContent = favorites.length;
    }
    // Show favorite missions popup
    function showFavPopup() {
        favPopup.classList.remove('hidden');
        renderFavPopup();
    }
    // Hide favorite missions popup
    function hideFavPopup() {
        favPopup.classList.add('hidden');
    }
    // Render favorite missions in the popup
    function renderFavPopup() {
        favPopupContent.innerHTML = '';
        if (favorites.length === 0) {
            favPopupContent.innerHTML = '<p class="no-favorites">No favorite missions yet!</p>';
            return;
        }
        const favMissions = data.filter(m => favorites.includes(m.id));
        favMissions.forEach(mission => {
            const missionElement = document.createElement('div');
            missionElement.className = 'fav-popup-item';
            missionElement.innerHTML = `
                <img src="${mission.image}" class="fav-popup-item-img" alt="${mission.name}">
                <div class="fav-popup-item-content">
                    <h3 class="fav-popup-item-title">${mission.name}</h3>
                    <p class="fav-popup-item-details">
                        <strong>Agency:</strong> ${mission.agency}<br>
                        <strong>Launch Date:</strong> ${mission.launchDate}<br>
                        <strong>Objective:</strong> ${mission.objective}
                    </p>
                </div>
            `;
            favPopupContent.appendChild(missionElement);
        });
    }
    // === POPUPS ===
    const showPopup = (popup) => {
        overlay.classList.remove('hidden');
        popup.classList.remove('hidden');
    };
    const hidePopups = () => {
        overlay.classList.add('hidden');
        addPopup.classList.add('hidden');
        editPopup.classList.add('hidden');
        deletePopup.classList.add('hidden');
    };
    // === MENU ===
    hamburgerBtn.addEventListener('click', () => menu.classList.toggle('hidden'));
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            menu.classList.add('hidden');
        }
    });
    // === FAVORITE BUTTON (HEADER) ===
    favButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (favPopup.classList.contains('hidden')) {
            showFavPopup();
        } else {
            hideFavPopup();
        }
    });
    closePopup.addEventListener('click', (e) => {
        e.stopPropagation();
        hideFavPopup();
    });
    document.addEventListener('click', (e) => {
        if (!favPopup.contains(e.target) && !favButton.contains(e.target)) {
            hideFavPopup();
        }
    });
    // === ADD MISSION ===
    addMissionBtn.addEventListener('click', () => {
        menu.classList.add('hidden');
        hidePopups();
        showPopup(addPopup);
        document.getElementById('newName').focus();
    });
    document.getElementById('saveMission').addEventListener('click', () => {
        const name = document.getElementById('newName').value.trim();
        const agency = document.getElementById('newAgency').value.trim();
        const objective = document.getElementById('newObjective').value.trim();
        const date = document.getElementById('newDate').value.trim();
        const image = document.getElementById('newImage').value.trim();
        const desc = document.getElementById('newDesc').value.trim();
        if (!name || !agency || !objective || !date || !image || !desc) {
            alert('Please fill all fields!');
            return;
        }
        if (!/^\d{4}\/\d{2}\/\d{2}$/.test(date)) {
            alert('Date must be YYYY/MM/DD (e.g. 1969/07/16)');
            return;
        }
        const newMission = {
            id: Date.now(),
            name,
            agency,
            objective,
            launchDate: date,
            image,
            description: desc
        };
        data.push(newMission);
        isFavoritesMode = false;
        renderMissions(data);
        populateAgencySelect();
        hidePopups();
        clearAddForm();
    });
    document.getElementById('cancelAdd').addEventListener('click', () => {
        hidePopups();
        clearAddForm();
    });
    function clearAddForm() {
        ['newName', 'newAgency', 'newObjective', 'newDate', 'newImage', 'newDesc'].forEach(id => {
            document.getElementById(id).value = '';
        });
    }
    // === DELETE MISSION (from menu) ===
    deleteMissionBtn.addEventListener('click', () => {
        menu.classList.add('hidden');
        alert('Click the trash icon on any mission card to delete it.');
    });
    // === DELETE CONFIRM (from popup) ===
    document.getElementById('confirmDelete').addEventListener('click', () => {
        if (!editingId) {
            alert('No mission selected!');
            hidePopups();
            return;
        }
        const idx = data.findIndex(m => m.id === editingId);
        if (idx === -1) {
            alert('Mission not found!');
            hidePopups();
            return;
        }
        const deletedId = data[idx].id;
        data.splice(idx, 1);
        favorites = favorites.filter(id => id !== deletedId);
        updateFavoriteCount();
        editingId = null;
        isFavoritesMode = false;
        renderMissions(data);
        populateAgencySelect();
        hidePopups();
    });
    document.getElementById('cancelDelete').addEventListener('click', () => {
        hidePopups();
        editingId = null;
    });
    // === EDIT MISSION ===
    document.getElementById('saveEdit').addEventListener('click', () => {
        const name = document.getElementById('editName').value.trim();
        const agency = document.getElementById('editAgency').value.trim();
        const objective = document.getElementById('editObjective').value.trim();
        const date = document.getElementById('editDate').value.trim();
        const image = document.getElementById('editImage').value.trim();
        const desc = document.getElementById('editDesc').value.trim();
        if (!name || !agency || !objective || !date || !image || !desc) {
            alert('Please fill all fields!');
            return;
        }
        if (!/^\d{4}\/\d{2}\/\d{2}$/.test(date)) {
            alert('Date must be YYYY/MM/DD (e.g. 1969/07/16)');
            return;
        }
        const mission = data.find(m => m.id === editingId);
        if (!mission) {
            alert('Mission not found!');
            return;
        }
        mission.name = name;
        mission.agency = agency;
        mission.objective = objective;
        mission.launchDate = date;
        mission.image = image;
        mission.description = desc;
        isFavoritesMode = false;
        renderMissions(data);
        populateAgencySelect();
        hidePopups();
        clearEditForm();
    });
    document.getElementById('cancelEdit').addEventListener('click', () => {
        hidePopups();
        clearEditForm();
    });
    function clearEditForm() {
        ['editName', 'editAgency', 'editObjective', 'editDate', 'editImage', 'editDesc'].forEach(id => {
            document.getElementById(id).value = '';
        });
        editingId = null;
    }
    overlay.addEventListener('click', hidePopups);
    // === FAVORITE MODE (MENU) ===
    favoriteMissionBtn.addEventListener('click', () => {
        menu.classList.add('hidden');
        isFavoritesMode = true;
        if (favorites.length === 0) {
            alert('No favorite missions yet!');
            renderMissions([]);
            return;
        }
        const favMissions = data.filter(m => favorites.includes(m.id));
        renderMissions(favMissions);
    });
    // === FILTERS ===
    function populateAgencySelect() {
        if (!agencySelect) return;
        agencySelect.innerHTML = '<option value="">AGENCY</option>';
        const agencies = [...new Set(data.map(m => m.agency).filter(Boolean))].sort();
        agencies.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a;
            opt.textContent = a;
            agencySelect.appendChild(opt);
        });
    }
    function filterMissions() {
        isFavoritesMode = false;
        let list = data;
        const s = searchInput.value.trim().toLowerCase();
        if (s) list = list.filter(m => m.name.toLowerCase().includes(s));
        const a = agencySelect.value;
        if (a) list = list.filter(m => m.agency === a);
        const y = yearFilter.value.trim();
        if (y) list = list.filter(m => m.launchDate.split('/')[0] === y);
        renderMissions(list);
    }
    searchInput.addEventListener('input', filterMissions);
    agencySelect.addEventListener('change', filterMissions);
    yearFilter.addEventListener('input', filterMissions);
    // === RENDER MISSIONS ===
    function renderMissions(missions) {
        const container = document.getElementById('fist-row');
        container.innerHTML = '';
        missions.forEach(m => {
            const fav = favorites.includes(m.id);
            container.innerHTML += `
                <div class="container">
                    <span class="missionstilte"><h1>${m.name}</h1><hr id="UNDRELINE"></span>
                    <div class="contt">
                        <div class="mission-img"><img src="${m.image}" alt="${m.name}"></div>
                        <div class="d-text">
                            <div class="Box-Details">
                                <h1>DETAILS:</h1>
                                <p>Agency: ${m.agency}</p>
                                <p>Launch Date: ${m.launchDate}</p>
                                <p>Objective: ${m.objective}</p>
                            </div>
                            <div class="Box-Description">
                                <h1>DESCRIPTION:</h1>
                                <p>${m.description}</p>
                            </div>
                        </div>
                    </div>
                    <div class="button-Explore">
                        <button class="edit-button img-btn" data-id="${m.id}" title="Edit mission">
                            <img src="IMAGES/edit_9741028.png" alt="Edit" class="edit-img">
                        </button>
                        <button class="favorite-button img-btn" data-id="${m.id}"
                                title="${fav ? 'Remove from favorites' : 'Add to favorites'}">
                            <img src="${fav ? filledHeart : emptyHeart}" alt="Favorite" class="fav-img">
                        </button>
                        <button class="delete-button img-btn" data-id="${m.id}" title="Delete mission">
                            <img src="IMAGES/trash-can_8861406.png" alt="delete" class="delete-img">
                        </button>
                    </div>
                </div>`;
        });
    }
    // === MAIN CLICK HANDLER (Edit, Favorite, Delete) ===
    const container = document.getElementById('fist-row');
    container.addEventListener('click', e => {
        const target = e.target;
        // === TOGGLE FAVORITE ===
        const favBtn = target.closest('.favorite-button');
        if (favBtn) {
            const id = Number(favBtn.dataset.id);
            const img = favBtn.querySelector('.fav-img');
            const idx = favorites.indexOf(id);
            if (idx === -1) {
                favorites.push(id);
                img.src = filledHeart;
                favBtn.title = 'Remove from favorites';
            } else {
                favorites.splice(idx, 1);
                img.src = emptyHeart;
                favBtn.title = 'Add to favorites';
            }
            updateFavoriteCount();
            if (!favPopup.classList.contains('hidden')) renderFavPopup();
            if (isFavoritesMode) {
                renderMissions(data.filter(m => favorites.includes(m.id)));
            } else {
                filterMissions();
            }
            return;
        }
        // === EDIT MISSION ===
        const editBtn = target.closest('.edit-button');
        if (editBtn) {
            const id = Number(editBtn.dataset.id);
            const mission = data.find(m => m.id === id);
            if (!mission) return;
            editingId = id;
            document.getElementById('editName').value = mission.name;
            document.getElementById('editAgency').value = mission.agency;
            document.getElementById('editObjective').value = mission.objective;
            document.getElementById('editDate').value = mission.launchDate;
            document.getElementById('editImage').value = mission.image;
            document.getElementById('editDesc').value = mission.description;
            showPopup(editPopup);
            document.getElementById('editName').focus();
            return;
        }
        // === DELETE MISSION ===
        const deleteBtn = target.closest('.delete-button');
        if (deleteBtn) {
            const id = Number(deleteBtn.dataset.id);
            const mission = data.find(m => m.id === id);
            if (!mission) return;
            editingId = id;
            showPopup(deletePopup);
            return;
        }
    });
    // === INITIALIZE ===
    populateAgencySelect();
    renderMissions(data);
    updateFavoriteCount();
});
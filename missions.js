const hamburgerBtn = document.querySelector('.hamburger-btn');
const menu = document.getElementById('menu');
const overlay = document.getElementById('overlay');
const addPopup = document.getElementById('addPopup');
const deletePopup = document.getElementById('deletePopup');
const addMissionBtn = document.getElementById('addMissionBtn');
const deleteMissionBtn = document.getElementById('deleteMissionBtn');
const favoriteMissionBtn = document.getElementById('favoriteMissionBtn');
const emptyHeart = "IMAGES/love.png";
const filledHeart = "IMAGES/heart.png";
// Nagbar
const searchInput = document.querySelector('.Nagbar input[type="search"]');
const agencySelect = document.getElementById('agencySelect');
const yearFilter = document.getElementById('yearFilter');


const showPopup = (popup) => {
  overlay.classList.remove('hidden');
  popup.classList.remove('hidden');
};
const hidePopups = () => {
  overlay.classList.add('hidden');
  addPopup.classList.add('hidden');
  deletePopup.classList.add('hidden');
};

/* --------------------------------------------------------------
    HAMBURGER MENU
   -------------------------------------------------------------- */
hamburgerBtn.addEventListener('click', () => menu.classList.toggle('hidden'));
document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

/* --------------------------------------------------------------
    MENU BUTTONS
   -------------------------------------------------------------- */
addMissionBtn.addEventListener('click', () => {
  menu.classList.add('hidden');
  hidePopups();
  showPopup(addPopup);
  document.getElementById('newName').focus();
});
deleteMissionBtn.addEventListener('click', () => {
  menu.classList.add('hidden');
  hidePopups();
  showPopup(deletePopup);
  document.getElementById('deleteName').focus();
});
favoriteMissionBtn.addEventListener('click', () => {
  menu.classList.add('hidden');
  const favs = data.filter(m => favorites.includes(m.id));
  renderMissions(favs);
});

/* --------------------------------------------------------------
   ADD MISSION
   -------------------------------------------------------------- */
document.getElementById('saveMission').addEventListener('click', () => {
  const name = document.getElementById('newName').value.trim();
  const agency = document.getElementById('newAgency').value.trim();
  const objective = document.getElementById('newObjective').value.trim();
  const date = document.getElementById('newDate').value.trim();   // YYYY/MM/DD
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
    name, agency, objective,
    launchDate: date,
    image, description: desc
  };
  data.push(newMission);
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

/* --------------------------------------------------------------
    DELETE MISSION
   -------------------------------------------------------------- */
document.getElementById('confirmDelete').addEventListener('click', () => {
  const name = document.getElementById('deleteName').value.trim();
  if (!name) { alert('Enter mission name'); return; }
  const idx = data.findIndex(m => m.name.toLowerCase() === name.toLowerCase());
  if (idx === -1) { alert('Mission not found'); return; }
  data.splice(idx, 1);
  renderMissions(data);
  populateAgencySelect();
  hidePopups();
  document.getElementById('deleteName').value = '';
});
document.getElementById('cancelDelete').addEventListener('click', () => {
  hidePopups();
  document.getElementById('deleteName').value = '';
});

/* --------------------------------------------------------------
   OVERLAY CLOSE
   -------------------------------------------------------------- */
overlay.addEventListener('click', hidePopups);

/* --------------------------------------------------------------
   DYNAMIC AGENCY SELECT
   -------------------------------------------------------------- */
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

/* --------------------------------------------------------------
    FILTER MISSIONS
   -------------------------------------------------------------- */
function filterMissions() {
  let list = data;

  // Search
  const s = searchInput.value.trim().toLowerCase();
  if (s) list = list.filter(m => m.name.toLowerCase().includes(s));

  // Agency
  const a = agencySelect.value;
  if (a) list = list.filter(m => m.agency === a);

  // Year
  const y = yearFilter.value.trim();
  if (y) list = list.filter(m => m.launchDate.split('/')[0] === y);

  renderMissions(list);
}
searchInput.addEventListener('input', filterMissions);
agencySelect.addEventListener('change', filterMissions);
yearFilter.addEventListener('input', filterMissions);

/* --------------------------------------------------------------
   RENDER MISSIONS (with delegated favorite toggle)
   -------------------------------------------------------------- */
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
          <button>EXPLORE</button>
          <button class="favorite-button" data-id="${m.id}"
                  title="${fav ? 'Remove from favorites' : 'Add to favorites'}">
            <img src="${fav ? filledHeart : emptyHeart}" alt="Favorite" class="fav-img">
          </button>
        </div>
      </div>`;
  });

  
  container.addEventListener('click', e => {
    const btn = e.target.closest('.favorite-button');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const img = btn.querySelector('.fav-img');
    const idx = favorites.indexOf(id);
    if (idx === -1) {
      favorites.push(id);
      img.src = filledHeart;
      btn.title = 'Remove from favorites';
    } else {
      favorites.splice(idx, 1);
      img.src = emptyHeart;
      btn.title = 'Add to favorites';
    }
  });
}

populateAgencySelect();
renderMissions(data);
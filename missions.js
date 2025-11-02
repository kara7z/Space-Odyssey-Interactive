const hamburgerBtn = document.querySelector('.hamburger-btn');
const menu = document.getElementById('menu');
const overlay = document.getElementById('overlay');
const addPopup = document.getElementById('addPopup');
const deletePopup = document.getElementById('deletePopup');
const addMissionBtn = document.getElementById('addMissionBtn');
const deleteMissionBtn = document.getElementById('deleteMissionBtn');
const favoriteMissionBtn = document.getElementById('favoriteMissionBtn');

const showPopup = (popup) => {
  overlay.classList.remove('hidden');
  popup.classList.remove('hidden');
};

const hidePopups = () => {
  overlay.classList.add('hidden');
  addPopup.classList.add('hidden');
  deletePopup.classList.add('hidden');
};

// Hamburger menu toggle
hamburgerBtn.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

// Menu buttons (no duplicates!)
addMissionBtn.addEventListener('click', () => {
  menu.classList.add('hidden');
  hidePopups();
  showPopup(addPopup);
  document.getElementById('newName').focus(); // Auto-focus for UX
});

deleteMissionBtn.addEventListener('click', () => {
  menu.classList.add('hidden');
  hidePopups();
  showPopup(deletePopup);
  document.getElementById('deleteName').focus(); // Auto-focus for UX
});

favoriteMissionBtn.addEventListener('click', () => {
  menu.classList.add('hidden');
  renderMissions(data.filter(m => favorites.includes(m.id)));
});

// Add Mission
document.getElementById('saveMission').addEventListener('click', () => {
  const name = document.getElementById('newName').value.trim();
  const agency = document.getElementById('newAgency').value.trim();
  const objective = document.getElementById('newObjective').value.trim();
  const date = document.getElementById('newDate').value;
  const image = document.getElementById('newImage').value.trim();
  const desc = document.getElementById('newDesc').value.trim();
  if (!name || !agency || !objective || !date || !image || !desc) {
    alert("Please fill all fields!");
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
  renderMissions(data);
  hidePopups();
});

document.getElementById('cancelAdd').addEventListener('click', hidePopups);

// Delete Mission
document.getElementById('confirmDelete').addEventListener('click', () => {
  const nameToDelete = document.getElementById('deleteName').value.trim();
  if (!nameToDelete) {
    alert("Please enter the mission name.");
    return;
  }
  const index = data.findIndex(m => m.name.toLowerCase() === nameToDelete.toLowerCase());
  if (index === -1) {
    alert("Mission not found!");
    return;
  }
  data.splice(index, 1);
  renderMissions(data);
  hidePopups();
});

document.getElementById('cancelDelete').addEventListener('click', hidePopups);

// Hide popups if overlay clicked
overlay.addEventListener('click', hidePopups);

// Render Function
function renderMissions(missions) {
  const container = document.getElementById("fist-row");
  container.innerHTML = "";
  missions.forEach(mission => {
    const isFavorite = favorites.includes(mission.id);
    container.innerHTML += `
      <div class="container">
        <span class="missionstilte">
          <h1>${mission.name}</h1>
          <hr id="UNDRELINE">
        </span>
        <div class="contt">
          <div class="mission-img">
            <img src="${mission.image}" alt="${mission.name}">
          </div>
          <div class="d-text">
            <div class="Box-Details">
              <h1>DETAILS:</h1>
              <p>Agency: ${mission.agency}</p>
              <p>Launch Date: ${mission.launchDate}</p>
              <p>Objective: ${mission.objective}</p>
            </div>
            <div class="Box-Description">
              <h1>DESCRIPTION:</h1>
              <p>${mission.description}</p>
            </div>
          </div>
        </div>
        <div class="button-Explore">
          <button>EXPLORE</button>
          <button
            class="favorite-button"
            data-id="${mission.id}"
            title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
            <img src="${isFavorite ? filledHeart : emptyHeart}" alt="Favorite" class="fav-img">
          </button>
        </div>
      </div>`;
  });
}
let allGames = [];
const containerf = document.getElementById("favorites-container");
const noFavorites = document.getElementById("no-favorites");
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const addFavoriteBtn = document.getElementById("add-favorite");
const btn = document.querySelector("#btnslide");
const modal = document.getElementById("game-modal");
const closeModalBtn = document.getElementById("close-modal");
let currentGame = null;
async function fetchGames() {
      try {
        const res = await fetch('https://debuggers-games-api.duckdns.org/api/games');
        const data = await res.json();
        allGames = data.results;
        displaySlide(allGames);
        displayGenres(allGames);
        displayGames(allGames);
      } catch (error) {
        console.error('Erreur :', error);
      } 
    }
function displaySlide(games) {
      const randomIndex = Math.floor(Math.random() * games.length);
      const featuredGame = games[randomIndex];
      document.getElementById('slide-image').src = featuredGame.background_image;
      document.getElementById('slide-nom').textContent = featuredGame.name;
      document.getElementById('slide-desc').textContent = featuredGame.description.slice(0, 120);
      btn.addEventListener('click', () => openModal(featuredGame));
    }
function displayGenres(games) {
      const genreSelect = document.getElementById('genre-filter');
      const genres = new Set();
      games.forEach(g => g.genres.forEach(gen => genres.add(gen.name)));
      genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreSelect.appendChild(option);
      });
      genreSelect.addEventListener('change', filterGames);
    }
function displayGames(games) {
  const container = document.getElementById('games-container');
  container.innerHTML = '';

  games.forEach(game => {
    const card = document.createElement('div');
    card.className = "bg-white rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform";

    card.innerHTML = `
      <img src="${game.background_image}" alt="${game.name}" class="w-full h-40 object-cover rounded mb-4">
      <h2 class="font-bold text-lg mb-2 text-center">${game.name}</h2>
      <p class="text-sm text-gray-600 mb-2 text-center">${game.description.slice(0, 80)}</p>

      <span class="bg-blue-500 text-white text-center px-3 py-1 rounded text-sm mb-2">
        ${game.genres.map(g => g.name).join(', ')}
      </span>

      <div class="flex items-center mt-2">
        <span class="text-yellow-500 text-lg">⭐</span>
        <span class="ml-1 text-gray-700 font-semibold">${game.rating}</span>
      </div>
    `;
    card.addEventListener('click', () => openModal(game));
    container.appendChild(card);
  });
}
 function filterGames() {
      const genreValue = document.getElementById('genre-filter').value.toLowerCase();
      const searchValue = document.getElementById('search-input').value.toLowerCase();

      const filtered = allGames.filter(game => {
        const matchesGenre = genreValue === "" || game.genres.some(g => g.name.toLowerCase() === genreValue);
        const matchesSearch = game.name.toLowerCase().includes(searchValue);
        return matchesGenre && matchesSearch;
      });

      displayGames(filtered);
    }
function openModal(game) {
      currentGame = game;
      modal.classList.remove('hidden');
      document.getElementById('modal-image').src = game.background_image;
      document.getElementById('modal-title').textContent = game.name;
      document.getElementById('modal-description').textContent = game.description.slice(0, 120) || "Aucune description disponible.";
      document.getElementById('modal-genres').textContent = "Genres : " + (game.genres.map(g => g.name).join(', ') || "Aucun genre");
    }

function closeModal() {
      modal.classList.add('hidden');
    }
function addToFavorites() {
  if (!currentGame) return;

  if (!favorites.some(f => f.id === currentGame.id)) {
    favorites.push(currentGame);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert(`${currentGame.name} ajouté aux favoris`);
  } else {
    alert(`${currentGame.name} est déjà dans vos favoris.`);
  }
}
function displayFavorites() {
  containerf.innerHTML = ''; 

  if (favorites.length === 0) {
    noFavorites.classList.remove("hidden");
    return;
  } else {
    noFavorites.classList.add("hidden");
  }

  favorites.forEach((game, index) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow p-4 flex flex-col items-center relative";

    card.innerHTML = `
      <img src="${game.background_image || ''}" alt="${game.name || ''}" class="w-full h-40 object-cover rounded mb-4">
      <h2 class="font-bold text-lg mb-2 text-center">${game.name || "Nom indisponible"}</h2>
      <p class="text-sm text-gray-600 mb-2 text-center">${(game.description || "").slice(0, 100) || "Aucune description."}</p>
      <button class="remove-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mt-2">
        ❌ Supprimer
      </button>
    `;

    card.querySelector(".remove-btn").addEventListener("click", () => {
      removeFavorite(index);
    });

    containerf.appendChild(card);
  });
}

function removeFavorite(index) {
  favorites.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayFavorites(); 
}
document.addEventListener("DOMContentLoaded", () => {
  displayFavorites();
});
document.getElementById('search-input').addEventListener('input', filterGames);
closeModalBtn.addEventListener('click', closeModal);
addFavoriteBtn.addEventListener('click', addToFavorites);
window.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
fetchGames();
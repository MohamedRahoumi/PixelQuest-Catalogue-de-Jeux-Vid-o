let allGames = [];
const btn = document.querySelector("#btnslide");
const modal = document.getElementById("game-modal");
const closeModalBtn = document.getElementById("close-modal");
let currentGame = null;
async function fetchGames() {
      try {
        const res = await fetch('https://debuggers-games-api.duckdns.org/api/games');
        const data = await res.json();
        allGames = data.results;
        displayGames(allGames);
        displaySlide(allGames);
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
  
closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
fetchGames();
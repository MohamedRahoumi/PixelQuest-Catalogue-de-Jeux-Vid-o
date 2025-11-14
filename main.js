let allGames = [];
async function fetchGames() {
      try {
        const res = await fetch('https://debuggers-games-api.duckdns.org/api/games');
        const data = await res.json();
        allGames = data.results;
        displayGames(allGames);
      } catch (error) {
        console.error('Erreur :', error);
      } 
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
      <p class="text-sm text-gray-600 mb-2 text-center">${game.description?.slice(0, 80)}</p>

      <span class="bg-blue-500 text-white text-center px-3 py-1 rounded text-sm mb-2">
        ${game.genres.map(g => g.name).join(', ')}
      </span>

      <div class="flex items-center mt-2">
        <span class="text-yellow-500 text-lg">⭐</span>
        <span class="ml-1 text-gray-700 font-semibold">${game.rating}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

fetchGames();
// js/storage.js
export function savePlayerData(playerName, category, difficulty) {
  const playerData = {
    name: playerName,
    category: category,
    difficulty: difficulty,
    highScore: 0 // default high score
  };

  // Save as JSON string in localStorage
  localStorage.setItem('playerData', JSON.stringify(playerData));
}

export function getPlayerData() {
  const data = localStorage.getItem('playerData');
  return data ? JSON.parse(data) : null;
}

export function updateHighScore(score) {
  const playerData = getPlayerData();
  if (!playerData) return;

  if (score > playerData.highScore) {
    playerData.highScore = score;
    localStorage.setItem('playerData', JSON.stringify(playerData));
  }
}

import { savePlayerData } from './storage.js';

const form = document.getElementById('player-info-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const playerName = document.getElementById('player-name').value.trim();
  const category = document.getElementById('category-select').value;
  const difficulty = document.getElementById('difficulty-select').value;

  if (!playerName || !category || !difficulty) {
    alert('Please fill out all fields!');
    return;
  }

  savePlayerData(playerName, category, difficulty);

  // Pass URL parameters to quiz page
  window.location.href = `quiz.html?category=${category}&difficulty=${difficulty}`;
});

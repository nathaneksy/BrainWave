// js/game.js
import { savePlayerData } from './storage.js';

const form = document.getElementById('player-setup-form');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // prevent page reload

  const playerName = document.getElementById('playerName').value.trim();
  const category = document.getElementById('category').value;
  const difficulty = document.getElementById('difficulty').value;

  // Validate inputs
  if (!playerName || !category || !difficulty) {
    alert('Please fill out all fields!');
    return;
  }

  // Save to local storage
  savePlayerData(playerName, category, difficulty);

  // Redirect to quiz page with URL parameters
  window.location.href = `quiz.html?category=${category}&difficulty=${difficulty}`;
});

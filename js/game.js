// DOM Elements
const playerInfoForm = document.getElementById('player-info-form');
const playerInfoContainer = document.getElementById('player-info-container');
const startQuizForm = document.getElementById('start-quiz-form');
const startQuizContainer = document.getElementById('start-quiz-container');
const categorySelect = document.getElementById('category-select');
const difficultySelect = document.getElementById('difficulty-select');

const quizContainer = document.getElementById('quiz-container');
const questionEl = document.getElementById('question');
const answersContainer = document.getElementById('answers-container');
const nextBtn = document.getElementById('next-btn');
const scoreText = document.getElementById('score-text');
const scoreBar = document.getElementById('score-bar');
const timerBar = document.getElementById('timer-bar');
const resultsModal = document.getElementById('results-modal');
const finalScore = document.getElementById('final-score');
const reviewContainer = document.getElementById('review-answers');
const restartBtn = document.getElementById('restart-btn');

const correctSound = new Audio('./assets/audio/correct.mp3');
const incorrectSound = new Audio('./assets/audio/incorrect.mp3');

let playerName = '';
let playerEmail = '';
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let timerInterval;
const QUESTION_TIME = 15;
let category = '9';
let difficulty = 'easy';

// Player Info Form
playerInfoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('player-name').value.trim();
  const emailInput = document.getElementById('player-email').value.trim();

  if (nameInput.length < 2) { alert('Please enter a valid name (min 2 chars).'); return; }
  if (!/\S+@\S+\.\S+/.test(emailInput)) { alert('Please enter a valid email.'); return; }

  playerName = nameInput;
  playerEmail = emailInput;
  localStorage.setItem('playerName', playerName);
  localStorage.setItem('playerEmail', playerEmail);

  playerInfoContainer.style.display = 'none';
  startQuizContainer.style.display = 'block';
});

// Start Quiz Form
startQuizForm.addEventListener('submit', (e) => {
  e.preventDefault();
  category = categorySelect.value;
  difficulty = difficultySelect.value;
  startQuiz(category, difficulty);
});

// Restart Quiz
restartBtn.addEventListener('click', () => {
  resultsModal.classList.remove('show');
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  scoreText.textContent = `Score: 0`;
  scoreBar.style.width = `0%`;
  displayQuestion();
});

// Start Quiz Function
async function startQuiz(category, difficulty) {
  startQuizContainer.style.display = 'none';
  quizContainer.style.display = 'block';
  questions = await fetchQuestions(category, difficulty);
  if (!questions || questions.length === 0) {
    alert('No questions loaded. Check API or local JSON.');
    return;
  }
  displayQuestion();
}

// Fetch Questions from API or local JSON fallback
async function fetchQuestions(category, difficulty) {
  try {
    const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`);
    const data = await response.json();
    if (!data.results || data.results.length === 0) throw new Error('API empty');
    return data.results;
  } catch {
    const localResponse = await fetch('questions.json');
    const localData = await localResponse.json();
    return localData;
  }
}

// Display Question
function displayQuestion() {
  clearInterval(timerInterval);
  nextBtn.disabled = true;

  const q = questions[currentQuestionIndex];
  questionEl.textContent = decodeHTML(q.question);

  const answers = [...q.incorrect_answers.map(a => decodeHTML(a)), decodeHTML(q.correct_answer)];
  shuffleArray(answers);

  answersContainer.innerHTML = '';
  answers.forEach(ans => {
    const btn = document.createElement('button');
    btn.textContent = ans;
    btn.className = 'answer-btn';
    btn.addEventListener('click', () => selectAnswer(btn, q.correct_answer));
    answersContainer.appendChild(btn);
  });

  startTimer();
}

// Timer
function startTimer() {
  let timeLeft = QUESTION_TIME;
  timerBar.style.width = '100%';
  timerInterval = setInterval(() => {
    timeLeft--;
    timerBar.style.width = (timeLeft / QUESTION_TIME) * 100 + '%';
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      disableAnswers();
      nextBtn.disabled = false;
    }
  }, 1000);
}

function disableAnswers() {
  document.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = true);
}

// Select Answer
function selectAnswer(btn, correctAnswer) {
  clearInterval(timerInterval);
  disableAnswers();
  if (btn.textContent === decodeHTML(correctAnswer)) {
    btn.classList.add('correct');
    score++;
    correctSound.play();
  } else {
    btn.classList.add('incorrect');
    incorrectSound.play();
  }
  scoreText.textContent = `Score: ${score}`;
  scoreBar.style.width = `${(score / questions.length) * 100}%`;
  userAnswers.push({ question: questionEl.textContent, selected: btn.textContent, correct: decodeHTML(correctAnswer) });
  nextBtn.disabled = false;
}

// Next Question
nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions.length) {
    showResults();
  } else {
    displayQuestion();
  }
});

// Show Results
function showResults() {
  quizContainer.style.display = 'none';
  resultsModal.classList.add('show');
  finalScore.textContent = `${playerName}, your final score is ${score} out of ${questions.length}`;
  reviewContainer.innerHTML = '';
  userAnswers.forEach(a => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>Q:</strong> ${a.question} <br>
                     <strong>Your answer:</strong> <span class="${a.selected===a.correct?'correct-answer':'incorrect-answer'}">${a.selected}</span> <br>
                     <strong>Correct:</strong> ${a.correct}`;
    reviewContainer.appendChild(div);
  });
  confetti({ particleCount: 150, spread: 70 });
}

// Helpers
function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

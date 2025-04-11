let streak = 0;
let userScore = 0;
let botScore = 0;
let correctStreak = 0;
let wrongStreak = 0;
let currentQuestion = null;

let shuffledQuestions = [];
let questionIndex = 0;

function shuffleQuestions() {
  shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
  questionIndex = 0;
}

function getNextQuestion() {
  if (questionIndex >= shuffledQuestions.length) {
    shuffleQuestions(); // Reshuffle when we finish a cycle
  }
  return shuffledQuestions[questionIndex++];
}

function setStage(stage) {
  document.body.classList.remove('question-stage', 'psr-stage');
  document.body.classList.add(`${stage}-stage`);
}

function updateStreakDisplay() {
  const streakOrder = ['a', 'b', 'c', 'd', 'e'];
  const colors = ['lightpink', 'salmon', 'coral', 'hotpink', 'fuchsia'];

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(streakOrder[i]);
    box.style.backgroundColor = streak > i ? colors[i] : '#222';
  }
}

function displayQuestion() {
  currentQuestion = getNextQuestion();
  document.getElementById('f').textContent = currentQuestion.text;
  setStage('question');
}

function playRound(userMove) {
  const choices = { P: '✋', S: '✌️', R: '✊' };
  const botChoice = ['P', 'S', 'R'][Math.floor(Math.random() * 3)];

  document.getElementById('userMove').textContent = choices[userMove];
  document.getElementById('botMove').textContent = choices[botChoice];

  const resultDisplay = document.getElementById('result');
  resultDisplay.classList.remove('visible');
  void resultDisplay.offsetWidth;

  if (userMove === botChoice) {
    resultDisplay.textContent = "Draw!";
  } else if (
    (userMove === 'P' && botChoice === 'R') ||
    (userMove === 'R' && botChoice === 'S') ||
    (userMove === 'S' && botChoice === 'P')
  ) {
    userScore++;
    document.getElementById('l').textContent = userScore;
    resultDisplay.textContent = "You won that round!";
  } else {
    botScore++;
    document.getElementById('n').textContent = botScore;
    resultDisplay.textContent = "Bot won that round!";
  }

  resultDisplay.classList.add('visible');

  if (userScore >= 10 || botScore >= 10) {
    setTimeout(() => {
      alert(userScore >= 10 ? "You won the game!" : "Bot won the game!");
      location.reload();
    }, 500); // 500ms delay
  }

  streak = 0;
  correctStreak = 0;
  wrongStreak = 0;
  updateStreakDisplay();
  setStage('question');
  displayQuestion();
}

document.addEventListener('keydown', (e) => {
  const key = e.key.toUpperCase();

  if (['F', 'I', 'O'].includes(key)) {
    const typeGuess = { F: 'fact', I: 'inference', O: 'opinion' }[key];

    if (typeGuess === currentQuestion.type) {
      correctStreak++;
      wrongStreak = 0;
      streak = Math.min(5, correctStreak);
      updateStreakDisplay();

      if (streak === 5) {
        const popup = document.getElementById('customPopup');
        popup.classList.remove('hidden');
        setTimeout(() => {
          popup.classList.add('hidden');
          setStage('psr'); // 🔁 Moved here so border change happens after popup
        }, 1500);
      }
      

    } else {
      correctStreak = 0;
      streak = 0;
      updateStreakDisplay();
    }

    displayQuestion();
  }

  if (['P', 'S', 'R'].includes(key) && streak === 5) {
    correctStreak = 0;
    playRound(key);
  }
});

shuffleQuestions();
displayQuestion();

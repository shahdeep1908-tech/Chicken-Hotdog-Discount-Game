// score.js - Score management, saving and loading results

// Variables to store current score state
let currentScore = 0;
let bestScore = 0;
let actualDistance = 0; // Добавляем переменную для хранения исходной дистанции

// Score initialization
function initScores() {
  // Load best result from localStorage
  const savedTopScore = getTopScore();
  if (savedTopScore) {
    bestScore = parseInt(savedTopScore);
  }

  // Update display
  updateScoreDisplay();
}

// Function to save current result
function saveCurrentScore(score) {
  actualDistance = score;
  currentScore = score;
  localStorage.setItem("currentScore", currentScore);
  localStorage.setItem("actualDistance", actualDistance);

  saveTopScore(currentScore);
}

// Function to get current result
function getCurrentScore() {
  return localStorage.getItem("currentScore") || 0;
}

// Function to save best result
function saveTopScore(score) {
  // Предполагаем, что входящее score уже умножено на 5
  if (parseInt(score) > bestScore) {
    bestScore = parseInt(score);
    localStorage.setItem("topScore", score);
  }
}

// Function to get best result
function getTopScore() {
  return localStorage.getItem("topScore") || 0;
}

// Function to update results display
function updateScoreDisplay() {
  // Get elements for displaying results
  const scoreElements = document.querySelectorAll(".score-results-container p");

  // Check if elements are found and update text
  if (scoreElements && scoreElements.length >= 2) {
    // Current result
    scoreElements[0].textContent = getCurrentScore();
    // Best result
    scoreElements[1].textContent = getTopScore();

    console.log("Updated result values:", getCurrentScore(), getTopScore());
  }
}

let discount_received = 0;

// Calculate discount based on distance
async function calculateDiscount(distance) {
  try {
    const response = await fetch(`/get-discount/?distance=${distance}`);
    const data = await response.json();

    if (data.discount) {
      discount_received = data.discount;
      return data.discount
    }
    return "0";
  } catch (error) {
    console.error("Error fetching discount:", error);
    return "Error fetching discount";
  }
}

// Save game result
async function saveScore(playerName, playerEmail) {

  const scoreData = {
    name: playerName,
    email: playerEmail,
    distance: currentScore, // Uses multiplied score
    actualDistance: actualDistance, // Stores original distance
    discount: discount_received, // Uses API result
    timestamp: Date.now(),
  };
  console.log(scoreData);

  try {
    const response = await fetch("/claim-code/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scoreData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Score saved successfully:", data);
      return data;
    } else {
      console.error("Error saving score:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Error in saveScore:", error);
    return null;
  }


  // Get existing results from localStorage
  let scores = localStorage.getItem("scores");
  if (!scores) {
    scores = [];
  } else {
    scores = JSON.parse(scores);
  }

  // Add new result
  scores.push(scoreData);

  // Sort by distance descending
  scores.sort((a, b) => b.distance - a.distance);

  // Save back to localStorage
  localStorage.setItem("scores", JSON.stringify(scores));

  return scoreData;
}

// Load results from localStorage
function loadScores(scoresContainer) {
  if (!scoresContainer) return;

  let scores = localStorage.getItem("scores");
  scoresContainer.innerHTML = "";

  if (!scores) return;

  scores = JSON.parse(scores);

  // Limit the number of displayed results to 10
  const displayScores = scores.slice(0, 10);

  displayScores.forEach((score) => {
    const scoreRow = document.createElement("div");
    scoreRow.className = "score-row";

    const nameCell = document.createElement("div");
    nameCell.className = "score-cell";
    nameCell.textContent = score.name;

    const distanceCell = document.createElement("div");
    distanceCell.className = "score-cell";
    distanceCell.textContent = score.distance;

    const discountCell = document.createElement("div");
    discountCell.className = "score-cell";
    discountCell.textContent = score.discount;

    scoreRow.appendChild(nameCell);
    scoreRow.appendChild(distanceCell);
    scoreRow.appendChild(discountCell);

    scoresContainer.appendChild(scoreRow);
  });
}

// Set current score
function setCurrentScore(score) {
  actualDistance = score; // Сохраняем исходную дистанцию
  currentScore = score;
}

// Get current score (from variable, not from localStorage)
function getScore() {
  return currentScore;
}

// Get best score (from variable, not from localStorage)
function getBestScore() {
  return bestScore;
}

// Get actual distance (from variable, not from localStorage)
function getActualDistance() {
  return actualDistance;
}

export {
  initScores,
  saveCurrentScore,
  getCurrentScore,
  saveTopScore,
  getTopScore,
  updateScoreDisplay,
  calculateDiscount,
  saveScore,
  loadScores,
  setCurrentScore,
  getScore,
  getBestScore,
  getActualDistance, // Экспортируем новую функцию
};

// main.js - Main file, entry point

// Import functions from other modules
import {
  updateBackground,
  resetBackground,
  setResultsBackground,
  setLeaderboardBackground, // Import the new function
} from "./background.js";
import { selectCharacter, getSelectedCharacter } from "./character.js";
import {
  initScores,
  loadScores,
  saveScore,
  updateScoreDisplay,
} from "./score.js";
import { showScreen, initUIHandlers } from "./ui.js";
import { initGame, startGame } from "./game.js";

// Run initialization after DOM loads
document.addEventListener("DOMContentLoaded", function () {
  // Get all necessary DOM elements
  const introScreen = document.getElementById("intro-screen");
  const gameScreen = document.getElementById("game-screen");
  const resultsScreen = document.getElementById("results-screen");
  const leaderboardScreen = document.getElementById("leaderboard-screen");

  const characters = document.querySelectorAll(".character");
  const startButton = document.getElementById("start-game");
  const characterContainer = document.getElementById("character-container");
  const pointer = document.getElementById("pointer");
  const swipeInstruction = document.getElementById("swipe-instruction");

  const discountElement = document.getElementById("discount-percentage");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const submitButton = document.getElementById("submit-score");
  const playAgainButton = document.getElementById("play-again");
  const scoresContainer = document.getElementById("scores-container");
  const resultsCharacterContainer =
    document.getElementById("results-character");

  // Flag to check if device is mobile
  const isMobile = window.innerWidth <= 768;

  // Initialization
  init();

  function init() {
    // Initialize scores
    initScores();

    // Setup character selection
    characters.forEach((character) => {
      character.addEventListener("click", function () {
        selectCharacter(this);
      });
    });

    // Game start button
    startButton.addEventListener("click", function () {
      startGame();
      // Reset character position only for mobile devices
      if (isMobile) {
        resetCharacterPosition();
      }
    });

    // Initialize UI handlers
    initUIHandlers(
      nameInput,
      emailInput,
      submitButton,
      document.getElementById("user-form"),
      handleScoreSave
    );

    // Initialize game with all necessary DOM elements
    initGame(
      gameScreen,
      pointer,
      swipeInstruction,
      characterContainer,
      discountElement,
      resultsScreen,
      resultsCharacterContainer
    );

    // Play again button
    if (playAgainButton) {
      playAgainButton.addEventListener("click", function () {
        // Restore normal background without blur
        resetBackground();
        showScreen(introScreen);

        // When going back to intro screen, ensure character selection is reset
        resetCharacterSelection();
      });
    }

    // Load previously saved results
    loadScores(scoresContainer);

    // Update results display
    updateScoreDisplay();
  }

  // Score save handler
function handleScoreSave(playerName, playerEmail) {
  console.log(`Handling score save for: ${playerName}, ${playerEmail}`);

  // Сохраняем счет
  saveScore(playerName, playerEmail);

  // Обновляем отображение счета
  loadScores(scoresContainer);
  updateScoreDisplay();

  // Используем таймаут для надежного перехода
  setTimeout(() => {
    // Применяем фон для экрана лидерборда
    setLeaderboardBackground();

    // Отображаем экран лидерборда
    if (leaderboardScreen) {
      console.log("Showing leaderboard screen");
      showScreen(leaderboardScreen);
    }
  }, 50);
}
  // Function to reset character position when starting a new game
  function resetCharacterPosition() {
    if (!characterContainer) return;

    // Reset position properties
    characterContainer.style.transform = "";
    characterContainer.style.left = "calc(50% - 170px)"; // Reset to initial position
    characterContainer.style.bottom = "200px"; // Reset to initial bottom value 

    // Reset scaling classes
    characterContainer.classList.remove(
      "flight-scale",
      "landing-scale",
      "centered-landing"
    );
    characterContainer.classList.add("game-scale");

    // If the character had any inline transforms added during gameplay
    const characterImg = characterContainer.querySelector(
      ".game-character-img"
    );
    if (characterImg) {
      characterImg.style.transform = "";
    }

    // Make sure the pointer is properly positioned
    if (pointer) {
      pointer.style.left = "";
      pointer.style.bottom = "";
      pointer.classList.remove("hidden");
    }

    // Ensure the swipe instruction is visible
    if (swipeInstruction) {
      swipeInstruction.style.opacity = "1";
    }
  }

  // Function to reset character selection when going back to intro screen
  function resetCharacterSelection() {
    // Reset the selected state of characters
    characters.forEach((character) => {
      character.classList.remove("selected");
    });

    // Disable the start button until character is selected again
    if (startButton) {
      startButton.disabled = true;
    }
  }

  // Listen for when the game screen becomes active to ensure character position is reset
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (
        mutation.attributeName === "class" &&
        gameScreen.classList.contains("active") &&
        isMobile // Only reset position for mobile devices
      ) {
        // Reset character position when game screen becomes active
        resetCharacterPosition();
      }
    });
  });

  // Start observing the game screen for class changes
  observer.observe(gameScreen, { attributes: true });

  // Listen for window resize events to update mobile flag
  window.addEventListener("resize", function () {
    const wasMobile = isMobile;
    const nowMobile = window.innerWidth <= 768;

    // If device state changed to mobile and game screen is active, reset position
    if (!wasMobile && nowMobile && gameScreen.classList.contains("active")) {
      resetCharacterPosition();
    }
  });
});

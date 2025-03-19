// game.js - Game mechanics, throw logic

// Import necessary functions from other modules
import {
  updateBackground,
  setResultsBackground,
  isMobileDevice,
} from "./background.js";
import {
  getSelectedCharacter,
  addCharacterToGameScreen,
  throwCharacter,
  getIsAnimating,
  setIsAnimating,
  addCharacterToResultsScreen,
  resetCharacterState,
} from "./character.js";
import {
  saveCurrentScore,
  saveTopScore,
  updateScoreDisplay,
  calculateDiscount,
  setCurrentScore,
  getBestScore,
} from "./score.js";
import {
  showScreen,
  showResultsScreen,
  showPointerNearCharacter,
  hidePointerAndInstruction,
} from "./ui.js";

// Global DOM elements for use in the game
let gameElements = {
  discountElement: null,
  resultsScreen: null,
  resultsCharacterContainer: null,
};

// Flag to track whether background zoom has already been applied
let backgroundLandingApplied = false;

// Game initialization
function initGame(
  gameScreen,
  pointer,
  swipeInstruction,
  characterContainer,
  discountElement,
  resultsScreen,
  resultsCharacterContainer
) {
  // Save DOM elements for use in other functions
  gameElements = {
    gameScreen,
    pointer,
    swipeInstruction,
    characterContainer,
    discountElement,
    resultsScreen,
    resultsCharacterContainer,
  };

  // Reset flag during initialization
  backgroundLandingApplied = false;

  // Swipe handlers with adaptation for mobile devices
  gameScreen.addEventListener("mousedown", handleSwipeStart);
  gameScreen.addEventListener("touchstart", handleSwipeStart, {
    passive: true, // Improves performance on mobile
  });
}

// Start the game
function startGame() {
  if (!getSelectedCharacter()) return;

  const { gameScreen, characterContainer, pointer, swipeInstruction } =
    gameElements;

  // Reset flag when starting a new game
  backgroundLandingApplied = false;

  // Zoom out background when starting the game based on device type
  updateBackground("zooming-out");

  showScreen(gameScreen);

  // Add character to the game screen
  addCharacterToGameScreen(characterContainer);

  // After a small delay for the appearance animation to work, change class to game-scale
  setTimeout(() => {
    characterContainer.classList.remove("intro-scale");
    characterContainer.classList.add("game-scale");
  }, 100);

  // Show instruction and pointer
  pointer.classList.remove("hidden");
  swipeInstruction.style.opacity = "1";

  // Adapt character position for mobile devices
  if (isMobileDevice()) {
    characterContainer.style.left = "20%"; // Move character more to the left on mobile
    characterContainer.style.bottom = "200px"; // Raise character higher on mobile
  }
}

// Handle swipe start
function handleSwipeStart(e) {
  if (getIsAnimating()) return;

  const { gameScreen, pointer, characterContainer } = gameElements;

  const isTouchEvent = e.type === "touchstart";

  // Show pointer near character
  showPointerNearCharacter(pointer, characterContainer);

  if (isTouchEvent) {
    gameScreen.addEventListener("touchend", handleSwipeEnd, { once: true });
  } else {
    gameScreen.addEventListener("mouseup", handleSwipeEnd, { once: true });
  }
}

// Handle swipe end
function handleSwipeEnd() {
  if (getIsAnimating()) return;

  const { pointer, swipeInstruction, characterContainer } = gameElements;

  // Hide pointer and instruction
  hidePointerAndInstruction(pointer, swipeInstruction);

  // Start throw animation
  // Pass updateBackground function, but it will be called only once during landing
  throwCharacter(characterContainer, updateBackground, showResults);
}

// Show results
async function showResults(distance) {
  const { discountElement, resultsScreen, resultsCharacterContainer } =
    gameElements;

  // Save current result
  setCurrentScore(distance);

  // Convert distance to discount
  const discount = await calculateDiscount(distance);

  // Update best result if current is higher
  if (distance > getBestScore()) {
    saveTopScore(distance);
  }

  // Save current result
  saveCurrentScore(distance);

  // Update results display
  updateScoreDisplay();

  // Add character to results screen
  addCharacterToResultsScreen(resultsCharacterContainer);

  // Don't call setResultsBackground, as background should already be properly zoomed
  // in the throwCharacter function via updateBackground("landing")

  // Show results screen
  showResultsScreen(discountElement, discount, resultsScreen);
}

// Reset game function
function resetGame() {
  const { characterContainer } = gameElements;

  // Reset flag when resetting the game
  backgroundLandingApplied = false;

  // Reset character state
  resetCharacterState(characterContainer);

  // Return background to initial state
  updateBackground("initial");
}

export {
  initGame,
  startGame,
  handleSwipeStart,
  handleSwipeEnd,
  showResults,
  resetGame,
};

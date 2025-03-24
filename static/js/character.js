// character.js - Character management and animations

// Variables for character animation control
let isAnimating = false;
let selectedCharacter = null;
let backgroundUpdateApplied = false; // Flag to track background updates

// Character selection function
function selectCharacter(element) {
  // Clear selection from all characters
  document.querySelectorAll(".character").forEach((char) => {
    char.classList.remove("selected");
  });

  // Add selected class to the chosen character
  element.classList.add("selected");

  // Save the selected character
  selectedCharacter = element.getAttribute("data-character");

  // Enable Start button
  const startButton = document.getElementById("start-game");
  startButton.disabled = false;
  startButton.style.pointerEvents = "auto";
  startButton.style.opacity = "1";

  return selectedCharacter;
}

// Character throw animation function
// Updated throwCharacter function with proper landing positions
function throwCharacter(characterContainer, updateBackground, onComplete, deltaX) {
  isAnimating = true;
  backgroundUpdateApplied = false; // Reset background update flag

  // Get screen dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const maxDistance = 1000;  // Max possible distance
  const minDistance = 100;   // Min possible distance
  let minXPosition = 200;     // Min X position
  const maxAllowedX = 900;
  let maxXPosition = viewportWidth / 2 - 50; // Max X position

  if (maxXPosition < minXPosition) {
  maxXPosition = minXPosition + 10;
}

  // Generate random distance from 100 to 1000 pixels
  // const distance = (Math.floor(Math.random() * 181) * 5) + 100;
  // const distance = (Math.floor(Math.random() * 181) * 5) + 100;
   const distance = Math.min(Math.max(deltaX, minDistance), maxDistance);
  console.log("distance ::: ", distance);
  console.log("maxXPosition ::: ", maxXPosition);
  const duration = 1200;

  // Clear existing transform styles
  characterContainer.style.transform = "";

  // Use different landing positions based on device type and orientation
  let finalBottom;

  if (window.innerWidth <= 480) {
    // Extra small screens
    finalBottom = viewportHeight * 0.15;
    maxXPosition = window.innerWidth * 0.7;
  } else if (window.innerWidth <= 768) {
    // Mobile
    finalBottom = viewportHeight * 0.18;
    maxXPosition = window.innerWidth * 0.7;
  } else if (window.innerHeight <= 450 && window.innerWidth <= 900) {
    // Landscape mobile orientation
    finalBottom = viewportHeight * 0.1;
    maxXPosition = window.innerWidth * 0.7;
  } else {
    // Desktop
    finalBottom = viewportHeight * 0.22;
    maxXPosition = window.innerWidth * 0.7;
  }

  // Calculate final X position (center of screen)
  const finalXPosition = Math.min(
  ((distance - minDistance) / (maxDistance - minDistance)) * (maxXPosition - minXPosition) + minXPosition,
  maxAllowedX // Clamp to max 1000
);
  console.log(`Distance: ${distance}, Final X Position: ${finalXPosition}`);

  // Get current character position
  const characterRect = characterContainer.getBoundingClientRect();

  // Apply transition for smooth animation
  const minFlips = 0.5;
  const maxFlips = 4;

  // Calculate the number of flips dynamically based on distance
  const flips = minFlips + ((distance - 100) / (1000 - 100)) * (maxFlips - minFlips);
  console.log("flips ::: ", flips);
  console.log("distance ::: ", distance);

  // Ensure the final rotation is always a multiple of 360°
  const rotationAngle = Math.round(flips) * 360;
  characterContainer.style.transform = `translateX(${finalXPosition}px) rotate(${rotationAngle}deg)`;

  // Apply transformation
  //characterContainer.style.transform = `translateX(${finalXPosition}px) rotate(360deg)`;
  characterContainer.style.bottom = `${finalBottom}px`;

  // Remove game scale class and add flight class to reduce character size
  characterContainer.classList.remove("game-scale");
  characterContainer.classList.add("flight-scale"); // Add class to reduce character size during flight

  // Function to update background and prevent repeated calls
  const applySafeBackgroundUpdate = () => {
    if (!backgroundUpdateApplied) {
      // Toggle class to center character during landing
      characterContainer.classList.add("centered-landing");

      // Remove flight class and restore normal scale
      characterContainer.classList.remove("flight-scale");

      // Apply landing state with increased scale
      updateBackground("landing");

      backgroundUpdateApplied = true; // Set flag that update has occurred
      console.log("Background update applied");
    }
  };

  // Transition end handler
  const transitionEndHandler = function (e) {
    if (e.propertyName !== "transform") return;

    characterContainer.removeEventListener(
      "transitionend",
      transitionEndHandler
    );

    applySafeBackgroundUpdate();

    // Small delay before showing results
    setTimeout(() => {
      isAnimating = false;
      onComplete(distance);
    }, 700);
  };

  // Fallback timer in case transitionend event doesn't fire
  const fallbackTimer = setTimeout(() => {
    characterContainer.removeEventListener(
      "transitionend",
      transitionEndHandler
    );

    // Toggle class to center character during landing
    characterContainer.classList.add("centered-landing");

    // Apply background update only if it hasn't been done yet
    applySafeBackgroundUpdate();

    setTimeout(() => {
      isAnimating = false;
      onComplete(distance);
    }, 700);
  }, duration + 100);

  characterContainer.addEventListener("transitionend", transitionEndHandler);

  return distance;
}

// Function to determine device type (mobile or desktop)
function isMobileDevice() {
  return window.innerWidth < 768;
}

// Adds the selected character to the game screen
function addCharacterToGameScreen(characterContainer) {
  // Clear character container
  characterContainer.innerHTML = "";

  // Clone the selected character image
  const selectedImg = document
    .querySelector(`.character[data-character="${selectedCharacter}"] img`)
    .cloneNode(true);
  selectedImg.classList.add("game-character-img");
  characterContainer.appendChild(selectedImg);

  // Set initial character position
  characterContainer.style.transform = "translateX(0) rotate(30deg)"; // Initial 30% tilt
  characterContainer.style.top = "auto";

  // Determine initial position based on screen size
  if (window.innerWidth <= 480) {
    // Extra small mobile
    characterContainer.style.bottom = "120px";
    characterContainer.style.left = "15%";
  } else if (window.innerWidth <= 768) {
    // Mobile
    characterContainer.style.bottom = "150px";
    characterContainer.style.left = "20%";
  } else if (window.innerHeight <= 450 && window.innerWidth <= 900) {
    // Landscape orientation
    characterContainer.style.bottom = "50px";
    characterContainer.style.left = "20%";
  } else {
    // Desktop
    characterContainer.style.bottom = "300px";
    characterContainer.style.left = "328px";
  }

  // Add class for increased scale at the beginning of the game
  characterContainer.classList.add("intro-scale");
}

// Adds the selected character to the results screen
function addCharacterToResultsScreen(resultsCharacterContainer) {
  if (!resultsCharacterContainer) return;

  resultsCharacterContainer.innerHTML = ""; // Clear container

  // Clone the same character that was used in the game
  const selectedImg = document
    .querySelector(`.character[data-character="${selectedCharacter}"] img`)
    .cloneNode(true);
  selectedImg.classList.add("results-character-img");
  resultsCharacterContainer.appendChild(selectedImg);
}

// Get current selected character
function getSelectedCharacter() {
  return selectedCharacter;
}

// Check if character is currently animating
function getIsAnimating() {
  return isAnimating;
}

// Set animation state
function setIsAnimating(state) {
  isAnimating = state;
}

// Function to reset character state
function resetCharacterState(characterContainer) {
  if (!characterContainer) return;

  // Reset background update flag
  backgroundUpdateApplied = false;

  // Remove all scaling classes
  characterContainer.classList.remove(
    "game-scale",
    "landing-scale",
    "centered-landing",
    "flight-scale"
  );

  // Return to initial scale
  characterContainer.classList.add("intro-scale");

  // Reset position depending on device
  if (isMobileDevice()) {
    characterContainer.style.left = "20%";
    characterContainer.style.bottom = "150px"; // Adjusted to match new initial height
  } else {
    characterContainer.style.left = "328px";
    characterContainer.style.bottom = "200px"; // Adjusted from 300px
  }

  characterContainer.style.transform = "translateX(0) rotate(30deg)";
}

// Make sure to export all functions that are used in other files
export {
  selectCharacter,
  throwCharacter,
  addCharacterToGameScreen,
  addCharacterToResultsScreen,
  getSelectedCharacter,
  getIsAnimating,
  setIsAnimating,
  resetCharacterState,
  isMobileDevice,
};

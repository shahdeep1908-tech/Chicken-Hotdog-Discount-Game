// background.js - Improved game background management with adaptability for mobile devices

// Function to determine device type (mobile or desktop)
function isMobileDevice() {
  return window.innerWidth < 1200;
}

// Function to adjust background position for better ground level alignment on mobile
function adjustBackgroundGroundLevel() {
  const body = document.body;
  const isMobile = isMobileDevice();

  if (isMobile) {
    // Fine-tune the background position to show more ground
    body.style.backgroundPosition = "center 55%"; // Move background up to show more ground

    // Small screen specific adjustment
    if (window.innerWidth < 480) {
      body.style.backgroundPosition = "center 50%"; // Move up even more for smaller screens
    }
  }
}

// Function to change the background scale and focus
function updateBackground(state, position = null) {
  console.log(`updateBackground call: ${state}`, position);
  const body = document.body;
  const isMobile = isMobileDevice();
  const characterContainer = document.getElementById("character-container");

  switch (state) {
    case "initial":
      console.log("Setting initial background state");
      // Initial state - match the CSS defined in base.css
      body.style.transition = "none";
      body.style.backgroundImage = "url('/static/assets/Asset-1@3x 1.png')";

      // Use cover for background-size to match CSS
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "center bottom";
      // After a short delay, re-enable transitions
      setTimeout(() => {
        body.style.transition =
          "background-size 1.2s cubic-bezier(0.22, 0.61, 0.36, 1), background-position 1.2s ease";
      }, 50);

      // If there's a character, make it larger on the initial screen
      if (characterContainer) {
        // Change will be applied through CSS, adding a class
        characterContainer.classList.add("intro-scale");
      }
      break;

    case "zooming-out":
      console.log("Zooming out background when starting the game");
      // Smooth zooming out of the background
      body.style.transition =
        "background-size 1.2s ease, background-position 1.2s ease";

      // Apply changes immediately, without setTimeout
      if (isMobile) {
        // For mobile devices - zoom out to 100% height
        body.style.backgroundSize = "auto 110%";
        body.style.backgroundPosition = "center 55%"; // Show more ground on game screen
      } else {
        // For desktop - zoom out to 100% width
        body.style.backgroundSize = "100% auto";
        body.style.backgroundPosition = "center bottom";
      }

      // Reduce character scale
      if (characterContainer) {
        characterContainer.classList.remove("intro-scale");
        characterContainer.classList.add("game-scale");
      }
      break;

    case "focus-on-target":
      // This case is no longer used, kept for compatibility
      console.log("This case is no longer used");
      break;

    case "landing":
      console.log("Zooming in background when character lands");

      // Smooth zooming in of the background during landing
      body.style.transition =
        "background-size 1.2s cubic-bezier(0.22, 0.61, 0.36, 1), background-position 1.2s cubic-bezier(0.22, 0.61, 0.36, 1)";

      if (isMobile) {
        // For mobile - zoom in to a moderate level based on height
        body.style.backgroundSize = "auto 130%";
        body.style.backgroundPosition = "center 55%"; // FIX: Adjusted to show more ground
      } else {
        // Zoom in the background to a state between initial and game
        body.style.backgroundSize = "140% auto";
        body.style.backgroundPosition = "center bottom";
      }

      // Return the character to its original size
      if (characterContainer) {
        characterContainer.classList.remove("game-scale");
        characterContainer.classList.add("landing-scale"); // Special class for landing
      }

      // FIX: Call the new function to fine-tune ground level
      // adjustBackgroundGroundLevel();
      break;
  }

  // Check device orientation and apply additional adjustments if necessary
  checkOrientation();
}

// Function to check device orientation and apply adjustments
function checkOrientation() {
  const isLandscape = window.innerWidth > window.innerHeight;
  const body = document.body;

  if (isLandscape && isMobileDevice()) {
    // Special settings for mobile devices in landscape orientation
    // Use width-based sizing for landscape
    body.style.backgroundSize = "120% auto";
    body.style.backgroundPosition = "center 50%"; // Center in landscape
  }
}

// Function to reset background to initial state
function resetBackground() {
  console.log("Resetting background to initial state");
  const body = document.body;
  const characterContainer = document.getElementById("character-container");

  // Ensure transition is enabled for smooth return
  body.style.transition =
    "background-size 1s ease, background-position 1s ease";

  // Reset to initial CSS values from base.css
  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center bottom";
  
  // Remove any specific marginTop that might have been added
  if (characterContainer) {
    characterContainer.style.marginTop = '';
    
    // Reset transform and positioning properties
    characterContainer.style.transform = "";
    characterContainer.style.left = ""; // Reset to CSS default
    characterContainer.style.bottom = ""; // Reset to CSS default
    
    // Make sure to remove all scale classes and add only intro-scale
    characterContainer.classList.remove("game-scale", "landing-scale", "flight-scale", "centered-landing");
    characterContainer.classList.add("intro-scale");
  }
  
  // Force a repaint to ensure changes take effect
  // This can help solve rendering issues in some browsers
  void body.offsetWidth;
  
  // Set explicit "initial" state to ensure proper background reset
  setTimeout(() => {
    updateBackground("initial");
  }, 10);
}

// Function to set blur effect for results background
function setResultsBackground() {
  const body = document.body;
  const isMobile = isMobileDevice();

  body.style.transition =
    "background-size 1s ease, background-position 1s ease";

  if (isMobile) {
    // For mobile, set a more zoomed in state based on height
    body.style.backgroundSize = "auto 160%";
    body.style.backgroundPosition = "center 65%"; // Show more ground on results screen
  } else {
    // For desktop, zoom in the background
    body.style.backgroundSize = "180% auto";
  }
}

// Window resize event listener for background adaptation
window.addEventListener("resize", function () {
  // Determine current game state and update background accordingly
  const gameScreen = document.getElementById("game-screen");
  const resultsScreen = document.getElementById("results-screen");
  const introScreen = document.getElementById("intro-screen");
  const leaderboardScreen = document.getElementById("leaderboard-screen");

  if (gameScreen && gameScreen.classList.contains("active")) {
    updateBackground("zooming-out");
  } else if (resultsScreen && resultsScreen.classList.contains("active")) {
    setResultsBackground();
  } else if (leaderboardScreen && leaderboardScreen.classList.contains("active")) {
    setLeaderboardBackground();
  } else if (introScreen && introScreen.classList.contains("active")) {
    updateBackground("initial");
  }

  // Check orientation
  checkOrientation();
});

// Device orientation change event listener
window.addEventListener("orientationchange", function () {
  // Give the device time to change orientation
  setTimeout(checkOrientation, 300);
});

function setLeaderboardBackground() {
  const body = document.body;
  const isMobile = isMobileDevice();

  // Keep the same background as results screen to avoid jarring transition
  // Don't change any background properties, just leave them as is
  console.log("Maintaining background for leaderboard screen");

  // If we need to make slight adjustments based on device type:
  if (isMobile) {
    // For mobile, keep the current zoom but maybe adjust position slightly
    // No changes to background-size to avoid movement
    body.style.transition = "background-position 0.5s ease"; // Shorter, subtle transition
    body.style.backgroundPosition = "center 65%"; // Consistent with results screen
  }
}

// Add this function to your exports at the bottom of background.js
export {
  updateBackground,
  resetBackground,
  setResultsBackground,
  setLeaderboardBackground, // Add this new export
  isMobileDevice,
  adjustBackgroundGroundLevel,
};
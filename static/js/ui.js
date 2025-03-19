// ui.js - Interface management, screen switching

// Variables for storing interface state
let playerName = "";
let playerEmail = "";

// Function for switching screens
function showScreen(screen) {
  // Check that screen exists
  if (!screen) {
    console.error("Error: Screen is not defined in showScreen function");
    return;
  }

  document.querySelectorAll(".screen").forEach((s) => {
    s.classList.remove("active");
  });
  screen.classList.add("active");
}

// Initialize UI event handlers
function initUIHandlers(
  nameInput,
  emailInput,
  submitButton,
  userForm,
  saveScoreCallback
) {
  // Form input validation
  if (nameInput && emailInput) {
    nameInput.addEventListener("input", () =>
      validateForm(nameInput, emailInput, submitButton)
    );
    emailInput.addEventListener("input", () =>
      validateForm(nameInput, emailInput, submitButton)
    );
  }

  // Results form handler
  if (userForm) {
    userForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveScoreCallback(playerName, playerEmail);
    });
  }
}

// Form validation
function validateForm(nameInput, emailInput, submitButton) {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (name !== "") {
    nameInput.classList.add("valid-input");
  } else {
    nameInput.classList.remove("valid-input");
  }

  if (email !== "" && validateEmail(email)) {
    emailInput.classList.add("valid-input");
  } else {
    emailInput.classList.remove("valid-input");
  }

  if (name !== "" && email !== "" && validateEmail(email)) {
    submitButton.disabled = false;
    submitButton.style.opacity = "1";
    playerName = name;
    playerEmail = email;
  } else {
    submitButton.disabled = true;
    submitButton.style.opacity = "0.7";
  }
}

// Email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Show results screen with given discount
function showResultsScreen(discountElement, discount, resultsScreen) {
  // Check that discount element is defined
  if (discountElement) {
    discountElement.textContent = discount + "%";
  }

  // Check that results screen is defined
  if (!resultsScreen) {
    console.error(
      "Error: resultsScreen is not defined in showResultsScreen function"
    );
    return;
  }

  // Show results screen with a small delay
  setTimeout(() => {
    showScreen(resultsScreen);
  }, 500);
}

// Show pointer near character
function showPointerNearCharacter(pointer, characterContainer) {
  if (!pointer || !characterContainer) {
    console.error("Error: pointer or characterContainer not defined");
    return;
  }

  pointer.classList.remove("hidden");
}

// Hide pointer and instruction
function hidePointerAndInstruction(pointer, swipeInstruction) {
  if (!pointer || !swipeInstruction) {
    console.error("Error: pointer or swipeInstruction not defined");
    return;
  }

  pointer.classList.add("hidden");
  swipeInstruction.style.opacity = "0";
}

// Get player name
function getPlayerName() {
  return playerName;
}

// Get player email
function getPlayerEmail() {
  return playerEmail;
}

export {
  showScreen,
  initUIHandlers,
  validateForm,
  validateEmail,
  showResultsScreen,
  showPointerNearCharacter,
  hidePointerAndInstruction,
  getPlayerName,
  getPlayerEmail,
};

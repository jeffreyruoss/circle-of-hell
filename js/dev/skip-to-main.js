/**
 * Development Utilities - Skip to Main Content
 * Handles URL parameter detection and automatic skip-to-main functionality
 */

class DevSkipToMain {
  constructor() {
    this.urlParams = new URLSearchParams(window.location.search);
  }

  // Check if skip-to-main should be triggered via URL parameters
  shouldSkipToMain() {
    return (
      this.urlParams.get("main") === "true" ||
      this.urlParams.get("skipToMain") === "true"
    );
  }

  // Execute the skip-to-main functionality
  executeSkipToMain() {
    console.log("📄 URL parameter detected - skipping to main content!");

    // Wait a bit for DOM elements to be ready, then execute skip script
    setTimeout(() => {
      this.skipToMainImmediate();
      console.log("📄 Auto-skipped to main content via URL parameter!");
    }, 100);
  }

  // Immediate skip-to-main content
  skipToMainImmediate() {
    // Stop loading messages if they exist
    if (window.LoadingMessages) {
      const loadingMessages = new LoadingMessages();
      loadingMessages.stop();
    }

    // Hide loading screen
    document.querySelector(".loading-container").style.display = "none";

    // Hide start button
    const startButtonContainer = document.querySelector(
      ".start-button-container"
    );
    startButtonContainer.classList.remove("show");
    startButtonContainer.style.display = "none";

    // Hide all intro elements
    const introContainer = document.querySelector(".intro-container");
    introContainer.style.display = "none";

    // Hide intro texts
    const introTexts = document.querySelectorAll(".intro-text");
    introTexts.forEach((text) => {
      text.style.display = "none";
    });

    // Hide main title intro
    const mainTitleIntro = document.querySelector(".main-title-intro");
    mainTitleIntro.style.display = "none";

    // Hide video background (no fire needed for main content)
    const video = document.querySelector(".video-background");
    video.style.display = "none";

    // Hide flash overlay
    const flashOverlay = document.querySelector(".flash-overlay");
    if (flashOverlay) {
      flashOverlay.style.display = "none";
    }

    // Show main content directly
    const contentContainer = document.querySelector(".content-container");
    contentContainer.classList.add("show");
    contentContainer.style.opacity = "1";
    contentContainer.style.transform = "none";
    contentContainer.style.transition = "none";

    // Ensure body background is visible (remove any video background styling)
    document.body.style.background = "#000";
  }

  // Check URL params and execute if needed
  checkAndExecute() {
    if (this.shouldSkipToMain()) {
      this.executeSkipToMain();
      return true;
    }
    return false;
  }
}

// Export for use in other modules
window.DevSkipToMain = DevSkipToMain;

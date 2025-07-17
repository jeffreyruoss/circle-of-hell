/**
 * UI Controller Module
 * Handles user interface events and interactions
 */

class UIController {
  constructor(introAnimations, mediaLoader) {
    this.introAnimations = introAnimations;
    this.mediaLoader = mediaLoader;
    this.loadingContainer = document.querySelector(".loading-container");
    this.startButtonContainer = document.querySelector(
      ".start-button-container"
    );

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Handle all click events
    document.addEventListener("click", (e) => this.handleClick(e));

    // Setup mobile video playback
    this.mediaLoader.setupMobileVideoPlayback();
  }

  handleClick(e) {
    const startButton = e.target.closest(".start-button");

    // Start button clicked
    if (startButton && this.startButtonContainer.classList.contains("show")) {
      console.log("Start button clicked");
      this.hideStartButton();
      this.startApplication();
      return;
    }

    // Skip intro if clicked during animation
    if (this.introAnimations.hasStarted()) {
      this.introAnimations.skipIntro();
    }
  }

  showLoadingScreen() {
    this.loadingContainer.classList.remove("hidden");
  }

  hideLoadingScreen() {
    this.loadingContainer.classList.add("hidden");
  }

  showStartButton() {
    // Normal flow - show start button
    setTimeout(() => {
      this.startButtonContainer.classList.add("show");
    }, 500);
  }

  hideStartButton() {
    this.startButtonContainer.classList.remove("show");
    this.startButtonContainer.classList.add("hidden");
  }

  startApplication() {
    // Skip text sequence if configured
    if (DEV_CONFIG.skipIntro) {
      console.log("🔥 Skipping text sequence - jumping to fire");
      this.introAnimations.startFireDirectly();
    } else {
      this.introAnimations.startIntroSequence();
    }
  }

  onMediaLoaded() {
    console.log("All media loaded");
    this.hideLoadingScreen();
    this.showStartButton();
  }
}

// Export for use in other modules
window.UIController = UIController;

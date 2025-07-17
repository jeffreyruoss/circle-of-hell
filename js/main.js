/**
 * Main Application Controller
 * Orchestrates all modules and initializes the application
 */

class CircleOfHellApp {
  constructor() {
    this.mediaLoader = null;
    this.effects = null;
    this.introAnimations = null;
    this.uiController = null;
  }

  init() {
    // Initialize all modules in the correct order
    this.mediaLoader = new MediaLoader();
    this.effects = new Effects();
    this.introAnimations = new IntroAnimations(this.mediaLoader, this.effects);
    this.uiController = new UIController(
      this.introAnimations,
      this.mediaLoader
    );

    // Set up media loading callback
    this.mediaLoader.onAllLoaded(() => {
      this.uiController.onMediaLoaded();
    });

    console.log("Circle of Hell application initialized");
  }
}

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Check for development skip-to-fire URL parameters first
  const devSkipToFire = new DevSkipToFire();
  const skippedToFire = devSkipToFire.checkAndExecute();

  // Only initialize normal app flow if not skipping to fire
  if (!skippedToFire) {
    const app = new CircleOfHellApp();
    app.init();
  }
});

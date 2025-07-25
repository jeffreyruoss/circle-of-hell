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
    this.cinderParticles = null;
    this.loadingMessages = null;
  }

  init() {
    // Initialize loading messages first
    this.loadingMessages = new LoadingMessages();

    // Initialize all modules in the correct order
    this.mediaLoader = new MediaLoader();
    this.effects = new Effects();
    this.cinderParticles = new CinderParticles();
    this.introAnimations = new IntroAnimations(
      this.mediaLoader,
      this.effects,
      this.cinderParticles
    );
    this.uiController = new UIController(
      this.introAnimations,
      this.mediaLoader
    );

    // Set up media loading callback
    this.mediaLoader.onAllLoaded(() => {
      // Stop loading messages when media is loaded
      this.loadingMessages.onLoadingComplete();
      this.uiController.onMediaLoaded();
    });

    console.log("Circle of Hell application initialized");
  }
}

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Check for development skip URL parameters first
  const devSkipToFire = new DevSkipToFire();
  const skippedToFire = devSkipToFire.checkAndExecute();

  const devSkipToMain = new DevSkipToMain();
  const skippedToMain = devSkipToMain.checkAndExecute();

  // Only initialize normal app flow if not skipping anywhere
  if (!skippedToFire && !skippedToMain) {
    const app = new CircleOfHellApp();
    app.init();
  }
});

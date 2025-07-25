/**
 * Development Utilities - Skip to Fire
 * Handles URL parameter detection and automatic skip-to-fire functionality
 */

class DevSkipToFire {
  constructor() {
    this.urlParams = new URLSearchParams(window.location.search);
  }

  // Check if skip-to-fire should be triggered via URL parameters
  shouldSkipToFire() {
    return (
      this.urlParams.get("skipToFire") === "true" ||
      this.urlParams.get("fire") === "true"
    );
  }

  // Execute the skip-to-fire functionality
  executeSkipToFire() {
    console.log("🔥 URL parameter detected - skipping to fire!");

    // Wait a bit for DOM elements to be ready, then execute skip script
    setTimeout(() => {
      this.skipToFireImmediate();
      console.log(
        "🔥 Auto-skipped to fire via URL parameter! (with smooth glow animation)"
      );
    }, 100);
  }

  // Immediate skip-to-fire (keeps glow animation)
  skipToFireImmediate() {
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

    // Show main title at final large size (skip fade-in and zoom animation but keep glow)
    const mainTitle = document.querySelector(".main-title-intro");
    mainTitle.classList.add("show");
    mainTitle.style.opacity = "1";
    // Commented out performance-heavy animation: mainTitle.style.animation = "glowPulse 3s ease-in-out infinite alternate";
    // Static text-shadow for better performance - using same as stats
    mainTitle.style.textShadow =
      "0 0 50px rgba(255, 102, 0, 1), 0 0 70px rgba(255, 102, 0, 0.9), 0 0 100px rgba(255, 102, 0, 0.7), 0 0 150px rgba(255, 102, 0, 0.5), 0 0 150px rgba(255, 0, 0, 0.4), 0 0 4px rgba(255, 255, 255, 0.1), 0 0 2px rgba(255, 102, 0, 0.4)";
    mainTitle.style.transition = "none";
    mainTitle.style.transform = "translate(-50%, -50%) scale(1.4)";

    // Show fire background video
    const video = document.querySelector(".video-background");
    video.style.transition = "none";
    video.style.opacity = "0.8";

    // Enable video background
    document.querySelector(".intro-container").classList.add("video-showing");

    // Start video
    video.currentTime = 0;
    video
      .play()
      .catch((error) => console.log("Video autoplay blocked:", error));

    // Start cinder particles
    const cinderParticles = new CinderParticles();
    cinderParticles.onFireStart();
  }

  // Check URL params and execute if needed
  checkAndExecute() {
    if (this.shouldSkipToFire()) {
      this.executeSkipToFire();
      return true;
    }
    return false;
  }
}

// Export for use in other modules
window.DevSkipToFire = DevSkipToFire;

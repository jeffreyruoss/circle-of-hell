/**
 * Loading Messages Module
 * Cycles through funny loading messages with animated dots
 */

class LoadingMessages {
  constructor() {
    // Configuration variables - Easy to adjust timing
    this.config = {
      messageInterval: 1000, // Time each message shows (milliseconds) - 2 seconds
      dotAnimationSpeed: 200, // Speed of dot animation (milliseconds) - 0.5 seconds per dot
      startDelay: 0, // Delay before starting message cycling (milliseconds)
    };

    // Loading messages in specified order
    this.messages = [
      "Reciting incantations",
      "Polishing pitchforks",
      "Opening the portal",
      "Summoning demons",
      "Heating up the underworld",
      "Tuning hellish frequencies",
      "Awakening ancient evils",
      "Brewing sulfur smoothies",
      "Charging fire crystals",
      "Updating devil software",
      "Preheating the furnace",
      "Consulting the dark arts manual",
      "Downloading nightmares",
    ];

    this.currentMessageIndex = 0;
    this.currentDotCount = 0;
    this.maxDots = 3;
    this.isActive = false;
    this.messageTimer = null;
    this.dotTimer = null;
    this.loadingTextElement = null;

    this.init();
  }

  init() {
    this.loadingTextElement = document.querySelector(".loading-text");
    if (!this.loadingTextElement) {
      console.error("Loading text element not found");
      return;
    }

    // Start the loading message system after a short delay
    setTimeout(() => {
      this.start();
    }, this.config.startDelay);
  }

  start() {
    if (this.isActive) return;

    console.log("🔥 Starting loading messages");
    this.isActive = true;
    this.showCurrentMessage();
    this.startMessageCycling();
    this.startDotAnimation();
  }

  stop() {
    if (!this.isActive) return;

    console.log("🔥 Stopping loading messages");
    this.isActive = false;

    if (this.messageTimer) {
      clearInterval(this.messageTimer);
      this.messageTimer = null;
    }

    if (this.dotTimer) {
      clearInterval(this.dotTimer);
      this.dotTimer = null;
    }
  }

  showCurrentMessage() {
    if (!this.loadingTextElement || !this.isActive) return;

    const message = this.messages[this.currentMessageIndex];
    const dots = ".".repeat(this.currentDotCount);

    // Create fixed-width dots container to prevent text shifting
    const dotsContainer = '<span class="loading-dots">' + dots + "</span>";
    this.loadingTextElement.innerHTML = message + dotsContainer;
  }

  startMessageCycling() {
    this.messageTimer = setInterval(() => {
      if (!this.isActive) return;

      this.currentMessageIndex =
        (this.currentMessageIndex + 1) % this.messages.length;
      this.currentDotCount = 1; // Reset dots when message changes
      this.showCurrentMessage();
    }, this.config.messageInterval);
  }

  startDotAnimation() {
    this.dotTimer = setInterval(() => {
      if (!this.isActive) return;

      this.currentDotCount = (this.currentDotCount % this.maxDots) + 1;
      this.showCurrentMessage();
    }, this.config.dotAnimationSpeed);
  }

  // Method to be called when loading is complete
  onLoadingComplete() {
    this.stop();
  }
}

// Export for use in other modules
window.LoadingMessages = LoadingMessages;

/**
 * Effects Module
 * Handles flash effects, visual effects, and timeout management
 */

class Effects {
  constructor() {
    this.flashOverlay = document.querySelector(".flash-overlay");
    this.timeouts = [];
    this.intervals = [];
    this.setupTimeoutTracking();
  }

  setupTimeoutTracking() {
    // Track timeouts for cleanup
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;

    window.setTimeout = (callback, delay) => {
      const timeoutId = originalSetTimeout(callback, delay);
      this.timeouts.push(timeoutId);
      return timeoutId;
    };

    window.setInterval = (callback, delay) => {
      const intervalId = originalSetInterval(callback, delay);
      this.intervals.push(intervalId);
      return intervalId;
    };
  }

  createFlash() {
    if (!DEV_CONFIG.skipIntro) {
      this.flashOverlay.classList.add("flash");
      setTimeout(() => {
        this.flashOverlay.classList.remove("flash");
      }, 150);
    }
  }

  startDrumHitEffects(mediaLoader) {
    // First drum hit at 17 seconds (fire already appeared at 12.65s)
    this.restartVideoAndFlash(mediaLoader);

    // Then every 4.35 seconds until 5th flash (21.35s, 25.7s, 30.05s)
    let drumHitCount = 1;
    const initialInterval = setInterval(() => {
      this.restartVideoAndFlash(mediaLoader);
      drumHitCount++;

      // After 5th flash (30.05s), change to 2.5 second intervals
      if (drumHitCount >= 4) {
        // 4th hit in interval (5th total)
        clearInterval(initialInterval);
        // Start new faster interval
        setInterval(() => {
          this.restartVideoAndFlash(mediaLoader);
        }, 2500);
      }
    }, 4350);
  }

  restartVideoAndFlash(mediaLoader) {
    // Restart video from beginning
    mediaLoader.restartVideo();

    // Flash effect (skip if skipping intro)
    this.createFlash();
  }

  stopFlashEffects(mediaLoader) {
    // Clear all intervals and timeouts to stop flash effects completely
    this.clearAllTimeouts();

    // Hide flash overlay completely
    this.flashOverlay.style.display = "none";

    // Pause the video to reduce distraction while reading
    mediaLoader.pauseVideo();
  }

  clearAllTimeouts() {
    this.timeouts.forEach((id) => clearTimeout(id));
    this.timeouts = [];

    this.intervals.forEach((id) => clearInterval(id));
    this.intervals = [];
  }

  showVideoBackground() {
    // Remove black overlay instantly (no background transition)
    document.querySelector(".intro-container").classList.add("video-showing");
  }
}

// Export for use in other modules
window.Effects = Effects;

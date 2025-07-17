/**
 * Intro Animations Module
 * Handles the intro sequence animations and transitions
 */

class IntroAnimations {
  constructor(mediaLoader, effects) {
    this.mediaLoader = mediaLoader;
    this.effects = effects;
    this.introHasStarted = false;
    this.introTexts = document.querySelectorAll(".intro-text");
    this.mainTitleIntro = document.querySelector(".main-title-intro");
    this.contentContainer = document.querySelector(".content-container");
  }

  startIntroSequence() {
    this.introHasStarted = true;

    this.mediaLoader.playAudio();

    // Switch to second audio at 5th flash (30.15 seconds)
    setTimeout(() => {
      console.log("Switching to audio2 at 5th flash (30.15s)");
      this.mediaLoader.switchToAudio2();
      // Hide title and show main content
      this.hideMainTitle();
      this.showMainContent();
      // Stop the flash effects
      this.effects.stopFlashEffects(this.mediaLoader);
    }, 30100);

    // Check if we should skip the text sequence
    if (DEV_CONFIG.skipIntro) {
      console.log("🔥 Skipping text sequence in intro - jumping to fire");
      this.startFireDirectly();
      return;
    }

    // Show stats one by one, fading out previous
    setTimeout(() => this.showIntroText(0), 700); // Fire - 3 hourz
    setTimeout(() => {
      this.hideIntroText(0); // Hide Fire
      this.showIntroText(1); // Show Death - 1 mile loop
    }, 2700);
    setTimeout(() => {
      this.hideIntroText(1); // Hide Death
      this.showIntroText(2); // Show Fun - 2much FUn!
    }, 4700);

    // Hide stats and show main title at 6.5 seconds (NO FIRE YET)
    setTimeout(() => {
      this.hideIntroText(2); // Hide the last stat (Fun)
      setTimeout(() => this.showMainTitleOnly(), 500);
    }, 6200);

    // Show fire background and flash at 12.65 seconds (perfectly on beat)
    setTimeout(() => {
      this.showFireBackground();
    }, 12650);
  }

  startFireDirectly() {
    console.log("🔥 Starting fire directly - skipping text sequence");

    // Start audio when jumping to fire
    this.mediaLoader.playAudio();

    // Switch to second audio at 5th flash (30.15 seconds)
    setTimeout(() => {
      console.log("Switching to audio2 at 5th flash (30.15s)");
      this.mediaLoader.switchToAudio2();
      // Hide title and show main content
      this.hideMainTitle();
      this.showMainContent();
      // Stop the flash effects
      this.effects.stopFlashEffects(this.mediaLoader);
    }, 30100);

    this.hideAllIntroTexts();
    this.showMainTitleOnly();
    setTimeout(() => {
      this.showFireBackground();
    }, 500);
  }

  showIntroText(index) {
    if (this.introTexts[index]) {
      this.introTexts[index].classList.add("show");
    }
  }

  hideIntroText(index) {
    if (this.introTexts[index]) {
      this.introTexts[index].classList.remove("show");
    }
  }

  hideAllIntroTexts() {
    this.introTexts.forEach((text) => {
      text.classList.remove("show");
    });
  }

  showMainTitleOnly() {
    // Show main title ONLY (no fire background yet)
    this.mainTitleIntro.classList.add("show");
  }

  showFireBackground() {
    // Flash effect synchronized with fire appearance (skip if skipping intro)
    if (!DEV_CONFIG.skipIntro) {
      this.effects.createFlash();
    }

    // Show video background
    this.mediaLoader.showVideo();
    this.effects.showVideoBackground();

    // Start video fresh from beginning
    this.mediaLoader.playVideo();

    // Set up drum hit effects only if not skipping text sequence
    if (!DEV_CONFIG.skipIntro) {
      const drumDelay = 4350;
      setTimeout(
        () => this.effects.startDrumHitEffects(this.mediaLoader),
        drumDelay
      );
    }
  }

  showMainTitle() {
    // Combined function for skip functionality
    this.showMainTitleOnly();
    this.showFireBackground();
  }

  hideMainTitle() {
    this.mainTitleIntro.classList.remove("show");
  }

  showMainContent() {
    this.contentContainer.classList.add("show");
  }

  skipIntro() {
    if (
      this.introHasStarted &&
      !this.mainTitleIntro.classList.contains("show")
    ) {
      console.log("Skipping intro");
      this.effects.clearAllTimeouts();
      this.hideAllIntroTexts();
      this.showMainTitle();
    }
  }

  hasStarted() {
    return this.introHasStarted;
  }
}

// Export for use in other modules
window.IntroAnimations = IntroAnimations;

/**
 * Media Loader Module
 * Handles loading and management of audio and video files
 */

class MediaLoader {
  constructor() {
    this.video = document.querySelector(".video-background");
    this.audio = null;
    this.audio2 = null;
    this.videoLoaded = DEV_CONFIG.disableVideo;
    this.audioLoaded = DEV_CONFIG.disableAudio;
    this.audio2Loaded = DEV_CONFIG.disableAudio;
    this.onAllLoadedCallback = null;

    this.init();
  }

  init() {
    this.setupAudio();
    this.setupVideo();
    this.setupFallbackTimeout();
  }

  setupAudio() {
    if (!DEV_CONFIG.disableAudio) {
      this.audio = new Audio("audio/cohr.mp3");
      this.audio.preload = "auto";
      this.audio2 = new Audio("audio/cohr2.mp3");
      this.audio2.preload = "auto";

      this.audio.addEventListener(
        "canplay",
        () => {
          console.log("Audio ready to play");
          this.audioLoaded = true;
          this.checkAllLoaded();
        },
        { once: true }
      );

      this.audio.addEventListener(
        "error",
        () => {
          console.log("Audio loading error");
          this.audioLoaded = true;
          this.checkAllLoaded();
        },
        { once: true }
      );

      this.audio2.addEventListener(
        "canplay",
        () => {
          console.log("Audio2 ready to play");
          this.audio2Loaded = true;
          this.checkAllLoaded();
        },
        { once: true }
      );

      this.audio2.addEventListener(
        "error",
        () => {
          console.log("Audio2 loading error");
          this.audio2Loaded = true;
          this.checkAllLoaded();
        },
        { once: true }
      );
    }
  }

  setupVideo() {
    if (!DEV_CONFIG.disableVideo) {
      this.video.addEventListener(
        "canplay",
        () => {
          console.log("Video ready to play");
          this.videoLoaded = true;
          this.checkAllLoaded();
        },
        { once: true }
      );

      this.video.addEventListener(
        "error",
        () => {
          console.log("Video loading error");
          this.videoLoaded = true;
          this.checkAllLoaded();
        },
        { once: true }
      );
    }
  }

  setupFallbackTimeout() {
    // Fallback timeout (3 seconds)
    setTimeout(() => {
      if (!this.videoLoaded || !this.audioLoaded || !this.audio2Loaded) {
        console.log("Timeout reached, starting anyway");
        console.log(
          `Video loaded: ${this.videoLoaded}, Audio loaded: ${this.audioLoaded}, Audio2 loaded: ${this.audio2Loaded}`
        );
        this.videoLoaded = true;
        this.audioLoaded = true;
        this.audio2Loaded = true;
        this.checkAllLoaded();
      }
    }, 3000);
  }

  checkAllLoaded() {
    if (this.videoLoaded && this.audioLoaded && this.audio2Loaded) {
      console.log("All media loaded");
      if (this.onAllLoadedCallback) {
        this.onAllLoadedCallback();
      }
    }
  }

  onAllLoaded(callback) {
    this.onAllLoadedCallback = callback;
  }

  playAudio() {
    if (this.audio && !DEV_CONFIG.disableAudio) {
      return this.audio.play();
    }
    return Promise.resolve();
  }

  switchToAudio2() {
    if (!DEV_CONFIG.disableAudio) {
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
      }
      if (this.audio2) {
        return this.audio2.play();
      }
    }
    return Promise.resolve();
  }

  playVideo() {
    if (!DEV_CONFIG.disableVideo) {
      this.video.currentTime = 0;
      const playPromise = this.video.play();
      if (playPromise !== undefined) {
        return playPromise.catch((error) =>
          console.log("Video autoplay failed:", error)
        );
      }
    }
    return Promise.resolve();
  }

  pauseVideo() {
    if (!DEV_CONFIG.disableVideo) {
      this.video.pause();
    }
  }

  restartVideo() {
    if (!DEV_CONFIG.disableVideo) {
      this.video.currentTime = 0;
    }
  }

  showVideo() {
    this.video.style.transition = "none";
    this.video.style.opacity = "0.8";
  }

  setupMobileVideoPlayback() {
    // Handle touch events for mobile video playback
    document.addEventListener(
      "touchstart",
      () => {
        if (this.video.paused) {
          this.video.play();
        }
      },
      { once: true }
    );
  }
}

// Export for use in other modules
window.MediaLoader = MediaLoader;

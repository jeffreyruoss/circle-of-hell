// Simplified intro animation controller
document.addEventListener("DOMContentLoaded", function () {
  const video = document.querySelector(".video-background");

  // Conditionally load audio
  let audio = null;
  if (!DEV_CONFIG.disableAudio) {
    audio = new Audio("audio/cohr.mp3");
    audio.preload = "auto";
  }

  let videoLoaded = DEV_CONFIG.disableVideo;
  let audioLoaded = DEV_CONFIG.disableAudio;
  let introHasStarted = false;

  // Check when both video and audio are loaded (only once each)
  if (!DEV_CONFIG.disableVideo) {
    video.addEventListener(
      "canplaythrough",
      function () {
        console.log("Video loaded");
        videoLoaded = true;
        checkAllLoaded();
      },
      { once: true }
    );

    video.addEventListener(
      "error",
      function () {
        console.log("Video loading error");
        videoLoaded = true;
        checkAllLoaded();
      },
      { once: true }
    );
  }

  if (!DEV_CONFIG.disableAudio && audio) {
    audio.addEventListener(
      "canplaythrough",
      function () {
        console.log("Audio loaded");
        audioLoaded = true;
        checkAllLoaded();
      },
      { once: true }
    );

    audio.addEventListener(
      "error",
      function () {
        console.log("Audio loading error");
        audioLoaded = true;
        checkAllLoaded();
      },
      { once: true }
    );
  }

  function checkAllLoaded() {
    if (videoLoaded && audioLoaded) {
      console.log("All media loaded");
      document.querySelector(".loading-container").classList.add("hidden");

      // Normal flow - show start button
      setTimeout(() => {
        document.querySelector(".start-button-container").classList.add("show");
      }, 500);
    }
  }

  // Fallback timeout
  setTimeout(() => {
    if (!videoLoaded || !audioLoaded) {
      console.log("Timeout reached, starting anyway");
      videoLoaded = true;
      audioLoaded = true;
      checkAllLoaded();
    }
  }, 10000);

  // Handle clicks
  document.addEventListener("click", function (e) {
    const startButton = e.target.closest(".start-button");
    const startButtonContainer = document.querySelector(
      ".start-button-container"
    );

    // Start button clicked
    if (startButton && startButtonContainer.classList.contains("show")) {
      console.log("Start button clicked");
      startButtonContainer.classList.remove("show");
      startButtonContainer.classList.add("hidden");

      // Skip text sequence if configured
      if (DEV_CONFIG.skipIntro) {
        console.log("🔥 Skipping text sequence - jumping to fire");
        startFireDirectly();
      } else {
        startIntroSequence();
      }
      return;
    }

    // Skip intro if clicked during animation
    if (introHasStarted && !document.querySelector(".main-title-intro.show")) {
      console.log("Skipping intro");
      clearAllTimeouts();
      hideAllIntroTexts();
      showMainTitle();
    }
  });

  function startIntroSequence() {
    introHasStarted = true;
    if (audio && !DEV_CONFIG.disableAudio) {
      audio.play();
    }

    // Check if we should skip the text sequence
    if (DEV_CONFIG.skipIntro) {
      console.log("🔥 Skipping text sequence in intro - jumping to fire");
      startFireDirectly();
      return;
    }

    // Show stats one by one, fading out previous
    setTimeout(() => showIntroText(0), 1000); // Fire - 3 hourz
    setTimeout(() => {
      hideIntroText(0); // Hide Fire
      showIntroText(1); // Show Death - 1 mile loop
    }, 3000);
    setTimeout(() => {
      hideIntroText(1); // Hide Death
      showIntroText(2); // Show Fun - 2much FUn!
    }, 5000);

    // Hide stats and show main title at 7 seconds (NO FIRE YET)
    setTimeout(() => {
      hideIntroText(2); // Hide the last stat (Fun)
      setTimeout(() => showMainTitleOnly(), 500);
    }, 7000);

    // Show fire background and flash at 12.65 seconds (perfectly on beat)
    setTimeout(() => {
      showFireBackground();
    }, 12650);
  }

  function showIntroText(index) {
    const introTexts = document.querySelectorAll(".intro-text");
    if (introTexts[index]) {
      introTexts[index].classList.add("show");
    }
  }

  function hideIntroText(index) {
    const introTexts = document.querySelectorAll(".intro-text");
    if (introTexts[index]) {
      introTexts[index].classList.remove("show");
    }
  }

  function hideAllIntroTexts() {
    document.querySelectorAll(".intro-text").forEach((text) => {
      text.classList.remove("show");
    });
  }

  function showMainTitleOnly() {
    // Show main title ONLY (no fire background yet)
    document.querySelector(".main-title-intro").classList.add("show");
  }

  function showFireBackground() {
    // Flash effect synchronized with fire appearance (skip if skipping intro)
    if (!DEV_CONFIG.skipIntro) {
      const flashOverlay = document.querySelector(".flash-overlay");
      flashOverlay.classList.add("flash");
      setTimeout(() => {
        flashOverlay.classList.remove("flash");
      }, 150);
    }

    // Instant fire appearance (no fade/transition)
    // Using direct style manipulation for immediate effect
    video.style.transition = "none";
    video.style.opacity = "0.8";

    // Remove black overlay instantly (no background transition)
    document.querySelector(".intro-container").classList.add("video-showing");

    // Start video fresh from beginning
    if (!DEV_CONFIG.disableVideo) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) =>
          console.log("Video autoplay failed:", error)
        );
      }
    }

    // Set up drum hit effects only if not skipping text sequence
    if (!DEV_CONFIG.skipIntro) {
      const drumDelay = 4350;
      setTimeout(() => startDrumHitEffects(), drumDelay);
    }
  }

  // Function to jump straight to fire (skipping text sequence)
  function startFireDirectly() {
    console.log("🔥 Starting fire directly - skipping text sequence");
    hideAllIntroTexts();
    showMainTitleOnly();
    setTimeout(() => {
      showFireBackground();
    }, 500);
  }

  function showMainTitle() {
    // Combined function for skip functionality
    showMainTitleOnly();
    showFireBackground();
  }

  // Removed quickFireFade function - no fade effects for fire

  // Handle touch events for mobile video playback
  document.addEventListener(
    "touchstart",
    function () {
      if (video.paused) {
        video.play();
      }
    },
    { once: true }
  );

  // Timeout tracking for cleanup
  let timeouts = [];
  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function (callback, delay) {
    const timeoutId = originalSetTimeout(callback, delay);
    timeouts.push(timeoutId);
    return timeoutId;
  };

  function clearAllTimeouts() {
    timeouts.forEach((id) => clearTimeout(id));
    timeouts = [];
  }

  function startDrumHitEffects() {
    // First drum hit at 17 seconds (fire already appeared at 12.65s)
    restartVideoAndFlash();

    // Then every 4.35 seconds after that (21.35s, 25.7s, etc.)
    setInterval(() => {
      restartVideoAndFlash();
    }, 4350);
  }

  function restartVideoAndFlash() {
    // Restart video from beginning
    if (!DEV_CONFIG.disableVideo) {
      video.currentTime = 0;
    }

    // Flash effect (skip if skipping intro)
    if (!DEV_CONFIG.skipIntro) {
      const flashOverlay = document.querySelector(".flash-overlay");
      flashOverlay.classList.add("flash");

      // Remove flash after brief moment
      setTimeout(() => {
        flashOverlay.classList.remove("flash");
      }, 150);
    }
  }
});

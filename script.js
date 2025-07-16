// Simplified intro animation controller
document.addEventListener("DOMContentLoaded", function () {
  const video = document.querySelector(".video-background");
  const audio = new Audio("audio/cohr.mp3");
  audio.preload = "auto";

  let videoLoaded = false;
  let audioLoaded = false;
  let introHasStarted = false;

  // Check when both video and audio are loaded
  video.addEventListener("canplaythrough", function () {
    console.log("Video loaded");
    videoLoaded = true;
    checkAllLoaded();
  });

  audio.addEventListener("canplaythrough", function () {
    console.log("Audio loaded");
    audioLoaded = true;
    checkAllLoaded();
  });

  // Handle loading errors
  video.addEventListener("error", function () {
    console.log("Video loading error");
    videoLoaded = true;
    checkAllLoaded();
  });

  audio.addEventListener("error", function () {
    console.log("Audio loading error");
    audioLoaded = true;
    checkAllLoaded();
  });

  function checkAllLoaded() {
    if (videoLoaded && audioLoaded) {
      console.log("All media loaded, showing start button");
      document.querySelector(".loading-container").classList.add("hidden");
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
      startIntroSequence();
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
    audio.play();

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
    // Flash effect synchronized with fire appearance
    const flashOverlay = document.querySelector(".flash-overlay");
    flashOverlay.classList.add("flash");
    setTimeout(() => {
      flashOverlay.classList.remove("flash");
    }, 150);

    // Instant fire appearance (no fade/transition)
    // Using direct style manipulation for immediate effect
    video.style.transition = "none";
    video.style.opacity = "0.8";

    // Remove black overlay instantly (no background transition)
    document.querySelector(".intro-container").classList.add("video-showing");

    // Start video fresh from beginning
    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) =>
        console.log("Video autoplay failed:", error)
      );
    }

    // Set up drum hit effects starting at 17 seconds (4350ms after fire appears)
    setTimeout(() => startDrumHitEffects(), 4350); // 17s total (12.65s + 4.35s)
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
    video.currentTime = 0;

    // Flash effect
    const flashOverlay = document.querySelector(".flash-overlay");
    flashOverlay.classList.add("flash");

    // Remove flash after brief moment
    setTimeout(() => {
      flashOverlay.classList.remove("flash");
    }, 150);
  }
});

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

    // Show fire background at 12 seconds, then quick fade
    setTimeout(() => {
      showFireBackground();
      setTimeout(() => quickFireFade(), 500);
    }, 12000);
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
    // Show video background and make container transparent
    video.classList.add("show");
    document.querySelector(".intro-container").classList.add("video-showing");

    // Try to play video
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) =>
        console.log("Video autoplay failed:", error)
      );
    }
  }

  function showMainTitle() {
    // Combined function for skip functionality
    showMainTitleOnly();
    showFireBackground();
  }

  function quickFireFade() {
    video.style.transition = "opacity 0.5s ease-in-out";
    video.style.opacity = "0.3";

    setTimeout(() => {
      video.style.opacity = "0.8";
    }, 500);

    setTimeout(() => {
      video.style.transition = "opacity 3s ease-in-out";
    }, 1000);
  }

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
});

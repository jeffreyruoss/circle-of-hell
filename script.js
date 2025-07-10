// Intro animation sequence
document.addEventListener("DOMContentLoaded", function () {
  const video = document.querySelector(".video-background");
  const introContainer = document.querySelector(".intro-container");
  const contentContainer = document.querySelector(".content-container");

  // Create audio element
  const audio = new Audio("audio/cohr.mp3");
  audio.preload = "auto";

  let videoLoaded = false;
  let audioLoaded = false;

  // Show loading spinner initially
  showLoadingSpinner();

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
    videoLoaded = true; // Continue anyway
    checkAllLoaded();
  });

  audio.addEventListener("error", function () {
    console.log("Audio loading error");
    audioLoaded = true; // Continue anyway
    checkAllLoaded();
  });

  function checkAllLoaded() {
    if (videoLoaded && audioLoaded) {
      console.log("All media loaded, starting sequence");
      hideLoadingSpinner();
      setTimeout(() => {
        showStartButton();
      }, 500);
    }
  }

  let introHasStarted = false;

  // Show start button
  function showStartButton() {
    console.log("Showing start button");
    const startButtonContainer = document.querySelector(
      ".start-button-container"
    );
    startButtonContainer.classList.add("show");
  }

  // Handle all clicks during the intro process
  document.addEventListener("click", function (e) {
    const startButton = e.target.closest(".start-button");
    const startButtonContainer = document.querySelector(
      ".start-button-container"
    );

    // Case 1: The user clicked the "ENTER THE CIRCLE" button
    if (startButton && startButtonContainer.classList.contains("show")) {
      console.log("Start button clicked");
      startButtonContainer.classList.remove("show");
      startIntroSequence();
      return; // Stop further processing
    }

    // Case 2: The user clicked to skip the intro animation
    if (introHasStarted && !document.querySelector(".main-title-intro")) {
      console.log("Skipping intro");
      clearAllTimeouts();
      hideAllIntroTexts();
      showMainTitle();
    }
  });

  // Fallback timeout in case media doesn't load
  setTimeout(() => {
    if (!videoLoaded || !audioLoaded) {
      console.log("Timeout reached, starting sequence anyway");
      videoLoaded = true;
      audioLoaded = true;
      checkAllLoaded();
    }
  }, 10000); // 10 second timeout

  function startIntroSequence() {
    introHasStarted = true;
    audio.play();
    // Step 1: Show "3 hourz" after 1 second
    setTimeout(() => {
      showIntroText("🔥 - 3 hourz", "fire");
    }, 1000);

    // Step 2: Show "1 mile loop" after 3 seconds
    setTimeout(() => {
      showIntroText("💀 - 1 mile loop", "death");
    }, 3000);

    // Step 3: Show "2much FUn!" after 5 seconds
    setTimeout(() => {
      showIntroText("😈 - 2much FUn!", "fun");
    }, 5000);

    // Step 4: Show main title with video background after 7 seconds
    setTimeout(() => {
      hideAllIntroTexts();
      setTimeout(() => {
        showMainTitle();
      }, 500);
    }, 7000);

    // Step 5: Quick fire background fade at 12 seconds
    setTimeout(() => {
      quickFireFade();
    }, 12000);

    // Step 6: Show full content after 15 seconds (DISABLED FOR NOW)
    // setTimeout(() => {
    //   showMainContent();
    // }, 15000);
  }

  function showIntroText(text, className) {
    const introText = document.createElement("div");
    introText.className = `intro-text ${className}`;
    introText.textContent = text;

    const container = document.querySelector(".intro-container");
    container.appendChild(introText);

    // Trigger animation
    setTimeout(() => {
      introText.classList.add("show");
    }, 100);
  }

  function hideAllIntroTexts() {
    const introTexts = document.querySelectorAll(".intro-text");
    introTexts.forEach((text) => {
      text.classList.remove("show");
    });
  }

  function showMainTitle() {
    // Start video background
    console.log("Starting video background...", video);
    video.classList.add("show");
    console.log("Video classes:", video.className);
    playVideo();

    // Make intro container background transparent to show video
    introContainer.classList.add("video-showing");

    // Show main title
    const titleText = document.createElement("div");
    titleText.className = "main-title-intro";
    titleText.textContent = "⭕2025🔥 COHR LIVEZ!";

    const container = document.querySelector(".intro-container");
    container.innerHTML = "";
    container.appendChild(titleText);

    // Trigger animation
    setTimeout(() => {
      titleText.classList.add("show");
    }, 100);
  }

  function showMainContent() {
    // Hide intro container
    introContainer.style.opacity = "0";
    setTimeout(() => {
      introContainer.classList.add("hidden");
    }, 1000);

    // Show main content
    contentContainer.classList.add("show");
  }

  function playVideo() {
    // Try to play the video
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(function () {
          // Video started playing successfully
        })
        .catch(function (error) {
          // Video failed to play, probably due to autoplay restrictions
          console.log("Video autoplay failed:", error);
        });
    }
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

  // Keep track of timeouts for cleanup
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

  function showLoadingSpinner() {
    const loadingContainer = document.createElement("div");
    loadingContainer.className = "loading-container";
    loadingContainer.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading Circle of Hell...</div>
    `;

    introContainer.innerHTML = "";
    introContainer.appendChild(loadingContainer);
  }

  function hideLoadingSpinner() {
    const loadingContainer = document.querySelector(".loading-container");
    if (loadingContainer) {
      loadingContainer.style.opacity = "0";
      setTimeout(() => {
        introContainer.innerHTML = "";
      }, 500);
    }
  }

  function quickFireFade() {
    // Quick half-second fade of fire background
    video.style.transition = "opacity 0.5s ease-in-out";
    video.style.opacity = "0.3";

    setTimeout(() => {
      video.style.opacity = "0.8";
    }, 500);

    // Reset transition back to normal
    setTimeout(() => {
      video.style.transition = "opacity 3s ease-in-out";
    }, 1000);
  }
});

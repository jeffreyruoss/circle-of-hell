// Updated console script that preserves glow animation
// Paste this into browser console to skip to fire with animated glow

// Hide loading screen
document.querySelector(".loading-container").style.display = "none";

// Hide start button
const startButtonContainer = document.querySelector(".start-button-container");
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
video.play().catch((error) => console.log("Video autoplay blocked:", error));

// Start cinder particles
const cinderParticles = new CinderParticles();
cinderParticles.onFireStart();

console.log(
  "🔥 Skipped to fire! Main title at final size with smooth glow animation and cinder particles!"
);

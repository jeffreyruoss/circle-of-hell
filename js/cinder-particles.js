/**
 * Cinder Particles Module
 * Creates subtle floating cinder particles behind the main title
 */

class CinderParticles {
  constructor() {
    // Configuration variables - Easy to adjust particle behavior
    this.config = {
      spawnRate: 0.15, // QUANTITY: Chance per frame to create particle (0.0-1.0) - Higher = more particles
      velocityMultiplier: 10, // SPEED: Speed multiplier for particle movement - Higher = faster movement
      maxOpacity: 0.6, // Maximum opacity for subtlety
      particleSize: {
        min: 1, // Minimum particle size (px)
        max: 4, // Maximum particle size (px)
      },
      areaSize: 0.2, // Spawn area size (% of screen dimension)
      fadeSpeed: {
        min: 0.003, // Minimum fade speed
        max: 0.011, // Maximum fade speed
      },
    };

    this.container = null;
    this.particles = [];
    this.isActive = false;
    this.animationFrameId = null;
    this.createContainer();
  }

  createContainer() {
    // Create particle container behind main title
    this.container = document.createElement("div");
    this.container.className = "cinder-particles-container";
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
      overflow: hidden;
    `;
    document.body.appendChild(this.container);
  }

  createParticle() {
    const particle = document.createElement("div");
    particle.className = "cinder-particle";

    // Random starting position (center area around title)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const areaSize =
      Math.min(window.innerWidth, window.innerHeight) * this.config.areaSize;
    const startX = centerX + (Math.random() - 0.5) * areaSize;
    const startY = centerY + (Math.random() - 0.5) * areaSize;

    // Random size (small, irregular)
    const baseSize =
      Math.random() *
        (this.config.particleSize.max - this.config.particleSize.min) +
      this.config.particleSize.min;
    const sizeVariation = 0.7 + Math.random() * 0.6; // 0.7-1.3 size variation

    // Random opacity and color
    const opacity =
      Math.random() * (this.config.maxOpacity * 0.8) +
      this.config.maxOpacity * 0.2; // 20%-80% of max opacity
    const hue = Math.random() * 30 + 10; // Orange/red hues: 10-40

    // Irregular shape (not perfect circle)
    const width = baseSize * sizeVariation;
    const height = baseSize * (2 - sizeVariation); // Inverse variation for height

    particle.style.cssText = `
      position: absolute;
      left: ${startX}px;
      top: ${startY}px;
      width: ${width}px;
      height: ${height}px;
      background: hsl(${hue}, 100%, 60%);
      border-radius: ${Math.random() * 50 + 30}% ${Math.random() * 50 + 30}% ${
      Math.random() * 50 + 30
    }% ${Math.random() * 50 + 30}%;
      opacity: ${opacity};
      box-shadow: 0 0 ${Math.max(width, height) * 1.5}px hsl(${hue}, 100%, 50%);
      transition: none;
    `;

    // Store particle data
    particle.data = {
      x: startX,
      y: startY,
      vx: (Math.random() - 0.5) * this.config.velocityMultiplier, // Random horizontal velocity
      vy: (Math.random() - 0.5) * this.config.velocityMultiplier, // Random vertical velocity
      life: 1.0,
      decay:
        Math.random() *
          (this.config.fadeSpeed.max - this.config.fadeSpeed.min) +
        this.config.fadeSpeed.min, // How fast it fades
      width: width,
      height: height,
    };

    this.container.appendChild(particle);
    this.particles.push(particle);
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      const data = particle.data;

      // Update position
      data.x += data.vx;
      data.y += data.vy;

      // Update life
      data.life -= data.decay;

      // Apply position and opacity
      particle.style.left = data.x + "px";
      particle.style.top = data.y + "px";
      particle.style.opacity = data.life * this.config.maxOpacity; // Apply max opacity from config

      // Remove dead particles or those that went off screen
      if (
        data.life <= 0 ||
        data.x < -20 ||
        data.x > window.innerWidth + 20 ||
        data.y < -20 ||
        data.y > window.innerHeight + 20
      ) {
        particle.remove();
        this.particles.splice(i, 1);
      }
    }
  }

  animate() {
    if (!this.isActive) return;

    // Create new particles occasionally
    if (Math.random() < this.config.spawnRate) {
      this.createParticle();
    }

    this.updateParticles();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (this.isActive) return;

    console.log("🔥 Starting cinder particles");
    this.isActive = true;
    this.animate();
  }

  stop() {
    if (!this.isActive) return;

    console.log("🔥 Stopping cinder particles");
    this.isActive = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Clear existing particles
    this.particles.forEach((particle) => particle.remove());
    this.particles = [];
  }

  // Method to be called when fire background starts
  onFireStart() {
    this.start();
  }

  // Method to be called when transitioning away from fire
  onFireEnd() {
    this.stop();
  }
}

// Export for use in other modules
window.CinderParticles = CinderParticles;

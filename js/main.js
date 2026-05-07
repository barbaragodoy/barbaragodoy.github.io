/**
 * Portfolio site initialization and interaction logic.
 */

/**
 * Default particles.js configuration.
 */
function getParticlesConfig() {
  return {
    particles: {
      number: { value: 60 },
      size: { value: 3 },
      color: { value: "#00eaff" },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#00eaff",
        opacity: 0.3,
      },
    },
  };
}

/**
 * Initialize particles background.
 * @param {string} elementId - The ID of the container element.
 * @param {object} [config] - Optional custom configuration.
 */
function initParticles(elementId, config) {
  if (typeof particlesJS === "undefined") {
    console.warn("particles.js library not loaded.");
    return false;
  }

  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with id "${elementId}" not found.`);
    return false;
  }

  const particlesConfig = config || getParticlesConfig();
  particlesJS(elementId, particlesConfig);
  return true;
}

/**
 * Smooth scroll to a section by its ID.
 * @param {string} sectionId - The ID of the target section (without #).
 */
function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) {
    console.warn(`Section "${sectionId}" not found.`);
    return false;
  }

  target.scrollIntoView({ behavior: "smooth" });
  return true;
}

/**
 * Set up smooth scrolling for all internal anchor links.
 */
function setupSmoothScrolling() {
  const links = document.querySelectorAll('nav a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      scrollToSection(targetId);
    });
  });
  return links.length;
}

/**
 * Get all project cards data from the DOM.
 * @returns {Array<{title: string, description: string}>}
 */
function getProjectCards() {
  const cards = document.querySelectorAll("#projects .card");
  return Array.from(cards).map((card) => {
    const h3 = card.querySelector("h3");
    const p = card.querySelector("p");
    return {
      title: h3 ? h3.textContent.trim() : "",
      description: p ? p.textContent.trim() : "",
    };
  });
}

/**
 * Get all technology items from the DOM.
 * @returns {string[]}
 */
function getTechnologies() {
  const techs = document.querySelectorAll("#tech .tech");
  return Array.from(techs).map((tech) => tech.textContent.trim());
}

/**
 * Get all navigation links.
 * @returns {Array<{text: string, href: string}>}
 */
function getNavLinks() {
  const links = document.querySelectorAll("nav a");
  return Array.from(links).map((link) => ({
    text: link.textContent.trim(),
    href: link.getAttribute("href"),
  }));
}

/**
 * Initialize the portfolio site.
 */
function initPortfolio() {
  initParticles("particles-js");
  setupSmoothScrolling();
}

// Auto-initialize when DOM is ready
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initPortfolio);
}

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getParticlesConfig,
    initParticles,
    scrollToSection,
    setupSmoothScrolling,
    getProjectCards,
    getTechnologies,
    getNavLinks,
    initPortfolio,
  };
}

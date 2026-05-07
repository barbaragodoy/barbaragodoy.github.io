/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");

const htmlPath = path.resolve(__dirname, "..", "index.html");
const htmlContent = fs.readFileSync(htmlPath, "utf-8");

const mainModule = require("../js/main");

function loadHTML() {
  document.documentElement.innerHTML = htmlContent;
  window.particlesJS = jest.fn();
}

beforeEach(() => {
  loadHTML();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("getParticlesConfig", () => {
  test("returns an object with particles configuration", () => {
    const config = mainModule.getParticlesConfig();
    expect(config).toBeDefined();
    expect(config.particles).toBeDefined();
  });

  test("particles config has correct number value", () => {
    const config = mainModule.getParticlesConfig();
    expect(config.particles.number.value).toBe(60);
  });

  test("particles config has correct color", () => {
    const config = mainModule.getParticlesConfig();
    expect(config.particles.color.value).toBe("#00eaff");
  });

  test("particles config has line_linked enabled", () => {
    const config = mainModule.getParticlesConfig();
    expect(config.particles.line_linked.enable).toBe(true);
    expect(config.particles.line_linked.distance).toBe(150);
    expect(config.particles.line_linked.color).toBe("#00eaff");
    expect(config.particles.line_linked.opacity).toBe(0.3);
  });

  test("particles config has correct size", () => {
    const config = mainModule.getParticlesConfig();
    expect(config.particles.size.value).toBe(3);
  });
});

describe("initParticles", () => {
  test("returns false when particlesJS is not available", () => {
    const original = window.particlesJS;
    delete window.particlesJS;

    const result = mainModule.initParticles("particles-js");
    expect(result).toBe(false);

    window.particlesJS = original;
  });

  test("returns false when element does not exist", () => {
    window.particlesJS = jest.fn();
    document.body.innerHTML = "<div></div>";
    const result = mainModule.initParticles("non-existent-element");
    expect(result).toBe(false);
  });

  test("calls particlesJS with correct arguments when element exists", () => {
    window.particlesJS = jest.fn();
    document.body.innerHTML = '<div id="test-particles"></div>';

    const result = mainModule.initParticles("test-particles");
    expect(result).toBe(true);
    expect(window.particlesJS).toHaveBeenCalledWith(
      "test-particles",
      mainModule.getParticlesConfig()
    );
  });

  test("accepts custom config", () => {
    window.particlesJS = jest.fn();
    document.body.innerHTML = '<div id="test-particles"></div>';

    const customConfig = { particles: { number: { value: 100 } } };
    mainModule.initParticles("test-particles", customConfig);
    expect(window.particlesJS).toHaveBeenCalledWith(
      "test-particles",
      customConfig
    );
  });
});

describe("scrollToSection", () => {
  test("returns false when section does not exist", () => {
    document.body.innerHTML = "<div></div>";
    const result = mainModule.scrollToSection("non-existent");
    expect(result).toBe(false);
  });

  test("returns true and calls scrollIntoView when section exists", () => {
    document.body.innerHTML = '<section id="test-section"></section>';
    const section = document.getElementById("test-section");
    section.scrollIntoView = jest.fn();

    const result = mainModule.scrollToSection("test-section");
    expect(result).toBe(true);
    expect(section.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
    });
  });
});

describe("setupSmoothScrolling", () => {
  test("attaches click event listeners to nav links", () => {
    document.body.innerHTML = `
      <nav>
        <a href="#about">Sobre</a>
        <a href="#projects">Projetos</a>
        <a href="#tech">Tecnologias</a>
      </nav>
      <section id="about"></section>
      <section id="projects"></section>
      <section id="tech"></section>
    `;

    const count = mainModule.setupSmoothScrolling();
    expect(count).toBe(3);
  });

  test("returns 0 when there are no nav links", () => {
    document.body.innerHTML = "<nav></nav>";
    const count = mainModule.setupSmoothScrolling();
    expect(count).toBe(0);
  });

  test("prevents default on click and scrolls to target", () => {
    document.body.innerHTML = `
      <nav>
        <a href="#about">Sobre</a>
      </nav>
      <section id="about"></section>
    `;

    const aboutSection = document.getElementById("about");
    aboutSection.scrollIntoView = jest.fn();

    mainModule.setupSmoothScrolling();

    const link = document.querySelector('nav a[href="#about"]');
    const clickEvent = new Event("click", {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(clickEvent, "preventDefault", {
      value: jest.fn(),
      writable: true,
    });

    link.dispatchEvent(clickEvent);

    expect(clickEvent.preventDefault).toHaveBeenCalled();
    expect(aboutSection.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
    });
  });
});

describe("getProjectCards", () => {
  test("extracts project card data from DOM", () => {
    document.body.innerHTML = `
      <section id="projects">
        <div class="card">
          <h3>Project A</h3>
          <p>Description A</p>
        </div>
        <div class="card">
          <h3>Project B</h3>
          <p>Description B</p>
        </div>
      </section>
    `;

    const cards = mainModule.getProjectCards();
    expect(cards).toHaveLength(2);
    expect(cards[0]).toEqual({
      title: "Project A",
      description: "Description A",
    });
    expect(cards[1]).toEqual({
      title: "Project B",
      description: "Description B",
    });
  });

  test("returns empty array when no projects section exists", () => {
    document.body.innerHTML = "<div></div>";
    const cards = mainModule.getProjectCards();
    expect(cards).toHaveLength(0);
  });

  test("handles cards without title or description gracefully", () => {
    document.body.innerHTML = `
      <section id="projects">
        <div class="card"></div>
      </section>
    `;

    const cards = mainModule.getProjectCards();
    expect(cards).toHaveLength(1);
    expect(cards[0]).toEqual({ title: "", description: "" });
  });
});

describe("getTechnologies", () => {
  test("extracts technology names from DOM", () => {
    document.body.innerHTML = `
      <section id="tech">
        <div class="tech">Python</div>
        <div class="tech">JavaScript</div>
        <div class="tech">Docker</div>
      </section>
    `;

    const techs = mainModule.getTechnologies();
    expect(techs).toHaveLength(3);
    expect(techs).toContain("Python");
    expect(techs).toContain("JavaScript");
    expect(techs).toContain("Docker");
  });

  test("returns empty array when no tech section exists", () => {
    document.body.innerHTML = "<div></div>";
    const techs = mainModule.getTechnologies();
    expect(techs).toHaveLength(0);
  });
});

describe("getNavLinks", () => {
  test("extracts navigation links from DOM", () => {
    document.body.innerHTML = `
      <nav>
        <a href="#about">Sobre</a>
        <a href="#projects">Projetos</a>
      </nav>
    `;

    const links = mainModule.getNavLinks();
    expect(links).toHaveLength(2);
    expect(links[0]).toEqual({ text: "Sobre", href: "#about" });
    expect(links[1]).toEqual({ text: "Projetos", href: "#projects" });
  });

  test("returns empty array when no nav links exist", () => {
    document.body.innerHTML = "<div></div>";
    const links = mainModule.getNavLinks();
    expect(links).toHaveLength(0);
  });
});

describe("HTML structure tests", () => {
  beforeEach(() => {
    loadHTML();
  });

  test("page has correct language attribute in source", () => {
    expect(htmlContent).toContain('lang="pt-br"');
  });

  test("page has meta description", () => {
    const metaDesc = document.querySelector('meta[name="description"]');
    expect(metaDesc).not.toBeNull();
    expect(metaDesc.getAttribute("content")).toContain("Bárbara Godoy");
  });

  test("page has correct title", () => {
    const titleEl = document.querySelector("title");
    expect(titleEl.textContent).toBe("Bárbara Godoy | AI Engineer");
  });

  test("page has viewport meta tag", () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport).not.toBeNull();
    expect(viewport.getAttribute("content")).toContain("width=device-width");
  });

  test("page has particles container", () => {
    const particles = document.getElementById("particles-js");
    expect(particles).not.toBeNull();
  });

  test("page has navigation with correct links", () => {
    const nav = document.querySelector("nav");
    expect(nav).not.toBeNull();

    const links = nav.querySelectorAll("a");
    expect(links.length).toBe(4);

    const hrefs = Array.from(links).map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("#about");
    expect(hrefs).toContain("#projects");
    expect(hrefs).toContain("#tech");
    expect(hrefs).toContain("#contact");
  });

  test("page has hero section with name and CTA button", () => {
    const hero = document.querySelector(".hero");
    expect(hero).not.toBeNull();

    const h1 = hero.querySelector("h1");
    expect(h1.textContent).toContain("Bárbara Godoy");

    const button = hero.querySelector("button");
    expect(button).not.toBeNull();
    expect(button.textContent.trim()).toBe("Ver Projetos");
  });

  test("page has all required sections", () => {
    const requiredSections = ["about", "projects", "tech", "contact"];
    requiredSections.forEach((id) => {
      const section = document.getElementById(id);
      expect(section).not.toBeNull();
    });
  });

  test("projects section has 6 project cards", () => {
    const projectCards = document.querySelectorAll("#projects .card");
    expect(projectCards.length).toBe(6);
  });

  test("tech section has 16 technology items", () => {
    const techItems = document.querySelectorAll("#tech .tech");
    expect(techItems.length).toBe(16);
  });

  test("page has footer with copyright info", () => {
    const footer = document.querySelector("footer");
    expect(footer).not.toBeNull();
    expect(footer.textContent).toContain("2026");
    expect(footer.textContent).toContain("Bárbara Godoy");
  });

  test("contact section has GitHub and LinkedIn links", () => {
    const contactLinks = document.querySelectorAll("#contact a");
    expect(contactLinks.length).toBeGreaterThanOrEqual(2);

    const hrefs = Array.from(contactLinks).map((a) => a.getAttribute("href"));
    expect(hrefs.some((h) => h.includes("github.com"))).toBe(true);
    expect(hrefs.some((h) => h.includes("linkedin.com"))).toBe(true);
  });

  test("external links have rel noopener noreferrer", () => {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach((link) => {
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    });
  });

  test("CSS file is linked", () => {
    const cssLink = document.querySelector(
      'link[rel="stylesheet"][href="css/styles.css"]'
    );
    expect(cssLink).not.toBeNull();
  });

  test("JS file is linked", () => {
    const jsScript = document.querySelector('script[src="js/main.js"]');
    expect(jsScript).not.toBeNull();
  });
});

describe("Project cards content", () => {
  beforeEach(() => {
    loadHTML();
  });

  const expectedProjects = [
    "Sappens AI",
    "EVA AI Assistant",
    "Cora AI Agent",
    "Luke AI Platform",
    "MCP AI Server",
    "Framework Dev AI",
  ];

  test.each(expectedProjects)(
    "project '%s' exists in the page",
    (projectName) => {
      const cards = document.querySelectorAll("#projects .card h3");
      const titles = Array.from(cards).map((h3) => h3.textContent.trim());
      expect(titles).toContain(projectName);
    }
  );

  test("each project card has a description", () => {
    const cards = document.querySelectorAll("#projects .card");
    cards.forEach((card) => {
      const description = card.querySelector("p");
      expect(description).not.toBeNull();
      expect(description.textContent.trim().length).toBeGreaterThan(10);
    });
  });
});

describe("Technology items content", () => {
  beforeEach(() => {
    loadHTML();
  });

  const expectedTechs = [
    "Python",
    "JavaScript",
    "Docker",
    "Google Cloud",
    "Machine Learning",
    "LLMs",
    "OpenAI",
    "Gemini AI",
  ];

  test.each(expectedTechs)("technology '%s' is listed", (techName) => {
    const techs = document.querySelectorAll("#tech .tech");
    const names = Array.from(techs).map((t) => t.textContent.trim());
    expect(names).toContain(techName);
  });
});

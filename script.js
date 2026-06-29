let imageDirectory = "img/";
let fallbackImage = `${imageDirectory}box.jpeg`;

const quotes = [
  { text: "If you get tired, learn to rest, not to quit.", author: "Banksy" },
  { text: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear" },
  { text: "The best investment is in the tools of one's own trade.", author: "Benjamin Franklin" },
  { text: "The place to find who you are is where you stand.", author: "George Mumford" },
  { text: "Meaning is about making a difference, not having an audience.", author: "Adam Grant" }
];

function changeImageDirectory(newDirectory) {
  const normalizedDirectory = newDirectory.endsWith("/") ? newDirectory : `${newDirectory}/`;
  imageDirectory = normalizedDirectory;
  fallbackImage = `${imageDirectory}box.jpeg`;

  document.querySelectorAll("img").forEach((image) => {
    const fileName = image.src.split("/").pop();
    image.src = `${normalizedDirectory}${fileName}`;
    if (image.dataset.fallback) {
      image.dataset.fallback = fallbackImage;
    }
  });
}

function displayRandomQuote() {
  const quoteTarget = document.querySelector("#quoteText");

  if (!quoteTarget) {
    return;
  }

  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteTarget.innerHTML = `&ldquo;${quote.text}&rdquo; &mdash; <span>${quote.author}</span>`;
}

function scrollToTarget(targetId) {
  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  const headerOffset = document.querySelector(".site-header").offsetHeight;
  const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset + 2;

  window.scrollTo({
    top: targetPosition,
    behavior: "smooth"
  });
}

function setupNavigation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const clickableItems = document.querySelectorAll("[data-target]");

  if (!menuToggle || !navLinks) {
    return;
  }

  clickableItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToTarget(item.dataset.target);
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function setupFadeAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16
    }
  );

  document.querySelectorAll(".section-fade").forEach((section) => observer.observe(section));
}

function setupImageFallbacks() {
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      if (image.src.includes("box.jpeg")) {
        return;
      }

      image.src = image.dataset.fallback || fallbackImage;
    });
  });
}

function setupSlideshows() {
  document.querySelectorAll(".slideshow").forEach((slideshow) => {
    const image = slideshow.querySelector("img");
    // Each slideshow owns its paths and timer, so project cards animate independently.
    const slides = (slideshow.dataset.slides || "")
      .split(",")
      .map((slide) => slide.trim())
      .filter(Boolean);
    let activeIndex = 0;

    if (!image || slides.length < 2) {
      return;
    }

    setInterval(() => {
      slideshow.classList.add("is-fading");

      setTimeout(() => {
        activeIndex = (activeIndex + 1) % slides.length;
        image.src = slides[activeIndex];
        slideshow.classList.remove("is-fading");
      }, 450);
    }, 3000);
  });
}

setupImageFallbacks();

document.addEventListener("DOMContentLoaded", () => {
  displayRandomQuote();
  setupNavigation();
  setupFadeAnimations();
  setupSlideshows();
});

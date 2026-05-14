const menuBtn = document.querySelector(".menu-btn");
const links = document.querySelector(".links");

if (menuBtn && links) {
  menuBtn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
}

/*
  Resume banner
  This automatically adds a visible resume link near the top of every page.
  Your PDF is already in the repository root as: My_resume.pdf
*/
function initResumeBanner() {
  const main = document.querySelector("main");
  if (!main) return;

  const banner = document.createElement("section");
  banner.className = "resume-banner";
  banner.setAttribute("aria-label", "Portfolio attachment");

  banner.innerHTML = `
    <div>
      <strong>Portfolio attachment</strong>
      <span>Resume PDF available for review.</span>
    </div>
    <a class="resume-button" href="My_resume.pdf" target="_blank" rel="noopener">
      Open resume PDF
    </a>
  `;

  main.insertBefore(banner, main.firstChild);
}

initResumeBanner();

const milestones = [
  {
    date: "2026-05-10",
    label: "Call advertised"
  },
  {
    date: "2026-06-10",
    label: "Submission deadline"
  },
  {
    date: "2026-06-20",
    label: "Document check notice"
  },
  {
    date: "2026-06-28",
    label: "Correction window closes"
  },
  {
    date: "2026-07-12",
    label: "Pre-review merit list"
  },
  {
    date: "2026-07-24",
    label: "External review outcome"
  },
  {
    date: "2026-08-05",
    label: "Final selection list"
  }
];

/*
  Demo date for the prototype.
  This forces the marker to appear clearly after 10 May.

  Change this later if you want:
  const todayOverride = "2026-06-15";

  Or use the real visitor date:
  const todayOverride = null;
*/
const todayOverride = "2026-05-24";

function makeDate(value) {
  const parts = value.split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function fmt(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function daysBetween(a, b) {
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.round((b - a) / oneDay);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function initTimeline() {
  const timelineBlocks = document.querySelectorAll("[data-timeline]");
  if (!timelineBlocks.length) return;

  const start = makeDate(milestones[0].date);
  const end = makeDate(milestones[milestones.length - 1].date);

  const today = todayOverride ? makeDate(todayOverride) : new Date();
  today.setHours(0, 0, 0, 0);

  const totalDays = Math.max(1, daysBetween(start, end));
  const currentDays = daysBetween(start, today);
  const percentage = clamp((currentDays / totalDays) * 100, 0, 100);

  timelineBlocks.forEach((rail) => {
    const fill = rail.querySelector(".rail-fill");
    const marker = rail.querySelector(".today-marker");
    const status = rail.querySelector("[data-status-summary]") || document.querySelector("[data-status-summary]");

    if (fill) {
      fill.style.width = percentage + "%";
    }

    if (marker) {
      marker.style.left = percentage + "%";

      const label = marker.querySelector("span");
      if (label) {
        label.textContent = "Today: " + fmt(today);
      }
    }

    const next = milestones.find((milestone) => makeDate(milestone.date) > today);

    if (status) {
      if (today < start) {
        status.textContent = "The call has not opened yet.";
      } else if (today > end) {
        status.textContent = "The published call window has completed.";
      } else if (next) {
        status.textContent = `Next step: ${next.label} on ${fmt(makeDate(next.date))}.`;
      } else {
        status.textContent = "Final stage reached.";
      }
    }

    rail.querySelectorAll("[data-ms-date]").forEach((element) => {
      const date = makeDate(element.dataset.msDate);
      const item = element.closest(".milestone");
      if (!item) return;

      const pill = item.querySelector(".status-pill");
      if (!pill) return;

      item.classList.remove("done", "current");
      pill.classList.remove("done", "current");

      if (today >= date) {
        item.classList.add("done");
        pill.classList.add("done");
        pill.textContent = "Done";
      } else if (next && element.dataset.msDate === next.date) {
        item.classList.add("current");
        pill.classList.add("current");
        pill.textContent = "Next";
      } else {
        pill.textContent = "Pending";
      }
    });
  });
}

initTimeline();

const tabs = document.querySelectorAll(".tab[data-filter]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((button) => button.classList.remove("active"));
    tab.classList.add("active");

    const filter = tab.dataset.filter;

    document.querySelectorAll(".resource-card").forEach((card) => {
      card.style.display = filter === "all" || card.dataset.type === filter ? "block" : "none";
    });
  });
});

const search = document.querySelector("[data-search]");

if (search) {
  search.addEventListener("input", () => {
    const query = search.value.toLowerCase();

    document.querySelectorAll("[data-search-item]").forEach((element) => {
      element.style.display = element.textContent.toLowerCase().includes(query) ? "block" : "none";
    });
  });
}

const appForm = document.querySelector("#application-form");

if (appForm) {
  appForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = document.querySelector("#form-message");

    if (message) {
      message.textContent =
        "Draft saved locally. In production this action would submit through the HEC research portal workflow.";
      message.hidden = false;
    }

    appForm.reset();
  });
}

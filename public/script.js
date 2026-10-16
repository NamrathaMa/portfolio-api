"use strict";

const mainDocument = document.documentElement;
const projectsGrid = document.getElementById("projects-grid");
const buttonList = document.getElementById("button-list");
const experienceGrid = document.getElementById("experience-grid");
const emailID = document.getElementById("email");
const copyBtn = document.getElementById("copy-btn");
const copyLabel = document.getElementById("copy-label");
const nightBtn = document.getElementById("theme-toggle");

const darkModeQuery = window.matchMedia("(prefers-color-scheme:dark)");
const gitHubIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                        </svg>`;
const statusCodes = {
  done: "built & tested",
  live: "live",
  wip: "in progress",
};

darkModeQuery.addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) {
    mainDocument.dataset.theme = e.matches ? "dark" : "light";
  }
});

nightBtn.addEventListener("click", () => {
  mainDocument.dataset.theme =
    mainDocument.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", mainDocument.dataset.theme);
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(emailID.textContent).then(() => {
    copyBtn.classList.add("copied");
    copyLabel.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.classList.remove("copied");
      copyLabel.textContent = "Copy Email";
    }, 3000);
  });
});

function setUpTabBtns() {
  const panels = document.querySelectorAll(".panel");
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((tab1) => tab1.classList.remove("active"));
      panels.forEach((panel) => panel.classList.add("hidden"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.remove("hidden");
    });
  });
}

//API calls for Experience and Projects

async function loadExperiences() {
  //1. Loading the experiences and buttons
  experienceGrid.innerHTML = `<div><p>Loading experiences...</p></div>`;

  //2. Fetching data from the database through UI
  try {
    const response = await fetch("/api/experiences");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const experiences = await response.json();

    //3.Creating the buttons for the grid
    experienceGrid.innerHTML = `<div class="tabs">${experiences
      .map(
        (exp) =>
          `<button class="tab ${exp.order === 1 ? "active" : ""}" data-tab=${exp.company}>${exp.company}</button>`,
      )
      .join("")}</div>`;
    //4.Creating the content for the companies
    experienceGrid.insertAdjacentHTML(
      "beforeend",
      `<div>${experiences
        .map((exp) => {
          return `<div class="panel ${exp.order === 1 ? "" : "hidden"}" id=${exp.company}>
        <h3>${exp.role} @<a href=${exp.url} target="_blank" rel="noopener noreferrer">${exp.company}</a></h3>
        <p class="date-location">${exp.date} · ${exp.location}</p>
        <ul>
        ${exp.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
        </ul>
    </div>`;
        })
        .join("")}</div>`,
    );
    setUpTabBtns();
  } catch (err) {
    console.error(err);
  }
}

async function loadProjects() {
  //1. Loading the project cards
  projectsGrid.innerHTML = `<p>Loading Projects....</p>`;

  //2.  Fetching data from the database through UI
  try {
    const response = await fetch("/api/projects");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const projects = await response.json();

    //3. 4.Creating the project cards
    projectsGrid.innerHTML = projects
      .map(
        (project) =>
          `<article class="card">
                    <div class="card-top">
                      <span class="pill ${project.status}">${statusCodes[project.status]}</span>
                     ${project.repo ? `<a class="icon-btn" href="${project.repo}" target="_blank" rel="noopener noreferrer" aria-label="View Code">${gitHubIcon}</a>` : ""}
                    </div>
                    <h3>${project.title}</h3>
                      <p>${project.description}</p>
                      <p class="tech">${project.tech.join(" · ")}</p>
                </article>`,
      )
      .join("");
  } catch (err) {
    console.error(err);
    projectsGrid.innerHTML = `<p>Couldn't load the projects... :(</p>`;
  }
}

//API call functions executed

loadExperiences();
loadProjects();

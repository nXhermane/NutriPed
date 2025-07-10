import dashboardState from "./state.js";

document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", () => {
    dashboardState.toggleTheme();
  });

  // Initialize theme
  document.documentElement.setAttribute("data-theme", dashboardState.theme);

  // Loading states
  function showLoading(element) {
    element.classList.add("loading");
  }

  function hideLoading(element) {
    element.classList.remove("loading");
  }

  // Section navigation with loading states
  function showSection(sectionId) {
    const sections = document.querySelectorAll(".content-area > section");
    sections.forEach(section => {
      section.classList.remove("active");
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      showLoading(targetSection);
      setTimeout(() => {
        targetSection.classList.add("active");
        hideLoading(targetSection);
        initializeSectionData(sectionId);
      }, 300);
    }
  }

  // Initialize section specific data
  async function initializeSectionData(sectionId) {
    const section = document.getElementById(sectionId);

    switch (sectionId) {
      case "medical":
        await loadMedicalData(section);
        break;
      case "nutrition":
        await loadNutritionalData(section);
        break;
      // ... autres cas
    }
  }

  // Navigation handling
  const navItems = document.querySelectorAll(".main-nav li");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      // Remove active class from all nav items
      navItems.forEach(nav => nav.classList.remove("active"));
      // Add active class to clicked nav item
      item.classList.add("active");

      // Show corresponding section
      const sectionId = item.dataset.section;
      showSection(sectionId);

      // Initialize charts based on section
      switch (sectionId) {
        case "medical":
          if (document.getElementById("anthropometricsChart")) {
            initAnthropometricsChart();
          }
          break;
        case "nutrition":
          if (document.getElementById("appetiteChart")) {
            initAppetiteChart();
          }
          break;
        case "diagnostic":
          if (document.getElementById("progressChart")) {
            initProgressChart();
          }
          break;
        case "overview":
          if (document.getElementById("evolutionChart")) {
            initEvolutionChart();
          }
          break;
      }
    });
  });

  // Initialize default section
  showSection("overview");

  // Evolution Chart
  const ctx = document.getElementById("evolutionChart").getContext("2d");
  const evolutionChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Poids (kg)",
          data: [14.2, 14.5, 14.8, 15.0, 15.2, 15.2],
          borderColor: "#4CAF50",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Évolution du poids",
        },
      },
    },
  });

  // Mock data for appointments
  const appointments = [
    {
      date: "2025-06-15",
      type: "Consultation nutritionnelle",
      with: "Dr. Smith",
    },
    {
      date: "2025-06-20",
      type: "Suivi mensuel",
      with: "Dr. Johnson",
    },
  ];

  // Render appointments
  const appointmentList = document.querySelector(".appointment-list");
  appointments.forEach(apt => {
    const li = document.createElement("li");
    li.innerHTML = `
            <div class="appointment">
                <strong>${new Date(apt.date).toLocaleDateString()}</strong>
                <p>${apt.type} avec ${apt.with}</p>
            </div>
        `;
    appointmentList.appendChild(li);
  });

  // Mock data for alerts
  const alerts = [
    {
      severity: "high",
      message: "Perte de poids significative",
      date: "2025-06-08",
    },
    {
      severity: "medium",
      message: "Rendez-vous de suivi à programmer",
      date: "2025-06-10",
    },
  ];

  // Render alerts
  const alertList = document.querySelector(".alert-list");
  alerts.forEach(alert => {
    const li = document.createElement("li");
    li.innerHTML = `
            <div class="alert ${alert.severity}">
                <strong>${alert.message}</strong>
                <p>Date: ${new Date(alert.date).toLocaleDateString()}</p>
            </div>
        `;
    alertList.appendChild(li);
  });

  // Anthropometrics Chart
  function initAnthropometricsChart() {
    const ctx = document
      .getElementById("anthropometricsChart")
      .getContext("2d");
    const anthropometricsChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Poids (kg)",
            data: [14.2, 14.5, 14.8, 15.0, 15.2, 15.2],
            borderColor: "#4CAF50",
            tension: 0.4,
          },
          {
            label: "Taille (cm)",
            data: [98, 99, 100, 101, 102, 102],
            borderColor: "#2196F3",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          intersect: false,
          mode: "index",
        },
      },
    });
  }

  // Appetite Test Chart
  function initAppetiteChart() {
    const ctx = document.getElementById("appetiteChart").getContext("2d");
    const appetiteChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
        datasets: [
          {
            label: "Score d'appétit",
            data: [8, 6, 7, 8, 7, 8, 9],
            backgroundColor: "#4CAF50",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
          },
        },
      },
    });
  }

  // Progress Chart
  function initProgressChart() {
    const ctx = document.getElementById("progressChart").getContext("2d");
    const progressChart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["Nutrition", "Hydratation", "Activité", "Sommeil", "Appétit"],
        datasets: [
          {
            label: "Cette semaine",
            data: [8, 7, 6, 8, 7],
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 10,
          },
        },
      },
    });
  }

  // Populate Biological Data
  function populateBiologicalData() {
    const biologicalGrid = document.querySelector(".biological-grid");
    const biologicalData = [
      { name: "Hémoglobine", value: "12.5", unit: "g/dL" },
      { name: "Glycémie", value: "95", unit: "mg/dL" },
      { name: "Créatinine", value: "0.7", unit: "mg/dL" },
    ];

    biologicalGrid.innerHTML = biologicalData
      .map(
        item => `
            <div class="bio-item">
                <span class="bio-name">${item.name}</span>
                <span class="bio-value">${item.value} ${item.unit}</span>
            </div>
        `
      )
      .join("");
  }

  // Populate Care Objectives
  function populateCareObjectives() {
    const objectivesList = document.querySelector(".objectives-list");
    const objectives = [
      "Maintenir un poids stable",
      "Améliorer l'appétit",
      "Augmenter l'activité physique",
    ];

    objectivesList.innerHTML = objectives
      .map(
        objective => `
            <li>${objective}</li>
        `
      )
      .join("");
  }

  // Initial data population
  populateBiologicalData();
  populateCareObjectives();

  // Initialize evolution chart on page load
  initEvolutionChart();

  // Ajouter les gestionnaires d'événements pour les interactions
  function addInteractions() {
    // Zoom sur les graphiques
    document.querySelectorAll("canvas").forEach(canvas => {
      canvas.addEventListener("click", () => {
        canvas.classList.toggle("enlarged");
      });
    });

    // Filtres pour la timeline
    const timelineFilters = document.createElement("div");
    timelineFilters.className = "timeline-filters";
    timelineFilters.innerHTML = `
            <button class="filter-btn active" data-filter="all">Tout</button>
            <button class="filter-btn" data-filter="measurements">Mesures</button>
            <button class="filter-btn" data-filter="consultations">Consultations</button>
        `;
    document.querySelector(".timeline").prepend(timelineFilters);
  }

  // Initialize tooltips
  function initializeTooltips() {
    const tooltips = document.querySelectorAll("[data-tooltip]");
    tooltips.forEach(element => {
      tippy(element, {
        content: element.getAttribute("data-tooltip"),
        placement: "top",
      });
    });
  }

  addInteractions();
  initializeTooltips();
});

// Separate evolution chart initialization
function initEvolutionChart() {
  const ctx = document.getElementById("evolutionChart");
  if (!ctx) return;

  const evolutionChart = new Chart(ctx.getContext("2d"), {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Poids (kg)",
          data: [14.2, 14.5, 14.8, 15.0, 15.2, 15.2],
          borderColor: "#4CAF50",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Évolution du poids",
        },
      },
    },
  });
}

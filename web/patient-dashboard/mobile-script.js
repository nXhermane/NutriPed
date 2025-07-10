document.addEventListener("DOMContentLoaded", () => {
  // Navigation
  const navButtons = document.querySelectorAll(".nav-item");
  const pages = document.querySelectorAll(".page");

  navButtons.forEach(button => {
    button.addEventListener("click", () => {
      const targetPage = button.dataset.page;

      // Update navigation
      navButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      // Update pages
      pages.forEach(page => {
        page.classList.remove("active");
        if (page.id === targetPage) {
          page.classList.add("active");
        }
      });
    });
  });

  // Initialize Charts
  const evolutionChart = new Chart(
    document.getElementById("mobileEvolutionChart"),
    {
      type: "line",
      data: {
        labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
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
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    }
  );

  // Sample Appointments Data
  const appointments = [
    {
      date: "15 Juin 2025",
      type: "Consultation nutritionnelle",
      doctor: "Dr. Smith",
    },
    {
      date: "20 Juin 2025",
      type: "Suivi mensuel",
      doctor: "Dr. Johnson",
    },
  ];

  // Render Appointments
  const appointmentContainer = document.querySelector(".appointment-cards");
  appointments.forEach(apt => {
    const card = document.createElement("div");
    card.className = "appointment-card";
    card.innerHTML = `
            <strong>${apt.date}</strong>
            <p>${apt.type}</p>
            <small>${apt.doctor}</small>
        `;
    appointmentContainer.appendChild(card);
  });
});

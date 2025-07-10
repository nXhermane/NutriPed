class DashboardState {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light";
    this.currentSection = "overview";
    this.patientData = null;
    this.observers = [];
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    this.notifyObservers();
  }

  toggleTheme() {
    const newTheme = this.theme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  }

  setCurrentSection(section) {
    this.currentSection = section;
    this.notifyObservers();
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notifyObservers() {
    this.observers.forEach(observer => observer(this));
  }

  async fetchPatientData() {
    // Simulation d'un appel API
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: "12345",
          name: "John Doe",
          age: 4,
          nutritionalScore: 85,
          alerts: 2,
          // ... autres données
        });
      }, 1000);
    });
  }
}

const dashboardState = new DashboardState();
export default dashboardState;

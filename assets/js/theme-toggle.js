// theme-toggle.js
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");

  // Retrieve stored theme or fall back to dark
  const storedTheme = localStorage.getItem("theme");
  const currentTheme = storedTheme || "dark";

  // Apply theme
  document.documentElement.setAttribute("data-theme", currentTheme);

  // Set toggle label accordingly
  if (toggle) {
    toggle.innerText = currentTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";

    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const newTheme = current === "dark" ? "light" : "dark";

      // Apply and store new theme
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      toggle.innerText = newTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    });
  }
});

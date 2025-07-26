// theme-toggle.js
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem("theme");
  const currentTheme = storedTheme || (prefersDark ? "dark" : "light");

  // Apply theme to body and html on load
  document.body.classList.add(currentTheme);
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (toggle) {
    toggle.innerText = currentTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";

    toggle.addEventListener("click", () => {
      // Toggle theme class on body
      document.body.classList.toggle("dark");

      // Determine new theme based on presence of 'dark' class
      const newTheme = document.body.classList.contains("dark") ? "dark" : "light";

      // Save and apply new theme
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      toggle.innerText = newTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    });
  }
});

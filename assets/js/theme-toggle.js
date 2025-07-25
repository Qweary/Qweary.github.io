// theme-toggle.js
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem("theme");
  const currentTheme = storedTheme || (prefersDark ? "dark" : "light");

  document.body.classList.add(currentTheme);

  if (toggle) {
    toggle.innerText = currentTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";

    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const newTheme = document.body.classList.contains("dark") ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      toggle.innerText = newTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    });
  }
});

// splash.js
document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash-screen");
  const messages = [
    "authenticating...",
    "verifying token...",
    "bypassing splashguard...",
    "accessing archives...",
    "establishing secure session...",
    "decrypting header...",
    "parsing manifest...",
    "resolving blog nodes...",
    "initializing interface...",
    "reading entrypoint..."
  ];

  const messageBox = document.getElementById("splash-message");
  const skipButton = document.getElementById("skip-btn");
  const cursor = document.getElementById("cursor");

  // Set a random message
  const msg = messages[Math.floor(Math.random() * messages.length)];
  messageBox.innerText = msg;

  // Flickering cursor
  setInterval(() => {
    cursor.style.visibility = (cursor.style.visibility === 'visible') ? 'hidden' : 'visible';
  }, 500);

  // Fade out after 4 seconds or on skip
  const dismissSplash = () => {
    splash.classList.add("hide");
    setTimeout(() => splash.remove(), 1000);
  };

  setTimeout(dismissSplash, 4000);
  skipButton.addEventListener("click", dismissSplash);
});

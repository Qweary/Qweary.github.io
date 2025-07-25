document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash-screen");
  const skipBtn = document.getElementById("skip-button");
  const cursor = document.querySelector(".cursor");

  const messages = [
    "[OK] Bypassing biometric lock...",
    "[OK] Initializing secure comms...",
    "[OK] Loading encrypted modules...",
    "[OK] Running splash sequence...",
    "[OK] Welcome to Qweary."
  ];

  const typeLine = (msg, container) => {
    const line = document.createElement("div");
    line.classList.add("splash-line");
    container.appendChild(line);

    let i = 0;
    const interval = setInterval(() => {
      line.textContent = msg.slice(0, ++i);
      if (i === msg.length) clearInterval(interval);
    }, 40);
  };

  const showMessages = () => {
    const container = document.getElementById("splash-lines");
    let index = 0;

    const nextMessage = () => {
      if (index < messages.length) {
        typeLine(messages[index++], container);
        setTimeout(nextMessage, 900);
      } else {
        setTimeout(hideSplash, 1000);
      }
    };

    nextMessage();
  };

  const hideSplash = () => {
    splash.classList.add("hidden");
    splash.style.display = "none";
  };

  // Skip handlers
  skipBtn.addEventListener("click", hideSplash);
  document.addEventListener("keydown", hideSplash);

  // Auto fallback
  setTimeout(hideSplash, 9000);

  showMessages();
});

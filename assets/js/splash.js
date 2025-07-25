document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash");
  if (!splash) {
    // No splash present — just show main content
    const siteContent = document.getElementById("site-content");
    if (siteContent) siteContent.style.display = "block";
    document.body.classList.remove('no-scroll');
    return;
  }

  const skipBtn = document.getElementById("skip-button");
  const cursor = document.querySelector(".cursor");

  const messages = [
    "[OK] Bypassing biometric lock...",
    "[OK] Initializing secure comms...",
    "[OK] Loading encrypted modules...",
    "[OK] Running splash sequence...",
    "[OK] Welcome to Qweary."
  ];

  const typeLine = (msg, container, callback) => {
    const line = document.createElement("div");
    line.classList.add("splash-line");
    container.appendChild(line);

    let i = 0;
    const interval = setInterval(() => {
      line.textContent = msg.slice(0, ++i);
      if (i === msg.length) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 40);
  };

  const showMessages = () => {
    const container = document.getElementById("splash-lines");
    let index = 0;

    const nextMessage = () => {
      if (index < messages.length) {
        typeLine(messages[index++], container, () => {
          setTimeout(nextMessage, 500);
        });
      } else {
        setTimeout(endSplash, 3000);
      }
    };

    nextMessage();
  };

  function endSplash() {
    splash.classList.add('hidden');
    splash.style.display = 'none';
    document.body.classList.remove('no-scroll');
    document.body.classList.add("splash-done");

    const siteContent = document.getElementById("site-content");
    if (siteContent) {
      siteContent.style.display = "block";
    }
  }

  // Allow skipping
  skipBtn?.addEventListener("click", endSplash);
  document.addEventListener("keydown", endSplash);

  // Fallback auto-end
  setTimeout(endSplash, 12000);

  // Start splash sequence
  showMessages();
});

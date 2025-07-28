document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash");
  if (!splash) {
    const siteContent = document.getElementById("site-content");
    if (siteContent) siteContent.style.display = "block";
    document.body.classList.remove('no-scroll');
    return;
  }

  const skipBtn = document.getElementById("skip-button");
  const cursor = document.querySelector(".cursor");

  // Pool of randomizable messages
  const randomMessages = [
    "[OK] Bypassing biometric lock...",
    "[OK] Initializing secure comms...",
    "[OK] Loading encrypted modules...",
    "[OK] Running splash sequence...",
    "[OK] Scrambling return addresses...",
    "[OK] Spoofing MAC address...",
    "[OK] Disabling watchdog timers...",
    "[OK] Tunneling through DNS..."
  ];

  const finalMessage = ". . . Welcome to Qweary's Blog.";

  // Shuffle using Fisher-Yates
  for (let i = randomMessages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomMessages[i], randomMessages[j]] = [randomMessages[j], randomMessages[i]];
  }

  const selectedMessages = randomMessages.slice(0, 3); // 3 randomized
  const allMessages = [...selectedMessages, finalMessage]; // Add final message last

  const typeLine = (msg, container, isFinal, callback) => {
    const line = document.createElement("div");
    line.classList.add("splash-line");
    if (isFinal) line.classList.add("final-line");
    container.appendChild(line);

    let i = 0;

    const startTyping = () => {
      const interval = setInterval(() => {
        line.textContent = msg.slice(0, ++i);
        if (i === msg.length) {
          clearInterval(interval);
          if (callback) callback();
        }
      }, 40);
    };

    if (isFinal) {
      // Slight extra pause before final message
      setTimeout(startTyping, 800);
    } else {
      startTyping();
    }
  };

  const showMessages = () => {
    const container = document.getElementById("splash-lines");
    let index = 0;

    const nextMessage = () => {
      if (index < allMessages.length) {
        const isFinal = (index === allMessages.length - 1);
        typeLine(allMessages[index++], container, isFinal, () => {
          setTimeout(nextMessage, isFinal ? 1000 : 500);
        });
      } else {
        setTimeout(endSplash, 3000);
      }
    };

    nextMessage();
  };

  function endSplash() {
    splash.classList.add('fade-out');
    document.body.classList.remove('no-scroll');
    document.body.classList.add("splash-done");

    setTimeout(() => {
      splash.style.display = 'none';
      const siteContent = document.getElementById("site-content");
      if (siteContent) {
        siteContent.style.display = "block";
      }
    }, 1000); // Match fade-out
  }

  skipBtn?.addEventListener("click", endSplash);
  document.addEventListener("keydown", endSplash);
  setTimeout(endSplash, 12000);

  showMessages();

  const asciiWrapper = document.querySelector(".ascii-wrapper");
  if (asciiWrapper) {
    asciiWrapper.scrollLeft = asciiWrapper.scrollWidth;
  }
});

// Only run splash screen logic on the homepage
if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {

  document.addEventListener("DOMContentLoaded", () => {
    const splash = document.getElementById("splash");
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

    // ✅ Proper splash removal and content reveal
    function endSplash() {
      splash.classList.add('hidden');
      splash.style.display = 'none';
      document.body.classList.remove('no-scroll');
      document.body.classList.add("splash-done");

      // Show main site content
      const siteContent = document.getElementById("site-content");
      if (siteContent) {
        siteContent.style.display = "block";
      }
    }

    // ✅ Allow skipping
    skipBtn.addEventListener("click", endSplash);
    document.addEventListener("keydown", endSplash);

    // ✅ Auto fallback if stuck
    setTimeout(endSplash, 13000);

    // Begin splash typing
    showMessages();
  });
}

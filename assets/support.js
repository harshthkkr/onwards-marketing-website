// Copy-to-clipboard for the support email.
(() => {
  const status = document.querySelector(".copy-status");
  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;
    let timer;
    button.addEventListener("click", async () => {
      const text = target.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Older browsers: select the text so it can be copied by hand.
        const range = document.createRange();
        range.selectNodeContents(target);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        if (!document.execCommand("copy")) return;
      }
      button.textContent = "Copied ✓";
      button.classList.add("is-copied");
      if (status) status.textContent = "Email address copied.";
      clearTimeout(timer);
      timer = setTimeout(() => {
        button.textContent = "Copy";
        button.classList.remove("is-copied");
        if (status) status.textContent = "";
      }, 2000);
    });
  });
})();

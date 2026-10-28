(() => {
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  // Copy button for the support email.
  const status = document.querySelector(".copy-status");
  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;
    let timer;
    button.addEventListener("click", async () => {
      if (!(await copyText(target.textContent.trim()))) {
        // Clipboard blocked: select the text so it can be copied by hand.
        const range = document.createRange();
        range.selectNodeContents(target);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        return;
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

  // Email links: many browsers have no mail app set up, so a mailto click
  // can silently do nothing. Let it try, then offer webmail and copy the address.
  const toast = document.createElement("div");
  toast.className = "mail-toast";
  toast.setAttribute("role", "status");
  toast.hidden = true;
  toast.innerHTML = `
    <p class="mail-toast-title"></p>
    <p class="mail-toast-text">If your email app didn’t open, use one of these:</p>
    <div class="mail-toast-actions">
      <a class="mail-toast-btn" data-webmail="gmail" target="_blank" rel="noopener">Open in Gmail</a>
      <a class="mail-toast-btn" data-webmail="outlook" target="_blank" rel="noopener">Open in Outlook</a>
    </div>
    <button class="mail-toast-close" type="button" aria-label="Close">×</button>`;
  document.body.append(toast);
  const title = toast.querySelector(".mail-toast-title");
  const gmail = toast.querySelector('[data-webmail="gmail"]');
  const outlook = toast.querySelector('[data-webmail="outlook"]');
  let hideTimer;
  const hide = () => { toast.hidden = true; };
  toast.querySelector(".mail-toast-close").addEventListener("click", hide);
  toast.querySelectorAll(".mail-toast-btn").forEach((a) => a.addEventListener("click", hide));

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener("click", async () => {
      const url = new URL(link.href);
      const to = decodeURIComponent(url.pathname);
      const subject = url.searchParams.get("subject") || "";
      const body = url.searchParams.get("body") || "";
      const q = (params) => Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
      gmail.href = `https://mail.google.com/mail/?${q({ view: "cm", fs: "1", to, su: subject, body })}`;
      outlook.href = `https://outlook.live.com/mail/0/deeplink/compose?${q({ to, subject, body })}`;
      title.textContent = (await copyText(to)) ? `Email address copied: ${to}` : `Our email: ${to}`;
      toast.hidden = false;
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hide, 12000);
    });
  });
})();

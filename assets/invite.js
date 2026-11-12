(() => {
  // The invitation travels after the "#", which browsers never send to a
  // server. Keep it that way: do not store, log, or transmit it.
  const TOKEN_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[A-Za-z0-9_-]{43}$/i;

  const open = document.getElementById("invite-open");
  const link = document.getElementById("invite-open-link");
  const missing = document.getElementById("invite-missing");
  if (!open || !link || !missing) return;

  const render = () => {
    const token = (new URLSearchParams(window.location.hash.slice(1)).get("token") || "").trim();
    const valid = TOKEN_PATTERN.test(token);
    if (valid) link.href = `onwards://invite/${encodeURIComponent(token)}`;
    open.hidden = !valid;
    missing.hidden = valid;
  };

  render();
  window.addEventListener("hashchange", render);
})();

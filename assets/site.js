(() => {
  document.querySelectorAll("[data-story-flow]").forEach((flow) => {
    const triggers = [...flow.querySelectorAll("[data-story-trigger]")];
    const screens = [...flow.querySelectorAll("[data-story-screen]")];
    const panels = [...flow.querySelectorAll("[data-story-panel]")];
    const floats = [...flow.querySelectorAll("[data-story-float]")];
    const next = flow.querySelector("[data-story-next]");
    const topKicker = flow.querySelector("[data-story-kicker-top]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer;
    let variantTimer;
    let current = 0;
    let variant = 0;

    const variantsFor = (chapter) => screens.filter((screen) => Number(screen.dataset.storyChapter) === chapter).length;
    const durationFor = (chapter) => Math.max(6000, variantsFor(chapter) * 2600);

    const renderScreens = () => {
      screens.forEach((screen) => {
        const active = Number(screen.dataset.storyChapter) === current && Number(screen.dataset.storyVariant) === variant;
        screen.classList.toggle("is-active", active);
        screen.setAttribute("aria-hidden", String(!active));
      });
      floats.forEach((item) => {
        const active = Number(item.dataset.storyChapter) === current && Number(item.dataset.storyVariant) === variant;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-hidden", String(!active));
      });
    };

    const activate = (index) => {
      current = Number(index);
      variant = 0;
      triggers.forEach((trigger, itemIndex) => {
        const active = itemIndex === current;
        trigger.classList.toggle("is-active", active);
        trigger.setAttribute("aria-selected", String(active));
        trigger.setAttribute("tabindex", active ? "0" : "-1");
      });
      renderScreens();
      panels.forEach((panel, itemIndex) => {
        const active = itemIndex === current;
        panel.classList.toggle("is-active", active);
        panel.setAttribute("aria-hidden", String(!active));
      });

      if (topKicker) {
        const activeKicker = panels[current]?.querySelector(".story-kicker");
        if (activeKicker) topKicker.textContent = activeKicker.textContent;
      }

      const progress = flow.querySelector(".story-progress i");
      if (progress) {
        progress.style.animationDuration = `${durationFor(current)}ms`;
        progress.style.animation = "none";
        void progress.offsetWidth;
        progress.style.animation = "";
      }
    };

    const stop = () => {
      window.clearTimeout(timer);
      window.clearInterval(variantTimer);
    };
    const start = () => {
      stop();
      if (reduceMotion) return;
      const variantCount = variantsFor(current);
      if (variantCount > 1) {
        variantTimer = window.setInterval(() => {
          variant = Math.min(variant + 1, variantCount - 1);
          renderScreens();
        }, 2600);
      }
      timer = window.setTimeout(() => {
        activate((current + 1) % triggers.length);
        start();
      }, durationFor(current));
    };

    triggers.forEach((trigger, index) => {
      const select = () => {
        activate(index);
        start();
      };
      trigger.addEventListener("click", select);
      trigger.addEventListener("mouseenter", select);
      trigger.addEventListener("focus", select);
      trigger.addEventListener("keydown", (event) => {
        let targetIndex;
        if (event.key === "ArrowRight") targetIndex = (index + 1) % triggers.length;
        if (event.key === "ArrowLeft") targetIndex = (index - 1 + triggers.length) % triggers.length;
        if (event.key === "Home") targetIndex = 0;
        if (event.key === "End") targetIndex = triggers.length - 1;
        if (targetIndex === undefined) return;
        event.preventDefault();
        activate(targetIndex);
        triggers[targetIndex].focus();
        start();
      });
    });

    next?.addEventListener("click", () => {
      activate((current + 1) % triggers.length);
      start();
    });

    activate(0);
    start();
  });

  const header = document.querySelector(".site-header");
  if (header) {
    const syncStuck = () => header.classList.toggle("is-stuck", window.scrollY > 8);
    syncStuck();
    window.addEventListener("scroll", syncStuck, { passive: true });
  }

})();

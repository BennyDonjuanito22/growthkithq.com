(() => {
  const STORAGE_KEY = "asi_cookie_preferences";

  const loadPrefs = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (typeof parsed?.analytics !== "boolean") return null;
      return parsed;
    } catch (error) {
      return null;
    }
  };

  const savePrefs = (prefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  };

  const enableAnalytics = () => {
    if (window.__asiAnalyticsEnabled) return;
    window.__asiAnalyticsEnabled = true;
    // Stub analytics loader
    console.info("ASI analytics enabled (stub).");
  };

  const applyPrefs = (prefs) => {
    if (prefs.analytics) {
      enableAnalytics();
    }
  };

  const getCookiesLink = () => {
    const path = window.location.pathname || "";
    if (path.startsWith("/legal/")) {
      if (path === "/legal/" || path === "/legal") {
        return "cookies/";
      }
      return "../cookies/";
    }
    return "legal/cookies/";
  };

  const createBanner = () => {
    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.innerHTML = `
      <div class="container">
        <p>
          We use essential cookies to operate this site. With your consent, we
          also use analytics cookies to improve performance. See our
          <a href="${getCookiesLink()}">Cookie Policy</a>.
        </p>
        <div class="cookie-actions">
          <button class="cookie-button primary" data-action="accept">Accept</button>
          <button class="cookie-button secondary" data-action="reject">Reject</button>
          <button class="cookie-button secondary" data-action="manage">Manage</button>
        </div>
      </div>
    `;
    return banner;
  };

  const createModal = () => {
    const backdrop = document.createElement("div");
    backdrop.className = "cookie-modal-backdrop";
    backdrop.innerHTML = `
      <div class="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title">
        <h3 id="cookie-settings-title">Cookie preferences</h3>
        <p>Choose which cookies you allow. Essential cookies are always on.</p>
        <label>
          <input type="checkbox" data-cookie-toggle="analytics" />
          Enable analytics cookies
        </label>
        <div class="cookie-modal-actions">
          <button class="cookie-button primary" data-action="save">Save preferences</button>
          <button class="cookie-button secondary" data-action="close">Cancel</button>
        </div>
      </div>
    `;
    return backdrop;
  };

  const init = () => {
    const existingPrefs = loadPrefs();
    if (existingPrefs) {
      applyPrefs(existingPrefs);
      return;
    }

    const banner = createBanner();
    const modal = createModal();

    const analyticsToggle = () => modal.querySelector("[data-cookie-toggle='analytics']");

    const openModal = () => {
      modal.classList.add("active");
      const toggle = analyticsToggle();
      toggle.checked = false;
    };

    const closeModal = () => {
      modal.classList.remove("active");
    };

    const recordPrefs = (prefs) => {
      const updated = {
        analytics: !!prefs.analytics,
        decided: true,
        updated: new Date().toISOString()
      };
      savePrefs(updated);
      applyPrefs(updated);
      banner.remove();
      closeModal();
    };

    banner.addEventListener("click", (event) => {
      const action = event.target?.dataset?.action;
      if (!action) return;
      if (action === "accept") {
        recordPrefs({ analytics: true });
      }
      if (action === "reject") {
        recordPrefs({ analytics: false });
      }
      if (action === "manage") {
        openModal();
      }
    });

    modal.addEventListener("click", (event) => {
      const action = event.target?.dataset?.action;
      if (!action) return;
      if (action === "close") {
        closeModal();
      }
      if (action === "save") {
        const toggle = analyticsToggle();
        recordPrefs({ analytics: toggle.checked });
      }
    });

    document.body.appendChild(banner);
    document.body.appendChild(modal);
  };

  document.addEventListener("DOMContentLoaded", init);
})();

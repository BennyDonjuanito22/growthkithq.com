(() => {
  const PATHS = [
    "legal/company.json",
    "/legal/company.json",
    "./company.json",
    "../legal/company.json",
    "../company.json"
  ];

  const applyCompanyData = (data) => {
    document.querySelectorAll("[data-company]").forEach((el) => {
      const key = el.dataset.company;
      if (!key || !(key in data)) return;
      const value = data[key];
      if (el.tagName === "A" && key === "contact_email") {
        el.textContent = value;
        el.href = `mailto:${value}`;
      } else if (el.tagName === "A" && key === "site_domain") {
        el.textContent = value;
        el.href = `https://${value}`;
      } else {
        el.textContent = value;
      }
    });
  };

  const loadCompanyData = async () => {
    for (const path of PATHS) {
      try {
        const response = await fetch(path, { cache: "no-store" });
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        // Try next path
      }
    }
    return null;
  };

  document.addEventListener("DOMContentLoaded", async () => {
    const data = await loadCompanyData();
    if (data) {
      applyCompanyData(data);
    }
  });
})();

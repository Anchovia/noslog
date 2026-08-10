(() => {
    const root = document.documentElement;
    const params = new URLSearchParams(location.search);
    const controls = document.querySelector(".review-controls");

    if (!controls) return;

    const theme = params.get("foundation-theme") === "light" ? "light" : "dark";
    const font =
        params.get("foundation-font") === "fallback" ? "fallback" : "jp";

    root.dataset.foundationTheme = theme;
    root.dataset.foundationFont = font;

    const group = document.createElement("span");
    group.className = "foundation-regression-controls";
    group.innerHTML = `
        <button type="button" data-foundation-control="theme" data-value="dark">Foundation Dark</button>
        <button type="button" data-foundation-control="theme" data-value="light">Foundation Light</button>
        <button type="button" data-foundation-control="font" data-value="jp">Pretendard JP</button>
        <button type="button" data-foundation-control="font" data-value="fallback">Fallback</button>
    `;
    controls.prepend(group);

    const status = document.createElement("p");
    status.className = "foundation-regression-status";
    status.setAttribute("aria-live", "polite");
    controls.insertAdjacentElement("afterend", status);

    const sync = async () => {
        controls
            .querySelectorAll("[data-foundation-control]")
            .forEach((button) => {
                const key = button.dataset.foundationControl;
                const active =
                    (key === "theme" &&
                        button.dataset.value ===
                            root.dataset.foundationTheme) ||
                    (key === "font" &&
                        button.dataset.value === root.dataset.foundationFont);
                button.setAttribute("aria-pressed", String(active));
            });

        if (root.dataset.foundationFont === "fallback") {
            status.textContent = `Foundation v0.1 regression · ${root.dataset.foundationTheme} · intentional fallback stack`;
            return;
        }

        await document.fonts.load(
            '16px "Pretendard JP Variable"',
            "NosLog 노스로그 ノスログ 987,654"
        );
        const loaded = document.fonts.check(
            '16px "Pretendard JP Variable"',
            "NosLog 노스로그 ノスログ 987,654"
        );
        status.textContent = `Foundation v0.1 regression · ${root.dataset.foundationTheme} · Pretendard JP ${loaded ? "loaded" : "unavailable"}`;
    };

    controls.addEventListener("click", (event) => {
        const button = event.target.closest("[data-foundation-control]");
        if (!button) return;

        const key = button.dataset.foundationControl;
        const value = button.dataset.value;
        if (key === "theme") root.dataset.foundationTheme = value;
        if (key === "font") root.dataset.foundationFont = value;

        params.set(`foundation-${key}`, value);
        history.replaceState(
            null,
            "",
            `${location.pathname}?${params.toString()}${location.hash}`
        );
        sync();
    });

    const requestedWidth = params.get("foundation-width");
    const requestedLocale = params.get("foundation-locale");
    const requestedScale = params.get("foundation-scale");
    const activateExistingControl = (name, value) => {
        if (!value) return;
        const control = document.querySelector(
            `[data-control="${name}"][data-value="${value}"], [data-review="${name}"][data-value="${value}"]`
        );
        if (control) {
            control.click();
            return;
        }

        // A few approved fixture widths already have CSS coverage but were not
        // exposed in the historical review toolbar.
        if (name === "width") {
            const specimen = document.querySelector(".specimen-frame");
            if (specimen) specimen.dataset.width = value;
        }
    };

    const applyRequestedState = () => {
        activateExistingControl("width", requestedWidth);
        activateExistingControl("locale", requestedLocale);
        activateExistingControl("scale", requestedScale);
    };

    applyRequestedState();

    // Some historical structure specimens finish their own validation matrix on
    // `load` and restore the review defaults. Reapply only the requested review
    // state after that matrix; this does not alter product behavior or content.
    window.addEventListener("load", () => {
        window.setTimeout(applyRequestedState, 0);
    });
    sync();
})();

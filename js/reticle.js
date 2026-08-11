document.addEventListener("DOMContentLoaded", () => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reticle = document.querySelector(".reticle");
    const cross = reticle.querySelector(".reticle-cross");
    const coords = reticle.querySelector(".reticle-coords");
    const box = reticle.querySelector(".reticle-box");
    const tag = reticle.querySelector(".reticle-tag");
    const labelEl = tag.querySelector(".label-text");
    const confEl = tag.querySelector(".conf-value");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let posX = mouseX;
    let posY = mouseY;
    let activeTarget = null;
    let confRAF = null;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!activeTarget) {
            coords.textContent = `X: ${String(Math.round(mouseX)).padStart(4, "0")}  Y: ${String(Math.round(mouseY)).padStart(4, "0")}`;
        }
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
        const t = reduceMotion ? 1 : 0.2;
        posX = lerp(posX, mouseX, t);
        posY = lerp(posY, mouseY, t);
        if (!activeTarget) {
            cross.style.transform = `translate(${posX}px, ${posY}px)`;
            coords.style.transform = `translate(${posX + 18}px, ${posY + 14}px)`;
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    function animateConfidence(target) {
        if (confRAF) cancelAnimationFrame(confRAF);
        const duration = reduceMotion ? 0 : 550;
        const start = performance.now();
        function step(now) {
            const elapsed = now - start;
            const progress = duration === 0 ? 1 : Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            confEl.textContent = (target * eased).toFixed(1) + "%";
            if (progress < 1) confRAF = requestAnimationFrame(step);
        }
        confRAF = requestAnimationFrame(step);
    }

    function updateBoxPosition(el) {
        const rect = el.getBoundingClientRect();
        box.style.width = rect.width + "px";
        box.style.height = rect.height + "px";
        box.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
    }

    document.querySelectorAll("[data-detect]").forEach((el) => {
        el.addEventListener("mouseenter", () => {
            activeTarget = el;
            updateBoxPosition(el);
            box.style.opacity = "1";
            cross.style.opacity = "0";
            coords.style.opacity = "0";
            labelEl.textContent = el.dataset.detect || "";
            animateConfidence(parseFloat(el.dataset.confidence || "95"));
        });
        el.addEventListener("mouseleave", () => {
            activeTarget = null;
            box.style.opacity = "0";
            cross.style.opacity = "0.9";
            coords.style.opacity = "0.9";
        });
    });

    window.addEventListener("scroll", () => {
        if (activeTarget) updateBoxPosition(activeTarget);
    }, { passive: true });

    document.body.classList.add("reticle-enabled");
});

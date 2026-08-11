document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- Scroll reveal ---- */
    const revealEls = document.querySelectorAll("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach((el) => observer.observe(el));
    }

    /* ---- Numeric "settle" tween shared by tag cycler + project cards ---- */
    function tweenTo(el, target, suffix, duration) {
        const start = performance.now();
        const dur = reduceMotion ? 0 : duration;
        function step(now) {
            const elapsed = now - start;
            const progress = dur === 0 ? 1 : Math.min(elapsed / dur, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = (target * eased).toFixed(1) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    /* ---- Hero identity tag cycler ---- */
    const identities = [
        { label: "COMPUTER VISION ENGINEER", conf: 96.7 },
        { label: "ROBOTICIST", conf: 94.1 },
        { label: "PERCUSSIONIST", conf: 91.8 },
        { label: "NLP TINKERER", conf: 93.4 },
        { label: "POET, OCCASIONALLY", conf: 88.2 },
    ];
    const cycler = document.getElementById("tag-cycler");
    if (cycler) {
        const labelEl = cycler.querySelector(".tag-label");
        const confEl = cycler.querySelector(".tag-confidence");
        let idx = 0;
        function showIdentity() {
            const identity = identities[idx];
            labelEl.textContent = identity.label;
            tweenTo(confEl, identity.conf, "%", 500);
            idx = (idx + 1) % identities.length;
        }
        showIdentity();
        setInterval(showIdentity, 3200);
    }

    /* ---- Live feed timecode ---- */
    const timecodeEl = document.getElementById("timecode");
    if (timecodeEl) {
        let seconds = Math.floor(Math.random() * 5400) + 120;
        const render = () => {
            const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
            const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
            const s = String(seconds % 60).padStart(2, "0");
            timecodeEl.textContent = `${h}:${m}:${s}`;
        };
        render();
        setInterval(() => {
            seconds += 1;
            render();
        }, 1000);
    }

    /* ---- Hero portrait autofocus-hunt on load ---- */
    const portrait = document.querySelector(".hero-portrait");
    if (portrait && !reduceMotion) {
        requestAnimationFrame(() => portrait.classList.add("autofocus-hunt"));
    }

    /* ---- Project card confidence tick-up on hover ---- */
    document.querySelectorAll(".project-card").forEach((card) => {
        const scoreEl = card.querySelector(".match-score .score-value");
        if (!scoreEl) return;
        card.addEventListener("mouseenter", () => {
            const target = parseFloat(card.dataset.confidence || "95");
            tweenTo(scoreEl, target, "", 550);
        });
    });

    /* ---- Ambient hero coordinate grid ---- */
    const canvas = document.getElementById("hero-grid");
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext("2d");
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const isSmall = window.matchMedia("(max-width: 768px)").matches;
        let width, height;
        let targetX = 0, targetY = 0;
        let offX = 0, offY = 0;

        function resize() {
            width = canvas.width = canvas.offsetWidth * dpr;
            height = canvas.height = canvas.offsetHeight * dpr;
        }
        resize();
        window.addEventListener("resize", resize);

        if (!reduceMotion && !isSmall) {
            window.addEventListener("mousemove", (e) => {
                targetX = (e.clientX / window.innerWidth - 0.5) * 2;
                targetY = (e.clientY / window.innerHeight - 0.5) * 2;
            });
        }

        const spacing = 46 * dpr;

        function draw() {
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = "rgba(255,255,255,0.045)";
            ctx.lineWidth = 1;

            offX += (targetX * 12 - offX) * 0.05;
            offY += (targetY * 12 - offY) * 0.05;

            const startX = ((offX % spacing) + spacing) % spacing;
            const startY = ((offY % spacing) + spacing) % spacing;

            for (let x = startX; x < width; x += spacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = startY; y < height; y += spacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            if (!reduceMotion && !isSmall) requestAnimationFrame(draw);
        }
        draw();
    }
});

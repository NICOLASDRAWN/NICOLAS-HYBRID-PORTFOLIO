/**
 * ═══════════ GENERATIVE HERO BACKGROUNDS v2 ═══════════
 * Author: Nicolás Monroy Pabón
 * Inspired by Canvas Sketch & Code Art
 *
 * v2 upgrades:
 *  - Particles with live connections (constellation network)
 *  - Scroll-reactive code background
 *  - Text scramble effect on key headings
 *  - Respects prefers-reduced-motion
 */

const reducedMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ═════════════════════════════════════════════════════════════════
// 1 · CONSTELLATION PARTICLES (Canvas Sketch Style, with connections)
// ═════════════════════════════════════════════════════════════════
const initParticles = () => {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let particles = [];
    let mouse = { x: -9999, y: -9999 };

    const resize = () => {
        canvas.width = globalThis.innerWidth;
        canvas.height = globalThis.innerHeight;
    };
    globalThis.addEventListener('resize', resize);
    resize();

    // Mouse repulsion
    globalThis.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    globalThis.addEventListener('mouseleave', () => {
        mouse.x = -9999; mouse.y = -9999;
    });

    class Particle {
        constructor() { this.reset(true); }
        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.8 + 0.6;
            this.speedX = (Math.random() - 0.5) * 0.45;
            this.speedY = (Math.random() - 0.5) * 0.45;
            this.life = Math.random() * 0.4 + 0.25;
            if (!initial) this.x = Math.random() * canvas.width;
        }
        update() {
            // Mouse repulsion (subtle)
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 140 && dist > 0) {
                const force = (140 - dist) / 140;
                this.x += (dx / dist) * force * 1.2;
                this.y += (dy / dist) * force * 1.2;
            }
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.fillStyle = `rgba(189, 230, 0, ${this.life})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const particleCount = reducedMotion ? 35 : 90;
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const drawConnections = () => {
        const maxDist = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < maxDist) {
                    const alpha = (1 - d / maxDist) * 0.18;
                    ctx.strokeStyle = `rgba(189, 230, 0, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        if (!reducedMotion) drawConnections();
        requestAnimationFrame(animate);
    };
    animate();
};

// ═════════════════════════════════════════════════════════════════
// 2 · SCROLLING CODE BACKGROUND (Matrix style, subtle)
// ═════════════════════════════════════════════════════════════════
const initCodeBg = () => {
    const codeBg = document.getElementById('heroCodeBg');
    if (!codeBg) return;
    if (reducedMotion) return;

    const snippets = [
        "const AI = new GenerativeAgent();",
        "function sketch() { canvas.draw(); }",
        "import { affinity } from 'creative-suite';",
        "console.log('Hybrid Portfolio Live');",
        "while(learning) { evolve(); }",
        "ctx.arc(x, y, radius, 0, Math.PI * 2);",
        "npm install future-branding",
        "git commit -m 'Creative Hub Sync'",
        "const design = affinity.designer.export();",
        "let particles = canvas.sketch.generate();",
        "await claude.messages.create({ model, messages });",
        "if (client.responsive === false) rebuild();",
        "const embed = await gemini.embedContent(doc);",
        "export default function App({ data }) { return ... }",
    ];

    for (let i = 0; i < 18; i++) {
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.left = Math.random() * 80 + '%';
        line.style.top = Math.random() * 100 + '%';
        line.style.whiteSpace = 'nowrap';
        line.innerText = snippets[Math.floor(Math.random() * snippets.length)];
        line.style.opacity = Math.random() * 0.5 + 0.1;
        codeBg.appendChild(line);

        if (globalThis.gsap) {
            gsap.to(line, {
                y: "-=100",
                duration: Math.random() * 20 + 20,
                repeat: -1,
                ease: "none",
                onRepeat: () => {
                    line.style.left = Math.random() * 80 + '%';
                    line.style.top = "110%";
                }
            });
        }
    }
};

// ═════════════════════════════════════════════════════════════════
// 3 · TEXT SCRAMBLE EFFECT (data-scramble attribute)
// ═════════════════════════════════════════════════════════════════
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#______';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 20);
            const end = start + Math.floor(Math.random() * 20);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

const initScramble = () => {
    if (reducedMotion) return;
    const targets = document.querySelectorAll('[data-scramble]');
    targets.forEach((el, i) => {
        const originalText = el.innerText;
        const fx = new TextScramble(el);
        // Trigger once on load with a small stagger
        setTimeout(() => fx.setText(originalText), 400 + i * 300);
        // Re-trigger on hover
        el.addEventListener('mouseenter', () => fx.setText(originalText));
    });
};

// ═════════════════════════════════════════════════════════════════
// 4 · PARALLAX ON SCROLL (hero elements)
// ═════════════════════════════════════════════════════════════════
const initParallax = () => {
    if (reducedMotion) return;
    const hero = document.getElementById('hero');
    const code = document.getElementById('heroCodeBg');
    if (!hero || !code) return;

    globalThis.addEventListener('scroll', () => {
        const scrollY = globalThis.scrollY;
        if (scrollY < globalThis.innerHeight) {
            code.style.transform = `translateY(${scrollY * 0.3}px)`;
            hero.style.setProperty('--scroll-opacity', 1 - scrollY / globalThis.innerHeight);
        }
    }, { passive: true });
};

// ═════════════════════════════════════════════════════════════════
// INITIALIZE
// ═════════════════════════════════════════════════════════════════
globalThis.addEventListener('load', () => {
    initParticles();
    initCodeBg();
    initScramble();
    initParallax();
});

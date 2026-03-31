/**
 * ═══════════ GENERATIVE HERO BACKGROUNDS ═══════════
 * Author: Nicolás Monroy Pabón AI 
 * Inspired by Canvas Sketch & Code Art
 */

// 1. PARTICLES CANVAS (Canvas Sketch Style)
const initParticles = () => {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    const resize = () => {
        canvas.width = globalThis.innerWidth;
        canvas.height = globalThis.innerHeight;
    };
    globalThis.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.life = Math.random() * 0.5 + 0.2;
        }
        update() {
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

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    };
    animate();
};

// 2. SCROLLING CODE BACKGROUND (Matrix/Hacker Style sutil)
const initCodeBg = () => {
    const codeBg = document.getElementById('heroCodeBg');
    if (!codeBg) return;

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
        "let particles = canvas.sketch.generate();"
    ];

    for (let i = 0; i < 15; i++) {
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.left = Math.random() * 80 + '%';
        line.style.top = Math.random() * 100 + '%';
        line.style.whiteSpace = 'nowrap';
        line.innerText = snippets[Math.floor(Math.random() * snippets.length)];
        line.style.opacity = Math.random() * 0.5 + 0.1;
        codeBg.appendChild(line);

        // Slow drift
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
};

// INITIALIZE
globalThis.addEventListener('load', () => {
    initParticles();
    initCodeBg();
});

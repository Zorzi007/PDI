/* --- 1. LÓGICA DO PAINEL DESLIZANTE --- */

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});


/* --- 2. FUNDO TECNOLÓGICO INTERATIVO --- */

const backgroundCanvas = document.getElementById('background-canvas');

if (backgroundCanvas) {
    const ctx = backgroundCanvas.getContext('2d');
    const config = {
        nodeDensity: 0.00012,
        minNodes: 60,
        maxNodes: 150,
        baseSpeed: 0.2,
        maxDistance: 180,
        pointerInfluence: 160,
        pointerStrength: 0.35
    };

    const palette = [
        { primary: 'rgba(181, 123, 255, 0.85)', glow: 'rgba(181, 123, 255, 0.22)' },
        { primary: 'rgba(75, 0, 110, 0.85)', glow: 'rgba(75, 0, 110, 0.18)' },
        { primary: 'rgba(26, 35, 126, 0.9)', glow: 'rgba(26, 35, 126, 0.2)' }
    ];

    let width = 0;
    let height = 0;
    let nodes = [];

    const pointer = {
        x: 0,
        y: 0,
        active: false,
        lastMove: 0
    };

    class Node {
        constructor(x, y) {
            this.reset(x, y);
        }

        reset(x = Math.random() * width, y = Math.random() * height) {
            const angle = Math.random() * Math.PI * 2;
            const speed = config.baseSpeed + Math.random() * 0.55;

            this.x = x;
            this.y = y;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.baseRadius = 1.2 + Math.random() * 2.4;
            this.offset = Math.random() * Math.PI * 2;
            this.palette = palette[Math.floor(Math.random() * palette.length)];
        }

        update(time) {
            const margin = 60;

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < -margin) this.x = width + margin;
            if (this.x > width + margin) this.x = -margin;
            if (this.y < -margin) this.y = height + margin;
            if (this.y > height + margin) this.y = -margin;

            if (pointer.active) {
                const dx = pointer.x - this.x;
                const dy = pointer.y - this.y;
                const distance = Math.hypot(dx, dy);

                if (distance < config.pointerInfluence && distance > 0.0001) {
                    const force = (1 - distance / config.pointerInfluence) * config.pointerStrength;
                    this.vx -= (dx / distance) * force;
                    this.vy -= (dy / distance) * force;
                }
            }

            const speed = Math.hypot(this.vx, this.vy);
            const maxSpeed = 0.8;
            if (speed > maxSpeed) {
                const ratio = maxSpeed / speed;
                this.vx *= ratio;
                this.vy *= ratio;
            }

            this.vx += (Math.random() - 0.5) * 0.0025;
            this.vy += (Math.random() - 0.5) * 0.0025;

            this.radius = this.baseRadius + Math.sin(time / 420 + this.offset) * 0.6;
        }

        draw(time) {
            const pulse = 0.35 + Math.sin(time / 760 + this.offset) * 0.12;
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 6.2);
            gradient.addColorStop(0, this.palette.primary);
            gradient.addColorStop(0.55, this.palette.glow);
            gradient.addColorStop(1, 'rgba(42, 0, 59, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * (1 + pulse * 0.35), 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;

        backgroundCanvas.width = width * dpr;
        backgroundCanvas.height = height * dpr;
        backgroundCanvas.style.width = `${width}px`;
        backgroundCanvas.style.height = `${height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const area = width * height;
        const targetCount = Math.max(
            config.minNodes,
            Math.min(config.maxNodes, Math.floor(area * config.nodeDensity))
        );

        nodes = [];
        for (let i = 0; i < targetCount; i += 1) {
            nodes.push(new Node());
        }

        pointer.x = width / 2;
        pointer.y = height / 2;
    };

    const drawConnections = () => {
        const { maxDistance } = config;

        for (let i = 0; i < nodes.length; i += 1) {
            const nodeA = nodes[i];

            for (let j = i + 1; j < nodes.length; j += 1) {
                const nodeB = nodes[j];
                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                const distance = Math.hypot(dx, dy);

                if (distance > maxDistance) continue;

                const alpha = 0.08 + (1 - distance / maxDistance) * 0.45;
                ctx.strokeStyle = `rgba(181, 123, 255, ${alpha})`;
                ctx.lineWidth = (1 - distance / maxDistance) * 1.8;
                ctx.beginPath();
                ctx.moveTo(nodeA.x, nodeA.y);
                ctx.lineTo(nodeB.x, nodeB.y);
                ctx.stroke();
            }
        }
    };

    const animate = (time = 0) => {
        ctx.clearRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'lighter';

        nodes.forEach((node) => {
            node.update(time);
        });

        drawConnections();

        nodes.forEach((node) => {
            node.draw(time);
        });

        if (performance.now() - pointer.lastMove > 2000) {
            pointer.active = false;
        }

        ctx.globalCompositeOperation = 'source-over';

        requestAnimationFrame(animate);
    };

    const updatePointer = (x, y) => {
        pointer.x = x;
        pointer.y = y;
        pointer.active = true;
        pointer.lastMove = performance.now();
    };

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    resizeCanvas();
    requestAnimationFrame(animate);
}
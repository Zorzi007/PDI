/* --- 1. LÓGICA DO PAINEL DESLIZANTE --- */

const botaoCadastrar = document.getElementById('botaoCadastrar');
const botaoEntrarFaixa = document.getElementById('botaoEntrarFaixa');
const painelAutenticacao = document.getElementById('area-autenticacao');

if (botaoCadastrar && botaoEntrarFaixa && painelAutenticacao) {
    botaoCadastrar.addEventListener('click', () => {
        painelAutenticacao.classList.add('painel-direito-ativo');
    });

    botaoEntrarFaixa.addEventListener('click', () => {
        painelAutenticacao.classList.remove('painel-direito-ativo');
    });
}


/* --- 2. LÓGICA DO PARALLAX TECNOLÓGICO --- */

const elementosParallax = document.querySelectorAll('[data-deslocamento]');

if (elementosParallax.length) {
    elementosParallax.forEach((elemento) => {
        const transformacaoCalculada = window.getComputedStyle(elemento).transform;
        elemento.dataset.transformacaoBase = transformacaoCalculada && transformacaoCalculada !== 'none' ? transformacaoCalculada : '';
    });

    const atualizarParallax = (evento) => {
        const posicaoRelativaX = (evento.clientX / window.innerWidth) - 0.5;
        const posicaoRelativaY = (evento.clientY / window.innerHeight) - 0.5;

        elementosParallax.forEach((elemento) => {
            const intensidade = parseFloat(elemento.dataset.deslocamento) || 0;
            const deslocamentoX = posicaoRelativaX * intensidade;
            const deslocamentoY = posicaoRelativaY * intensidade;
            const base = elemento.dataset.transformacaoBase;

            requestAnimationFrame(() => {
                elemento.style.transform = `${base ? `${base} ` : ''}translate(${deslocamentoX}px, ${deslocamentoY}px)`;
            });
        });
    };

    const redefinirParallax = () => {
        elementosParallax.forEach((elemento) => {
            const base = elemento.dataset.transformacaoBase;
            elemento.style.transform = base || '';
        });
    };

    document.addEventListener('pointermove', atualizarParallax);
    document.addEventListener('pointerleave', redefinirParallax);
}


/* --- 3. CAMADA DE PARTÍCULAS (CANVAS) --- */

const canvasParticulas = document.getElementById('canvas-particulas');

if (canvasParticulas) {
    const contexto = canvasParticulas.getContext('2d');
    const particulas = [];
    const ponteiro = { x: 0, y: 0, ativo: false };
    const densidadeBase = 16000; // Controla a quantidade de partículas por área.
    let largura = window.innerWidth;
    let altura = window.innerHeight;
    let taxaPixel = window.devicePixelRatio || 1;

    class Particula {
        constructor() {
            this.reiniciar(true);
        }

        reiniciar(inicial = false) {
            this.x = inicial ? Math.random() * largura : (Math.random() < 0.5 ? Math.random() * largura : (Math.random() < 0.5 ? 0 : largura));
            this.y = inicial ? Math.random() * altura : (Math.random() < 0.5 ? Math.random() * altura : (Math.random() < 0.5 ? 0 : altura));
            this.velocidadeX = (Math.random() - 0.5) * 0.6;
            this.velocidadeY = (Math.random() - 0.5) * 0.6;
            this.tamanho = 1.4 + Math.random() * 1.6;
            this.opacidade = 0.15 + Math.random() * 0.25;
        }

        aplicarForcaDoPonteiro() {
            if (!ponteiro.ativo) {
                return;
            }

            const distanciaX = ponteiro.x - this.x;
            const distanciaY = ponteiro.y - this.y;
            const distanciaQuadrada = distanciaX * distanciaX + distanciaY * distanciaY;
            const raioDeInfluencia = 140;
            const raioQuadrado = raioDeInfluencia * raioDeInfluencia;

            if (distanciaQuadrada < raioQuadrado && distanciaQuadrada > 0.5) {
                const distancia = Math.sqrt(distanciaQuadrada);
                const forca = (1 - distancia / raioDeInfluencia) * 0.9;
                const normalizadoX = distanciaX / distancia;
                const normalizadoY = distanciaY / distancia;
                this.velocidadeX -= normalizadoX * forca;
                this.velocidadeY -= normalizadoY * forca;
            }
        }

        atualizar() {
            this.aplicarForcaDoPonteiro();

            this.velocidadeX *= 0.985;
            this.velocidadeY *= 0.985;

            this.x += this.velocidadeX;
            this.y += this.velocidadeY;

            const margem = 40;
            if (this.x < -margem || this.x > largura + margem || this.y < -margem || this.y > altura + margem) {
                this.reiniciar();
            }
        }

        desenhar() {
            contexto.beginPath();
            contexto.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
            contexto.fillStyle = `rgba(0, 188, 212, ${this.opacidade})`;
            contexto.fill();
        }
    }

    function redimensionarCanvas() {
        largura = window.innerWidth;
        altura = window.innerHeight;
        taxaPixel = window.devicePixelRatio || 1;

        canvasParticulas.width = largura * taxaPixel;
        canvasParticulas.height = altura * taxaPixel;
        canvasParticulas.style.width = `${largura}px`;
        canvasParticulas.style.height = `${altura}px`;
        contexto.setTransform(1, 0, 0, 1, 0, 0);
        contexto.scale(taxaPixel, taxaPixel);

        reconstruirParticulas();
    }

    function reconstruirParticulas() {
        const quantidadeAlvo = Math.max(24, Math.round((largura * altura) / densidadeBase));

        if (particulas.length > quantidadeAlvo) {
            particulas.length = quantidadeAlvo;
        } else {
            while (particulas.length < quantidadeAlvo) {
                particulas.push(new Particula());
            }
        }
    }

    function animar() {
        contexto.clearRect(0, 0, largura, altura);
        particulas.forEach((particula) => {
            particula.atualizar();
            particula.desenhar();
        });
        requestAnimationFrame(animar);
    }

    function registrarMovimento(evento) {
        ponteiro.ativo = true;
        ponteiro.x = evento.clientX;
        ponteiro.y = evento.clientY;
    }

    function limparPonteiro() {
        ponteiro.ativo = false;
    }

    window.addEventListener('resize', redimensionarCanvas);
    document.addEventListener('pointermove', registrarMovimento);
    document.addEventListener('pointerdown', registrarMovimento);
    document.addEventListener('pointerup', limparPonteiro);
    document.addEventListener('pointerleave', limparPonteiro);

    redimensionarCanvas();
    animar();
}
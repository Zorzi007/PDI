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


/* --- 2. LÓGICA DO FUNDO INTERATIVO (MOUSE-REACTIVE) --- */

const blobs = document.querySelectorAll('.blob');

document.addEventListener('mousemove', (event) => {
    const { clientX, clientY } = event;
    const mouseX = (clientX / window.innerWidth) - 0.5;
    const mouseY = (clientY / window.innerHeight) - 0.5;

    blobs.forEach((blob, index) => {
        let speedX, speedY;

        if (index === 0) { // blob1
            speedX = -mouseX * 40;
            speedY = -mouseY * 40;
        } else if (index === 1) { // blob2
            speedX = mouseX * 80;
            speedY = mouseY * 80;
        } else { // blob3
            speedX = -mouseX * 20;
            speedY = mouseY * 20;
        }

        requestAnimationFrame(() => {
            blob.style.transform = `translate(${speedX}px, ${speedY}px)`;
        });
    });
});
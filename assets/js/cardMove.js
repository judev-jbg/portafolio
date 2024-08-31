let cardsCount = 0;
const data = [{
        icon: 'ri-code-s-slash-fill',
        title: 'Desarrollo front-end',
        text: 'Transformo tus ideas en experiencias digitales impresionantes. Puedo crear interfaces intuitivas, optimizadas para rendimiento y adaptables a cualquier dispositivo. Diseño responsive, velocidad y accesibilidad garantizadas. ¡Te ayudaré a impulsar tu proyecto!',
    },
    {
        icon: 'ri-braces-fill',
        title: 'Desarrollo back-end',
        text: 'Desarrollo soluciones robustas y escalables, garantizando seguridad y eficiencia.<br>Con experiencia en bases de datos y APIs, aseguro un rendimiento óptimo.',
    },
    {
        icon: 'ri-layout-3-fill',
        title: 'Diseño UI/UX',
        text: 'Diseño experiencias de usuario intuitivas y optimizadas, con énfasis en investigación, prototipado y pruebas de usabilidad. Tengo experiencia en creación de flujos eficientes y garantizo soluciones centradas en el usuario para impulsar la satisfacción y el éxito del proyecto.',
    },
    {
        icon: 'ri-pie-chart-2-fill',
        title: 'Ingeniería de datos',
        text: 'Transformo datos en información significativa y estratégica. Experiencia en análisis estadístico y visualización de datos. Aporto soluciones basadas en evidencia para impulsar la toma de decisiones informadas y el éxito del proyecto.',
    },
    {
        icon: 'ri-briefcase-fill',
        title: 'Gestión de proyectos',
        text: 'Con un Máster en Gestión de proyectos, soy el profesional idóneo para dirigir sus proyectos. Tengo conocimientos en planificación, coordinación y gestión de equipos multifuncionales.<br> Comprometido con el éxito del proyecto, garantizo resultados excepcionales mediante una sólida dirección estratégica y habilidades de comunicación efectiva.',
    },
    {
        icon: 'ri-file-excel-2-fill',
        title: 'Experto en Excel',
        text: 'Domino Excel al más alto nivel para optimizar sus procesos. Automatización, análisis de datos y creación de informes son mi especialidad. Desde fórmulas avanzadas hasta macros personalizadas, proporciono soluciones eficientes que impulsan la productividad y el éxito empresarial.',
    },
    {
        icon: 'ri-flag-fill',
        title: '¡Has llegado al final!',
        text: 'Gracias por dedicar tiempo a revisar los servicios que ofrezco. Puedo responder cualquier pregunta que tengas y discutir cómo puedo ayudarte a alcanzar tus objetivos.<br>Si te interesa, no dudes en ponerte en contacto conmigo.',
    },
];

const ul = document.querySelector('.services__cards');
const newData = data.map((x) => {
    x.islast = 0;
    return x;
});
newData[newData.length - 1].islast = 1;
newData.forEach((_data) => appendCard(_data));

let current = ul.querySelector('.services__card:last-child');
let startX = 0,
    startY = 0,
    moveX = 0,
    moveY = 0;
initCard(current);

function appendCard(data) {
    const firstCard = ul.children[0];
    const newCard = document.createElement('li');
    newCard.className = 'services__card';
    newCard.innerHTML = `
            <div class="card__icon">
            <i class="${data.icon}"></i>
            </div>
            <p class="card__title">${data.title}</p>
            <span class="card__line"></span>
            <p class="card__data">
            ${data.text}
            ${data.islast == 1 ? showButtom() : ''}
            </p>
        `;
    if (firstCard) ul.insertBefore(newCard, firstCard);
    else ul.appendChild(newCard);
    cardsCount++;
}

function showButtom() {
    return `
        <span class="about-me__bottom">
          <a href="#contact-me" class="about-me__cta">Contáctame</a>
        </span>
      `;
}

function initCard(card) {
    card.addEventListener('pointerdown', onPointerDown);
    card.addEventListener('touchstart', onTouchStart);
}

function setTransform(x, y, deg, duration) {
    current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg}deg)`;
    if (duration) current.style.transition = `transform ${duration}ms`;
}


function onPointerDown(event) {
    startX = event.clientX;
    startY = event.clientY;
    current.addEventListener('pointermove', onPointerMove);
    current.addEventListener('pointerup', onPointerUp);
    current.addEventListener('pointerleave', onPointerUp);
}

function onPointerMove(event) {
    moveX = event.clientX - startX;
    moveY = event.clientY - startY;
    setTransform(moveX, moveY, moveX / innerWidth * 50);
}

function onPointerUp() {
    current.removeEventListener('pointermove', onPointerMove);
    current.removeEventListener('pointerup', onPointerUp);
    current.removeEventListener('pointerleave', onPointerUp);
    if (Math.abs(moveX) > ul.clientWidth / 3) {
        current.removeEventListener('pointerdown', onPointerDown);
        complete();
    } else cancel();
}

function onTouchStart(event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    current.addEventListener('touchmove', onTouchMove);
    current.addEventListener('touchend', onTouchEnd);
    current.addEventListener('touchcancel', onTouchEnd);
}

function onTouchMove(event) {
    moveX = event.touches[0].clientX - startX;
    moveY = event.touches[0].clientY - startY;
    setTransform(moveX, moveY, moveX / innerWidth * 50);
}

function onTouchEnd() {
    current.removeEventListener('touchmove', onTouchMove);
    current.removeEventListener('touchend', onTouchEnd);
    current.removeEventListener('touchcancel', onTouchEnd);
    if (Math.abs(moveX) > ul.clientWidth / 3) {
        current.removeEventListener('touchstart', onTouchStart);
        complete();
    } else cancel();
}

function complete() {
    const flyX = (Math.abs(moveX) / moveX) * innerWidth * 1.3;
    const flyY = (moveY / moveX) * flyX;
    setTransform(flyX, flyY, flyX / innerWidth * 50, innerWidth);

    const prev = current;
    const next = current.previousElementSibling;
    if (next) initCard(next);
    current = next;
    appendCard(data[cardsCount % 7]);
    setTimeout(() => ul.removeChild(prev), innerWidth / 3);
}

function cancel() {
    setTransform(0, 0, 0, 100);
    setTimeout(() => (current.style.transition = ''), 100);
}
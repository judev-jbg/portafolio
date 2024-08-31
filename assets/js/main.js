document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle
    const themeToggle = document.querySelector('.topbar__theme');
    const themeToggleHeader = document.querySelector('.header__theme');
    const themeIcon = themeToggle.querySelector('i');
    const themeIconHeader = themeToggleHeader.querySelector('i');
    const imgFooter = document.querySelector(".footer__img > img");

    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('ri-moon-line');
        themeIcon.classList.add('ri-sun-line');
        themeIconHeader.classList.remove('ri-moon-line');
        themeIconHeader.classList.add('ri-sun-line');
        imgFooter.setAttribute("src", imgFooter.getAttribute("src").replace("Light", "Black"));
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('ri-moon-line');
            themeIcon.classList.add('ri-sun-line');
            imgFooter.setAttribute("src", imgFooter.getAttribute("src").replace("Light", "Black"));
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('ri-sun-line');
            themeIcon.classList.add('ri-moon-line');
            imgFooter.setAttribute("src", imgFooter.getAttribute("src").replace("Black", "Light"));
            localStorage.setItem('theme', 'light');
        }
    });
    themeToggleHeader.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeIconHeader.classList.remove('ri-moon-line');
            themeIconHeader.classList.add('ri-sun-line');
            imgFooter.setAttribute("src", imgFooter.getAttribute("src").replace("Light", "Black"));
            localStorage.setItem('theme', 'dark');
        } else {
            themeIconHeader.classList.remove('ri-sun-line');
            themeIconHeader.classList.add('ri-moon-line');
            imgFooter.setAttribute("src", imgFooter.getAttribute("src").replace("Black", "Light"));
            localStorage.setItem('theme', 'light');
        }
    });

    // Navigation Active Class
    const navItems = document.querySelectorAll('.nav__item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {

            let navItemClassIcon = "";
            navItems.forEach(nav => {

                navItemClassIcon = nav.querySelector('a > div > i').getAttribute("class");
                const newNavItemClassIcon = navItemClassIcon.replace("fill", "line");
                nav.querySelector('a > div > i').classList.remove(navItemClassIcon);
                nav.querySelector('a > div > i').classList.add(newNavItemClassIcon);
                nav.classList.remove('active');
            });
            item.classList.add('active');
            navItemClassIcon = item.querySelector('a > div > i').getAttribute("class");
            const newNavItemClassIcon = navItemClassIcon.replace("line", "fill");
            item.querySelector('a > div > i').classList.remove(navItemClassIcon);
            item.querySelector('a > div > i').classList.add(newNavItemClassIcon);
        });
    });

    // Form validation
    const btnForm = document.querySelector('.contact-me__button');
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });

    btnForm.addEventListener('click', (e) => {
        e.preventDefault();
        validateForm();

    });

    function validateForm() {
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const text = document.getElementById('fullName');
        let valid = true;

        if (!fullName.value.trim() || /\d/.test(fullName.value)) {
            showError(fullName, 'Por favor ingrese su nombre');
            valid = false;
            return;
        }
        fullName.nextElementSibling.classList.remove("error");
        fullName.nextElementSibling.nextElementSibling.classList.remove("error");

        if (!validateEmail(email.value)) {
            showError(email, 'El email no es válido');
            valid = false;
            return;
        }
        email.nextElementSibling.classList.remove("error");
        email.nextElementSibling.nextElementSibling.classList.remove("error");

        if (!text.value.trim()) {
            showError(text, 'Mensaje no puede estar vacío');
            valid = false;
            return;
        }
        text.nextElementSibling.classList.remove("error");
        text.nextElementSibling.nextElementSibling.classList.remove("error");

        if (valid) {


            emailjs.sendForm('service_xe8fjvg', 'template_cac7wf3', form)
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showSnackbar('¡Formulario enviado con éxito!');
                    form.reset();
                }, function (error) {
                    console.log('FAILED...', error);
                    showSnackbar('¡Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.!');
                    form.reset();
                });

        }
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    function showError(input, message) {
        const label = input.nextElementSibling;
        label.classList.add('error');
        label.nextElementSibling.classList.add('error');
        input.focus();
        showSnackbar(message);
    }

    function showSnackbar(message) {
        const snackbar = document.getElementById('snackbar');
        snackbar.textContent = message;
        snackbar.className = 'show';
        setTimeout(() => {
            snackbar.className = snackbar.className.replace('show', '');
        }, 4000);
    }


});
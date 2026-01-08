document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle
  const themeToggle = document.querySelector(".topbar__theme");
  const themeToggleHeader = document.querySelector(".header__theme");
  const themeIcon = themeToggle.querySelector("i");
  const themeIconHeader = themeToggleHeader.querySelector("i");
  const imgFooter = document.querySelector(".footer__img > img");

  // Función reutilizable para cambiar tema
  function toggleTheme() {
    const isDark = document.body.classList.toggle("dark-theme");
    const themeValue = isDark ? "dark" : "light";

    // Actualizar iconos
    [themeIcon, themeIconHeader].forEach((icon) => {
      icon.classList.toggle("ri-moon-line", !isDark);
      icon.classList.toggle("ri-sun-line", isDark);
    });

    // Actualizar imagen del footer
    const currentSrc = imgFooter.getAttribute("src");
    const newSrc = isDark
      ? currentSrc.replace("Light", "Black")
      : currentSrc.replace("Black", "Light");
    imgFooter.setAttribute("src", newSrc);

    // Guardar preferencia
    localStorage.setItem("theme", themeValue);
  }

  // Aplicar tema guardado al cargar
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    toggleTheme();
  }

  // Event listeners para ambos toggles
  themeToggle.addEventListener("click", toggleTheme);
  themeToggleHeader.addEventListener("click", toggleTheme);

  // Navigation Active Class
  const navItems = document.querySelectorAll(".nav__item");

  // Función para cambiar estado del icono
  function updateNavIcon(navItem, iconType) {
    const icon = navItem.querySelector("a > div > i");
    const currentClass = icon.getAttribute("class");
    const newClass = iconType === "fill"
      ? currentClass.replace("line", "fill")
      : currentClass.replace("fill", "line");

    icon.classList.remove(currentClass);
    icon.classList.add(newClass);
  }

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Desactivar todos los items
      navItems.forEach((nav) => {
        nav.classList.remove("active");
        updateNavIcon(nav, "line");
      });

      // Activar item actual
      item.classList.add("active");
      updateNavIcon(item, "fill");
    });
  });

  // Form validation
  const btnForm = document.querySelector(".contact-me__button");
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  btnForm.addEventListener("click", (e) => {
    e.preventDefault();
    validateForm();
  });

  function validateForm() {
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    let valid = true;

    if (!fullName.value.trim() || /\d/.test(fullName.value)) {
      showError(fullName, "Por favor ingrese su nombre");
      valid = false;
      return;
    }
    fullName.nextElementSibling.classList.remove("error");
    fullName.nextElementSibling.nextElementSibling.classList.remove("error");

    if (!validateEmail(email.value)) {
      showError(email, "El email no es válido");
      valid = false;
      return;
    }
    email.nextElementSibling.classList.remove("error");
    email.nextElementSibling.nextElementSibling.classList.remove("error");

    if (!message.value.trim()) {
      showError(message, "Mensaje no puede estar vacío");
      valid = false;
      return;
    }
    message.nextElementSibling.classList.remove("error");
    message.nextElementSibling.nextElementSibling.classList.remove("error");

    if (valid) {
      // Ejecutar reCAPTCHA v3 antes de enviar el formulario
      grecaptcha.ready(function () {
        grecaptcha
          .execute("6LdOGEQsAAAAAI_NyQ9bWJ59cvmMXHR6Tah7MHcw", {
            action: "submit",
          })
          .then(function (token) {
            // Enviar el formulario con EmailJS incluyendo el token de reCAPTCHA
            const templateParams = {
              fullName: form.fullName.value,
              email: form.email.value,
              message: form.message.value,
              'g-recaptcha-response': token
            };

            emailjs.send("service_xe8fjvg", "template_cac7wf3", templateParams).then(
              function (response) {
                console.log("SUCCESS!", response.status, response.text);
                showSnackbar("¡Formulario enviado con éxito!");
                form.reset();
              },
              function (error) {
                console.log("FAILED...", error);
                showSnackbar(
                  "¡Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo!"
                );
              }
            );
          });
      });
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }

  function showError(input, message) {
    const label = input.nextElementSibling;
    label.classList.add("error");
    label.nextElementSibling.classList.add("error");
    input.focus();
    showSnackbar(message);
  }

  function showSnackbar(message) {
    const snackbar = document.getElementById("snackbar");
    snackbar.textContent = message;
    snackbar.className = "show";
    setTimeout(() => {
      snackbar.className = snackbar.className.replace("show", "");
    }, 4000);
  }
});

// Registro del Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado exitosamente:', registration.scope);

        // Verificar actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 Nueva versión del Service Worker encontrada');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Hay una nueva versión disponible
              console.log('✨ Nueva versión disponible. Recarga la página para actualizar.');

              // Opcional: Mostrar notificación al usuario
              showUpdateNotification();
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ Error al registrar Service Worker:', error);
      });

    // Escuchar cambios en el controlador
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker actualizado, recargando página...');
      window.location.reload();
    });
  });
}

// Función para mostrar notificación de actualización
function showUpdateNotification() {
  const updateBanner = document.createElement('div');
  updateBanner.id = 'pwa-update-banner';
  updateBanner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #6366f1;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 16px;
      font-family: 'Poppins', sans-serif;
      animation: slideUp 0.3s ease-out;
    ">
      <span>¡Nueva versión disponible!</span>
      <button onclick="updatePWA()" style="
        background: white;
        color: #6366f1;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        font-family: 'Poppins', sans-serif;
      ">
        Actualizar
      </button>
      <button onclick="dismissUpdate()" style="
        background: transparent;
        color: white;
        border: 1px solid white;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'Poppins', sans-serif;
      ">
        Después
      </button>
    </div>
    <style>
      @keyframes slideUp {
        from {
          transform: translateX(-50%) translateY(100px);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
    </style>
  `;
  document.body.appendChild(updateBanner);
}

// Función para actualizar PWA
function updatePWA() {
  navigator.serviceWorker.getRegistration().then((registration) => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  });
}

// Función para descartar notificación de actualización
function dismissUpdate() {
  const banner = document.getElementById('pwa-update-banner');
  if (banner) {
    banner.style.animation = 'slideDown 0.3s ease-out';
    setTimeout(() => banner.remove(), 300);
  }
}

// Detectar si la app está instalada
window.addEventListener('appinstalled', () => {
  console.log('✅ PWA instalada exitosamente');
  // Opcional: Mostrar mensaje de agradecimiento
  showSnackbar('¡Gracias por instalar mi portafolio! 🎉');
});

// Mostrar prompt de instalación (si está disponible)
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevenir que Chrome muestre el prompt automáticamente
  e.preventDefault();
  deferredPrompt = e;
  console.log('💡 La aplicación puede ser instalada');

  // Opcional: Mostrar botón de instalación personalizado
  showInstallButton();
});

// Función para mostrar botón de instalación (opcional)
function showInstallButton() {
  // Aquí puedes agregar un botón personalizado para instalar la PWA
  // Por ahora solo lo registramos en consola
  console.log('📱 Botón de instalación disponible');
}

// Función para disparar instalación manualmente (si implementas botón)
function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ Usuario aceptó la instalación');
      } else {
        console.log('❌ Usuario rechazó la instalación');
      }
      deferredPrompt = null;
    });
  }
}

// Función auxiliar para mostrar mensajes (usa tu showSnackbar existente)
function showSnackbar(message) {
  const snackbar = document.getElementById('snackbar');
  if (snackbar) {
    snackbar.textContent = message;
    snackbar.className = 'show';
    setTimeout(() => {
      snackbar.className = snackbar.className.replace('show', '');
    }, 4000);
  }
}

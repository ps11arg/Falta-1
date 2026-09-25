// Variable para controlar si el splash screen ya terminó
let splashTerminado = false;

function cambiarPantalla(idPantalla) {
  // Oculta todas las pantallas
  document.querySelectorAll('.screen').forEach(el => {
    el.classList.remove('active');
  });

  // Muestra la pantalla solicitada
  const destino = document.getElementById(idPantalla);
  if (destino) {
    destino.classList.add('active');
  }
}

// Secuencia automática de los 12 segundos iniciales
setTimeout(() => {
  if (!splashTerminado) cambiarPantalla('step2'); // 3s: Bienvenida
}, 3000);

setTimeout(() => {
  if (!splashTerminado) cambiarPantalla('step3'); // 6s: Match deportivo
}, 6000);

setTimeout(() => {
  if (!splashTerminado) cambiarPantalla('step4'); // 9s: Cargando
}, 9000);

setTimeout(() => {
  splashTerminado = true;
  cambiarPantalla('step5'); // 12s: Pantalla de Login / Registro
}, 12000);

function validarRegistro() {
  const p1 = document.getElementById('pass').value;
  const p2 = document.getElementById('confirmPass').value;

  if (p1 !== p2) {
    alert("Las contraseñas no coinciden. Por favor verificalas.");
    return;
  }
  
  alert("¡Cuenta creada con éxito!");
  cambiarPantalla('menu-principal');
}

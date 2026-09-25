JavaScript
let splashActivo = true;
let temporizadores = [];

// Función para cambiar de pantalla de manera limpia
function irA(idPantalla) {
  // Si el usuario hace clic durante el splash inicial, cancelamos la secuencia automática
  if (splashActivo) {
    splashActivo = false;
    temporizadores.forEach(t => clearTimeout(t));
  }

  // Ocultar todas las pantallas
  document.querySelectorAll('.screen').forEach(el => {
    el.classList.remove('active');
  });

  // Mostrar la pantalla seleccionada
  const destino = document.getElementById(idPantalla);
  if (destino) {
    destino.classList.add('active');
  }
}

// Secuencia automática inicial de los 12 segundos
if (splashActivo) {
  temporizadores.push(setTimeout(() => { if(splashActivo) irA('pantalla-bienvenida'); }, 3000));
  temporizadores.push(setTimeout(() => { if(splashActivo) irA('pantalla-match'); }, 6000));
  temporizadores.push(setTimeout(() => { if(splashActivo) irA('pantalla-cargando'); }, 9000));
  temporizadores.push(setTimeout(() => { 
    if(splashActivo) {
      splashActivo = false;
      irA('pantalla-inicio'); 
    }
  }, 12000));
}

// Validación simple para el registro
function validarRegistro() {
  const p1 = document.getElementById('reg-pass').value;
  const p2 = document.getElementById('reg-pass2').value;

  if (!p1 || !p2) {
    alert("Por favor completa las contraseñas.");
    return;
  }

  if (p1 !== p2) {
    alert("Las contraseñas no coinciden. Verificalas.");
    return;
  }
  
  alert("¡Cuenta creada con éxito!");
  irA('pantalla-home');
}

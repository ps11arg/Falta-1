function showStep(stepNumber) {
  document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
  document.getElementById('step' + stepNumber).classList.add('active');
}

function mostrarSeccion(idSeccion) {
  document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
  document.getElementById(idSeccion).classList.add('active');
}

function irAlHome() {
  mostrarSeccion('menu-principal');
}

function validarRegistro() {
  const p1 = document.getElementById('pass').value;
  const p2 = document.getElementById('confirmPass').value;

  if (p1 !== p2) {
    alert("Las contraseñas no coinciden. Por favor verificalas.");
    return;
  }
  
  alert("¡Cuenta creada con éxito!");
  mostrarSeccion('menu-principal');
}

// Secuencia inicial del Splash Screen (12 segundos en total)
setTimeout(() => showStep(2), 3000);   // Bienvenida
setTimeout(() => showStep(3), 6000);   // Match deportivo
setTimeout(() => showStep(4), 9000);   // Cargando...
setTimeout(() => showStep(5), 12000);  // Pantalla de Login / Registro

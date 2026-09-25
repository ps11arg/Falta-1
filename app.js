function showStep(stepNumber) {
  // Oculta todas las pantallas
  document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
  // Muestra únicamente la pantalla que corresponde
  document.getElementById('step' + stepNumber).classList.add('active');
}

// Secuencia cronometrada exacta de 3 segundos por cada paso
setTimeout(() => showStep(2), 3000);   // Al segundo 3 -> Muestra Bienvenida
setTimeout(() => showStep(3), 6000);   // Al segundo 6 -> Muestra Match deportivo
setTimeout(() => showStep(4), 9000);   // Al segundo 9 -> Muestra Cargando...
setTimeout(() => showStep(5), 12000);  // Al segundo 12 -> Muestra Pantalla de Login / Registro

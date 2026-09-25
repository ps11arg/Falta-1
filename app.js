JavaScript
let splashActivo = true;
let temporizadores = [];

// Función para cambiar de pantalla de manera limpia
function irA(idPantalla) {
  if (splashActivo) {
    splashActivo = false;
    temporizadores.forEach(t => clearTimeout(t));
  }

  document.querySelectorAll('.screen').forEach(el => {
    el.classList.remove('active');
  });

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

// Base de datos de Localidades principales de ejemplo por Provincia Argentina
const localidadesPorProvincia = {
  "Buenos Aires": ["La Plata", "Mar del Plata", "Bahía Blanca", "San Isidro", "Tigre", "Quilmes", "Avellaneda", "Lanús", "Morón", "San Martín"],
  "CABA": ["Capital Federal"],
  "Catamarca": ["San Fernando del Valle de Catamarca", "Andalgalá", "Tinogasta"],
  "Chaco": ["Resistencia", "Sáenz Peña", "Villa Ángela"],
  "Chubut": ["Comodoro Rivadavia", "Trelew", "Puerto Madryn", "Rawson"],
  "Córdoba": ["Córdoba Capital", "Villa Carlos Paz", "Río Cuarto", "San Francisco", "Villa María"],
  "Corrientes": ["Corrientes Capital", "Goya", "Paso de los Libres"],
  "Entre Ríos": ["Paraná", "Concordia", "Gualeguaychú", "Concepción del Uruguay"],
  "Formosa": ["Formosa Capital", "Clorinda"],
  "Jujuy": ["San Salvador de Jujuy", "San Pedro", "Palpalá"],
  "La Pampa": ["Santa Rosa", "General Pico"],
  "La Rioja": ["La Rioja Capital", "Chilecito"],
  "Mendoza": ["Mendoza Capital", "San Rafael", "Godoy Cruz", "Guaymallén"],
  "Misiones": ["Posadas", "Puerto Iguazú", "Oberá", "Eldorado"],
  "Neuquén": ["Neuquén Capital", "San Martín de los Andes", "Cutral Có", "Plottier"],
  "Río Negro": ["Bariloche", "General Roca", "Cipolletti", "Viedma"],
  "Salta": ["Salta Capital", "San Ramón de la Nueva Orán", "Tartagal"],
  "San Juan": ["San Juan Capital", "Rawson", "Rivadavia"],
  "San Luis": ["San Luis Capital", "Villa Mercedes"],
  "Santa Cruz": ["Río Gallegos", "Caleta Olivia", "El Calafate"],
  "Santa Fe": ["Rosario", "Santa Fe Capital", "Rafaela", "Venado Tuerto"],
  "Santiago del Estero": ["Santiago del Estero Capital", "La Banda", "Termas de Río Hondo"],
  "Tierra del Fuego": ["Ushuaia", "Río Grande"],
  "Tucumán": ["San Miguel de Tucumán", "Tafí Viejo", "Concepción"]
};

// Los 48 barrios oficiales de CABA
const barriosCABA = [
  "Agronomía", "Almagro", "Balvanera", "Barracas", "Belgrano", "Boedo", "Caballito", 
  "Chacarita", "Coghlan", "Colegiales", "Constitución", "Flores", "Floresta", "La Boca", 
  "La Paternal", "Liniers", "Mataderos", "Monte Castro", "Montserrat", "Nueva Pompeya", 
  "Núñez", "Palermo", "Parque Avellaneda", "Parque Chacabuco", "Parque Chas", "Parque Patricios", 
  "Puerto Madero", "Recoleta", "Retiro", "Saavedra", "San Cristóbal", "San Nicolás", 
  "San Telmo", "Vélez Sársfield", "Versalles", "Villa Crespo", "Villa del Parque", 
  "Villa Devoto", "Villa General Mitre", "Villa Lugano", "Villa Luro", "Villa Ortúzar", 
  "Villa Pueyrredón", "Villa Real", "Villa Riachuelo", "Villa Santa Rita", "Villa Soldati", "Yrigoyen"
];

// Función para actualizar Localidades y Barrios dinámicamente según lo solicitado
function actualizarLocalidadesYBarrios() {
  const provinciaSelect = document.getElementById('select-provincia');
  const localidadSelect = document.getElementById('select-localidad');
  const barrioSelect = document.getElementById('select-barrio');
  
  const provinciaSeleccionada = provinciaSelect.value;

  // Limpiar selects dependientes
  localidadSelect.innerHTML = '<option value="">Seleccionar Localidad</option>';
  barrioSelect.innerHTML = '<option value="">Seleccionar Barrio / Zona</option>';

  if (!provinciaSeleccionada) return;

  // 1. Cargar Localidades de la provincia elegida
  const localidades = localidadesPorProvincia[provinciaSeleccionada] || [];
  localidades.forEach(loc => {
    const opt = document.createElement('option');
    opt.value = loc;
    opt.textContent = loc;
    localidadSelect.appendChild(opt);
  });

  // 2. Lógica para el campo BARRIO según la regla indicada:
  // "si la opcion es la provincia repetir provincia. si la opcion es CABA , poner todos los barrios de CABA."
  if (provinciaSeleccionada === "CABA") {
    barriosCABA.forEach(barrio => {
      const opt = document.createElement('option');
      opt.value = barrio;
      opt.textContent = barrio;
      barrioSelect.appendChild(opt);
    });
  } else {
    // Repetir el nombre de la provincia
    const opt = document.createElement('option');
    opt.value = provinciaSeleccionada;
    opt.textContent = provinciaSeleccionada;
    barrioSelect.appendChild(opt);
    barrioSelect.value = provinciaSeleccionada; // Opcional: dejarlo seleccionado por defecto
  }
}

// Validación de Registro
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

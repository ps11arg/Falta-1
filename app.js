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
    const card = destino.querySelector('.card');
    if (card) card.scrollTop = 0;
  }
}

// Secuencia automática inicial de los 12 segundos del Splash
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

// Base de datos de Localidades por Provincia Argentina
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

// Barrios oficiales de CABA
const barriosCABA = [
  "Agronomía", "Almagro", "Balvanera", "Barracas", "Belgrano", "Boedo", "Caballito", 
  "Chacarita", "Coghlan", "Colegiales", "Constitución", "Flores", "Floresta", "La Boca", 
  "La Paternal", "Liniers", "Mataderos", "Monte Castro", "Montserrat", "Nueva Pompeya", 
  "Núñez", "Palermo", "Parque Avellaneda", "Parque Chacabuco", "Parque Chas", "Parque Patricios", 
  "Puerto Madero", "Recoleta", "Retiro", "Saavedra", "San Cristóbal", "San Nicolás", 
  "San Telmo", "Vélez Sársfield", "Versalles", "Villa Crespo", "Villa del Parque", 
  "Villa Devoto", "Villa General Mitre", "Villa Lugano", "Villa Luro", "Villa Ortúzar", 
  "Villa Pueyrredón", "Villa Real", "Villa Riachuelo", "Villa Santa Rita", "Villa Soldati"
];

// Función para actualizar Localidades y Barrios dinámicamente
function actualizarLocalidadesYBarrios() {
  const provinciaSelect = document.getElementById('select-provincia');
  const localidadSelect = document.getElementById('select-localidad');
  const barrioSelect = document.getElementById('select-barrio');
  
  if (!provinciaSelect || !localidadSelect || !barrioSelect) return;

  const provinciaSeleccionada = provinciaSelect.value;

  // Limpiar selects dependientes
  localidadSelect.innerHTML = '<option value="">Seleccionar Localidad</option>';
  barrioSelect.innerHTML = '<option value="">Seleccionar Barrio / Zona</option>';

  if (!provinciaSeleccionada) return;

  // 1. Cargar Localidades
  const localidades = localidadesPorProvincia[provinciaSeleccionada] || [];
  localidades.forEach(loc => {
    const opt = document.createElement('option');
    opt.value = loc;
    opt.textContent = loc;
    localidadSelect.appendChild(opt);
  });

  // 2. Cargar Barrios (Si es CABA, lista de barrios; si es otra provincia, repite la provincia)
  if (provinciaSeleccionada === "CABA") {
    barriosCABA.forEach(barrio => {
      const opt = document.createElement('option');
      opt.value = barrio;
      opt.textContent = barrio;
      barrioSelect.appendChild(opt);
    });
  } else {
    const opt = document.createElement('option');
    opt.value = provinciaSeleccionada;
    opt.textContent = provinciaSeleccionada;
    barrioSelect.appendChild(opt);
    barrioSelect.value = provinciaSeleccionada;
  }
}

// Validación de Registro
function validarRegistro() {
  const p1 = document.getElementById('reg-pass');
  const p2 = document.getElementById('reg-pass2');

  if (!p1 || !p2) return;

  if (!p1.value || !p2.value) {
    alert("Por favor completa las contraseñas.");
    return;
  }

  if (p1.value !== p2.value) {
    alert("Las contraseñas no coinciden. Verificalas.");
    return;
  }
  
  alert("¡Cuenta creada con éxito!");
  irA('pantalla-home');
}

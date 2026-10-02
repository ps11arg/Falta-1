// Configuración de Supabase para Falta 1
const SUPABASE_URL = 'https://bagbocjuulqmdbejnnwf.supabase.co';
// Reemplazá este texto con la clave completa que copiaste de Supabase
const SUPABASE_ANON_KEY = 'sb_publishable_plK7X2Gjv9e3jG2Fi';

// Inicializar el cliente de Supabase
const _supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Elementos del DOM
const matchForm = document.getElementById('match-form');
const matchesList = document.getElementById('matches-list');

// Cargar la lista al iniciar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  fetchMatches();

  if (matchForm) {
    matchForm.addEventListener('submit', handleFormSubmit);
  }
});

// Obtener los partidos desde la base de datos Supabase
async function fetchMatches() {
  if (!_supabase) {
    console.error('Supabase no está configurado correctamente.');
    return;
  }

  if (matchesList) {
    matchesList.innerHTML = '<p class="loading">Cargando partidos...</p>';
  }

  const { data: matches, error } = await _supabase
    .from('matches')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al traer los partidos:', error.message);
    if (matchesList) {
      matchesList.innerHTML = '<p class="error-msg">Error al cargar los partidos.</p>';
    }
    return;
  }

  renderMatches(matches);
}

// Renderizar las tarjetas de partidos en la página
function renderMatches(matches) {
  if (!matchesList) return;

  if (!matches || matches.length === 0) {
    matchesList.innerHTML = '<p class="no-matches">No hay partidos publicados aún. ¡Sé el primero en crear uno!</p>';
    return;
  }

  matchesList.innerHTML = '';

  matches.forEach(match => {
    const card = document.createElement('div');
    card.className = 'match-card';

    // Formatear la fecha
    const matchDate = new Date(match.date_time);
    const dateFormatted = matchDate.toLocaleDateString('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });

    card.innerHTML = `
      <div class="match-header">
        <h3>⚽ ${escapeHtml(match.sport)}</h3>
        <span class="badge">${match.players_needed} ${match.players_needed === 1 ? 'jugador' : 'jugadores'}</span>
      </div>
      <div class="match-body">
        <p><strong>📍 Cancha / Zona:</strong> ${escapeHtml(match.location)}</p>
        <p><strong>📅 Día y Hora:</strong> ${dateFormatted}</p>
        <p><strong>📞 Contacto:</strong> <a href="https://wa.me/${escapeHtml(match.contact.replace(/\D/g, ''))}" target="_blank" rel="noopener noreferrer">${escapeHtml(match.contact)}</a></p>
      </div>
    `;

    matchesList.appendChild(card);
  });
}

// Guardar un nuevo partido en Supabase
async function handleFormSubmit(e) {
  e.preventDefault();

  const sport = document.getElementById('sport')?.value.trim();
  const location = document.getElementById('location')?.value.trim();
  const dateTime = document.getElementById('date-time')?.value;
  const playersNeeded = parseInt(document.getElementById('players-needed')?.value, 10);
  const contact = document.getElementById('contact')?.value.trim();

  if (!_supabase) {
    alert('No hay conexión con la base de datos.');
    return;
  }

  const newMatch = {
    sport: sport,
    location: location,
    date_time: dateTime,
    players_needed: playersNeeded,
    contact: contact
  };

  const { error } = await _supabase
    .from('matches')
    .insert([newMatch]);

  if (error) {
    console.error('Error al guardar:', error.message);
    alert('Error al publicar el partido: ' + error.message);
  } else {
    alert('¡Partido publicado exitosamente!');
    matchForm.reset();
    fetchMatches();
  }
}

// Función auxiliar para evitar inyección HTML
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
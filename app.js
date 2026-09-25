JavaScript
// Configuración de Supabase
const SUPABASE_URL = 'https://bagbocjuulqmdbejnnwf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pIK7X2Gjv9e3jG2Fnooqfw_sOalXYVS'; 

// Inicializar cliente de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Elementos del DOM
const listaPartidos = document.getElementById('lista-partidos');

// Función para obtener y mostrar partidos
async function cargarPartidos() {
    try {
        const { data: partidos, error } = await supabase
            .from('partidos')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        if (!partidos || partidos.length === 0) {
            listaPartidos.innerHTML = '<p class="loading-text">No hay partidos publicados por el momento. ¡Sé el primero en crear uno!</p>';
            return;
        }

        listaPartidos.innerHTML = partidos.map(partido => `
            <div class="partido-card">
                <h3>${partido.title || 'Partido sin título'}</h3>
                <p class="partido-info">🏆 <strong>Deporte:</strong> ${partido.sport || 'No especificado'}</p>
                <p class="partido-info">📍 <strong>Ubicación:</strong> ${partido.location || 'A convenir'}</p>
                <p class="partido-info">📅 <strong>Fecha/Hora:</strong> ${partido.date_time || 'A definir'}</p>
                <p class="partido-info">👥 <strong>Faltan:</strong> ${partido.players_needed || 1} jugador(es)</p>
            </div>
        `).join('');

    } catch (err) {
        console.error('Error al cargar partidos:', err.message);
        listaPartidos.innerHTML = '<p class="loading-text">Error al cargar los partidos. Verifica la configuración de la base de datos.</p>';
    }
}

// Cargar partidos al iniciar la aplicación
document.addEventListener('DOMContentLoaded', cargarPartidos);

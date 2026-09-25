const SUPABASE_URL = 'https://bagbocjuulqmdbejnnwf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pIK7X2Gjv9e3jG2Fnooqfw_sOalXYVS';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Elementos del DOM
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const registerFields = document.getElementById('register-fields');
const btnAuthSubmit = document.getElementById('btn-auth-submit');
const toggleAuthBtn = document.getElementById('toggle-auth-btn');
const toggleText = document.getElementById('toggle-text');
const btnLogout = document.getElementById('btn-logout');
const userDisplayName = document.getElementById('user-display-name');
const listaPartidos = document.getElementById('lista-partidos');

let isRegisterMode = false;

// Alternar entre Iniciar Sesión y Registro
toggleAuthBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isRegisterMode = !isRegisterMode;
    if (isRegisterMode) {
        authTitle.textContent = 'Crear Cuenta';
        btnAuthSubmit.textContent = 'Registrarse';
        registerFields.classList.remove('hidden');
        toggleText.textContent = '¿Ya tenés cuenta?';
        toggleAuthBtn.textContent = 'Ingresá acá';
    } else {
        authTitle.textContent = 'Iniciar Sesión';
        btnAuthSubmit.textContent = 'Ingresar';
        registerFields.classList.add('hidden');
        toggleText.textContent = '¿No tenés cuenta?';
        toggleAuthBtn.textContent = 'Registrate acá';
    }
});

// Manejo de Formulario (Login / Registro)
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (isRegisterMode) {
        const fullName = document.getElementById('full-name').value;
        const position = document.getElementById('position').value;
        const zone = document.getElementById('zone').value;

        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return alert('Error al registrarse: ' + error.message);

        if (data.user) {
            await supabase.from('profiles').insert([
                { id: data.user.id, full_name: fullName, position: position, zone: zone }
            ]);
            alert('¡Registro exitoso! Ya podés ingresar.');
            location.reload();
        }
    } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return alert('Error al ingresar: ' + error.message);
        checkUser();
    }
});

// Cerrar sesión
btnLogout.addEventListener('click', async () => {
    await supabase.auth.signOut();
    location.reload();
});

// Verificar sesión de usuario
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        authSection.classList.add('hidden');
        appSection.classList.remove('hidden');
        btnLogout.classList.remove('hidden');

        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();

        if (profile && profile.full_name) {
            userDisplayName.textContent = profile.full_name;
        }

        cargarPartidos();
    } else {
        authSection.classList.remove('hidden');
        appSection.classList.add('hidden');
        btnLogout.classList.add('hidden');
    }
}

// Helper para badges de deportes
function getDeporteBadge(deporte) {
    const dep = (deporte || '').toLowerCase();
    if (dep.includes('fútbol') || dep.includes('futbol')) {
        return '<span class="badge badge-futbol">⚽ Fútbol</span>';
    } else if (dep.includes('vóley') || dep.includes('voley')) {
        return '<span class="badge badge-voley">🏐 Vóley</span>';
    } else if (dep.includes('básquet') || dep.includes('basquet')) {
        return '<span class="badge badge-basquet">🏀 Básquet</span>';
    } else if (dep.includes('handball')) {
        return '<span class="badge badge-handball">🤾 Handball</span>';
    } else if (dep.includes('pádel') || dep.includes('padel')) {
        return '<span class="badge badge-padel">🎾 Pádel</span>';
    }
    return '<span class="badge badge-default">🏆 Deporte</span>';
}

// Cargar partidos
async function cargarPartidos() {
    const { data: partidos, error } = await supabase.from('partidos').select('*').order('id', { ascending: false });
    if (error || !partidos || partidos.length === 0) {
        listaPartidos.innerHTML = '<p class="loading-text">No hay partidos disponibles actualmente.</p>';
        return;
    }

    listaPartidos.innerHTML = partidos.map(p => `
        <div class="partido-card">
            <div class="partido-header">
                <h3>${p.title || 'Partido Amateur'}</h3>
                ${getDeporteBadge(p.sport)}
            </div>
            <p class="partido-info">📍 <strong>Ubicación:</strong> ${p.location || 'A convenir'}</p>
            <p class="partido-info">📅 <strong>Fecha/Hora:</strong> ${p.date_time || 'A definir'}</p>
            <div class="partido-footer">
                <span class="players-needed">⚡ Faltan <strong>${p.players_needed || 1}</strong> jugador(es)</span>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', checkUser);

const SUPABASE_URL = 'https://bagbocjuulqmdbejnnwf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pIK7X2Gjv9e3jG2Fnooqfw_sOalXYVS';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Referencias de pantallas
const screenWelcome = document.getElementById('screen-welcome');
const screenAccessChoice = document.getElementById('screen-access-choice');
const screenLogin = document.getElementById('screen-login');
const screenRegister = document.getElementById('screen-register');
const screenHome = document.getElementById('screen-home');
const screenCreateMatch = document.getElementById('screen-create-match');

// Función central para cambiar de pantalla
function showScreen(screenToShow) {
    const screens = [screenWelcome, screenAccessChoice, screenLogin, screenRegister, screenHome, screenCreateMatch];
    screens.forEach(screen => {
        if (screen === screenToShow) {
            screen.classList.remove('hidden-screen');
            screen.classList.add('active-screen');
        } else {
            screen.classList.add('hidden-screen');
            screen.classList.remove('active-screen');
        }
    });
}

// PANTALLA 1: Transición automática tras 3 segundos
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        checkUserSession();
    }, 3000);
});

// Verificar si el usuario ya tiene sesión iniciada
async function checkUserSession() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        cargarPerfilYHome(user);
    } else {
        showScreen(screenAccessChoice);
    }
}

// Navegación desde Pantalla 2
document.getElementById('btn-goto-login').addEventListener('click', () => {
    showScreen(screenLogin);
});

document.getElementById('btn-goto-register').addEventListener('click', () => {
    showScreen(screenRegister);
});

// Navegación a Pantalla 5 (Crear Partido)
document.getElementById('btn-goto-create-match').addEventListener('click', () => {
    showScreen(screenCreateMatch);
});

// Volver al Home
document.querySelectorAll('.btn-back-home').forEach(btn => {
    btn.addEventListener('click', () => {
        showScreen(screenHome);
    });
});

// Volver a Pantalla 2 (Elección de Acceso)
document.querySelectorAll('.btn-back-choice').forEach(btn => {
    btn.addEventListener('click', () => {
        showScreen(screenAccessChoice);
    });
});

// PANTALLA 3A: Iniciar Sesión
document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = document.getElementById('login-user').value.trim();
    const password = document.getElementById('login-password').value;

    let email = userInput;

    if (!userInput.includes('@')) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('username', userInput)
            .single();

        if (profile && profile.email) {
            email = profile.email;
        }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert('Error al ingresar: ' + error.message);

    cargarPerfilYHome(data.user);
});

// PANTALLA 3B: Registro completo con validación de coincidencia de contraseñas
document.getElementById('form-register').addEventListener('submit', async (e) => {
    e.preventDefault();

    const apodo = document.getElementById('reg-apodo').value.trim();
    const nombre = document.getElementById('reg-nombre').value.trim();
    const apellido = document.getElementById('reg-apellido').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;
    const edad = parseInt(document.getElementById('reg-edad').value);
    const localidad = document.getElementById('reg-localidad').value.trim();
    const barrio = document.getElementById('reg-barrio').value.trim();

    // Verificación de coincidencia de contraseñas
    if (password !== passwordConfirm) {
        alert('⚠️ Las contraseñas ingresadas no coinciden. Por favor, verificá que ambas sean iguales.');
        return;
    }

    // 1. Crear usuario en autenticación de Supabase
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return alert('Error al crear la cuenta: ' + error.message);

    if (data.user) {
        // 2. Guardar perfil completo en 'profiles'
        const { error: profileError } = await supabase.from('profiles').insert([
            {
                id: data.user.id,
                apodo: apodo,
                full_name: `${nombre} ${apellido}`,
                first_name: nombre,
                last_name: apellido,
                email: email,
                username: username,
                edad: edad,
                localidad: localidad,
                zone: barrio
            }
        ]);

        if (profileError) {
            console.error(profileError);
            alert('Cuenta creada, pero ocurrió un problema guardando los datos del perfil.');
        } else {
            alert('¡Cuenta creada exitosamente!');
        }

        cargarPerfilYHome(data.user);
    }
});

// PANTALLA 5: Publicar Partido
document.getElementById('form-create-match').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('match-title').value.trim();
    const sport = document.getElementById('match-sport').value;
    const location = document.getElementById('match-location').value.trim();
    const dateTime = document.getElementById('match-date').value.trim();
    const needed = parseInt(document.getElementById('match-needed').value);
    const price = parseFloat(document.getElementById('match-price').value);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('partidos').insert([
        {
            title: title,
            sport: sport,
            location: location,
            date_time: dateTime,
            players_needed: needed,
            price: price,
            organizer_id: user ? user.id : null
        }
    ]);

    if (error) {
        alert('Error al publicar el partido: ' + error.message);
    } else {
        alert('¡Partido publicado con éxito!');
        document.getElementById('form-create-match').reset();
        showScreen(screenHome);
        cargarPartidos();
    }
});

// PANTALLA 4: Cargar perfil y Home
async function cargarPerfilYHome(user) {
    showScreen(screenHome);

    const { data: profile } = await supabase
        .from('profiles')
        .select('apodo')
        .eq('id', user.id)
        .single();

    if (profile && profile.apodo) {
        document.getElementById('user-display-apodo').textContent = profile.apodo;
    }

    cargarPartidos();
}

// Cargar Partidos en Home
async function cargarPartidos() {
    const listaPartidos = document.getElementById('lista-partidos');
    const { data: partidos, error } = await supabase.from('partidos').select('*').order('id', { ascending: false });

    if (error || !partidos || partidos.length === 0) {
        listaPartidos.innerHTML = '<p class="loading-text">No hay partidos disponibles actualmente.</p>';
        return;
    }

    listaPartidos.innerHTML = partidos.map(p => `
        <div class="partido-card">
            <div class="partido-header">
                <h3>${p.title || 'Partido Amateur'}</h3>
            </div>
            <p class="partido-info">⚽ <strong>Deporte:</strong> ${p.sport || 'Varios'}</p>
            <p class="partido-info">📍 <strong>Ubicación:</strong> ${p.location || 'A convenir'}</p>
            <p class="partido-info">📅 <strong>Fecha/Hora:</strong> ${p.date_time || 'A definir'}</p>
            <p class="partido-info">💰 <strong>Reserva por jugador:</strong> <span class="price-tag">$${p.price || 0}</span></p>
            <p class="partido-info">⚡ Faltan <strong>${p.players_needed || 1}</strong> jugador(es)</p>
        </div>
    `).join('');
}

// Cerrar sesión
document.getElementById('btn-logout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    showScreen(screenAccessChoice);
});

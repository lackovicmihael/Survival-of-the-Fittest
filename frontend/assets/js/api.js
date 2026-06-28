const API_BASE = 'http://127.0.0.1:8000/api';

function getSession() {
    const raw = localStorage.getItem('fitHubSession');
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch (error) {
        localStorage.removeItem('fitHubSession');
        return null;
    }
}

function saveSession(session) {
    localStorage.setItem('fitHubSession', JSON.stringify(session));
}

function clearSession() {
    localStorage.removeItem('fitHubSession');
}

function isLoggedIn() {
    const session = getSession();
    return Boolean(session && session.token && session.user);
}

async function apiRequest(path, options = {}) {
    const session = getSession();
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (options.auth && session?.token) {
        headers.Authorization = `Bearer ${session.token}`;
    }

    const config = {
        method: options.method || 'GET',
        headers,
    };

    if (options.body) {
        config.body = JSON.stringify(options.body);
    }

    let response;
    try {
        response = await fetch(`${API_BASE}${path}`, config);
    } catch (error) {
        throw { error: 'Backend nije dostupan. Provjeri je li Django server pokrenut.' };
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw data || { error: 'Dogodila se greška.' };
    }

    return data;
}

function showAlert(containerId, message, type = 'danger') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

function formatApiError(error) {
    if (error?.errors) {
        return Object.values(error.errors).join('<br>');
    }
    return error?.error || error?.message || 'Dogodila se greška.';
}

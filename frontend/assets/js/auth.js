function updateNavbar() {
    const loggedIn = isLoggedIn();
    const session = getSession();

    document.querySelectorAll('[data-guest]').forEach((item) => {
        item.classList.toggle('d-none', loggedIn);
    });

    document.querySelectorAll('[data-auth]').forEach((item) => {
        item.classList.toggle('d-none', !loggedIn);
    });

    const userLabel = document.getElementById('navUserLabel');
    if (userLabel && session?.user?.username) {
        userLabel.textContent = session.user.username;
    }
}

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

function setupLogout() {
    const logoutButton = document.getElementById('logoutButton');
    if (!logoutButton) return;

    logoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        clearSession();
        window.location.href = 'index.html';
    });
}

function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showAlert('authAlert', 'Email i lozinka su obavezni.');
            return;
        }

        try {
            const data = await apiRequest('/login', {
                method: 'POST',
                body: { email, password },
            });
            saveSession({ token: data.token, user: data.user });
            window.location.href = 'profile.html';
        } catch (error) {
            showAlert('authAlert', formatApiError(error));
        }
    });
}

function setupRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (username.length < 3) {
            showAlert('authAlert', 'Korisničko ime mora imati najmanje 3 znaka.');
            return;
        }

        if (!email.includes('@')) {
            showAlert('authAlert', 'Unesi ispravnu email adresu.');
            return;
        }

        if (password.length < 6) {
            showAlert('authAlert', 'Lozinka mora imati najmanje 6 znakova.');
            return;
        }

        if (password !== confirmPassword) {
            showAlert('authAlert', 'Lozinke se ne podudaraju.');
            return;
        }

        try {
            const data = await apiRequest('/register', {
                method: 'POST',
                body: { username, email, password, confirmPassword },
            });
            saveSession({ token: data.token, user: data.user });
            window.location.href = 'profile.html';
        } catch (error) {
            showAlert('authAlert', formatApiError(error));
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    setupLogout();
    setupLoginForm();
    setupRegisterForm();
});

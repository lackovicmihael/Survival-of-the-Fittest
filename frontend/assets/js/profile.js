function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    return date.toLocaleString('hr-HR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

async function loadProfile() {
    requireAuth();

    const profileContainer = document.getElementById('profileContent');
    const submissionsContainer = document.getElementById('mySubmissions');

    try {
        const profileData = await apiRequest('/profile', { auth: true });
        const { user, completedCount, submissionCount } = profileData;

        profileContainer.innerHTML = `
            <div class="row g-3">
                <div class="col-md-4">
                    <div class="stat-card">
                        <span>Korisnik</span>
                        <strong>${user.username}</strong>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="stat-card">
                        <span>Ukupni bodovi</span>
                        <strong>${user.points}</strong>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="stat-card">
                        <span>Završeni izazovi</span>
                        <strong>${completedCount}</strong>
                    </div>
                </div>
            </div>
            <div class="card mt-4 form-card">
                <div class="card-body">
                    <h2 class="h5">Podaci profila</h2>
                    <p class="mb-1"><strong>Email:</strong> ${user.email}</p>
                    <p class="mb-0"><strong>Broj poslanih rezultata:</strong> ${submissionCount}</p>
                </div>
            </div>
        `;
    } catch (error) {
        profileContainer.innerHTML = `<p class="text-danger">${formatApiError(error)}</p>`;
        return;
    }

    try {
        const submissionsData = await apiRequest('/my-submissions', { auth: true });
        if (!submissionsData.submissions.length) {
            submissionsContainer.innerHTML = '<p class="text-muted">Još nema poslanih rezultata.</p>';
            return;
        }

        submissionsContainer.innerHTML = submissionsData.submissions.map((item) => `
            <div class="card submission-card mb-3">
                <div class="card-body d-flex flex-column flex-md-row justify-content-between gap-3">
                    <div>
                        <h3 class="h6 mb-1">${item.challengeTitle || item.challengeId}</h3>
                        <p class="text-muted small mb-0">${formatDate(item.date)}</p>
                    </div>
                    <div class="text-md-end">
                        <div><strong>${item.result}</strong> ${item.unit || ''}</div>
                        <span class="badge text-bg-${item.completed ? 'success' : 'secondary'}">
                            ${item.completed ? 'Completed' : 'Not completed'}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        submissionsContainer.innerHTML = `<p class="text-danger">${formatApiError(error)}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadProfile);

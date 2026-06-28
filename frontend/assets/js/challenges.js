let allChallenges = [];

function difficultyBadge(difficulty) {
    if (difficulty === 'Easy') return 'success';
    if (difficulty === 'Medium') return 'warning';
    return 'danger';
}

function renderChallenges(category = 'All') {
    const grid = document.getElementById('challengesGrid');
    const filtered = category === 'All'
        ? allChallenges
        : allChallenges.filter((challenge) => challenge.category === category);

    if (!filtered.length) {
        grid.innerHTML = '<p class="text-muted">Nema izazova za odabrani filter.</p>';
        return;
    }

    grid.innerHTML = filtered.map((challenge) => `
        <div class="col-sm-6 col-lg-4">
            <article class="card challenge-card h-100">
                <img src="${challenge.image}" class="card-img-top" alt="${challenge.title}">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex gap-2 mb-2">
                        <span class="badge text-bg-light fit-badge">${challenge.category}</span>
                        <span class="badge text-bg-${difficultyBadge(challenge.difficulty)}">${challenge.difficulty}</span>
                    </div>
                    <h2 class="h5">${challenge.title}</h2>
                    <p class="text-muted small flex-grow-1">${challenge.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="fw-semibold"><i class="bi bi-lightning-charge-fill text-primary"></i> ${challenge.points} bodova</span>
                        <a href="challenge-detail.html?id=${challenge.id}" class="btn btn-outline-primary btn-sm">Otvori</a>
                    </div>
                </div>
            </article>
        </div>
    `).join('');
}

function setupFilters() {
    document.querySelectorAll('[data-filter]').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            renderChallenges(button.dataset.filter);
        });
    });
}

async function loadChallenges() {
    const grid = document.getElementById('challengesGrid');
    try {
        const data = await apiRequest('/challenges');
        allChallenges = data.challenges;
        renderChallenges();
    } catch (error) {
        grid.innerHTML = `<p class="text-danger">${formatApiError(error)}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupFilters();
    loadChallenges();
});

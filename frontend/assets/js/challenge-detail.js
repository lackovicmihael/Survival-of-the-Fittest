let currentChallenge = null;

function getChallengeId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function difficultyClass(difficulty) {
    if (difficulty === 'Easy') return 'success';
    if (difficulty === 'Medium') return 'warning';
    return 'danger';
}

function renderChallenge(challenge) {
    const container = document.getElementById('challengeDetail');
    container.innerHTML = `
        <div class="row g-4 align-items-start">
            <div class="col-lg-6">
                <img src="${challenge.image}" class="detail-image" alt="${challenge.title}">
            </div>
            <div class="col-lg-6">
                <span class="badge text-bg-light fit-badge mb-2">${challenge.category}</span>
                <h1 class="display-6 fw-bold">${challenge.title}</h1>
                <p class="lead text-muted">${challenge.description}</p>
                <div class="row g-3 my-3">
                    <div class="col-6">
                        <div class="stat-card small-stat">
                            <span>Težina</span>
                            <strong class="text-${difficultyClass(challenge.difficulty)}">${challenge.difficulty}</strong>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="stat-card small-stat">
                            <span>Bodovi</span>
                            <strong>${challenge.points}</strong>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="stat-card small-stat">
                            <span>Cilj</span>
                            <strong>${challenge.target} ${challenge.unit}</strong>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="stat-card small-stat">
                            <span>Kategorija</span>
                            <strong>${challenge.category}</strong>
                        </div>
                    </div>
                </div>
                <div class="card form-card">
                    <div class="card-body">
                        <h2 class="h5 mb-3">Unesi rezultat</h2>
                        <div id="submitAlert"></div>
                        <form id="submissionForm" novalidate>
                            <label for="result" class="form-label">Rezultat (${challenge.unit})</label>
                            <input type="number" step="0.1" min="0" id="result" class="form-control" required>
                            <button type="submit" class="btn btn-primary w-100 mt-3">Submit Result</button>
                        </form>
                        <p class="text-muted small mt-3 mb-0">Za uspješan završetak trebaš unijeti najmanje ${challenge.target} ${challenge.unit}.</p>
                    </div>
                </div>
            </div>
        </div>
        <section class="mt-5">
            <h2 class="h4 fw-bold mb-3">Video upute</h2>
            <div class="ratio ratio-16x9 video-card">
                <iframe src="${challenge.video}" title="${challenge.title} video" allowfullscreen></iframe>
            </div>
        </section>
    `;

    setupSubmissionForm();
}

function setupSubmissionForm() {
    const form = document.getElementById('submissionForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!isLoggedIn()) {
            showAlert('submitAlert', 'Za slanje rezultata moraš se prijaviti.', 'warning');
            return;
        }

        const result = Number(document.getElementById('result').value);
        if (!result || result < 0) {
            showAlert('submitAlert', 'Rezultat mora biti pozitivan broj.');
            return;
        }

        try {
            const data = await apiRequest('/submissions', {
                method: 'POST',
                auth: true,
                body: {
                    challengeId: currentChallenge.id,
                    result,
                },
            });

            const message = data.completed
                ? `Izazov je završen. Osvojeno bodova: ${data.awardedPoints}.`
                : `Rezultat je spremljen, ali cilj još nije dosegnut.`;

            showAlert('submitAlert', message, data.completed ? 'success' : 'info');
        } catch (error) {
            showAlert('submitAlert', formatApiError(error));
        }
    });
}

async function loadChallengeDetail() {
    const container = document.getElementById('challengeDetail');
    const id = getChallengeId();

    if (!id) {
        container.innerHTML = '<p class="text-danger">ID izazova nije pronađen u URL-u.</p>';
        return;
    }

    try {
        const data = await apiRequest(`/challenges/${id}`);
        currentChallenge = data.challenge;
        renderChallenge(currentChallenge);
    } catch (error) {
        container.innerHTML = `<p class="text-danger">${formatApiError(error)}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadChallengeDetail);

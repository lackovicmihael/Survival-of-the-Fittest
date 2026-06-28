async function loadHomeData() {
    const topChallengesContainer = document.getElementById('topChallenges');
    const topUsersContainer = document.getElementById('topUsers');

    try {
        const challengesData = await apiRequest('/challenges');
        const topChallenges = challengesData.challenges
            .sort((a, b) => Number(b.points) - Number(a.points))
            .slice(0, 3);

        topChallengesContainer.innerHTML = topChallenges.map((challenge) => `
            <div class="col-md-4">
                <article class="card challenge-card h-100">
                    <img src="${challenge.image}" class="card-img-top" alt="${challenge.title}">
                    <div class="card-body d-flex flex-column">
                        <span class="badge text-bg-light fit-badge mb-2 align-self-start">${challenge.category}</span>
                        <h3 class="h5">${challenge.title}</h3>
                        <p class="text-muted small flex-grow-1">${challenge.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="fw-semibold">${challenge.points} bodova</span>
                            <a href="challenge-detail.html?id=${challenge.id}" class="btn btn-sm btn-primary">Detalji</a>
                        </div>
                    </div>
                </article>
            </div>
        `).join('');
    } catch (error) {
        topChallengesContainer.innerHTML = `<p class="text-danger">${formatApiError(error)}</p>`;
    }

    try {
        const leaderboardData = await apiRequest('/leaderboard');
        const users = leaderboardData.leaderboard.slice(0, 5);

        if (!users.length) {
            topUsersContainer.innerHTML = '<p class="text-muted mb-0">Leaderboard je trenutno prazan.</p>';
            return;
        }

        topUsersContainer.innerHTML = users.map((user) => `
            <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                <div>
                    <span class="badge rounded-pill text-bg-primary me-2">${user.rank}</span>
                    <strong>${user.username}</strong>
                </div>
                <span>${user.points} bodova</span>
            </div>
        `).join('');
    } catch (error) {
        topUsersContainer.innerHTML = `<p class="text-danger mb-0">${formatApiError(error)}</p>`;
    }
}

function setupBmiCalculator() {
    const form = document.getElementById('bmiForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const height = Number(document.getElementById('height').value);
        const weight = Number(document.getElementById('weight').value);
        const result = document.getElementById('bmiResult');

        if (!height || !weight || height <= 0 || weight <= 0) {
            result.innerHTML = '<div class="alert alert-danger">Unesi ispravnu visinu i težinu.</div>';
            return;
        }

        try {
            const data = await apiRequest('/bmi', {
                method: 'POST',
                body: { height, weight },
            });
            result.innerHTML = `
                <div class="result-panel">
                    <div class="display-6 fw-bold">${data.bmi}</div>
                    <div class="text-muted">${data.category}</div>
                </div>
            `;
        } catch (error) {
            result.innerHTML = `<div class="alert alert-danger">${formatApiError(error)}</div>`;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadHomeData();
    setupBmiCalculator();
});

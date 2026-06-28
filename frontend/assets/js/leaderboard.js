async function loadLeaderboard() {
    const body = document.getElementById('leaderboardBody');

    try {
        const data = await apiRequest('/leaderboard');
        if (!data.leaderboard.length) {
            body.innerHTML = '<tr><td colspan="3" class="text-muted">Nema korisnika za prikaz.</td></tr>';
            return;
        }

        body.innerHTML = data.leaderboard.map((user) => `
            <tr>
                <td class="fw-bold">#${user.rank}</td>
                <td>${user.username}</td>
                <td>${user.points}</td>
            </tr>
        `).join('');
    } catch (error) {
        body.innerHTML = `<tr><td colspan="3" class="text-danger">${formatApiError(error)}</td></tr>`;
    }
}

document.addEventListener('DOMContentLoaded', loadLeaderboard);

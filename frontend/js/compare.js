async function searchPlayers(query, slotNumber) {

    try {
        // Guard to prevent every keystroke spamming the api
        if (!query || query.length < 2) {
            document.getElementById(`dropdown-${slotNumber}`).innerHTML = "";
            return;
        }
        
        const url = `http://127.0.0.1:5000/api/players/search?q=${query}`;
        const response = await fetch(url);
        const players = await response.json();

        const dropdown = document.getElementById(`dropdown-${slotNumber}`);
        // Clearing my old results
        dropdown.innerHTML = "";
        dropdown.style.display = "block";

        players.forEach(player => {
            const item = document.createElement("div");
            item.classList.add("dropdown-item");
            item.style.borderLeft = `3px solid ${player.teamPrimaryColor}`;

            item.innerHTML = `
                <div class="d-flex align-items-center gap-2">
                    <img src="${player.teamLogo}" width="20" height="20" />
                    <div>
                        <div class="fw-semibold">${player.fullName}</div>
                        <div class="text-muted small">
                            ${player.positionAbbreviation} • ${player.teamName}
                        </div>
                    </div>
                </div>
            `;

            // Click handler
            item.addEventListener("click", () => {
                selectPlayer(slotNumber, player);
            });

            dropdown.appendChild(item);

            });
        }
            catch (err) {
                console.error("Search error:", err);

                
    }
}

document.addEventListener("click", function(e) {
    if (!e.target.closest(".search-box")) {
        document.querySelectorAll(".search-dropdown").forEach(d => d.style.display = "none");
    }
});

async function selectPlayer(slotNumber, player) {
    
    // Hiding the search bar
    document.getElementById(`search-box-${slotNumber}`).style.display = "none";
    document.getElementById(`dropdown-${slotNumber}`).style.display = "none";

    // Fetching the player data
    const response = await fetch(`http://127.0.0.1:5000/api/players/${player.athleteId}`);
    const playerData = await response.json();

    // Fetching the photo from TheSportsDB
    let photoUrl = null;
    try {
        const photoResponse = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(player.fullName)}`);
        const photoData = await photoResponse.json();
        photoUrl = photoData.player?.[0]?.strThumb || null;
    } catch {
        photoUrl = null;
    }

    renderPlayerCard(slotNumber, playerData, photoUrl);

}

function renderPlayerCard(slotNumber, player, photoUrl) {

    const card = document.getElementById(`card-${slotNumber}`);

    card.innerHTML = `
        <div class="profile-card">
            <button class="clear-btn" onclick="clearSlot(${slotNumber})">×</button>
            <div class="profile-photo-wrapper">
                ${photoUrl 
                    ? `<img src="${photoUrl}" class="profile-photo" />`
                    : `<div class="profile-photo-placeholder"><i class="bi bi-person"></i></div>`
                }
            </div>
            <div class="profile-info">
                <div class="profile-name">${player.fullName}</div>
                <div class="profile-team">
                    <img src="${player.teamLogo}" width="18" height="18" />
                    ${player.teamName}
                </div>
                <div class="profile-meta">
                    <span class="position-pill">${player.positionAbbreviation}</span>
                    <span class="profile-age">${Math.floor(player.age)} yrs</span>
                </div>
            </div>
        </div>
    `;

    card.style.display = "block";
}

function clearSlot(slotNumber) {
    document.getElementById(`card-${slotNumber}`).style.display = "none";
    document.getElementById(`card-${slotNumber}`).innerHTML = "";
    document.getElementById(`search-box-${slotNumber}`).style.display = "block";
    document.querySelector(`#search-box-${slotNumber} input`).value = "";
}

document.querySelectorAll(".player-search-input").forEach(input => {
    input.addEventListener("input", (e) => {
        const query = e.target.value;
        const slotNumber = e.target.dataset.slot;

        searchPlayers(query, slotNumber);
    });
});
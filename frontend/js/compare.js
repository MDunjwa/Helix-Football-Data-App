// Switching urls for desktop and codespace
const API_BASE =
    window.location.hostname === '127.0.0.1'
        ? 'http://127.0.0.1:5000'
        : 'https://helix-r4va.onrender.com';

async function searchPlayers(query, slotNumber) {

    try {
        // Guard to prevent every keystroke spamming the api
        if (!query || query.length < 2) {
            document.getElementById(`dropdown-${slotNumber}`).innerHTML = "";
            return;
        }
        
        // Guarding against no selected position
        if (!selectedPosition) return;

        const url = `${API_BASE}/api/players/search?q=${query}&position=${selectedPosition}`;
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

// Where the user selects which position to compare
let selectedPosition = null;

document.querySelectorAll(".position-btn").forEach(btn => {
    btn.addEventListener("click", function() {
        selectedPosition = this.dataset.position;

        document.querySelectorAll(".position-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");

        document.getElementById("player-slots").style.display = "flex";
        // document.getElementById("position-selector").style.display = "none";

        selectedPlayers[1] = null;
        selectedPlayers[2] = null;
        clearSlot(1);
        clearSlot(2);
    });
});

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
    const response = await fetch(`${API_BASE}/api/players/${player.athleteId}`);
    const playerData = await response.json();

    // Storing it 
    selectedPlayers[slotNumber] = playerData;

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
    updateCharts();

}

function renderPlayerCard(slotNumber, player, photoUrl) {

    const card = document.getElementById(`card-${slotNumber}`);

    card.innerHTML = `
        <div class="profile-card" style="--team-color: ${player.teamPrimaryColor}">
            <button class="clear-btn" onclick="clearSlot(${slotNumber})">×</button>
            
            <div class="profile-left">
                <div class="photo-container">
                    ${photoUrl 
                        ? `<img src="${photoUrl}" class="profile-photo" />`
                        : `<div class="profile-photo-placeholder"><i class="bi bi-person"></i></div>`
                    }
                    <img src="${player.teamLogo}" class="team-logo" />
                </div>
            </div>

            <div class="profile-right">

                <div class="profile-name">${player.fullName}</div>
                <div class="profile-team">
                    <span>${player.teamName}</span>
                </div>

                <div class="profile-meta">
                    <span class="profile-age">${formatPosition(player.positionAbbreviation)}</span>
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

function formatPosition(abbr) {
    const map = { F: "Forward", M: "Midfielder", D: "Defender", G: "Goalkeeper" };
    return map[abbr] || abbr;
}

// Storing the selected players' data
const selectedPlayers = { 1: null, 2: null };

// Rendering the charts when both players are selected
function updateCharts() {
    const player_1 = selectedPlayers[1];
    const player_2 = selectedPlayers[2];
    if (!player_1 || !player_2) return; 

    // Checking that positions match
    if (player_1.positionAbbreviation !== player_2.positionAbbreviation) {
         alert("Select two players from the same position to compare.");
         return;
    }

    if (!radarAxes[player_1.positionAbbreviation]) {
        alert("Radar comparison is available for Forwards and Midfielders only")
        return;
    }
    document.getElementById("comparison-layout").style.display = "flex";
    renderComparisonTable(player_1, player_2);
    renderRadarChart(player_1, player_2);
    
}

// The axes of my radars for midfielders and forwards
const radarAxes = {
    F: [
        { key: "goals_pct_pos", label: "Goals" },
        { key: "assists_pct_pos", label: "Assists" },
        { key: "shot_accuracy_pct_pos", label: "Shot Accuracy" },
        { key: "conversion_pct_pos", label: "Conversion Rate" },
        { key: "fouls_suff_pct_pos", label: "Fouls Won" }
    ],
    M: [
        { key: "goals_pct_pos", label: "Goals" },
        { key: "assists_pct_pos", label: "Assists" },
        { key: "chances_created_pct_pos", label: "Chances Created" },
        { key: "fouls_suff_pct_pos", label: "Fouls Won" },
        { key: "fouls_comm_pct_pos", label: "Fouls Com." }
    ]
};

// Rendering the charts
function renderRadarChart(player_1, player_2) {
    const chartDom = document.getElementById("radar-chart");
    const existing = echarts.getInstanceByDom(chartDom);
    if (existing) existing.dispose();
    const chart = echarts.init(chartDom);

    const axes = radarAxes[player_1.positionAbbreviation];

    const indicator = axes.map(a => ({ name: a.label, max: 100 }));
    const player_1_values = axes.map(a => Math.round(player_1[a.key] || 0));
    const player_2_values = axes.map(a => Math.round(player_2[a.key] || 0));

    const option = {
        legend: {
            data: [player_1.fullName, player_2.fullName],
            bottom: 0,
            textStyle: { fontSize: 12, color: "#334155" }
        },
        radar: {
            indicator,
            shape: "polygon",
            splitNumber: 4,
            axisName: { color: "#334155", fontSize: 11 },
            splitLine: { lineStyle: { color: "rgba(51,65,85,0.1)" } },
            splitArea: { show: false }
        },
        series: [{
            type: "radar",
            data: [
                {
                    value: player_1_values,
                    name: player_1.fullName,
                    lineStyle: { color: "#6C91C2", width: 2 },
                    itemStyle: { color: "#6C91C2" },
                    areaStyle: { color: "rgba(108,145,194,0.15)" }
                },
                {
                    value: player_2_values,
                    name: player_2.fullName,
                    lineStyle: { color: "#E74C3C", width: 2 },
                    itemStyle: { color: "#E74C3C" },
                    areaStyle: { color: "rgba(231,76,60,0.15)" }
                }
            ]
        }]
    };

    chart.setOption(option);
}

// Table
const rawAxes = {
  F: [
    { key: "totalGoals_value", label: "Goals" },
    { key: "goalAssists_value", label: "Assists" },
    { key: "totalShots_value", label: "Shots" },
    { key: "chances_created", label: "Chances Created" },
    { key: "foulsSuffered_value", label: "Fouls Won" },
    { key: "foulsCommitted_value", label: "Fouls Committed" },
    { key: "appearances_value", label: "Apps" }
  ],

  M: [
    { key: "totalGoals_value", label: "Goals" },
    { key: "goalAssists_value", label: "Assists" },
    { key: "chances_created", label: "Chances Created" },
    { key: "totalShots_value", label: "Shots" },
    { key: "foulsSuffered_value", label: "Fouls Won" },
    { key: "foulsCommitted_value", label: "Fouls Committed" },
    { key: "appearances_value", label: "Apps" }
  ]
};

function renderComparisonTable(player1, player2) {
    const tableContainer = document.getElementById("stats-table-container");
    // const tbody = document.getElementById("stats-table-body");

    const axes = rawAxes[player1.positionAbbreviation];

    // Show container
    tableContainer.style.display = "block";

    const headerCells = axes.map(a => `<th>${a.label}</th>`).join("");
    const row1 = axes.map(a => `<td class="val-blue">${Math.round(player1[a.key] ?? 0)}</td>`).join("");
    const row2 = axes.map(a => `<td class="val-red">${Math.round(player2[a.key] ?? 0)}</td>`).join("");

    document.getElementById("stats-table").innerHTML = `
        <thead>
            <tr>
                <th class="left">Player</th>
                ${headerCells}
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="player-name">${player1.fullName}<span class="player-meta"></span></td>
                ${row1}
            </tr>
            <tr>
                <td class="player-name">${player2.fullName}<span class="player-meta"></span></td>
                ${row2}
            </tr>
        </tbody>
    `;

}
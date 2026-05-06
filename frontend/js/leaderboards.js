async function fetchTopScorers() {
    try {
        // const response = await fetch("http://127.0.0.1:5000/api/stats/top-scorers?limit=15");
        const response = await fetch("https://animated-tribble-5gxr576q5x7vf7767-5000.app.github.dev/api/stats/top-scorers?limit=15");
        const data = await response.json();
        console.log("Data received:", data)
        renderTable(data, "scorers");

        return data;
    } catch (error) {
        console.error("Failed to fetch:", error);
        return null;
    }
}

async function fetchTopAssisters() {

    try {
        // const response = await fetch("http://127.0.0.1:5000/api/stats/top-assisters?limit=15");
        const response = await fetch("https://animated-tribble-5gxr576q5x7vf7767-5000.app.github.dev/api/stats/top-assisters?limit=15");
        const data = await response.json();
        console.log("Data received:", data)
        renderTable(data, "assisters");

        return data;
    } catch (error) {
        console.error("Failed to fetch:", error);
        return null;
    }
}

async function fetchTopGoalkeepers() {

    try {
        // const response = await fetch("http://127.0.0.1:5000/api/stats/top-goalkeepers?limit=15");
        const response = await fetch("https://animated-tribble-5gxr576q5x7vf7767-5000.app.github.dev/api/stats/top-goalkeepers?limit=15");
        const data = await response.json();
        console.log("Data received:", data)
        renderTable(data, "goalkeepers");

        return data;
    } catch (error) {
        console.error("Failed to fetch:", error);
        return null;
    }
}

function renderTable(data, type) { //data is my array, type is the type of stat (scorer, assist etc)
    
    let headerHTML = "";
    let rowsHTML = "";

    if (type === "scorers") {

        // Table headers
        const headers = [
        { label: "#" },
        { label: "Name" },
        { label: "Team" },
        { label: "Pos" },
        { label: "G" },
        { label: "A" },
        { label: "Apps" },
        { label: "Shots" },
        { label: "SoT %.", tooltip: "Shots on target divided by total shots taken" },
        { label: "Conv %", tooltip: "Goals scored divided by total shots taken" },
        { label: "Nation" }
                        ];

        // Header html
        // const headerHTML = headers.map(h => `<th>${h}</th>`).join("");
        headerHTML = headers.map(h => {
            if (h.tooltip) {
                return `
                <th>
                    ${h.label}
                    <span class="tooltip-container">
                        <i class="bi bi-info-circle tooltip-icon"></i>
                        <span class="tooltip-text">${h.tooltip}</span>
                    </span>
                </th>`
            }
            return `<th>${h.label}</th>`;
        }).join("");

        // Rows
        rowsHTML = data.map((player, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${player.fullName}</td>
                <td class="team-cell">
                    <img 
                        src="${player.teamLogo}" 
                        alt="${player.teamName}" 
                        title="${player.teamName}"
                        class="team-logo"
                    >
                    <span class="team-name">${player.teamName}</span>
                </td>                
                <td>${player.positionAbbreviation}</td>
                <td>${player.totalGoals_value}</td>
                <td>${player.goalAssists_value}</td>
                <td>${player.appearances_value}</td>
                <td>${player.totalShots_value ?? "—"}</td>
                <td>${player.shot_accuracy != null ? (player.shot_accuracy).toFixed(1) + "%" : "—"}</td>
                <td>${player.conversion_rate != null ? (player.conversion_rate * 100).toFixed(1) + "%" : "—"}</td>
                <td>${player.citizenship}</td>
            </tr>
        `).join("");        
    }

    else if (type === "assisters") {
        
        // Assist table headers
        const headers = [
            { label: "#" },
            { label: "Name" },
            { label: "Team" },
            { label: "Pos" },
            { label: "A" },
            { label: "CC", tooltip: "Chances created" },
            { label: "G" },
            { label: "Apps" },
            { label: "Nation" }
        ];

        headerHTML = headers.map(h => {
            if (h.tooltip) {
                return `
                <th>
                    ${h.label}
                    <span class="tooltip-container">
                        <i class="bi bi-info-circle tooltip-icon"></i>
                        <span class="tooltip-text">${h.tooltip}</span>
                    </span>
                </th>`
            }
            return `<th>${h.label}</th>`;
        }).join("");
        
        // Assist table rows
        rowsHTML = data.map((player, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${player.fullName}</td>
                <td class="team-cell">
                    <img 
                        src="${player.teamLogo}" 
                        alt="${player.teamName}" 
                        title="${player.teamName}"
                        class="team-logo"
                    >
                    <span class="team-name">${player.teamName}</span>
                </td>
                <td>${player.positionAbbreviation}</td>
                <td>${player.goalAssists_value}</td>
                <td>${player.chances_created ?? "—"}</td>
                <td>${player.totalGoals_value}</td>
                <td>${player.appearances_value}</td>
                <td>${player.citizenship}</td>            
            </tr>
        `).join("");    }

    else if (type === "goalkeepers") {

        // Goalkeeper table headers
        const headers = [
            { label: '#' },
            { label: 'Name' },
            { label: 'Team' },
            { label: 'Apps' },
            { label: 'Saves' },
            { label: 'Save %' },
            { label: 'Shots faced' },
            { label: 'GC', tooltip: "Goals conceded" },
            { label: 'Nation' }
        ];

        headerHTML = headers.map(h => {
            if (h.tooltip) {
                return `
                <th>
                    ${h.label}
                    <span class="tooltip-container">
                        <i class="bi bi-info-circle tooltip-icon"></i>
                        <span class="tooltip-text">${h.tooltip}</span>
                    </span>
                </th>`            
              }
            return `<th>${h.label}</th>`;
    }).join("");

        // Goalkeepers table rows
        rowsHTML = data.map((player, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${player.fullName}</td>
                    <td class="team-cell">
                        <img 
                            src="${player.teamLogo}" 
                            alt="${player.teamName}" 
                            title="${player.teamName}"
                            class="team-logo"
                        >
                        <span class="team-name">${player.teamName}</span>
                    </td>
                    <td>${player.appearances_value}</td>
                    <td>${player.saves_value}</td>
                    <td>${player.save_percentage != null ? (player.save_percentage).toFixed(1) + "%" : "—"}</td>
                    <td>${player.shotsFaced_value}</td>
                    <td>${player.goalsConceded_value}</td>
                    <td>${player.citizenship}</td>            
                </tr>
            `).join("");

    }

    // Sending the data to the webpage
    document.getElementById("table-container").innerHTML = `
        <table id="leaderboard-table" class="table-${type}">
            <thead><tr>${headerHTML}</tr></thead>
            <tbody>${rowsHTML}</tbody>
        </table>        
    `;
}

fetchTopScorers()

// Tab switching
document.querySelectorAll(".tab-btn").forEach(button =>  {

    button.addEventListener("click", function() {
        
        document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
        
        this.classList.add("active")

        const tab = this.dataset.tab;

        if (tab==="scorers") fetchTopScorers();
        if (tab==="assisters") fetchTopAssisters();
        if (tab==="goalkeepers") fetchTopGoalkeepers();

    }
        );
    })


// function createChart(names, goals) {

//     // Initialising ECharts
//     const chartDom = document.getElementById("top_scorers")
//     const myChart = echarts.init(chartDom)

//     // My chart configuration
//     const option = {
//         xAxis: {
//             type: "category",
//             data: names
//         },
//         yAxis: {
//             type: "value",
//         },
//         series: [{
//             type: "bar",
//             data: goals
//         }]
//     }

//     // Applying the configuration
//     myChart.setOption(option)
    
// }
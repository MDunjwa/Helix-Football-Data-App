const chartConfig = {
    scoring: {
        position: null,
        charts: [
            {
                x: "totalGoals_value",
                y: "goalAssists_value",
                xLabel: "Goals",
                yLabel: "Assists",
                title: "Goals vs Assists",
                description: "Identifies players who both score and create. Top-right players are complete attacking threats.",
                quadrants: {
                    topRight:    { label: "Complete attackers",   color: "#6C91C2" },
                    topLeft:     { label: "Playmakers",  color: "#27AE60" },
                    bottomRight: { label: "Poachers",    color: "#F39C12" },
                    bottomLeft:  { label: "", color: "#BDC3C7" }
                }
            },
            {
                x: "totalGoals_value",
                y: "totalShots_value",
                xLabel: "Goals",
                yLabel: "Total Shots",
                title: "Goals vs Total Shots",
                description: "Shows finishing efficiency vs volume. High goals with fewer shots suggests clinical finishing.",
                quadrants: {
                    topRight:    { label: "High-volume scorers", color: "#6C91C2" },
                    topLeft:     { label: "Shot-heavy, low return", color: "#E74C3C" },
                    bottomRight: { label: "Clinical finishers", color: "#27AE60" },
                    bottomLeft:  { label: "", color: "#BDC3C7" }
                }
            },
            {
                x: "totalShots_value",
                y: "shot_accuracy",
                xLabel: "Total Shots",
                yLabel: "Shot Accuracy (%)",
                title: "Shots vs Shot Accuracy",
                description: "Compares shooting volume with precision. High accuracy and high volume is elite shot selection.",
                quadrants: {
                    topRight:    { label: "Precise & active shooters", color: "#6C91C2" },
                    topLeft:     { label: "Selective shooters", color: "#27AE60" },
                    bottomRight: { label: "Volume shooters", color: "#F39C12" },
                    bottomLeft:  { label: "", color: "#BDC3C7" }
                }
            },
            {
                x: "totalShots_value",
                y: "conversion_rate",
                xLabel: "Total Shots",
                yLabel: "Conversion Rate (%)",
                title: "Shots vs Conversion Rate",
                description: "Highlights efficiency in front of goal. Players with high conversion and high volume are elite finishers.",
                quadrants: {
                    topRight:    { label: "Elite finishers", color: "#6C91C2" },
                    topLeft:     { label: "Highly efficient", color: "#27AE60" },
                    bottomRight: { label: "Wasteful shooters", color: "#E74C3C" },
                    bottomLeft:  { label: "", color: "#BDC3C7" }
                }
            }
        ]
    },

    creativity: {
        position: null,
        charts: [            
            {
                x: "chances_created",
                y: "goalAssists_value",
                xLabel: "Chances Created",
                yLabel: "Assists",
                title: "Chances Created vs Assists",
                description: "Compares chance creation with final output. Highlights differences between underlying creativity and recorded assists.",
                quadrants: {
                    topRight:    { label: "High creation & output", color: "#6C91C2" },
                    topLeft:     { label: "High output, lower creation", color: "#27AE60" },
                    bottomRight: { label: "High creation, lower output", color: "#F39C12" },
                    bottomLeft:  { label: "Low involvement", color: "#BDC3C7" }
                }
            },
            {
                x: "chances_created",
                y: "foulsSuffered_value",
                xLabel: "Chances Created",
                yLabel: "Fouls Won",
                title: "Chances Created vs Fouls Won",
                description: "Identifies creative players who draw pressure. High values suggest players who disrupt defenses consistently.",
                quadrants: {
                    topRight:    { label: "Creative under pressure", color: "#6C91C2" },
                    topLeft:     { label: "Space creators", color: "#27AE60" },
                    bottomRight: { label: "Draws contact", color: "#F39C12" },
                    bottomLeft:  { label: "", color: "#BDC3C7" }
                }
            },
            {
                x: "chances_created",
                y: "shotsOnTarget_value",
                xLabel: "Chances Created",
                yLabel: "Shots on Target",
                title: "Chances Created vs Shots on Target",
                description: "Compares chance creation with direct goal threat. Highlights players who both create for others and test the goal themselves.",
                quadrants: {
                    topRight:    { label: "Dual threat", color: "#6C91C2" },
                    topLeft:     { label: "Direct threats", color: "#27AE60" },
                    bottomRight: { label: "Creators", color: "#F39C12" },
                    bottomLeft:  { label: "Low involvement", color: "#BDC3C7" }
                }
            }    
        ]
    },

    defense: {
        position: "D",
        charts: [
            {
                x: "foulsCommitted_value",
                y: "yellowCards_value",
                xLabel: "Fouls Committed",
                yLabel: "Yellow Cards",
                title: "Fouls vs Yellow Cards",
                description: "Assesses defensive discipline. Players who commit fouls but avoid cards show better control, while high values in both suggest risky or mistimed defending.",
                quadrants: {
                    topRight:    { label: "High-risk defenders", color: "#E74C3C" },
                    topLeft:     { label: "Card-prone", color: "#F39C12" },
                    bottomRight: { label: "Frequent tacklers", color: "#27AE60" },
                    bottomLeft:  { label: "Low defensive actions", color: "#BDC3C7" }
                }
            },
            {
                x: "discipline_score",
                y: "foulsCommitted_value",
                xLabel: "Discipline Score",
                yLabel: "Fouls Committed",
                title: "Discipline vs Fouling",
                description: "Compares overall discipline with foul frequency. Highlights players who defend without excessive infringement.",
                quadrants: {
                    topRight:    { label: "Controlled defenders", color: "#6C91C2" },
                    topLeft:     { label: "Disciplined, low activity", color: "#27AE60" },
                    bottomRight: { label: "Active but risky", color: "#F39C12" },
                    bottomLeft:  { label: "High-risk defenders", color: "#E74C3C" }
                }
            },
            {
                x: "foulsCommitted_value",
                y: "foulsSuffered_value",
                xLabel: "Fouls Committed",
                yLabel: "Fouls Won",
                title: "Physical Engagement",
                description: "Shows involvement in physical duels. Combines fouls committed and drawn to reflect intensity of play.",
                quadrants: {
                    topRight:    { label: "Highly involved", color: "#6C91C2" },
                    topLeft:     { label: "Draws contact", color: "#27AE60" },
                    bottomRight: { label: "Aggressive defenders", color: "#F39C12" },
                    bottomLeft:  { label: "Low engagement", color: "#BDC3C7" }
                }
            }            
        ]
    },

    goalkeeping: {
        position: "G",
        charts: [
            {
                x: "shotsFaced_value",
                y: "save_percentage",
                xLabel: "Shots Faced",
                yLabel: "Save Percentage (%)",
                title: "Save % vs Shots Faced",
                description: "Evaluates goalkeeper performance under pressure. High save % with high volume suggests elite shot-stopping.",
                quadrants: {
                    topRight:    { label: "High workload, high save %", color: "#6C91C2" },
                    topLeft:     { label: "High save %", color: "#27AE60" },
                    bottomRight: { label: "High workload", color: "#F39C12" },
                    bottomLeft:  { label: "Low involvement", color: "#BDC3C7" }
                }
            },
            {
                x: "saves_value",
                y: "goalsConceded_value",
                xLabel: "Saves",
                yLabel: "Goals Conceded",
                title: "Saves vs Goals Conceded",
                description: "Shows the relationship between saves made and goals conceded.",
                quadrants: {
                    topRight:    { label: "High activity", color: "#6C91C2" },
                    topLeft:     { label: "Conceding frequently", color: "#E74C3C" },
                    bottomRight: { label: "Occasionally tested", color: "#27AE60" },
                    bottomLeft:  { label: "Low involvement", color: "#BDC3C7" }
                }
            }
        ]
    }
};

async function fetchScatterData(position, x, y) {

    const positionParameter = position ? `&position=${position}` : "";
    const url = `http://127.0.0.1:5000/api/stats/scatter?x=${x}&y=${y}${positionParameter}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch scatter data:", error);
        return null;
    }
}

async function renderMainChart(data, chartConfig) {

    // Getting the DOM element and initialisig ECharts
    const chartDom = document.getElementById("main-chart")
    const myChart = echarts.init(chartDom)
    
    // Transforming player objects into x, y and name values
    const points = data.map(player => [
        player[chartConfig.x],
        player[chartConfig.y],
        player.fullName
    ]);

    // Chart behavior
    const option = {
    xAxis: { 
        type: "value",
        name: chartConfig.xLabel
    },
    yAxis: { 
        type: "value",
        name: chartConfig.yLabel
    },
    series: [{
        type: "scatter",
        data: points
    }]
    }   

    myChart.setOption(option);

    // Labelling the charts
    document.getElementById("main-chart-title").textContent = chartConfig.title;
    document.getElementById("main-chart-description").textContent = chartConfig.description;

}

async function loadTab(tabName, chartIndex=0) {

    const tab = chartConfig[tabName];
    const position = tab.position;
    // Choosing which chart index to use for graph
    const chosenChart = tab.charts[chartIndex];
    const x = chosenChart.x;
    const y = chosenChart.y;

    // Fetching data
    const data = await fetchScatterData(position, x, y)

    // Rendering chart
    renderMainChart(data, chosenChart)
}

// Initial chart
loadTab("scoring");

// Tab switching
document.querySelectorAll(".tab-btn").forEach(button => {
    button.addEventListener("click", function() {
        document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        loadTab(this.dataset.tab);
    });
});
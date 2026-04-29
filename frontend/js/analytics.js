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
                description: "Identifies players who both score and create. Top-right players are complete attacking threats."
            },
            {
                x: "totalGoals_value",
                y: "totalShots_value",
                xLabel: "Goals",
                yLabel: "Total Shots",
                title: "Goals vs Total Shots",
                description: "Shows finishing efficiency vs volume. High goals with fewer shots suggests clinical finishing."
            },
            {
                x: "totalShots_value",
                y: "shot_accuracy",
                xLabel: "Total Shots",
                yLabel: "Shot Accuracy (%)",
                title: "Shots vs Shot Accuracy",
                description: "Compares shooting volume with precision. High accuracy and high volume is elite shot selection."
            },
            {
                x: "totalShots_value",
                y: "conversion_rate",
                xLabel: "Total Shots",
                yLabel: "Conversion Rate (%)",
                title: "Shots vs Conversion Rate",
                description: "Highlights efficiency in front of goal. Players with high conversion and high volume are elite finishers."
            }
        ]
    },

    creativity: {
        position: null,
        charts: [
            {
                x: "goalAssists_value",
                y: "chances_created",
                xLabel: "Assists",
                yLabel: "Chances Created",
                title: "Assists vs Chances Created",
                description: "Separates chance creators from actual output. High chances but low assists may indicate poor finishing by teammates."
            },
            {
                x: "totalGoals_value",
                y: "goalAssists_value",
                xLabel: "Goals",
                yLabel: "Assists",
                title: "Goals vs Assists",
                description: "Highlights attacking balance. Players high in both contribute across scoring and playmaking."
            },
            {
                x: "chances_created",
                y: "foulsSuffered_value",
                xLabel: "Chances Created",
                yLabel: "Fouls Won",
                title: "Chances Created vs Fouls Won",
                description: "Identifies creative players who draw pressure. High values suggest players who disrupt defenses consistently."
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
                description: "Assesses defensive discipline. Players who commit fouls but avoid cards show better control, while high values in both suggest risky or mistimed defending."
            },
            {
                x: "foulsSuffered_value",
                y: "goalAssists_value",
                xLabel: "Fouls Won",
                yLabel: "Assists",
                title: "Fouls Won vs Assists",
                description: "Highlights players who are difficult to dispossess and draw fouls under pressure. High fouls won indicates players who consistently challenge defenders and disrupt play."
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
                description: "Evaluates goalkeeper performance under pressure. High save % with high volume suggests elite shot-stopping."
            },
            {
                x: "saves_value",
                y: "goalsConceded_value",
                xLabel: "Saves",
                yLabel: "Goals Conceded",
                title: "Saves vs Goals Conceded",
                description: "Shows the relationship between saves made and goals conceded."
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
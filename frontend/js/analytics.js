const chartConfig = {
    scoring: {
        position: null,
        charts: [
            { x: "totalGoals_value", y: "goalAssists_value", title: "Goals vs Assists" },
            { x: "totalGoals_value", y: "totalShots_value", title: "Goals vs Total Shots" },
            { x: "totalShots_value", y: "shot_accuracy", title: "Shots vs Shot Accuracy" },
            { x: "totalShots_value", y: "conversion_rate", title: "Shots vs Conversion Rate" }
        ]
    },
    creativity: {
        position: null,
        charts: [
            { x: "goalAssists_value", y: "chances_created", title: "Assists vs Chances Created" },
            { x: "totalGoals_value", y: "goalAssists_value", title: "Goals vs Assists" },
            { x: "chances_created", y: "foulsSuffered_value", title: "Chances Created vs Fouls Won" }
        ]
    },
    defense: {
        position: "D",
        charts: [
            { x: "foulsCommitted_value", y: "yellowCards_value", title: "Fouls vs Yellow Cards" },
            { x: "foulsSuffered_value", y: "goalAssists_value", title: "Assists vs Fouls Won" }
        ]
    },
    goalkeeping: {
        position: "G",
        charts: [
            { x: "shotsFaced_value", y: "save_percentage", title: "Save % vs Shots Faced" },
            { x: "saves_value", y: "goalsConceded_value", title: "Saves vs Goals Conceded" }
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
    xAxis: { type: "value" },
    yAxis: { type: "value" },
    series: [{
        type: "scatter",
        data: points
    }]
    }   

    myChart.setOption(option);

    // Labelling the charts
    document.getElementById("main-chart-title").textContent = chartConfig.title;

}
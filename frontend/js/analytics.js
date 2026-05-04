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
                x: "chances_created",
                y: "goalAssists_value",
                xLabel: "Chances Created",
                yLabel: "Assists",
                title: "Chances Created vs Assists",
                description: "Compares chance creation with final output. Highlights differences between underlying creativity and recorded assists."
            },
            {
                x: "chances_created",
                y: "foulsSuffered_value",
                xLabel: "Chances Created",
                yLabel: "Fouls Won",
                title: "Chances Created vs Fouls Won",
                description: "Identifies creative players who draw pressure. High values suggest players who disrupt defenses consistently."
            },
            {
                x: "chances_created",
                y: "shotsOnTarget_value",
                xLabel: "Chances Created",
                yLabel: "Shots on Target",
                title: "Chances Created vs Shots on Target",
                description: "Compares chance creation with direct goal threat. Highlights players who both create for others and test the goal themselves."
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
                x: "discipline_score",
                y: "foulsCommitted_value",
                xLabel: "Discipline Score",
                yLabel: "Fouls Committed",
                title: "Discipline vs Fouling",
                description: "Compares overall discipline with foul frequency. Highlights players who defend without excessive infringement."
            },
            {
                x: "foulsCommitted_value",
                y: "foulsSuffered_value",
                xLabel: "Fouls Committed",
                yLabel: "Fouls Won",
                title: "Physical Engagement",
                description: "Shows involvement in physical duels. Combines fouls committed and drawn to reflect intensity of play."
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
    // const url = `http://127.0.0.1:5000/api/stats/scatter?x=${x}&y=${y}${positionParameter}`;
    const url = `https://animated-tribble-5gxr576q5x7vf7767-5000.app.github.dev/api/stats/scatter?x=${x}&y=${y}${positionParameter}`;


    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch scatter data:", error);
        return null;
    }
}

async function renderMainChart(data, chartConfig, tabContext) {

    // Getting the DOM element
    const chartDom = document.getElementById("main-chart")

    // Disposing previous chatr instance to prevent stacking
    const existing = echarts.getInstanceByDom(chartDom);
    if (existing) existing.dispose();

    // Initialising ECharts
    const myChart = echarts.init(chartDom)

    const scatterDots = data.map(p => [p[chartConfig.x], p[chartConfig.y], p.fullName]);
    const sortedScatterDots = scatterDots.sort((a, b) => (b[0] * b[1]) - (a[0] * a[1]));
    const elite = sortedScatterDots.slice(0, 5);
    const rest = sortedScatterDots.slice(5);

    // Determine highlight color and label based on chart type
    const isDisciplineChart = (tabContext === 'defense' && chartConfig.x === 'foulsCommitted_value' && chartConfig.y === 'yellowCards_value');
    const highlightColor = isDisciplineChart ? "#E74C3C" : "#84CC16";
    const highlightLabel = isDisciplineChart ? "Aggressive defenders" : "Top performers"

    // Building series/layer 
    const series = [
    {
        name: highlightLabel,
        type: "scatter",
        data: elite,
        itemStyle: { color: highlightColor, opacity: 0.9 },
        symbolSize: 13,
        label: {
            show: true,
            formatter: params => params.data[2],
            position: "top",
            fontSize: 11,
            color: "#1F2933"
        },
        tooltip: {
            formatter: params => `<strong>${params.data[2]}</strong><br/>${chartConfig.xLabel}: ${params.data[0]}<br/>${chartConfig.yLabel}: ${params.data[1]}`
        }
    },
    {
        name: "_rest",
        type: "scatter",
        data: rest,
        itemStyle: { color: "#475569", opacity: 0.8 },
        symbolSize: 8,
        tooltip: {
            formatter: params => `<strong>${params.data[2]}</strong><br/>${chartConfig.xLabel}: ${params.data[0]}<br/>${chartConfig.yLabel}: ${params.data[1]}`
        }
    }
];
 
    // Chart behavior
    const option = {
        tooltip: { trigger: "item" },
        legend: {
            orient: "vertical",
            right: 10,
            top: "middle",
            textStyle: { fontSize: 12, color: "#334155" },
            formatter: name => name.startsWith("_") ? "" : name,
            data: series.map(s => s.name).filter(n => !n.startsWith("_"))
        },
        xAxis: {
            type: "value",
            name: chartConfig.xLabel,
            nameLocation: "middle",
            nameGap: 30,
            splitLine: { lineStyle: { color: "rgba(51,65,85,0.08)" } }
        },
        yAxis: {
            type: "value",
            name: chartConfig.yLabel,
            nameLocation: "middle",
            nameGap: 40,
            splitLine: { lineStyle: { color: "rgba(51,65,85,0.08)" } }
        },
        series
    };    

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
    renderMainChart(data, chosenChart, tabName)
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
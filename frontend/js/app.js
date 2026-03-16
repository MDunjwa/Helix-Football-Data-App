// async function fetchTopScorers() {
//     try {
//         const response = await fetch("http://127.0.0.1:5000/api/stats/top-scorers");
//         const data = await response.json();
//         console.log("Data received:", data)
//         renderTable(data, "scorers");

//         // const names = data.map(player => player.fullName)
//         // const goals = data.map(player => player.totalGoals_value)

//         // createChart(names, goals)

//         // console.log("Names:", names)
//         // console.log("Goals:", goals)

//         return data;
//     } catch (error) {
//         console.error("Failed to fetch:", error);
//         return null;
//     }
// }

// function renderTable(data, type) { //data is my array, type is the type of stat (scorer, assist etc)
    
//     // Table headers
//     const headers = ["#", "Player", "Team", "Position", "Goals", "Assists", "Games", "Shots", "Accuracy", "Conversion"];

//     // Header html
//     const headerHTML = headers.map(h => `<th>${h}</th>`).join("");

//     // Rows
//     const rowsHTML = data.map((player, index) => `
//         <tr>
//             <td>${index + 1}</td>
//             <td>${player.fullName}</td>
//             <td>${player.teamName}</td>
//             <td>${player.positionAbbreviation}</td>
//             <td>${player.totalGoals_value}</td>
//             <td>${player.goalAssists_value}</td>
//             <td>${player.appearances_value}</td>
//             <td>${player.totalShots_value ?? "—"}</td>
//             <td>${player.shot_accuracy != null ? (player.shot_accuracy * 100).toFixed(1) + "%" : "—"}</td>
//             <td>${player.conversion_rate != null ? (player.conversion_rate * 100).toFixed(1) + "%" : "—"}</td>
//         </tr>
//     `).join("");

//     // Sending the data to the webpage
//     document.getElementById("table-container").innerHTML = `
//         <table id="leaderboard-table">
//             <thead><tr>${headerHTML}</tr></thead>
//             <tbody>${rowsHTML}</tbody>
//         </table>        
//     `;
// }

// fetchTopScorers()

// // function createChart(names, goals) {

// //     // Initialising ECharts
// //     const chartDom = document.getElementById("top_scorers")
// //     const myChart = echarts.init(chartDom)

// //     // My chart configuration
// //     const option = {
// //         xAxis: {
// //             type: "category",
// //             data: names
// //         },
// //         yAxis: {
// //             type: "value",
// //         },
// //         series: [{
// //             type: "bar",
// //             data: goals
// //         }]
// //     }

// //     // Applying the configuration
// //     myChart.setOption(option)
    
// // }
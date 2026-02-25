async function fetchTopScorers() {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/stats/top-scorers");
        const data = await response.json();
        console.log("Data received:", data)

        const names = data.map(player => player.fullName)
        const goals = data.map(player => player.totalGoals_value)

        createChart(names, goals)

        console.log("Names:", names)
        console.log("Goals:", goals)

        return data;
    } catch (error) {
        console.error("Failed to fetch:", error);
        return null;
    }
}

fetchTopScorers()

function createChart(names, goals) {

    // Getting the canvas element
    const context = document.getElementById('top_scorers').getContext('2d');

    // Creating the chart
    new CharacterData(context, {
        type: "bar",
        data: {
            labels: names,
            datasets: [{
                label: "Goals",
                data: goals
            }]
        }
    })
}
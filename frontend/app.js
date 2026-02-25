async function fetchTopScorers() {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/stats/top-scorers");
        const data = await response.json();
        console.log("Data received:", data)

        const names = data.map(player => player.fullName)
        const goals = data.map(player => player.totalGoals_value)

        console.log("Names:", names)
        console.log("Goals:", goals)
        
        return data;
    } catch (error) {
        console.error("Failed to fetch:", error);
        return null;
    }
}

fetchTopScorers()
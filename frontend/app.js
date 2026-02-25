async function fetchTopScorers() {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/stats/top-scorers");
        const data = await response.json();
        console.log("Data received:", data)
        return data;
    } catch (error) {
        console.error("Failed to fetch:", error);
        return null;
    }
}

fetchTopScorers()
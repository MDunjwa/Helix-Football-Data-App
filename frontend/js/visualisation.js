async function fetchScatterStats() {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/stats/scatter");
        // const response = await fetch("https://animated-tribble-5gxr576q5x7vf7767-5000.app.github.dev/api/stats/scatter;
        const data = await response.json();
        console.log("Data received:", data)
        renderTable(data, "scorers");

        return data;
    } catch (error) {
        console.error("Failed to fetch:", error);
        return null;
    }
}
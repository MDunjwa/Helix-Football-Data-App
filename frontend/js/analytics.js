const tabConfig = {
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
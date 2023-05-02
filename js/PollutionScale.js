const pollutionScale = [
    {
        scale: [0, 50],
        quality: "Good",
        src: "happy",
        background: "linear-gradient(to right, #45b649, #dce358)",
    },
    {
        scale: [51, 100],
        quality: "Moderate",
        src: "neutral",
        background: "linear-gradient(to right, #f3f9a7, #c4c531)",
    },
    {
        scale: [101, 150],
        quality: "Unhealthy",
        src: "thinking",
        background: "linear-gradient(to right, #f16529, #e44d26)",
    },
    {
        scale: [151, 200],
        quality: "Bad",
        src: "sick",
        background: "linear-gradient(to right, #ef473a, #cb2d3e)",
    },
    {
        scale: [201, 300],
        quality: "Very bad",
        src: "nauseated",
        background: "linear-gradient(to right, #8e54e9, #4776e6)",
    },
    {
        scale: [301, 500],
        quality: "Terrible",
        src: "vomitting",
        background: "linear-gradient(to right, #7a2828, #a73737)",
    },    
];

export default pollutionScale;
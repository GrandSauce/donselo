import { readElo } from "./calculations.js";

// THESE LOAD STRAIGHT AWAY
// When the document is loaded, read the ELO value and update the HTML element
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM fully loaded and parsed");
    const id = "iddsB7f04TOBBaZvlu1h"; // Example player ID
    const dataElement = document.getElementById('data');
    if (dataElement) {
        console.log("Data element found");
        const elo = await readElo(id);
        if (elo !== null) {
            dataElement.textContent = `ELO: ${elo}`;
        } else {
            dataElement.textContent = 'ELO not found';
        }
    } else {
        console.error("Data element not found in the DOM");
    }
});
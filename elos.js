import { readAllPlayers } from "./calculations.js";

// THESE LOAD STRAIGHT AWAY
// When the document is loaded, read the ELO value and update the HTML element
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM fully loaded and parsed");
    const dataElement = document.getElementById('data');
    if (dataElement) {
        console.log("Data element found");

        try {
            let allPlayers = await readAllPlayers(); // Await the asynchronous function
            document.getElementById('data').innerHTML = '';
            // Create a new div element
            var newDivStart = document.createElement('div');
            newDivStart.id = 'eloScore';

            document.getElementById('data').appendChild(newDivStart);
            document.getElementById('eloScore').innerHTML = 'ELOS';


            for (const player of allPlayers) {

                // Create a new div element
                var newDiv = document.createElement('div');
                newDiv.id = 'eloScore';

                // Add some content to the div
                newDiv.textContent = `${player[1]} ${player[2]}: ${player[3]}`;

                // Append the new div to the body (or any other element)
                document.getElementById('data').appendChild(newDiv);


            }
        } catch (error) {
            console.error("Error printing all ELOs:", error);
        }
    } else {
        console.error("Data element not found in the DOM");
    }
});
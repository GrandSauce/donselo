import { readAllPlayers, submitGame } from "./calculations.js";
// Function to populate the dropdown with players
async function populatePlayers() {
    let players = await readAllPlayers();

    // for the winner options
    var winnerSelect = document.getElementById("winner");
    for (var i = 0; i < players.length; i++) {
        var option = document.createElement("option");
        option.value = players[i][0];
        option.text = players[i][1] + " " + players[i][2];
        winnerSelect.appendChild(option);
    }

    // for the loser options
    var loserSelect = document.getElementById("loser");
    for (var i = 0; i < players.length; i++) {
        var option = document.createElement("option");
        option.value = players[i][0];
        option.text = players[i][1] + " " + players[i][2];
        loserSelect.appendChild(option);
    }
}
// Call the function to populate the dropdown when the page loads
window.onload = populatePlayers;

// Calls the submitGame() function when the submit button is clicked
document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('submitGameButton');
    button.addEventListener('click', submitGame);

});
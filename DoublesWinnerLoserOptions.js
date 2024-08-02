import { readAllPlayers, submitDoublesGame } from "./calculations.js";
// Function to populate the dropdown with players
async function populatePlayers() {
    let players = await readAllPlayers();

    // for the winner options
    var winner1Select = document.getElementById("winner1");
    for (var i = 0; i < players.length; i++) {
        var option = document.createElement("option");
        option.value = players[i][0];
        option.text = players[i][1] + " " + players[i][2];
        winner1Select.appendChild(option);
    }

    var winner2Select = document.getElementById("winner2");
    for (var i = 0; i < players.length; i++) {
        var option = document.createElement("option");
        option.value = players[i][0];
        option.text = players[i][1] + " " + players[i][2];
        winner2Select.appendChild(option);
    }


    // for the loser options
    var loser1Select = document.getElementById("loser1");
    for (var i = 0; i < players.length; i++) {
        var option = document.createElement("option");
        option.value = players[i][0];
        option.text = players[i][1] + " " + players[i][2];
        loser1Select.appendChild(option);
    }

    var loser2Select = document.getElementById("loser2");
    for (var i = 0; i < players.length; i++) {
        var option = document.createElement("option");
        option.value = players[i][0];
        option.text = players[i][1] + " " + players[i][2];
        loser2Select.appendChild(option);
    }
}
// Call the function to populate the dropdown when the page loads
window.onload = populatePlayers;

// Calls the submitGame() function when the submit button is clicked
document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('submitGameButton');
    button.addEventListener('click', submitDoublesGame);
});
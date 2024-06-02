import { newPlayer } from "./calculations.js";

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('playerForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevents the form from submitting traditionally
        newPlayer(event); // Call your newPlayer function, passing the event
    });
});
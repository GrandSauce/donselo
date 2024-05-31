import {readElo} from './calculations.js';

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('data').textContent = readElo();
});
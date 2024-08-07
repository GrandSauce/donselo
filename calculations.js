// Import the functions you need from the SDKs you need

// THESE LINK MIGHT BE OUT OF DATE (FROM CHATGPT)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, doc, addDoc, getDoc, updateDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// THE FOLLOWING IS WHAT IT SAID WE SHOULD USE
//import { initializeApp } from "firebase/app";
//import { getFirestore, collection, doc, addDoc, getDoc, updateDoc, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCBUWUB6qZepv45ZlVwmsVufYDm15OLgxw",
    authDomain: "donselo-com.firebaseapp.com",
    projectId: "donselo-com",
    storageBucket: "donselo-com.appspot.com",
    messagingSenderId: "980451362505",
    appId: "1:980451362505:web:56d4b6ce187749e016af18",
    measurementId: "G-BZTR3CWBEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);





// USEFUL FUNCTIONS
// _____________________________________________________________________________________________________________________

// Creates a new player with the given first and last name, sets ELO to 1000 and games played to 0
// Returns nothing
export async function newPlayer(event) {
    event.preventDefault();
    let fName = document.getElementById('fname');
    let firstName = fName.value;
    let lName = document.getElementById('lname');
    let lastName = lName.value;
    try {
        const docRef = await addDoc(collection(db, "PLAYER"), {
            FIRST_NAME: firstName,
            LAST_NAME: lastName,
            ELO: 1000,
            GAMES_PLAYED: 0
        });
        console.log("New player added: ");
        console.log("ID: ", docRef.id);
        console.log("Name: ", firstName, " ", lastName);
        alert("New Player added");
    } catch (e) {
        console.error("Error adding the new player: ", e);
        alert("That didn't work! Talk to Hugh or Sam");
    }
}

// Creates a new game data thing that stores the winner and loser and time
// Returns nothing
async function newGame(winner, loser) {
    try {
        const docRef = await addDoc(collection(db, "GAME"), {
            WINNER: winner,
            LOSER: loser,
            TIME: new Date().toLocaleString(),
        });
    } catch (e) {
        console.error("Error adding the new game: ", e);
    }
}

async function newDoublesGame(winner1, winner2, loser1, loser2) {
    try {
        const docRef = await addDoc(collection(db, "GAME"), {
            WINNER1: winner1,
            WINNER2: winner2,

            LOSER1: loser1,
            LOSER2: loser2,
            TIME: new Date().toLocaleString(),
        });
    } catch (e) {
        console.error("Error adding the new game: ", e);
    }
}

// Submits the game to the database
export function submitGame(){
    // Get the selected value from the dropdown
    const winner = document.getElementById("winner").value;
    const loser = document.getElementById("loser").value;

    // Call your function with the selected value
    updateEloAndGamesPlayed(winner, loser);
    newGame(winner, loser);
    alert("Game submitted successfully");
    window.location.href = "index.html";
}

export function submitDoublesGame(){
    const winner1 = document.getElementById("winner1").value;
    const winner2 = document.getElementById("winner2").value;
    const loser1 = document.getElementById("loser1").value;
    const loser2 = document.getElementById("loser2").value;

    updateDoublesEloAndGamesPlayed(winner1, winner2, loser1, loser2);
    newDoublesGame(winner1, winner2, loser1, loser2);
    alert("Game submitted successfully");
    window.location.href = "index.html";

}
// Updates the ELOs of both players (currently winner + 50, loser - 50) and adds 1 to their games played
function updateEloAndGamesPlayed(winnerId, loserId){
    (async () => {
        const winnerData = await readPlayer(winnerId);
        const loserData = await readPlayer(loserId);

        if (winnerData && loserData) {
            console.log("Winner Data Before Calculations:", winnerData);
            console.log("Loser Data Before Calculation:", loserData);

            // Perform calculations
            const currentEloWinner = winnerData.ELO;
            const gamesPlayedWinner = winnerData.GAMES_PLAYED;

            const currentEloLoser = loserData.ELO;
            const gamesPlayedLoser = loserData.GAMES_PLAYED;

            // K-factor
            const k = 32;

            // Expected scores
            const eScoreWinner = 1 / (1 + Math.pow(10, (currentEloLoser - currentEloWinner) / 400));
            const eScoreLoser = 1 / (1 + Math.pow(10, (currentEloWinner - currentEloLoser) / 400));

            // Example calculation: increase ELO by 50 points
            const newEloWinner = Math.round(currentEloWinner + (k * (1 - eScoreWinner)));
            const newEloLoser = Math.round(currentEloLoser + (k * (0 - eScoreLoser)));

            const newGamesPlayedWinner = gamesPlayedWinner + 1;
            const newGamesPlayedLoser = gamesPlayedLoser + 1;


            // Update the player's ELO in Firestore
            await updatePlayerElo(winnerId, newEloWinner);
            await updatePlayerElo(loserId, newEloLoser);

            // Update the player's GAMES_PLAYED in Firestore
            await updateGamesPlayed(winnerId, newGamesPlayedWinner);
            await updateGamesPlayed(loserId, newGamesPlayedLoser);
        }
    })();
}

function updateDoublesEloAndGamesPlayed(winner1,winner2,loser1,loser2){
    (async () => {
        const winner1Data = await readPlayer(winner1);
        const winner2Data = await readPlayer(winner2);

        const loser1Data = await readPlayer(loser1);
        const loser2Data = await readPlayer(loser2);


        if (winner1Data && winner2Data && loser2Data && loser1Data) {

            // Perform calculations
            const currentEloWinner1 = winner1Data.ELO;
            const gamesPlayedWinner1 = winner1Data.GAMES_PLAYED;

            const currentEloWinner2 = winner2Data.ELO;
            const gamesPlayedWinner2 = winner2Data.GAMES_PLAYED;

            const currentEloLoser1 = loser1Data.ELO;
            const gamesPlayedLoser1 = loser1Data.GAMES_PLAYED;

            const currentEloLoser2 = loser2Data.ELO;
            const gamesPlayedLoser2 = loser2Data.GAMES_PLAYED;

            const currentEloLoser = (currentEloLoser1 + currentEloLoser2)/2;
            const currentEloWinner = (currentEloWinner2 + currentEloWinner1)/2;

            // K-factor
            const k = 32;

            // Expected scores
            const eScoreWinner = 1 / (1 + Math.pow(10, (currentEloLoser - currentEloWinner) / 400));
            const eScoreLoser = 1 / (1 + Math.pow(10, (currentEloWinner - currentEloLoser) / 400));

            // Example calculation: increase ELO by 50 points
            const newEloWinner1 = Math.round(currentEloWinner1 + (k * (1 - eScoreWinner)));
            const newEloWinner2 = Math.round(currentEloWinner2 + (k * (1 - eScoreWinner)));

            const newEloLoser1 = Math.round(currentEloLoser1 + (k * (0 - eScoreLoser)));
            const newEloLoser2 = Math.round(currentEloLoser2 + (k * (0 - eScoreLoser)));

            const newGamesPlayedWinner1 = gamesPlayedWinner1 + 1;
            const newGamesPlayedLoser1 = gamesPlayedLoser1 + 1
            const newGamesPlayedWinner2 = gamesPlayedWinner2 + 1;
            const newGamesPlayedLoser2 = gamesPlayedLoser2 + 1;


            // Update the player's ELO in Firestore
            await updatePlayerElo(winner1, newEloWinner1);
            await updatePlayerElo(loser1, newEloLoser1);
            await updatePlayerElo(winner2, newEloWinner2);
            await updatePlayerElo(loser2, newEloLoser2);

            // Update the player's GAMES_PLAYED in Firestore
            await updateGamesPlayed(winner1, newGamesPlayedWinner1);
            await updateGamesPlayed(loser1, newGamesPlayedLoser1);
            await updateGamesPlayed(winner2, newGamesPlayedWinner2);
            await updateGamesPlayed(loser2, newGamesPlayedLoser2);
        }
    })();
}



// Reads all Players in the database
// Returns as a sorted list of lists [id, first name, last name, elo, games played]
export async function readAllPlayers() {
    try {
        const idList = await getAllIds();
        const listOfNamesAndElos = [];
        for (const id of idList) {
            const player = await readPlayer(id);
            if (player) {
                listOfNamesAndElos.push([id, player.FIRST_NAME, player.LAST_NAME, player.ELO, player.GAMES_PLAYED]);
            }
        }
        listOfNamesAndElos.sort((a, b) => b[3] - a[3]);
        console.log(listOfNamesAndElos);
        return listOfNamesAndElos;
    } catch (e) {
        console.error("Error reading all ELOs: ", e);
        return [];
    }
}


// HELPER FUNCTIONS
// _____________________________________________________________________________________________________________________

// Function to update player's games played
async function updateGamesPlayed(id, newGamesPlayed) {
    try {
        const playerRef = doc(db, "PLAYER", id);
        await updateDoc(playerRef, {
            GAMES_PLAYED: newGamesPlayed
        });
        console.log(id, " GAMES_PLAYED updated to: ", newGamesPlayed);
    } catch (e) {
        console.error("Error updating player GAMES_PLAYED: ", e);
    }
}

// Function to update player's ELO
async function updatePlayerElo(id, newElo) {
    try {
        const playerRef = doc(db, "PLAYER", id);
        await updateDoc(playerRef, {
            ELO: newElo
        });
        console.log(id, " ELO updated to:", newElo);
    } catch (e) {
        console.error("Error updating player ELO: ", e);
    }
}

// Prints a player's information
function printPlayer(id){
    (async () => {
        const playerElo = await readPlayer(id);
        if (playerElo) {
            console.log("Player ELO:", playerElo);
        }
    })();
}

// Function to read player's info by document ID (you have to do some fancy asynchronous stuff to use the values I think)
async function readPlayer(id) {
    try {
        const docRef = doc(db, "PLAYER", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // docSnap.data() will be undefined in this case
            console.log("Could not find a player with that id");
            return null;
        }
    } catch (e) {
        console.error("Error reading player ELO: ", e);
        return null;
    }
}

// Function to read player's ELO
async function readElo(id) {
    const player = await readPlayer(id);
    if (player) {
        return player['ELO'];
    } else {
        return null;
    }
}

// Function to get all the Ids of all the players, returns as an array
async function getAllIds() {
    try {
        const querySnapshot = await getDocs(collection(db, "PLAYER"));
        const allIds = [];
        querySnapshot.forEach((doc) => {
            allIds.push(String(doc.id));
        });
        console.log(allIds);
        return allIds;
    } catch (e) {
        console.error("Error getting all IDs: ", e);
        return [];
    }
}

// Returns all the player names and elos as a big string (not very useful)
async function printAllElos() {
    let bigString = "";
    try {
        let allPlayers = await readAllPlayers(); // Await the asynchronous function
        for (const player of allPlayers) { // Use 'const' or 'let' to declare the variable
            bigString += `${player[1]} ${player[2]} ELO: ${player[3]}\n`; // Use template literals for better readability
        }
    } catch (error) {
        console.error("Error printing all ELOs:", error);
    }
    console.log(bigString);
    return bigString;
}



// TESTING
// _____________________________________________________________________________________________________________________
// updateEloAndGamesPlayed("iddsB7f04TOBBaZvlu1h", "lQz872i4CSaUOIyuBkUU");
// readElo("iddsB7f04TOBBaZvlu1h");
// newGame("Test winner", "Test loser");

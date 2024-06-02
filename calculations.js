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

// Submits the game to the database
export function submitGame(){
    // Get the selected value from the dropdown
    const winner = document.getElementById("winner").value;
    const loser = document.getElementById("loser").value;

    // Call your function with the selected value
    updateEloAndGamesPlayed(winner, loser);
    alert("Game submitted successfully");
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


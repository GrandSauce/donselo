// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, addDoc, getDoc, updateDoc } from "firebase/firestore";

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
async function newPlayer(firstName, lastName) {
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
    } catch (e) {
        console.error("Error adding the new player: ", e);
    }
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

            // Example calculation: increase ELO by 50 points
            const newEloWinner = currentEloWinner + 50;
            const newEloLoser = currentEloLoser - 50;

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





// TESTING
// _____________________________________________________________________________________________________________________
updateEloAndGamesPlayed("iddsB7f04TOBBaZvlu1h", "lQz872i4CSaUOIyuBkUU");

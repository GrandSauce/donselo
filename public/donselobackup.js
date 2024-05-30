// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import firebase from "firebase/compat";

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
const firestore = getFirestore(app);
const db = firebase.firestore();

// Gets all the data from a collection. Returns as a set of dictionaries
async function getData(COLLECTION) {
    // Reference to your collection
    const collectionRef = collection(firestore, COLLECTION);

    // Fetch data
    try {
        const querySnapshot = await getDocs(collectionRef);
        const data = [];
        querySnapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

// THIS DOESN'T WORK YET
async function updateELO() {
    const docId = "iddsB7f04TOBBaZvlu1h";
    const fieldName = "ELO";
    const newValue = 2000;

    const docRef = doc(db, 'your-collection-name', docId);
    await updateDoc(docRef, {
        [fieldName]: newValue
    });

    console.log('Document successfully updated!');
}
//updateELO().catch(console.error);

// Printing it all
(async () => {
    try {
        const playerData = await getData('PLAYER');
        console.log("Player Data:", playerData);

        const gameData = await getData('GAME');
        console.log("Game Data:", gameData);
    } catch (error) {
        console.error("Error:", error);
    }
})();
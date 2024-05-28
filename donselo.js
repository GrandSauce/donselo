// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

// Reference to your collection
const collectionRef = collection(firestore, 'PLAYER');

// Read data
const fetchData = async () => { // MAKE THIS TAKE IN THE COLLECTION AS A VARIABLE
    try {
        const querySnapshot = await getDocs(collectionRef);
        const data = [];
        querySnapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (error) {
        throw error;
    }
};

(async () => {
    try {
        const data = await fetchData();
        console.log("Data:", data);
    } catch (error) {
        console.error("Error:", error);
    }finally {
        // Manually exit the Node.js process
        process.exit();
    }
})();
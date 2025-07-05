// firebase.js

const firebaseConfig = {
  apiKey: "AIzaSyCwdXWjQdbbPUzCQNJAcafTtA7WNI2yJ1w",
  authDomain: "babu-gpt-v2.firebaseapp.com",
  projectId: "babu-gpt-v2",
  storageBucket: "babu-gpt-v2.appspot.com", // <-- fixed `.app` typo
  messagingSenderId: "366781541723",
  appId: "1:366781541723:web:031957ca5985d378487e7e",
  measurementId: "G-HXTN19X2SE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Optional: log for debugging
console.log("Firebase initialized");

// Global access
const auth = firebase.auth();
const db = firebase.firestore();

import app from 'firebase/app'
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBTVkSA2Lq6x0TitvL3g0o4vA1EboGxGk4",
  authDomain: "pi-prog3.firebaseapp.com",
  projectId: "pi-prog3",
  storageBucket: "pi-prog3.appspot.com",
  messagingSenderId: "108356083545",
  appId: "1:108356083545:web:9872d708a45c3ef2453648"
};

// Initialize Firebase
app.initializeApp(firebaseConfig);

export const auth = firebase.auth()
export const db = app.firestore()
export const storage = app.storage()


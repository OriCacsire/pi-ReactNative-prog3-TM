const firebaseConfig = { //HAY QUE CAMBIARLO
    apiKey: "AIzaSyBH_Yhn_HuoheNJzK9pAnWAPQilwDEKTpY",
    authDomain: "clase-1-57433.firebaseapp.com",
    projectId: "clase-1-57433",
    storageBucket: "clase-1-57433.appspot.com",
    messagingSenderId: "733334182251",
    appId: "1:733334182251:web:c20516cc5cc4202081542e"
  };

  app.initializeApp(firebaseConfig)

  export const auth = firebase.auth()
  export const db = app.firestore()
  export const storage = app.storage()


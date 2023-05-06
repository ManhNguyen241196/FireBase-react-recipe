//khai báo config để làm nền truy cập vào firebase
import firebase from "firebase";

const config = {
  apiKey: "AIzaSyDkXNh8msW3uecYrPCLqA6-8OfrADZzSsY",
  authDomain: "fir-recipes-7aad2.firebaseapp.com",
  projectId: "fir-recipes-7aad2",
  storageBucket: "fir-recipes-7aad2.appspot.com",
  messagingSenderId: "954482828211",
  appId: "1:954482828211:web:a64423e87e114ab338e1c6",
  measurementId: "G-GEWFB8T148",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default firebase;

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'


var firebaseConfig = {
    apiKey: "AIzaSyAwchy6DxxETsGC-274W4OA5uuGNL8h-TI",
    authDomain: "slack-clone-f68cc.firebaseapp.com",
    projectId: "slack-clone-f68cc",
    storageBucket: "slack-clone-f68cc.appspot.com",
    messagingSenderId: "537213213314",
    appId: "1:537213213314:web:171f36d882786af285f29b",
    measurementId: "G-5EEXRB5YVJ"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase
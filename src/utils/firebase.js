import firebase from "firebase";
import "firebase/storage";
var firebaseConfig = {
  apiKey: "AIzaSyDCocGV94ZmbfaZ1lfUHVonOrPZWHq6khg",
  authDomain: "bsulms.firebaseapp.com",
  projectId: "bsulms",
  storageBucket: "bsulms.appspot.com",
  messagingSenderId: "601184712666",
  appId: "1:601184712666:web:8ef4ba5d20aed2e1bff2e3",
  measurementId: "G-LE0B3JV02C"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;

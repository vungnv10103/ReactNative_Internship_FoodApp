import { initializeApp, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence, ReactNativeAsyncStorage } from "firebase/auth";
import { getStorage, ref } from 'firebase/storage'
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyCE7nP5eEnryJn-m2-i3u2jsk0uut_FbKU",
    authDomain: "internship-88b0a.firebaseapp.com",
    projectId: "internship-88b0a",
    storageBucket: "internship-88b0a.appspot.com",
    messagingSenderId: "513726120101",
    appId: "1:513726120101:web:1ea2957f981349465a8d4c",
    measurementId: "G-3QDLNMV7ZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// initialize Firebase Auth for that app immediately
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const storage = getStorage(app);
const database = getDatabase(app);
export { app, auth, getApp, getAuth, storage, getStorage , ref, database};
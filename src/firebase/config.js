import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
 
const firebaseConfig = {
  apiKey: "AIzaSyCUbVQ2crg7gEpMzrUH2oROtJm0G2TjjWw",
  authDomain: "cp1mobile-f804a.firebaseapp.com",
  projectId: "cp1mobile-f804a",
  databaseURL: "https://cp1mobile-f804a-default-rtdb.firebaseio.com",
  storageBucket: "cp1mobile-f804a.firebasestorage.app",
  messagingSenderId: "479253867482",
  appId: "1:479253867482:web:9843451529a970d003aee3",
  measurementId: "G-LSEB6BF057"
};
 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
 
export { auth, db };
 
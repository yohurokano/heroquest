// utils/authManager.ts
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
import { getDatabase, ref, set, get, child } from 'firebase/database';

// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export const authenticateUser = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error('Invalid email or password');
  }
};

export const createNewUser = async (email: string, password: string, username: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await set(ref(database, `users/${userCredential.user.uid}`), {
      username,
      email,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserData = async (userId: string) => {
  const snapshot = await get(child(ref(database), `users/${userId}`));
  return snapshot.val();
};

export const saveUserProgress = async (userId: string, data: any) => {
  await set(ref(database, `userProgress/${userId}`), data);
};

export const loadUserProgress = async (userId: string) => {
  const snapshot = await get(child(ref(database), `userProgress/${userId}`));
  return snapshot.val();
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const signOutUser = async () => {
  await signOut(auth);
};
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyBn46ddx4hKgm0bRD7l_K3uWpXXH9m3_wY',
  authDomain: 'smarthome-7cf27.firebaseapp.com',
  databaseURL: 'https://smarthome-7cf27-default-rtdb.firebaseio.com',
  projectId: 'smarthome-7cf27',
  storageBucket: 'smarthome-7cf27.firebasestorage.app',
  messagingSenderId: '452816489465',
  appId: '1:452816489465:web:f2acc1d90cfcc67e43cb28',
  measurementId: 'G-WTGN5XQFSJ',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export const subscribe = (path, cb) => {
  const r = ref(db, path);
  return onValue(r, (snap) => cb(snap.val()), (err) => console.error('FB error', path, err));
};

export const writeValue = async (path, value) => { await set(ref(db, path), value); };
export const updateValue = async (path, updates) => { await update(ref(db, path), updates); };
export { db, auth };

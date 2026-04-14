import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyBDD8YlzdXdngMfRPbZTVC7kz1go7O2x-4",
  authDomain: "dialectdash-minigames.firebaseapp.com",
  projectId: "dialectdash-minigames",
  storageBucket: "dialectdash-minigames.firebasestorage.app",
  messagingSenderId: "894720062714",
  appId: "1:894720062714:web:6f1a0b17f0e3dde7458543"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: Platform.OS === 'web' ? undefined : getReactNativePersistence(AsyncStorage)
});

// NEW: Initialize the Cloud Database!
export const db = getFirestore(app);
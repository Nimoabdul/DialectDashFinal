import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebase.js';

// Screen Imports
import AuthScreen from './src/screens/AuthScreen.js';
import HomeScreen from './src/screens/HomeScreen.js';
import GameScreen from './src/screens/GameScreen.js';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase login state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null; // Prevents flashing while checking login status

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {/* IF USER IS NOT LOGGED IN */}
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          /* IF USER IS LOGGED IN */
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Game" component={GameScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
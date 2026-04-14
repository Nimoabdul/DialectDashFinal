import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
// Added the missing Firebase imports here!
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase.js';
import { COLORS, STYLES } from '../config/theme.js';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Hold up!', 'Please fill in both your email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // Note: If you are using App.js as the "bouncer", navigation.replace might not be 
      // needed since Firebase onAuthStateChanged will automatically switch screens.
      // But it's good to have as a fallback!
      if (navigation.replace) navigation.replace('Home');
    } catch (error) {
      Alert.alert('Authentication Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardWrapper}
      >
        {/* TOP BRANDING AREA */}
        <View style={styles.headerArea}>
          <View style={styles.iconCircle}>
            <Ionicons name="planet" size={60} color={COLORS.primaryBlue} />
          </View>
          <Text style={styles.title}>DialectDash</Text>
          <Text style={styles.subtitle}>Master a language through play</Text>
        </View>

        {/* BOTTOM FORM CARD */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{isLoginMode ? 'Welcome Back!' : 'Create Account'}</Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.lightGrey} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={COLORS.lightGrey}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.lightGrey} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.lightGrey}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleAuth}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{isLoginMode ? 'LOG IN' : 'SIGN UP'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setIsLoginMode(!isLoginMode)}
            style={styles.switchContainer}
          >
            <Text style={styles.switchTextNormal}>
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <Text style={styles.switchTextBold}>
                {isLoginMode ? "Sign Up" : "Log In"}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.primaryBlue // Deep blue background
  },
  keyboardWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...STYLES.shadow
  },
  title: { 
    fontSize: 36, 
    fontWeight: '900', 
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: { 
    fontSize: 16, 
    color: 'rgba(255, 255, 255, 0.8)', 
    marginTop: 8,
    fontWeight: '500'
  },
  formCard: { 
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
    ...STYLES.shadow
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '500'
  },
  primaryButton: {
    backgroundColor: COLORS.successGreen,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: COLORS.successGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  switchContainer: { 
    marginTop: 25, 
    alignItems: 'center',
    paddingVertical: 10,
  },
  switchTextNormal: { 
    color: COLORS.lightGrey, 
    fontSize: 15,
    fontWeight: '500'
  },
  switchTextBold: {
    color: COLORS.primaryBlue,
    fontWeight: '800'
  }
});
import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, 
  Platform, Image 
} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../config/firebase.js';
import { COLORS, STYLES } from '../config/theme.js';
import { Ionicons } from '@expo/vector-icons';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry!', 'We need camera roll permissions to upload a profile picture.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, 
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleAuth = async () => {
    if (!email || !password || (!isLoginMode && !name)) {
      Alert.alert('Hold up!', 'Please fill in all the required fields.');
      return;
    }

    setLoading(true);
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // This attaches their name to their Firebase profile!
        await updateProfile(userCredential.user, {
          displayName: name
        });
      }
    } catch (error) {
      Alert.alert('Authentication Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardWrapper}>
        <View style={styles.headerArea}>
          <View style={styles.iconCircle}>
            <Ionicons name="planet" size={60} color={COLORS.primaryBlue} />
          </View>
          <Text style={styles.title}>DialectDash</Text>
          <Text style={styles.subtitle}>Master a language through play</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{isLoginMode ? 'Welcome Back!' : 'Create Account'}</Text>
          
          {!isLoginMode && (
            <>
              <TouchableOpacity style={styles.pfpContainer} onPress={pickImage}>
                {profilePic ? (
                  <Image source={{ uri: profilePic }} style={styles.pfpImage} />
                ) : (
                  <View style={styles.pfpPlaceholder}>
                    <Ionicons name="camera" size={30} color={COLORS.lightGrey} />
                    <Text style={styles.pfpText}>Add Photo</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={COLORS.lightGrey} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor={COLORS.lightGrey}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </>
          )}

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

          <TouchableOpacity style={styles.primaryButton} onPress={handleAuth} disabled={loading} activeOpacity={0.8}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isLoginMode ? 'LOG IN' : 'SIGN UP'}</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              setIsLoginMode(!isLoginMode);
              setEmail(''); setPassword(''); setName(''); setProfilePic(null);
            }}
            style={styles.switchContainer}
          >
            <Text style={styles.switchTextNormal}>
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <Text style={styles.switchTextBold}>{isLoginMode ? "Sign Up" : "Log In"}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryBlue },
  keyboardWrapper: { flex: 1, justifyContent: 'space-between' },
  headerArea: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20 },
  iconCircle: { width: 90, height: 90, backgroundColor: '#fff', borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 15, ...STYLES.shadow },
  title: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  subtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', marginTop: 5, fontWeight: '500' },
  formCard: { backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 30, paddingTop: 30, paddingBottom: Platform.OS === 'ios' ? 40 : 20, ...STYLES.shadow },
  formTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textDark, marginBottom: 20 },
  pfpContainer: { alignSelf: 'center', marginBottom: 20 },
  pfpPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#e2e8f0', borderStyle: 'dashed' },
  pfpImage: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: COLORS.primaryBlue },
  pfpText: { fontSize: 10, color: COLORS.lightGrey, fontWeight: 'bold', marginTop: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 16, marginBottom: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: COLORS.textDark, fontWeight: '500' },
  primaryButton: { backgroundColor: COLORS.successGreen, paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 10, shadowColor: COLORS.successGreen, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 1.5 },
  switchContainer: { marginTop: 20, alignItems: 'center', paddingVertical: 10 },
  switchTextNormal: { color: COLORS.lightGrey, fontSize: 15, fontWeight: '500' },
  switchTextBold: { color: COLORS.primaryBlue, fontWeight: '800' }
});
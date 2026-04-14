import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.js';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, STYLES } from '../config/theme.js';

const SELECTIONS = [
  { id: 'fr', name: 'French', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
  { id: 'es', name: 'Spanish', image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800' },
  { id: 'it', name: 'Italian', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800' },
  { id: 'de', name: 'German', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800' },
];

export default function HomeScreen({ navigation }) {
  const [highScore, setHighScore] = useState(0);
  
  const user = auth.currentUser;
  const displayName = user?.displayName || 'Explorer';
  const firstInitial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const loadScore = async () => {
      if (user) {
        try {
          // Fetch their saved score from the Firebase Cloud!
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().highScore) {
            setHighScore(docSnap.data().highScore);
          }
        } catch (e) {
          console.log("Score fetch error: ", e);
        }
      }
    };

    const unsubscribe = navigation.addListener('focus', loadScore);
    return unsubscribe;
  }, [navigation, user]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{firstInitial}</Text></View>
          <View>
            <Text style={styles.welcomeText}>Welcome, {displayName}!</Text>
            <Text style={styles.scoreText}>🏆 Cloud Score: {highScore}</Text>
          </View>
        </View>
        
        <TouchableOpacity onPress={() => signOut(auth)}>
          <Ionicons name="log-out-outline" size={32} color={COLORS.primaryRed} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Pick a Language</Text>
        {SELECTIONS.map((item) => (
          <Pressable key={item.id} style={styles.card} onPress={() => navigation.navigate('Game', { language: item.id, languageName: item.name })}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardOverlay}>
              <View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubTitle}>Start Lesson</Text>
              </View>
              <Ionicons name="chevron-forward-circle" size={40} color="#fff" />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 45, height: 45, borderRadius: 22, backgroundColor: COLORS.primaryBlue, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  welcomeText: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark },
  scoreText: { fontSize: 14, color: COLORS.primaryBlue, fontWeight: '700', marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: COLORS.lightGrey, marginBottom: 15, letterSpacing: 1.5, textTransform: 'uppercase' },
  scrollContent: { padding: 20 },
  card: { height: 180, borderRadius: 25, marginBottom: 20, overflow: 'hidden', ...STYLES.shadow },
  cardImage: { ...StyleSheet.absoluteFillObject },
  cardOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', padding: 25 },
  cardTitle: { color: '#fff', fontSize: 28, fontWeight: '900' },
  cardSubTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' }
});
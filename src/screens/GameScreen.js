import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar, Animated, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, STYLES } from '../config/theme.js';

// --- FIREBASE IMPORTS ---
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.js';

// --- MINIGAME IMPORTS ---
import ShapesMinigame from '../minigames/ShapesMinigame.js';
import ColorsMinigame from '../minigames/ColorsMinigame.js';
import AnimalsMinigame from '../minigames/AnimalsMinigame.js';
import MathMinigame from '../minigames/MathMinigame.js';
import FoodSortMinigame from '../minigames/FoodSortMinigame.js';
import CountObjectsMinigame from '../minigames/CountObjectsMinigame.js';
import ComparisonMinigame from '../minigames/ComparisonMinigame.js';
import ShoppingListMinigame from '../minigames/ShoppingListMinigame.js';
import DirectionsMinigame from '../minigames/DirectionsMinigame.js'; 
import WeatherMinigame from '../minigames/WeatherMinigame.js';
import TransportMinigame from '../minigames/TransportMinigame.js';
import PlacesMinigame from '../minigames/PlacesMinigame.js';
import BodyPartsMinigame from '../minigames/BodyPartsMinigame.js';
import FeedbackScreen from '../components/FeedbackScreen.js';

export default function GameScreen({ route, navigation }) {
  const { language, languageName, isMath } = route.params || { language: 'fr', languageName: 'French', isMath: false };
  
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(4);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentVocab, setCurrentVocab] = useState([]);
  
  const [gameType, setGameType] = useState(isMath ? 'math' : 'colors');

  const ROUND_GOAL = 10; 
  const TIME_LIMIT = Math.max(3000, 8000 - ((level - 1) * 1000)); 
  
  const timerAnim = useRef(new Animated.Value(1)).current;
  const currentAnimation = useRef(null);

  // --- GRAB USER DATA FOR THE UI ---
  const user = auth.currentUser;
  const displayName = user?.displayName || 'Explorer';
  const firstInitial = displayName.charAt(0).toUpperCase();
  const profilePic = user?.photoURL; // Grab the saved picture URL!

  // --- FIREBASE SCORE SAVING ---
  const handleFinalScoreSaving = async (finalScore) => {
    try {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        let currentHigh = 0;
        if (docSnap.exists() && docSnap.data().highScore) {
          currentHigh = docSnap.data().highScore;
        }
        
        if (finalScore > currentHigh) {
          await setDoc(docRef, { highScore: finalScore }, { merge: true });
        }
      }
    } catch (e) {
      console.error("Error saving score to Firebase:", e);
    }
  };

  const startTimer = useCallback(() => {
    timerAnim.setValue(1);
    currentAnimation.current = Animated.timing(timerAnim, {
      toValue: 0,
      duration: TIME_LIMIT,
      useNativeDriver: false,
    });

    currentAnimation.current.start(({ finished }) => {
      if (finished && !showFeedback && !gameOver && !lessonComplete && !isPaused) {
        handleFailure(); 
      }
    });
  }, [showFeedback, gameOver, lessonComplete, isPaused, TIME_LIMIT]);

  useEffect(() => {
    if (!showFeedback && !gameOver && !lessonComplete && !isPaused && gameType) {
        startTimer();
    }
    return () => { if (currentAnimation.current) currentAnimation.current.stop(); };
  }, [gameType, showFeedback, isPaused, startTimer, gameOver, lessonComplete]);

  useEffect(() => {
    if (lives <= 0 && !gameOver) {
      if (currentAnimation.current) currentAnimation.current.stop();
      setGameOver(true);
      handleFinalScoreSaving(score);
    }
    if (round > ROUND_GOAL && !lessonComplete) {
      if (currentAnimation.current) currentAnimation.current.stop();
      setLessonComplete(true);
      handleFinalScoreSaving(score);
    }
  }, [lives, round, score, gameOver, lessonComplete]);

  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      if (currentAnimation.current) currentAnimation.current.stop();
      setIsPaused(true);
    }
  };

  const getRandomGameType = () => {
    const types = isMath 
      ? ['math'] 
      : [
          'shapes', 'colors', 'animals', 'foodSort', 'shoppingList', 
          'directions', 'countObjects', 'comparison', 'weather', 
          'transport', 'places', 'bodyParts'
        ];
    return types[Math.floor(Math.random() * types.length)];
  };

  const handleNextLevel = () => {
    setLevel(prev => prev + 1);
    setRound(1);
    setLives(4);
    setLessonComplete(false); 
    setGameType(getRandomGameType());
  };

  const handleSuccess = () => {
    if (currentAnimation.current) currentAnimation.current.stop();
    setScore(prev => prev + (100 * level));
    setRound(prev => prev + 1);
    
    setGameType(null);
    setTimeout(() => {
        setGameType(getRandomGameType());
    }, 50);
  };

  const handleFailure = (vocabMapping) => {
    if (currentAnimation.current) currentAnimation.current.stop();
    setLives(prev => prev - 1);
    
    if (vocabMapping && vocabMapping.length > 0) {
      setCurrentVocab(vocabMapping);
      setShowFeedback(true);
    } else {
      setGameType(null);
      setTimeout(() => {
        setGameType(getRandomGameType());
      }, 50);
    }
  };

  if (lessonComplete || gameOver) {
    return (
      <SafeAreaView style={styles.overlayContainer}>
        <View style={styles.endCard}>
          <Ionicons 
            name={lessonComplete ? "trophy" : "heart-dislike"} 
            size={100} 
            color={lessonComplete ? "#fbbf24" : COLORS.primaryRed} 
          />
          <Text style={styles.victoryTitle}>
            {lessonComplete ? `LEVEL ${level} CLEARED!` : "GAME OVER"}
          </Text>
          <Text style={styles.subTitle}>
            {lessonComplete ? "Ready to go faster?" : "Don't give up, try again!"}
          </Text>
          
          <View style={styles.statsContainer}>
             <View style={styles.statBox}>
                <Text style={styles.statLabel}>SCORE</Text>
                <Text style={styles.statValue}>{score}</Text>
             </View>
             {lessonComplete && (
               <View style={styles.statBox}>
                  <Text style={styles.statLabel}>SPEED</Text>
                  <Text style={[styles.statValue, { color: COLORS.primaryRed }]}>
                    +1.0s
                  </Text>
               </View>
             )}
          </View>

          {lessonComplete && (
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: COLORS.successGreen, marginBottom: 15 }]} 
              onPress={handleNextLevel}
            >
              <Text style={styles.buttonText}>START LEVEL {level + 1}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: gameOver ? COLORS.primaryBlue : '#f3f4f6' }]} 
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={[styles.buttonText, { color: gameOver ? '#fff' : COLORS.textDark }]}>
              {gameOver ? "BACK TO MENU" : "SAVE & QUIT"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (showFeedback) {
    return <FeedbackScreen vocabulary={currentVocab} onNext={() => setShowFeedback(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Modal visible={isPaused} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.pauseCard}>
            <Ionicons name="pause-circle" size={80} color={COLORS.primaryBlue} />
            <Text style={styles.pauseTitle}>Paused</Text>
            <TouchableOpacity style={styles.resumeButton} onPress={togglePause}>
              <Text style={styles.buttonText}>RESUME</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exitButton} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.exitText}>QUIT GAME</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.appTitle}>{isMath ? "Math Area" : languageName} - Lvl {level}</Text>
        <TouchableOpacity onPress={togglePause}>
          <Ionicons name="pause" size={28} color={COLORS.primaryBlue} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {/* --- DYNAMIC PROFILE PICTURE & INITIAL --- */}
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstInitial}</Text>
          </View>
        )}
        
        <View style={styles.progressWrapper}>
          {/* --- USERNAME DISPLAY --- */}
          <Text style={styles.playerName}>{displayName}</Text>
          <View style={styles.progressBarBackground}>
             <View style={[styles.progressBarFill, { width: `${((round-1)/ROUND_GOAL)*100}%` }]} />
          </View>
        </View>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      <View style={styles.timerWrapper}>
        <Animated.View style={[
          styles.timerBar, 
          { 
            width: timerAnim.interpolate({inputRange: [0, 1], outputRange: ['0%', '100%']}), 
            backgroundColor: TIME_LIMIT <= 4000 
              ? timerAnim.interpolate({inputRange: [0, 0.5, 1], outputRange: [COLORS.primaryRed, COLORS.primaryRed, '#fbbf24']}) 
              : timerAnim.interpolate({inputRange: [0, 0.3, 1], outputRange: [COLORS.primaryRed, '#fbbf24', COLORS.primaryBlue]}) 
          }
        ]} />
      </View>

      {/* --- ALL 13 GAMES RENDERED HERE --- */}
      <View style={styles.gameCard}>
        {gameType === 'shapes' && <ShapesMinigame language={language} onSuccess={handleSuccess} onFailure={handleFailure} />}
        {gameType === 'colors' && <ColorsMinigame language={language} onSuccess={handleSuccess} onFailure={handleFailure} />}
        {gameType === 'animals' && <AnimalsMinigame language={language} onSuccess={handleSuccess} onFailure={handleFailure} />}
        {gameType === 'math' && <MathMinigame onSuccess={handleSuccess} onFailure={handleFailure} />}
        {gameType === 'foodSort' && <FoodSortMinigame language={language} onSuccess={handleSuccess} onFailure={handleFailure} />}
        {gameType === 'countObjects' && <CountObjectsMinigame language={language} onSuccess={handleSuccess} onFailure={handleFailure} />}
        {gameType === 'comparison' && <ComparisonMinigame language={language} onSuccess={handleSuccess} onFailure={handleFailure} />}
        {gameType === 'shoppingList' && <ShoppingListMinigame language={language} onSuccess={handleSuccess} onFailure={handleFailure} />}
        {gameType === 'directions' && <DirectionsMinigame language={language} onSuccess={handleSuccess} onFailure={handleFailure} />}
        {gameType === 'weather' && <WeatherMinigame language={language} onSuccess={handleSuccess} onFailure={handleFailure} />}
        {gameType === 'transport' && <TransportMinigame language={language} onSuccess={handleSuccess} onFailure={handleFailure} />}
        {gameType === 'places' && <PlacesMinigame language={language} onSuccess={handleSuccess} onFailure={handleFailure} />}
        {gameType === 'bodyParts' && <BodyPartsMinigame language={language} onSuccess={handleSuccess} onFailure={handleFailure} />}
      </View>

      <View style={styles.livesContainer}>
        {[...Array(4)].map((_, i) => (
          <Ionicons key={i} name="heart" size={28} color={i < lives ? COLORS.primaryRed : COLORS.cardBorder} style={{ marginHorizontal: 5 }} />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  appTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },
  statsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  
  // --- NEW AVATAR STYLES ---
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryBlue, justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: COLORS.primaryBlue },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  playerName: { fontSize: 12, fontWeight: 'bold', color: COLORS.lightGrey, marginBottom: 4, marginLeft: 2 },
  
  progressWrapper: { flex: 1, marginHorizontal: 15 },
  progressBarBackground: { height: 10, backgroundColor: '#f3f4f6', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.successGreen },
  scoreValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primaryBlue },
  timerWrapper: { height: 12, backgroundColor: '#f3f4f6', marginHorizontal: 20, marginBottom: 15, borderRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' },
  timerBar: { height: '100%' },
  gameCard: { flex: 1, marginHorizontal: 20, borderRadius: 24, padding: 20, backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.cardBorder, ...STYLES.shadow },
  livesContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 30 },
  
  overlayContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  endCard: { width: '85%', alignItems: 'center', padding: 30, backgroundColor: '#fff', borderRadius: 30, ...STYLES.shadow },
  victoryTitle: { fontSize: 28, fontWeight: '900', color: COLORS.textDark, marginTop: 20, textAlign: 'center' },
  subTitle: { fontSize: 16, color: COLORS.lightGrey, marginBottom: 25, textAlign: 'center' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  statBox: { alignItems: 'center', flex: 1 },
  statLabel: { fontSize: 12, fontWeight: 'bold', color: COLORS.lightGrey, letterSpacing: 1 },
  statValue: { fontSize: 24, fontWeight: '900', color: COLORS.primaryBlue },
  primaryButton: { paddingVertical: 18, paddingHorizontal: 20, borderRadius: 30, width: '100%', alignItems: 'center' },
  buttonText: { fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  pauseCard: { width: '75%', backgroundColor: '#fff', borderRadius: 30, padding: 30, alignItems: 'center' },
  pauseTitle: { fontSize: 24, fontWeight: '800', marginVertical: 20 },
  resumeButton: { backgroundColor: COLORS.primaryBlue, paddingVertical: 15, width: '100%', borderRadius: 25, alignItems: 'center' },
  exitButton: { marginTop: 15 },
  exitText: { color: COLORS.primaryRed, fontWeight: 'bold' }
});
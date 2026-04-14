import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, STYLES } from '../config/theme.js';

// Fully translated directions
const DIRECTIONS = [
  { id: 'north', en: 'NORTH', fr: 'NORD', es: 'NORTE', it: 'NORD', de: 'NORDEN' },
  { id: 'south', en: 'SOUTH', fr: 'SUD', es: 'SUR', it: 'SUD', de: 'SÜDEN' },
  { id: 'east', en: 'EAST', fr: 'EST', es: 'ESTE', it: 'EST', de: 'OSTEN' },
  { id: 'west', en: 'WEST', fr: 'OUEST', es: 'OESTE', it: 'OVEST', de: 'WESTEN' },
];

export default function DirectionsMinigame({ language, onSuccess, onFailure }) {
  const [current, setCurrent] = useState(DIRECTIONS[0]);
  const [timeLeft, setTimeLeft] = useState(4.0); // Internal rapid timer
  const [bossHP, setBossHP] = useState(100);
  const [playerHP, setPlayerHP] = useState(100);

  const flashAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [flashColor, setFlashColor] = useState(COLORS.cardBg);

  const nextRound = () => {
    const random = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    setCurrent(random);
    setTimeLeft(4.0); // Reset the mini-timer for the new direction
  };

  useEffect(() => {
    nextRound();
  }, []);

  // Internal visual timer logic
  useEffect(() => {
    const t = setTimeout(() => {
      // Only tick down if the player is still alive
      if (playerHP > 0 && bossHP > 0) {
        if (timeLeft <= 0) {
          handleFail();
        } else {
          setTimeLeft(prev => +(prev - 0.1).toFixed(1));
          if (timeLeft <= 1.0) triggerShake();
        }
      }
    }, 100);
    return () => clearTimeout(t);
  }, [timeLeft, playerHP, bossHP]);

  const triggerFlash = (type) => {
    setFlashColor(type === 'green' ? '#dcfce7' : '#fee2e2');
    flashAnim.setValue(0);
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
      Animated.timing(flashAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const triggerShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const handleFail = () => {
    triggerFlash('red');
    triggerShake();
    
    // Deduct ~34 HP per mistake (gives them 3 lives before dying)
    const newHP = playerHP - 34; 
    
    if (newHP <= 0) {
      setPlayerHP(0);
      setTimeout(() => {
        onFailure([{ targetWord: current[language], nativeWord: current.en }]);
      }, 400);
    } else {
      // If they are still alive, keep the game going!
      setPlayerHP(newHP);
      nextRound(); 
    }
  };

  const handlePress = (directionEN) => {
    if (directionEN === current.en) {
      triggerFlash('green');
      setBossHP(0); // 1-hit KO on the boss to keep the game fast-paced
      
      setTimeout(() => {
        onSuccess();
      }, 400);
    } else {
      handleFail();
    }
  };

  const backgroundColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.cardBg, flashColor],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Animated.View style={{ transform: [{ translateX: shakeAnim }], alignItems: 'center' }}>
        
        <Text style={styles.title}>Defeat the Compass!</Text>

        {/* HP BARS */}
        <View style={styles.hpContainer}>
          <View style={styles.hpLabelRow}>
            <Text style={styles.hpLabel}>You</Text>
            <Text style={styles.hpLabel}>Boss</Text>
          </View>
          <View style={styles.hpBarRow}>
            <View style={styles.hpBar}>
              <View style={[styles.hpFill, { width: `${playerHP}%`, backgroundColor: COLORS.successGreen }]} />
            </View>
            <View style={{width: 10}} />
            <View style={styles.hpBar}>
              <View style={[styles.hpFill, { width: `${bossHP}%`, backgroundColor: COLORS.primaryRed }]} />
            </View>
          </View>
        </View>

        <Text style={[styles.timer, { color: timeLeft <= 1.5 ? COLORS.primaryRed : COLORS.lightGrey }]}>
          {timeLeft.toFixed(1)}s
        </Text>

        <Text style={styles.instruction}>
          {current[language]}
        </Text>

        {/* COMPASS GRID */}
        <View style={styles.grid}>
          <TouchableOpacity onPress={() => handlePress("NORTH")} style={styles.btn}>
            <Text style={styles.btnText}>NORTH</Text>
          </TouchableOpacity>

          <View style={styles.middleRow}>
            <TouchableOpacity onPress={() => handlePress("WEST")} style={styles.btn}>
              <Text style={styles.btnText}>WEST</Text>
            </TouchableOpacity>

            <View style={styles.center}>
                <Ionicons name="compass-outline" size={40} color={COLORS.lightGrey} />
            </View>

            <TouchableOpacity onPress={() => handlePress("EAST")} style={styles.btn}>
              <Text style={styles.btnText}>EAST</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => handlePress("SOUTH")} style={styles.btn}>
            <Text style={styles.btnText}>SOUTH</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 10, borderRadius: 20 },
  title: { fontSize: 20, textAlign: 'center', fontWeight: 'bold', color: COLORS.textDark, marginBottom: 15 },
  
  hpContainer: { width: '100%', marginBottom: 15 },
  hpLabelRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, marginBottom: 5 },
  hpLabel: { fontSize: 12, fontWeight: 'bold', color: COLORS.lightGrey },
  hpBarRow: { flexDirection: 'row', justifyContent: 'space-between' },
  hpBar: { flex: 1, height: 12, backgroundColor: '#e2e8f0', borderRadius: 6, overflow: 'hidden' },
  hpFill: { height: '100%' },

  timer: { textAlign: 'center', fontWeight: '900', marginBottom: 10, fontSize: 18 },
  instruction: { textAlign: 'center', fontSize: 32, marginBottom: 30, fontWeight: '900', color: COLORS.primaryBlue, textTransform: 'uppercase' },
  
  grid: { alignItems: 'center', width: '100%' },
  middleRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  center: { width: 60, height: 60, justifyContent: 'center', alignItems: 'center' },
  btn: { backgroundColor: COLORS.primaryBlue, paddingVertical: 15, paddingHorizontal: 20, borderRadius: 15, minWidth: 90, alignItems: 'center', ...STYLES.shadow },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
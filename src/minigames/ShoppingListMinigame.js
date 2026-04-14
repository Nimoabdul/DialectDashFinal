import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DICTIONARY } from '../data/translations.js';
import { COLORS, STYLES } from '../config/theme.js';

export default function ShoppingListMinigame({ language, onSuccess, onFailure }) {
  const [options, setOptions] = useState([]);
  const [target, setTarget] = useState(null);

  const generateLevel = useCallback(() => {
    const allFood = DICTIONARY.food;
    const shuffled = [...allFood].sort(() => 0.5 - Math.random());
    
    // Pick 4 random items for the grid
    const selection = shuffled.slice(0, 4);
    const goal = selection[Math.floor(Math.random() * selection.length)];

    setOptions(selection);
    setTarget(goal);
  }, []);

  useEffect(() => {
    generateLevel();
  }, [generateLevel]);

  const handleAnswer = (choice) => {
    if (choice.id === target.id) {
      onSuccess(); 
      // Removed generateLevel() here because GameScreen automatically mounts a fresh game!
    } else {
      onFailure([
        { targetWord: target[language], nativeWord: target.en }
      ]);
    }
  };

  if (!target) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>
        {DICTIONARY.ui.findThe[language]} <Text style={styles.highlightText}>{target[language]}</Text>
      </Text>

      <View style={styles.grid}>
        {options.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.foodCard}
            onPress={() => handleAnswer(item)}
          >
            <Text style={styles.icon}>{item.icon}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  instructionText: { fontSize: 24, fontWeight: '700', color: COLORS.textDark, marginBottom: 30, textAlign: 'center' },
  highlightText: { color: COLORS.primaryBlue, textTransform: 'uppercase' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%' },
  foodCard: {
    width: '40%',
    aspectRatio: 1,
    backgroundColor: '#fff', // Changed to white so it pops more
    margin: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...STYLES.shadow,
  },
  icon: { fontSize: 50 },
});
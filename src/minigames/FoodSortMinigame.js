import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DICTIONARY } from '../data/translations.js';
import { COLORS, STYLES } from '../config/theme.js';

export default function FoodSortMinigame({ language, onSuccess, onFailure }) {
  const [item, setItem] = useState(null);

  const generateLevel = useCallback(() => {
    const allFood = DICTIONARY.food;
    const randomItem = allFood[Math.floor(Math.random() * allFood.length)];
    setItem(randomItem);
  }, []);

  useEffect(() => { generateLevel(); }, [generateLevel]);

  const handleChoice = (type) => {
    if (type === item.type) {
      onSuccess();
      generateLevel();
    } else {
      onFailure([{ 
        targetWord: DICTIONARY.categories[item.type][language], 
        nativeWord: DICTIONARY.categories[item.type].en 
      }]);
    }
  };

  if (!item) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>{item.icon}</Text>
      <Text style={styles.foodName}>{item[language]}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.sortButton} onPress={() => handleChoice('fruit')}>
          <Text style={styles.buttonText}>{DICTIONARY.categories.fruit[language]}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.sortButton, { backgroundColor: COLORS.successGreen }]} onPress={() => handleChoice('veg')}>
          <Text style={styles.buttonText}>{DICTIONARY.categories.veg[language]}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  instructionText: { fontSize: 80, marginBottom: 10 },
  foodName: { fontSize: 24, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 40 },
  buttonRow: { width: '100%' },
  sortButton: {
    backgroundColor: COLORS.primaryBlue,
    paddingVertical: 18,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    ...STYLES.shadow
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '900' }
});
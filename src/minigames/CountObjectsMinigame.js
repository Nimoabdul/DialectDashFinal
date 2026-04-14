import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DICTIONARY } from '../data/translations.js';
import { COLORS, STYLES } from '../config/theme.js';

export default function CountObjectsMinigame({ language, onSuccess, onFailure }) {
  const [count, setCount] = useState(0);
  const [options, setOptions] = useState([]);

  const generateLevel = useCallback(() => {
    const correctCount = Math.floor(Math.random() * 5) + 1;
    const opts = new Set();
    opts.add(correctCount);
    while (opts.size < 3) { opts.add(Math.floor(Math.random() * 5) + 1); }
    setCount(correctCount);
    setOptions(Array.from(opts).sort((a, b) => a - b));
  }, []);

  useEffect(() => { generateLevel(); }, [generateLevel]);

  const handleAnswer = (selected) => {
    if (selected === count) {
      onSuccess();
      generateLevel();
    } else {
      onFailure([{ targetWord: DICTIONARY.numbers[count][language], nativeWord: DICTIONARY.numbers[count].en }]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>{DICTIONARY.ui.howMany[language]}</Text>
      
      <View style={styles.objectArea}>
        {[...Array(count)].map((_, i) => (
          <Text key={i} style={styles.star}>⭐</Text>
        ))}
      </View>

      <View style={styles.optionsRow}>
        {options.map((num) => (
          <TouchableOpacity key={num} style={styles.optionButton} onPress={() => handleAnswer(num)}>
            <Text style={styles.optionText}>{DICTIONARY.numbers[num][language]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  instructionText: { fontSize: 28, fontWeight: '900', color: COLORS.textDark, marginBottom: 20 },
  objectArea: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginVertical: 20, 
    height: 100 
  },
  star: { fontSize: 35, margin: 4 },
  optionsRow: { width: '100%', marginTop: 'auto' },
  optionButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 14,
    marginVertical: 6,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...STYLES.shadow
  },
  optionText: { fontSize: 18, fontWeight: 'bold', color: COLORS.primaryBlue }
});
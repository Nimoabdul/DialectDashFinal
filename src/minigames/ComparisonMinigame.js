import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DICTIONARY } from '../data/translations.js';
import { COLORS, STYLES } from '../config/theme.js';

export default function ComparisonMinigame({ language, onSuccess, onFailure }) {
  const [leftNum, setLeftNum] = useState(0);
  const [rightNum, setRightNum] = useState(0);
  const [mode, setMode] = useState('bigger'); // 'bigger' or 'smaller'

  const generateLevel = useCallback(() => {
    let n1 = Math.floor(Math.random() * 10) + 1;
    let n2 = Math.floor(Math.random() * 10) + 1;
    while (n1 === n2) { n2 = Math.floor(Math.random() * 10) + 1; }
    
    setLeftNum(n1);
    setRightNum(n2);
    setMode(Math.random() > 0.5 ? 'bigger' : 'smaller');
  }, []);

  useEffect(() => { generateLevel(); }, [generateLevel]);

  const handleAnswer = (selectedNum) => {
    const isCorrect = mode === 'bigger' 
      ? selectedNum > (selectedNum === leftNum ? rightNum : leftNum)
      : selectedNum < (selectedNum === leftNum ? rightNum : leftNum);

    if (isCorrect) {
      onSuccess();
      generateLevel();
    } else {
      const targetWord = mode === 'bigger' ? DICTIONARY.shapes.bigger[language] : DICTIONARY.shapes.smaller[language];
      const nativeWord = mode === 'bigger' ? 'BIGGER' : 'SMALLER';
      onFailure([{ targetWord, nativeWord }]);
    }
  };

  if (!leftNum) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>
        {DICTIONARY.ui.chooseThe[language]} <Text style={styles.highlight}>{mode === 'bigger' ? DICTIONARY.shapes.bigger[language] : DICTIONARY.shapes.smaller[language]}</Text>
      </Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.numberCard} onPress={() => handleAnswer(leftNum)}>
          <Text style={styles.numberText}>{leftNum}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.numberCard} onPress={() => handleAnswer(rightNum)}>
          <Text style={styles.numberText}>{rightNum}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  instructionText: { fontSize: 24, fontWeight: '800', color: COLORS.textDark, marginBottom: 40, textAlign: 'center' },
  highlight: { color: COLORS.primaryBlue, textTransform: 'uppercase' },
  row: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  numberCard: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    ...STYLES.shadow
  },
  numberText: { fontSize: 48, fontWeight: '900', color: COLORS.textDark }
});
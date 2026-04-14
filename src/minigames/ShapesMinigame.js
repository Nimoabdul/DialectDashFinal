import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, STYLES } from '../config/theme.js';

// Fully translated and self-contained data
const SHAPES_DATA = [
  { id: 'circle', icon: 'ellipse', en: 'CIRCLE', fr: 'CERCLE', es: 'CÍRCULO', it: 'CERCHIO', de: 'KREIS', color: '#ef4444' },
  { id: 'square', icon: 'square', en: 'SQUARE', fr: 'CARRÉ', es: 'CUADRADO', it: 'QUADRATO', de: 'QUADRAT', color: '#3b82f6' },
  { id: 'triangle', icon: 'triangle', en: 'TRIANGLE', fr: 'TRIANGLE', es: 'TRIÁNGULO', it: 'TRIANGOLO', de: 'DREIECK', color: '#22c55e' },
  { id: 'star', icon: 'star', en: 'STAR', fr: 'ÉTOILE', es: 'ESTRELLA', it: 'STELLA', de: 'STERN', color: '#facc15' },
  { id: 'heart', icon: 'heart', en: 'HEART', fr: 'CŒUR', es: 'CORAZÓN', it: 'CUORE', de: 'HERZ', color: '#ec4899' },
  // Swapped Hexagon for Moon to guarantee the icon renders correctly!
  { id: 'moon', icon: 'moon', en: 'MOON', fr: 'LUNE', es: 'LUNA', it: 'LUNA', de: 'MOND', color: '#a855f7' } 
];

const UI_TEXT = {
  findThe: { en: 'Find the', fr: 'Trouvez le', es: 'Encuentra el', it: 'Trova il', de: 'Finde das' }
};

export default function ShapesMinigame({ language, onSuccess, onFailure }) {
  const [options, setOptions] = useState([]);
  const [target, setTarget] = useState(null);

  const generateLevel = useCallback(() => {
    // Shuffle all available shapes
    const shuffled = [...SHAPES_DATA].sort(() => 0.5 - Math.random());
    
    // Pick 4 random shapes to display
    const selection = shuffled.slice(0, 4);
    
    // Pick 1 of those 4 to be the correct answer
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
        {UI_TEXT.findThe[language]} <Text style={styles.highlightText}>{target[language]}</Text>
      </Text>

      <View style={styles.grid}>
        {options.map((shape) => (
          <TouchableOpacity
            key={shape.id}
            style={styles.shapeCard}
            onPress={() => handleAnswer(shape)}
            activeOpacity={0.7}
          >
            <Ionicons name={shape.icon} size={70} color={shape.color} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  instructionText: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: COLORS.textDark, 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  highlightText: { 
    color: COLORS.primaryBlue, 
    textTransform: 'uppercase',
    fontWeight: '900'
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    width: '100%' 
  },
  shapeCard: {
    width: '40%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f1f5f9',
    ...STYLES.shadow,
  }
});
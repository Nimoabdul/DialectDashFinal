import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, STYLES } from '../config/theme.js';

const WEATHER_DATA = [
  { id: 'sun', icon: 'sunny', en: 'SUN', fr: 'SOLEIL', es: 'SOL', it: 'SOLE', de: 'SONNE', color: '#facc15' },
  { id: 'rain', icon: 'rainy', en: 'RAIN', fr: 'PLUIE', es: 'LLUVIA', it: 'PIOGGIA', de: 'REGEN', color: '#3b82f6' },
  { id: 'snow', icon: 'snow', en: 'SNOW', fr: 'NEIGE', es: 'NIEVE', it: 'NEVE', de: 'SCHNEE', color: '#7dd3fc' },
  { id: 'storm', icon: 'thunderstorm', en: 'STORM', fr: 'TEMPÊTE', es: 'TORMENTA', it: 'TEMPESTA', de: 'STURM', color: '#8b5cf6' },
  { id: 'cloud', icon: 'cloud', en: 'CLOUD', fr: 'NUAGE', es: 'NUBE', it: 'NUVOLA', de: 'WOLKE', color: '#94a3b8' }
];

const UI_TEXT = {
  findThe: { en: 'Find the', fr: 'Trouvez le/la', es: 'Encuentra el/la', it: 'Trova il/la', de: 'Finde' }
};

export default function WeatherMinigame({ language, onSuccess, onFailure }) {
  const [options, setOptions] = useState([]);
  const [target, setTarget] = useState(null);

  const generateLevel = useCallback(() => {
    const shuffled = [...WEATHER_DATA].sort(() => 0.5 - Math.random());
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
    } else {
      onFailure([{ targetWord: target[language], nativeWord: target.en }]);
    }
  };

  if (!target) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>
        {UI_TEXT.findThe[language]} <Text style={styles.highlightText}>{target[language]}</Text>
      </Text>

      <View style={styles.grid}>
        {options.map((weather) => (
          <TouchableOpacity
            key={weather.id}
            style={styles.card}
            onPress={() => handleAnswer(weather)}
            activeOpacity={0.7}
          >
            <Ionicons name={weather.icon} size={70} color={weather.color} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  instructionText: { fontSize: 24, fontWeight: '700', color: COLORS.textDark, marginBottom: 30, textAlign: 'center' },
  highlightText: { color: COLORS.primaryBlue, textTransform: 'uppercase', fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%' },
  card: { width: '40%', aspectRatio: 1, backgroundColor: '#fff', margin: 10, borderRadius: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#f1f5f9', ...STYLES.shadow }
});
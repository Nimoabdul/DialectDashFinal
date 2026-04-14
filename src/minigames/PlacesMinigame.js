import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, STYLES } from '../config/theme.js';

const PLACES_DATA = [
  { id: 'house', icon: 'home', en: 'HOUSE', fr: 'MAISON', es: 'CASA', it: 'CASA', de: 'HAUS', color: '#ef4444' },
  { id: 'school', icon: 'school', en: 'SCHOOL', fr: 'ÉCOLE', es: 'ESCUELA', it: 'SCUOLA', de: 'SCHULE', color: '#f59e0b' },
  { id: 'office', icon: 'business', en: 'OFFICE', fr: 'BUREAU', es: 'OFICINA', it: 'UFFICIO', de: 'BÜRO', color: '#3b82f6' },
  { id: 'hospital', icon: 'medkit', en: 'HOSPITAL', fr: 'HÔPITAL', es: 'HOSPITAL', it: 'OSPEDALE', de: 'KRANKENHAUS', color: '#22c55e' },
  { id: 'store', icon: 'cart', en: 'STORE', fr: 'MAGASIN', es: 'TIENDA', it: 'NEGOZIO', de: 'GESCHÄFT', color: '#a855f7' }
];

const UI_TEXT = {
  findThe: { en: 'Find the', fr: 'Trouvez le/la', es: 'Encuentra el/la', it: 'Trova il/la', de: 'Finde' }
};

export default function PlacesMinigame({ language, onSuccess, onFailure }) {
  const [options, setOptions] = useState([]);
  const [target, setTarget] = useState(null);

  const generateLevel = useCallback(() => {
    const shuffled = [...PLACES_DATA].sort(() => 0.5 - Math.random());
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
        {options.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleAnswer(item)}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon} size={70} color={item.color} />
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
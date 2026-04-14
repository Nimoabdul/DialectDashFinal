import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, STYLES } from '../config/theme.js';

const TRANSPORT_DATA = [
  { id: 'car', icon: 'car', en: 'CAR', fr: 'VOITURE', es: 'COCHE', it: 'AUTO', de: 'AUTO', color: '#ef4444' },
  { id: 'plane', icon: 'airplane', en: 'PLANE', fr: 'AVION', es: 'AVIÓN', it: 'AEREO', de: 'FLUGZEUG', color: '#0ea5e9' },
  { id: 'bike', icon: 'bicycle', en: 'BIKE', fr: 'VÉLO', es: 'BICI', it: 'BICI', de: 'FAHRRAD', color: '#22c55e' },
  { id: 'boat', icon: 'boat', en: 'BOAT', fr: 'BATEAU', es: 'BARCO', it: 'BARCA', de: 'BOOT', color: '#f59e0b' },
  { id: 'bus', icon: 'bus', en: 'BUS', fr: 'BUS', es: 'AUTOBÚS', it: 'AUTOBUS', de: 'BUS', color: '#8b5cf6' }
];

const UI_TEXT = {
  findThe: { en: 'Find the', fr: 'Trouvez le/la', es: 'Encuentra el/la', it: 'Trova il/la', de: 'Finde' }
};

export default function TransportMinigame({ language, onSuccess, onFailure }) {
  const [options, setOptions] = useState([]);
  const [target, setTarget] = useState(null);

  const generateLevel = useCallback(() => {
    const shuffled = [...TRANSPORT_DATA].sort(() => 0.5 - Math.random());
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
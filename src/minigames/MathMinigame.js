import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../config/theme";

export default function MathMinigame({ onSuccess, onFailure }) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    const correct = n1 + n2;
    setA(n1); 
    setB(n2);
    const opts = [correct, correct + 1, correct - 2].sort(() => Math.random() - 0.5);
    setOptions(opts);
  }, []);

  const handleChoice = (selected) => {
    const correct = a + b;
    if (selected === correct) {
      onSuccess();
    } else {
      // Send the math equation as the "vocabulary" for feedback
      onFailure([
        { targetWord: `${a} + ${b}`, nativeWord: `${correct}` }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{a} + {b} = ?</Text>
      <View style={styles.grid}>
        {options.map((opt, i) => (
          <TouchableOpacity key={i} style={styles.btn} onPress={() => handleChoice(opt)}>
            <Text style={styles.btnText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 48, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 40 },
  grid: { width: '100%', alignItems: 'center' },
  btn: { backgroundColor: COLORS.primaryBlue, width: '80%', padding: 18, borderRadius: 15, marginVertical: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 22, fontWeight: 'bold' }
});
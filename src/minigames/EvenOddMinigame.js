import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../config/theme";

export default function EvenOddMinigame({ onSuccess, onFailure }) {
  const [num, setNum] = useState(0);

  useEffect(() => {
    setNum(Math.floor(Math.random() * 99) + 1);
  }, []);

  const handlePress = (choice) => {
    const isEven = num % 2 === 0;
    if ((choice === 'even' && isEven) || (choice === 'odd' && !isEven)) {
      onSuccess();
    } else {
      onFailure();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Is it EVEN or ODD?</Text>
      <Text style={styles.number}>{num}</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={() => handlePress('even')}>
          <Text style={styles.btnText}>EVEN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.successGreen }]} onPress={() => handlePress('odd')}>
          <Text style={styles.btnText}>ODD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  instruction: { fontSize: 20, fontWeight: '700', color: COLORS.lightGrey, marginBottom: 10 },
  number: { fontSize: 80, fontWeight: '900', color: COLORS.textDark, marginBottom: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  btn: { backgroundColor: COLORS.primaryBlue, paddingHorizontal: 30, paddingVertical: 20, borderRadius: 15, width: '40%', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
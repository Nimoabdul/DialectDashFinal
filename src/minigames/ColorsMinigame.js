import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { COLORS, STYLES } from "../config/theme.js"; // Added STYLES import
import { DICTIONARY } from "../data/translations.js";

export default function ColorsMinigame({ language, onSuccess, onFailure }) {
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // 1. Get the full list of colors
    const colorList = [...DICTIONARY.colors];
    
    // 2. Shuffle the list to get 3 random colors
    const shuffled = colorList.sort(() => 0.5 - Math.random());
    const selectedOptions = shuffled.slice(0, 3);
    
    // 3. Pick one of those 3 as the target
    const randomTarget = selectedOptions[Math.floor(Math.random() * selectedOptions.length)];
    
    setTarget(randomTarget);
    setOptions(selectedOptions);
  }, []);

  const handlePress = (selectedColor) => {
    if (selectedColor.id === target.id) {
      onSuccess();
    } else {
      // Send the correct answer to FeedbackScreen
      onFailure([
        { targetWord: target[language], nativeWord: target.en }
      ]);
    }
  };

  if (!target) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>
        {DICTIONARY.ui.tapThe[language]} <Text style={{ color: target.hex }}>{target[language].toUpperCase()}</Text>
      </Text>

      <View style={styles.row}>
        {options.map((c) => (
          <Pressable
            key={c.id}
            style={[styles.colorCard, { backgroundColor: c.hex }]}
            onPress={() => handlePress(c)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  instructionText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 50,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  row: { 
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  colorCard: { 
    width: 90,
    height: 140,
    borderRadius: 20,
    // Using STYLES.shadow which is now imported
    ...STYLES.shadow, 
    elevation: 5, // Extra shadow boost for Android
  },
});
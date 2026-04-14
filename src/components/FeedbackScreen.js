import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../config/theme.js';

export default function FeedbackScreen({ vocabulary, onNext }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Centered Vocabulary List */}
      <View style={styles.vocabContainer}>
        {vocabulary.map((item, index) => (
          <View key={index} style={styles.vocabRow}>
            <View style={styles.wordBoxRight}>
              <Text style={styles.targetWord}>{item.targetWord.toUpperCase()}</Text>
            </View>
            
            <Text style={styles.hyphen}>-</Text>
            
            <View style={styles.wordBoxLeft}>
              <Text style={styles.nativeWord}>{item.nativeWord.toUpperCase()}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Large Exit Button at Bottom */}
      <TouchableOpacity style={styles.actionButton} onPress={onNext}>
        <Ionicons name="close-circle" size={100} color={COLORS.primaryRed} />
        <Text style={styles.wrongText}>WRONG!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center', // Centers everything vertically
  },
  vocabContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  vocabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  wordBoxRight: {
    flex: 1,
    alignItems: 'flex-end', // Aligns target word to the center hyphen
  },
  wordBoxLeft: {
    flex: 1,
    alignItems: 'flex-start', // Aligns native word to the center hyphen
  },
  targetWord: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primaryRed,
    marginRight: 15,
  },
  hyphen: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.lightGrey,
  },
  nativeWord: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.successGreen,
    marginLeft: 15,
  },
  actionButton: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  wrongText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primaryRed,
    letterSpacing: 2,
    marginTop: -5,
  }
});
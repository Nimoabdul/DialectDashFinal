import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../config/theme.js';

export default function SettingsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PREFERENCES</Text>
          <View style={styles.row}>
            <Text style={styles.rowText}>Daily Reminders</Text>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: COLORS.primaryBlue }} />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>Sound Effects</Text>
            <Switch value={sound} onValueChange={setSound} trackColor={{ true: COLORS.primaryBlue }} />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => alert('Signed Out')}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  section: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 30 },
  sectionLabel: { fontSize: 12, color: COLORS.lightGrey, fontWeight: '800', marginBottom: 15, letterSpacing: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  rowText: { fontSize: 16, fontWeight: '600' },
  logoutBtn: { backgroundColor: '#fee2e2', padding: 18, borderRadius: 20, alignItems: 'center' },
  logoutText: { color: COLORS.primaryRed, fontWeight: '800', fontSize: 16 }
});
// src/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreen = () => {
  return (
    <LinearGradient colors={['#2cc4a9', '#2cc4a9']} style={styles.container}>
      <Text style={styles.location}>Colombo</Text>

      <View style={styles.circle}>
        <Text style={styles.prayer}>Fajr Prayer in</Text>
        <Text style={styles.timer}>22 Minutes</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.icon}>🧎‍♂️</Text>
          <Text style={styles.menuText}>Prayer Times</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.icon}>🔄</Text>
          <Text style={styles.menuText}>Pair Device</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.icon}>⚙️</Text>
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  location: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  circle: {
    marginTop: 40,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayer: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
  },
  timer: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  menuContainer: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  },
  menuButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  icon: {
    fontSize: 26,
    marginBottom: 5,
  },
  menuText: {
    color: '#2cc4a9',
    fontSize: 13,
    textAlign: 'center',
  },
});

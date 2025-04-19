import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import useDisableBack from '../hooks/useDisableBack.js';

const FinalSetupScreen = ({ navigation }) => {
  useDisableBack();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(true);
    }, 3000); // 3 seconds loading

    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    navigation.navigate('HomeScreen'); // Change to your final route
  };

  return (
    <ImageBackground
      source={require('./assets/w-bg.jpg')} // Replace with your background image path
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* Background spinner */}
        {!showSuccess && (
          <>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Pushing settings to Azan Player...</Text>
          </>
        )}

        {/* Success Popup */}
        {showSuccess && (
          <View style={styles.popupCard}>
            <Text style={styles.successText}>Settings{'\n'}successfully pushed{'\n'}to Azan Player</Text>
            <TouchableOpacity style={styles.button} onPress={handleFinish}>
              <Text style={styles.buttonText}>Finish Setup</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default FinalSetupScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  popupCard: {
    backgroundColor: '#003a7f',
    paddingVertical: 30,
    paddingHorizontal: 35,
    borderRadius: 20,
    elevation: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    width: '85%',
  },
  successText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: '#003a7f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

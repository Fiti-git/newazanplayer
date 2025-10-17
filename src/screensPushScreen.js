import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import useDisableBack from '../hooks/useDisableBack';

const FinalSetupScreen = ({ navigation }) => {
  useDisableBack();
  const [showSuccess, setShowSuccess] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 3000); // simulate 3s processing

    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    navigation.navigate('HomeScreen'); // Update to correct screen
  };

  return (
    <ImageBackground
      source={require('./assets/w-bg.jpg')} // Centralize if needed later
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {!showSuccess ? (
          <>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Pushing settings to Azan Player...</Text>
          </>
        ) : (
          <Animated.View style={[styles.popupCard, { opacity: fadeAnim }]}>
            <Text style={styles.successText}>
              Settings{'\n'}successfully pushed{'\n'}to Azan Player
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleFinish}>
              <Text style={styles.buttonText}>Finish Setup</Text>
            </TouchableOpacity>
          </Animated.View>
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

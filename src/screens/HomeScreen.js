import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Add your image background here */}
      <Image
        source={require('../assets/w-bg.jpg')} // Replace with your actual background image path
        style={styles.backgroundImage}
      />

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')} // Replace with your actual logo image path
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.welcomeText}>Welcome to</Text>
      <Text style={styles.titleText}>ECHOSTICS</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Pairing')}
      >
        <Text style={styles.buttonText}>NEXT</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window'); // Get the screen width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  backgroundImage: {
    position: 'absolute', // Ensures the background image covers the entire screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    
  },
  logoContainer: {
    backgroundColor: '#fff',
    borderRadius: 999,
    padding: 30,
    marginBottom: 40, // Increased space between logo and text
    shadowColor: '#000', // Added shadow to logo for better visibility
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8, // For Android shadow
  },
  logo: {
    width: 150, // Adjusted logo size
    height: 150, // Adjusted logo size
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10, // Added space between text and title
  },
  titleText: {
    fontSize: 36, // Slightly increased font size
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 50, // More space before the button
  },
  button: {
    position: 'absolute',
    bottom: 40, // Move the button to the bottom
    width: '85%', // Set the width to 85% of the screen
    backgroundColor: '#fff', // Set the background color to white
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // Shadow for button
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 6, // Shadow blur radius
    elevation: 8, // For Android shadow
  },
  buttonText: {
    fontSize: 20,
    color: '#1A2A65', // Text color same as the dark blue gradient from the container
    fontWeight: '600',
  },
});

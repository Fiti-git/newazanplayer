import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useDisableBack from '../hooks/useDisableBack.js';

const ModeSelection = ({ navigation }) => {
  const [mode, setMode] = useState(null);
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  useDisableBack();

  const handleFinish = () => {
    navigation.navigate('PushScreen'); // Replace with your actual route
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground
        source={require('../assets/w-bg.jpg')} // Replace with your background image
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          {/* Online Mode Card */}
          <TouchableOpacity
            style={[styles.card, mode === 'online' && styles.cardSelected]}
            onPress={() => setMode('online')}
            activeOpacity={1}
          >
            <View style={styles.headerRow}>
              <Text style={styles.cardTitle}>Online Mode</Text>
              <View style={[styles.radio, mode === 'online' && styles.radioSelected]} />
            </View>
            <Text style={styles.cardDesc}>Prayer times will be based on accurate online data.</Text>

            {mode === 'online' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Wi-Fi SSID"
                  value={ssid}
                  onChangeText={setSsid}
                  placeholderTextColor="#999"
                />
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter Wi-Fi Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#999"
                    secureTextEntry
                  />
                </View>
              </>
            )}
          </TouchableOpacity>

          {/* Offline Mode Card */}
          <TouchableOpacity
            style={[styles.card, mode === 'offline' && styles.cardSelected]}
            onPress={() => setMode('offline')}
            activeOpacity={1}
          >
            <View style={styles.headerRow}>
              <Text style={styles.cardTitle}>Offline Mode</Text>
              <View style={[styles.radio, mode === 'offline' && styles.radioSelected]} />
            </View>
            <Text style={styles.cardDesc}>Prayer times will be calculated using the solar method.</Text>
          </TouchableOpacity>

          {/* Finish Button */}
          {mode && (
            <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
              <Text style={styles.finishText}>Finish</Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ModeSelection;

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center', // Center the content horizontally
    paddingBottom: 40, // Adds bottom space
  },
  card: {
    backgroundColor: '#003a7f',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDesc: {
    color: '#eee',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 20,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  radioSelected: {
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 15,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  finishButton: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    width: '85%', // Set the width to 85% of the screen width
    alignSelf: 'center', // Ensures it is centered in the container
  },
  finishText: {
    color: '#003a7f',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center', // Ensure the text is centered inside the button
  },
});

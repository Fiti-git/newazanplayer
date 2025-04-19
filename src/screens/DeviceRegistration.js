import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import useDisableBack from '../hooks/useDisableBack.js';

const DeviceRegistration = ({ navigation }) => {
  const [macAddress, setMacAddress] = useState('');
  const [showProceed, setShowProceed] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false); // For controlling modal visibility
  useDisableBack();
  const [deviceInfo, setDeviceInfo] = useState(null);


  useEffect(() => {
    // Simulate auto-fetching MAC address
    setTimeout(() => {
      setMacAddress('AA:BB:CC:DD:EE:01');
      setShowProceed(true);
    }, 2000);
  }, []);

  const handleCheckStatus = async () => {
    try {
      const response = await fetch('https://echostics.com/api_check_device.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'Echostic2025SecureKey!',
        },
        body: JSON.stringify({ mac_address: macAddress }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.status) {
        setDeviceInfo(data); // Save response for modal
        setModalVisible(true);
      } else {
        setDeviceInfo(null);
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      setDeviceInfo(null);
      alert("Connection failed: " + err.message);
    }
  };
  

  const handleProceed = () => {
    navigation.navigate('Configuration');
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Top Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/icon_logo.png')} // Replace with actual logo
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Background Image */}
      <Image
        source={require('../assets/w-bg.jpg')} // The background image for the container
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Device Image at the center */}
      <View style={styles.deviceImageContainer}>
        <Image
          source={require('../assets/02.png')} // Replace with the actual device image
          style={styles.deviceImage}
          resizeMode="contain"
        />
      </View>

      {/* Content Section */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Serial Number of the Azan Player</Text>
        <TextInput
          style={styles.input}
          value={macAddress}
          editable={false}
          placeholder="Enter Serial Number"
          placeholderTextColor="#b0e0e6" // Lighter placeholder text
        />

        <TouchableOpacity style={styles.checkButton} onPress={handleCheckStatus}>
          <Text style={styles.checkButtonText}>Check Registration Status</Text>
        </TouchableOpacity>
      </View>

      {/* Proceed Card at the Bottom */}
      <View style={styles.proceedCard}>
        <TouchableOpacity
          style={[styles.proceedButton, !showProceed && styles.disabledProceed]}
          onPress={handleProceed}
          disabled={!showProceed}
        >
          <Text style={styles.proceedText}>Proceed</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Modal for Device Status */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Device Status</Text>

            <Text style={styles.modalText}>
              Status: {deviceInfo?.status || "Unknown"}
            </Text>
            <Text style={styles.modalText}>
              Country: {deviceInfo?.country !== "NULL" ? deviceInfo?.country : "N/A"}
            </Text>
            <Text style={styles.modalText}>
              Area: {deviceInfo?.area !== "NULL" ? deviceInfo?.area : "N/A"}
            </Text>
            <Text style={styles.modalText}>
              City: {deviceInfo?.city !== "NULL" ? deviceInfo?.city : "N/A"}
            </Text>
            <Text style={styles.modalText}>
              Mode: {deviceInfo?.mode !== "NULL" ? deviceInfo?.mode : "N/A"}
            </Text>
            <Text style={styles.modalText}>
              Warranty Until: {deviceInfo?.warranty_until !== "NULL" ? deviceInfo?.warranty_until : "N/A"}
            </Text>

            <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
              <Text style={styles.modalCloseButtonText}>OK</Text>
            </TouchableOpacity>

            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default DeviceRegistration;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Ensures background image visibility
  },
  logoContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 50, // Reduced logo size
    height: 50, // Reduced logo size
    borderRadius: 25, // Ensures the logo is round
    borderWidth: 2, // Optional: add border to enhance visibility
    borderColor: '#fff', // White border color for logo visibility
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: -1,
    opacity: 0.9, // Reduced opacity to focus on content
  },
  deviceImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.15, // Adjusted for better alignment
  },
  deviceImage: {
    width: 320, // Adjusted size for a more balanced look
    height: 320, // Adjusted size for a more balanced look
    borderRadius: 0, // Removed the border radius
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 40,
    marginTop: 60, // More breathing space above form
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff', // Darker blue for professional look
    marginBottom: 10,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#003a7f', // More defined border color
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    fontWeight:"bold",
    marginBottom: 30,
    color: '#000',
    backgroundColor: 'white', // Sets the background color to white
    opacity: 0.4, // Sets the opacity to 0.9
  },
  
  checkButton: {
    backgroundColor: '#003a7f', // Deep blue for the button
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 0.1,
    borderColor: '#fff'
  },
  checkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  proceedCard: {
    position: 'absolute',
    bottom: 40, // Positioned at the bottom
    width: '100%', // Take full width
    alignItems: 'center', // Center button horizontally
    justifyContent: 'center', // Center button vertically if needed
  },
  
  proceedButton: {
    borderColor: '#bbb',
    borderWidth: 0.5,
    borderRadius: 10,
    paddingVertical: 15,
    margin: 20,
    width: width * 0.7, // Button width set to 70% of screen width
    alignItems: 'center',
    backgroundColor: '#003a7f', // Matching button color
  },
  
  disabledProceed: {
    opacity: 0.5,
  },
  proceedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: width * 0.7,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003a7f',
    marginBottom: 3,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 3,
    textAlign: 'center'
  },
  modalCloseButton: {
    backgroundColor: '#003a7f',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    width: width * 0.5,
    alignItems: 'center'
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


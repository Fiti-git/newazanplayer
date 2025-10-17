import React, { useEffect, useState } from 'react';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import ConnectionStatusIndicator from '../components/ConnectionStatusIndicator.js';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import styles from '../styles/DeviceRegistrationStyles.js';
import useDisableBack from '../hooks/useDisableBack.js';

const DeviceRegistration = ({ route, navigation }) => {
  const { mac } = route.params || {};
  const [macAddress, setMacAddress] = useState(mac || '');
  const [showProceed, setShowProceed] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);

  useDisableBack();

  useEffect(() => {
    BluetoothSerial.isConnected().then(connected => {
      console.log("🔗 ESP32 is still connected?", connected);
    });
  }, []);
  

  useEffect(() => {
    // Show proceed button only if MAC is available
    if (mac) {
      setShowProceed(true);
    }
  }, [mac]);

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
        setDeviceInfo(data);
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
    // Next screen can use this MAC too
    navigation.navigate('Configuration', { mac });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
       <ConnectionStatusIndicator />
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/icon_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Background Image */}
      <Image
        source={require('../assets/w-bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Device Image */}
      <View style={styles.deviceImageContainer}>
        <Image
          source={require('../assets/02.png')}
          style={styles.deviceImage}
          resizeMode="contain"
        />
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Serial Number of the Azan Player</Text>
        <TextInput
          style={styles.input}
          value={macAddress}
          editable={false}
          placeholder="Fetching MAC..."
          placeholderTextColor="#b0e0e6"
        />

        <TouchableOpacity style={styles.checkButton} onPress={handleCheckStatus}>
          <Text style={styles.checkButtonText}>Check Registration Status</Text>
        </TouchableOpacity>
      </View>

      {/* Proceed */}
      <View style={styles.proceedCard}>
        <TouchableOpacity
          style={[styles.proceedButton, !showProceed && styles.disabledProceed]}
          onPress={handleProceed}
          disabled={!showProceed}
        >
          <Text style={styles.proceedText}>Proceed</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
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

              <Text style={styles.modalText}>Status: {deviceInfo?.status || "Unknown"}</Text>
              <Text style={styles.modalText}>Country: {deviceInfo?.country || "N/A"}</Text>
              <Text style={styles.modalText}>Area: {deviceInfo?.area || "N/A"}</Text>
              <Text style={styles.modalText}>City: {deviceInfo?.city || "N/A"}</Text>
              <Text style={styles.modalText}>Mode: {deviceInfo?.mode || "N/A"}</Text>
              <Text style={styles.modalText}>Warranty Until: {deviceInfo?.warranty_until || "N/A"}</Text>

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

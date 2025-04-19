import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import useDisableBack from '../hooks/useDisableBack.js';
import styles from './PairingStyles';

const Pairing = ({ navigation }) => {
  useDisableBack();
  const manager = new BleManager();

  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    return () => manager.destroy(); // cleanup on unmount
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      const allGranted = Object.values(granted).every(
        (perm) => perm === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        Alert.alert('Permission denied', 'Bluetooth permissions are required.');
        return false;
      }
    }
    return true;
  };

  const handleSearch = async () => {
    const permission = await requestPermissions();
    if (!permission) return;

    setDevices([]);
    setScanning(true);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        setScanning(false);
        return;
      }

      if (device?.name && !devices.some((d) => d.id === device.id)) {
        setDevices((prev) => [...prev, device]);
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 10000); // scan for 10 sec
  };

  const handleDeviceSelect = (deviceId) => {
    setSelectedDeviceId(deviceId);
  };

  const handlePair = async () => {
    const device = devices.find((d) => d.id === selectedDeviceId);
    if (!device) return;

    try {
      await manager.connectToDevice(device.id);
      await device.discoverAllServicesAndCharacteristics();
      Alert.alert('✅ Paired', `Connected to ${device.name}`);
      navigation.navigate('DeviceRegistration', { device });
    } catch (err) {
      Alert.alert('❌ Pairing Failed', err.message);
    }
  };

  const instructions = {
    en: [
      'Turn on both devices and ensure Bluetooth is enabled.',
      'Click search to discover available devices.',
      'Select the Azan player from the list to pair.',
    ],
    ar: [
      'قم بتشغيل كلا الجهازين وتأكد من تمكين البلوتوث.',
      'انقر فوق البحث لاكتشاف الأجهزة المتاحة.',
      'حدد جهاز الأذان من القائمة للاتصال.',
    ],
  };

  return (
    <ImageBackground
      source={require('../assets/w-bg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.innerContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchText}>
            {scanning ? 'Scanning...' : 'Search for Devices'}
          </Text>
        </TouchableOpacity>

        <View style={styles.deviceList}>
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleDeviceSelect(item.id)}>
                <Text
                  style={[
                    styles.deviceItem,
                    selectedDeviceId === item.id && styles.selectedDevice,
                  ]}
                >
                  {item.name || 'Unnamed'} ({item.id})
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              !scanning && (
                <Text style={{ color: '#ccc', textAlign: 'center' }}>
                  No devices found. Try scanning again.
                </Text>
              )
            }
          />
        </View>

        <TouchableOpacity
          style={[styles.pairButton, !selectedDeviceId && { opacity: 0.5 }]}
          onPress={handlePair}
          disabled={!selectedDeviceId}
        >
          <Text style={styles.pairText}>Pair</Text>
        </TouchableOpacity>

        <View style={styles.instructionBox}>
          <ScrollView>
            {instructions[language].map((instruction, index) => (
              <Text key={index} style={styles.instruction}>
                <Text style={styles.bold}>{`0${index + 1}`}</Text> {instruction}
              </Text>
            ))}
          </ScrollView>
        </View>

        <View style={styles.languageSwitcher}>
          <TouchableOpacity onPress={() => setLanguage('en')}>
            <Text
              style={[
                styles.languageButton,
                language === 'en' && styles.selectedLanguageButton,
              ]}
            >
              EN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLanguage('ar')}>
            <Text
              style={[
                styles.languageButton,
                language === 'ar' && styles.selectedLanguageButton,
              ]}
            >
              AR
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Pairing;

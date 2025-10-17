import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Platform,
  Alert,
  ScrollView,
  ImageBackground,
} from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import styles from './PairingStyles';
import useDisableBack from '../hooks/useDisableBack';
import ConnectionStatusIndicator from '../components/ConnectionStatusIndicator.js';

const Pairing = ({ navigation }) => {
  useDisableBack();

  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [language, setLanguage] = useState('en');
  const scanInterval = useRef(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (Platform.OS === 'android') requestPermissions();
    return () => stopAutoScan();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      const allGranted = Object.values(granted).every(
        perm => perm === PermissionsAndroid.RESULTS.GRANTED
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

    setScanning(true);
    startAutoScan();
  };

  const startAutoScan = () => {
    stopAutoScan();
    scanDevices();
    scanInterval.current = setInterval(scanDevices, 3000);
  };

  const stopAutoScan = () => {
    if (scanInterval.current) {
      clearInterval(scanInterval.current);
      scanInterval.current = null;
    }
  };

  const scanDevices = async () => {
    try {
      const unpaired = await BluetoothSerial.listUnpaired();
      const paired = await BluetoothSerial.list();
      const allDevices = [...unpaired, ...paired];
  
      const filtered = allDevices.filter((device) => {
        return device.name && device.name.includes("ESP32_AzanPlayer");
      });
  
      // Avoid duplication
      const uniqueDevices = [];
      const seen = new Set();
      for (const device of filtered) {
        const key = device.id;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueDevices.push(device);
        }
      }
  
      setDevices(uniqueDevices);
    } catch (error) {
      console.log('Bluetooth scan error:', error);
      setDevices([]); // Reset on error
    }
  };
  

  const handleDeviceSelect = (id) => {
    setSelectedDeviceId(id);
    stopAutoScan();
  };

  const handlePair = async () => {
    const device = devices.find((d) => d.id === selectedDeviceId);
    if (!device) return;
  
    setLoading(true); // 🔄 Start loading
  
    try {
      const pairedDevices = await BluetoothSerial.list();
      const isAlreadyPaired = pairedDevices.some((d) => d.id === device.id);
  
      let connected = false;
  
      if (isAlreadyPaired) {
        connected = await BluetoothSerial.connect(device.id);
      } else {
        const pairingResult = await BluetoothSerial.pairDevice(device.id);
        if (pairingResult) {
          connected = await BluetoothSerial.connect(device.id);
        }
      }
  
      if (connected) {
        await BluetoothSerial.write("AZAN_SECURE_2024\n");
  
        setTimeout(async () => {
          let result = '';
          try {
            result = await BluetoothSerial.readFromDevice();
          } catch (readErr) {
            console.error('Read failed:', readErr);
            Alert.alert('❌ Read Failed', 'Could not read data from device.');
            setLoading(false); // 🔚 End loading
            return;
          }
  
          const lines = result.trim().split('\n');
          const okReceived = lines.some((line) => line === 'OK');
          const macLine = lines.find((line) => line.startsWith('MAC:'));
  
          if (okReceived && macLine) {
            const mac = macLine.replace('MAC:', '').trim();
            Alert.alert('✅ Connected', `MAC: ${mac}`);
            navigation.navigate('DeviceRegistration', { device, mac });
          } else {
            console.log('Response content:', result);
            Alert.alert('❌ Auth Failed', 'Device did not respond with proper handshake.');
          }
  
          setLoading(false); // 🔚 End loading
        }, 1000);
      } else {
        Alert.alert('❌ Connection Failed', 'Could not connect to device.');
        setLoading(false); // 🔚 End loading
      }
    } catch (err) {
      console.error('Pairing Error:', err);
      Alert.alert('Connection Error', err.message);
      setLoading(false); // 🔚 End loading
    }
  };
  
  

  const instructions = {
    en: [
      'Turn on both devices and ensure Bluetooth is enabled.',
      'Click search to discover available devices.',
      'Select the Azan player from the list to pair or connect.',
    ],
    ar: [
      'قم بتشغيل كلا الجهازين وتأكد من تمكين البلوتوث.',
      'انقر على "بحث" لاكتشاف الأجهزة المتاحة.',
      'حدد جهاز الأذان من القائمة للاتصال.',
    ],
  };

  return (
    <ImageBackground
      source={require('../assets/w-bg.jpg')}
      style={styles.container}
      
      resizeMode="cover"
    >
        <ConnectionStatusIndicator />
      <View style={styles.innerContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchText}>
            {scanning ? 'Scanning...' : 'Search for Devices'}
          </Text>
        </TouchableOpacity>

        <View style={styles.deviceList}>
          {devices.length === 0 ? (
            <Text style={{ color: '#ccc', textAlign: 'center' }}>
              {scanning ? 'Scanning for Azan Player...' : 'No Azan Player found.'}
            </Text>
          ) : (
            <FlatList
              data={devices}
              keyExtractor={(item, index) => `${item.id}-${index}`}
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
            />
          )}
        </View>


        <TouchableOpacity
          style={[styles.pairButton, (!selectedDeviceId || loading) && { opacity: 0.5 }]}
          onPress={handlePair}
          disabled={!selectedDeviceId || loading}
        >
          {loading ? (
            <Text style={styles.pairText}>Connecting...</Text>
            // OR use spinner:
            // <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.pairText}>PAIR</Text>
          )}
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

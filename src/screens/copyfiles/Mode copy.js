import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import useDisableBack from '../hooks/useDisableBack.js';
import styles from '../styles/modeSelectionStyles.js';
import RNFS from 'react-native-fs';
import BluetoothSerial from 'react-native-bluetooth-classic';
import {
  checkDeviceStatus,
  registerNewDevice,
  saveDeviceConfig,
  uploadCsvLog,
} from '../services/apiService';
import { sendCsvOverBluetooth } from '../utils/sendCsv.js';

const ModeSelection = ({ route, navigation }) => {
  const {
    mac,
    country,
    city,
    area,
    latitude,
    longitude,
    azanSound,
    prayers,
  } = route.params || {};

  const [mode, setMode] = useState(null);
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useDisableBack();

  const generateConfigCSV = async (data) => {
    const {
      mac,
      mode,
      ssid,
      password,
      latitude,
      longitude,
      azanSound,
      prayers,
    } = data;

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    const csvHeader = 'mac,mode,ssid,password,latitude,longitude,azan,prayers,date,time\n';
    const csvBody = `${mac},${mode},${ssid || ''},${password || ''},${latitude},${longitude},${azanSound},"${prayers.join(',')}",${date},${time}`;
    const fullCSV = csvHeader + csvBody;
    const path = `${RNFS.DocumentDirectoryPath}/config.csv`;

    await RNFS.writeFile(path, fullCSV, 'utf8');
    console.log('✅ config.csv generated with date/time at:', path);
    return path;
  };

  const handleFinish = async () => {
    if (!mode) {
      Alert.alert('Select Mode', 'Please choose a mode to continue.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const deviceStatus = await checkDeviceStatus(mac);
      if (deviceStatus.status === 'New') {
        await registerNewDevice({ mac_address: mac, country, city, area, mode });
        console.log('✅ Device registered');
      }

      await saveDeviceConfig({
        mac_address: mac,
        mode,
        ssid,
        password,
        latitude,
        longitude,
        azan_sound: azanSound,
        prayers,
      });

      const configPath = await generateConfigCSV({
        mac,
        mode,
        ssid,
        password,
        latitude,
        longitude,
        azanSound,
        prayers,
      });

      const azanCsvPath = `${RNFS.DocumentDirectoryPath}/${country}_${city}_${area}.csv`;

      await uploadCsvLog({
        mac_address: mac,
        upload_source: mode,
        csv_status: 'success',
        file_path: `${country}_${city}_${area}.csv`,
        notes: 'Upload via mobile app',
      });

      console.log('📤 Sending config.csv...');
      await sendCsvOverBluetooth(configPath, 'config');

      // ✅ Option 1: Check for azan CSV before sending
      const azanExists = await RNFS.exists(azanCsvPath);
      if (azanExists) {
        console.log('📤 Sending azan.csv...');
        await sendCsvOverBluetooth(azanCsvPath, 'azan');
        await RNFS.unlink(azanCsvPath);
      } else {
        console.warn('⚠️ azan.csv not found at path:', azanCsvPath);
      }

      await RNFS.unlink(configPath);
      console.log('✅ CSVs sent and cleaned up');
      navigation.navigate('PushScreen');
    } catch (err) {
      console.error('❌ Error during submission:', err);
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground
        source={require('../assets/w-bg.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.card, mode === 'online' && styles.cardSelected]}
            onPress={() => setMode('online')}
            activeOpacity={1}
          >
            <View style={styles.headerRow}>
              <Text style={styles.cardTitle}>Online Mode</Text>
              <View style={[styles.radio, mode === 'online' && styles.radioSelected]} />
            </View>
            <Text style={styles.cardDesc}>
              Prayer times will be based on accurate online data.
            </Text>
            {mode === 'online' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Wi-Fi SSID"
                  value={ssid}
                  onChangeText={setSsid}
                  placeholderTextColor="#999"
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter Wi-Fi Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#999"
                  secureTextEntry
                />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, mode === 'offline' && styles.cardSelected]}
            onPress={() => setMode('offline')}
            activeOpacity={1}
          >
            <View style={styles.headerRow}>
              <Text style={styles.cardTitle}>Offline Mode</Text>
              <View style={[styles.radio, mode === 'offline' && styles.radioSelected]} />
            </View>
            <Text style={styles.cardDesc}>
              Prayer times will be calculated using the solar method.
            </Text>
          </TouchableOpacity>

          {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

          {mode && (
            <TouchableOpacity
              style={styles.finishButton}
              onPress={handleFinish}
              disabled={loading}
            >
              <Text style={styles.finishText}>
                {loading ? 'Processing...' : 'Finish'}
              </Text>
              {loading && <ActivityIndicator style={{ marginTop: 10 }} color="#003a7f" />}
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ModeSelection;

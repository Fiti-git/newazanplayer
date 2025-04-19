import React, { useEffect } from 'react';
import { PermissionsAndroid, Alert } from 'react-native';
import useDisableBack from '../hooks/useDisableBack.js';


const PermissionsScreen = ({ navigation }) => {
    useDisableBack();
  useEffect(() => {
    const requestPermissions = async () => {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ];
      const status = await PermissionsAndroid.requestMultiple(permissions);
      const allPermissionsGranted = Object.values(status).every(result => result === PermissionsAndroid.RESULTS.GRANTED);

      if (allPermissionsGranted) {
        navigation.replace('HomeScreen');
      } else {
        Alert.alert('Permissions denied', 'All required permissions were not granted.');
      }
    };

    requestPermissions();
  }, [navigation]);

  return null; // Return null since no visual component is needed
};

export default PermissionsScreen;

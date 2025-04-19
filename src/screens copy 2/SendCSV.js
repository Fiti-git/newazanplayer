import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import { BleManager } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const manager = new BleManager();

const SendCSV = ({ navigation, route }) => {
  const [filePath, setFilePath] = useState('');
  const [device, setDevice] = useState(null);

  useEffect(() => {
    const path = RNFS.DocumentDirectoryPath + '/data.csv';
    setFilePath(path);
    prepareCSVFile(path);

    if (route.params?.device) {
      console.log("Received device from HomeScreen:", route.params.device.id);
      setDevice(route.params.device);
    }
  }, [route.params]);

  const prepareCSVFile = async (path) => {
    // Example CSV content
    const csvData = "id,name,score\n1,John,88\n2,Jane,92\n3,Bob,77";
    try {
      await RNFS.writeFile(path, csvData, 'utf8');
      console.log("CSV file is prepared and written to the path.");
    } catch (error) {
      console.error("Failed to create or write CSV file:", error);
      Alert.alert('Error', 'Failed to prepare CSV file.');
    }
  };

  const sendFile = async () => {
    if (!device) {
      Alert.alert("Error", "ESP32 is not connected. Please go back to Home and try again.");
      return;
    }

    try {
      const fileContent = await RNFS.readFile(filePath, 'utf8');
      console.log("Sending file content: ", fileContent);

      const serviceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
      const characteristicUUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

      const isConnected = await manager.isDeviceConnected(device.id);
      if (!isConnected) {
        console.log("Device is not connected. Attempting to reconnect...");
        await manager.connectToDevice(device.id);
        await device.discoverAllServicesAndCharacteristics();
      }

      console.log("Writing to ESP32 BLE characteristic...");
      await device.writeCharacteristicWithResponseForService(
        serviceUUID, characteristicUUID, fileContent
      );

      console.log("File sent successfully");
      Alert.alert('Success', 'CSV file has been sent successfully.');

    } catch (error) {
      console.error("Error sending file:", error);
      Alert.alert('Error', 'Failed to send CSV file.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Send CSV to Device</Text>
      <Button title="Send CSV" onPress={sendFile} />
    </View>
  );
};

export default SendCSV;

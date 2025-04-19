import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const manager = new BleManager(); // Avoid recreating multiple instances

const DeviceRegistration = ({ navigation }) => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [deviceName, setDeviceName] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        return () => {
            stopScanning();
            manager.destroy(); // Cleanup BLE manager to prevent memory leaks
        };
    }, []);

    const scanForDevices = () => {
        if (isScanning) return; // Prevent multiple scans
        setIsScanning(true);
        setDevices([]); // Clear previous scan results

        manager.startDeviceScan(null, null, async (error, device) => {
            if (error) {
                console.log("Scanning Error:", error);
                stopScanning();
                return;
            }

            if (device.name && device.name.includes('ESP32')) {
                setDevices((prevDevices) => {
                    const exists = prevDevices.some(d => d.id === device.id);
                    return exists ? prevDevices : [...prevDevices, device];
                });
            }
        });

        // Stop scanning after 10 seconds automatically
        setTimeout(() => stopScanning(), 10000);
    };

    const stopScanning = () => {
        if (isScanning) {
            manager.stopDeviceScan();
            setIsScanning(false);
        }
    };

    const connectToDevice = async (device) => {
        if (isConnecting) return; // Prevent multiple simultaneous connections
        setIsConnecting(true);
        stopScanning(); // Ensure scanning is stopped before connecting

        try {
            // Check if the device is already connected
            const isConnected = await manager.isDeviceConnected(device.id);
            if (isConnected) {
                Alert.alert("Already Connected", `Device: ${device.id}`);
                setSelectedDevice(device);
                setIsConnecting(false);
                return;
            }

            // Disconnect previous device if one is already connected
            if (selectedDevice) {
                console.log("Disconnecting previous device...");
                await manager.cancelDeviceConnection(selectedDevice.id);
                setSelectedDevice(null);
            }

            // Connect to the selected device
            console.log(`Connecting to device ${device.id}...`);
            const connectedDevice = await manager.connectToDevice(device.id);
            await connectedDevice.discoverAllServicesAndCharacteristics();
            setSelectedDevice(connectedDevice);

            Alert.alert("Connected", `Connected to: ${connectedDevice.id}`);
        } catch (error) {
            Alert.alert("Connection Failed", error.message);
        } finally {
            setIsConnecting(false);
        }
    };

    const saveDevice = async () => {
        if (!selectedDevice || !deviceName.trim()) {
            Alert.alert("Error", "Please enter a device name and select a device.");
            return;
        }

        try {
            const deviceInfo = { name: deviceName, mac: selectedDevice.id };
            await AsyncStorage.setItem('registeredDevice', JSON.stringify(deviceInfo));
            Alert.alert("Device Registered", `Name: ${deviceName}, MAC: ${selectedDevice.id}`);
            navigation.replace('HomeScreen');
        } catch (error) {
            console.error("Failed to save device:", error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Register Your ESP32 Device</Text>

            <Button title={isScanning ? "Scanning..." : "Scan for ESP32 Devices"} onPress={scanForDevices} disabled={isScanning} />
            
            {devices.length > 0 && (
                <FlatList
                    data={devices}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Button 
                            title={`${item.name} (${item.id})`} 
                            onPress={() => connectToDevice(item)} 
                            disabled={isConnecting} 
                        />
                    )}
                />
            )}

            {selectedDevice && (
                <View>
                    <Text>Connected to: {selectedDevice.id}</Text>
                    <TextInput
                        placeholder="Enter Device Name"
                        value={deviceName}
                        onChangeText={setDeviceName}
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginVertical: 10, padding: 5 }}
                    />
                    <Button title="Save Device" onPress={saveDevice} />
                </View>
            )}
        </View>
    );
};

export default DeviceRegistration;

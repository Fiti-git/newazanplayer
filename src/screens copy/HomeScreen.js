import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Alert, PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

const HomeScreen = ({ navigation }) => {
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [isAvailable, setIsAvailable] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [lastData, setLastData] = useState('');
    const scanningRef = useRef(false);

    useEffect(() => {
        requestPermissions();
        loadDevice();
        getLastCSVData();
        return () => {
            stopScanning();
        };
    }, []);

    useEffect(() => {
        if (!isAvailable || !isConnected) {
            const interval = setInterval(() => {
                if (deviceInfo && !scanningRef.current) {
                    console.log("🔄 Checking device availability...");
                    checkDeviceAvailability(deviceInfo.mac);
                }
            }, 5000); 
            return () => clearInterval(interval);
        }
    }, [isAvailable, isConnected, deviceInfo]);

    const getLastCSVData = async () => {
        const data = await AsyncStorage.getItem('lastCSVData');
        setLastData(data || 'No data received yet.');
    };

    const requestPermissions = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 31) {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            ]);
            if (granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !== PermissionsAndroid.RESULTS.GRANTED ||
                granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] !== PermissionsAndroid.RESULTS.GRANTED ||
                granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert("Permission Required", "Bluetooth permissions are required to scan for devices.");
            }
        }
    };

    const loadDevice = async () => {
        try {
            const storedDevice = await AsyncStorage.getItem('registeredDevice');
            if (storedDevice) {
                const parsedDevice = JSON.parse(storedDevice);
                setDeviceInfo(parsedDevice);
                console.log(`✅ Loaded Device: ${parsedDevice.name} - ${parsedDevice.mac}`);
                checkDeviceAvailability(parsedDevice.mac);
            }
        } catch (error) {
            console.error("❌ Error loading device:", error);
        }
    };

    const checkDeviceAvailability = async (mac) => {
        if (scanningRef.current || isAvailable) return; 

        console.log("🔍 Scanning for ESP32...");
        stopScanning();

        scanningRef.current = true;
        setIsAvailable(false);

        manager.startDeviceScan(null, null, async (error, device) => {
            if (error) {
                console.error("❌ Scanning Error:", error);
                stopScanning();
                return;
            }

            if (device.name && device.id.toUpperCase() === mac.toUpperCase()) {
                console.log("✅ ESP32 Found! Stopping scan and connecting...");
                setIsAvailable(true);
                stopScanning();
                connectToDevice(device);
            }
        });

        setTimeout(() => stopScanning(), 4000);
    };

    const connectToDevice = async (device) => {
        try {
            console.log("🔗 Connecting to ESP32...");
            const connectedDevice = await manager.connectToDevice(device.id);
            await connectedDevice.discoverAllServicesAndCharacteristics();
            setIsConnected(true);
            console.log("✅ Connected to ESP32 for file transfer.");
            navigation.navigate('SendCSV', { device: connectedDevice });
        } catch (error) {
            console.error("❌ Connection Error:", error);
            setIsConnected(false);
            setIsAvailable(false);
        }
    };

    const stopScanning = () => {
        if (scanningRef.current) {
            manager.stopDeviceScan();
            scanningRef.current = false;
            console.log("🛑 Stopped scanning.");
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Home Screen</Text>
            {deviceInfo ? (
                <View>
                    <Text>Device Name: {deviceInfo.name}</Text>
                    <Text>MAC Address: {deviceInfo.mac}</Text>
                    <Text>Status: {isAvailable ? "✅ Available" : "❌ Not Available"}</Text>
                    <Text>Connection: {isConnected ? "🔗 Connected" : "🔴 Not Connected"}</Text>
                    <Text>Last Data: {lastData}</Text>
                </View>
            ) : (
                <View>
                    <Text>No device registered.</Text>
                    <Button title="Register a Device" onPress={() => navigation.navigate('DeviceRegistration')} />
                </View>
            )}
        </View>
    );
};

export default HomeScreen;

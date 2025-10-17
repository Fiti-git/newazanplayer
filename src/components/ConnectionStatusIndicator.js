import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial-next';

const ConnectionStatusIndicator = () => {
  const [status, setStatus] = useState('checking'); // 'connected', 'disconnected', 'checking'
  const [showTooltip, setShowTooltip] = useState(false);
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const tooltipTimer = useRef(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await BluetoothSerial.isConnected();
        setStatus(isConnected ? 'connected' : 'disconnected');
      } catch (err) {
        setStatus('disconnected');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [blinkAnim]);

  const getColor = () => {
    switch (status) {
      case 'connected':
        return '#00FF00';
      case 'disconnected':
        return '#FF3B30';
      default:
        return '#FFD700';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Checking...';
    }
  };

  const handleTap = () => {
    setShowTooltip(true);

    // Clear any existing timer
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);

    // Auto-hide after 2.5 seconds
    tooltipTimer.current = setTimeout(() => {
      setShowTooltip(false);
    }, 2500);
  };

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.circle,
            {
              backgroundColor: getColor(),
              opacity: blinkAnim,
            },
          ]}
        />
        {showTooltip && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{getLabel()}</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 100,
    alignItems: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  tooltip: {
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#333',
    borderRadius: 6,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default ConnectionStatusIndicator;

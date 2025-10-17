import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet, Image, FlatList
} from 'react-native';
import Sound from 'react-native-sound';
import azanFiles from '../constants/azanFiles'; // Example: [{ id: 'azan1.mp3', title: 'Azan 1' }, ...]
import playIcon from '../assets/play_circle.png'; // Your custom play icon

const AzanSelectorModal = ({ visible, onClose, onSelect }) => {
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [selectedAzanId, setSelectedAzanId] = useState(null);
  const soundRef = useRef(null);

  const handlePlay = (id) => {
    if (currentPlaying === id) return; // Prevent double clicking

    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current.release();
        soundRef.current = null;
      });
    }

    const sound = new Sound(id, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Sound load error:', error);
        return;
      }
      sound.play((success) => {
        if (!success) console.log('Playback failed');
        sound.release();
        setCurrentPlaying(null);
      });
      soundRef.current = sound;
      setCurrentPlaying(id);
    });
  };

  const stopSound = () => {
    if (soundRef.current) {
      const currentSound = soundRef.current;
      soundRef.current = null;
      currentSound.stop(() => {
        currentSound.release();
      });
    }
    setCurrentPlaying(null);
  };

  const handleSelect = (id) => {
    stopSound();
    setSelectedAzanId(id);
    onSelect(id);
  };

  const handleClose = () => {
    stopSound();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Select Azan Sound</Text>

          <FlatList
            data={azanFiles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.item,
                  selectedAzanId === item.id && styles.selectedItem
                ]}
                onPress={() => handleSelect(item.id)}
              >
                <Text style={styles.itemText}>{item.title}</Text>
                <TouchableOpacity onPress={() => handlePlay(item.id)}>
                  <Image source={playIcon} style={styles.playIcon} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AzanSelectorModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#003a7f',
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#f1f9ff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#003a7f',
    borderWidth: 1,
  },
  selectedItem: {
    backgroundColor: '#cfeeff',
    borderColor: '#0077b6',
  },
  itemText: {
    color: '#003a7f',
    fontSize: 16,
    fontWeight: '500',
  },
  playIcon: {
    width: 28,
    height: 28,
    tintColor: '#003a7f',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  closeText: {
    fontWeight: 'bold',
    color: '#003a7f',
    fontSize: 16,
  },
});

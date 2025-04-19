import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, ScrollView, Modal, FlatList, ImageBackground
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import useDisableBack from '../hooks/useDisableBack.js';
import styles from '../styles/configurationStyles';

const Configuration = ({ navigation }) => {
  useDisableBack();

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);

  const [showAzanOptions, setShowAzanOptions] = useState(false);
  const [selectedAzan, setSelectedAzan] = useState(null);
  const [selectedPrayers, setSelectedPrayers] = useState([]);

  const azanList = ['Azan 1', 'Azan 2', 'Azan 3', 'Azan 4'];
  const prayers = ['Fajr', 'Duhr', 'Asr', 'Maghrib', 'Isha'];

  const countryList = ['UAE', 'KSA', 'Egypt', 'Bahrain', 'Oman', 'Indonesia', 'Qatar'];
  const cityMap = {
    UAE: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Um Al Quwain', 'Ras AlKhaimah', 'Fujairah'],
    KSA: ['Riyadh'],
    Egypt: ['Cairo'],
    Bahrain: ['Manama'],
    Oman: ['Muscat'],
    Indonesia: ['Jakarta'],
    Qatar: ['Doha'],
  };

  const areaMap = {
    'Abu Dhabi': ['Abu Dhabi', 'Al Ain'],
    'Ajman': ['Ajman Masfoot', 'Ajman'],
    'Dubai': ['Dubai', 'Hatta'],
    'Fujairah': ['Fujairah Al Tawiyan', 'Fujairah'],
    'Ras AlKhaimah': ['Ras AlKhaimah', 'Ras AlKhaimah Jebel Jais'],
    'Sharjah': ['Sharjah Al Dhaid', 'Sharjah'],
    'Um Al Quwain': ['Um Al Quwain'],
    'Riyadh': ['Riyadh'],
    'Cairo': ['Cairo'],
    'Manama': ['Manama'],
    'Muscat': ['Muscat'],
    'Jakarta': ['Jakarta'],
    'Doha': ['Doha'],
  };

  const togglePrayer = (prayer) => {
    setSelectedPrayers((prev) =>
      prev.includes(prayer)
        ? prev.filter((p) => p !== prayer)
        : [...prev, prayer]
    );
  };

  const handleNext = () => {
    navigation.navigate('Mode');
  };

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude.toFixed(6));
    setLongitude(location.coords.longitude.toFixed(6));
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require('../assets/w-bg.jpg')}
        style={styles.backgroundImage}
      >

        {/* Country */}
        <Text style={styles.label}>Country</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowCountryModal(true)}>
          <Text style={styles.inputText}>
            {selectedCountry || '- Select Country -'}
          </Text>
          <Ionicons name="caret-down" size={20} color="#003a7f" />
        </TouchableOpacity>

        {/* City */}
        <Text style={styles.label}>City</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => selectedCountry && setShowCityModal(true)}
        >
          <Text style={styles.inputText}>
            {selectedCity || '- Select City -'}
          </Text>
          <Ionicons name="caret-down" size={20} color="#003a7f" />
        </TouchableOpacity>

        {/* Area */}
        <Text style={styles.label}>Area</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => selectedCity && setShowAreaModal(true)}
        >
          <Text style={styles.inputText}>
            {selectedArea || '- Select Area -'}
          </Text>
          <Ionicons name="caret-down" size={20} color="#003a7f" />
        </TouchableOpacity>

        {/* Latitude & Longitude */}
        <Text style={styles.label}>Latitude</Text>
        <TextInput
          style={styles.input}
          editable={false}
          value={latitude ? `${latitude}` : 'Fetching...'}
        />
        <Text style={styles.label}>Longitude</Text>
        <TextInput
          style={styles.input}
          editable={false}
          value={longitude ? `${longitude}` : 'Fetching...'}
        />

        {/* Azan Type */}
        <Text style={styles.label}>Azan Sound Type</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowAzanOptions(true)}>
          <Text style={styles.inputText}>
            {selectedAzan || 'Select Azan Sound'}
          </Text>
          <Ionicons name="caret-down" size={20} color="#003a7f" />
        </TouchableOpacity>

        {/* Prayer Time */}
        <Text style={styles.label}>Prayer Time</Text>
        <View style={styles.prayerGrid}>
          {prayers.map((prayer) => (
            <TouchableOpacity
              key={prayer}
              style={[
                styles.prayerItem,
                selectedPrayers.includes(prayer) && styles.prayerSelected,
              ]}
              onPress={() => togglePrayer(prayer)}
            >
              <Text
                style={[
                  styles.prayerText,
                  selectedPrayers.includes(prayer) && styles.prayerTextSelected,
                ]}
              >
                {prayer}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>

        {/* Modals */}
        <Modal visible={showCountryModal} transparent>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <FlatList
                data={countryList}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCountry(item);
                      setSelectedCity(null);
                      setSelectedArea(null);
                      setShowCountryModal(false);
                    }}
                  >
                    <Text style={styles.modalItem}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showCityModal} transparent>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select City</Text>
              <FlatList
                data={cityMap[selectedCountry] || []}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCity(item);
                      setSelectedArea(null);
                      setShowCityModal(false);
                    }}
                  >
                    <Text style={styles.modalItem}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showAreaModal} transparent>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Area</Text>
              <FlatList
                data={areaMap[selectedCity] || []}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedArea(item);
                      setShowAreaModal(false);
                    }}
                  >
                    <Text style={styles.modalItem}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setShowAreaModal(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showAzanOptions} transparent>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Azan Type</Text>
              {azanList.map((azan) => (
                <TouchableOpacity
                  key={azan}
                  onPress={() => {
                    setSelectedAzan(azan);
                    setShowAzanOptions(false);
                  }}
                >
                  <Text style={styles.modalItem}>{azan}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowAzanOptions(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ImageBackground>
    </ScrollView>
  );
};

export default Configuration;

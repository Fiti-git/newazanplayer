import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '20%',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  searchButton: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '85%',
    justifyContent: 'center',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deviceList: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    width: '85%',
    height: 180,
    padding: 15,
    marginBottom: 20,
  },
  deviceItem: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 6,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedDevice: {
    backgroundColor: '#003a7f',
    color: '#fff',
    fontWeight: 'bold',
  },
  pairButton: {
    backgroundColor: '#003a7f',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 20,
    width: '85%',
    alignItems: 'center',
  },
  pairText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  instructionBox: {
    backgroundColor: '#fff',
    width: '110%',
    height: height * 0.4, // ~40% of screen height (about 2:3 ratio with top)
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom:-25,
    flexGrow: 0,
  },
  instruction: {
    fontSize: 16,
    color: '#005f87',
    marginBottom: 15,
    fontFamily: 'Roboto',
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  languageSwitcher: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
  },
  languageButton: {
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  selectedLanguageButton: {
    backgroundColor: '#003a7f',
    color: '#fff',
  },
});

export default styles;

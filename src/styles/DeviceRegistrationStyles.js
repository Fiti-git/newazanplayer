import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: -1,
    opacity: 0.9,
  },
  deviceImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.15,
  },
  deviceImage: {
    width: 320,
    height: 320,
    borderRadius: 0,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 40,
    marginTop: 60,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#003a7f',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
    backgroundColor: 'white',
    opacity: 0.4,
  },
  checkButton: {
    backgroundColor: '#003a7f',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 0.1,
    borderColor: '#fff',
  },
  checkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  proceedCard: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButton: {
    borderColor: '#bbb',
    borderWidth: 0.5,
    borderRadius: 10,
    paddingVertical: 15,
    margin: 20,
    width: width * 0.7,
    alignItems: 'center',
    backgroundColor: '#003a7f',
  },
  disabledProceed: {
    opacity: 0.5,
  },
  proceedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: width * 0.7,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003a7f',
    marginBottom: 3,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 3,
    textAlign: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#003a7f',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    width: width * 0.5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;

import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#003a7f',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDesc: {
    color: '#eee',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 20,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  radioSelected: {
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 15,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  finishButton: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
  },
  finishText: {
    color: '#003a7f',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default styles;

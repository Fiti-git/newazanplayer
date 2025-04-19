import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 12,
    marginTop: 10,
    paddingHorizontal: 20,
    width: '80%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputText: {
    color: 'black',
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: '#ccc',
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  toggleSelected: {
    backgroundColor: '#fff',
  },
  toggleText: {
    fontWeight: 'bold',
    color: '#003a7f',
  },
  prayerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    justifyContent: 'space-between',
  },
  prayerItem: {
    width: '30%',
    backgroundColor: '#003a7f',
    borderRadius: 15,
    paddingVertical: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  prayerSelected: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#003a7f',
  },
  prayerText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  prayerTextSelected: {
    color: '#003a7f',
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '80%',
  },
  nextText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#003a7f',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
  },
  modalItem: {
    fontSize: 16,
    marginVertical: 8,
  },
  modalClose: {
    textAlign: 'right',
    marginTop: 10,
    color: '#003a7f',
    fontWeight: 'bold',
  },
});

export default styles;

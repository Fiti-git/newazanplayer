// sendCsv.js
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import RNFS from 'react-native-fs';

const LINE_DELAY = 50;
const BATCH_LINES = 20;
const BATCH_DELAY = 500;

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const sendCsvOverBluetooth = async (filePath, type, onProgress) => {  // ✨ add onProgress
  try {
    const isConnected = await BluetoothSerial.isConnected();
    if (!isConnected) throw new Error('No Bluetooth device connected');

    const fileContent = await RNFS.readFile(filePath, 'utf8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    const totalLines = lines.length;

    const start = type === 'config' ? 'CONFIG_START\n' : 'AZAN_START\n';
    const end = type === 'config' ? 'CONFIG_END\n' : 'AZAN_END\n';

    await BluetoothSerial.write(start);
    await delay(50);

    for (let i = 0; i < totalLines; i++) {
      await BluetoothSerial.write(lines[i] + '\n');
      await delay(LINE_DELAY);

      // 📈 Update progress
      if (onProgress) {
        const percent = Math.floor((i + 1) / totalLines * 100);
        onProgress(percent);
      }

      if ((i + 1) % BATCH_LINES === 0) {
        console.log(`📤 Sending ${type}: ${Math.floor((i + 1) / totalLines * 100)}% done`);
        await delay(BATCH_DELAY);
      }
    }

    await BluetoothSerial.write(end);
    if (onProgress) onProgress(100); // ✅ Make sure final 100% is sent
    console.log(`✅ ${type}.csv sent successfully`);

  } catch (error) {
    console.error(`❌ Failed to send ${type}.csv:`, error);
    throw error;
  }
};

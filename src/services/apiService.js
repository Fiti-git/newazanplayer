import axios from 'axios';

const BASE_URL = 'https://echostics.com/';
const API_KEY = 'Echostic2025SecureKey!'; // Secure key used in headers

const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY,
};

/**
 * 1. Check if device is already registered
 */
export const checkDeviceStatus = async (mac_address) => {
  const url = `${BASE_URL}api_check_device.php`;
  const response = await axios.post(url, { mac_address }, { headers });
  return response.data;
};

/**
 * 2. Register a new device (only if status === "New")
 */
export const registerNewDevice = async (data) => {
  const url = `${BASE_URL}api_add_device.php`;
  const response = await axios.post(url, data, { headers });
  return response.data;
};

/**
 * 3. Save configuration settings
 */
export const saveDeviceConfig = async (data) => {
  const url = `${BASE_URL}api_save_config.php`;
  const response = await axios.post(url, data, { headers });
  return response.data;
};

/**
 * 4. Log CSV upload status
 */
export const uploadCsvLog = async (data) => {
  const url = `${BASE_URL}api_log_upload.php`;
  const response = await axios.put(url, data, { headers });
  return response.data;
};

import axios from './axios';

export const generateQRCode = async (locationId) => {
  try {
    const response = await axios.post('/attendance/generate-qr', {
      location_id: locationId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const validateQRCode = async (qrData, scanTime) => {
  console.log('🟢 API validateQRCode START:', { qrData, scanTime });
  
  try {
    const response = await axios.post('/attendance/validate-qr', {
      qr_data: qrData,
      scan_time: scanTime
    });
    
    console.log('✅ API validateQRCode SUCCESS:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ API validateQRCode ERROR:', error);
    console.error('Error response:', error.response?.data);
    throw error.response?.data || error;
  }
};

export const recordAttendance = async (attendanceData) => {
  console.log('🟢 API recordAttendance START:', attendanceData);
  
  try {
    const response = await axios.post('/attendance', attendanceData);
    
    console.log('✅ API recordAttendance SUCCESS:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ API recordAttendance ERROR:', error);
    console.error('Error response:', error.response?.data);
    throw error.response?.data || error;
  }
};

export const getTodayAttendance = async () => {
  try {
    const response = await axios.get('/attendance/today');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAttendanceHistory = async (params = {}) => {
  try {
    const response = await axios.get('/attendance/history', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAttendanceSummary = async (month) => {
  try {
    const response = await axios.get('/attendance/summary', {
      params: { month }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCurrentStatus = async () => {
  try {
    const response = await axios.get('/attendance/status');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const exportAttendance = async (params) => {
  try {
    const response = await axios.get('/attendance/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getLocations = async () => {
  try {
    const response = await axios.get('/attendance/locations');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
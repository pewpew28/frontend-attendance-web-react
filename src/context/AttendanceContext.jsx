// context/AttendanceContext.jsx

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { 
  getTodayAttendance, 
  getAttendanceHistory, 
  getCurrentStatus,
  recordAttendance,
  validateQRCode,
  getAttendanceSummary
} from '../api/attendanceApi';
import toast from 'react-hot-toast';

export const AttendanceContext = createContext({
  todayAttendance: [],
  attendanceHistory: [],
  currentStatus: null,
  summary: null,
  loading: false,
  error: null,
  fetchTodayAttendance: () => {},
  fetchAttendanceHistory: () => {},
  fetchCurrentStatus: () => {},
  fetchSummary: () => {},
  submitAttendance: () => {},
  validateQR: () => {},
  refreshData: () => {}
});

export const AttendanceProvider = ({ children }) => {
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==================== VALIDATE QR ====================
  const validateQR = useCallback(async (qrData) => {
    console.log('🔵 Context validateQR called:', { qrData });
    
    try {
      setLoading(true);
      setError(null);
      
      // Call API
      const result = await validateQRCode(qrData);
      
      console.log('✅ Context validateQR result:', result);
      
      if (result && result.valid) {
        toast.success('QR Code verified successfully!');
      } else {
        toast.error(result?.message || 'Invalid QR Code');
      }
      
      return result; // ← CRITICAL: MUST RETURN
      
    } catch (err) {
      const errorMessage = err.message || 'QR validation failed';
      console.error('❌ Context validateQR error:', err);
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Return error result
      return {
        valid: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []); // ← Empty dependency

  // ==================== SUBMIT ATTENDANCE ====================
  const submitAttendance = useCallback(async (attendanceData) => {
    console.log('🔵 Context submitAttendance called:', attendanceData);
    
    try {
      setLoading(true);
      setError(null);
      
      // Call API
      const result = await recordAttendance(attendanceData);
      
      console.log('✅ Context submitAttendance result:', result);
      
      if (result && result.success) {
        toast.success(result.message || 'Attendance recorded successfully!');
        
        // Refresh data in background (no await)
        fetchTodayAttendance();
        fetchCurrentStatus();
      } else {
        toast.error(result?.message || 'Failed to record attendance');
      }
      
      return result; // ← CRITICAL: MUST RETURN
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to record attendance';
      console.error('❌ Context submitAttendance error:', err);
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Return error result
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []); // ← Empty dependency, no circular deps

  // ==================== FETCH TODAY'S ATTENDANCE ====================
  const fetchTodayAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTodayAttendance();
      setTodayAttendance(data.activities || data.data || []);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch today attendance');
      console.error('Fetch today attendance error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== FETCH ATTENDANCE HISTORY ====================
  const fetchAttendanceHistory = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAttendanceHistory(params);
      setAttendanceHistory(data.activities || data.data || []);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch attendance history');
      console.error('Fetch history error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== FETCH CURRENT STATUS ====================
  const fetchCurrentStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCurrentStatus();
      setCurrentStatus(data.status || 'clocked_out');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch current status');
      console.error('Fetch status error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== FETCH SUMMARY ====================
  const fetchSummary = useCallback(async (month) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAttendanceSummary(month);
      setSummary(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch summary');
      console.error('Fetch summary error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== REFRESH ALL DATA ====================
  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchTodayAttendance(),
      fetchCurrentStatus(),
      fetchAttendanceHistory()
    ]);
  }, [fetchTodayAttendance, fetchCurrentStatus, fetchAttendanceHistory]);

  // ==================== INITIAL LOAD ====================
  useEffect(() => {
    // Auto-fetch on mount
    refreshData();
  }, []); // ← Only on mount, refreshData removed from deps

  const value = {
    // State
    todayAttendance,
    attendanceHistory,
    currentStatus,
    summary,
    loading,
    error,
    
    // Functions
    fetchTodayAttendance,
    fetchAttendanceHistory,
    fetchCurrentStatus,
    fetchSummary,
    submitAttendance,
    validateQR,
    refreshData
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

// Custom hook
export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within AttendanceProvider');
  }
  return context;
};
import React, { useEffect, useState } from 'react';
import { 
  LogIn, 
  Coffee, 
  LogOut, 
  Clock,
  Calendar,
  MapPin,
  QrCode,
  Download,
  Filter,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../../context/AttendanceContext';

const Attendance = () => {
  const navigate = useNavigate();
  const { 
    todayAttendance, 
    attendanceHistory, 
    currentStatus,
    loading, 
    error,
    fetchTodayAttendance,
    fetchAttendanceHistory,
    refreshData
  } = useAttendance();

  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    // Refresh data saat component mount
    refreshData();
  }, [refreshData]);

  // Calculate work hours for today
  const calculateWorkHours = () => {
    const clockIn = todayAttendance.find(a => a.type === 'Clock In' || a.action === 'clock_in');
    const clockOut = todayAttendance.find(a => a.type === 'Clock Out' || a.action === 'clock_out');
    
    if (!clockIn || !clockOut) return '--:--';
    
    const diff = new Date(clockOut.time) - new Date(clockIn.time);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  // Calculate break time
  const calculateBreakTime = () => {
    const startBreak = todayAttendance.find(a => a.type === 'Start Break' || a.action === 'start_break');
    const endBreak = todayAttendance.find(a => a.type === 'End Break' || a.action === 'end_break');
    
    if (!startBreak || !endBreak) return '--:--';
    
    const diff = new Date(endBreak.time) - new Date(startBreak.time);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getActivityIcon = (type) => {
    const typeStr = type?.toLowerCase() || '';
    if (typeStr.includes('clock in') || typeStr === 'clock_in') {
      return <LogIn size={18} className="text-blue-600" />;
    }
    if (typeStr.includes('break') || typeStr === 'start_break' || typeStr === 'end_break') {
      return <Coffee size={18} className="text-orange-600" />;
    }
    return <LogOut size={18} className="text-gray-600" />;
  };

  const getActivityLabel = (type) => {
    const typeStr = type?.toLowerCase() || '';
    if (typeStr === 'clock_in') return 'Clock In';
    if (typeStr === 'start_break') return 'Start Break';
    if (typeStr === 'end_break') return 'End Break';
    if (typeStr === 'clock_out') return 'Clock Out';
    return type;
  };

  // Group activities by date
  const groupByDate = (activities) => {
    const grouped = {};
    activities.forEach(activity => {
      const date = formatDate(activity.time);
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(activity);
    });
    return grouped;
  };

  const groupedHistory = groupByDate(attendanceHistory);

  // Get clock in/out times
  const clockInTime = todayAttendance.find(a => 
    a.type === 'Clock In' || a.action === 'clock_in'
  )?.time;
  
  const clockOutTime = todayAttendance.find(a => 
    a.type === 'Clock Out' || a.action === 'clock_out'
  )?.time;

  if (loading && !todayAttendance.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-2 space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <LogIn size={14} />
            <span>Clock In</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {formatTime(clockInTime)}
          </p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <LogOut size={14} />
            <span>Clock Out</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {formatTime(clockOutTime)}
          </p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <Clock size={14} />
            <span>Work Hours</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{calculateWorkHours()}</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <Coffee size={14} />
            <span>Break Time</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{calculateBreakTime()}</p>
        </div>
      </div>

      {/* Current Status Badge */}
      {currentStatus && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                currentStatus === 'clocked_in' ? 'bg-green-500' :
                currentStatus === 'on_break' ? 'bg-orange-500' :
                'bg-gray-400'
              }`}></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Current Status</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {currentStatus === 'clocked_in' ? 'Working' :
                   currentStatus === 'on_break' ? 'On Break' :
                   'Not Clocked In'}
                </p>
              </div>
            </div>
            <button
              onClick={refreshData}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <TrendingUp size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Today's Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Today's Activity</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {todayAttendance.length > 0 ? (
            todayAttendance.map((activity) => (
              <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type || activity.action)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {getActivityLabel(activity.type || activity.action)}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatTime(activity.time)}
                      </span>
                      {activity.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {activity.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-gray-400">
              <Clock size={48} className="mx-auto mb-3 opacity-50" />
              <p>No activity today</p>
              <button
                onClick={() => navigate('/scan-qr')}
                className="mt-4 text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                Scan QR to start
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
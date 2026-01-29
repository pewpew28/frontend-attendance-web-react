import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { 
  LogIn, 
  Coffee, 
  LogOut, 
  Clock,
  MapPin,
  CheckCircle,
  Camera,
  X,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';

const ScanQR = () => {
  const navigate = useNavigate();
  const { validateQR, submitAttendance, loading } = useAttendance();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [step, setStep] = useState('scan');
  const [selectedAction, setSelectedAction] = useState(null);
  const [location, setLocation] = useState('Unknown Location');
  const [isScanning, setIsScanning] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState('');
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        setCameras(devices);
        const backCamera = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        setSelectedCamera(backCamera ? backCamera.id : devices[0].id);
      }
    }).catch(err => {
      console.error('Error getting cameras:', err);
      setError('Cannot access camera. Please check permissions.');
    });
  }, []);

  const startScanner = async () => {
    if (!selectedCamera) {
      setError('No camera available');
      return;
    }

    setIsScanning(true);
    setError('');

    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          handleQRSuccess(decodedText);
        },
        (errorMessage) => {
          // Silent - normal scanning error
        }
      );
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError('Failed to start camera. Please try again.');
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
  };

  const handleQRSuccess = async (decodedText) => {
    await stopScanner();

    try {
      console.log('QR Scanned:', decodedText);
      
      const qrDataParsed = JSON.parse(decodedText);
      
      // Validate QR dengan context
      const result = await validateQR(decodedText, new Date().toISOString());
      
      console.log('Validation result:', result);
      
      if (result && result.valid) {
        setQrData({
          location_id: result.location_id,
          location_name: result.location_name || qrDataParsed.location_name
        });
        setLocation(result.location_name || qrDataParsed.location_name || 'Office');
        setStep('select');
      } else {
        setError(result?.message || 'Invalid QR Code');
        setStep('error');
      }
    } catch (err) {
      console.error('QR validation error:', err);
      setError('Invalid QR Code format or validation failed');
      setStep('error');
    }
  };

  const handleManualQR = async () => {
    // Mock QR data untuk testing
    const mockQRData = {
      qr_data: '8c05c406-10b9-494b-97bf-c46370b7c391',
      scan_time: new Date().toISOString()
    };
    
    const mockQRString = JSON.stringify(mockQRData);
    
    console.log('Manual QR test:', mockQRString);
    
    // Validate dengan context
    const result = await validateQR(mockQRString);
    
    console.log('Manual QR validation result:', result);
    
    if (result && result.valid) {
      // Backend validation success
      setQrData({
        location_id: result.location_id,
        location_name: result.location_name
      });
      setLocation(result.location_name);
      setStep('select');
    } else {
      // Fallback untuk test mode (tanpa backend)
      console.log('Using fallback test mode');
      setQrData({
        location_id: mockQRData.location_id,
        location_name: mockQRData.location_name
      });
      setLocation(mockQRData.location_name);
      setStep('select');
    }
  };

  const handleSelectAction = (action) => {
    setSelectedAction(action);
  };

  const handleSubmit = async () => {
    if (!selectedAction || !qrData) {
      setError('Please select an action');
      return;
    }

    console.log('Submitting with data:', {
      action: selectedAction,
      time: currentTime.toISOString(),
      location_id: qrData.location_id,
      location_name: location
    });

    // Submit attendance menggunakan context
    const result = await submitAttendance({
      action: selectedAction,
      time: currentTime.toISOString(),
      location_id: qrData.location_id,
      location_name: location
    });

    console.log('Submit result:', result);

    // Check result
    if (result && result.success) {
      setStep('success');
      setTimeout(() => {
        navigate('/attendance');
      }, 2000);
    } else {
      console.error('Submit attendance error:', result);
      setError(result?.message || 'Failed to record attendance');
      setStep('error');
    }
  };

  const handleRetry = () => {
    setStep('scan');
    setError('');
    setQrData(null);
    setSelectedAction(null);
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        stopScanner();
      }
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const actions = [
    {
      id: 'clock_in',
      label: 'Clock In',
      icon: LogIn,
      color: 'blue',
      description: 'Start your work day'
    },
    {
      id: 'start_break',
      label: 'Start Break',
      icon: Coffee,
      color: 'orange',
      description: 'Take a break'
    },
    {
      id: 'end_break',
      label: 'End Break',
      icon: Coffee,
      color: 'green',
      description: 'Back to work'
    },
    {
      id: 'clock_out',
      label: 'Clock Out',
      icon: LogOut,
      color: 'gray',
      description: 'End your work day'
    }
  ];

  const getColorClasses = (color, isSelected = false) => {
    const colors = {
      blue: isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400',
      orange: isSelected ? 'border-orange-600 bg-orange-50' : 'border-gray-200 hover:border-orange-400',
      green: isSelected ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-400',
      gray: isSelected ? 'border-gray-600 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
    };
    return colors[color] || colors.gray;
  };

  const getIconColor = (color) => {
    const colors = {
      blue: 'text-blue-600',
      orange: 'text-orange-600',
      green: 'text-green-600',
      gray: 'text-gray-600'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* STEP 1: SCAN QR */}
        {step === 'scan' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan QR Code</h1>
              <p className="text-sm text-gray-500">Scan QR code to record attendance</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
              <p className="text-xs text-gray-500 mb-1">{formatDate(currentTime)}</p>
              <p className="text-3xl font-bold text-gray-900 font-mono">{formatTime(currentTime)}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-700">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="relative mb-6">
              <div id="qr-reader" className={`w-full ${isScanning ? 'block' : 'hidden'}`}></div>
              
              {!isScanning && (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Camera size={48} className="mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600">Ready to scan</p>
                  </div>
                </div>
              )}
            </div>

            {cameras.length > 1 && !isScanning && (
              <div className="mb-4">
                <label className="text-xs text-gray-600 block mb-2">Select Camera</label>
                <select
                  value={selectedCamera || ''}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {cameras.map(camera => (
                    <option key={camera.id} value={camera.id}>
                      {camera.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              {!isScanning ? (
                <>
                  <button
                    onClick={startScanner}
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Camera size={20} />
                    {loading ? 'Loading...' : 'Start Scanning'}
                  </button>
                  
                  <button
                    onClick={handleManualQR}
                    disabled={loading}
                    className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                  >
                    Skip (Test Mode)
                  </button>
                </>
              ) : (
                <button
                  onClick={stopScanner}
                  className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  Stop Scanning
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT ACTION */}
        {step === 'select' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">QR Verified</h1>
              <p className="text-sm text-gray-500">Select your action</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
              <p className="text-2xl font-bold text-gray-900 font-mono mb-2">{formatTime(currentTime)}</p>
              <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
                <MapPin size={12} />
                {location}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {actions.map((action) => {
                const Icon = action.icon;
                const isSelected = selectedAction === action.id;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleSelectAction(action.id)}
                    disabled={loading}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${getColorClasses(action.color, isSelected)} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={24} className={getIconColor(action.color)} />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{action.label}</p>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle size={20} className="text-blue-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                disabled={loading}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedAction || loading}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Success!</h1>
            <p className="text-gray-600 mb-4">Your attendance has been recorded</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">
                {actions.find(a => a.id === selectedAction)?.label}
              </p>
              <p className="text-lg font-bold text-gray-900">{formatTime(currentTime)}</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                <MapPin size={12} />
                {location}
              </p>
            </div>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </div>
        )}

        {/* STEP 4: ERROR */}
        {step === 'error' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600 mb-6">{error || 'Something went wrong'}</p>
            <button
              onClick={handleRetry}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ScanQR;
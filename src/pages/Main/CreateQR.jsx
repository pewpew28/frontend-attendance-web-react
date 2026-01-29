import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  QrCode, 
  Download, 
  RefreshCw, 
  MapPin, 
  Clock,
  CheckCircle,
  Copy,
  Printer,
  AlertCircle
} from 'lucide-react';
import { generateQRCode, getLocations } from '../../api/attendanceApi';
import toast from 'react-hot-toast';

const CreateQR = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  
  const qrCodeRef = useRef(null);
  useEffect(() => {
    const fetchLocationsData = async () => {
      try {
        setLoadingLocations(true);
        const response = await getLocations();
        let locationData = [];
        if (response.data) {
          locationData = response.data; 
        } else if (response.locations) {
          locationData = response.locations; 
        } else if (Array.isArray(response)) {
          locationData = response; 
        }
        
        setLocations(locationData);
        if (locationData.length > 0) {
          setSelectedLocation(locationData[0].id);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        toast.error('Failed to load locations');
        
        // Fallback mock data
        const mockLocations = [
          { id: 'LOC001', name: 'Office Building A', address: 'Jl. Sudirman No. 123, Jakarta' },
          { id: 'LOC002', name: 'Office Building B', address: 'Jl. Gatot Subroto No. 45, Bandung' },
          { id: 'LOC003', name: 'Warehouse', address: 'Jl. Raya Industri No. 67, Surabaya' }
        ];
        setLocations(mockLocations);
        setSelectedLocation(mockLocations[0].id);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocationsData();
  }, []);

  // Generate QR Code
  const handleGenerateQR = async () => {
    if (!selectedLocation) {
      toast.error('Please select a location');
      return;
    }

    try {
      setLoading(true);
      const response = await generateQRCode(selectedLocation);
      
      console.log('Generate QR response:', response);
      
      const locationInfo = locations.find(loc => loc.id === selectedLocation);
      
      const qrDataObj = {
        location_id: selectedLocation,
        location_name: locationInfo?.name || 'Unknown Location',
        timestamp: new Date().toISOString(),
        qr_data: response.qr_data
      };
      
      setQrData(JSON.stringify(qrDataObj));
      
      toast.success('QR Code generated successfully!');
    } catch (error) {
      console.error('Error generating QR:', error);
      toast.error(error.message || 'Failed to generate QR Code');
    } finally {
      setLoading(false);
    }
  };

  // Download QR Code
  const handleDownloadQR = () => {
    if (!qrCodeRef.current) {
      toast.error('Please generate QR code first');
      return;
    }

    try {
      const canvas = qrCodeRef.current.querySelector('canvas');
      if (!canvas) {
        toast.error('QR Code not found');
        return;
      }

      const locationInfo = locations.find(loc => loc.id === selectedLocation);
      const filename = `QR_${locationInfo?.name?.replace(/\s+/g, '_') || selectedLocation}_${new Date().getTime()}.png`;
      
      canvas.toBlob((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('QR Code downloaded!');
      });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR Code');
    }
  };

  // Print QR Code
  const handlePrintQR = () => {
    if (!qrData) {
      toast.error('Please generate QR code first');
      return;
    }

    window.print();
  };

  // Copy QR Data
  const handleCopyData = () => {
    if (!qrData) {
      toast.error('Please generate QR code first');
      return;
    }

    navigator.clipboard.writeText(qrData);
    toast.success('QR Data copied to clipboard!');
  };

  const getLocationInfo = () => {
    return locations.find(loc => loc.id === selectedLocation);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Generate QR Code</h1>
        <p className="text-sm text-gray-500 mt-1">Create attendance QR code for locations</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Form */}
        <div className="space-y-6">
          {/* Location Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Location</h2>
            
            {loadingLocations ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading locations...</p>
              </div>
            ) : locations.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto mb-3 text-gray-400" size={32} />
                <p className="text-sm text-gray-500">No locations available</p>
              </div>
            ) : (
              <div className="space-y-4">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>

                {selectedLocation && getLocationInfo() && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {getLocationInfo()?.name}
                        </p>
                        {getLocationInfo()?.address && (
                          <p className="text-xs text-gray-500 mt-1">
                            {getLocationInfo()?.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateQR}
            disabled={!selectedLocation || loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <QrCode size={20} />
                Generate QR Code
              </>
            )}
          </button>

          {/* QR Info */}
          {qrData && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">QR Code Info</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`flex items-center gap-1 text-sm font-medium ${
                    timeRemaining === 'Expired' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    <CheckCircle size={16} />
                    {timeRemaining === 'Expired' ? 'Expired' : 'Active'}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">QR Data (JSON)</p>
                  <div className="bg-gray-50 rounded p-3 text-xs font-mono text-gray-700 break-all max-h-32 overflow-y-auto">
                    {qrData}
                  </div>
                  <button
                    onClick={handleCopyData}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Copy size={12} />
                    Copy to clipboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - QR Code Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">QR Code Preview</h2>
            
            {/* QR Code Display */}
            <div className="flex flex-col items-center justify-center">
              {qrData ? (
                <>
                  <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-4" ref={qrCodeRef}>
                    <QRCodeCanvas
                      value={qrData}
                      size={300}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  
                  <div className="text-center mb-4">
                    <p className="text-sm font-medium text-gray-900">
                      {getLocationInfo()?.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Scan to record attendance
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={handleDownloadQR}
                      className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Download
                    </button>
                    <button
                      onClick={handlePrintQR}
                      className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Printer size={18} />
                      Print
                    </button>
                  </div>

                  {/* Regenerate Button */}
                  <button
                    onClick={handleGenerateQR}
                    disabled={loading}
                    className="mt-3 w-full py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw size={18} />
                    Regenerate
                  </button>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode size={32} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Select a location and generate QR code
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Instructions</h3>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>Select the location where the QR will be used</li>
              <li>Click "Generate QR Code" button</li>
              <li>Download or print the QR code</li>
              <li>Display the QR code at the selected location</li>
              <li>Employees scan to record attendance</li>
              <li>QR expires in 5 minutes, regenerate as needed</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            padding: 40px;
          }
        }
      `}</style>
      
      {/* Printable Version */}
      {qrData && (
        <div className="print-area hidden print:block">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6">{getLocationInfo()?.name}</h1>
            <div className="mb-6 flex justify-center">
              <QRCodeCanvas
                value={qrData}
                size={400}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-xl font-medium mb-2">Scan QR Code to Record Attendance</p>
            <p className="text-sm text-gray-600">
              Expires: {expiresAt ? new Date(expiresAt).toLocaleString('id-ID') : '-'}
            </p>
            {getLocationInfo()?.address && (
              <p className="text-sm text-gray-500 mt-4">
                Location: {getLocationInfo()?.address}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQR;
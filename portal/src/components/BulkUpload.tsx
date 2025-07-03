import React, { useState, useRef, useEffect } from 'react';

// Define the room data type
interface RoomData {
  roomNumber: string;
  floor: string;
  block: string;
  roomType: string;
}

// Define the props type
interface BulkUploadProps {
  onBulkCreate: (rooms: RoomData[]) => void;
}

// Declare XLSX global type for CDN usage
declare global {
  interface Window {
    XLSX: any;
  }
}

const BulkUpload: React.FC<BulkUploadProps> = ({ onBulkCreate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedData, setUploadedData] = useState<RoomData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [xlsxLoaded, setXlsxLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load XLSX library from CDN
  useEffect(() => {
    if (window.XLSX) {
      setXlsxLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    script.onload = () => setXlsxLoaded(true);
    script.onerror = () => setError('Failed to load Excel processing library');
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const resetModal = () => {
    setUploadedData([]);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!xlsxLoaded) {
      setError('Excel processing library is still loading. Please wait a moment.');
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError('');
    setSuccess('');

    const reader = new FileReader();

    reader.onerror = () => {
      setError('Error reading file. Please try again.');
      setIsProcessing(false);
    };

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }
        
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = window.XLSX.read(data, { type: 'array' });

        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON
        const rawData: unknown[][] = window.XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: '' 
        });

        const processedData = validateAndProcessData(rawData);
        
        if (processedData.length === 0) {
          throw new Error('No valid room data found in the Excel file');
        }

        setUploadedData(processedData);
        setSuccess(`Successfully parsed ${processedData.length} rooms from Excel file`);
        setIsProcessing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error processing Excel file. Please check the format.');
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const validateAndProcessData = (rawData: unknown[][]): RoomData[] => {
    const processedRooms: RoomData[] = [];

    // Expected headers in exact order: Room Number, Floor, Block, Room Type
    const expectedHeaders = ['Room Number', 'Floor', 'Block', 'Room Type'];

    if (rawData.length === 0) {
      throw new Error('Excel file is empty');
    }

    let startRowIndex = 0;
    const firstRow = rawData[0];

    // If first row looks like headers, skip it
    if (firstRow && firstRow.some((cell: unknown) =>
      typeof cell === 'string' &&
      expectedHeaders.some(header =>
        cell.toLowerCase().includes(header.toLowerCase().split(' ')[0])
      )
    )) {
      startRowIndex = 1;
    }

    // Process data rows
    for (let i = startRowIndex; i < rawData.length; i++) {
      const row = rawData[i];

      // Skip empty rows
      if (!row || row.length === 0 || row.every((cell: unknown) => !cell)) {
        continue;
      }

      // Extract room data (expecting at least 4 columns)
      const roomNumber = String(row[0] || '').trim();
      const floor = String(row[1] || '').trim();
      const block = String(row[2] || '').trim();
      const roomType = String(row[3] || '').trim();

      // Validate required fields
      if (!roomNumber) {
        throw new Error(`Row ${i + 1}: Room Number is required`);
      }

      if (!floor) {
        throw new Error(`Row ${i + 1}: Floor is required`);
      }

      if (!block) {
        throw new Error(`Row ${i + 1}: Block is required`);
      }

      if (!roomType) {
        throw new Error(`Row ${i + 1}: Room Type is required`);
      }

      processedRooms.push({
        roomNumber,
        floor,
        block,
        roomType,
      });
    }

    return processedRooms;
  };

  const handleBulkCreate = async () => {
    if (uploadedData.length === 0) return;

    try {
      await onBulkCreate(uploadedData);
      setIsModalOpen(false);
      resetModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating rooms');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetModal();
  };

  const downloadTemplate = () => {
    if (!xlsxLoaded) {
      setError('Excel processing library is still loading. Please wait a moment.');
      return;
    }

    const templateData = [
      ['Room Number', 'Floor', 'Block', 'Room Type'],
      ['101', '1', 'A', 'Single'],
      ['102', '1', 'A', 'Double'],
      ['103', '1', 'A', 'Suite'],
      ['201', '2', 'A', 'Single'],
      ['202', '2', 'A', 'Double']
    ];

    const worksheet = window.XLSX.utils.aoa_to_sheet(templateData);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, 'Room Template');
    window.XLSX.writeFile(workbook, 'room_bulk_upload_template.xlsx');
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        📊 Bulk Upload
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Bulk Upload Rooms</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Loading XLSX Library */}
            {!xlsxLoaded && (
              <div className="p-6">
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Loading Excel processing library...</span>
                </div>
              </div>
            )}

            {/* Content */}
            {xlsxLoaded && (
              <div className="flex-1 overflow-y-auto p-6">
                
                {/* Instructions */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Upload an Excel file (.xlsx) with room data</li>
                    <li>• Required columns: Room Number, Floor, Block, Room Type</li>
                    <li>• The first row can contain headers (they will be auto-detected)</li>
                    <li>• All fields are required for each room</li>
                  </ul>
                  <button
                    onClick={downloadTemplate}
                    className="mt-3 text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    📥 Download Template File
                  </button>
                </div>

                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Excel File:
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {/* Status Messages */}
                {isProcessing && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                      <span className="text-yellow-800">Processing file...</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">{success}</p>
                  </div>
                )}

                {/* Data Preview */}
                {uploadedData.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Data Preview ({uploadedData.length} rooms)
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Room Number
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Floor
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Block
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Room Type
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {uploadedData.slice(0, 10).map((room, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-900">{room.roomNumber}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{room.floor}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{room.block}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{room.roomType}</td>
                              </tr>
                            ))}
                            {uploadedData.length > 10 && (
                              <tr>
                                <td colSpan={4} className="px-4 py-3 text-center text-gray-500 text-sm">
                                  ... and {uploadedData.length - 10} more rooms
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            {xlsxLoaded && (
              <div className="border-t p-6 bg-gray-50">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkCreate}
                    disabled={uploadedData.length === 0 || isProcessing}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Create {uploadedData.length} Rooms
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BulkUpload;
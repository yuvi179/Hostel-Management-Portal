import React, { useState } from 'react';
import { useEffect } from 'react';
import apiConfig from '../../config/apiConfig';

export type ResourceMetaData = {
  "resource": string,
  "fieldValues": any[]
}

const ReadAllotment = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDef1, setColDef1] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [fetchData, setFetchedData] = useState<any[]>([]);
  const [showToast, setShowToast] = useState<any>(false);
  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = `${apiConfig.getResourceUrl('allotment')}?`
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl('Allotment')}?`
  const BaseUrl = '${apiConfig.API_BASE_URL}';

  // Fetch resource data
  useEffect(() => {
    const fetchResourceData = async () => {
      console.log('Fetching data...');
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem('key');
      const queryId: any = 'GET_ALL';
      params.append('queryId', queryId);
      params.append('session_id', ssid);
      try {
        const response = await fetch(
          apiUrl + params.toString(),
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error('Error:' + response.status);
        }
        const data = await response.json();
        console.log('Data after fetching', data);
        setFetchedData(data.resource || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchResourceData();
  }, []);

  // Fetch metadata
  useEffect(() => {
    const fetchResMetaData = async () => {
      try {
        const response = await fetch(
          metadataUrl,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (response.ok) {
          const metaData = await response.json();
          setResMetaData(metaData);
          setFields(metaData[0]?.fieldValues || []);
          const required = metaData[0]?.fieldValues
            .filter((field: any) => !regex.test(field.name))
            .map((field: any) => field.name);
          setRequiredFields(required || []);
        } else {
          console.error('Failed to fetch metadata:' + response.statusText);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };
    fetchResMetaData();
  }, []);

  useEffect(() => {
    setRowData(fetchData || []);
  }, [fetchData]);

  const styles = {
    readAllotmentContainer: {
      height: '100vh',
      width: '100%',
      backgroundColor: '#F8FAFC',
      padding: 0,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
      boxSizing: 'border-box' as const,
    },
    dataGridContainer: {
      height: '100%',
      background: 'white',
      borderRadius: 0,
      boxShadow: 'none',
      overflow: 'hidden',
      border: 'none',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    customTableContainer: {
      flex: 1,
      overflow: 'auto',
      background: 'white',
    },
    customTable: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      fontFamily: "'Inter', sans-serif",
      fontSize: '13px',
      color: '#334155',
    },
    tableHeader: {
      backgroundColor: '#E1F5FE',
      position: 'sticky' as const,
      top: 0,
      zIndex: 10,
    },
    tableHeaderCell: {
      padding: '14px 16px',
      textAlign: 'left' as const,
      fontWeight: 500,
      fontSize: '13px',
      color: '#475569',
      borderBottom: '1px solid #B3E5FC',
      borderRight: '1px solid #B3E5FC',
      textTransform: 'none' as const,
      letterSpacing: 0,
      whiteSpace: 'nowrap' as const,
      backgroundColor: '#E1F5FE',
    },
    tableRow: {
      borderBottom: '1px solid #F1F5F9',
      transition: 'background-color 0.15s ease',
    },
    tableCell: {
      padding: '12px 16px',
      borderRight: '1px solid #F1F5F9',
      fontSize: '13px',
      color: '#475569',
      lineHeight: 1.4,
      verticalAlign: 'middle' as const,
      backgroundColor: 'white',
    },
    noDataMessage: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      color: '#6B7280',
      background: 'white',
      margin: '20px',
    },
    noDataIcon: {
      fontSize: '48px',
      marginBottom: '16px',
      opacity: 0.6,
    },
    noDataTitle: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#374151',
      margin: '0 0 8px 0',
    },
    noDataText: {
      fontSize: '14px',
      color: '#6B7280',
      margin: 0,
    },
    toastOverlay: {
      position: 'fixed' as const,
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      padding: '24px',
      pointerEvents: 'none' as const,
    },
    customToast: {
      minWidth: '300px',
      background: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      pointerEvents: 'auto' as const,
      borderLeft: '4px solid #10B981',
    },
    toastHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px 8px',
      fontWeight: 600,
      fontSize: '14px',
      color: '#374151',
    },
    toastClose: {
      background: 'none',
      border: 'none',
      fontSize: '18px',
      color: '#9CA3AF',
      cursor: 'pointer',
      padding: 0,
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    toastBody: {
      padding: '0 16px 12px',
      fontSize: '13px',
      color: '#6B7280',
    },
  };

  return (
    <div style={styles.readAllotmentContainer}>
      <div style={styles.dataGridContainer}>
        {/* Table Container */}
        {rowData.length === 0 && requiredFields.length === 0 ? (
          <div style={styles.noDataMessage}>
            <div style={styles.noDataIcon}>📊</div>
            <h3 style={styles.noDataTitle}>No Data Available</h3>
            <p style={styles.noDataText}>Please add a resource attribute to view allotment data.</p>
          </div>
        ) : (
          <div style={styles.customTableContainer}>
            <table style={styles.customTable}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={{...styles.tableHeaderCell, borderRight: 'none'}}>S.No.</th>
                  {requiredFields
                    .filter(field => field !== 'id')
                    .map((field, index) => (
                      <th 
                        key={index} 
                        style={{
                          ...styles.tableHeaderCell,
                          borderRight: index === requiredFields.filter(f => f !== 'id').length - 1 ? 'none' : '1px solid #B3E5FC'
                        }}
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {rowData.map((row, index) => (
                  <tr 
                    key={index} 
                    style={styles.tableRow}
                    onMouseEnter={(e) => {
                      (e.target as HTMLTableRowElement).style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLTableRowElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{...styles.tableCell, borderRight: 'none'}}>{index + 1}</td>
                    {requiredFields
                      .filter(field => field !== 'id')
                      .map((field, fieldIndex) => (
                        <td 
                          key={fieldIndex} 
                          style={{
                            ...styles.tableCell,
                            borderRight: fieldIndex === requiredFields.filter(f => f !== 'id').length - 1 ? 'none' : '1px solid #F1F5F9'
                          }}
                        >
                          {row[field] || '-'}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div style={styles.toastOverlay}>
          <div style={styles.customToast}>
            <div style={styles.toastHeader}>
              <span>Success</span>
              <button
                style={styles.toastClose}
                onClick={() => setShowToast(false)}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.color = '#6B7280';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.color = '#9CA3AF';
                }}
              >
                ×
              </button>
            </div>
            <div style={styles.toastBody}>
              Created successfully!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadAllotment;
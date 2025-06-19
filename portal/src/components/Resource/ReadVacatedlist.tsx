import React, { useState } from 'react';
import { useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
import styles from './ReadVacatedlist.module.css';

export type ResourceMetaData = {
  "resource": string,
  "fieldValues": any[]
}

const ReadVacatedlist = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDef1, setColDef1] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [fetchData, setFetchedData] = useState<any[]>([]);
  const [showToast, setShowToast] = useState<any>(false);
  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = `${apiConfig.getResourceUrl('vacatedlist')}?`
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl('Vacatedlist')}?`
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

  return (
    <div className={styles.readVacatedlistContainer}>
      <div className={styles.dataGridContainer}>
        {/* Table Container */}
        {rowData.length === 0 && requiredFields.length === 0 ? (
          <div className={styles.noDataMessage}>
            <div className={styles.noDataIcon}>📊</div>
            <h3>No Data Available</h3>
            <p>Please add a resource attribute to view vacated list data.</p>
          </div>
        ) : (
          <div className={styles.customTableContainer}>
            <table className={styles.customTable}>
              <thead>
                <tr>
                  <th className={styles.snoHeader}>S.No.</th>
                  {requiredFields
                    .filter(field => field !== 'id')
                    .map((field, index) => (
                      <th key={index}>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {rowData.map((row, index) => (
                  <tr key={index}>
                    <td className={styles.snoCell}>{index + 1}</td>
                    {requiredFields
                      .filter(field => field !== 'id')
                      .map((field, fieldIndex) => (
                        <td key={fieldIndex}>
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
        <div className={styles.toastOverlay}>
          <div className={`${styles.customToast} ${styles.successToast}`}>
            <div className={styles.toastHeader}>
              <span>Success</span>
              <button
                className={styles.toastClose}
                onClick={() => setShowToast(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.toastBody}>
              Created successfully!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadVacatedlist;
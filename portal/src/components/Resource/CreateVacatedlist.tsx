import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
import styles from './CreateVacatedlist.module.css';

export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const CreateVacatedlist = () => {
  const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<any>(false);
  const [foreignkeyData, setForeignkeyData] = useState<Record<string, any[]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = apiConfig.getResourceUrl("vacatedlist");
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Vacatedlist");

  useEffect(() => {
    const fetchResMetaData = async () => {
      const fetchedResources = new Set();
      const fetchedEnum = new Set();
      try {
        const data = await fetch(metadataUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (data.ok) {
          const metaData = await data.json();
          setResMetaData(metaData);
          setFields(metaData[0].fieldValues);
          const foreignFields = metaData[0].fieldValues.filter((field: any) => field.foreign);

          for (const field of foreignFields) {
            if (!fetchedResources.has(field.foreign)) {
              fetchedResources.add(field.foreign);
              await fetchForeignData(field.foreign, field.name, field.foreign_field);
            }
          }

          const enumFields = metaData[0].fieldValues.filter((field: any) => field.isEnum === true);
          for (const field of enumFields) {
            if (!fetchedEnum.has(field.possible_value)) {
              fetchedEnum.add(field.possible_value);
              await fetchEnumData(field.possible_value);
            }
          }
        } else {
          console.error('Failed to fetch components:', data.statusText);
        }
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    };

    fetchResMetaData();
  }, []);

  const fetchEnumData = async (enumName: string) => {
    try {
      const response = await fetch(`${apiConfig.API_BASE_URL}/${enumName}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setEnums((prev) => ({
          ...prev,
          [enumName]: data
        }));
      } else {
        console.error(`Error fetching enum data for ${enumName}:`, response.status);
      }
    } catch (error) {
      console.error(`Error fetching enum data for ${enumName}:`, error);
    }
  };

  const fetchForeignData = async (foreignResource: string, fieldName: string, foreignField: string) => {
    try {
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem('key');
      params.append('queryId', 'GET_ALL');
      params.append('session_id', ssid);

      const response = await fetch(`${apiConfig.API_BASE_URL}/${foreignResource.toLowerCase()}?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setForeignkeyData((prev) => ({
          ...prev,
          [foreignResource]: data.resource
        }));
      } else {
        console.error(`Error fetching foreign data for ${fieldName}:`, response.status);
      }
    } catch (error) {
      console.error(`Error fetching foreign data for ${fieldName}:`, error);
    }
  };

  const handleCreate = async () => {
    const params = new URLSearchParams();
    const jsonString = JSON.stringify(dataToSave);
    const base64Encoded = btoa(jsonString);
    params.append('resource', base64Encoded);
    const ssid: any = sessionStorage.getItem('key');
    params.append('session_id', ssid);

    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.ok) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDataToSave({});
    }
  };

  const handleSearchChange = (fieldName: string, value: string) => {
    setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
  };

  const getFieldDisplayName = (fieldName: string, isRequired: boolean = false) => {
    const fieldMappings: Record<string, string> = {
      'floor': 'Floor',
      'block': 'Block',
      'roomnumber': 'Room Number',
      'room_number': 'Room Number',
      'roomtype': 'Room Type',
      'room_type': 'Room Type'
    };
    const displayName = fieldMappings[fieldName.toLowerCase()] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    return isRequired ? `${displayName}*` : displayName;
  };

  return (
    <div className={styles.createRoomContainer}>
      <div className={styles.formGrid}>
        {fields.map((field, index) => {
          if (field.name !== 'id' && !regex.test(field.name)) {
            if (field.foreign) {
              const options = foreignkeyData[field.foreign] || [];
              const filteredOptions = options.filter((option) =>
                option[field.foreign_field].toLowerCase().includes((searchQueries[field.name] || '').toLowerCase())
              );

              return (
                <div key={index} className={`${styles.formField} ${styles.dropdownField}`}>
                  <input
                    type="text"
                    className={`${styles.formInput} ${styles.dropdownDisplay}`}
                    placeholder={getFieldDisplayName(field.name, field.required)}
                    value={dataToSave[field.name]
                      ? options.find((item) => item[field.name] === dataToSave[field.name])?.[field.name] || ''
                      : ''}
                    readOnly
                    onClick={() => {
                      setDropdownOpen((prev) => ({
                        ...prev,
                        [field.name]: !prev[field.name]
                      }));
                    }}
                  />
                  <div className={`${styles.dropdownMenu} ${dropdownOpen[field.name] ? styles.show : ''}`}>
                    <input
                      type="text"
                      className={styles.dropdownSearch}
                      placeholder={`Search ${getFieldDisplayName(field.name)}`}
                      value={searchQueries[field.name] || ''}
                      onChange={(e) => handleSearchChange(field.name, e.target.value)}
                    />
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option, i) => (
                        <button
                          key={i}
                          className={styles.dropdownItem}
                          type="button"
                          onClick={() => {
                            setDataToSave({ ...dataToSave, [field.name]: option[field.name] });
                            setDropdownOpen((prev) => ({
                              ...prev,
                              [field.name]: false
                            }));
                          }}
                        >
                          {option[field.name]}
                        </button>
                      ))
                    ) : (
                      <span className={styles.dropdownItemDisabled}>No options available</span>
                    )}
                  </div>
                </div>
              );
            } else if (field.isEnum === true) {
              return (
                <div key={index} className={styles.formField}>
                  <select
                    name={field.name}
                    required={field.required}
                    value={dataToSave[field.name] || ''}
                    onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
                    className={`${styles.formInput} ${styles.formSelect}`}
                  >
                    <option value="" disabled hidden>{getFieldDisplayName(field.name, field.required)}</option>
                    {Object.keys(enums).length !== 0 && enums[field.possible_value].map((enumValue: any, index: number) => (
                      <option key={index} value={enumValue}>
                        {enumValue}
                      </option>
                    ))}
                  </select>
                </div>
              );
            } else {
              return (
                <div key={index} className={styles.formField}>
                  <input
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    placeholder={getFieldDisplayName(field.name, field.required)}
                    value={dataToSave[field.name] || ''}
                    onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
                    className={styles.formInput}
                  />
                </div>
              );
            }
          }
          return null;
        })}
      </div>

      <div className={styles.formActions2}>
        <button className={styles.submitButton} onClick={handleCreate}>
          Submit
        </button>
      </div>

      {showToast && (
        <div className={styles.toastOverlay}>
          <div className={`${styles.customToast} ${styles.successToast}`}>
            <div className={styles.toastHeader}>
              <strong>Success</strong>
              <button
                type="button"
                className={styles.toastClose}
                onClick={() => setShowToast(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.toastBody}>Created successfully!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateVacatedlist;

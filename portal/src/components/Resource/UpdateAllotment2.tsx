import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
import styles from './UpdateAllotment.module.css';

export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const UpdateAllotment = () => {
  const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<any>(false);
  const [foreignkeyData, setForeignkeyData] = useState<Record<string, any[]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [allotmentData, setAllotmentData] = useState<any[]>([]);
  const [selectedAllotment, setSelectedAllotment] = useState<any>(null);
  const [rollNumberDropdownOpen, setRollNumberDropdownOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = apiConfig.getResourceUrl("allotment")
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Allotment")

  // Check for mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch metadata
  useEffect(() => {
    const fetchResMetaData = async () => {
      const fetchedResources = new Set();
      const fetchedEnum = new Set();
      console.log("fetched resources",fetchedResources)
      try {
        const data = await fetch(
          metadataUrl,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (data.ok) {
          const metaData = await data.json();
          setResMetaData(metaData);
          setFields(metaData[0].fieldValues);
          const foreignFields = metaData[0].fieldValues.filter((field: any) => field.foreign);
          console.log("foreign fields",foreignFields)
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
    fetchAllotmentData();
   
  }, []);

  useEffect(()=>{
    console.log("data to save",dataToSave)
  },[dataToSave])

  // Fetch allotment data for roll number dropdown
  const fetchAllotmentData = async () => {
    try {
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem('key');
      params.append('queryId', 'GET_ALL');
      params.append('session_id', ssid);

      const response = await fetch(
        `${apiUrl}?`+params.toString(),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAllotmentData(data.resource || []);
      } else {
        console.error('Error fetching allotment data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching allotment data:', error);
    }
  };

  const fetchEnumData = async (enumName: string) => {
    try {
      const response = await fetch(
        `${apiConfig.API_BASE_URL}/${enumName}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

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
  }

  const fetchForeignData = async (foreignResource: string, fieldName: string, foreignField: string) => {
    try {
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem('key');
      params.append('queryId', 'GET_ALL');
      params.append('session_id', ssid);

      const response = await fetch(
        `${apiConfig.API_BASE_URL}/${foreignResource.toLowerCase()}?`+params.toString(),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

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

  const handleUpdate = async () => {
    if (!selectedAllotment || !selectedAllotment.id) {
      console.error('No allotment selected for update');
      return;
    }

    const updatedRecord = {
      id: selectedAllotment.id,
      ...dataToSave,
    };

    const params = new URLSearchParams();
    const jsonString = JSON.stringify(updatedRecord);
    const base64Encoded = btoa(jsonString);
    params.append('resource', base64Encoded);
    params.append('action', 'MODIFY');
    const ssid: any = sessionStorage.getItem('key');
    params.append('session_id', ssid);
    
    const response = await fetch(apiUrl+`?`+params.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.ok) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      // Refresh the allotment data
      fetchAllotmentData();
      // Reset the form
      setDataToSave({});
      setSelectedAllotment(null);
      setSearchQuery('');
    }
  };

  const handleSearchChange = (fieldName: string, value: string) => {
    setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
  };

  const toggleDropdown = (fieldName: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const handleRollNumberSelect = (allotment: any) => {
    setSelectedAllotment(allotment);
    setSearchQuery(allotment.rollnumber || '');
    
    // Populate form with existing allotment data
    const updatedData = { ...allotment };
    // Remove id from the form data as it's handled separately
    delete updatedData.id;
    
    setDataToSave(updatedData);
    setRollNumberDropdownOpen(false);
  };

  const filteredAllotments = allotmentData.filter((allotment) =>
    (allotment.rollnumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (allotment.studentname || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFieldDisplayName = (fieldName: string, isRequired: boolean = false) => {
    // Convert field names to match common naming conventions
    const fieldMappings: Record<string, string> = {
      'studentname': 'Student Name',
      'email': 'Email',
      'mobile': 'Mobile',
      'degree': 'Degree',
      'room_id': 'Room Number',
      'room_number': 'Room Number',
      'roomnumber': 'Room Number',
      'bed_id': 'Bed ID',
      'allotment_date': 'Allotment Date',
      'allotment_type': 'Allotment Type',
      'status': 'Status',
      'remarks': 'Remarks',
      'semester': 'Semester',
      'academic_year': 'Academic Year',
      'checkindnt': 'Check In Date & Time',
      'checkoutdnt': 'Check Out Date & Time',
      'newroomnumber': 'New Room Number',
      'oldroomnumber': 'Old Room Number',
      'isshift': 'Shift',
      'rollnumber': 'Roll Number'
    };
    
    const displayName = fieldMappings[fieldName.toLowerCase()] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    return isRequired ? `${displayName}*` : displayName;
  };

  // Define field order and grouping based on the updated requirements
  const getFieldOrder = () => {
    // Left column: student details (exactly like create allotment)
    const leftColumnFields = ['email', 'degree', 'mobile']; // Exclude studentname as it's handled separately
    
    // Right column: check-out and remarks only
    const rightColumnFields = ['checkoutdnt', 'remarks'];
    
    const leftFields = fields.filter(field => 
      field.name !== 'id' && 
      !regex.test(field.name) && 
      field.name !== 'rollnumber' && // Exclude rollnumber from form fields
      field.name !== 'studentname' && // Exclude studentname from leftFields
      leftColumnFields.includes(field.name.toLowerCase())
    ).sort((a, b) => leftColumnFields.indexOf(a.name.toLowerCase()) - leftColumnFields.indexOf(b.name.toLowerCase()));
    
    const rightFields = fields.filter(field => 
      field.name !== 'id' && 
      !regex.test(field.name) && 
      field.name !== 'rollnumber' && // Exclude rollnumber from form fields
      rightColumnFields.includes(field.name.toLowerCase())
    ).sort((a, b) => rightColumnFields.indexOf(a.name.toLowerCase()) - rightColumnFields.indexOf(b.name.toLowerCase()));
    
    return { leftFields, rightFields };
  };

  // Render Student Name function (exactly like create allotment)
  const renderStudentName = () => {
    const isAutoPopulated = selectedAllotment;
    
    return (
      <div className={styles.formField}>
        <input
          type="text"
          name="studentname"
          placeholder="Student Name*"
          value={selectedAllotment ? selectedAllotment.studentname : (dataToSave.studentname || '')}
          onChange={(e) => setDataToSave({ ...dataToSave, studentname: e.target.value })}
          className={`${styles.formInput} ${isAutoPopulated ? styles.autoPopulated : ''}`}
          readOnly={isAutoPopulated}
        />
      </div>
    );
  };

  const renderField = (field: any, index: number) => {
    // For student detail fields, make them auto-populated (like create allotment)
    const isStudentDetailField = ['email', 'degree', 'mobile'].includes(field.name.toLowerCase());
    const isAutoPopulated = selectedAllotment && isStudentDetailField;

    if (field.foreign) {
      const options = foreignkeyData[field.foreign] || [];
      const filteredOptions = options.filter((option) =>
        option[field.foreign_field].toLowerCase().includes((searchQueries[field.name] || '').toLowerCase())
      );
      
      return (
        <div key={index} className={`${styles.formField} ${styles.dropdownField}`}>
          <input
            type="text"
            className={`${styles.formInput} ${styles.dropdownDisplay} ${isAutoPopulated ? styles.autoPopulated : ''}`}
            placeholder={getFieldDisplayName(field.name, field.required)}
            value={dataToSave[field.name] ? 
              options.find((item) => item[field.name] === dataToSave[field.name])?.[field.name] || '' 
              : ''}
            readOnly
            onClick={() => !isAutoPopulated && toggleDropdown(field.name)}
          />
          {!isAutoPopulated && (
            <div className={`${styles.dropdownMenu} ${openDropdowns[field.name] ? styles.show : ''}`}>
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
                      toggleDropdown(field.name);
                    }}
                  >
                    {option[field.name]}
                  </button>
                ))
              ) : (
                <span className={styles.dropdownItemDisabled}>No options available</span>
              )}
            </div>
          )}
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
            className={`${styles.formInput} ${styles.formSelect} ${isAutoPopulated ? styles.autoPopulated : ''}`}
            disabled={isAutoPopulated}
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
      // Special handling for textarea fields
      const isTextarea = field.name.toLowerCase() === 'remarks' || field.type === 'textarea';
      
      if (isTextarea) {
        return (
          <div key={index} className={styles.formField}>
            <textarea
              name={field.name}
              required={field.required}
              placeholder={getFieldDisplayName(field.name, field.required)}
              value={dataToSave[field.name] || ''}
              onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
              className={`${styles.formInput} ${styles.formTextarea} ${isAutoPopulated ? styles.autoPopulated : ''}`}
              rows={isMobile ? 3 : 4}
              readOnly={isAutoPopulated}
            />
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
              className={`${styles.formInput} ${isAutoPopulated ? styles.autoPopulated : ''}`}
              readOnly={isAutoPopulated}
            />
          </div>
        );
      }
    }
  };

  const renderShiftCheckbox = () => {
    return (
      <div className={styles.formField}>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            name="isshift"
            checked={dataToSave.isshift || false}
            onChange={(e) => setDataToSave({ ...dataToSave, isshift: e.target.checked })}
            className={styles.checkboxInput}
          />
          <span className={styles.checkboxLabel}>{getFieldDisplayName('isshift')}</span>
        </label>
      </div>
    );
  };

  const { leftFields, rightFields } = getFieldOrder();

  return (
    <div className={styles.createAllotmentContainer}>
      {/* Search Section with Roll Number/Student Dropdown */}
      <div className={styles.searchSection}>
        <div className={`${styles.searchInputContainer} ${styles.dropdownField}`}>
          <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className={`${styles.searchInput} ${styles.dropdownDisplay}`}
            placeholder="Search by Roll Number or Student Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={() => setRollNumberDropdownOpen(!rollNumberDropdownOpen)}
            readOnly
          />
          <div className={`${styles.dropdownMenu} ${rollNumberDropdownOpen ? styles.show : ''}`}>
            <input
              type="text"
              className={styles.dropdownSearch}
              placeholder="Search Roll Number or Student Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {filteredAllotments.length > 0 ? (
              filteredAllotments.map((allotment, i) => (
                <button
                  key={i}
                  className={styles.dropdownItem}
                  type="button"
                  onClick={() => handleRollNumberSelect(allotment)}
                >
                  {allotment.rollnumber} - {allotment.studentname}
                </button>
              ))
            ) : (
              <span className={styles.dropdownItemDisabled}>No allotments found</span>
            )}
          </div>
        </div>
        <button 
          className={styles.selectRoomButton}
          onClick={() => {
            setDataToSave({});
            setSelectedAllotment(null);
            setSearchQuery('');
          }}
        >
          Clear Form
        </button>
      </div>

      {/* Form Container */}
      <div className={styles.formContainer}>
        {/* Left Column - Student Details (Auto-populated) */}
        <div className={styles.leftColumn}>
          {/* Render student name explicitly */}
          {renderStudentName()}
          
          {/* Render other left fields */}
          {leftFields.map((field, index) => renderField(field, index))}
        </div>

        {/* Right Column - Check-out, Remarks and Shift Checkbox */}
        <div className={styles.rightColumn}>
          {rightFields.map((field, index) => renderField(field, index))}
          {renderShiftCheckbox()}
        </div>
      </div>
      
      <div className={styles.formActions}>
        <button 
          className={styles.submitButton} 
          onClick={handleUpdate}
          disabled={!selectedAllotment}
        >
          Check Out
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
            <div className={styles.toastBody}>Allotment updated successfully!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateAllotment;
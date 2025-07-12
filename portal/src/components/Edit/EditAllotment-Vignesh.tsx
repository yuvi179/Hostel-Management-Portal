import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import apiConfig from "../../config/apiConfig";
import styles from '../Resource/CreateAllotment-Vignesh.module.css';

export type ResourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const Edit = () => {
  const location = useLocation();
  const id = location.state.id;
  const editedData = location.state.editedData;
  const currUrl = location.state.currUrl;
  const resName = location.state.resName;
  const apiUrl = location.state.apiUrl;
  const metadataUrl = location.state.metadataUrl;
  const BaseUrl = location.state.BaseUrl;

  const [editedRecord, setEditedRecord] = useState<any>(editedData || {});
  const [fields, setFields] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [studentData, setStudentData] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [rollNumberDropdownOpen, setRollNumberDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  const regex = /^(g_|archived|extra_data)/;

  // Check for mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchResMetaData = async () => {
      const fetchedResources = new Set();
      const fetchedEnum = new Set();
      try {
        const response = await fetch(
          metadataUrl,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const metaData = await response.json();
          setResMetaData(metaData);

          const fields = metaData[0]?.fieldValues || [];
          setFields(fields);

          const required = fields
            .filter((field: any) => !regex.test(field.name))
            .map((field: any) => field.name);
          setRequiredFields(required);

          const foreignFields = fields.filter((field: any) => field.foreign);
          for (const field of foreignFields) {
            if (!fetchedResources.has(field.foreign)) {
              fetchedResources.add(field.foreign);
              await fetchForeignData(field.foreign, field.name, field.foreign_field);
            }
          }

          const enumFields = fields.filter((field: any) => field.isEnum === true);
          for (const field of enumFields) {
            if (!fetchedEnum.has(field.possible_value)) {
              fetchedEnum.add(field.possible_value);
              await fetchEnumData(field.possible_value);
            }
          }
        } else {
          console.error("Failed to fetch metadata:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    fetchResMetaData();
    fetchStudentData();
  }, [resName]);

  // Fetch student data for roll number dropdown
  const fetchStudentData = async () => {
    try {
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem('key');
      params.append('queryId', 'GET_ALL');
      params.append('session_id', ssid);

      const response = await fetch(
        `${apiConfig.API_BASE_URL}/student?`+params.toString(),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStudentData(data.resource || []);
      } else {
        console.error('Error fetching student data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
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
      const ssid: any = sessionStorage.getItem("key");
      params.append("queryId", "GET_ALL");
      params.append("session_id", ssid);

      const response = await fetch(
        `${BaseUrl}/${foreignResource.toLowerCase()}?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setForeignKeyData((prev) => ({
          ...prev,
          [foreignResource]: data.resource,
        }));
      } else {
        console.error(`Error fetching foreign data for ${fieldName}:`, response.status);
      }
    } catch (error) {
      console.error(`Error fetching foreign data for ${fieldName}:`, error);
    }
  };

  const handleEdit = (field: string, value: string) => {
    setEditedRecord((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
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

  const handleRollNumberSelect = (student: any) => {
    setSelectedStudent(student);
    setSearchQuery(student.rollnumber || student.roll_number || '');
    
    // Auto-populate student fields
    const updatedData = { ...editedRecord };
    
    // Map student data to form fields
    if (student.username) {
      updatedData.studentname = student.username;
    }
    if (student.email) {
      updatedData.email = student.email;
    }
    if (student.degree) {
      updatedData.degree = student.degree;
    }
    if (student.mobile || student.phone) {
      updatedData.mobile = student.mobile || student.phone;
    }
    if (student.rollnumber || student.roll_number) {
      updatedData.rollnumber = student.id;
    }
    updatedData.roomnumber = '841679e6-7b33-43e9-bdf2-ade03b3b4771-42';
    
    setEditedRecord(updatedData);
    setRollNumberDropdownOpen(false);
  };

  const handleUpdate = async () => {
    if (!editedRecord || Object.keys(editedRecord).length === 0) return;

    const updatedRecord = {
      id,
      ...editedRecord,
    };

    const base64Encoded = btoa(JSON.stringify(updatedRecord));
    const params = new URLSearchParams();
    const ssid: any = sessionStorage.getItem("key");
    params.append("resource", base64Encoded);
    params.append("action", "MODIFY");
    params.append("session_id", ssid);

    try {
      const response = await fetch(
        apiUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        }
      );

      if (response.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        window.location.assign(currUrl);
      } else {
        console.error("Error updating record:", response.statusText);
      }
    } catch (error) {
      console.error("Error in handleUpdate:", error);
    }
  };

  const filteredStudents = studentData.filter((student) =>
    (student.rollnumber || student.roll_number || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFieldDisplayName = (fieldName: string, isRequired: boolean = false) => {
    const fieldMappings: Record<string, string> = {
      'name' : 'Studentname',
      'student_id': 'Studentname',
      'studentname': 'Studentname',
      'username': 'Studentname',
      'email': 'Email',
      'mobile': 'Mobile',
      'degree': 'Degree',
      'room_id': 'Roomnumber',
      'room_number': 'Roomnumber',
      'roomnumber': 'Roomnumber',
      'bed_id': 'Bed ID',
      'allotment_date': 'Allotment Date',
      'allotment_type': 'Allotment Type',
      'status': 'Status',
      'remarks': 'Remarks',
      'semester': 'Semester',
      'academic_year': 'Academic Year',
      'checkindt': 'Checkindt',
      'checkoutdt': 'Checkoutdt',
      'newroomnumber': 'Newroomnumber',
      'oldroomnumber': 'Oldroomnumber',
      'isshift': 'Isshift',
      'rollnumber': 'Rollnumber'
    };
    
    const displayName = fieldMappings[fieldName.toLowerCase()] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    return isRequired ? `${displayName}*` : displayName;
  };

  // Define field order and grouping
  const getFieldOrder = () => {
    const leftColumnFields = ['email', 'degree', 'mobile'];
    const rightColumnFields = ['checkindnt','checkoutdnt','remarks'];
    
    const leftFields = fields.filter(field => 
      field.name !== 'id' && 
      !regex.test(field.name) && 
      field.name !== 'rollnumber' && 
      field.name !== 'studentname' && 
      leftColumnFields.includes(field.name.toLowerCase())
    ).sort((a, b) => leftColumnFields.indexOf(a.name.toLowerCase()) - leftColumnFields.indexOf(b.name.toLowerCase()));
    
    const rightFields = fields.filter(field => 
      field.name !== 'id' && 
      !regex.test(field.name) && 
      field.name !== 'rollnumber' && 
      rightColumnFields.includes(field.name.toLowerCase())
    ).sort((a, b) => rightColumnFields.indexOf(a.name.toLowerCase()) - rightColumnFields.indexOf(b.name.toLowerCase()));
    
    return { leftFields, rightFields };
  };

  // Render Name function
  const renderName = () => {
    const isAutoPopulated = selectedStudent;
    
    return (
      <div className={styles.formField}>
        <input
          type="text"
          name="studentname"
          placeholder="Student Name*"
          value={editedRecord.studentname || ''}
          onChange={(e) => handleEdit('studentname', e.target.value)}
          className={`${styles.formInput} ${isAutoPopulated ? styles.autoPopulated : ''}`}
          readOnly
        />
      </div>
    );
  };

  const renderField = (field: any, index: number) => {
    const isStudentDetailField = ['email', 'degree', 'mobile'].includes(field.name.toLowerCase());
    const isAutoPopulated = selectedStudent && isStudentDetailField;

    if (field.foreign) {
      const options = foreignKeyData[field.foreign] || [];
      const filteredOptions = options.filter((option) =>
        option[field.foreign_field].toLowerCase().includes((searchQueries[field.name] || '').toLowerCase())
      );
      
      return (
        <div key={index} className={`${styles.formField} ${styles.dropdownField}`}>
          <input
            type="text"
            className={`${styles.formInput} ${styles.dropdownDisplay} ${isAutoPopulated ? styles.autoPopulated : ''}`}
            placeholder={getFieldDisplayName(field.name, field.required)}
            value={editedRecord[field.name] || ''}
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
                      handleEdit(field.name, option[field.foreign_field]);
                      toggleDropdown(field.name);
                    }}
                  >
                    {option[field.foreign_field]}
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
            value={editedRecord[field.name] || ''}
            onChange={(e) => handleEdit(field.name, e.target.value)}
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
      const isTextarea = field.name.toLowerCase() === 'remarks' || field.type === 'textarea';
      const isDateField = field.name.toLowerCase().includes('date') || field.name.toLowerCase().includes('dt');
      
      if (isTextarea) {
        return (
          <div key={index} className={styles.formField}>
            <textarea
              name={field.name}
              required={field.required}
              placeholder={getFieldDisplayName(field.name, field.required)}
              value={editedRecord[field.name] || ''}
              onChange={(e) => handleEdit(field.name, e.target.value)}
              className={`${styles.formInput} ${styles.formTextarea} ${isAutoPopulated ? styles.autoPopulated : ''}`}
              rows={isMobile ? 3 : 4}
              readOnly={isAutoPopulated}
            />
          </div>
        );
      } else if (isDateField) {
        return (
          <div key={index} className={`${styles.formField} ${styles.dateInputContainer}`}>
            <input
              type="datetime-local"
              name={field.name}
              required={field.required}
              placeholder={getFieldDisplayName(field.name, field.required)}
              value={editedRecord[field.name] || ''}
              onChange={(e) => handleEdit(field.name, e.target.value)}
              className={`${styles.formInput} ${styles.dateInput} ${isAutoPopulated ? styles.autoPopulated : ''}`}
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
              value={editedRecord[field.name] || ''}
              onChange={(e) => handleEdit(field.name, e.target.value)}
              className={`${styles.formInput} ${isAutoPopulated ? styles.autoPopulated : ''}`}
              readOnly={isAutoPopulated}
            />
          </div>
        );
      }
    }
  };

  const { leftFields, rightFields } = getFieldOrder();

  return (
    <div className={styles.createAllotmentContainer}>
      {/* Search Section with Roll Number Dropdown */}
      <div className={styles.searchSection}>
        <div className={`${styles.searchInputContainer} ${styles.dropdownField}`}>
          <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className={`${styles.searchInput} ${styles.dropdownDisplay}`}
            placeholder="Roll Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={() => setRollNumberDropdownOpen(!rollNumberDropdownOpen)}
            readOnly
          />
          <div className={`${styles.dropdownMenu} ${rollNumberDropdownOpen ? styles.show : ''}`}>
            <input
              type="text"
              className={styles.dropdownSearch}
              placeholder="Search Roll Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, i) => (
                <button
                  key={i}
                  className={styles.dropdownItem}
                  type="button"
                  onClick={() => handleRollNumberSelect(student)}
                >
                  {student.rollnumber || student.roll_number} - {student.username}
                </button>
              ))
            ) : (
              <span className={styles.dropdownItemDisabled}>No students found</span>
            )}
          </div>
        </div>
        <button className={styles.selectRoomButton}>
          Select Room
        </button>
      </div>

      {/* Form Container */}
      <div className={styles.formContainer}>
        {/* Left Column - Student Details */}
        <div className={styles.leftColumn}>
          {/* Render student name explicitly */}
          {renderName()}
          
          {/* Render other left fields */}
          {leftFields.map((field, index) => renderField(field, index))}
        </div>

        {/* Right Column - Other Fields */}
        <div className={styles.rightColumn}>
          {rightFields.map((field, index) => renderField(field, index))}
        </div>
      </div>
      
      <div className={styles.formActions}>
        <button className={styles.submitButton} onClick={handleUpdate}>
          Update Record
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
            <div className={styles.toastBody}>Updated successfully!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit;
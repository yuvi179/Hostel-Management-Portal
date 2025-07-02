import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
import styles from './CreateAllotment-Vignesh.module.css';

export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const CreateAllotment = () => {
  const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<any>(false);
  const [foreignkeyData, setForeignkeyData] = useState<Record<string, any[]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [studentData, setStudentData] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
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
      console.log("fectched resources",fetchedResources)
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
    fetchStudentData();
   
  }, []);

  useEffect(()=>{
    console.log("data to save",dataToSave)
  },[dataToSave])

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

  const handleCreate = async () => {
    const params = new URLSearchParams();
    const jsonString = JSON.stringify(dataToSave);
    const base64Encoded = btoa(jsonString);
    params.append('resource', base64Encoded);
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
      setDataToSave({});
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

  const handleRollNumberSelect = (student: any) => {
    setSelectedStudent(student);
    setSearchQuery(student.rollnumber || student.roll_number || '');
    
    // Auto-populate student fields
    const updatedData = { ...dataToSave };
    
    // Map student data to form fields - Fix the naming convention
    // Student resource has 'name' attribute, allotment resource expects 'studentname'
    if (student.name) {
      updatedData.studentname = student.name; // Map 'name' from student to 'studentname' in allotment
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
      updatedData.rollnumber = student.rollnumber || student.roll_number;
    }
    
    setDataToSave(updatedData);
    setRollNumberDropdownOpen(false);
  };

  const filteredStudents = studentData.filter((student) =>
    (student.rollnumber || student.roll_number || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFieldDisplayName = (fieldName: string, isRequired: boolean = false) => {
    // Convert field names to match common naming conventions
    const fieldMappings: Record<string, string> = {
      /* 'name' : 'Studentname',
      'student_id': 'Studentname', */
      'name': 'Studentname',
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

  // Define field order and grouping based on the updated requirements
  const getFieldOrder = () => {
    // Left column: student details (auto-populated from roll number selection)
    const leftColumnFields = ['email', 'degree', 'mobile']; // Exclude studentname as it's handled separately
    
    // Right column: other allotment fields (excluding rollnumber as it's now in search section)
    const rightColumnFields = ['checkindnt','checkoutdnt','remarks'];
    
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

  // Render Name function to explicitly render student name
  const renderName = () => {
    const isAutoPopulated = selectedStudent;
    
    return (
      <div className={styles.formField}>
        <input
          type="text"
          name="studentname"
          placeholder="Student Name*"
          value={selectedStudent ? selectedStudent.name : (dataToSave.studentname || '')}
          onChange={(e) => setDataToSave({ ...dataToSave, studentname: e.target.value })}
          className={`${styles.formInput} ${isAutoPopulated ? styles.autoPopulated : ''}`}
          readOnly={true}
        />

      </div>
    );
  };

  const renderField = (field: any, index: number) => {
    // For student detail fields, make them read-only if auto-populated
    const isStudentDetailField = ['email', 'degree', 'mobile'].includes(field.name.toLowerCase());
    const isAutoPopulated = selectedStudent && isStudentDetailField;

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
            <div className={`${styles.dropdownMenu} ${false ? styles.show : ''}`}>
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
      // Special handling for different field types
      const isTextarea = field.name.toLowerCase() === 'remarks' || field.type === 'textarea';
      const isDateField = field.name.toLowerCase().includes('date') || field.name.toLowerCase().includes('dt');
      
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
      } else if (isDateField) {
        return (
          <div key={index} className={`${styles.formField} ${styles.dateInputContainer}`}>
            <input
              type="datetime-local"
              name={field.name}
              required={field.required}
              placeholder={getFieldDisplayName(field.name, field.required)}
              value={dataToSave[field.name] || ''}
              onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
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
                  {student.rollnumber || student.roll_number} - {student.name}
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
        {/* Left Column - Student Details (Auto-populated) or Single column on mobile */}
        <div className={styles.leftColumn}>
          {/* Render student name explicitly */}
          {renderName()}
          
          {/* Render other left fields */}
          {leftFields.map((field, index) => renderField(field, index))}
        </div>

        {/* Right Column - Other Allotment Fields (Hidden on mobile, fields moved to left column) */}
        <div className={styles.rightColumn}>
          {rightFields.map((field, index) => renderField(field, index))}
        </div>
      </div>
      
      <div className={styles.formActions}>
        <button className={styles.submitButton} onClick={handleCreate}>
          Room Allot
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
            <div className={styles.toastBody}>Room allotted successfully!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAllotment;
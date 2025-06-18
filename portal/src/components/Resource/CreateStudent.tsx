import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
import './CreateStudent.css';
import { MdEmail } from "react-icons/md";

export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const CreateStudent = () => {
  const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<any>(false);
  const [foreignkeyData, setForeignkeyData] = useState<Record<string, any[]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [enums, setEnums] = useState<Record<string, any[]>>({});

  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = apiConfig.getResourceUrl('student');
  const metadataUrl = apiConfig.getResourceMetaDataUrl('Student');

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
          console.error('Failed to fetch metadata:', data.statusText);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchResMetaData();
  }, []);

  useEffect(() => {
    console.log('data to save', dataToSave);
  }, [dataToSave]);

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
          [enumName]: data,
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

      const response = await fetch(
        `${apiConfig.API_BASE_URL}/${foreignResource.toLowerCase()}?${params.toString()}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setForeignkeyData((prev) => ({
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

  return (
    <div className="login-container">
      <div>
        <h2 style={{marginLeft: '15px'}}>Login Form</h2>
      </div>

      <div className="container mt-4">
        {fields.map((field, index) => {
          if (field.name === 'email') {
            return (
              <div key={index} className="box1" style={{ marginBottom: '10px' }}>
                {/* <MdEmail className="icon" color='black'/> */}
                <input
                  className="email"
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  placeholder= 'Email Address'
                  value={dataToSave[field.name] || ''}
                  onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
                  style={{ padding: '5px', width: '100%', paddingLeft: "35px"}}
                />
              </div>
            );
          } else if (field.name === 'mobile') {
            return (
              <div key={index} className="box2" style={{ marginBottom: '10px' }}>
                <input
                  className="password"
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  placeholder="Password"
                  value={dataToSave[field.name] || ''}
                  onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
                  style={{ padding: '5px', width: '100%', paddingLeft: "35px" }}
                />
              </div>
            );
          }
          return null;
        })}

        <button className="btn btn-primary login-button" onClick={handleCreate} style={{paddingLeft: "140px"}}>
          Login
        </button>

        <div style={{marginTop: '18px'}}>
          <div className="forgotPassword" style={{textAlign: 'center'}}>
          <a href="#" className="forgot-password link-style" style={{
              color: '#29aafc',
              fontSize: '15px',
              fontWeight: 400,
              marginBottom: '3px',
              display: 'inline-block',
              textAlign: 'center',
            }}
          >
            Forgot Password?
          </a>
          </div>

          <div style={{ color: '#888', marginTop: '6px', fontSize: '0.7rem',textAlign: 'center'}}>
            <span>
              To Change Password,&nbsp;
              <a
                href="#"
                className="change-password link-style"
                style={{
                  color: '#29aafc',
                  textDecoration: 'underline',
                  fontWeight: 400,
                  fontSize: '0.7rem',
                }}
              >
              Click here.
              </a>
            </span>
          </div>

          
        </div>
      </div>

      {showToast && (
        <div
          className="toast-container position-fixed top-20 start-50 translate-middle p-3"
          style={{ zIndex: 1550 }}
        >
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body text-success text-center">Created successfully!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateStudent;

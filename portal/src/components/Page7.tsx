import React, { useState, useRef } from 'react';
import styles from "./page7.module.css";
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import apiConfig from '../config/apiConfig';

import CreateStudent from './Resource/CreateStudent-chandrahas';
import ReadStudent from './Resource/ReadStudent';

export default function Page7() {
  const navigate = useNavigate();
  const [expandedDropdowns, setExpandedDropdowns] = useState({
    viewResident: true,
    reports: false
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const apiUrl = apiConfig.getResourceUrl("student");

  const toggleDropdown = (dropdownName: keyof typeof expandedDropdowns) => {
    setExpandedDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const handleBulkUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<(string | number)[]>(worksheet, { header: 1 });

      const [headers, ...rows] = jsonData;

      if (
        headers[0] !== 'Roll Number' ||
        headers[1] !== 'Name' ||
        headers[2] !== 'Degree' ||
        headers[3] !== 'Email' ||
        headers[4] !== 'Mobile' ||
        headers[5] !== 'Remarks'
      ) {
        alert('Excel format incorrect. Headers must be: Roll Number, Name, Degree, Email, Mobile, Remarks');
        return;
      }

      for (const row of rows) {
        if (row.length < 5) continue;

        const dataToSave = {
          rollnumber: row[0],
          username: row[1],
          degree: row[2],
          email: row[3],
          mobile: row[4],
          remarks: row[5]
        };

        const params = new URLSearchParams();
        const jsonString = JSON.stringify(dataToSave);
        const base64Encoded = btoa(jsonString);
        params.append('resource', base64Encoded);
        const ssid: any = sessionStorage.getItem('key');
        params.append('session_id', ssid);

        await fetch(apiUrl + `?` + params.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
      }

      alert('Bulk upload completed!');
    } catch (err) {
      console.error('Error during bulk upload:', err);
      alert('An error occurred during upload. Check console for details.');
    }
  };

  return (
    <>
      <div className={styles.page7Container}>
        <button 
          className={`${styles.menuToggleBtn} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <div className={styles.hamburgerIcon}>
            <span className={`${styles.hamburgerLine} ${sidebarCollapsed ? styles.collapsed : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${sidebarCollapsed ? styles.collapsed : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${sidebarCollapsed ? styles.collapsed : ''}`}></span>
          </div>
        </button>

        <div className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
          <div className={styles.logoSection}>
            <div className={styles.logoCircle}></div>
            <div className={styles.instituteName}>
              International Institute of<br />
              Information Technology<br />
              Bangalore
            </div>
          </div>

          <div className={styles.navMenu}>
            <button className={styles.navItem}>
              <span className={styles.navIcon}>⊞</span>
              <span className={styles.navText}>Dashboard</span>
            </button>
            <button className={styles.navItem} onClick={() => navigate('/page2')}>
              <span className={styles.navIcon}>⌂</span>
              <span className={styles.navText}>Room Allotment</span>
            </button>
            <button className={styles.navItem} onClick={() => navigate('/page4')}>
              <span className={styles.navIcon}>⤋</span>
              <span className={styles.navText}>Check In</span>
            </button>
            <button className={styles.navItem} onClick={() => navigate('/page5')}>
              <span className={styles.navIcon}>⤴</span>
              <span className={styles.navText}>Check out</span>
            </button>

            <div className={styles.navSection}>
              <button 
                className={`${styles.navItem} ${styles.navDropdownHeader} ${expandedDropdowns.viewResident ? styles.expanded : ''}`}
                onClick={() => toggleDropdown('viewResident')}
              >
                <span className={styles.navIcon}>☰</span>
                <span className={styles.navText}>View Resident / Room</span>
                <span className={`${styles.dropdownArrow} ${expandedDropdowns.viewResident ? styles.expanded : ''}`}>▲</span>
              </button>
              <div className={`${styles.navSubmenu} ${expandedDropdowns.viewResident ? styles.expanded : ''}`}>
                <div className={`${styles.navSubitem} ${styles.active}`}>
                  <span className={styles.navConnector}>└</span>
                  <span className={styles.navSubtext}>Add Resident Data</span>
                </div>
                <div className={styles.navSubitem}>
                  <span className={styles.navConnector}>└</span>
                  <span className={styles.navSubtext}>Add Room Data</span>
                </div>
              </div>
            </div>

            <div className={styles.navSection}>
              <button 
                className={`${styles.navItem} ${styles.navDropdownHeader} ${expandedDropdowns.reports ? styles.expanded : ''}`}
                onClick={() => toggleDropdown('reports')}
              >
                <span className={styles.navIcon}>☰</span>
                <span className={styles.navText}>Reports</span>
                <span className={`${styles.dropdownArrow} ${expandedDropdowns.reports ? styles.expanded : ''}`}>▲</span>
              </button>
              <div className={`${styles.navSubmenu} ${expandedDropdowns.reports ? styles.expanded : ''}`}>
                <div className={styles.navSubitem}>
                  <span className={styles.navConnector}>└</span>
                  <span className={styles.navSubtext}>Present Occupancy</span>
                </div>
                <div className={styles.navSubitem}>
                  <span className={styles.navConnector}>└</span>
                  <span className={styles.navSubtext}>Vacated list</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
          <div className={styles.contentHeader}>
            <div className={styles.pageTitle}>Add Resident Data</div>
            <div className={styles.userProfile}>
              <div className={styles.profileCircle}>
                <span className={styles.profileInitial}>◉</span>
              </div>
            </div>
          </div>
          <div className={styles.contentBody}>
            <div className={styles.bulkUploadSection}>
              <button className={styles.bulkUploadBtn} onClick={handleBulkUploadClick}>Bulk Upload</button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
            </div>
            <div className={styles.createStudentSection}>
              <CreateStudent />
            </div>
            <div className={styles.searchSection}>
              <input className={styles.searchInput} placeholder="Search" />
              <button className={styles.searchBtn}>🔍</button>
              <button className={styles.refreshBtn}>⟳</button>
            </div>
            <div className={styles.readStudentSection}>
              <ReadStudent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

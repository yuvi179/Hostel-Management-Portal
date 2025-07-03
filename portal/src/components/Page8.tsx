import React, { useState, useRef } from 'react';
import styles from "./Page8.module.css";
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import apiConfig from '../config/apiConfig';

import CreateRoom from './Resource/CreateRoom';
import ReadRoom from './Resource/ReadRoom';

export default function Page8() {
  const navigate = useNavigate();
  const [expandedDropdowns, setExpandedDropdowns] = useState({
    viewResident: true,
    reports: false
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const apiUrl = apiConfig.getResourceUrl("room");

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
        headers[0] !== 'Room Number' ||
        headers[1] !== 'Floor' ||
        headers[2] !== 'Block' ||
        headers[3] !== 'Room Type'
      ) {
        alert('Excel format incorrect. Headers must be: Room Number, Floor, Block, Room Type');
        return;
      }

      for (const row of rows) {
        if (row.length < 4) continue;

        const dataToSave = {
          roomnumber: row[0],
          floor: row[1],
          block: row[2],
          roomtype: row[3]
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
      <div className={`${styles.mainContainer} ${styles.h100} ${styles.w100}`}>
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

        <div className={`${styles.sidebar} ${styles.h100} ${sidebarCollapsed ? styles.collapsed : ''}`}>
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
            <button className={styles.navItem}>
              <span className={styles.navIcon}>⌂</span>
              <span className={styles.navText}>Room Allotment</span>
            </button>
            <button className={styles.navItem}>
              <span className={styles.navIcon}>⤋</span>
              <span className={styles.navText}>Check In</span>
            </button>
            <button className={styles.navItem}>
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
                <div className={styles.navSubitem}>
                  <span className={styles.navConnector}>└</span>
                  <span className={styles.navSubtext}>Add Resident Data</span>
                </div>
                <div className={`${styles.navSubitem} ${styles.active}`}>
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

        <div className={`${styles.mainContent} ${styles.h100} ${styles.w100} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
          <div className={styles.contentHeader}>
            <div className={`${styles.fwNormal} ${styles.fs5} ${styles.mb2} ${styles.ms5} ${styles.mt4} ${styles.pageTitle}`}>Add Room Data</div>
            <div className={styles.userProfile}>
              <div className={styles.profileCircle}>
                <span className={styles.profileInitial}>◉</span>
              </div>
            </div>
          </div>
          <div className={styles.contentContainer}>
            <div className={`${styles.bulkUploadSection} ${styles.dFlex} ${styles.justifyContentEnd} ${styles.wAuto}`}>
              <button 
                className={`${styles.btn} ${styles.btnPrimary} ${styles.floatEnd} ${styles.px4} ${styles.py2} ${styles.fwSemibold} ${styles.mt3} ${styles.me3} ${styles.bulkUploadBtn}`}
                onClick={handleBulkUploadClick}
              >
                Bulk Upload
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
            </div>
            <div className={`${styles.dFlex} ${styles.flexColumn} ${styles.h50} ${styles.createRoomSection}`}>
              <CreateRoom />
            </div>
            <div className={`${styles.searchSection} ${styles.dFlex} ${styles.justifyContentEnd} ${styles.wAuto}`}>
              <input className={`${styles.formControl} ${styles.searchInput}`} placeholder="Search" />
              <button className={`${styles.btn} ${styles.btnSuccess} ${styles.searchBtn}`}>🔍︎</button>
              <button className={`${styles.btn} ${styles.btnSuccess} ${styles.refreshBtn}`}>⟳</button>
            </div>
            <div className={`${styles.dFlex} ${styles.flexColumn} ${styles.h50} ${styles.readRoomSection}`}>
              <ReadRoom />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

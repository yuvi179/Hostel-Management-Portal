import React, { useState, useEffect } from 'react';
import styles from "./Page2.module.css";
import { useNavigate } from 'react-router-dom';

import CreateStudent from './Resource/CreateStudent-chandrahas';
import ReadStudent from './Resource/ReadStudent';
import CreateAllotment from './Resource/CreateAllotment-Vignesh';
import ReadAllotment from './Resource/ReadAllotment-Vignesh';
import CreateOccupancy from './Resource/CreateOccupancy';
import ReadOccupancy from './Resource/ReadOccupancy';

export default function Page11() {
  const navigate = useNavigate();
  const [expandedDropdowns, setExpandedDropdowns] = useState({
    viewResident: false,
    reports: false
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleDropdown = (dropdownName: keyof typeof expandedDropdowns) => {
    setExpandedDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <>
      <div className={styles.pageContainer}>
        {/* Menu Toggle Button */}
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
          {/* Logo Section */}
          <div className={styles.logoSection}>
            <div className={styles.logoCircle}>
            </div>
            <div className={styles.instituteName}>
              International Institute of<br />
              Information Technology<br />
              Bangalore
            </div>
          </div>

          {/* Navigation Menu */}
          <div className={styles.navMenu}>
            <button className={styles.navItem}>
              <span className={styles.navIcon}>⊞</span>
              <span className={styles.navText}>Dashboard</span>
            </button>
            
            <button className={styles.navItem}>
              <span className={styles.navIcon}>⌂</span>
              <span className={`${styles.navSubitem} ${styles.active}`}>Room Allotment</span>
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
                <div className={`${styles.navSubitem} `}>
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
            <div className={styles.pageTitle}>Room Allotment</div>
            <div className={styles.userProfile}>
              <div className={styles.profileCircle}>
                <span className={styles.profileInitial}>◉</span>
              </div>
            </div>
          </div>
          <div className={styles.contentBody}>
            {/* <div className={styles.bulkUploadSection}>
              <button className={styles.bulkUploadBtn}>Bulk Upload</button>
            </div> */}
            <div className={styles.createStudentSection}>
              <CreateOccupancy />
            </div>
            <div className={styles.searchSection}>
              <input className={styles.searchInput} placeholder="Search" />
              <button className={styles.searchBtn}>🔍︎</button>
              <button className={styles.refreshBtn}>⟳</button>
            </div>
            <div className={styles.readStudentSection}>
              <ReadOccupancy />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
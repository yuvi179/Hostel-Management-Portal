import React, { useState, useEffect } from 'react';
import styles from "./page7.module.css";
import { useNavigate } from 'react-router-dom';

import CreateStudent from './Resource/CreateStudent-chandrahas';
import ReadStudent from './Resource/ReadStudent';

export default function Page7() {
  const navigate = useNavigate();
  const [expandedDropdowns, setExpandedDropdowns] = useState({
    viewResident: true,
    reports: false
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-collapse sidebar on mobile
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <div className={styles.page7Container}>
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

        {/* Sidebar */}
        <div className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
          {/* Logo Section */}
          <div className={styles.logoSection}>
            <div className={styles.logoCircle}>
              <span className={styles.logoText}>iiitb</span>
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
            
            <button className={styles.navItem}
            onClick={() => navigate('/page2')}>
              <span className={styles.navIcon}>⌂</span>
              <span className={styles.navText}>Room Allotment</span>
            </button>
            
            <button className={styles.navItem}
            onClick={() => navigate('/page4')}>
              <span className={styles.navIcon}>⤋</span>
              <span className={styles.navText}>Check In</span>
            </button>
            
            <button className={styles.navItem}
            onClick={() => navigate('/page5')}>
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

        {/* Main Content */}
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
              <button className={styles.bulkUploadBtn}>Bulk Upload</button>
            </div>
            <div className={styles.createStudentSection}>
              <CreateStudent></CreateStudent>
            </div>
            <div className={styles.searchSection}>
              <input className={styles.searchInput} placeholder="Search" />
              <button className={styles.searchBtn}>🔍</button>
              <button className={styles.refreshBtn}>⟳</button>
            </div>
            <div className={styles.readStudentSection}>
              <ReadStudent/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
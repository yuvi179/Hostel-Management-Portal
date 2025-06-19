import React, { useState } from 'react';
import styles from './Page4.module.css';
import { FaThLarge, FaBed, FaSignInAlt, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { MdRoomPreferences, MdOutlineReport } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const initialTableData = [
  { sn: 1, roll: '2019002', name: 'Jane Smith', degree: 'MTech', email: 'jane@iiitb.ac.in', mobile: '9876543211', booking: 'R-103', checkin: '2024-05-02 09:00', checkout: '', status: 'Checked In' },
];

export default function Page2() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("checkin");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [search, setSearch] = useState("");
  const [student, setStudent] = useState({ name: '', degree: '', email: '', mobile: '' });
  const [room, setRoom] = useState('R - 103');
  const [checkinDate, setCheckinDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [shift, setShift] = useState(true);
  const [shiftRemarks, setShiftRemarks] = useState('');
  const [tableData, setTableData] = useState(initialTableData);

  // Navigation logic for sidebar
  const handleSidebarNav = (page: string) => {
    setActiveButton(page);
    if (page === 'checkout') navigate('/page1');
    if (page === 'checkin') navigate('/page2');
    // Add other navigation as needed
  };

  // Placeholder for backend integration
  const handleSearch = () => {
    // TODO: Integrate with backend
  };

  const handleCheckIn = () => {
    // TODO: Integrate with backend
    setTableData([
      ...tableData,
      {
        sn: tableData.length + 1,
        roll: search,
        name: student.name,
        degree: student.degree,
        email: student.email,
        mobile: student.mobile,
        booking: room,
        checkin: checkinDate,
        checkout: '-',
        status: 'Checked In',
      },
    ]);
    setStudent({ name: '', degree: '', email: '', mobile: '' });
    setRoom('R - 103');
    setCheckinDate('');
    setRemarks('');
    setShift(true);
    setShiftRemarks('');
    setSearch('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles['checkin-root']}>
      {/* Sidebar */}
      <aside className={styles['checkin-sidebar']}>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-mllGBTlC3OaIhZI4E9W1ZNoKIWMn08AxGA&s" alt="iiitb_logo" className={styles['checkin-logo']} />
        <div className={styles['checkin-institute']}>International Institute of <br />Information Technology <br />Bangalore</div>
        <nav className={styles['checkin-nav']}>
          <button className={`${styles['checkin-nav-btn']}${activeButton === 'dashboard' ? ` ${styles['active']}` : ''}`} onClick={() => handleSidebarNav('dashboard')}><FaThLarge />Dashboard</button>
          <button className={`${styles['checkin-nav-btn']}${activeButton === 'room' ? ` ${styles['active']}` : ''}`} onClick={() => handleSidebarNav('room')}><FaBed />Room Allotment</button>
          <button className={`${styles['checkin-nav-btn']}${activeButton === 'checkin' ? ` ${styles['active']}` : ''}`} onClick={() => handleSidebarNav('checkin')}><FaSignInAlt />Check in</button>
          <button className={`${styles['checkin-nav-btn']}${activeButton === 'checkout' ? ` ${styles['active']}` : ''}`} onClick={() => handleSidebarNav('checkout')}><FaSignOutAlt />Check out</button>
        </nav>
        <div className={styles['checkin-nav-section']}>
          <div className={styles['checkin-nav-group']}>
            <button className={`${styles['checkin-nav-btn']} ${styles['submenu']}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}><MdRoomPreferences />View Resident / Room</button>
            {isDropdownOpen && (
              <div className={styles['checkin-dropdown']}>
                <button>Add Resident Data</button>
                <button>Add Room Data</button>
              </div>
            )}
          </div>
          <div className={styles['checkin-nav-group']}>
            <button className={`${styles['checkin-nav-btn']} ${styles['submenu']}`} onClick={() => setIsDropdownOpen2(!isDropdownOpen2)}><MdOutlineReport />Reports</button>
            {isDropdownOpen2 && (
              <div className={styles['checkin-dropdown']}>
                <button>Present Occupancy</button>
                <button>Vacated List</button>
              </div>
            )}
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className={styles['checkin-main-card']}>
        <h2 className={styles['checkin-title-main']}>Check In</h2>
        <form className={styles['checkin-form']} onSubmit={e => { e.preventDefault(); handleCheckIn(); }}>
          <div className={styles['checkin-form-row-top']}>
            <input className={`${styles['checkin-input']} ${styles['search']}`} placeholder="Roll Number / Room Number" value={search} onChange={e => setSearch(e.target.value)} />
            <button type="button" className={styles['checkin-search-btn']} onClick={handleSearch}><FaSearch /></button>
            <div className={styles['checkin-room-label']}>{room}</div>
          </div>
          <div className={styles['checkin-form-grid']}>
            <div className={styles['checkin-form-col']}>
              <input className={styles['checkin-input']} name="name" placeholder="Student Name" value={student.name} onChange={handleInputChange} />
              <input className={styles['checkin-input']} name="degree" placeholder="Degree" value={student.degree} onChange={handleInputChange} />
              <input className={styles['checkin-input']} name="email" placeholder="Email" value={student.email} onChange={handleInputChange} />
              <input className={styles['checkin-input']} name="mobile" placeholder="Mobile" value={student.mobile} onChange={handleInputChange} />
            </div>
            <div className={styles['checkin-form-col']}>
              <input className={styles['checkin-input']} type="datetime-local" placeholder="Check In Date & Time" value={checkinDate} onChange={e => setCheckinDate(e.target.value)} />
              <textarea className={styles['checkin-textarea']} placeholder="Remarks" value={remarks} onChange={e => setRemarks(e.target.value)} />
              <div className={styles['checkin-shift-row']}>
                <input type="checkbox" checked={shift} onChange={e => setShift(e.target.checked)} />
                <span className={styles['checkin-shift-label']}>Shift</span>
                <input className={`${styles['checkin-input']} ${styles['shift-remarks']}`} placeholder="Remarks" value={shiftRemarks} onChange={e => setShiftRemarks(e.target.value)} />
              </div>
              <button className={styles['checkin-btn']} type="submit">Check In</button>
            </div>
          </div>
        </form>
        <section className={styles['checkin-table-section']}>
          <div className={styles['checkin-table-scroll']}>
            <table className={styles['checkin-table']}>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Roll No.</th>
                  <th>Student Name</th>
                  <th>Degree</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Room Booking</th>
                  <th>Check In Date & Time</th>
                  <th>Check Out Date & Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.sn}</td>
                    <td>{row.roll}</td>
                    <td>{row.name}</td>
                    <td>{row.degree}</td>
                    <td>{row.email}</td>
                    <td>{row.mobile}</td>
                    <td>{row.booking}</td>
                    <td>{row.checkin}</td>
                    <td>{row.checkout}</td>
                    <td>{row.status}</td>
                    <td><button className={styles['checkin-table-action']}>Check In</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
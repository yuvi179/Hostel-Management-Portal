import React, { useState } from 'react';
import styles from "./Page5.module.css";
import { FaThLarge, FaBed, FaSignInAlt, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { MdRoomPreferences, MdOutlineReport } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const initialTableData = [
  { sn: 1, roll: '2019001', name: 'John Doe', degree: 'BTech', email: 'john@iiitb.ac.in', mobile: '9876543210', booking: 'R-102', checkin: '2024-05-01 10:00', checkout: '', status: 'Checked In' },
];

export default function Page1() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("checkout");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [search, setSearch] = useState("");
  const [student, setStudent] = useState({ name: '', degree: '', email: '', mobile: '' });
  const [room, setRoom] = useState('R - 102');
  const [checkoutDate, setCheckoutDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [shift, setShift] = useState(true);
  const [shiftRemarks, setShiftRemarks] = useState('');
  const [tableData, setTableData] = useState(initialTableData);

  // Placeholder for backend integration
  const handleSearch = () => {
    // TODO: Integrate with backend
  };

  const handleCheckOut = () => {
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
        checkin: '-',
        checkout: checkoutDate,
        status: 'Checked Out',
      },
    ]);
    setStudent({ name: '', degree: '', email: '', mobile: '' });
    setRoom('R - 102');
    setCheckoutDate('');
    setRemarks('');
    setShift(true);
    setShiftRemarks('');
    setSearch('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles['checkout-root']}>
      {/* Sidebar */}
      <aside className={styles['checkout-sidebar']}>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-mllGBTlC3OaIhZI4E9W1ZNoKIWMn08AxGA&s" alt="iiitb_logo" className={styles['checkout-logo']} />
        <div className={styles['checkout-institute']}>International Institute of <br />Information Technology <br />Bangalore</div>
        <nav className={styles['checkout-nav']}>
          <button className={`${styles['checkout-nav-btn']}${activeButton === 'dashboard' ? ` ${styles['active']}` : ''}`} onClick={() => setActiveButton('dashboard')}><FaThLarge />Dashboard</button>
          <button className={`${styles['checkout-nav-btn']}${activeButton === 'room' ? ` ${styles['active']}` : ''}`} onClick={() => setActiveButton('room')}><FaBed />Room Allotment</button>
          <button className={`${styles['checkout-nav-btn']}${activeButton === 'checkin' ? ` ${styles['active']}` : ''}`} onClick={() => setActiveButton('checkin')}><FaSignInAlt />Check in</button>
          <button className={`${styles['checkout-nav-btn']}${activeButton === 'checkout' ? ` ${styles['active']}` : ''}`} onClick={() => setActiveButton('checkout')}><FaSignOutAlt />Check out</button>
        </nav>
        <div className={styles['checkout-nav-section']}>
          <div className={styles['checkout-nav-group']}>
            <button className={`${styles['checkout-nav-btn']} ${styles['submenu']}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}><MdRoomPreferences />View Resident / Room</button>
            {isDropdownOpen && (
              <div className={styles['checkout-dropdown']}>
                <button>Add Resident Data</button>
                <button>Add Room Data</button>
              </div>
            )}
          </div>
          <div className={styles['checkout-nav-group']}>
            <button className={`${styles['checkout-nav-btn']} ${styles['submenu']}`} onClick={() => setIsDropdownOpen2(!isDropdownOpen2)}><MdOutlineReport />Reports</button>
            {isDropdownOpen2 && (
              <div className={styles['checkout-dropdown']}>
                <button>Present Occupancy</button>
                <button>Vacated List</button>
              </div>
            )}
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className={styles['checkout-main-card']}>
        <h2 className={styles['checkout-title-main']}>Check Out</h2>
        <form className={styles['checkout-form']} onSubmit={e => { e.preventDefault(); handleCheckOut(); }}>
          <div className={styles['checkout-form-row-top']}>
            <input className={`${styles['checkout-input']} ${styles['search']}`} placeholder="Roll Number / Room Number" value={search} onChange={e => setSearch(e.target.value)} />
            <button type="button" className={styles['checkout-search-btn']} onClick={handleSearch}><FaSearch /></button>
            <div className={styles['checkout-room-label']}>{room}</div>
          </div>
          <div className={styles['checkout-form-grid']}>
            <div className={styles['checkout-form-col']}>
              <input className={styles['checkout-input']} name="name" placeholder="Student Name" value={student.name} onChange={handleInputChange} />
              <input className={styles['checkout-input']} name="degree" placeholder="Degree" value={student.degree} onChange={handleInputChange} />
              <input className={styles['checkout-input']} name="email" placeholder="Email" value={student.email} onChange={handleInputChange} />
              <input className={styles['checkout-input']} name="mobile" placeholder="Mobile" value={student.mobile} onChange={handleInputChange} />
            </div>
            <div className={styles['checkout-form-col']}>
              <input className={styles['checkout-input']} type="datetime-local" placeholder="Check Out Date & Time" value={checkoutDate} onChange={e => setCheckoutDate(e.target.value)} />
              <textarea className={styles['checkout-textarea']} placeholder="Remarks" value={remarks} onChange={e => setRemarks(e.target.value)} />
              <div className={styles['checkout-shift-row']}>
                <input type="checkbox" checked={shift} onChange={e => setShift(e.target.checked)} />
                <span className={styles['checkout-shift-label']}>Shift</span>
                <input className={`${styles['checkout-input']} ${styles['shift-remarks']}`} placeholder="Remarks" value={shiftRemarks} onChange={e => setShiftRemarks(e.target.value)} />
              </div>
              <button className={styles['checkout-btn']} type="submit">Check Out</button>
            </div>
          </div>
        </form>
        <section className={styles['checkout-table-section']}>
          <div className={styles['checkout-table-scroll']}>
            <table className={styles['checkout-table']}>
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
                    <td><button className={styles['checkout-table-action']}>Check Out</button></td>
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
import React, { useState } from 'react';
import styles from "./Page6.module.css";

export default function Page3() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Student 1 form state
  const [student1, setStudent1] = useState({
    studentName: '',
    degree: '',
    email: '',
    mobile: '',
    roomNumber: 'R - 102',
    checkOutDate: '',
    remarks: '',
    shift: false,
    shiftRemarks: ''
  });

  // Student 2 form state
  const [student2, setStudent2] = useState({
    studentName: '',
    degree: '',
    email: '',
    mobile: '',
    roomNumber: 'R - 102',
    checkOutDate: '',
    remarks: '',
    shift: false,
    shiftRemarks: ''
  });

  const handleStudent1Change = (field: string, value: string | boolean) => {
    setStudent1(prev => ({ ...prev, [field]: value }));
  };

  const handleStudent2Change = (field: string, value: string | boolean) => {
    setStudent2(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckOut = (studentNumber: number) => {
    console.log(`Check Out clicked for Student ${studentNumber}`);
  };

  return (
    <div className={styles['checkout-container']}>
      <div className={styles['checkout-header']}>
        <h1>Check Out</h1>
        <div className={styles['profile-icon']}>
          <div className={styles['profile-circle']}></div>
        </div>
      </div>

      <div className={styles['checkout-content']}>
        <div className={styles['search-section']}>
          <div className={styles['search-bar']}>
            <input
              type="text"
              placeholder="Room Number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles['search-input']}
            />
            <button className={styles['search-button']}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className={styles['student-cards-container']}>
          {/* Student 1 Card */}
          <div className={styles['student-card']}>
            <div className={styles['student-header']}>STUDENT 1</div>
            <div className={styles['student-form']}>
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <input
                    type="text"
                    placeholder="Student Name"
                    value={student1.studentName}
                    onChange={(e) => handleStudent1Change('studentName', e.target.value)}
                    className={styles['form-input']}
                  />
                </div>
                <div className={styles['room-display']}>
                  <input
                    type="text"
                    value={student1.roomNumber}
                    onChange={(e) => handleStudent1Change('roomNumber', e.target.value)}
                    className={styles['room-input']}
                  />
                </div>
              </div>

              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <input
                    type="text"
                    placeholder="Degree"
                    value={student1.degree}
                    onChange={(e) => handleStudent1Change('degree', e.target.value)}
                    className={styles['form-input']}
                  />
                </div>
                <div className={styles['form-group']}>
                  <input
                    type="text"
                    placeholder="Check Out Date & Time"
                    value={student1.checkOutDate}
                    onChange={(e) => handleStudent1Change('checkOutDate', e.target.value)}
                    className={styles['form-input']}
                  />
                  <button className={styles['calendar-btn']}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#666" strokeWidth="2"/>
                      <line x1="16" y1="2" x2="16" y2="6" stroke="#666" strokeWidth="2"/>
                      <line x1="8" y1="2" x2="8" y2="6" stroke="#666" strokeWidth="2"/>
                      <line x1="3" y1="10" x2="21" y2="10" stroke="#666" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={student1.email}
                    onChange={(e) => handleStudent1Change('email', e.target.value)}
                    className={styles['form-input']}
                  />
                </div>
                <div className={styles['form-group']}>
                  <textarea
                    placeholder="Remarks"
                    value={student1.remarks}
                    onChange={(e) => handleStudent1Change('remarks', e.target.value)}
                    className={styles['form-textarea']}
                    rows={3}
                  />
                </div>
              </div>

              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <input
                    type="tel"
                    placeholder="Mobile"
                    value={student1.mobile}
                    onChange={(e) => handleStudent1Change('mobile', e.target.value)}
                    className={styles['form-input']}
                  />
                </div>
                <div className={styles['shift-section']}>
                  <div className={styles['shift-checkbox']}>
                    <input
                      type="checkbox"
                      id="shift1"
                      checked={student1.shift}
                      onChange={(e) => handleStudent1Change('shift', e.target.checked)}
                    />
                    <label htmlFor="shift1">Shift</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Remarks"
                    value={student1.shiftRemarks}
                    onChange={(e) => handleStudent1Change('shiftRemarks', e.target.value)}
                    className={styles['shift-remarks-input']}
                  />
                </div>
              </div>

              <div className={styles['checkin-section']}>
                <button className={styles['checkin-btn']} onClick={() => handleCheckOut(1)}>
                  Check Out
                </button>
              </div>
            </div>
          </div>

          {/* Student 2 Card */}
          <div className={styles['student-card']}>
            <div className={styles['student-header']}>STUDENT 2</div>
            <div className={styles['student-form']}>
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <input
                    type="text"
                    placeholder="Student Name"
                    value={student2.studentName}
                    onChange={(e) => handleStudent2Change('studentName', e.target.value)}
                    className={styles['form-input']}
                  />
                </div>
                <div className={styles['room-display']}>
                  <input
                    type="text"
                    value={student2.roomNumber}
                    onChange={(e) => handleStudent2Change('roomNumber', e.target.value)}
                    className={styles['room-input']}
                  />
                </div>
              </div>

              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <input
                    type="text"
                    placeholder="Degree"
                    value={student2.degree}
                    onChange={(e) => handleStudent2Change('degree', e.target.value)}
                    className={styles['form-input']}
                  />
                </div>
                <div className={styles['form-group']}>
                  <input
                    type="text"
                    placeholder="Check Out Date & Time"
                    value={student2.checkOutDate}
                    onChange={(e) => handleStudent2Change('checkOutDate', e.target.value)}
                    className={styles['form-input']}
                  />
                  <button className={styles['calendar-btn']}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#666" strokeWidth="2"/>
                      <line x1="16" y1="2" x2="16" y2="6" stroke="#666" strokeWidth="2"/>
                      <line x1="8" y1="2" x2="8" y2="6" stroke="#666" strokeWidth="2"/>
                      <line x1="3" y1="10" x2="21" y2="10" stroke="#666" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={student2.email}
                    onChange={(e) => handleStudent2Change('email', e.target.value)}
                    className={styles['form-input']}
                  />
                </div>
                <div className={styles['form-group']}>
                  <textarea
                    placeholder="Remarks"
                    value={student2.remarks}
                    onChange={(e) => handleStudent2Change('remarks', e.target.value)}
                    className={styles['form-textarea']}
                    rows={3}
                  />
                </div>
              </div>

              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <input
                    type="tel"
                    placeholder="Mobile"
                    value={student2.mobile}
                    onChange={(e) => handleStudent2Change('mobile', e.target.value)}
                    className={styles['form-input']}
                  />
                </div>
                <div className={styles['shift-section']}>
                  <div className={styles['shift-checkbox']}>
                    <input
                      type="checkbox"
                      id="shift2"
                      checked={student2.shift}
                      onChange={(e) => handleStudent2Change('shift', e.target.checked)}
                    />
                    <label htmlFor="shift2">Shift</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Remarks"
                    value={student2.shiftRemarks}
                    onChange={(e) => handleStudent2Change('shiftRemarks', e.target.value)}
                    className={styles['shift-remarks-input']}
                  />
                </div>
              </div>

              <div className={styles['checkin-section']}>
                <button className={styles['checkin-btn']} onClick={() => handleCheckOut(2)}>
                  Check Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
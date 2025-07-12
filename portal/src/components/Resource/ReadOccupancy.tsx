import React, { useEffect, useState } from 'react';
import apiConfig from '../../config/apiConfig';
import styles from './ReadOccupancy.module.css';

const ReadOccupancy = () => {
  const [occupancyData, setOccupancyData] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);
  const studentApiUrl = `${apiConfig.getResourceUrl('student')}?`
  const roomApiUrl = `${apiConfig.getResourceUrl('room')}?`

  const fetchStudentById = async (studentId: string) => {
/*   if (studentsCache.has(studentId)) {
    return studentsCache.get(studentId);
  } */

  try {
    
    const params = new URLSearchParams();
    const ssid: any = sessionStorage.getItem('key');
    params.append('queryId', 'GET_STUDENT_BY_ID');
    params.append('session_id', ssid);
    params.append('args', `id:${studentId}`);
    

    // const requestBody = {
    //   'id': studentId
    // };
    const response = await fetch(
      studentApiUrl + params.toString(),
      
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'id' : JSON.stringify(requestBody)
        },
        
      }
    );
    
    if (!response.ok) {
      throw new Error('Error fetching student: ' + response.status);
    }

    const data = await response.json();
    console.log(data);
    const student = data.resource && data.resource.length > 0 ? data.resource[0] : null;
    
    return student;
  } catch (error) {
    console.error('Error fetching student:', error);
    return null;
  }
};
  
const fetchRoomById = async (roomId: string) => {
  try {
    
    const params = new URLSearchParams();
    const ssid: any = sessionStorage.getItem('key');
    params.append('queryId', 'GET_ROOM_BY_ID');
    params.append('session_id', ssid);
    params.append('args', `id:${roomId}`);
    const response = await fetch(
      roomApiUrl + params.toString(),
      
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        
      }
    );
    
    if (!response.ok) {
      throw new Error('Error fetching student: ' + response.status);
    }

    const data = await response.json();
    console.log(data);
    const room = data.resource && data.resource.length > 0 ? data.resource[0] : null;

    
    return room;
  } catch (error) {
    console.error('Error fetching room:', error);
    return null;
  }
};

    const fetchRoomByRoomNo = async (roomNo: string) => {
    try {
      
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem('key');
      params.append('queryId', 'GET_ROOM_BY_ROOM_NUMBER');
      params.append('session_id', ssid);
      params.append('args', `roomnumber:${roomNo}`);
      const response = await fetch(
        roomApiUrl + params.toString(),
        
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          
        }
      );
      
      if (!response.ok) {
        throw new Error('Error fetching room: ' + response.status);
      }

      const data = await response.json();
      console.log(data);
      const room = data.resource && data.resource.length > 0 ? data.resource[0] : null;
      
      /* if (room) {
        setStudentsCache(prev => new Map(prev).set(roomId, room));
      } */
      
      return room;
    } catch (error) {
      console.error('Error fetching room:', error);
      return null;
    }
  };

  const fetchStudentByRollNo = async (rollNo: string) => {
    try {
      
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem('key');
      params.append('queryId', 'GET_STUDENT_BY_ROLL_NUMBER');
      params.append('session_id', ssid);
      params.append('args', `rollnumber:${rollNo}`);
      const response = await fetch(
        studentApiUrl + params.toString(),
        
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          
        }
      );
      
      if (!response.ok) {
        throw new Error('Error fetching student: ' + response.status);
      }

      const data = await response.json();
      console.log(data);
      const student = data.resource && data.resource.length > 0 ? data.resource[0] : null;
      
      /* if (room) {
        setStudentsCache(prev => new Map(prev).set(roomId, room));
      } */
      
      return student;
    } catch (error) {
      console.error('Error fetching room:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem('key');
      params.append('queryId', 'GET_ALL');
      params.append('session_id', ssid);

      try {
        // Fetch Allotments
        const allotmentRes = await fetch(`${apiConfig.getResourceUrl('allotment')}?${params.toString()}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const allotmentData = (await allotmentRes.json()).resource || [];

        // Combine Data
        const combinedData = await Promise.all(
        allotmentData
        .filter((allot: any) => !allot.checkoutdnt || allot.checkoutdnt === '')
        .map(async (allot: any) => {
          const student = await fetchStudentById(allot.rollnumber);
          const room = await fetchRoomById(allot.roomnumber);

          return {
            floor: room.floor || '-',
            block: room.block || '-',
            roomtype: room.roomtype || '-',
            roomnumber: room.roomnumber || '-',
            rollnumber: student.rollnumber || '-',
            studentname: student.username || '-',
            degree: student.degree || '-',
            email: student.email || '-',
            mobile: student.mobile || '-',
            checkindnt: allot.checkindnt || '-',
            remarks: allot.remarks || '-'
          };
        })
      );

        setOccupancyData(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className={styles.readOccupancyContainer}>
      <div className={styles.dataGridContainer}>
        {occupancyData.length === 0 ? (
          <div className={styles.noDataMessage}>
            <div className={styles.noDataIcon}>📊</div>
            <h3>No Data Available</h3>
            <p>Occupancy details will appear here once data is loaded.</p>
          </div>
        ) : (
          <div className={styles.customTableContainer}>
            <table className={styles.customTable}>
              <thead>
                <tr>
                  <th className={styles.snoHeader}>S.No.</th>
                  <th>Floor</th>
                  <th>Block</th>
                  <th>Room Type</th>
                  <th>Room Number</th>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Degree</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Checkin Dnt</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {occupancyData.map((item, index) => (
                  <tr key={index}>
                    <td className={styles.snoCell}>{index + 1}</td>
                    <td>{item.floor}</td>
                    <td>{item.block}</td>
                    <td>{item.roomtype}</td>
                    <td>{item.roomnumber}</td>
                    <td>{item.rollnumber}</td>
                    <td>{item.studentname}</td>
                    <td>{item.degree}</td>
                    <td>{item.email}</td>
                    <td>{item.mobile}</td>
                    <td>{item.checkindnt}</td>
                    <td>{item.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showToast && (
        <div className={styles.toastOverlay}>
          <div className={`${styles.customToast} ${styles.successToast}`}>
            <div className={styles.toastHeader}>
              <span>Success</span>
              <button
                className={styles.toastClose}
                onClick={() => setShowToast(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.toastBody}>
              Loaded successfully!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadOccupancy;

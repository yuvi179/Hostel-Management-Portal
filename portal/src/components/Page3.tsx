        import React, { useState, useEffect } from 'react';
        import "./Page3.css";
        import { useNavigate } from 'react-router-dom';
        import { FaThLarge, FaBed, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
        import { MdRoomPreferences, MdOutlineReport } from "react-icons/md";
        import { MdOutlineReportProblem } from 'react-icons/md';
        import { RiUserAddLine } from "react-icons/ri";
        import { FaSearch, FaSyncAlt } from 'react-icons/fa';
import RoomGrid from './Roomgrid';

        
        export default function Page3() {
        const navigate = useNavigate();
        const [activeButton, setActiveButton] = useState("dashboard");
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);
        const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);


          return (
            <>
            <div className="d-flex">
              <div className="wave-background">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#6EC2F0" fill-opacity="1" d="M0,256L48,250.7C96,245,192,235,288,218.7C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,245.3C1248,277,1344,299,1392,309.3L1440,320L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
              </div>

              <div id="id-53" className="my-gradient sidebar-container">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-mllGBTlC3OaIhZI4E9W1ZNoKIWMn08AxGA&s" alt="iiitb_logo" className="d-flex flex-column image iiitb-logo" style={{width: "50px", border: "2px solid black", borderRadius: "100px 100px 100px 100px"}} id="id-55"/>

                <div className="institute-name" id="id-57">
                  International Institute of <br />
                  Information Technology <br />
                  Bangalore
                </div>

                <button className="btn `btn ${activeButton === 'dashboard' ? 'active' : ''}`" id="id-59" onClick={() => setActiveButton("dashboard")}><FaThLarge style={{ marginRight: '16px' }} />Dashboard</button>
                <button className="btn `btn ${activeButton === 'room' ? 'active' : ''}`" id="id-5B" onClick={() => setActiveButton("room")}><FaBed style={{ marginRight: '16px' }} />Room Allotment</button>
                <button className="btn `btn ${activeButton === 'checkin' ? 'active' : ''}`" id="id-5D" onClick={() => setActiveButton("checkin")}><FaSignInAlt style={{ marginRight: '16px' }} />Check in</button>
                <button className="btn `btn ${activeButton === 'checkout' ? 'active' : ''}`" id="id-5F" onClick={() => setActiveButton("checkout")}><FaSignOutAlt style={{ marginRight: '16px' }} />Check out</button>

              <div className="sidebar">
                <ul className="menu">
                  <li>
                    <span className="menu-header btn `btn ${activeButton === 'checkout' ? 'active' : ''}`"  onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ cursor: 'pointer' }}>
                      <MdRoomPreferences style={{ marginRight: '16px', marginLeft: '5px'}} />View Resident / Room 
                    </span>
                    
                    {isDropdownOpen && (
                      <ul className="submenu">
                        <li><a href="#" style={{marginLeft: '45px'}}>Add Resident Data</a></li>
                        <li><a href="#" style={{marginLeft: '45px'}}>Add Room Data</a></li>
                      </ul>
                    )}
                  </li>

                  <li>
                    <span className="menu-header btn `btn ${activeButton === 'checkout' ? 'active' : ''}`" onClick={() => setIsDropdownOpen2(!isDropdownOpen2)} style={{
                      marginTop: '6px', 
                      marginBottom: '6px', 
                      paddingRight: '5px', 
                      paddingTop: '5px', 
                      paddingBottom: '5px', 
                      paddingLeft: '20px'
                    }}>
                      <MdOutlineReport style={{ marginRight: '16px', marginLeft: '5px'}} />Reports
                    </span>

                    {isDropdownOpen2 && (
                      <ul className="submenu">
                        <li><a href="#" style={{marginLeft: '45px'}}>Present Occupancy</a></li>
                        <li><a href="#" style={{marginLeft: '45px'}}>Vacated List</a></li>
                    </ul>
                    )}
                    
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Side Content */}
            <div className="rightside">
              <div id="id-5N" className="d-flex">
                <div className="" id="id-5P">Room Allotment</div>
                <div className="icon-container"><MdOutlineReportProblem className="icon" /></div>
              </div>

              <div className="bar">
                <div id="id-5R" className="h-100">
                  <div className="" id="id-5T" style={{fontSize: "15px"}}>Select Room</div>



                  <div id="" className="d-flex">
                    <div id="first" style={{height: '32px'}}>
                    <div id="id-5X">Block</div>
                    
                    <div className="dropdown">
                      <button className="btn2 btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="id-5Z" style={{height: '26px', marginTop: '3px', marginBottom: '3px'}}>All</button>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#" id="0">Home</a></li>
                      </ul>
                    </div>

                    <div id="id-61">Floor</div>
                    <div className="dropdown">
                      <button className="btn2 btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="id-63" style={{height: '26px', marginTop: '3px', marginBottom: '3px'}}>All</button>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#" id="0">Home</a></li>
                      </ul>
                    </div>

                    <div id="id-65">Room Types</div>
                    <div className="dropdown">
                      <button className="btn2 btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="id-67" style={{height: '26px', marginTop: '3px', marginBottom: '3px'}}>All</button>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#" id="0">Home</a></li>
                      </ul>
                    </div>
                    </div>


                    <input className="form-control" placeholder="Room No." id="id-69" style={{marginLeft: '185px', height: '32px'}}/>
                    <button className="search-btn" style={{height: '32px'}}><FaSearch /></button>
                    <button className="refresh-btn" style={{height: '32px'}}><FaSyncAlt /></button>
                  </div>

                  <div className="outergrid">
                    <div className="grid d-flex">
                      <RoomGrid />
                      <RoomGrid />
                    </div>
                    {/* <div className="grid d-flex">
                      <RoomGrid />
                      <RoomGrid />
                    </div> */}
                  </div>

                  <div className="submit-container">
                    <button className="submit-btn">Submit</button>
                  </div>
                </div>
              </div>
              
            </div>




          </div>
          </>
          );
        }

// import React, { useState, useEffect } from 'react';
// import "./Page4.css";
// import { useNavigate } from 'react-router-dom';
// import { FaThLarge, FaBed, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
// import { MdRoomPreferences, MdOutlineReport, MdOutlineReportProblem } from "react-icons/md";
// import { RiUserAddLine } from "react-icons/ri";

// // Step 1: Properly typed roomsData
// type RoomData = {
//   floorLabel: string;
//   occupied: string[];
//   selected: string[];
// };

// type RoomsData = Record<string, RoomData>;

// const roomsData: RoomsData = {
//   '01': {
//     floorLabel: 'Floor No. 01',
//     occupied: ['104', '105', '106', '107', '108', '109', '110'],
//     selected: ['101'],
//   },
//   '07': {
//     floorLabel: 'Floor No. 07',
//     occupied: ['104', '105', '106', '107', '108', '109', '110'],
//     selected: [],
//   },
// };


// type FloorKey = keyof typeof roomsData; // '01' | '07'
// type RoomNumber = `${number}`; // e.g. '101', '102'

// export default function Page4() {
//   const navigate = useNavigate();
//   const [activeButton, setActiveButton] = useState("dashboard");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);

//   const renderRooms = (floor: keyof RoomsData) => {
//   const allRooms = Array.from({ length: 10 }, (_, i) => (101 + i).toString());

//   return allRooms.map((room) => {
//     const isSelected = roomsData[floor].selected.includes(room);
//     const isOccupied = roomsData[floor].occupied.includes(room);
//     const status = isSelected ? 'selected' : isOccupied ? 'occupied' : 'available';

//     return (
//       <div key={room} className={`room ${status}`}>
//         {room}
//       </div>
//     );
//   });
// };


//   return (
//     <>
//       <div className="d-flex">
//         {/* Left Sidebar */}
//         <div className="wave-background">
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
//             <path fill="#6EC2F0" fillOpacity="1" d="M0,256L48,250.7C96,245,192,235,288,218.7C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,245.3C1248,277,1344,299,1392,309.3L1440,320L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
//           </svg>
//         </div>

//         <div id="id-53" className="my-gradient sidebar-container">
//           <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-mllGBTlC3OaIhZI4E9W1ZNoKIWMn08AxGA&s" alt="iiitb_logo" className="iiitb-logo" style={{ width: "50px", border: "2px solid black", borderRadius: "100px" }} />
//           <div className="institute-name">
//             International Institute of <br />
//             Information Technology <br />
//             Bangalore
//           </div>

//           {/* Buttons */}
//           <button className={`btn ${activeButton === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveButton("dashboard")}><FaThLarge style={{ marginRight: '16px' }} />Dashboard</button>
//           <button className={`btn ${activeButton === 'room' ? 'active' : ''}`} onClick={() => setActiveButton("room")}><FaBed style={{ marginRight: '16px' }} />Room Allotment</button>
//           <button className={`btn ${activeButton === 'checkin' ? 'active' : ''}`} onClick={() => setActiveButton("checkin")}><FaSignInAlt style={{ marginRight: '16px' }} />Check in</button>
//           <button className={`btn ${activeButton === 'checkout' ? 'active' : ''}`} onClick={() => setActiveButton("checkout")}><FaSignOutAlt style={{ marginRight: '16px' }} />Check out</button>

//           {/* Dropdown */}
//           <div className="sidebar">
//             <ul className="menu">
//               <li>
//                 <span className={`menu-header btn ${activeButton === 'checkout' ? 'active' : ''}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ cursor: 'pointer' }}>
//                   <MdRoomPreferences style={{ marginRight: '16px', marginLeft: '5px' }} />View Resident / Room
//                 </span>
//                 {isDropdownOpen && (
//                   <ul className="submenu">
//                     <li><a href="#" style={{ marginLeft: '45px' }}>Add Resident Data</a></li>
//                     <li><a href="#" style={{ marginLeft: '45px' }}>Add Room Data</a></li>
//                   </ul>
//                 )}
//               </li>

//               <li>
//                 <span className={`menu-header btn ${activeButton === 'checkout' ? 'active' : ''}`} onClick={() => setIsDropdownOpen2(!isDropdownOpen2)} style={{
//                   marginTop: '6px',
//                   marginBottom: '6px',
//                   paddingRight: '5px',
//                   paddingTop: '5px',
//                   paddingBottom: '5px',
//                   paddingLeft: '20px'
//                 }}>
//                   <MdOutlineReport style={{ marginRight: '16px', marginLeft: '5px' }} />Reports
//                 </span>
//                 {isDropdownOpen2 && (
//                   <ul className="submenu">
//                     <li><a href="#" style={{ marginLeft: '45px' }}>Present Occupancy</a></li>
//                     <li><a href="#" style={{ marginLeft: '45px' }}>Vacated List</a></li>
//                   </ul>
//                 )}
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="rightside">
//           <div id="id-5N" className="d-flex">
//             <div id="id-5P">Room Allotment</div>
//             <div className="icon-container"><MdOutlineReportProblem className="icon" /></div>
//           </div>

//           <div className="bar">
//             <div id="id-5R">
//               <div id="id-5T">Select Room</div>
//               <div id="id-5V" className="d-flex">
//                 <div id="id-5X">Block</div>
//                 <div className="dropdown">
//                   <button className="btn2 dropdown-toggle">All</button>
//                 </div>

//                 <div id="id-61">Floor</div>
//                 <div className="dropdown">
//                   <button className="btn2 dropdown-toggle">All</button>
//                 </div>

//                 <div id="id-65">Room Types</div>
//                 <div className="dropdown">
//                   <button className="btn2 dropdown-toggle">All</button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Rooms Table */}
//           <div className="room-table-container">
//             {(Object.keys(roomsData) as (keyof RoomsData)[]).map((floor) => (
//   <div key={floor}>
//     <h3>{roomsData[floor].floorLabel}</h3>
//     <div className="room-grid">{renderRooms(floor)}</div>
//   </div>
// ))}

//             <button className="submit-btn">Submit</button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

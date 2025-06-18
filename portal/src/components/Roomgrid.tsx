import React, { useState } from 'react';
import './Roomgrid.css'; // Make sure this path is correct

type RoomStatus = {
    selected: string[];
    occupied: string[];
};

const roomsData: { [key: string]: RoomStatus } = {"01": {selected: ["101"], occupied: ["104", "108", "109", "110"]}};

const allRooms = ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110"];

const RoomGrid: React.FC = () => {
    const [selectedFloor, setSelectedFloor] = useState("01");
    const [selectedRooms, setSelectedRooms] = useState<string[]>(roomsData[selectedFloor].selected);

    const handleRoomClick = (room: string) => {
        const updated = selectedRooms.includes(room) ? selectedRooms.filter((r) => r !== room): [...selectedRooms, room];
        setSelectedRooms(updated);
    };

    const renderRooms = () => {
        const rows = 6;
        const cols = 10;
        const layout: JSX.Element[] = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const index = j;
                const room = allRooms[index];
                const status = selectedRooms.includes(room) ? 'selected' : roomsData[selectedFloor].occupied.includes(room) ? 'occupied': 'available';

            layout.push(
                <button key={`${i}-${j}`} className={`room-button ${status}`} onClick={() => handleRoomClick(room)}>{room}</button>
            );
            }
        }
        return layout;
    };

    return (
        <div className="room-container">
            <div className="floor-box">
                <div className="floor-header">
                    <div className="label-box">🏢 B1</div>
                    <div className="label-box">Floor No. {selectedFloor}</div>
                    <div className="room-type">🛏 3 Bedded Bunker</div>
                </div>

                <div className="room-grid">
                    {renderRooms()}
                </div>

                {/* <button className="submit-btn">Submit</button> */}
            </div>
        </div>
    );
};

export default RoomGrid;

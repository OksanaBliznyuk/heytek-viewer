import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8099/equipment');
        setEquipment(response.data.equipment);
      } catch (error) {
        console.error('Error fetching equipment data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures useEffect runs once when component mounts

  return (
    <div>
      <h1>Equipment List</h1>
      <ul>
        {equipment.map((item) => (
          <li key={item.equipment_id}>
            <strong>Name:</strong> {item.name}, <strong>Registered:</strong> {item.registered}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EquipmentList;

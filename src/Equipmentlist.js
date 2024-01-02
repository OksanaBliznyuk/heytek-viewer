//EquipmentList.js
import React, { useState, useEffect } from 'react';
import "./App.css";
import axios from 'axios';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';


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

  const handleButtonClick = (item) => {
    // Add your logic here for handling the button click event
    alert('Button clicked for: ' + item.name);
  };

  return (
    <div>
      <h4>Equipment List</h4>
      <TableContainer component={Paper} style={{ maxHeight: '550px', overflowY: 'auto' }}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><h3>Utstyr</h3></TableCell>
              <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><h3>Antall</h3></TableCell>
              <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><h3>Tilgjengelig</h3></TableCell>
              <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><h3>Status</h3></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipment.map((item) => (
              <TableRow key={item.equipment_id}>
                     <TableCell>
                     <Button className="info-icon" onClick={handleButtonClick}>
                      <InfoOutlinedIcon />
                    </Button>

                  {item.name}
                  </TableCell>
                <TableCell>{item.registered}</TableCell>
                <TableCell>{item.available}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EquipmentList;

/*import React, { useState, useEffect } from 'react';
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
            <strong>Utstyr:</strong> {item.name}, <strong>Antall:</strong> {item.registered}, <strong>Tilgjengelig:</strong> {item.available}, <strong>Status:</strong> {item.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EquipmentList;*/

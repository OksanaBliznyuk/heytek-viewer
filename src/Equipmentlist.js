//EquipmentList.js
import React, { useState, useEffect } from 'react';
import "./App.css";
import microbit from "./assets/images/microbit..png";
import axios from 'axios';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Link, Modal, Box,Typography } from '@mui/material';

//Info vindu style:
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 300,
  bgcolor: "background.paper",
  border: "2px #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};



//Bilde vindu childModal:
function ChildModal({selectedItem}) {
  const [open, setOpen] = useState(false);
  
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>Åpen bilde</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 400, height: 300 }}>
        {selectedItem && (

<>  <img src={`/assets/images/${selectedItem.equipment_id}.png`} alt="Bildebeskrivelse" className="modal-img" />
          <Button onClick={handleClose}>Lukk bilde</Button>
          </>
        )}
        </Box>
      </Modal>
    </React.Fragment>
  );
}


const EquipmentList = ({item}) => {
  const [equipment, setEquipment] = useState([]);

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8099/equipment_full');
        setEquipment(response.data.equipment);
      } catch (error) {
        console.error('Error fetching equipment data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures useEffect runs once when component mounts

  const handleButtonClick = (item) => {
    // Add your logic here for handling the button click event
    // alert('Button clicked for: ' + item.name);
    handleOpen(item)
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
                     {/* <Button className="info-icon" onClick={() => handleButtonClick(item)}> */}
                     <Button className="info-icon" onClick={() => handleButtonClick(item)}>
                      <InfoOutlinedIcon />
                    </Button>

                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="equipment-modal-title"
                      aria-describedby="equipment-modal-description"              
                    >
                      <Box sx={{ ...style, width: 400 }}>
                     {selectedItem && (

<>
                      <h2 id="equipment-modal-title">{selectedItem.name}</h2>
                      <p id="equipment-modal-description">
                        {selectedItem.description}
                        <Link
              href={`https://www.google.no/search?q=${encodeURIComponent(selectedItem.name)}`} 
             underline="always"
            >
              {"Trykk her til å finne mer"}
            </Link>
                        </p>
                        <ChildModal selectedItem={selectedItem}/>
                        <Button onClick={handleClose}>Lukk vindu</Button>
                        </>
                      )}
                      </Box>
                    </Modal>

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

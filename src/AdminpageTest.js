//AdminPageTEST
import React, { useState, useEffect } from "react";
import "./AdminPage.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Box,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ClearIcon from "@mui/icons-material/Clear";

const AdminPage = ({}) => {
  const [equipment, setEquipment] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openModalMap, setOpenModalMap] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpenModalMap((prev) => ({ ...prev, [item.equipment_id]: true }));
  };

  const handleClose = () => {
    setSelectedItem(null);
    setOpenModalMap((prev) => ({
      ...prev,
      [selectedItem.equipment_id]: false,
    }));
  };

  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        const response = await axios.get("http://localhost:8099/equipment");
        setEquipment(response.data.equipment);
      } catch (error) {
        console.error("Error fetching equipment data:", error);
      }
    };

    fetchEquipmentData();
  }, []);
  const handleButtonClick = (item) => {
    handleOpen(item);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditedData({
      equipment_name: item.equipment_name,
      // Legg til andre felt etter behov
    });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditedData({});
  };

  const handleSaveClick = (item) => {
    // Gjør nødvendige operasjoner for å lagre endringene, for eksempel en API-forespørsel
    // Deretter avslutt redigeringsmodus ved å tilbakestille editingItem-tilstanden
    setEditingItem(null);
    setEditedData({});
    // Gjør eventuelle andre nødvendige ting, for eksempel oppdatering av dataene på serveren eller lokal tilstand
    console.log("Endringer lagret for rad:", item);
  };

  const handleInactivateClick = (item) => {
    const isConfirmed = window.confirm(
      "Er du sikker på at du vil inaktivere dette utstyret?"
    );
    if (isConfirmed) {
      // Legg til logikk for å inaktivere raden her!!!
      console.log("Inaktiver rad:", item);
    }
  };

  const handleEditFieldChange = (e, field) => {
    setEditedData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAddItemClick = () => {
    setIsAddingItem(true);
    setEditingItem({
      equipment_name: "", // Sett standardverdier eller la være tom
      equipment_quantity: 0,
      // ... andre felt for det nye utstyret
    });
  };

  const handleSaveNewItem = () => {
    // Gjør nødvendige operasjoner for å lagre det nye utstyret
    // For eksempel, send en API-forespørsel for å lagre dataene på serveren
    // Oppdater deretter utstyrslisten og avslutt redigeringsmodus
    setEquipment((prevEquipment) => [...prevEquipment, editingItem]);
    setEditingItem(null);
    setEditedData({});
    setIsAddingItem(false);
  };

  return (
    <>
      <div className="admin-container" style={{ overflow: "auto" }}>
        <div className="admin-header">
          <h4>AdminsideTEST</h4>
          {/*+Legg til btn */}
          <Button
            className="add-btn"
            color="secondary"
            variant="outlined"
            size="small"
            onClick={handleAddItemClick}
          >
            + Legg til nytt utstyr
          </Button>
        </div>

        <div className="admin-main">
          {/*Tabell */}
          <TableContainer
            component={Paper}
            style={{ maxHeight: "67vh", overflowY: "auto", zIndex: 1002 }}
          >
            <Table size="small">
              <TableHead className="sticky-header">
                <TableRow>
                  <TableCell>
                    <h3>Utstyr</h3>
                  </TableCell>
                  <TableCell>
                    <h3>Informasjon</h3>
                  </TableCell>
                  <TableCell>
                    <h3>Bilde</h3>
                  </TableCell>
                  <TableCell>
                    <h3>Antall</h3>
                  </TableCell>
                  <TableCell>
                    <h3>Handlinger</h3>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/*Ny rad for å legge til utstyr */}
                {isAddingItem && (
                  <TableRow>
                    <TableCell>
                      <TextField
                        value={editingItem?.equipment_name || ""}
                        onChange={(e) =>
                          handleEditFieldChange(e, "equipment_name")
                        }
                      />
                    </TableCell>
                    <TableCell>{/* Informasjonsfelt */}</TableCell>
                    <TableCell>{/* Bildefelt */}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={editingItem?.equipment_quantity || 0}
                        onChange={(e) =>
                          handleEditFieldChange(e, "equipment_quantity")
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <Button onClick={handleSaveNewItem}>
                          <SaveIcon />
                        </Button>
                        <Button onClick={() => setIsAddingItem(false)}>
                          <ClearIcon />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {equipment.map((item) => (
                  <TableRow key={item.equipment_id}>
                    {/* ... */}
                    <TableCell className="table-header-cell">
                      <Button
                        className="info-icon"
                        onClick={() => handleButtonClick(item)}
                      >
                        <InfoOutlinedIcon />
                      </Button>
                      <Modal
                        open={openModalMap[item.equipment_id] || false}
                        onClose={handleClose}
                        aria-labelledby="equipment-modal-title"
                        aria-describedby="equipment-modal-description"
                      >
                        <Box sx={{ width: 500, height: 500 }}>
                          {selectedItem && (
                            <>
                              <h2 id="equipment-modal-title">
                                {selectedItem.equipment_name}
                              </h2>
                              <img
                                src={`/assets/images/${selectedItem.equipment_id}.png`}
                                alt="Bildebeskrivelse"
                                className="modal-img"
                              />
                              <p id="equipment-modal-description">
                                {selectedItem.equipment_descr}
                                <Link
                                  href={`https://www.google.no/search?q=${encodeURIComponent(
                                    selectedItem.equipment_name
                                  )}`}
                                  underline="always"
                                  target="_blank"
                                >
                                  {"Trykk her til å finne mer"}
                                </Link>
                              </p>
                              <Button onClick={handleClose}>Lukk vindu</Button>
                            </>
                          )}
                        </Box>
                      </Modal>
                      {editingItem === item ? (
                        <TextField
                          value={
                            editedData.equipment_name || item.equipment_name
                          }
                          onChange={(e) =>
                            handleEditFieldChange(e, "equipment_name")
                          }
                        />
                      ) : (
                        item.equipment_name
                      )}
                    </TableCell>
                    <TableCell>{/* Legg til informasjonsfelt her */}</TableCell>
                    <TableCell>{/* Legg til bildefelt her */}</TableCell>
                    <TableCell className="quantity-cell">
                      {editingItem === item ? (
                        <TextField
                          value={
                            editedData.equipment_quantity ||
                            item.equipment_quantity
                          }
                          onChange={(e) =>
                            handleEditFieldChange(e, "equipment_quantity")
                          }
                        />
                      ) : (
                        item.equipment_quantity
                      )}
                    </TableCell>

                    <TableCell>
                      {item.equipment_status}
                      {editingItem === item ? (
                        <div>
                          <Button onClick={() => handleSaveClick(item)}>
                            <SaveIcon />
                          </Button>
                          <Button onClick={() => handleCancelEdit()}>
                            <ClearIcon />
                          </Button>
                        </div>
                      ) : (
                        <div className="admin-icons">
                          <IconButton onClick={() => handleEditClick(item)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleInactivateClick(item)}
                          >
                            <VisibilityOffIcon />
                          </IconButton>
                          {/* ... andre knapper ... */}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div>
            <Link to="/Equipmentlist">
              <EquipmentlistBtn />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;

//---------------------------------------------------------------------------------------------------------------------------------------

//RentHomepage
{/*import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import corporative from "./assets/images/pixel-cells.png";
import EquipmentList from "./Equipmentlist";
import Login from "./components/Login";


const style = {
  position: "absolute",
  top: "47%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  height: 650,
  bgcolor: "background.paper",
  border: "1px solid #fff",
  boxShadow: 35,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const [hovered, setHovered] = React.useState(false);

  const [loginModalOpen, setLoginModalOpen] = React.useState(false);




  return (
    <>
      <div className="main">
        <div className="heading">
          <h1>HeyTekApp</h1>
        </div>
        <div className="main-image">
          {" "}
          <img
            src={corporative}
            alt=""
            style={{ width: "100%", height: "100%", marginTop: "40px" }}
          />
        </div>
        <Button
          size="large"
          className="link-btn"
          onClick={handleOpen}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            backgroundColor: hovered ? "#9c27b0" : "#b2dfdb",
            color: hovered ? "#fff" : "#1e1e1e",
            transition: "background-color 0.3s, color 0.3s",
            marginTop: 120,
            width: "300px",
            minHeight: "60px",
            fontSize: "16px",
          }}
        >
      Logg inn
        </Button>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <EquipmentList />
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
}
*/}

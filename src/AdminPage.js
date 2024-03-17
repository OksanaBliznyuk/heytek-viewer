//AdminPage
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
import EquipmentlistBtn from "./components/EquipmentlistBtn";

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

  //fetchEquipmentData
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
      equipment_descr: "",
      equipment_img: "",

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
          <h4>Adminside</h4>
          <h3 className="admin-h3">Utstyrslisten</h3>
          {/*+Legg til btn */}
          <Button
            className="add-btn"
            color="secondary"
            variant="contained"
            size="small"
            onClick={handleAddItemClick}
          >
            + Legg til nytt utstyr
          </Button>
        </div>

        <div className="admin-main">
          {/*Tabell */}
          <div className="equipment-table">
            <TableContainer
              component={Paper}
              style={{ maxHeight: "65vh", overflowY: "100vw", zIndex: 1002 }}
            >
              <Table size="small">
                <TableHead className="sticky-header">
                  <TableRow>
                    <TableCell>
                      <h3>Utstyr</h3>
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
                    <TableRow key={editingItem?.equipment_id}>
                      <TableCell>
                        {editingItem ? (
                          <TextField
                            value={editedData.equipment_name || ""}
                            onChange={(e) =>
                              handleEditFieldChange(e, "equipment_name")
                            }
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItem ? (
                          <TextField
                            type="number"
                            value={editedData.equipment_quantity || 0}
                            onChange={(e) =>
                              handleEditFieldChange(e, "equipment_quantity")
                            }
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItem ? (
                          <div className="save-cancel-btn">
                            <Button onClick={() => handleSaveNewItem()}>
                              <SaveIcon />
                            </Button>
                            <Button onClick={() => setIsAddingItem(false)}>
                              <ClearIcon />
                            </Button>
                          </div>
                        ) : (
                          ""
                        )}
                      </TableCell>
                    </TableRow>
                  )}

                  {/*Infovindu Modal*/}

                  {equipment.map((item) => (
                    <TableRow key={item.equipment_id}>
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
                                <Button onClick={handleClose}>
                                  Lukk vindu
                                </Button>
                              </>
                            )}
                          </Box>
                        </Modal>

                        {/*.....*/}
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

                      <TableCell className="handle-cell">
                        {item.equipment_status}
                        {editingItem === item ? (
                          <div className="save-cancel-btn">
                            <Button onClick={() => handleSaveClick(item)}>
                              <SaveIcon />
                            </Button>
                            <Button onClick={() => handleCancelEdit()}>
                              <ClearIcon />
                            </Button>
                          </div>
                        ) : (
                          <div className="edit-inactiv-btn">
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
          </div>
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

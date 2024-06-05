//AdminPage 05.06
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
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import EquipmentlistBtn from "./components/EquipmentlistBtn";
import HambMenu from "./components/HambMenu";

const AdminPage = ({ eqId }) => {
  const [selectedEquipmentName, setSelectedEquipmentName] = useState("");
  const [currentEqId, setCurrentEqId] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openModalMap, setOpenModalMap] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [deletingItem, setDeletingItem] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleOpen = (item, eqId, equipmentName) => {
    setSelectedItem(item);
    setCurrentEqId(eqId);
    setSelectedEquipmentName(equipmentName);
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
      equipment_quantity: item.equipment_quantity,
      equipment_descr: item.equipment_descr,
      equipment_img: item.equipment_img,
      // Legg til andre felt etter behov
    });
  };

  // PUT/PATCH
  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditedData({});
  };

  const handleSaveClick = async (item) => {
    try {
      const response = await axios.patch(
        `http://localhost:8099/equipment/${item.equipment_id}`,
        editedData
      );
       // Update the equipment state with the modified equipment
       setEquipment((prevEquipment) =>
       prevEquipment.map((equip) =>
         equip.equipment_id === item.equipment_id ? response.data : equip
       )
     );
     setEditingItem(null);
     setEditedData({});
     console.log("Equipment updated:", response.data);
   } catch (error) {
     console.error("Error updating equipment:", error);
   }
 };

// DELETE
  const handleDeleteItemClick = async (item) => {
    const isConfirmed = window.confirm(
      "Er du sikker på at du vil slette dette utstyret?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:8099/equipment/${item.equipment_id}`);
        setEquipment(equipment.filter((equip) => equip.equipment_id !== item.equipment_id));
        console.log("Deleted equipment:", item);
      } catch (error) {
        console.error("Error deleting equipment:", error);
      }
    }
  };
  const handleEditFieldChange = (e, field) => {
    setEditedData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAddItemClick = () => {
    setIsAddingItem(true);
    setEditingItem({
      equipment_name: "", 
      equipment_quantity: 0,
      equipment_descr: "",
      equipment_img: "",

      // ... andre felt for det nye utstyret
    });

    setEditedData({
      equipment_name: "",
      equipment_quantity: 0,
      equipment_descr: "",
      equipment_img: ""
    });
  };


// POST
const handleSaveNewItem = async () => {
  try {
    const response = await axios.post("http://localhost:8099/equipment", editedData);
    // Add the new item to the equipment state
    setEquipment((prevEquipment) => [...prevEquipment, response.data]);
    setEditingItem(null);
    setEditedData({});
    setIsAddingItem(false);
    console.log("New equipment added:", response.data);
  } catch (error) {
    console.error("Error adding new equipment:", error);
  }
};

  return (
    <>
      <div className="admin-container" style={{ overflow: "auto" }}>
        <div className="admin-header">
          <h4>Admin Side</h4>
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
              style={{ maxHeight: "70vh", overflowY: "100vw", zIndex: 1002 }}
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

                      {/*Ikoner i feltet */}

                      <TableCell>
                        {editingItem ? (
                          <div className="save-cancel-btn">
                             <Button onClick={handleSaveNewItem}>
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
                          <Box className="admin-info-modal">
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

                                <div className="admin-info">
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
                                </div>
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

                      {/*Ikoner under HANDLE-cell */}

                      <TableCell className="handle-cell">
                        {item.equipment_status}
                        {editingItem === item ? (
                          <div className="save-cancel-btn">
                            <IconButton onClick={() => handleSaveClick(item)}>
                              <SaveIcon style={{ color: "#1565c0" }} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteItemClick(item)}
                            >
                              <DeleteIcon style={{ color: "#ab003c" }} />
                            </IconButton>
                            <IconButton onClick={() => handleCancelEdit()}>
                              <ClearIcon style={{ color: "#1565c0" }} />
                            </IconButton>
                          </div>
                        ) : (
                          <div className="edit-btn">
                            <IconButton onClick={() => handleEditClick(item)}>
                              <CreateOutlinedIcon/>
                            </IconButton>
                            {/* Erstatt ikonene med HambMenu */}
                            <HambMenu eqId={item.equipment_id} selectedEquipmentName={item.equipment_name} />


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
      </div>
    </>
  );
};

export default AdminPage;



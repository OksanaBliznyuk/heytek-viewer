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
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import EquipmentlistBtn from "./components/EquipmentlistBtn";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import HambMenu from "./components/HambMenu";

const AdminPage = ({ eqId }) => {
  const [selectedEquipmentName, setSelectedEquipmentName] = useState("");
  const [currentEqId, setCurrentEqId] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openModalMap, setOpenModalMap] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [editedData, setEditedData] = useState({
    equipment_name: "",
    equipment_quantity: 0,
    equipment_descr: "",
    equipment_img: "",
  });
  const [deletingItem, setDeletingItem] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);

  // Åpne modal for informasjon om utstyret
  const handleOpen = (item, eqId, equipmentName) => {
    setSelectedItem(item);
    setCurrentEqId(eqId);
    setSelectedEquipmentName(equipmentName);
    setOpenModalMap((prev) => ({ ...prev, [item.equipment_id]: true }));
  };

  // Hente utstyrdata fra API
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
        // Sortering av utstyr etter navn når dataene hentes
        const sortedEquipment = response.data.equipment.sort((a, b) =>
          a.equipment_name.localeCompare(b.equipment_name)
        );
        setEquipment(response.data.equipment);
      } catch (error) {
        console.error("Error fetching equipment data:", error);
      }
    };

    fetchEquipmentData();
  }, []);

  // Håndter klikk på informasjonsknapp for utstyr
  //const handleButtonClick = (item) => {
  // handleOpen(item);
  //};

  const handleButtonClick = (item) => {
    setSelectedItem(item);
    setCurrentEqId(item.equipment_id);
    setSelectedEquipmentName(item.equipment_name);
    setOpenModalMap((prev) => ({ ...prev, [item.equipment_id]: true }));
  };

  // Håndter klikk på redigeringsknapp for utstyr
  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditedData({
      equipment_name: item.equipment_name,
      equipment_quantity: item.equipment_quantity,
      equipment_descr: item.equipment_descr,
      equipment_img: item.equipment_img,
    });
  };

  // Avbryt redigering av utstyr
  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditedData({
      equipment_name: "",
      equipment_quantity: 0,
      equipment_descr: "",
      equipment_img: "",
    });
  };

  // Lagre endringer på utstyr PATCH
  const handleSaveClick = async (item) => {
    try {
      const response = await axios.patch(
        `http://localhost:8099/equipment/${item.equipment_id}`,
        editedData
      );

      // Oppdaterer utstyrslisten med de nye oppdateringene
      const updatedEquipment = equipment.map((equip) =>
        equip.equipment_id === item.equipment_id ? response.data : equip
      );

      // Sortering av utstyr etter navn når et element er redigert og lagret
      const sortedEquipment = updatedEquipment.sort((a, b) =>
        a.equipment_name.localeCompare(b.equipment_name)
      );

      // Update the equipment state with the modified equipment
      setEquipment((prevEquipment) =>
        prevEquipment.map((equip) =>
          equip.equipment_id === item.equipment_id ? response.data : equip
        )
      );
      setEditingItem(null);
      setEditedData({
        equipment_name: "",
        equipment_quantity: 0,
        equipment_descr: "",
        equipment_img: "",
      });
      console.log("Equipment updated:", response.data);
    } catch (error) {
      console.error("Error updating equipment:", error);
    }
  };

  //  Slett utstyr DELETE
  const handleDeleteItemClick = async (item) => {
    const isConfirmed = window.confirm(
      "Er du sikker på at du vil slette dette utstyret?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8099/equipment/${item.equipment_id}`
        );

        // Oppdaterer utstyrslisten etter sletting
        const updatedEquipment = equipment.filter(
          (equip) => equip.equipment_id !== item.equipment_id
        );

        // Sortering av utstyr etter navn når et element er slettet
        const sortedEquipment = updatedEquipment.sort((a, b) =>
          a.equipment_name.localeCompare(b.equipment_name)
        );
        setEquipment(
          equipment.filter((equip) => equip.equipment_id !== item.equipment_id)
        );
        console.log("Deleted equipment:", item);
      } catch (error) {
        console.error("Error deleting equipment:", error);
      }
    }
  };

  const handleEditFieldChange = (e, field) => {
    setEditedData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Legg til nytt utstyr
  const handleAddItemClick = () => {
    setIsAddingItem(true);
    setEditedData({
      equipment_name: "",
      equipment_quantity: 0,
      equipment_descr: "",
      equipment_img: "",
    });
  };

  // Lagre nytt utstyr POST
  const handleSaveNewItem = async () => {
    try {
      const formData = new FormData();
      formData.append("equipment_name", editedData.equipment_name);
      formData.append("equipment_quantity", editedData.equipment_quantity);
      formData.append("equipment_descr", editedData.equipment_descr);
      formData.append("equipment_img", editedData.equipment_img);

      const response = await axios.post(
        "http://localhost:8099/equipment",
        editedData
      );

      // Logger responsen fra serveren
      console.log("Response from server:", response.data);

      // Legger til det nye utstyret i utstyrslisten
      const updatedEquipment = [...equipment, response.data];

      // Sorterer utstyret etter navn hvis equipment_name er definert for det nye utstyret
      const sortedEquipment = updatedEquipment.sort((a, b) => {
        // Sjekker om equipment_name er definert for både a og b før sammenligning
        if (a.equipment_name && b.equipment_name) {
          return a.equipment_name.localeCompare(b.equipment_name);
        } else {
          return 0; // Returnerer 0 hvis en av verdiene mangler equipment_name
        }
      });

      // Add the new item to the equipment state
      setEquipment(sortedEquipment);
      setEditingItem(null);
      setEditedData({
        equipment_name: "",
        equipment_quantity: 0,
        equipment_descr: "",
        equipment_img: "",
      });
      setIsAddingItem(false);
      console.log("New equipment added:", response.data);
    } catch (error) {
      console.error("Error adding new equipment:", error);
    }
  };

  // Legg til denne funksjonen under de andre hendelseshåndteringsfunksjonene
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:8099/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Når bildet er lastet opp, lagres bildeinformasjonen i editedData
      setEditedData((prevData) => ({
        ...prevData,
        equipment_img: response.data.imageUrl,
      }));

      // Sett det opplastede bildet som kilde for forhåndsvisningen
      setSelectedImage(response.data.imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setImageUploaded(true);
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

                  <Modal
                    open={isAddingItem}
                    onClose={() => setIsAddingItem(false)}
                    aria-labelledby="add-item-modal"
                    aria-describedby="modal-to-add-new-equipment"
                  >
                    <div className="modal-container">
                      <h2 className="adm-modal-container">
                        Legg til nytt utstyr
                      </h2>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableBody>
                            {isAddingItem && (
                              <TableRow className="add-row">
                                <TableCell>
                                  <TextField
                                    label="Navn"
                                    type="text"
                                    value={editedData.equipment_name}
                                    onChange={(e) =>
                                      handleEditFieldChange(e, "equipment_name")
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    label="Antall"
                                    type="number"
                                    value={editedData.equipment_quantity}
                                    onChange={(e) =>
                                      handleEditFieldChange(
                                        e,
                                        "equipment_quantity"
                                      )
                                    }
                                  />
                                </TableCell>

                                {/*Beskrivelse og bilde*/}
                                <TableCell>
                                  <TextField
                                    label="Beskrivelse"
                                    type="text"
                                    maxRows={10}
                                    value={editedData.equipment_descr}
                                    onChange={(e) =>
                                      handleEditFieldChange(
                                        e,
                                        "equipment_descr"
                                      )
                                    }
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                      inputComponent: TextareaAutosize,
                                      inputProps: {
                                        style: {
                                          resize: "none", // Fjerner muligheten for manuell resizing
                                        },
                                      },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="custom-file-upload">
                                    <input
                                      type="file"
                                      onChange={(e) => handleImageChange(e)}
                                      id="file-upload"
                                      style={{ display: "none" }}
                                    />
                                    <label
                                      htmlFor="file-upload"
                                      className="custom-file-upload-btn"
                                    >
                                      <AddPhotoAlternateIcon /> Legg til bilde
                                    </label>
                                    {imageUploaded && (
                                      <div className="upload-success">
                                        <CheckCircleOutlinedIcon
                                          style={{ color: "green" }}
                                        />{" "}
                                        Bilde lastet opp
                                      </div>
                                    )}
                                  </div>
                                </TableCell>

                                {/* Legg til andre felt her */}
                                <TableCell>
                                  <div className="save-info-btn">
                                    <Button
                                      color="secondary"
                                      variant="outlined"
                                      size="small"
                                      onClick={handleSaveNewItem}
                                    >
                                      <SaveIcon />
                                    </Button>
                                    <Button
                                      color="secondary"
                                      variant="outlined"
                                      size="small"
                                      onClick={() => setIsAddingItem(false)}
                                    >
                                      <ClearIcon />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </Modal>

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
                                  {item.equipment_name}
                                </h2>

                                <img
                                  src={`/assets/images/${selectedItem.equipment_id}.png`}
                                  alt="Bildebeskrivelse"
                                  className="modal-img"
                                />

                                <div className="admin-info">
                                  <p id="equipment-modal-description">
                                    {item.equipment_descr}
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
                              <CreateOutlinedIcon />
                            </IconButton>
                            {/* Erstatt ikonene med HambMenu */}
                            <HambMenu
                              eqId={item.equipment_id}
                              selectedEquipmentName={item.equipment_name}
                            />
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

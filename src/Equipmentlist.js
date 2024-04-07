import React, { useState, useEffect } from "react";
import "./EquipmentList.css";
import { Link } from "react-router-dom";
//import microbit from "./assets/images/microbit..png";
import axios from "axios";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  TablePagination,
} from "@mui/material";
import HambMenu from "./components/HambMenu.js";
import AdminLogin from "./components/AdminLogin";

//Info vindu style:
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 300,
  bgcolor: "white",
  color: "black",
  border: "2px #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  zIndex: 1001,
};

const EquipmentList = ({ item }) => {
  const [equipment, setEquipment] = useState([]);
  //const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openModalMap, setOpenModalMap] = useState({});
  const [page, setPage] = useState(0); // Tilstand for å lagre gjeldende side
  const [rowsPerPage, setRowsPerPage] = useState(10); // Tilstand for å lagre antall rader per side

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 1000,
  };

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
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8099/equipment");
        setEquipment(response.data.equipment);
      } catch (error) {
        console.error("Error fetching equipment data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures useEffect runs once when component mounts

  const handleButtonClick = (item) => {
    handleOpen(item);
  };

  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAdminLogin = () => {
    // Implementer logikk for innlogging her
    console.log("Innlogging vellykket");
    // Sett eventuelle tilstander eller gjør andre handlinger etter innlogging
  };

  const handleChangePage = (equipment, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (equipment) => {
    setRowsPerPage(parseInt(equipment.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <div className="equipment-container">
        <div className="eqlist-header">
          <h4>Equipment List</h4>
        </div>

        <TableContainer
          component={Paper}
          style={{
            maxHeight: "60vh",
            maxWidth: "90%",
            marginLeft: "5%",
            overflowY: "auto",
            zIndex: 1002,
          }}
        >
          <Table size="medium">
            <TableHead className="sticky-header">
              <TableRow>
                <TableCell>
                  <h3>Utstyr</h3>
                </TableCell>
                <TableCell>
                  <h3>Antall</h3>
                </TableCell>
                <TableCell>
                  <h3>Tilgjengelig</h3>
                </TableCell>
                <TableCell>
                  <h3>Reservere</h3>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipment.map((item) => (
                <TableRow key={item.equipment_id}>
                  <TableCell className="table-header-cell">
                    <Button
                      className="info-icon"
                      onClick={() => handleButtonClick(item)}
                    >
                      <InfoOutlinedIcon />
                    </Button>
                    {/*InfoIcon*/}
                    <Modal
                      open={openModalMap[item.equipment_id] || false}
                      onClose={handleClose}
                      aria-labelledby="equipment-modal-title"
                      aria-describedby="equipment-modal-description"
                    >
                      <Box sx={{ ...style, width: 500, height: 500, textAlign: "center" }}>
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

                    {item.equipment_name}
                  </TableCell>
                  <TableCell>{item.equipment_quantity}</TableCell>
                  <TableCell>{item.equipment_available}</TableCell>
                  {/*Open menu and events */}
                  <TableCell>
                    {item.equipment_status}
                    <HambMenu />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/*PAGINERING*/}
        <TablePagination
        className="PaginationContainer"
          rowsPerPageOptions={[10, 25]} // Alternativer for antall rader per side
          component="div"
          count={equipment.length} // Totalt antall rader i tabellen
          rowsPerPage={rowsPerPage} // Antall rader per side
          page={page} // Gjeldende side
          onPageChange={handleChangePage} // Hendelsesbehandling for sideendring
          onRowsPerPageChange={handleChangeRowsPerPage} // Hendelsesbehandling for endring av antall rader per side
        />
        <div className="btn">
          {/*Logg ut btn*/}
          <Link to="/">
            <div className="logout-btn">
              <Button size="small" variant="contained">
                logg ut
              </Button>
            </div>
          </Link>
          <div className="admin-btn">
            <Button size="small" variant="outlined" onClick={handleOpenModal}>
              Administrer utlån
            </Button>
            <Modal open={modalOpen} onClose={handleCloseModal}>
              <AdminLogin onLogin={handleAdminLogin} />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentList;

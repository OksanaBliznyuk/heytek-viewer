// EventsTable.js
import React, { useState, useEffect } from "react";
import "./EventsTable.css";
import { Link } from "react-router-dom";
import EquipmentlistBtn from "./components/EquipmentlistBtn";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

const EventsTable = () => {

  const getInitialEditedFields = () => {
    if (editingRowId === null) {
      return {}; // Tomt objekt hvis ikke i redigeringsmodus
    }
  
    const editedRow = events.find((event) => event.event_id === editingRowId);
    console.log("Edited Row from Backend:", editedRow); // Legg til denne loggen
  
    if (!editedRow) {
      return {}; // Tomt objekt hvis raden ikke finnes
    }
  
    // Returner de redigerte feltene med verdiene fra den valgte raden
    return {
      eventuser_name: editedRow.eventuser_name,
      event_quantity: editedRow.event_quantity,
      event_date: editedRow.event_date,
      event_comment: editedRow.event_comment,
      event_type: editedRow.event_type,
      // Legg til resten av feltene her ...
    };
  };
  

  const [events, setEvents] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedFields, setEditedFields] = useState(getInitialEditedFields());
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);



  useEffect(() => {
    axios
      .get("http://localhost:8099/events")
      .then((response) => {
        if (response.data && Array.isArray(response.data.events)) {
          setEvents(response.data.events);
        } else {
          console.error("Invalid data format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error.message);
      });
  }, []);

  const handleEditClick = (rowId) => {
    setEditingRowId(rowId);
  };

  const handleSaveClick = (rowId) => {
    // Implementer logikken for å lagre endringer i databasen
    setEditingRowId(null);
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
  };

  const handleFieldChange = (field, value) => {
    // Oppdater de redigerte feltene når brukeren endrer verdien i tekstfeltet
    setEditedFields((prevFields) => ({ ...prevFields, [field]: value }));
  };


  return (
    <>
      <div className="events-container">
        <div className="eventstable-header">
          <h4>Reserver utstyr her</h4>
          <Button className="add-btn"
           variant="contained"
            color="secondary"
            size="small"
           onClick={() => setIsAddingNewItem(true)}>
  <AddIcon /> Legg til reservasjon
</Button>

        </div>
        <div className="events-main">
          {events.length > 0 ? ( // Legg til denne betingelsen for å sjekke om det er data å vise
            <TableContainer
              component={Paper}
              style={{
                maxHeight: "75vh",
                maxWidth: "100%",
                overflowY: "auto",
                zIndex: 1002,
              }}
            >
              <Table size="medium">
                <TableHead className="sticky-header">
                  <TableRow>
                    <TableCell>
                      <h3>Navn</h3>
                    </TableCell>
                    <TableCell>
                      <h3>Antall</h3>
                    </TableCell>
                    <TableCell>
                      <h3>Utlånsdato</h3>
                    </TableCell>
                    <TableCell>
                      <h3>Komment</h3>
                    </TableCell>
                    <TableCell>
                      <h3>Event type</h3>
                    </TableCell>
                    <TableCell>
                      <h3>Handling</h3>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/*Ny rad for å legge til utstyr vil bli her*/}
                  {events.map((event) => (
                    <TableRow key={event.event_id}>
                      <TableCell>
                        {editingRowId === event.event_id ? (
                          <TextField
                            value={editedFields.eventuser_name}
                            onChange={(e) =>
                              handleFieldChange(
                                "eventuser_name",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          event.eventuser_name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRowId === event.event_id ? (
                          <TextField
                            value={editedFields.event_quantity}
                            onChange={(e) =>
                              handleFieldChange(
                                "event_quantity",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          event.event_quantity
                        )}
                      </TableCell>
                      {/* Fortsett slik for resten av feltene */}
                      <TableCell>
                        {editingRowId === event.event_id ? (
                          <TextField
                            value={editedFields.event_date}
                            onChange={(e) =>
                              handleFieldChange(
                                "event_date",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          event.event_date
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRowId === event.event_id ? (
                          <TextField
                            value={editedFields.event_comment}
                            onChange={(e) =>
                              handleFieldChange(
                                "event_comment",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          event.event_comment
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRowId === event.event_id ? (
                          <TextField
                            value={editedFields.event_type}
                            onChange={(e) =>
                              handleFieldChange(
                                "event_type",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          event.event_type
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRowId === event.event_id ? (
                          <div className="events-icons">
                            <Button onClick={handleSaveClick}>
                              <SaveIcon />
                            </Button>
                            <Button onClick={handleCancelEdit}>
                              <ClearIcon />
                            </Button>
                          </div>
                        ) : (
                          <div className="events-icons">
                            <Button
                              onClick={() => handleEditClick(event.event_id)}
                            >
                              <EditIcon />
                            </Button>
                            {/* ... andre knapper ... */}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>Ingen hendelser å vise.</p>
          )}

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

export default EventsTable;

// EventsTable.js
import React, { useState, useEffect } from "react";
import "./EventsTable.css";
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
  TablePagination, 
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
  const [page, setPage] = useState(0); // Tilstand for å lagre gjeldende side
  const [rowsPerPage, setRowsPerPage] = useState(5); // Tilstand for å lagre antall rader per side

  const handleAddNewItem = () => {
    setIsAddingNewItem(true);

    // Legg til en ny tom rad i events-statet
    setEvents((prevEvents) => [
      ...prevEvents,
      {
        event_id: Date.now(), // Bruk en unik identifikator for hver ny rad
        eventuser_name: "",
        event_quantity: "",
        event_date: "",
        event_comment: "",
        event_type: "",
      },
    ]);

    // Sett redigeringsmodus for den nye raden
    setEditingRowId(Date.now());
    setEditedFields({
      eventuser_name: "",
      event_quantity: "",
      event_date: "",
      event_comment: "",
      event_type: "",
    });
  };

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

  // Ny funksjon for å sende POST-forespørsel og lagre en ny hendelse
  const saveNewEvent = async () => {
    try {
      const response = await axios.post("http://localhost:8099/events", {
        eventuser_name: editedFields.eventuser_name,
        event_quantity: editedFields.event_quantity,
        event_date: editedFields.event_date,
        event_comment: editedFields.event_comment,
        eq_id: editedFields.eq_id,
        event_type: "reservation" // Hardkodet til reservasjon, kan endres etter behov
      });
      console.log("New event saved:", response.data);
      // Legg til logikk for å oppdatere UI eller hente ny data fra serveren hvis nødvendig
    } catch (error) {
      console.error("Error saving new event:", error.message);
    }
  };

  // Legg til en ny hendelsesbehandler for å håndtere lagring av ny hendelse
  const handleSaveNewEvent = () => {
    saveNewEvent();
    setIsAddingNewItem(false); // Lukk redigeringsmodus etter at hendelsen er lagret
  };
//----------------------------------------------------------------------------------

  // Funksjon for å håndtere endring av side
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Funksjon for å håndtere endring av antall rader per side
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Konverterer verdi til heltall
    setPage(0); // Tilbakestill siden til første side når antall rader per side endres
  };

  const handleEditClick = (rowId) => {
    setEditingRowId(rowId);
  };

  const handleSaveClick = (rowId) => {
    // Implementer logikken for å lagre endringer i databasen
    setEditingRowId(null);
  };

  // Edit i den nye raden
  const handleCancelEdit = () => {
    if (isAddingNewItem) {
      setIsAddingNewItem(false);
      setEditedFields({});
    } else if (editingRowId !== null) {
      setEditingRowId(null);
    }
  };

  const handleFieldChange = (field, value) => {
    // Oppdater de redigerte feltene når brukeren endrer verdien i tekstfeltet
    setEditedFields((prevFields) => ({ ...prevFields, [field]: value }));
  };

  return (
    <>
      <div className="events-container">
        <div className="eventstable-header">
          <h1 className="eventstable-h1">
            Sjekk reservasjon og reserver utstyr her (EVENTS TABLE)
          </h1>
          <Button
            className="add-btn"
            variant="contained"
            color="secondary"
            size="small"
            style={{ width: 200, height: 40 }}
            onClick={() => setIsAddingNewItem(true)}
          >
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
                      <h3>Start reservering</h3>
                    </TableCell>
                    {/*<TableCell>
                      <h3>Slutt reservering</h3>
                    </TableCell>*/}
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
     {isAddingNewItem && (
                    <TableRow key={editingRowId}>
                      <TableCell>
                        <TextField
                          value={editedFields.eventuser_name}
                          onChange={(e) =>
                            handleFieldChange("eventuser_name", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedFields.event_quantity}
                          onChange={(e) =>
                            handleFieldChange("event_quantity", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedFields.event_date}
                          onChange={(e) =>
                            handleFieldChange("event_date", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedFields.event_comment}
                          onChange={(e) =>
                            handleFieldChange("event_comment", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedFields.event_type}
                          onChange={(e) =>
                            handleFieldChange("event_type", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="events-icons">
                          <Button onClick={handleSaveNewEvent}>
                            <SaveIcon />
                          </Button>
                          <Button onClick={handleCancelEdit}>
                            <ClearIcon />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
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
                              handleFieldChange("event_date", e.target.value)
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
                              handleFieldChange("event_comment", e.target.value)
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
                              handleFieldChange("event_type", e.target.value)
                            }
                          />
                        ) : (
                          event.event_type
                        )}
                      </TableCell>
                      {/*Ikoner*/}
                      <TableCell>
                        {editingRowId === event.event_id ? (
                          <div className="events-icons">
                            <Button onClick={handleSaveClick}>
                              <SaveIcon />
                            </Button>
                            <Button onClick={() => handleCancelEdit(event)}>
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]} // Alternativer for antall rader per side
            component="div"
            count={events.length} // Totalt antall rader i tabellen
            rowsPerPage={rowsPerPage} // Antall rader per side
            page={page} // Gjeldende side
            onPageChange={handleChangePage} // Hendelsesbehandling for sideendring
            onRowsPerPageChange={handleChangeRowsPerPage} // Hendelsesbehandling for endring av antall rader per side
          />
        </div>
      </div>
    </>
  );
};

export default EventsTable;

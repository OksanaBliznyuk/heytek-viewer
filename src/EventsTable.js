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
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Calendar from "./components/Calendar";

const EventsTable = ({ eqId }) => {
  const getInitialEditedFields = () => {
    if (editingRowId === null) {
      return {};
    }

    const editedRow = events.find((event) => event.event_id === editingRowId);
    console.log("Edited Row from Backend:", editedRow);

    if (!editedRow) {
      return {};
    }

    // Returner de redigerte feltene med verdiene fra den valgte raden
    return {
      eventuser_name: editedRow.eventuser_name,
      event_quantity: editedRow.event_quantity,
      event_startdate: editedRow.event_startdate,
      event_enddate: editedRow.event_enddate,
      event_comment: editedRow.event_comment,
      event_type: editedRow.event_type,
      // Legg til resten av feltene her ...
    };
  };

  const [events, setEvents] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedFields, setEditedFields] = useState(getInitialEditedFields());
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);

  const handleAddNewItem = () => {
    setIsAddingNewItem(true);

    // Legg til en ny tom rad i events-statet
    setEvents((prevEvents) => [
      ...prevEvents,
      {
        event_id: Date.now(), // Bruk en unik identifikator for hver ny rad
        eventuser_name: "",
        event_quantity: "",
        event_startdate: "",
        event_enddate: "",
        event_comment: "",
        event_type: "",
      },
    ]);

    // Sett redigeringsmodus for den nye raden
    setEditingRowId(Date.now());
    setEditedFields({
      eventuser_name: "",
      event_quantity: "",
      event_startdate: "",
      event_enddate: "",
      event_comment: "",
      event_type: "",
    });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8099/events?equipment_id=" + eqId)
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
  }, [eqId, updateKey]);

  //---------------------------------------------------------------------------------
  // Ny funksjon for å sende POST-forespørsel og lagre en ny hendelse
  const saveNewEvent = async () => {
    console.log("Saving event with data:", editedFields);
    try {
      const response = await axios.post("http://localhost:8099/events", {
        eventuser_name: editedFields.eventuser_name,
        event_quantity: editedFields.event_quantity,
        event_startdate: editedFields.event_startdate,
        event_enddate: editedFields.event_enddate,
        event_comment: editedFields.event_comment,
        eq_id: eqId,
        event_type: "reservation",
      });
      console.log("New event saved:", response.data);

      // Opprett en kopi av den nåværende hendelselisten
      const updatedEvents = [...events];

      // Legg den nye hendelsen til starten av hendelselisten
      updatedEvents.unshift(response.data);

      // Logg den oppdaterte hendelselisten for å sjekke om den nye hendelsen er lagt til riktig
      console.log("Updated events:", updatedEvents);

      // Oppdater hendelselisten
      setEvents(updatedEvents);

      // Oppdater oppdateringsnøkkelen for å utløse re-henting av data
      setUpdateKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error saving new event:", error.message);
    }
  };

  // Legg til en ny hendelsesbehandler for å håndtere lagring av ny hendelse
  const handleSaveNewEvent = async () => {
    await saveNewEvent();
    setIsAddingNewItem(false); // Lukk redigeringsmodus etter at hendelsen er lagret
  };

  //----------------------------------------------------------------------------------
  
  const handleEditClick = (eventId) => {
    // Hendelsen som samsvarer med eventId
    const selectedEvent = events.find((event) => event.event_id === eventId);

    // Oppdater tilstandene til editedFields med dataene fra den valgte hendelsen
    setEditedFields({
      eventuser_name: selectedEvent.eventuser_name,
      event_quantity: selectedEvent.event_quantity,
      event_startdate: selectedEvent.event_startdate,
      event_enddate: selectedEvent.event_enddate,
      event_comment: selectedEvent.event_comment,
      event_type: selectedEvent.event_type,
    });

    setEditingRowId(eventId);
  };

  // Må det være GET event her???
  const handleSaveClick = async (eventId) => {
    try {
      // Send en forespørsel til backend for å oppdatere den valgte hendelsen med de redigerte verdiene
      await axios.put(`http://localhost:8099/events/${eventId}`, editedFields);

      // Oppdater hendelsene i hendelseslisten med de redigerte verdiene
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.event_id === eventId ? editedFields : event
        )
      );
    } catch (error) {
      console.error("Error saving changes:", error.message);
    }
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

  const handleDeleteClick = async (eventId) => {
    const isConfirmed = window.confirm(
      "Er du sikker på at du vil slette denne reservasjonen?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:8099/events/${eventId}`);
        console.log("Event deleted:", eventId);
        setUpdateKey((prevKey) => prevKey + 1); // Oppdater oppdateringsnøkkelen for å utløse re-henting av data
      } catch (error) {
        console.error("Error deleting event:", error.message);
        console.error(eventId);
      }
    }
  };

  return (
    <>
      <div className="events-container">
        <div className="eventstable-header">
          <h1 className="eventstable-h1">
            Sjekk reservasjon og reserver utstyr her
          </h1>
          <Button
            className="add-btn"
            variant="contained"
            color="secondary"
            size="small"
            style={{ width: 200, height: 40, marginTop: -23 }}
            onClick={() => {
              setIsAddingNewItem(true);
              // Oppdater editedFields-objektet til å inneholde tomme verdier
              setEditedFields({
                eventuser_name: "",
                event_quantity: "",
                event_startdate: null, // Sett til null hvis det er et dato- eller tidobjekt
                event_enddate: null,
                event_comment: "",
                event_type: "",
              });
            }}
          >
            <AddIcon /> Legg til reservasjon
          </Button>
        </div>
        <div className="events-main">
          {events.length >= 0 ? ( // Legg til denne betingelsen for å sjekke om det er data å vise
            <TableContainer
              component={Paper}
              style={{
                maxHeight: "62vh",
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
                    <TableCell>
                      <h3>Slutt reservering</h3>
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
                        {/* Calendar-komponenten  */}
                        <Calendar
                          value={editedFields.event_startdate}
                          onDateTimeChange={(date) =>
                            handleFieldChange("event_startdate", date)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {/* Bruk Calendar-komponenten for å velge sluttdato */}
                        <Calendar
                          value={editedFields.event_enddate}
                          onDateTimeChange={(date) =>
                            handleFieldChange("event_enddate", date)
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

                  {/*Redigering felter */}
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
                            value={editedFields.event_startdate}
                            onChange={(e) =>
                              handleFieldChange(
                                "event_startdate",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          event.event_startdate
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRowId === event.event_id ? (
                          <TextField
                            value={editedFields.event_enddate}
                            onChange={(e) =>
                              handleFieldChange("event_enddate", e.target.value)
                            }
                          />
                        ) : (
                          event.event_enddate
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
                            <IconButton
                              onClick={() => handleSaveClick(event.event_id)}
                            >
                              <SaveIcon style={{ color: "#1565c0" }} />
                            </IconButton>

                            <IconButton
                              onClick={() => handleDeleteClick(event.event_id)}
                            >
                              <DeleteIcon style={{ color: "#ab003c" }} />
                            </IconButton>
                            <IconButton onClick={() => handleCancelEdit(event)}>
                              <ClearIcon style={{ color: "#1565c0" }} />
                            </IconButton>
                          </div>
                        ) : (
                          <div className="edit-icon">
                            <Button
                              variant="outlined"
                              style={{ color: "" }}
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
        </div>
      </div>
    </>
  );
};

export default EventsTable;

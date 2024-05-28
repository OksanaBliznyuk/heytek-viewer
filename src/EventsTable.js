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

const EventsTable = ({ eqId, selectedEquipmentName }) => {
  console.log("eqId: " + eqId)
  const getInitialEditedFields = () => {
    if (editingRowId === null) {
      return {};
    }

    const editedRow = events.find((event) => event.event_id === editingRowId);
    console.log("Edited Row from Backend:", editedRow);

    if (!editedRow) {
      return {};
    }

    // Returnerer de redigerte feltene med verdiene fra den valgte raden
    return {
      eventuser_name: editedRow.eventuser_name,
      event_quantity: editedRow.event_quantity,
      event_startdate: editedRow.event_startdate,
      event_enddate: editedRow.event_enddate,
      event_comment: editedRow.event_comment,
      event_type: editedRow.event_type,
    };
  };

  const [events, setEvents] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedFields, setEditedFields] = useState(getInitialEditedFields());
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);

  const handleAddNewItem = () => {
    setIsAddingNewItem(true);

    //En ny tom rad i events-statet
    setEvents((prevEvents) => [
      ...prevEvents,
      {
        event_id: Date.now(), //En unik identifikator for hver ny rad
        eventuser_name: "",
        event_quantity: "",
        event_startdate: "",
        event_enddate: "",
        event_comment: "",
        event_type: "",
      },
    ]);

    //Redigeringsmodus for den nye raden
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
          //Hendelsene sorteres basert på startdato i synkende rekkefølge
          const sortedEvents = response.data.events.sort((a, b) => new Date(b.event_startdate) - new Date(a.event_startdate));
          setEvents(sortedEvents);
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
    console.log("eqId:", eqId);

    try {
      const response = await axios.post("http://localhost:8099/events", {
        eventuser_name: editedFields.eventuser_name,
        event_quantity: editedFields.event_quantity,
        event_startdate: editedFields.event_startdate,
        event_enddate: editedFields.event_enddate,
        event_comment: editedFields.event_comment,
        eq_id: eqId ,
        event_type: "reservation",
      });
      console.log("New event saved:", response.data);

      // Oppdater hendelselisten med den nye hendelsen lagt til øverst
    setEvents((prevEvents) => [response.data, ...prevEvents]);

   //Oppdateringsnøkkelen for å utløse re-henting av data
      setUpdateKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error saving new event:", error.message);
    }
  };

  //Ny hendelsesbehandler for å håndtere lagring av ny hendelse
  const handleSaveNewEvent = async () => {
    await saveNewEvent();
    setIsAddingNewItem(false); // Lukk redigeringsmodus etter at hendelsen er lagret
  };

  //----------------------------------------------------------------------------------
  
  const handleEditClick = (eventId) => {
    // Hendelsen som samsvarer med eventId
    const selectedEvent = events.find((event) => event.event_id === eventId);

    //Tilstandene til editedFields med dataene fra den valgte hendelsen
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

  //----PATCH event---------------------------------------------------------------------------
  const handleSaveClick = async (eventId) => {
    try {
      // Send en PATCH-forespørsel til backend for å oppdatere hendelsen med den gitte eventId
      await axios.patch(`http://localhost:8099/events/${eventId}`, editedFields);
  console.log("Har lagret, tror jeg");
    } catch (error) {
      console.error("Error saving changes:", error.message);
    }
    handleCancelEdit();    
    // Hent hendelsene på nytt fra serveren for å oppdatere grensesnittet
         const response = await axios.get("http://localhost:8099/events?equipment_id=" + eqId);
         setEvents(response.data.events);
   
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
    //Redigerte feltene når brukeren endrer verdien i tekstfeltet
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
        setUpdateKey((prevKey) => prevKey + 1); //Oppdateringsnøkkelen for å utløse re-henting av data
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
          <div className="eventstable-tittel">
          <h1 className="eventstable-h1">{selectedEquipmentName}</h1>  <h2 className="eventstable-h2"> (sjekk reservasjon og reserver utstyr her) </h2>
          </div>
          <Button
            className="add-btn"
            variant="contained"
            color="secondary"
            size="small"
            style={{ width: 200, height: 40, marginTop: -23 }}
            onClick={() => {
              setIsAddingNewItem(true);
              // Oppdaterer editedFields-objektet til å inneholde tomme verdier
              setEditedFields({
                eventuser_name: "",
                event_quantity: "",
                event_startdate: null, //Null hvis det er et dato- eller tidobjekt
                event_enddate: null,
                event_comment: "",
                event_type: "reservering",
              });
            }}
          >
            <AddIcon /> Legg til reservasjon
          </Button>
        </div>
        <div className="events-main">
          {events.length >= 0 ? ( //Betingelsen for å sjekke om det er data å vise
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
                      <h3>Kommentar</h3>
                    </TableCell>
                    <TableCell className="hidden-field">
                      <h3>{/*Type*/}</h3>
                    </TableCell>
                    <TableCell>
                      <h3>{/*Handling*/}</h3>
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
                        <TextField className="hidden-field"
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

                  {/*Redigering av felter */}
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
                          <TextField className="hidden-field"
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

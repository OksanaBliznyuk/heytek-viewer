//DeliverEquipment
import React, { useState, useEffect } from 'react';
import "./ReturnLoan.css"


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

const ReturnLoan = ({ eqId }) => {
  console.log("eqId: " + eqId)
  const getInitialEditedFields = () => {
    if (editingRowId === null) {
      return {};
    }

    const editedRow = returnloans.find((returnloan) => returnloan.returnloan_id === editingRowId);
    console.log("Edited Row from Backend:", editedRow);

    if (!editedRow) {
      return {};
    }

    // Returnerer de redigerte feltene med verdiene fra den valgte raden
    return {
      returnloanuser_name: editedRow.returnloanuser_name,
      returnloan_quantity: editedRow.returnloan_quantity,
      returnloan_startdate: editedRow.returnloan_startdate,
      returnloan_enddate: editedRow.returnloan_enddate,
      returnloan_comment: editedRow.returnloan_comment,
      returnloan_type: editedRow.returnloan_type,
    };
  };

  const [returnloans, setReturnloans] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedFields, setEditedFields] = useState(getInitialEditedFields());
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);

  const handleAddNewItem = () => {
    setIsAddingNewItem(true);

    //En ny tom rad i events-statet
    setReturnloans((prevReturnloans) => [
      ...prevReturnloans,
      {
        returnloan_id: Date.now(), //En unik identifikator for hver ny rad
        returnloanuser_name: "",
        returnloan_quantity: "",
        returnloan_startdate: "",
        returnloan_enddate: "",
        returnloan_comment: "",
        returnloan_type: "",
      },
    ]);

    //Redigeringsmodus for den nye raden
    setEditingRowId(Date.now());
    setEditedFields({
      returnloanuser_name: "",
      returnloan_quantity: "",
      returnloan_startdate: "",
      returnloan_enddate: "",
      returnloan_comment: "",
      returnloan_type: "",
    });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8099/returnloans?equipment_id=" + eqId)
      .then((response) => {
        if (response.data && Array.isArray(response.data.returnloans)) {
          setReturnloans(response.data.returnloans);
        } else {
          console.error("Invalid data format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching returnloans:", error.message);
      });
  }, [eqId, updateKey]);

  //---------------------------------------------------------------------------------
  // Ny funksjon for å sende POST-forespørsel og lagre en ny hendelse
  const saveNewReturnloan = async () => {
    console.log("Saving returnloan with data:", editedFields);
    console.log("eqId:", eqId);

    try {
      const response = await axios.post("http://localhost:8099/returnloans", {
        returnloanuser_name: editedFields.returnloanuser_name,
        returnloan_quantity: editedFields.returnloan_quantity,
        returnloan_startdate: editedFields.returnloan_startdate,
        returnloan_enddate: editedFields.returnloan_enddate,
        returnloan_comment: editedFields.returnloan_comment,
        eq_id: eqId ,
        returnloan_type: "returnering",
      });
      console.log("New returnloan saved:", response.data);

      // Oppdater hendelselisten med den nye hendelsen lagt til øverst
    setReturnloans((prevReturnloans) => [response.data, ...prevReturnloans]);

   //Oppdateringsnøkkelen for å utløse re-henting av data
      setUpdateKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error saving new returnloan:", error.message);
    }
  };

  //Ny hendelsesbehandler for å håndtere lagring av ny hendelse
  const handleSaveNewReturnloan = async () => {
    await saveNewReturnloan();
    setIsAddingNewItem(false); // Lukk redigeringsmodus etter at hendelsen er lagret
  };

  //----------------------------------------------------------------------------------
  
  const handleEditClick = (returnloanId) => {
    // Hendelsen som samsvarer med eventId
    const selectedReturnloan = returnloans.find((returnloan) => returnloan.returnloan_id === returnloanId);

    //Tilstandene til editedFields med dataene fra den valgte hendelsen
    setEditedFields({
      returnloanuser_name: selectedReturnloan.returnloanuser_name,
      returnloan_quantity: selectedReturnloan.returnloan_quantity,
      returnloan_startdate: selectedReturnloan.returnloan_startdate,
      returnloan_enddate: selectedReturnloan.returnloan_enddate,
      returnloan_comment: selectedReturnloan.returnloan_comment,
      returnloan_type: selectedReturnloan.returnloan_type,
    });

    setEditingRowId(returnloanId);
  };

  //----PATCH event---------------------------------------------------------------------------
  const handleSaveClick = async (returnloanId) => {
    try {
      // Send en PATCH-forespørsel til backend for å oppdatere hendelsen med den gitte eventId
      await axios.patch(`http://localhost:8099/returnloans/${returnloanId}`, editedFields);
  console.log("Har lagret, tror jeg");
    } catch (error) {
      console.error("Error saving changes:", error.message);
    }
    handleCancelEdit();    
    // Hent hendelsene på nytt fra serveren for å oppdatere grensesnittet
         const response = await axios.get("http://localhost:8099/returnloans?equipment_id=" + eqId);
         setReturnloans(response.data.returnloans);
   
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

  const handleDeleteClick = async (returnloanId) => {
    const isConfirmed = window.confirm(
      "Er du sikker på at du vil slette denne returnering?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:8099/returnloans/${returnloanId}`);
        console.log("Returnloan deleted:", returnloanId);
        setUpdateKey((prevKey) => prevKey + 1); //Oppdateringsnøkkelen for å utløse re-henting av data
      } catch (error) {
        console.error("Error deleting returnloan:", error.message);
        console.error(returnloanId);
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
              // Oppdaterer editedFields-objektet til å inneholde tomme verdier
              setEditedFields({
                returnloanuser_name: "",
                returnloan_quantity: "",
                returnloan_startdate: null, //Null hvis det er et dato- eller tidobjekt
                returnloan_enddate: null,
                returnloan_comment: "",
                returnloan_type: "returnering",
              });
            }}
          >
            <AddIcon /> Legg til reservasjon
          </Button>
        </div>
        <div className="returnloans-main">
          {returnloans.length >= 0 ? ( //Betingelsen for å sjekke om det er data å vise
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
                          value={editedFields.returnloanuser_name}
                          onChange={(e) =>
                            handleFieldChange("returnloanuser_name", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedFields.returnloan_quantity}
                          onChange={(e) =>
                            handleFieldChange("returnloan_quantity", e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        {/* Calendar-komponenten  */}
                        <Calendar
                          value={editedFields.returnloan_startdate}
                          onDateTimeChange={(date) =>
                            handleFieldChange("returnloan_startdate", date)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Calendar
                          value={editedFields.returnloan_enddate}
                          onDateTimeChange={(date) =>
                            handleFieldChange("returnloan_enddate", date)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedFields.returnloan_comment}
                          onChange={(e) =>
                            handleFieldChange("returnloan_comment", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedFields.returnloan_type}
                          onChange={(e) =>
                            handleFieldChange("returnloan_type", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="return-loan-icons">
                          <Button onClick={handleSaveNewReturnloan}>
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
                  {returnloans.map((returnloan) => (
                    <TableRow key={returnloan.returnloan_id}>
                      <TableCell>
                        {editingRowId === returnloan.returnloan_id ? (
                          <TextField
                            value={editedFields.returnloanuser_name}
                            onChange={(e) =>
                              handleFieldChange(
                                "returnloanuser_name",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          returnloan.returnloanuser_name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRowId === returnloan.returnloan_id ? (
                          <TextField
                            value={editedFields.returnloan_quantity}
                            onChange={(e) =>
                              handleFieldChange(
                                "returnloan_quantity",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          returnloan.returnloan_quantity
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRowId === returnloan.returnloan_id ? (
                          <TextField
                            value={editedFields.returnloan_startdate}
                            onChange={(e) =>
                              handleFieldChange(
                                "returnloan_startdate",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          returnloan.returnloan_startdate
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRowId === returnloan.returnloan_id ? (
                          <TextField
                            value={editedFields.returnloan_enddate}
                            onChange={(e) =>
                              handleFieldChange("returnloan_enddate", e.target.value)
                            }
                          />
                        ) : (
                          returnloan.returnloan_enddate
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRowId === returnloan.returnloan_id ? (
                          <TextField
                            value={editedFields.returnloan_comment}
                            onChange={(e) =>
                              handleFieldChange("returnloan_comment", e.target.value)
                            }
                          />
                        ) : (
                          returnloan.returnloan_comment
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRowId === returnloan.returnloan_id ? (
                          <TextField
                            value={editedFields.returnloan_type}
                            onChange={(e) =>
                              handleFieldChange("returnloan_type", e.target.value)
                            }
                          />
                        ) : (
                          returnloan.returnloan_type
                        )}
                      </TableCell>
                      {/*Ikoner*/}
                      <TableCell>
                        {editingRowId === returnloan.returnloan_id ? (
                          <div className="return-loan-icons">
                            <IconButton
                              onClick={() => handleSaveClick(returnloan.returnloan_id)}
                            >
                              <SaveIcon style={{ color: "#1565c0" }} />
                            </IconButton>

                            <IconButton
                              onClick={() => handleDeleteClick(returnloan.returnloan_id)}
                            >
                              <DeleteIcon style={{ color: "#ab003c" }} />
                            </IconButton>
                            <IconButton onClick={() => handleCancelEdit(returnloan)}>
                              <ClearIcon style={{ color: "#1565c0" }} />
                            </IconButton>
                          </div>
                        ) : (
                          <div className="edit-icon">
                            <Button
                              variant="outlined"
                              style={{ color: "" }}
                              onClick={() => handleEditClick(returnloan.returnloan_id)}
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

export default ReturnLoan;

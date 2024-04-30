import React, { useState, useEffect } from "react";
import "./EventsTable.css";
import "./Loanout.css";
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

const LoanOut = ({ eqId }) => {
  console.log("eqId: " + eqId);
  const getInitialEditedFields = () => {
    if (editingRowId === null) {
      return {}; // Tomt objekt hvis ikke i redigeringsmodus
    }

    const editedRow = loans.find((loan) => loan.loan_id === editingRowId);
    console.log("Edited Row from Backend:", editedRow);

    if (!editedRow) {
      return {};
    }

    // Returner de redigerte feltene med verdiene fra den valgte raden
    return {
      loanuser_name: editedRow.loanuser_name,
      loan_quantity: editedRow.loan_quantity,
      loan_startdate: editedRow.loan_startdate,
      loan_enddate: editedRow.loan_enddate,
      loan_comment: editedRow.loan_comment,
      loan_type: editedRow.loan_type,
    };
  };

  const [loans, setLoans] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedFields, setEditedFields] = useState(getInitialEditedFields());
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [updateKey, setUpdateKey] = useState(0); // Oppdateringsnøkkel

  const handleAddNewItem = () => {
    setIsAddingNewItem(true);

    // Legg til en ny tom rad i events-statet
    setLoans((prevLoans) => [
      ...prevLoans,
      {
        loan_id: Date.now(), // Bruk en unik identifikator for hver ny rad
        loanuser_name: "",
        loan_quantity: "",
        loan_startdate: "",
        loan_enddate: "",
        loan_comment: "",
        loan_type: "",
      },
    ]);

    // Sett redigeringsmodus for den nye raden
    setEditingRowId(Date.now());
    setEditedFields({
      loanuser_name: "",
      loan_quantity: "",
      loan_startdate: "",
      loan_enddate: "",
      loan_comment: "",
      loan_type: "",
    });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8099/loans?equipment_id=" + eqId)
      .then((response) => {
        if (response.data && Array.isArray(response.data.loans)) {
          setLoans(response.data.loans);
        } else {
          console.error("Invalid data format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching loans:", error.message);
      });
  }, [eqId, updateKey]);

 
  // Funksjon for å sende POST-forespørsel og lagre en ny hendelse
  const saveNewLoan = async () => {
    console.log("Saving loan with data:", editedFields);
    console.log("eqId:", eqId);

    try {
      const response = await axios.post("http://localhost:8099/loans", {
        loanuser_name: editedFields.loanuser_name,
        loan_quantity: editedFields.loan_quantity,
        loan_startdate: editedFields.loan_startdate,
        loan_enddate: editedFields.loan_enddate,
        loan_comment: editedFields.loan_comment,
        eq_id: eqId,
        loan_type: "låne", // Hardkodet til reservasjon, kan endres etter behov
      });
      console.log("New loan saved:", response.data);

      //En kopi av den nåværende hendelselisten
      const updatedLoans = [...loans];

      // Legg den nye hendelsen til starten av hendelselisten
      updatedLoans.unshift(response.data);

      // Logg den oppdaterte hendelselisten for å sjekke om den nye hendelsen er lagt til riktig
      console.log("Updated loans:", updatedLoans);

      //Oppdater hendelselisten
      setLoans(updatedLoans);

      //Oppdateringsnøkkelen for å utløse re-henting av data
      setUpdateKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error saving new loan:", error.message);
    }
  };

  // Legg til en ny hendelsesbehandler for å håndtere lagring av ny hendelse
  const handleSaveNewLoan = () => {
    saveNewLoan();
    setIsAddingNewItem(false); // Lukk redigeringsmodus etter at hendelsen er lagret
  };
  //----------------------------------------------------------------------------------

  const handleEditClick = (loanId) => {
    // Hendelsen som samsvarer med loanId
    const selectedLoan = loans.find((loan) => loan.loan_id === loanId);

    //Tilstandene til editedFields med dataene fra den valgte hendelsen
    setEditedFields({
      loanuser_name: selectedLoan.loanuser_name,
      loan_quantity: selectedLoan.loan_quantity,
      loan_startdate: selectedLoan.loan_startdate,
      loan_enddate: selectedLoan.loan_enddate,
      loan_comment: selectedLoan.loan_comment,
      loan_type: selectedLoan.loan_type,
    });
    setEditingRowId(loanId);
  };

  //----PATCH loan---------------------------------------------------------------------------
  const handleSaveClick = async (loanId) => {
    try {
      // Send en PATCH-forespørsel til backend for å oppdatere hendelsen med den gitte loanId
      await axios.patch(`http://localhost:8099/loans/${loanId}`, editedFields);
      console.log("Har lagret, tror jeg");
    } catch (error) {
      console.error("Error saving changes:", error.message);
    }
    handleCancelEdit();
    // Hent hendelsene på nytt fra serveren for å oppdatere grensesnittet
    const response = await axios.get(
      "http://localhost:8099/loans?equipment_id=" + eqId
    );
    setLoans(response.data.loans);
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

  const handleDeleteClick = async (loanId) => {
    const isConfirmed = window.confirm(
      "Er du sikker på at du vil slette denne utlån?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:8099/loans/${loanId}`);
        console.log("Loan deleted:", loanId);
        setUpdateKey((prevKey) => prevKey + 1); // Oppdater oppdateringsnøkkelen for å utløse re-henting av data
      } catch (error) {
        console.error("Error deleting loan :", error.message);
      }
    }
  };

  return (
    <>
      <div className="loan-out-container">
        <div className="loan-out-header">
          <h1 className="loan-out-h1">Sjekk utlån og lån ut utstyr her</h1>
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
                loantuser_name: "",
                loan_quantity: "",
                loan_startdate: null, //Null hvis det er et dato- eller tidobjekt
                loan_enddate: null,
                loan_comment: "",
                loan_type: "reservering",
              });
            }}
          >
            <AddIcon /> Legg til utlån
          </Button>
        </div>
        <div className="eloan-out-main">
          {loans.length >= 0 ? ( //betingelsen for å sjekke om det er data å vise
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
                      <h3>Start utlån</h3>
                    </TableCell>
                    <TableCell>
                      <h3>Slutt utlån???</h3>
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
                          value={editedFields.loanuser_name}
                          onChange={(e) =>
                            handleFieldChange("loanuser_name", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedFields.loan_quantity}
                          onChange={(e) =>
                            handleFieldChange("loan_quantity", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {/* Calendar-komponenten  */}
                        <Calendar
                          value={editedFields.loan_startdate}
                          onDateTimeChange={(date) =>
                            handleFieldChange("loan_startdate", date)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {/* Bruk Calendar-komponenten for å velge sluttdato */}
                        <Calendar
                          value={editedFields.loan_enddate}
                          onDateTimeChange={(date) =>
                            handleFieldChange("loan_enddate", date)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedFields.loan_comment}
                          onChange={(e) =>
                            handleFieldChange("loan_comment", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedFields.loan_type}
                          onChange={(e) =>
                            handleFieldChange("loan_type", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="loan-out-icons">
                          <Button onClick={handleSaveNewLoan}>
                            <SaveIcon />
                          </Button>
                          <Button onClick={handleCancelEdit}>
                            <ClearIcon />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {loans.map((loan) => (
                    <TableRow key={loan.loan_id}>
                      <TableCell>
                        {editingRowId === loan.loan_id ? (
                          <TextField
                            value={editedFields.loanuser_name}
                            onChange={(e) =>
                              handleFieldChange("loanuser_name", e.target.value)
                            }
                          />
                        ) : (
                          loan.loanuser_name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRowId === loan.loan_id ? (
                          <TextField
                            value={editedFields.loan_quantity}
                            onChange={(e) =>
                              handleFieldChange("loan_quantity", e.target.value)
                            }
                          />
                        ) : (
                          loan.loan_quantity
                        )}
                      </TableCell>
                      {/* Fortsett slik for resten av feltene */}
                      <TableCell>
                        {editingRowId === loan.loan_id ? (
                          <TextField
                            value={editedFields.loan_startdate}
                            onChange={(e) =>
                              handleFieldChange(
                                "loan_startdate",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          loan.loan_date
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRowId === loan.loan_id ? (
                          <TextField
                            value={editedFields.loan_enddate}
                            onChange={(e) =>
                              handleFieldChange("loan_enddate", e.target.value)
                            }
                          />
                        ) : (
                          loan.loan_date
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRowId === loan.loan_id ? (
                          <TextField
                            value={editedFields.loan_comment}
                            onChange={(e) =>
                              handleFieldChange("loan_comment", e.target.value)
                            }
                          />
                        ) : (
                          loan.loan_comment
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRowId === loan.loan_id ? (
                          <TextField
                            value={editedFields.loan_type}
                            onChange={(e) =>
                              handleFieldChange("loan_type", e.target.value)
                            }
                          />
                        ) : (
                          loan.loan_type
                        )}
                      </TableCell>
                      {/*Ikoner*/}
                      <TableCell>
                        {editingRowId === loan.loan_id ? (
                          <div className="loan-out-icons">
                            <IconButton onClick={handleSaveClick}>
                              <SaveIcon style={{ color: "#1565c0" }} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteClick(loan.loan_id)}
                            >
                              <DeleteIcon style={{ color: "#ab003c" }} />
                            </IconButton>
                            <IconButton onClick={() => handleCancelEdit(loan)}>
                              <ClearIcon style={{ color: "#1565c0" }} />
                            </IconButton>
                          </div>
                        ) : (
                          <div className="edit-icon">
                            <Button
                              variant="outlined"
                              style={{ color: "" }}
                              onClick={() => handleEditClick(loan.loan_id)}
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

export default LoanOut;

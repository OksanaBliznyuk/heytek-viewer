//Login.js
import React, { useState, useEffect } from "react";
import { Modal, Paper, Typography, TextField, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const Login = ({ onLogin, onCancel }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(true);


  useEffect(() => {
    // Setter modalOpen til true når komponenten monteres
    setModalOpen(true);
  }, []);


  const handleLogin = () => {
    // Implementer autentiseringslogikken her
    // Kall onLogin-funksjonen hvis pålogging er vellykket
    if (code === "1234") {
      onLogin();
      window.location.href = "/EquipmentList";
    } else {
      setError("Feil kode. Prøv igjen.");
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleModalClick = (e) => {
    // La modalen bli åpen hvis du klikker på feltet for å unngå lukking ved klikk på tekstfeltet
    e.stopPropagation();
  };
  

  return (
    <Modal
      open={modalOpen}
      aria-labelledby="numeric-login-modal"
      aria-describedby="numeric-login-form"
      onClick={handleModalClick} 
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      <Paper style={{ padding: "20px", maxWidth: "400px" }}>
        <LockIcon
          style={{
            display: "block",
            margin: "auto",
            fontSize: "2rem",
            color: "#9c27b0",
          }}
        />

        <TextField
          label="Kode"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password" // Skjuler inntastet tekst
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          style={{ marginTop: "20px" }}
        >
          Logg inn
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          id="cancel-button"
          onClick={handleCancel} // Lukk modalen når brukeren klikker "Avbryt"
          style={{ marginTop: "10px" }}
        >
          Avbryt
        </Button>
      </Paper>
    </Modal>
  );
};

export default Login;

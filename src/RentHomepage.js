import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import corporative from "./assets/images/pixel-cells.png";
import EquipmentList from "./Equipmentlist";
import Login from "./components/Login";

const style = {
  position: "absolute",
  top: "47%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  height: 650,
  bgcolor: "background.paper",
  border: "1px solid #fff",
  boxShadow: 35,
  p: 4,
};

export default function BasicModal() {
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  const handleOpen = () => setLoginModalOpen(true);
  const handleClose = () => setLoginModalOpen(false);

  return (
    <>
      <div className="main">
        <div className="heading">
          <h1>HeyTekApp</h1>
        </div>
        <div className="main-image">
          {" "}
          <img
            src={corporative}
            alt=""
            style={{ width: "100%", height: "100%", marginTop: "30px" }}
          />
        </div>
        <Button
          size="large"
          className="link-btn"
          onClick={handleOpen}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            backgroundColor: hovered ? "#b2dfdb" : "#005260",
            color: hovered ? "#1e1e1e" : "#fff",
            transition: "background-color 0.3s, color 0.3s",
            marginTop: 95,
            width: "220px",
            minHeight: "60px",
            fontSize: "16px",
            borderRadius: "40px",
          }}
        >
          Logg inn
        </Button>
        <Modal
          open={loginModalOpen}
          onClose={handleClose}
          aria-labelledby="numeric-login-modal"
          aria-describedby="numeric-login-form"
        >
          <Box sx={style} onClick={(e) => e.stopPropagation()}>
            <Login onLogin={handleClose} onCancel={handleClose} />
          </Box>
        </Modal>
      </div>
    </>
  );
}

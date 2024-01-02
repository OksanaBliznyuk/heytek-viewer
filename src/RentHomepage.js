import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
//import corporative from "../assets/images/corporative.jpg";
import EquipmentList from "./Equipmentlist";

const style = {
  position: "absolute",
  top: "49%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  height: 650,
  bgcolor: "background.paper",
  border: "1px solid #fff",
  boxShadow: 35,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="main">
        <div className="heading">
          <h1>HeyTek</h1>
          <Button
            className="link-btn"
            onClick={handleOpen}
            style={{ backgroundColor: "#d7eace", color: "#1e1e1e", transition: "background-color 0.3s, color 0.3s" }}
          >
            Låne og innlevere utstyr
          </Button>
        </div>
      {/* <div className="main-image">
          {" "}
          <img
            src={corporative}
            alt=""
            style={{ width: "100%", height: "100%" }}
          />
  </div>*/}

        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <EquipmentList />
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
}

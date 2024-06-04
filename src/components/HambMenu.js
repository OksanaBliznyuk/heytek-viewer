//HamburgerMeny.js
import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreOutlinedIcon from "@mui/icons-material/MoreOutlined";
import Modal from "@mui/material/Modal";
import EventsTable from "../EventsTable";
import LoanOut from "../LoanOut";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function CustomizedMenus({ eqId, selectedEquipmentName }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [currentEqId, setCurrentEqId] = useState(null);
  const [currentSelectedEquipmentName, setCurrentSelectedEquipmentName] = useState("");
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const StyledModal = styled(Modal)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const handleOpenModal = (action, eqId, selectedEquipmentName) => {
    setCurrentEqId(eqId);
    setCurrentSelectedEquipmentName(selectedEquipmentName);
    setModalContent(action);
    setModalOpen(true);
  };
  

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div
        className="hambmenu-icon"
        style={{
          width: "80px",
          textAlign: "center",
        }}
      >
        <IconButton
          variant="outlined"
          style={
            {
              /*color:"#1565c0"*/
            }
          }
          id="demo-customized-button"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          disableElevation
          onClick={handleClick}
        >
          <MoreOutlinedIcon />
        </IconButton>

        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            "aria-labelledby": "demo-customized-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => handleOpenModal("reserver", eqId, selectedEquipmentName)}
            disableRipple
          >
            Reserver
          </MenuItem>
          <MenuItem
            onClick={() => handleOpenModal("lånUt", eqId, selectedEquipmentName)}
            disableRipple
          >
            Lån ut
          </MenuItem>
        </StyledMenu>
      </div>

      {/* Modal for EventsTable */}
      <StyledModal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={{
            backgroundColor: "white",
            padding: 20,
            outline: "none",
            width: "80%",
            maxHeight: "80%",
          }}
        >
          {modalContent === "reserver" && (
            <EventsTable
              eqId={currentEqId}
              selectedEquipmentName={currentSelectedEquipmentName} // Passing prop
            />
          )}
          {modalContent === "lånUt" && (
            <LoanOut
              eqId={currentEqId}
              selectedEquipmentName={currentSelectedEquipmentName} // Passing prop
            />
          )}
          <Button onClick={handleCloseModal}>Lukk vindu</Button>
        </div>
      </StyledModal>
    </>
  );
}

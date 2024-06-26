//AdminHamburgerMeny.js
//HamburgerMeny.js
import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import Modal from "@mui/material/Modal";
import EventsTable from "../EventsTable";
import LoanOut from "../LoanOut";
import DeliverEquipment from "../DeliverEquipment";

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

export default function CustomizedMenus({ eqId }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
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

  //const handleOpenModal = () => {
  //setModalOpen(true);
  //handleClose(); // Lukk menyen når modalen åpnes
  //};

  const handleOpenModal = (side) => {
    setModalContent(side);
    setModalOpen(true);
    handleClose(); // Lukk menyen når modalen åpnes
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div
        className="hambmenu-icon"
        style={{
          backgroundColor: "rgb(238, 238, 238)",
          width: "80px",
          textAlign: "center",
          borderRadius: "5px",
        }}
      >
        <Button
          id="demo-customized-button"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          disableElevation
          onClick={handleClick}
        >
          <ManageSearchIcon />
        </Button>

        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            "aria-labelledby": "demo-customized-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleOpenModal("reserver")} disableRipple>
            Rediger utstyr
          </MenuItem>
          <MenuItem onClick={() => handleOpenModal("reserver")} disableRipple>
            Slett utstyr
          </MenuItem>
          <MenuItem onClick={() => handleOpenModal("reserver")} disableRipple>
            Reserver
          </MenuItem>
          <MenuItem onClick={() => handleOpenModal("lånUt")} disableRipple>
            Lån ut
          </MenuItem>
          <MenuItem onClick={() => handleOpenModal("leverInn")} disableRipple>
            Lever inn
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
          {modalContent === "reserver" && <EventsTable eqId={eqId} />}
          {modalContent === "lånUt" && <LoanOut />}
          {modalContent === "leverInn" && <DeliverEquipment />}
          <Button onClick={handleCloseModal}>Lukk vindu</Button>
        </div>
      </StyledModal>
    </>
  );
}



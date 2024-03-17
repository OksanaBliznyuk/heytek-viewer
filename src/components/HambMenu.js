//HamburgerMeny.js
import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { Link } from "react-router-dom";
import Modal from "@mui/material/Modal";
import AdminLogin from "./AdminLogin";

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

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    handleClose();
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  //login

  const handleAdminLogin = () => {
    // Implementer logikken som skal utføres når numerisk pålogging er vellykket
    setIsLoggedIn(true);
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
          <MenuItem component={Link} to="/events-table">
            Reserver
          </MenuItem>

          <MenuItem onClick={handleClose} disableRipple>
            Lever inn
          </MenuItem>
          <MenuItem onClick={handleOpenModal} disableRipple>
            Administrer utlån
          </MenuItem>
        </StyledMenu>
      </div>
      {/* Modal for AdminLogin */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <AdminLogin onLogin={handleAdminLogin} />
      </Modal>
    </>
  );
}

// EquipmentlistBTN.js
import React from "react";
import { Button } from "@mui/material";

const EquipmentlistBtn = () => {
  return (
    <>
      <div className="equipmentlist-btn">
        <Button 
        style={{marginTop: "20px"}}
        size="small" variant="contained">
          tilbake til equipment list
        </Button>
      </div>
    </>
  );
};

export default EquipmentlistBtn;

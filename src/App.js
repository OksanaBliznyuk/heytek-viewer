//App.js
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RentHomepage from "./RentHomepage"; // Sjekk at banen til RentHomepage er korrekt
import EquipmentList from "./Equipmentlist.js";
import AdminPage from "./AdminPage";
import EventsTable from './EventsTable'; // Import your EventsTable component


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<RentHomepage />} />
          <Route path="/EquipmentList" element={<EquipmentList />} />
          <Route path="/events-table" element={<EventsTable />}exact />
          <Route path="/admin" element={<AdminPage />} exact />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

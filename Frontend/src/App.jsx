import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "./components/SideBar";
import Dashboard from "./pages/Dashboard";
import TableManagement from "./pages/TableManagement";
import OrderManagement from "./pages/Order";

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tables" element={<TableManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

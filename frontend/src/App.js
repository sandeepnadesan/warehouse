// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ImportPage from './pages/ImportPage';
import ExportPage from './pages/ExportPage';
// import './styles.css';

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/import">Import</Link>
        <Link to="/export">Export</Link>
      </nav>
      <Routes>
        <Route path="/import" element={<ImportPage />} />
        <Route path="/export" element={<ExportPage />} />
      </Routes>
    </Router>
  );
};

export default App;

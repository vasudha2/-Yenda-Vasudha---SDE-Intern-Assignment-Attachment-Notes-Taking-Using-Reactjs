import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Homepage from './components/Homepage/Homepage';

function App() {
 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Homepage />
            ) : (
              
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {}
        <Route path="/Register" element={<Register />} />

        {}
        <Route
          path="/Homepage"
          element={
            isAuthenticated ? (
              <Homepage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

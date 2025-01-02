import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './components/LogIn';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import PrivateRoute from './components/PrivateRoute';
import CompanyManager from './components/CompanyManager';
import CalendarView from './components/CalendarView';
import Notifications from './components/Notifications';
import CommunicationManager from './components/CommunicationManager';
import Header from './components/Header';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout }}>
      <Router>
        {user && <Header />}
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LogIn />} />

          <Route element={<PrivateRoute role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/add-company" element={<CompanyManager />} />
            <Route path="/admin/edit-company/:companyId" element={<CompanyManager />} />
            <Route path="/admin/add-communication" element={<CommunicationManager />} />
          </Route>

          <Route element={<PrivateRoute role="user" />}>
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/user/calendar/:companyId" element={<CalendarView />} />
            <Route path="/user/notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

import React, { useState } from 'react';
import { isAutenticado, logout } from './services/auth.service';
import LoginPage from './pages/LoginPage/LoginPage';
import CheckinPage from './pages/CheckinPage/CheckinPage';
import AnalysisPage from './pages/AnalysisPage/AnalysisPage';
import SchedulePage from './pages/SchedulePage/SchedulePage';
import AccountPage from './pages/AccountPage/AccountPage';

import './App.css';

function App() {
  const [autenticado, setAutenticado] = useState(isAutenticado());
  const [currentPage, setCurrentPage] = useState('checkin');
  const [checkinData, setCheckinData] = useState(null);

  const handleLoginSuccess = () => {
    setAutenticado(true);
    setCurrentPage('checkin');
  };
 
  const handleLogout = () => {
    logout();
    setAutenticado(false);
    setCurrentPage('checkin');
  };

  const handleCheckinSubmit = (data) => {
    setCheckinData(data);
    setCurrentPage('analysis');
  };

  const handleNavigate = (page) => {
    if (page === 'logout') {
      handleLogout();
      return;
    }
    setCurrentPage(page);
  };
 
  if (!autenticado) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const handleBack = () => {
    setCurrentPage('checkin');
  };

  const handleSchedule = () => {
    setCurrentPage('schedule');
  };

  const handleBackToAnalysis = () => {
    setCurrentPage('analysis');
  };

  return (
    <div className="App">
      {currentPage === 'checkin' && (
        <CheckinPage onSubmit={handleCheckinSubmit} onNavigate={handleNavigate} />
      )}
      {currentPage === 'analysis' && (
        <AnalysisPage data={checkinData} onBack={handleBack} onSchedule={handleSchedule} onNavigate={handleNavigate}/>
      )}
      {currentPage === 'schedule' && (
        <SchedulePage onBack={handleBackToAnalysis} onNavigate={handleNavigate} />
      )}
      {currentPage === 'account' && (
        <AccountPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
        
      )} 
    </div>
  );
}

export default App;

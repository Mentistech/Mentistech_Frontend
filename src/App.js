import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage/LoginPage';
import CheckinPage from './pages/CheckinPage/CheckinPage';
import AnalysisPage from './pages/AnalysisPage/AnalysisPage';
import SchedulePage from './pages/SchedulePage/SchedulePage';
import AccountPage from './pages/AccountPage/AccountPage';
import { getMe, removeToken, getToken } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('checkin');
  const [checkinData, setCheckinData] = useState(null);

  useEffect(() => {
    if (getToken()) {
      getMe()
        .then((data) => setUser({ nome: data.nome, papel: data.papel, usuarioId: data.id }))
        .catch(() => removeToken())
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('checkin');
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    setCheckinData(null);
    setCurrentPage('checkin');
  };

  const handleCheckinSubmit = (data) => {
    setCheckinData(data);
    setCurrentPage('analysis');
  };

  const handleNavigate = (page) => setCurrentPage(page);

  if (authLoading) {
    return (
      <div className="App app-loading">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="App">
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="App">
      {currentPage === 'checkin' && (
        <CheckinPage
          onSubmit={handleCheckinSubmit}
          onNavigate={handleNavigate}
          userName={user.nome}
        />
      )}
      {currentPage === 'analysis' && (
        <AnalysisPage
          data={checkinData}
          onBack={() => setCurrentPage('checkin')}
          onSchedule={() => setCurrentPage('schedule')}
          onNavigate={handleNavigate}
          userName={user.nome}
        />
      )}
      {currentPage === 'schedule' && (
        <SchedulePage
          onBack={() => setCurrentPage('analysis')}
          onNavigate={handleNavigate}
          analiseId={checkinData?.analiseId}
        />
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

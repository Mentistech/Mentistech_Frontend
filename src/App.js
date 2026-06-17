import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage/LoginPage';
import CheckinPage from './pages/CheckinPage/CheckinPage';
import AnalysisPage from './pages/AnalysisPage/AnalysisPage';
import SchedulePage from './pages/SchedulePage/SchedulePage';
import AccountPage from './pages/AccountPage/AccountPage';
import ConsultationsPage from './pages/ConsultationsPage/ConsultationsPage';
import CheckinHistoryPage from './pages/CheckinHistoryPage/CheckinHistoryPage';
import PsychologistDashboardPage from './pages/PsychologistDashboardPage/PsychologistDashboardPage';
import PsychologistConsultationsPage from './pages/PsychologistConsultationsPage/PsychologistConsultationsPage';
import AvailabilityPage from './pages/AvailabilityPage/AvailabilityPage';
import { getMe, removeToken, getToken } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(null);
  const [checkinData, setCheckinData] = useState(null);

  useEffect(() => {
    if (getToken()) {
      getMe()
        .then((data) => {
          setUser({ nome: data.nome, papel: data.papel, usuarioId: data.id });
          // Define pagina inicial baseada no papel
          if (data.papel === 'PSICOLOGO') {
            setCurrentPage('dashboard');
          } else {
            setCurrentPage('checkin');
          }
        })
        .catch(() => removeToken())
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('papel', userData.papel);
    // Define pagina inicial baseada no papel
    if (userData.papel === 'PSICOLOGO') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('checkin');
    }
  };

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('papel');
    setUser(null);
    setCheckinData(null);
    setCurrentPage(null);
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

  // Rotas do Psicologo
  if (user.papel === 'PSICOLOGO') {
    return (
      <div className="App">
        {currentPage === 'dashboard' && (
          <PsychologistDashboardPage
            onNavigate={handleNavigate}
            userName={user.nome}
          />
        )}
        {currentPage === 'psy-consultations' && (
          <PsychologistConsultationsPage
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'availability' && (
          <AvailabilityPage
            onNavigate={handleNavigate}
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

  // Rotas do Colaborador (Paciente)
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
          checkinData={checkinData}
        />
      )}
      {currentPage === 'account' && (
        <AccountPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'consultations' && (
        <ConsultationsPage
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === 'history' && (
        <CheckinHistoryPage
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default App;

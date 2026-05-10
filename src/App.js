import React, { useState } from 'react';
import CheckinPage from './pages/CheckinPage/CheckinPage';
import AnalysisPage from './pages/AnalysisPage/AnalysisPage';
import SchedulePage from './pages/SchedulePage/SchedulePage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('checkin');
  const [checkinData, setCheckinData] = useState(null);

  const handleCheckinSubmit = (data) => {
    setCheckinData(data);
    setCurrentPage('analysis');
  };

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
        <CheckinPage onSubmit={handleCheckinSubmit} />
      )}
      {currentPage === 'analysis' && (
        <AnalysisPage data={checkinData} onBack={handleBack} onSchedule={handleSchedule} />
      )}
      {currentPage === 'schedule' && (
        <SchedulePage onBack={handleBackToAnalysis} />
      )}
    </div>
  );
}

export default App;

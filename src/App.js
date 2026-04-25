import React, { useState } from 'react';
import CheckinPage from './pages/CheckinPage/CheckinPage';
import AnalysisPage from './pages/AnalysisPage/AnalysisPage';
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

  return (
    <div className="App">
      {currentPage === 'checkin' && (
        <CheckinPage onSubmit={handleCheckinSubmit} />
      )}
      {currentPage === 'analysis' && (
        <AnalysisPage data={checkinData} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;

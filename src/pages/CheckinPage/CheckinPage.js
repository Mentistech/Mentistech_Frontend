import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import './CheckinPage.css';

const moods = [
  { value: 1, emoji: '😢', label: 'Muito mal' },
  { value: 2, emoji: '😟', label: 'Mal' },
  { value: 3, emoji: '😐', label: 'Neutro' },
  { value: 4, emoji: '🙂', label: 'Bem' },
  { value: 5, emoji: '😄', label: 'Muito bem' },
];

function CheckinPage({ onSubmit }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [stressLevel, setStressLevel] = useState(50);

  const handleSubmit = () => {
    if (selectedMood !== null) {
      onSubmit({ mood: selectedMood, stressLevel });
    }
  };

  return (
    <div className="checkin-page">
      <Header />
      
      <main className="checkin-content">
        <div className="checkin-card">
          <h1 className="greeting">Olá, João!</h1>
          
          <div className="mood-section">
            <h2 className="section-title">Como se sente hoje?</h2>
            
            <div className="mood-options">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  className={`mood-button ${selectedMood === mood.value ? 'selected' : ''}`}
                  onClick={() => setSelectedMood(mood.value)}
                  title={mood.label}
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="stress-section">
            <input
              type="range"
              min="0"
              max="100"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="stress-slider"
            />
            <span className="stress-label">Nível de estresse</span>
          </div>
          
          <button 
            className="submit-button"
            onClick={handleSubmit}
            disabled={selectedMood === null}
          >
            Fazer check-in
          </button>
        </div>
      </main>
    </div>
  );
}

export default CheckinPage;

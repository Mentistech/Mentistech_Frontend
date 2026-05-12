import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import { createCheckin } from '../../services/api';
import './CheckinPage.css';

const moods = [
  { value: 1, emoji: '😢', label: 'Muito mal', humor: 'MUITO_MAL' },
  { value: 2, emoji: '😟', label: 'Mal', humor: 'MAL' },
  { value: 3, emoji: '😐', label: 'Neutro', humor: 'NEUTRO' },
  { value: 4, emoji: '🙂', label: 'Bem', humor: 'BEM' },
  { value: 5, emoji: '😄', label: 'Muito bem', humor: 'MUITO_BEM' },
];

function CheckinPage({ onSubmit, onNavigate, userName }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [stressLevel, setStressLevel] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (selectedMood === null) return;
    setError('');
    setLoading(true);
    try {
      const humor = moods.find((m) => m.value === selectedMood).humor;
      const nivelEstresse = Math.max(1, Math.round(stressLevel / 10));
      const response = await createCheckin(humor, nivelEstresse);
      onSubmit({
        mood: selectedMood,
        stressLevel,
        checkinId: response.id,
        analiseId: response.analise?.id ?? null,
        respostaIa: response.respostaIa ?? null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkin-page">
      <Header currentPage="checkin" onNavigate={onNavigate} />

      <main className="checkin-content">
        <div className="checkin-card">
          <h1 className="greeting">Olá, {userName || 'você'}!</h1>

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
            <span className="stress-label">Nível de estresse: {stressLevel}%</span>
          </div>

          {error && <p className="checkin-error">{error}</p>}

          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={selectedMood === null || loading}
          >
            {loading ? 'Enviando...' : 'Fazer check-in'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default CheckinPage;

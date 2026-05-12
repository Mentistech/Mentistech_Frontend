import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { getCheckinAnalise } from '../../services/api';
import './AnalysisPage.css';

function AnalysisPage({ data, onBack, onSchedule, onNavigate, userName }) {
  const [analiseText, setAnaliseText] = useState(data?.respostaIa || '');
  const [loading, setLoading] = useState(!data?.respostaIa);
  const [error, setError] = useState('');

  useEffect(() => {
    if (data?.respostaIa) return;
    if (!data?.checkinId) {
      setLoading(false);
      return;
    }
    getCheckinAnalise(data.checkinId)
      .then((analise) => setAnaliseText(analise.respostaIa || ''))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [data]);

  return (
    <div className="analysis-page">
      <Header currentPage="checkin" onNavigate={onNavigate} />

      <main className="analysis-content">
        <div className="analysis-card">
          <h1 className="greeting">Olá, {userName || 'você'}!</h1>

          <h2 className="analysis-title">Análise de hoje pela IA</h2>

          <div className="analysis-text">
            {loading && <p className="analysis-loading">Gerando análise...</p>}
            {error && <p className="analysis-error">{error}</p>}
            {!loading && !error && <p>{analiseText || 'Análise não disponível.'}</p>}
          </div>

          <button className="schedule-button" onClick={onSchedule}>
            Agendar consulta
          </button>

          {onBack && (
            <button className="back-link" onClick={onBack}>
              Voltar ao check-in
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default AnalysisPage;

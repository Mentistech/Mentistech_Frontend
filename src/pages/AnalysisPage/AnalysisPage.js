import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { buscarAnaliseCheckin } from '../../services/checkin.service';
import './AnalysisPage.css';

function AnalysisPage({ data, onBack, onSchedule, onNavigate }) {
  const [analise, setAnalise] = useState(null);
  const [loading, setLoading] = useState(true);

  const nome = localStorage.getItem('nome') || 'Usuário';

  useEffect(() => {
    if (!data?.checkinId) {
      setLoading(false);
      return;
    }

    buscarAnaliseCheckin(data.checkinId)
      .then((res) => setAnalise(res))
      .catch(() => setAnalise(null))
      .finally(() => setLoading(false));
  }, [data?.checkinId]);

  const textoExibido = analise?.respostaIa || 'A análise de IA estará disponível em breve.';

  return (
    <div className="analysis-page">
      <Header currentPage="checkin" onNavigate={onNavigate} />

      <main className="analysis-content">
        <div className="analysis-card">
          <h1 className="greeting">Olá, {nome}!</h1>

          <h2 className="analysis-title">Análise de hoje pela IA</h2>

          <div className="analysis-text">
            {loading ? (
              <p>Carregando análise...</p>
            ) : (
              <p>{textoExibido}</p>
            )}
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

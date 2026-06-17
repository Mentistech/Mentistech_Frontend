import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { listarMeusCheckins, buscarAnaliseCheckin } from '../../services/checkin.service';
import './CheckinHistoryPage.css';

const HUMOR_EMOJIS = {
  MUITO_BEM: { emoji: '😄', label: 'Muito bem' },
  BOM: { emoji: '🙂', label: 'Bom' },
  NEUTRO: { emoji: '😐', label: 'Neutro' },
  MAL: { emoji: '😔', label: 'Mal' },
  MUITO_MAL: { emoji: '😞', label: 'Muito mal' },
  OTIMO: { emoji: '😄', label: 'Otimo' },
  RUIM: { emoji: '😔', label: 'Ruim' },
  PESSIMO: { emoji: '😞', label: 'Pessimo' },
};

function CheckinHistoryPage({ onNavigate }) {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [analises, setAnalises] = useState({});
  const [loadingAnalise, setLoadingAnalise] = useState(null);

  useEffect(() => {
    carregarCheckins();
  }, []);

  const carregarCheckins = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await listarMeusCheckins();
      setCheckins(data);
    } catch (err) {
      setError('Erro ao carregar historico. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpandir = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(id);

    if (!analises[id]) {
      try {
        setLoadingAnalise(id);
        const analise = await buscarAnaliseCheckin(id);
        setAnalises(prev => ({ ...prev, [id]: analise }));
      } catch (err) {
        setAnalises(prev => ({ ...prev, [id]: { error: true } }));
      } finally {
        setLoadingAnalise(null);
      }
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatarHora = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHumorInfo = (humor) => {
    return HUMOR_EMOJIS[humor] || { emoji: '😐', label: humor };
  };

  const getEstresseColor = (nivel) => {
    if (nivel <= 30) return '#48bb78';
    if (nivel <= 60) return '#ecc94b';
    return '#f56565';
  };

  return (
    <div className="history-page">
      <Header currentPage="history" onNavigate={onNavigate} />
      
      <main className="history-content">
        <h1 className="page-title">Historico de Check-ins</h1>

        {error && (
          <div className="error-message">{error}</div>
        )}

        {loading ? (
          <div className="loading">Carregando historico...</div>
        ) : checkins.length === 0 ? (
          <div className="empty-state">
            <p>Voce ainda nao realizou nenhum check-in.</p>
            <button 
              className="checkin-btn"
              onClick={() => onNavigate('checkin')}
            >
              Fazer check-in
            </button>
          </div>
        ) : (
          <div className="checkins-list">
            {checkins.map((checkin) => {
              const humorInfo = getHumorInfo(checkin.humor);
              const isExpanded = expandedId === checkin.id;
              
              return (
                <div key={checkin.id} className="checkin-card">
                  <button 
                    className="checkin-header-btn"
                    onClick={() => handleExpandir(checkin.id)}
                  >
                    <div className="checkin-summary">
                      <span className="checkin-emoji">{humorInfo.emoji}</span>
                      <div className="checkin-meta">
                        <span className="checkin-date">{formatarData(checkin.criadoEm || checkin.dataHora)}</span>
                        <span className="checkin-time">{formatarHora(checkin.criadoEm || checkin.dataHora)}</span>
                      </div>
                    </div>
                    <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                      &#9662;
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="checkin-details">
                      <div className="detail-row">
                        <span className="detail-label">Humor:</span>
                        <span className="detail-value">{humorInfo.emoji} {humorInfo.label}</span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">Nivel de estresse:</span>
                        <div className="estresse-wrapper">
                          <div className="estresse-bar">
                            <div 
                              className="estresse-fill"
                              style={{ 
                                width: `${checkin.nivelEstresse}%`,
                                backgroundColor: getEstresseColor(checkin.nivelEstresse)
                              }}
                            />
                          </div>
                          <span className="estresse-value">{checkin.nivelEstresse}%</span>
                        </div>
                      </div>

                      {checkin.observacoes && (
                        <div className="detail-row detail-column">
                          <span className="detail-label">Observacoes:</span>
                          <p className="detail-text">{checkin.observacoes}</p>
                        </div>
                      )}

                      <div className="analise-section">
                        <span className="detail-label">Analise da IA:</span>
                        {loadingAnalise === checkin.id ? (
                          <p className="analise-loading">Carregando analise...</p>
                        ) : analises[checkin.id]?.error ? (
                          <p className="analise-error">Nao foi possivel carregar a analise.</p>
                        ) : analises[checkin.id] ? (
                          <p className="analise-text">{analises[checkin.id].texto || analises[checkin.id].analise || 'Analise nao disponivel.'}</p>
                        ) : (
                          <p className="analise-loading">Carregando analise...</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default CheckinHistoryPage;
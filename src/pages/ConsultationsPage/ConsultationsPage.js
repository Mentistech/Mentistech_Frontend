import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { listarMinhasConsultas, cancelarConsulta, STATUS_CONSULTA, STATUS_LABELS } from '../../services/consulta.service';
import './ConsultationsPage.css';

function ConsultationsPage({ onNavigate }) {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelando, setCancelando] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    carregarConsultas();
  }, []);

  const carregarConsultas = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await listarMinhasConsultas();
      setConsultas(data);
    } catch (err) {
      setError('Erro ao carregar consultas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta consulta?')) {
      return;
    }

    try {
      setCancelando(id);
      setError('');
      await cancelarConsulta(id);
      setSuccessMessage('Consulta cancelada com sucesso.');
      setTimeout(() => setSuccessMessage(''), 3000);
      carregarConsultas();
    } catch (err) {
      setError('Erro ao cancelar consulta. Tente novamente.');
    } finally {
      setCancelando(null);
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

  const getStatusClass = (status) => {
    switch (status) {
      case STATUS_CONSULTA.AGENDADA:
        return 'status-agendada';
      case STATUS_CONSULTA.REALIZADA:
        return 'status-realizada';
      case STATUS_CONSULTA.CANCELADA:
        return 'status-cancelada';
      default:
        return '';
    }
  };

  return (
    <div className="consultations-page">
      <Header currentPage="consultations" onNavigate={onNavigate} />
      
      <main className="consultations-content">
        <h1 className="page-title">Minhas Consultas</h1>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {loading ? (
          <div className="loading">Carregando consultas...</div>
        ) : consultas.length === 0 ? (
          <div className="empty-state">
            <p>Voce ainda nao possui consultas agendadas.</p>
            <button 
              className="schedule-btn"
              onClick={() => onNavigate('checkin')}
            >
              Fazer check-in
            </button>
          </div>
        ) : (
          <div className="consultas-list">
            {consultas.map((consulta) => (
              <div key={consulta.id} className="consulta-card">
                <div className="consulta-header">
                  <span className={`consulta-status ${getStatusClass(consulta.status)}`}>
                    {STATUS_LABELS[consulta.status] || consulta.status}
                  </span>
                </div>
                
                <div className="consulta-info">
                  <div className="info-row">
                    <span className="info-label">Psicologo:</span>
                    <span className="info-value">{consulta.psicologo?.nome || 'Nao informado'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Data:</span>
                    <span className="info-value">{formatarData(consulta.dataHora)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Horario:</span>
                    <span className="info-value">{formatarHora(consulta.dataHora)}</span>
                  </div>
                  {consulta.psicologo?.especialidade && (
                    <div className="info-row">
                      <span className="info-label">Especialidade:</span>
                      <span className="info-value">{consulta.psicologo.especialidade}</span>
                    </div>
                  )}
                </div>

                {consulta.status === STATUS_CONSULTA.AGENDADA && (
                  <div className="consulta-actions">
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelar(consulta.id)}
                      disabled={cancelando === consulta.id}
                    >
                      {cancelando === consulta.id ? 'Cancelando...' : 'Cancelar consulta'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ConsultationsPage;
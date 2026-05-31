import React, { useState, useEffect } from 'react';
import PsychologistHeader from '../../components/PsychologistHeader/PsychologistHeader';
import { listarMinhasConsultas, STATUS_CONSULTA, STATUS_LABELS } from '../../services/consulta.service';
import './PsychologistDashboardPage.css';

function PsychologistDashboardPage({ onNavigate, userName }) {
  const [consultasHoje, setConsultasHoje] = useState([]);
  const [consultasFuturas, setConsultasFuturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarConsultas();
  }, []);

  const carregarConsultas = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await listarMinhasConsultas();
      
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const amanha = new Date(hoje);
      amanha.setDate(amanha.getDate() + 1);

      const consultasAgendadas = data.filter(c => c.status === STATUS_CONSULTA.AGENDADA);
      
      const doHoje = consultasAgendadas.filter(c => {
        const dataConsulta = new Date(c.dataHora);
        return dataConsulta >= hoje && dataConsulta < amanha;
      });

      const futuras = consultasAgendadas.filter(c => {
        const dataConsulta = new Date(c.dataHora);
        return dataConsulta >= amanha;
      }).slice(0, 5);

      setConsultasHoje(doHoje);
      setConsultasFuturas(futuras);
    } catch (err) {
      setError('Erro ao carregar consultas.');
    } finally {
      setLoading(false);
    }
  };

  const formatarHora = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarDataCurta = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <div className="psy-dashboard-page">
      <PsychologistHeader currentPage="dashboard" onNavigate={onNavigate} />
      
      <main className="psy-dashboard-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Ola, {userName || 'Doutor(a)'}</h1>
          <p className="welcome-subtitle">Confira sua agenda de hoje</p>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <>
            <section className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Consultas de Hoje</h2>
                <span className="section-count">{consultasHoje.length}</span>
              </div>

              {consultasHoje.length === 0 ? (
                <div className="empty-card">
                  <p>Nenhuma consulta agendada para hoje.</p>
                </div>
              ) : (
                <div className="consultas-grid">
                  {consultasHoje.map((consulta) => (
                    <div key={consulta.id} className="consulta-card-mini">
                      <div className="consulta-time">{formatarHora(consulta.dataHora)}</div>
                      <div className="consulta-patient">
                        {consulta.colaborador?.nome || 'Paciente'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Proximas Consultas</h2>
                <button 
                  className="view-all-btn"
                  onClick={() => onNavigate('psy-consultations')}
                >
                  Ver todas
                </button>
              </div>

              {consultasFuturas.length === 0 ? (
                <div className="empty-card">
                  <p>Nenhuma consulta futura agendada.</p>
                </div>
              ) : (
                <div className="consultas-list-mini">
                  {consultasFuturas.map((consulta) => (
                    <div key={consulta.id} className="consulta-row">
                      <div className="consulta-date-badge">
                        {formatarDataCurta(consulta.dataHora)}
                      </div>
                      <div className="consulta-row-info">
                        <span className="consulta-row-patient">
                          {consulta.colaborador?.nome || 'Paciente'}
                        </span>
                        <span className="consulta-row-time">
                          {formatarHora(consulta.dataHora)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="quick-actions">
              <button 
                className="action-btn"
                onClick={() => onNavigate('availability')}
              >
                Gerenciar Disponibilidade
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => onNavigate('psy-consultations')}
              >
                Ver Todas as Consultas
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default PsychologistDashboardPage;
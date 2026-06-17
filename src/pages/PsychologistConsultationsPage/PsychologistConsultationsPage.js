import React, { useState, useEffect } from 'react';
import PsychologistHeader from '../../components/PsychologistHeader/PsychologistHeader';
import { 
  listarMinhasConsultas, 
  atualizarStatusConsulta, 
  cancelarConsulta,
  STATUS_CONSULTA, 
  STATUS_LABELS 
} from '../../services/consulta.service';
import './PsychologistConsultationsPage.css';

function PsychologistConsultationsPage({ onNavigate }) {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODAS');
  const [atualizando, setAtualizando] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

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
      setError('Erro ao carregar consultas.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarRealizada = async (id) => {
    try {
      setAtualizando(id);
      setError('');
      await cancelarConsulta(id, STATUS_CONSULTA.REALIZADA);
      setSuccessMessage('Consulta marcada como realizada.');
      setTimeout(() => setSuccessMessage(''), 3000);
      carregarConsultas();
    } catch (err) {
      setError('Erro ao atualizar consulta.');
    } finally {
      setAtualizando(null);
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta consulta?')) {
      return;
    }

    try {
      setAtualizando(id);
      setError('');
      await atualizarStatusConsulta(id, STATUS_CONSULTA.CANCELADA);
      setSuccessMessage('Consulta cancelada com sucesso.');
      setTimeout(() => setSuccessMessage(''), 3000);
      carregarConsultas();
    } catch (err) {
      setError('Erro ao cancelar consulta.');
    } finally {
      setAtualizando(null);
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

  const consultasFiltradas = consultas.filter(c => {
    if (filtroStatus === 'TODAS') return true;
    return c.status === filtroStatus;
  });

  return (
    <div className="psy-consultations-page">
      <PsychologistHeader currentPage="consultations" onNavigate={onNavigate} />
      
      <main className="psy-consultations-content">
        <h1 className="page-title">Minhas Consultas</h1>

        <div className="filtros">
          <button 
            className={`filtro-btn ${filtroStatus === 'TODAS' ? 'active' : ''}`}
            onClick={() => setFiltroStatus('TODAS')}
          >
            Todas
          </button>
          <button 
            className={`filtro-btn ${filtroStatus === STATUS_CONSULTA.AGENDADA ? 'active' : ''}`}
            onClick={() => setFiltroStatus(STATUS_CONSULTA.AGENDADA)}
          >
            Agendadas
          </button>
          <button 
            className={`filtro-btn ${filtroStatus === STATUS_CONSULTA.REALIZADA ? 'active' : ''}`}
            onClick={() => setFiltroStatus(STATUS_CONSULTA.REALIZADA)}
          >
            Realizadas
          </button>
          <button 
            className={`filtro-btn ${filtroStatus === STATUS_CONSULTA.CANCELADA ? 'active' : ''}`}
            onClick={() => setFiltroStatus(STATUS_CONSULTA.CANCELADA)}
          >
            Canceladas
          </button>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {loading ? (
          <div className="loading">Carregando consultas...</div>
        ) : consultasFiltradas.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma consulta encontrada.</p>
          </div>
        ) : (
          <div className="consultas-list">
            {consultasFiltradas.map((consulta) => (
              <div key={consulta.id} className="consulta-card">
                <div className="consulta-header">
                  <span className={`consulta-status ${getStatusClass(consulta.status)}`}>
                    {STATUS_LABELS[consulta.status] || consulta.status}
                  </span>
                  <button 
                    className="expand-btn"
                    onClick={() => setExpandedId(expandedId === consulta.id ? null : consulta.id)}
                  >
                    {expandedId === consulta.id ? 'Menos' : 'Detalhes'}
                  </button>
                </div>
                
                <div className="consulta-info">
                  <div className="info-row">
                    <span className="info-label">Paciente:</span>
                    <span className="info-value">{consulta.colaborador?.nome || 'Nao informado'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Data:</span>
                    <span className="info-value">{formatarData(consulta.dataHora)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Horario:</span>
                    <span className="info-value">{formatarHora(consulta.dataHora)}</span>
                  </div>
                </div>

                {expandedId === consulta.id && consulta.colaborador && (
                  <div className="paciente-details">
                    <h4>Dados do Paciente</h4>
                    {consulta.colaborador.email && (
                      <div className="info-row">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{consulta.colaborador.email}</span>
                      </div>
                    )}
                    {consulta.colaborador.departamento && (
                      <div className="info-row">
                        <span className="info-label">Departamento:</span>
                        <span className="info-value">{consulta.colaborador.departamento}</span>
                      </div>
                    )}
                    {consulta.colaborador.cargo && (
                      <div className="info-row">
                        <span className="info-label">Cargo:</span>
                        <span className="info-value">{consulta.colaborador.cargo}</span>
                      </div>
                    )}
                  </div>
                )}

                {consulta.status === STATUS_CONSULTA.AGENDADA && (
                  <div className="consulta-actions">
                    <button
                      className="action-btn-realizada"
                      onClick={() => handleMarcarRealizada(consulta.id)}
                      disabled={atualizando === consulta.id}
                    >
                      {atualizando === consulta.id ? 'Atualizando...' : 'Marcar Realizada'}
                    </button>
                    <button
                      className="action-btn-cancelar"
                      onClick={() => handleCancelar(consulta.id)}
                      disabled={atualizando === consulta.id}
                    >
                      Cancelar
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

export default PsychologistConsultationsPage;

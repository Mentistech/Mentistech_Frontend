import React, { useState, useEffect } from 'react';
import PsychologistHeader from '../../components/PsychologistHeader/PsychologistHeader';
import { 
  buscarDisponibilidade, 
  criarDisponibilidade, 
  removerDisponibilidade,
  DIA_SEMANA,
  DIA_SEMANA_LABELS
} from '../../services/psicologo.service';
import { getMe } from '../../services/api';
import './AvailabilityPage.css';

const HORARIOS = [];
for (let h = 7; h <= 20; h++) {
  HORARIOS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < 20) {
    HORARIOS.push(`${String(h).padStart(2, '0')}:30`);
  }
}

function AvailabilityPage({ onNavigate }) {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [diaSemana, setDiaSemana] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError('');
      const user = await getMe();
      const psicologoId = user.perfilPsicologo?.id;
      setUserId(psicologoId);
      const data = await buscarDisponibilidade(psicologoId);
      setDisponibilidades(data);
    } catch (err) {
      setError('Erro ao carregar disponibilidade.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!diaSemana || !horaInicio || !horaFim) {
      setError('Preencha todos os campos.');
      return;
    }

    if (horaInicio >= horaFim) {
      setError('O horario de inicio deve ser anterior ao horario de fim.');
      return;
    }

    try {
      setSalvando(true);
      setError('');
      await criarDisponibilidade({
        diaSemana,
        horaInicio,
        horaFim
      });
      setSuccessMessage('Disponibilidade adicionada com sucesso.');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowForm(false);
      setDiaSemana('');
      setHoraInicio('');
      setHoraFim('');
      carregarDados();
    } catch (err) {
      setError('Erro ao salvar disponibilidade.');
    } finally {
      setSalvando(false);
    }
  };

  const handleRemover = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover esta disponibilidade?')) {
      return;
    }

    try {
      setRemovendo(id);
      setError('');
      await removerDisponibilidade(id);
      setSuccessMessage('Disponibilidade removida com sucesso.');
      setTimeout(() => setSuccessMessage(''), 3000);
      carregarDados();
    } catch (err) {
      setError('Erro ao remover disponibilidade.');
    } finally {
      setRemovendo(null);
    }
  };

  const agruparPorDia = () => {
    const agrupado = {};
    Object.keys(DIA_SEMANA).forEach(dia => {
      agrupado[dia] = disponibilidades.filter(d => d.diaSemana === dia);
    });
    return agrupado;
  };

  const disponibilidadesAgrupadas = agruparPorDia();

  return (
    <div className="availability-page">
      <PsychologistHeader currentPage="availability" onNavigate={onNavigate} />
      
      <main className="availability-content">
        <div className="page-header">
          <h1 className="page-title">Gerenciar Disponibilidade</h1>
          <button 
            className="add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : '+ Adicionar Horario'}
          </button>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {showForm && (
          <form className="availability-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="diaSemana">Dia da Semana</label>
              <select
                id="diaSemana"
                value={diaSemana}
                onChange={(e) => setDiaSemana(e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                {Object.entries(DIA_SEMANA_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="horaInicio">Horario Inicio</label>
                <select
                  id="horaInicio"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  required
                >
                  <option value="">Selecione...</option>
                  {HORARIOS.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="horaFim">Horario Fim</label>
                <select
                  id="horaFim"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                  required
                >
                  <option value="">Selecione...</option>
                  {HORARIOS.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Salvar Disponibilidade'}
            </button>
          </form>
        )}

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="schedule-grid">
            {Object.entries(disponibilidadesAgrupadas).map(([dia, horarios]) => (
              <div key={dia} className="day-column">
                <div className="day-header">
                  {DIA_SEMANA_LABELS[dia]}
                </div>
                <div className="day-slots">
                  {horarios.length === 0 ? (
                    <div className="empty-slot">Sem horarios</div>
                  ) : (
                    horarios.map((slot) => (
                      <div key={slot.id} className="time-slot">
                        <span className="slot-time">
                          {slot.horaInicio} - {slot.horaFim}
                        </span>
                        <button
                          className="remove-slot-btn"
                          onClick={() => handleRemover(slot.id)}
                          disabled={removendo === slot.id}
                          title="Remover"
                        >
                          {removendo === slot.id ? '...' : 'x'}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AvailabilityPage;

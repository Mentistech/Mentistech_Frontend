import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { listPsicologos, getPsicologoDisponibilidade, agendarConsulta } from '../../services/api';
import './SchedulePage.css';

const JS_DAY_TO_ENUM = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];

function gerarHorarios(horaInicio, horaFim) {
  const slots = [];
  let [h] = horaInicio.split(':').map(Number);
  const [hFim] = horaFim.split(':').map(Number);
  while (h < hFim) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    h++;
  }
  return slots;
}

function SchedulePage({ onBack, onNavigate, analiseId }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [psicologos, setPsicologos] = useState([]);
  const [selectedPsicologo, setSelectedPsicologo] = useState('');
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  useEffect(() => {
    listPsicologos()
      .then(setPsicologos)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!selectedPsicologo) { setDisponibilidades([]); return; }
    getPsicologoDisponibilidade(selectedPsicologo)
      .then(setDisponibilidades)
      .catch((err) => setError(err.message));
  }, [selectedPsicologo]);

  useEffect(() => {
    if (!selectedDate || !selectedPsicologo) { setHorariosDisponiveis([]); setSelectedTime(''); return; }
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate);
    const diaSemana = JS_DAY_TO_ENUM[date.getDay()];
    const slots = disponibilidades
      .filter((d) => d.diaSemana === diaSemana)
      .flatMap((d) => gerarHorarios(d.horaInicio, d.horaFim));
    setHorariosDisponiveis(slots);
    setSelectedTime('');
  }, [selectedDate, disponibilidades, currentMonth, selectedPsicologo]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Dias do mês anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
    }

    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    // Dias do próximo mês
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }

    return days;
  };

  const formatMonth = (date) => {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${meses[date.getMonth()]} ${date.getFullYear()}`;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day, isCurrentMonth) => {
    if (isCurrentMonth) {
      setSelectedDate(day);
    }
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !selectedPsicologo) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate);
      const [hh, mm] = selectedTime.split(':');
      date.setHours(Number(hh), Number(mm), 0, 0);
      const payload = { psicologoId: selectedPsicologo, dataHora: date.toISOString() };
      if (analiseId) payload.analiseId = analiseId;
      await agendarConsulta(payload);
      setSuccess(`Consulta agendada para ${selectedDate} de ${formatMonth(currentMonth)} às ${selectedTime}!`);
      setSelectedDate(null);
      setSelectedTime('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="schedule-page">
      <Header currentPage="checkin" onNavigate={onNavigate} />

      <main className="schedule-content">
        <div className="schedule-container">

          <div className="psicologo-select-wrapper">
            <select
              className="time-select"
              value={selectedPsicologo}
              onChange={(e) => setSelectedPsicologo(e.target.value)}
            >
              <option value="">Selecionar psicólogo</option>
              {psicologos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.usuario?.nome || p.id}{p.especialidade ? ` — ${p.especialidade}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="calendar">
            <div className="calendar-header">
              <button className="nav-btn" onClick={prevMonth}>&lt;</button>
              <span className="month-year">{formatMonth(currentMonth)}</span>
              <button className="nav-btn" onClick={nextMonth}>&gt;</button>
            </div>

            <div className="calendar-weekdays">
              {diasSemana.map((dia, index) => (
                <span key={index} className="weekday">{dia}</span>
              ))}
            </div>

            <div className="calendar-days">
              {days.map((item, index) => (
                <button
                  key={index}
                  className={`day ${!item.isCurrentMonth ? 'other-month' : ''} ${selectedDate === item.day && item.isCurrentMonth ? 'selected' : ''}`}
                  onClick={() => handleDateClick(item.day, item.isCurrentMonth)}
                  disabled={!item.isCurrentMonth}
                >
                  {item.day}
                </button>
              ))}
            </div>
          </div>

          <div className="time-select-wrapper">
            <select
              className="time-select"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={horariosDisponiveis.length === 0}
            >
              <option value="">
                {selectedDate && selectedPsicologo && horariosDisponiveis.length === 0
                  ? 'Sem horários disponíveis'
                  : 'Selecionar horário'}
              </option>
              {horariosDisponiveis.map((horario) => (
                <option key={horario} value={horario}>{horario}</option>
              ))}
            </select>
          </div>

          {error && <p className="schedule-error">{error}</p>}
          {success && <p className="schedule-success">{success}</p>}

          <button
            className="schedule-btn"
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime || !selectedPsicologo || loading}
          >
            {loading ? 'Agendando...' : 'Agendar consulta'}
          </button>
        </div>

        <button className="back-link" onClick={onBack}>
          Voltar à análise
        </button>
      </main>
    </div>
  );
}

export default SchedulePage;

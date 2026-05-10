import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import './SchedulePage.css';

function SchedulePage({ onBack, onNavigate }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const horarios = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

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

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      alert(`Consulta agendada para o dia ${selectedDate} de ${formatMonth(currentMonth)} às ${selectedTime}`);
    }
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="schedule-page">
      <Header currentPage="checkin" onNavigate={onNavigate} />
      
      <main className="schedule-content">

        <div className="schedule-container">
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
            >
              <option value="">Selecionar horário</option>
              {horarios.map((horario) => (
                <option key={horario} value={horario}>{horario}</option>
              ))}
            </select>
          </div>

          <button 
            className="schedule-btn"
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime}
          >
            Agendar consulta
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

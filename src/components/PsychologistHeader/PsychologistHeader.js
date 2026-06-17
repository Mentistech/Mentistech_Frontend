import React from 'react';
import './PsychologistHeader.css';

function PsychologistHeader({ currentPage, onNavigate }) {
  const handleNavClick = (e, page) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <header className="psy-header">
      <div className="psy-header-container">
        <div className="psy-header-logo">
          <span className="logo-text">Mentistech</span>
          <span className="logo-badge">Psicologo</span>
        </div>
        
        <nav className="psy-header-nav">
          <a 
            href="/" 
            className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'dashboard')}
          >
            Inicio
          </a>
          <a 
            href="/consultas" 
            className={`nav-link ${currentPage === 'consultations' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'psy-consultations')}
          >
            Consultas
          </a>
          <a 
            href="/disponibilidade" 
            className={`nav-link ${currentPage === 'availability' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'availability')}
          >
            Disponibilidade
          </a>
          <a 
            href="/conta" 
            className={`nav-link ${currentPage === 'account' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'account')}
          >
            Minha conta
          </a>
        </nav>
      </div>
    </header>
  );
}

export default PsychologistHeader;
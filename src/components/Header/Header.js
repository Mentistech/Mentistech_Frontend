import React from 'react';
import './Header.css';

function Header({ currentPage, onNavigate }) {
  const handleNavClick = (e, page) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <span className="logo-text">Mentistech</span>
        </div>
        
        <nav className="header-nav">
          <a 
            href="/" 
            className={`nav-link ${currentPage === 'checkin' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'checkin')}
          >
            Início
          </a>
          <a 
            href="/conta" 
            className={`nav-link ${currentPage === 'account' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'account')}
          >
            Minha conta
          </a>
          <a 
            href="/consultas" 
            className={`nav-link ${currentPage === 'consultations' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'consultations')}
          >
            Minhas consultas
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;

import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <span className="logo-text">Mentistech</span>
        </div>
        
        <nav className="header-nav">
          <a href="/" className="nav-link">Início</a>
          <a href="/conta" className="nav-link">Minha conta</a>
          <a href="/consultas" className="nav-link">Minhas consultas</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;

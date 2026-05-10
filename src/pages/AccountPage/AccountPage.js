import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import './AccountPage.css';

function AccountPage({ onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: 'João Silva',
    birthDate: '1990-05-15',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    emergencyContact: 'Maria Silva',
    emergencyPhone: '(11) 91234-5678',
    gender: 'Masculino',
    cpf: '123.456.789-00'
  });

  const handleChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Aqui você pode adicionar lógica para salvar os dados
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="account-page">
      <Header currentPage="account" onNavigate={onNavigate} />

      <main className="account-content">
        <h1 className="greeting">Minha Conta</h1>

        <div className="account-card">
          <div className="card-header">
            <h2>Dados Pessoais</h2>
            {!isEditing ? (
              <button className="edit-button" onClick={() => setIsEditing(true)}>
                Editar
              </button>
            ) : (
              <button className="save-button" onClick={handleSave}>
                Salvar
              </button>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Nome completo</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                />
              ) : (
                <p>{userData.fullName}</p>
              )}
            </div>

            <div className="form-group">
              <label>Data de nascimento</label>
              {isEditing ? (
                <input
                  type="date"
                  value={userData.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                />
              ) : (
                <p>{formatDate(userData.birthDate)}</p>
              )}
            </div>

            <div className="form-group">
              <label>CPF</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.cpf}
                  onChange={(e) => handleChange('cpf', e.target.value)}
                />
              ) : (
                <p>{userData.cpf}</p>
              )}
            </div>

            <div className="form-group">
              <label>Gênero</label>
              {isEditing ? (
                <select
                  value={userData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                  <option value="Prefiro não informar">Prefiro não informar</option>
                </select>
              ) : (
                <p>{userData.gender}</p>
              )}
            </div>

            <div className="form-group">
              <label>E-mail</label>
              {isEditing ? (
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              ) : (
                <p>{userData.email}</p>
              )}
            </div>

            <div className="form-group">
              <label>Telefone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              ) : (
                <p>{userData.phone}</p>
              )}
            </div>
          </div>
        </div>

        <div className="account-card">
          <div className="card-header">
            <h2>Contato de Emergência</h2>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Nome do contato</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.emergencyContact}
                  onChange={(e) => handleChange('emergencyContact', e.target.value)}
                />
              ) : (
                <p>{userData.emergencyContact}</p>
              )}
            </div>

            <div className="form-group">
              <label>Telefone de emergência</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={userData.emergencyPhone}
                  onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                />
              ) : (
                <p>{userData.emergencyPhone}</p>
              )}
            </div>
          </div>
        </div>

        <button className="logout-button">
          Sair da conta
        </button>
      </main>
    </div>
  );
}

export default AccountPage;

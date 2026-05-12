import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { getMe, updateMe, getPerfilLocal, savePerfilLocal } from '../../services/api';
import './AccountPage.css';

function AccountPage({ onNavigate, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    birthDate: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    gender: '',
    cpf: '',
  });

  useEffect(() => {
    getMe()
      .then((data) => {
        setUserId(data.id);
        const local = getPerfilLocal(data.id);
        setUserData((prev) => ({
          ...prev,
          fullName: data.nome || '',
          email: data.email || '',
          birthDate: local.dataNascimento || '',
          gender: local.genero || '',
          cpf: local.cpf || '',
          phone: local.telefone || '',
        }));
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      await updateMe({ nome: userData.fullName });
      if (userId) {
        savePerfilLocal(userId, {
          dataNascimento: userData.birthDate,
          genero: userData.gender,
          cpf: userData.cpf,
          telefone: userData.phone,
        });
      }
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString + 'T00:00:00');
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
              <button className="save-button" onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            )}
          </div>

          {error && <p className="account-error">{error}</p>}

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

        <button className="logout-button" onClick={onLogout}>
          Sair da conta
        </button>
      </main>
    </div>
  );
}

export default AccountPage;

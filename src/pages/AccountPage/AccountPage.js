import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { getMe, atualizarPerfil, logout } from '../../services/auth.service';
import './AccountPage.css';

function AccountPage({ onNavigate, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    departamento: '',
    cargo: '',
  });

  useEffect(() => {
    getMe()
      .then((res) => {
        setUserData({
          nome: res.nome || '',
          email: res.email || '',
          departamento: res.perfilColaborador?.departamento || '',
          cargo: res.perfilColaborador?.cargo || '',
        });
      })
      .catch(() => setErro('Erro ao carregar dados do perfil'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setErro('');
    setSalvando(true);
    try {
      await atualizarPerfil({
        nome: userData.nome,
        departamento: userData.departamento || undefined,
        cargo: userData.cargo || undefined,
      });
      localStorage.setItem('nome', userData.nome);
      setIsEditing(false);
    } catch (err) {
      setErro(err.message || 'Erro ao salvar perfil');
    } finally {
      setSalvando(false);
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  if (loading) {
    return (
      <div className="account-page">
        <Header currentPage="account" onNavigate={onNavigate} />
        <main className="account-content">
          <p>Carregando...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="account-page">
      <Header currentPage="account" onNavigate={onNavigate} />

      <main className="account-content">
        <h1 className="greeting">Minha Conta</h1>

        {erro && (
          <p style={{ color: '#c53030', fontSize: '14px', marginBottom: '16px' }}>{erro}</p>
        )}

        <div className="account-card">
          <div className="card-header">
            <h2>Dados Pessoais</h2>
            {!isEditing ? (
              <button className="edit-button" onClick={() => setIsEditing(true)}>
                Editar
              </button>
            ) : (
              <button className="save-button" onClick={handleSave} disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Nome completo</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                />
              ) : (
                <p>{userData.nome}</p>
              )}
            </div>

            <div className="form-group">
              <label>E-mail</label>
              <p>{userData.email}</p>
            </div>

            <div className="form-group">
              <label>Departamento</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.departamento}
                  onChange={(e) => handleChange('departamento', e.target.value)}
                />
              ) : (
                <p>{userData.departamento || '—'}</p>
              )}
            </div>

            <div className="form-group">
              <label>Cargo</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.cargo}
                  onChange={(e) => handleChange('cargo', e.target.value)}
                />
              ) : (
                <p>{userData.cargo || '—'}</p>
              )}
            </div>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Sair da conta
        </button>
      </main>
    </div>
  );
}

export default AccountPage;

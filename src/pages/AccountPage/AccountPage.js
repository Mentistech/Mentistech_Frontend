import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { getMe, updateMe, getPerfilLocal, savePerfilLocal } from '../../services/api';
import './AccountPage.css';

function AccountPage({ onNavigate, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const papel = localStorage.getItem('papel');
  const [userData, setUserData] = useState({
    nome: '', email: '',
    departamento: '', cargo: '',
    crp: '', especialidade: '',
    birthDate: '', phone: '', gender: '', cpf: '',
  });

  useEffect(() => {
    getMe()
      .then((data) => {
        setUserId(data.id);
        const local = getPerfilLocal(data.id);
        setUserData({
          nome: data.nome || '',
          email: data.email || '',
          departamento: data.perfilColaborador?.departamento || '',
          cargo: data.perfilColaborador?.cargo || '',
          crp: data.perfilPsicologo?.crp || '',
          especialidade: data.perfilPsicologo?.especialidade || '',
          birthDate: local.dataNascimento || '',
          phone: local.telefone || '',
          gender: local.genero || '',
          cpf: local.cpf || '',
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const payload = { nome: userData.nome };
      if (papel === 'COLABORADOR') {
        payload.departamento = userData.departamento || undefined;
        payload.cargo = userData.cargo || undefined;
      }
      if (papel === 'PSICOLOGO') {
        payload.crp = userData.crp || undefined;
        payload.especialidade = userData.especialidade || undefined;
      }
      await updateMe(payload);
      if (userId) {
        savePerfilLocal(userId, {
          dataNascimento: userData.birthDate,
          genero: userData.gender,
          cpf: userData.cpf,
          telefone: userData.phone,
        });
      }
      localStorage.setItem('nome', userData.nome);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
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
                <input type="text" value={userData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)} />
              ) : (
                <p>{userData.nome}</p>
              )}
            </div>

            <div className="form-group">
              <label>E-mail</label>
              <p>{userData.email}</p>
            </div>

            {papel === 'COLABORADOR' && (
              <>
                <div className="form-group">
                  <label>Departamento</label>
                  {isEditing ? (
                    <input type="text" value={userData.departamento}
                      onChange={(e) => handleChange('departamento', e.target.value)} />
                  ) : (
                    <p>{userData.departamento || '—'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Cargo</label>
                  {isEditing ? (
                    <input type="text" value={userData.cargo}
                      onChange={(e) => handleChange('cargo', e.target.value)} />
                  ) : (
                    <p>{userData.cargo || '—'}</p>
                  )}
                </div>
              </>
            )}

            {papel === 'PSICOLOGO' && (
              <>
                <div className="form-group">
                  <label>CRP</label>
                  {isEditing ? (
                    <input type="text" value={userData.crp}
                      onChange={(e) => handleChange('crp', e.target.value)} />
                  ) : (
                    <p>{userData.crp || '—'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Especialidade</label>
                  {isEditing ? (
                    <input type="text" value={userData.especialidade}
                      onChange={(e) => handleChange('especialidade', e.target.value)} />
                  ) : (
                    <p>{userData.especialidade || '—'}</p>
                  )}
                </div>
              </>
            )}
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

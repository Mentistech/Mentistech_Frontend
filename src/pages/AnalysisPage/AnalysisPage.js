import React from 'react';
import Header from '../../components/Header/Header';
import './AnalysisPage.css';

function AnalysisPage({ data, onBack, onSchedule }) {
  const analysisText = `
    Com base no seu check-in de hoje, percebo que você está se sentindo em um nível moderado de bem-estar. 
    O seu nível de estresse atual de ${data?.stressLevel || 50}% indica que você pode estar enfrentando 
    alguns desafios no momento.
    
    É importante lembrar que sentir estresse é uma resposta natural do corpo. Recomendo que você 
    tire alguns minutos para praticar exercícios de respiração profunda ou uma breve caminhada.
    
    Se você sentir que precisa de mais suporte, considere agendar uma consulta com um profissional 
    de saúde mental. Estamos aqui para ajudar no seu caminho de bem-estar.
  `;

  return (
    <div className="analysis-page">
      <Header />
      
      <main className="analysis-content">
        <div className="analysis-card">
          <h1 className="greeting">Olá, João!</h1>
          
          <h2 className="analysis-title">Análise de hoje pela IA</h2>
          
          <div className="analysis-text">
            <p>{analysisText}</p>
          </div>
          
          <button className="schedule-button" onClick={onSchedule}>
            Agendar consulta
          </button>
          
          {onBack && (
            <button className="back-link" onClick={onBack}>
              Voltar ao check-in
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default AnalysisPage;

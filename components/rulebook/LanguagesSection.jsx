import React, { useState } from 'react';

export default function LanguagesSection({ languages }) {
  const [expandedLanguage, setExpandedLanguage] = useState(null);

  const toggleLanguage = (languageId) => {
    setExpandedLanguage(expandedLanguage === languageId ? null : languageId);
  };

  return (
    <div className="rulebook-section languages-section">
      <h2>Languages</h2>
      <p>The various tongues spoken throughout the realms, essential for communication and diplomacy.</p>
      
      {languages.map(language => (
        <div className="language-card" key={language.id}>
          <div 
            className="language-header" 
            onClick={() => toggleLanguage(language.id)}
          >
            <h3>{language.name}</h3>
            <span className="toggle-icon">
              {expandedLanguage === language.id ? '−' : '+'}
            </span>
          </div>

          {expandedLanguage === language.id && (
            <div className="language-details">
              <p className="description">{language.description}</p>
              
              <div className="language-detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Script:</span> 
                  <span className="detail-value">{language.script}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Typical Speakers:</span> 
                  <span className="detail-value">{language.speakingRaces.join(', ')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Commonality:</span> 
                  <span className="detail-value">{language.commonality.charAt(0).toUpperCase() + language.commonality.slice(1)}</span>
                </div>
              </div>
              
              {language.example && (
                <>
                  <h4>Example Phrases</h4>
                  <p className="language-examples">{language.example}</p>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
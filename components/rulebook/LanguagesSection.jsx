import React from 'react';

export default function LanguagesSection({ languages }) {
  return (
    <div className="rulebook-section languages-section">
      <h2>Languages</h2>
      <p>Languages allow your character to communicate with the diverse peoples of the realm.</p>
      
      {languages.map(language => (
        <div className="language-card" key={language.id}>
          <h3>{language.name}</h3>
          <p className="description">{language.description}</p>
          
          <div className="language-details">
            <div className="detail-item">
              <span className="detail-label">Script:</span> 
              <span className="detail-value">{language.script}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Commonality:</span> 
              <span className="detail-value">{language.commonality.charAt(0).toUpperCase() + language.commonality.slice(1)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Speaking Races:</span> 
              <span className="detail-value">{language.speakingRaces.join(', ')}</span>
            </div>
          </div>
          
          {language.example && (
            <div className="language-examples">
              <h4>Example Phrases</h4>
              <p>{language.example}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
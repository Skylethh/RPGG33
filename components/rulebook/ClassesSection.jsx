import React, { useState } from 'react';

export default function ClassesSection({ classes }) {
  const [expandedClass, setExpandedClass] = useState(null);

  const toggleClass = (classId) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  return (
    <div className="rulebook-section classes-section">
      <h2>Classes</h2>
      <p>Choose your character's vocation, defining their skills and abilities.</p>
      
      {classes.map(characterClass => (
        <div className="class-card" key={characterClass.id}>
          <div 
            className="class-header" 
            onClick={() => toggleClass(characterClass.id)}
          >
            <h3>{characterClass.name}</h3>
            <span className="toggle-icon">
              {expandedClass === characterClass.id ? '−' : '+'}
            </span>
          </div>

          {expandedClass === characterClass.id && (
            <div className="class-details">
              <p className="description">{characterClass.description}</p>
              
              <div className="class-detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Hit Die:</span> 
                  <span className="detail-value">{characterClass.hitDie}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Primary Ability:</span> 
                  <span className="detail-value">{characterClass.primaryAbility.charAt(0).toUpperCase() + characterClass.primaryAbility.slice(1)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Saving Throws:</span> 
                  <span className="detail-value">
                    {characterClass.savingThrows.map(save => save.charAt(0).toUpperCase() + save.slice(1)).join(', ')}
                  </span>
                </div>
              </div>
              
              <h4>Starting Skills</h4>
              <p>Choose {characterClass.skillChoices.count} from: {characterClass.skillChoices.choices.map(skill => skill.charAt(0).toUpperCase() + skill.slice(1)).join(', ')}.</p>
              
              <h4>Features</h4>
              <ul className="features-list">
                {characterClass.features.map(feature => (
                  <li key={feature.name}>
                    <strong>{feature.name}</strong> (Level {feature.level}): {feature.description}
                  </li>
                ))}
              </ul>
              
              <h4>Starting Equipment</h4>
              <ul className="equipment-list">
                {characterClass.equipment.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              
              {characterClass.spellcasting && (
                <div className="spellcasting">
                  <h4>Spellcasting</h4>
                  <p>Spellcasting Ability: {characterClass.spellcasting.ability.charAt(0).toUpperCase() + characterClass.spellcasting.ability.slice(1)}</p>
                  <p>Cantrips Known: {characterClass.spellcasting.cantripsKnown}</p>
                  <p>Preparation: {characterClass.spellcasting.prepared ? 'Prepare spells daily' : 'Spells are known permanently'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
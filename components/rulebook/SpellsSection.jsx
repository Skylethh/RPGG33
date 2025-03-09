import React, { useState } from 'react';

export default function SpellsSection({ spells }) {
  const [filter, setFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  
  const filteredByClass = filter === 'all' 
    ? spells 
    : spells.filter(spell => spell.classes.includes(filter));
    
  const filteredSpells = levelFilter === 'all' 
    ? filteredByClass 
    : filteredByClass.filter(spell => spell.level.toString() === levelFilter);
  
  // Get unique class list from all spells
  const spellClasses = ['all', ...new Set(spells.flatMap(spell => spell.classes))];
  
  // Get unique levels from 0 (cantrips) to 9
  const spellLevels = ['all', ...new Set(spells.map(spell => spell.level.toString()))];
  spellLevels.sort((a, b) => {
    if (a === 'all') return -1;
    if (b === 'all') return 1;
    return parseInt(a) - parseInt(b);
  });
  
  return (
    <div className="rulebook-section spells-section">
      <h2>Spells</h2>
      <p>Master the arcane and divine magics to wield incredible powers.</p>
      
      <div className="spell-filters">
        <div className="filter-group">
          <label>Class:</label>
          <div className="button-group">
            {spellClasses.map(className => (
              <button 
                key={className} 
                className={`filter-button ${filter === className ? 'active' : ''}`}
                onClick={() => setFilter(className)}
              >
                {className === 'all' ? 'All Classes' : className}
              </button>
            ))}
          </div>
        </div>
        
        <div className="filter-group">
          <label>Level:</label>
          <div className="button-group">
            {spellLevels.map(level => (
              <button 
                key={level} 
                className={`filter-button ${levelFilter === level ? 'active' : ''}`}
                onClick={() => setLevelFilter(level)}
              >
                {level === 'all' ? 'All Levels' : level === '0' ? 'Cantrip' : `Level ${level}`}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="spells-list">
        {filteredSpells.map(spell => (
          <div className="spell-card" key={spell.id}>
            <h3>{spell.name}</h3>
            <p className="spell-level">
              {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`} {spell.school}
              {spell.ritual && <span className="ritual-tag"> (Ritual)</span>}
            </p>
            
            <div className="spell-details">
              <div className="detail-item">
                <span className="detail-label">Casting Time:</span> 
                <span className="detail-value">{spell.castingTime}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Range:</span> 
                <span className="detail-value">{spell.range}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Components:</span> 
                <span className="detail-value">{spell.getComponentString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Duration:</span> 
                <span className="detail-value">
                  {spell.concentration && <span className="concentration-tag">Concentration, </span>}
                  {spell.duration}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Classes:</span> 
                <span className="detail-value">{spell.classes.join(', ')}</span>
              </div>
            </div>
            
            <p className="description">{spell.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
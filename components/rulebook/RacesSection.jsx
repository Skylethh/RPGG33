import React, { useState } from 'react';

export default function RacesSection({ races }) {
  const [expandedRace, setExpandedRace] = useState(null);

  const toggleRace = (raceId) => {
    setExpandedRace(expandedRace === raceId ? null : raceId);
  };

  return (
    <div className="rulebook-section races-section">
      <h2>Races</h2>
      <p>Choose from these diverse peoples to define your character's identity.</p>
      
      {races.map(race => (
        <div className="race-card" key={race.id}>
          <div 
            className="race-header" 
            onClick={() => toggleRace(race.id)}
          >
            <h3>{race.name}</h3>
            <span className="toggle-icon">
              {expandedRace === race.id ? '−' : '+'}
            </span>
          </div>

          {expandedRace === race.id && (
            <div className="race-details">
              <p className="description">{race.description}</p>
              
              <h4>Ability Score Increases</h4>
              <ul className="stat-bonuses">
                {Object.entries(race.statBonuses).map(([stat, bonus]) => (
                  <li key={stat}>
                    {stat.charAt(0).toUpperCase() + stat.slice(1)}: +{bonus}
                  </li>
                ))}
              </ul>
              
              <h4>Traits</h4>
              <ul className="traits-list">
                {race.traits.map(trait => (
                  <li key={trait}>{trait}</li>
                ))}
              </ul>
              
              <h4>Racial Abilities</h4>
              <ul className="abilities-list">
                {race.abilities.map(ability => (
                  <li key={ability.name}>
                    <strong>{ability.name}:</strong> {ability.description}
                  </li>
                ))}
              </ul>
              
              <h4>Lore</h4>
              <p className="lore">{race.lore}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
import React, { useState } from 'react';
import { initializeRuleBook } from '../../data/sampleRuleData';

export default function CharacterCreator() {
  const rulebook = initializeRuleBook();
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState({
    name: '',
    race: '',
    class: '',
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    skills: [],
    languages: [],
    equipment: []
  });

  const updateCharacter = (field, value) => {
    setCharacter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAbility = (ability, value) => {
    setCharacter(prev => ({
      ...prev,
      abilities: {
        ...prev.abilities,
        [ability]: value
      }
    }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="creator-step">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label htmlFor="characterName">Character Name</label>
              <input 
                type="text" 
                id="characterName" 
                value={character.name} 
                onChange={(e) => updateCharacter('name', e.target.value)}
                placeholder="Enter your character's name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="characterRace">Race</label>
              <select 
                id="characterRace" 
                value={character.race} 
                onChange={(e) => updateCharacter('race', e.target.value)}
              >
                <option value="">Select a race</option>
                {rulebook.races.map(race => (
                  <option key={race.id} value={race.id}>{race.name}</option>
                ))}
              </select>
            </div>
            
            {character.race && (
              <div className="selected-race-info">
                <h3>Race Information</h3>
                <p>{rulebook.getRaceByName(character.race)?.description}</p>
                <h4>Ability Bonuses</h4>
                <ul>
                  {Object.entries(rulebook.getRaceByName(character.race)?.statBonuses || {}).map(([stat, bonus]) => (
                    <li key={stat}>
                      {stat.charAt(0).toUpperCase() + stat.slice(1)}: +{bonus}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="form-actions">
              <button className="btn primary-btn" onClick={nextStep} disabled={!character.name || !character.race}>
                Next: Choose Class
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="creator-step">
            <h2>Choose Your Class</h2>
            
            <div className="form-group">
              <label htmlFor="characterClass">Class</label>
              <select 
                id="characterClass" 
                value={character.class} 
                onChange={(e) => updateCharacter('class', e.target.value)}
              >
                <option value="">Select a class</option>
                {rulebook.classes.map(characterClass => (
                  <option key={characterClass.id} value={characterClass.id}>{characterClass.name}</option>
                ))}
              </select>
            </div>
            
            {character.class && (
              <div className="selected-class-info">
                <h3>Class Information</h3>
                <p>{rulebook.getClassByName(character.class)?.description}</p>
                <h4>Primary Ability</h4>
                <p>{rulebook.getClassByName(character.class)?.primaryAbility.charAt(0).toUpperCase() + rulebook.getClassByName(character.class)?.primaryAbility.slice(1)}</p>
                <h4>Hit Die</h4>
                <p>{rulebook.getClassByName(character.class)?.hitDie}</p>
              </div>
            )}
            
            <div className="form-actions">
              <button className="btn secondary-btn" onClick={prevStep}>
                Back
              </button>
              <button className="btn primary-btn" onClick={nextStep} disabled={!character.class}>
                Next: Ability Scores
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="creator-step">
            <h2>Set Ability Scores</h2>
            <p>Distribute your points among the six abilities.</p>
            
            <div className="abilities-grid">
              {Object.entries(character.abilities).map(([ability, score]) => (
                <div key={ability} className="ability-item">
                  <label htmlFor={ability}>{ability.charAt(0).toUpperCase() + ability.slice(1)}</label>
                  <div className="ability-controls">
                    <button 
                      onClick={() => updateAbility(ability, Math.max(8, score - 1))}
                      disabled={score <= 8}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      id={ability} 
                      value={score} 
                      readOnly 
                    />
                    <button 
                      onClick={() => updateAbility(ability, Math.min(18, score + 1))}
                      disabled={score >= 18}
                    >
                      +
                    </button>
                  </div>
                  <div className="ability-modifier">
                    Modifier: {Math.floor((score - 10) / 2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="form-actions">
              <button className="btn secondary-btn" onClick={prevStep}>
                Back
              </button>
              <button className="btn primary-btn" onClick={nextStep}>
                Next: Skills & Languages
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="creator-step">
            <h2>Skills & Languages</h2>
            <p>Select skills and languages for your character.</p>
            
            <div className="character-summary">
              <h3>Your Character</h3>
              <p><strong>{character.name}</strong> - {rulebook.getRaceByName(character.race)?.name} {rulebook.getClassByName(character.class)?.name}</p>
              
              <h4>Ability Scores</h4>
              <div className="abilities-summary">
                {Object.entries(character.abilities).map(([ability, score]) => (
                  <div key={ability} className="ability-summary-item">
                    <span className="ability-name">{ability.substr(0, 3).toUpperCase()}</span>
                    <span className="ability-score">{score}</span>
                    <span className="ability-mod">{Math.floor((score - 10) / 2) >= 0 ? '+' : ''}{Math.floor((score - 10) / 2)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-actions">
              <button className="btn secondary-btn" onClick={prevStep}>
                Back
              </button>
              <button className="btn primary-btn" onClick={nextStep}>
                Finish
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="creator-step">
            <h2>Character Complete!</h2>
            <div className="character-sheet">
              <h3>{character.name}</h3>
              <p className="character-type">{rulebook.getRaceByName(character.race)?.name} {rulebook.getClassByName(character.class)?.name}</p>
              
              <div className="character-abilities">
                <h4>Abilities</h4>
                <div className="abilities-grid">
                  {Object.entries(character.abilities).map(([ability, score]) => (
                    <div key={ability} className="ability-summary-item">
                      <span className="ability-name">{ability.substr(0, 3).toUpperCase()}</span>
                      <span className="ability-score">{score}</span>
                      <span className="ability-mod">{Math.floor((score - 10) / 2) >= 0 ? '+' : ''}{Math.floor((score - 10) / 2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="character-details">
                <div className="detail-column">
                  <h4>Race Features</h4>
                  <ul>
                    {rulebook.getRaceByName(character.race)?.traits.map(trait => (
                      <li key={trait}>{trait}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="detail-column">
                  <h4>Class Features</h4>
                  <ul>
                    {rulebook.getClassByName(character.class)?.features
                      .filter(feature => feature.level === 1)
                      .map(feature => (
                        <li key={feature.name}>{feature.name}</li>
                      ))}
                  </ul>
                </div>
              </div>
              
              <div className="character-actions">
                <button className="btn primary-btn">Save Character</button>
                <button className="btn secondary-btn" onClick={() => setStep(1)}>Create Another Character</button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="character-creator">
      <div className="creator-header">
        <h1>Create Your Character</h1>
        <div className="steps-progress">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Basics</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Class</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Abilities</div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>4. Skills</div>
          <div className={`step ${step >= 5 ? 'active' : ''}`}>5. Complete</div>
        </div>
      </div>
      
      <div className="creator-content">
        {renderStep()}
      </div>
    </div>
  );
}
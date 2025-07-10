import { useState, useEffect } from 'react';
import styles from '../styles/CharacterCreation.module.css';

const SpellSelection = ({ character, rulebook, updateCharacter }) => {
  const [selectedCantrips, setSelectedCantrips] = useState([]);
  const [selectedSpells, setSelectedSpells] = useState([]);
  const [maxCantrips, setMaxCantrips] = useState(0);
  const [maxSpells, setMaxSpells] = useState(0);
  
  // Get spells available for the character's class
  const classData = rulebook.classes.find(c => c.id === character.class);
  const capitalizedClassName = classData?.name || '';
  
  // Filter spells by class and level (case insensitive class name comparison)
  const availableCantrips = rulebook.spells
    .filter(spell => spell.level === 0 && 
      spell.classes.some(c => c.toLowerCase() === capitalizedClassName.toLowerCase()));
  
  const availableLevel1Spells = rulebook.spells
    .filter(spell => spell.level === 1 && 
      spell.classes.some(c => c.toLowerCase() === capitalizedClassName.toLowerCase()));

  // Get existing selections from character data
  useEffect(() => {
    // Set spell limits based on class
    if (character.class === 'wizard') {
      setMaxCantrips(3);
      setMaxSpells(2);
    } else if (character.class === 'druid') {
      setMaxCantrips(2);
      setMaxSpells(1);
    } else if (character.class === 'bard') {
      setMaxCantrips(2);
      setMaxSpells(4);
    } else if (character.class === 'paladin') {
      setMaxCantrips(0);
      setMaxSpells(1);
    }
    
    // Use existing selections if available, otherwise select reasonable defaults
    if (character.cantrips?.length) {
      setSelectedCantrips(character.cantrips);
    } else {
      // Select first available cantrips up to class limit
      const defaultCantrips = availableCantrips.slice(0, maxCantrips).map(spell => spell.id);
      setSelectedCantrips(defaultCantrips);
    }
    
    if (character.spells?.length) {
      setSelectedSpells(character.spells);
    } else {
      // For simplicity, don't auto-select level 1 spells as they require more thought
      setSelectedSpells([]);
    }
  }, [character.class, maxCantrips, availableCantrips.length]);
  
  // Update character when selected spells change
  useEffect(() => {
    // Don't update character until component is fully initialized
    if (selectedCantrips.length > 0 || selectedSpells.length > 0) {
      updateCharacter('cantrips', selectedCantrips);
      updateCharacter('spells', selectedSpells);
    }
  }, [selectedCantrips, selectedSpells]);

  const toggleCantrip = (spellId) => {
    if (selectedCantrips.includes(spellId)) {
      setSelectedCantrips(prev => prev.filter(id => id !== spellId));
    } else {
      if (selectedCantrips.length >= maxCantrips) {
        return; // Max cantrips reached
      }
      setSelectedCantrips(prev => [...prev, spellId]);
    }
  };

  const toggleSpell = (spellId) => {
    if (selectedSpells.includes(spellId)) {
      setSelectedSpells(prev => prev.filter(id => id !== spellId));
    } else {
      if (selectedSpells.length >= maxSpells) {
        return; // Max spells reached
      }
      setSelectedSpells(prev => [...prev, spellId]);
    }
  };

  return (
    <div className={styles.creatorStep}>
      <h2>Choose Your Spells</h2>
      <p>As a {capitalizedClassName}, you have access to magical abilities. Select your spells wisely.</p>
      
      {availableCantrips.length > 0 && (
        <div className={styles.spellsSection}>
          <h3>Cantrips (Level 0)</h3>
          <p>You can select up to {maxCantrips} cantrips.</p>
          <div className={styles.spellSelectionSummary}>
            Selected: {selectedCantrips.length}/{maxCantrips}
          </div>
          
          <div className={styles.spellList}>
            {availableCantrips.map(spell => {
              const isSelected = selectedCantrips.includes(spell.id);
              
              return (
                <div 
                  key={spell.id} 
                  className={`${styles.spellCard} ${isSelected ? styles.selected : ''}`}
                  onClick={() => toggleCantrip(spell.id)}
                >
                  <div className={styles.spellHeader}>
                    <h4>{spell.name}</h4>
                  </div>
                  <div className={styles.spellDetails}>
                    <p>{spell.school}</p>
                    <p>Casting Time: {spell.castingTime}</p>
                    <p>Range: {spell.range}</p>
                  </div>
                  <p className={styles.spellDescription}>
                    {spell.description.length > 100 
                      ? `${spell.description.substring(0, 100)}...` 
                      : spell.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {availableLevel1Spells.length > 0 && (
        <div className={styles.spellsSection}>
          <h3>Level 1 Spells</h3>
          <p>You can select up to {maxSpells} level 1 spells.</p>
          <div className={styles.spellSelectionSummary}>
            Selected: {selectedSpells.length}/{maxSpells}
          </div>
          
          <div className={styles.spellList}>
            {availableLevel1Spells.map(spell => {
              const isSelected = selectedSpells.includes(spell.id);
              
              return (
                <div 
                  key={spell.id} 
                  className={`${styles.spellCard} ${isSelected ? styles.selected : ''}`}
                  onClick={() => toggleSpell(spell.id)}
                >
                  <div className={styles.spellHeader}>
                    <h4>{spell.name}</h4>
                    {spell.ritual && <span className={styles.ritualTag}>Ritual</span>}
                  </div>
                  <div className={styles.spellDetails}>
                    <p>{spell.school}</p>
                    <p>Casting Time: {spell.castingTime}</p>
                    <p>Range: {spell.range}</p>
                    {spell.concentration && <p className={styles.concentration}>Concentration</p>}
                  </div>
                  <p className={styles.spellDescription}>
                    {spell.description.length > 100 
                      ? `${spell.description.substring(0, 100)}...` 
                      : spell.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className={styles.formActions}>
        <button 
          type="button" 
          onClick={() => window.history.back()}
          className={styles.buttonSecondary}
        >
          Back
        </button>
        <button 
          type="button" 
          className={styles.buttonPrimary}
          onClick={() => document.getElementById('nextButton').click()}
        >
          Next: Review Character
        </button>
        <button id="nextButton" style={{display: 'none'}}></button>
      </div>
    </div>
  );
};

export default SpellSelection;
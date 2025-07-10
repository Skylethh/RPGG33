import React, { useState, useEffect } from 'react';
import styles from '../../styles/CharacterCreation.module.css';

export default function SpellSelection({ character, rulebook, updateCharacter, nextStep, prevStep }) {
  const [selectedCantrips, setSelectedCantrips] = useState([]);
  const [selectedSpells, setSelectedSpells] = useState([]);
  const [maxCantrips, setMaxCantrips] = useState(0);
  const [maxSpells, setMaxSpells] = useState(0);
  
  // Get class data
  const classData = rulebook.classes.find(c => c.id === character.class);
  
  // Filter spells by class and level - düzeltilmiş kısım burada
  const availableCantrips = rulebook.spells
    .filter(spell => spell.level === 0 && spell.classes.includes(character.class));
  
  const availableLevel1Spells = rulebook.spells
    .filter(spell => spell.level === 1 && spell.classes.includes(character.class));

  // Default cantrips per class
  const defaultCantrips = {
    'wizard': ['mage_hand', 'prestidigitation'],
    'druid': ['druidcraft', 'produce_flame'],
    'bard': ['vicious_mockery', 'minor_illusion'],
    'paladin': []
  };

  // Set spell limits based on class
  useEffect(() => {
    if (character.class === 'wizard') {
      setMaxCantrips(3); // Wizard starts with 3 cantrips
      setMaxSpells(2);  // Wizard prepares int mod + level spells, minimum 1
    } else if (character.class === 'druid') {
      setMaxCantrips(2); // Druids start with 2 cantrips
      setMaxSpells(1);  // Druids prepare wis mod + level spells, minimum 1
    } else if (character.class === 'bard') {
      setMaxCantrips(2); // Bards start with 2 cantrips
      setMaxSpells(4);  // Bards know 4 spells at level 1
    } else if (character.class === 'paladin') {
      setMaxCantrips(0); // Paladins don't get cantrips
      setMaxSpells(1);  // Paladins prepare cha mod + half level spells, minimum 1
    }
    
    // Initialize with default cantrips for class and any previously selected spells
    const classDefaultCantrips = defaultCantrips[character.class] || [];
    
    // Use existing selections if available, otherwise use defaults
    setSelectedCantrips(character.cantrips?.length ? character.cantrips : classDefaultCantrips);
    setSelectedSpells(character.spells || []);
    
  }, [character.class]);
  
  // Update character when selected spells change
  useEffect(() => {
    updateCharacter('cantrips', selectedCantrips);
    updateCharacter('spells', selectedSpells);
  }, [selectedCantrips, selectedSpells]);

  const toggleCantrip = (spellId) => {
    if (selectedCantrips.includes(spellId)) {
      setSelectedCantrips(prev => prev.filter(id => id !== spellId));
    } else {
      // Check if adding would exceed maximum, and this isn't a default cantrip
      if (selectedCantrips.length >= maxCantrips && 
          !defaultCantrips[character.class]?.includes(spellId)) {
        return;
      }
      setSelectedCantrips(prev => [...prev, spellId]);
    }
  };

  const toggleSpell = (spellId) => {
    if (selectedSpells.includes(spellId)) {
      setSelectedSpells(prev => prev.filter(id => id !== spellId));
    } else {
      if (selectedSpells.length >= maxSpells) {
        return;
      }
      setSelectedSpells(prev => [...prev, spellId]);
    }
  };

  const isDefaultCantrip = (spellId) => {
    return defaultCantrips[character.class]?.includes(spellId);
  };

  return (
    <div className={styles.creatorStep}>
      <h2>Choose Your Spells</h2>
      <p>As a {classData?.name}, you have access to magical abilities. Select your spells wisely.</p>
      
      {availableCantrips.length > 0 && (
        <div className={styles.spellsSection}>
          <h3>Cantrips (Level 0)</h3>
          <p>You can select up to {maxCantrips} cantrips. Default cantrips for your class are pre-selected.</p>
          
          <div className={styles.spellList}>
            {availableCantrips.map(spell => {
              const isSelected = selectedCantrips.includes(spell.id);
              const isDefault = isDefaultCantrip(spell.id);
              
              return (
                <div 
                  key={spell.id} 
                  className={`${styles.spellCard} ${isSelected ? styles.selected : ''} ${isDefault ? styles.defaultSpell : ''}`}
                  onClick={() => isDefault ? null : toggleCantrip(spell.id)}
                >
                  <div className={styles.spellHeader}>
                    <h4>{spell.name}</h4>
                    {isDefault && <span className={styles.defaultTag}>Class Cantrip</span>}
                  </div>
                  <div className={styles.spellDetails}>
                    <p>{spell.school}</p>
                    <p>Casting Time: {spell.castingTime}</p>
                    <p>Range: {spell.range}</p>
                  </div>
                  <p className={styles.spellDescription}>{spell.description.substring(0, 100)}...</p>
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
                  <p className={styles.spellDescription}>{spell.description.substring(0, 100)}...</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className={styles.formActions}>
        <button 
          type="button" 
          onClick={prevStep}
          className={styles.buttonSecondary}
        >
          Back
        </button>
        <button 
          type="button" 
          className={styles.buttonPrimary}
          onClick={nextStep}
          disabled={selectedSpells.length === 0}
        >
          Next: Review Character
        </button>
      </div>
    </div>
  );
}
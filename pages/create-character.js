import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/CharacterCreation.module.css';
import { initializeRuleBook } from '../data/sampleRuleData';

export default function CreateCharacter() {
  const router = useRouter();
  const rulebook = initializeRuleBook();
  const [step, setStep] = useState(1);

  const MAX_ABILITY_POINTS = 24;
  const [usedAbilityPoints, setUsedAbilityPoints] = useState(0);

  const [character, setCharacter] = useState({
    name: '',
    race: '',
    class: '',
    gender: '',
    abilities: {
      strength: 8,
      dexterity: 8,
      constitution: 8,
      intelligence: 8,
      wisdom: 8,
      charisma: 8
    },
    skills: [],
    languages: [],
    background: '',
    equipment: [],
    weapons: [],
    armor: null,
    cantrips: [], 
    spells: []
  });

  // Calculate if character is a spellcaster
  const isSpellcaster = () => {
    return ['bard', 'wizard', 'druid', 'paladin'].includes(character.class);
  };

  // Calculate total steps based on class
  const getTotalSteps = () => {
    return isSpellcaster() ? 6 : 5;
  };

  // Başlangıçta kullanılan puanları hesapla
  useEffect(() => {
    const initialPoints = Object.values(character.abilities).reduce(
      (total, value) => total + (value - 8),
      0
    );
    setUsedAbilityPoints(initialPoints);
  }, []);

  // Step labels for the progress indicator
  const steps = [
    { num: 1, label: 'Basics' },
    { num: 2, label: 'Abilities' },
    { num: 3, label: 'Skills' },
    { num: 4, label: 'Equipment' },
    ...(isSpellcaster() ? [{ num: 5, label: 'Spells' }] : []),
    { num: getTotalSteps(), label: 'Finalize' }
  ];

  const updateCharacter = (field, value) => {
    setCharacter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAbility = (ability, value) => {
    // Önceki değeri al
    const currentValue = character.abilities[ability];
    
    // Yeni puan farkını hesapla
    const pointDifference = value - currentValue;
    
    // Yeni toplam kullanılan puanları hesapla
    const newTotalPoints = usedAbilityPoints + pointDifference;
    
    // Eğer toplam puan limitini aşıyorsa ve puan artırılıyorsa engelle
    if (newTotalPoints > MAX_ABILITY_POINTS && pointDifference > 0) {
      return;
    }
    
    // Değeri güncelle
    setCharacter(prev => ({
      ...prev,
      abilities: {
        ...prev.abilities,
        [ability]: value
      }
    }));
    
    // Kullanılan puanları güncelle
    setUsedAbilityPoints(newTotalPoints);
  };

  const toggleLanguage = (language) => {
    setCharacter(prev => {
      if (prev.languages.includes(language)) {
        return {
          ...prev,
          languages: prev.languages.filter(lang => lang !== language)
        };
      } else {
        return {
          ...prev,
          languages: [...prev.languages, language]
        };
      }
    });
  };

  const nextStep = () => {
    window.scrollTo(0, 0);
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep(prev => prev - 1);
  };

  const saveCharacter = () => {
    // Save character to local storage
    const savedCharacters = JSON.parse(localStorage.getItem('characters') || '[]');
    const newCharacter = {
      ...character,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('characters', JSON.stringify([...savedCharacters, newCharacter]));
    router.push('/existing-characters');
  };

  // Calculate modifier from ability score
  const getModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  // Format modifier with + or - sign
  const formatModifier = (mod) => {
    return mod >= 0 ? `+${mod}` : mod.toString();
  };

  // SpellSelection component with auto-selected cantrips and one level 1 spell
  const SpellSelection = ({ character, rulebook, updateCharacter }) => {
    const [selectedCantrips, setSelectedCantrips] = useState([]);
    const [selectedSpells, setSelectedSpells] = useState([]);
    
    // Get class data
    const classData = rulebook.classes.find(c => c.id === character.class);
    const className = classData?.name || '';
    
    console.log(`Filtering spells for class: ${character.class} (${className})`);
    
    // Filter spells by class using case-insensitive class name comparison
    const availableCantrips = rulebook.spells.filter(spell => {
      const isCorrectLevel = spell.level === 0;
      // Improve class matching by normalizing case and trimming whitespace
      const matchesClass = spell.classes.some(spellClass => 
        spellClass.toLowerCase().trim() === className?.toLowerCase().trim()
      );
      
      return isCorrectLevel && matchesClass;
    });
    
    const availableLevel1Spells = rulebook.spells.filter(spell => {
      const isCorrectLevel = spell.level === 1;
      // Improve class matching by normalizing case and trimming whitespace
      const matchesClass = spell.classes.some(spellClass => 
        spellClass.toLowerCase().trim() === className?.toLowerCase().trim()
      );
      
      return isCorrectLevel && matchesClass;
    });

    console.log(`Available cantrips: ${availableCantrips.length}`);
    console.log(`Available level 1 spells: ${availableLevel1Spells.length}`);

    // For debugging - show all spells with class lists
    console.log("All level 1 spells and their classes:");
    rulebook.spells
      .filter(spell => spell.level === 1)
      .forEach(spell => {
        console.log(`${spell.name}: Classes = [${spell.classes.join(', ')}]`);
      });

    // Get max spells by class
    const getMaxSpellsConfig = () => {
      switch(character.class) {
        case 'wizard':
          return { cantrips: 3, level1: 1 };
        case 'druid':
          return { cantrips: 2, level1: 1 };
        case 'bard':
          return { cantrips: 2, level1: 1 };
        case 'paladin':
          return { cantrips: 2, level1: 1 }; // Paladin artık cantrip kullanabilir
        default:
          return { cantrips: 0, level1: 0 };
      }
    };

    const maxSpells = getMaxSpellsConfig();
    console.log(`Max spells for ${className}: Cantrips=${maxSpells.cantrips}, Level 1=${maxSpells.level1}`);
    
    // Auto-select cantrips on component mount
    useEffect(() => {
      console.log('SpellSelection component initialized');
      
      // If no cantrips are available but we should have some, use all level 0 spells as fallback
      if (availableCantrips.length === 0 && maxSpells.cantrips > 0) {
        console.log("No class-specific cantrips found. Using general cantrips as fallback.");
        // As a backup, get any cantrips for the spellcasting class
        const fallbackCantrips = rulebook.spells.filter(spell => spell.level === 0).slice(0, maxSpells.cantrips);
        
        if (fallbackCantrips.length > 0) {
          const autoCantrips = fallbackCantrips.map(spell => spell.id);
          setSelectedCantrips(autoCantrips);
          updateCharacter('cantrips', autoCantrips);
        }
      }
      // If character already has cantrips selected, use those
      else if (character.cantrips?.length > 0) {
        setSelectedCantrips(character.cantrips);
      } 
      // Otherwise automatically select cantrips if available
      else if (availableCantrips.length > 0) {
        // Select first available cantrips up to the class maximum
        const autoCantrips = availableCantrips
          .slice(0, maxSpells.cantrips)
          .map(spell => spell.id);
        
        console.log('Auto-selecting cantrips:', autoCantrips);
        setSelectedCantrips(autoCantrips);
        updateCharacter('cantrips', autoCantrips);
      }
      
      // If no level 1 spells are available but we should have some, use all level 1 spells as fallback
      if (availableLevel1Spells.length === 0 && maxSpells.level1 > 0) {
        console.log("No class-specific level 1 spells found. Using general level 1 spells as fallback.");
        // As a backup, get any level 1 spells
        const fallbackLevel1Spells = rulebook.spells.filter(spell => spell.level === 1).slice(0, 5);
        
        if (fallbackLevel1Spells.length > 0) {
          // Don't auto-select, but make them available for selection
          console.log("Made available fallback level 1 spells:", fallbackLevel1Spells.map(s => s.name));
        }
      }
      
      // If character already has level 1 spells selected, use those
      if (character.spells?.length > 0) {
        setSelectedSpells(character.spells);
      }
    }, [character.class, availableCantrips.length, availableLevel1Spells.length]);
    
    // Toggle a level 1 spell (only allow 1 at a time)
    const toggleSpell = (spellId) => {
      console.log('Toggling spell:', spellId);
      
      if (selectedSpells.includes(spellId)) {
        // Deselect the spell
        const newSelection = selectedSpells.filter(id => id !== spellId);
        setSelectedSpells(newSelection);
        updateCharacter('spells', newSelection);
      } else {
        // Select the spell (replacing any previously selected one)
        const newSelection = [spellId];
        setSelectedSpells(newSelection);
        updateCharacter('spells', newSelection);
      }
    };
    
    return (
      <div className={styles.creatorStep}>
        <h2>Choose Your Spells</h2>
        <p>As a {className}, you have access to magical abilities.</p>
        
        {maxSpells.cantrips > 0 && (
          <div className={styles.spellsSection}>
            <h3>Cantrips (Level 0)</h3>
            <p>Cantrips are automatically selected for your character. These are minor spells you can cast at will.</p>
            
            <div className={styles.spellList}>
              {selectedCantrips.map(spellId => {
                const spell = rulebook.spells.find(s => s.id === spellId);
                return spell ? (
                  <div 
                    key={spell.id} 
                    className={`${styles.spellCard} ${styles.selected} ${styles.autoSelected}`}
                  >
                    <div className={styles.spellHeader}>
                      <h4>{spell.name}</h4>
                      <span className={styles.autoSelectedTag}>Auto-Selected</span>
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
                ) : null;
              })}

              {selectedCantrips.length === 0 && (
                <p className={styles.noSpellsMessage}>No cantrips available. You will be able to proceed without cantrips.</p>
              )}
            </div>
          </div>
        )}
        
        {maxSpells.level1 > 0 && (
          <div className={styles.spellsSection}>
            <h3>Level 1 Spells</h3>
            <p>You can select 1 level 1 spell for your character.</p>
            <div className={styles.spellSelectionSummary}>
              Selected: {selectedSpells.length}/{maxSpells.level1}
            </div>
            
            <div className={styles.spellList}>
              {/* Use either available level 1 spells or fallback to any level 1 spells */}
              {(availableLevel1Spells.length > 0 ? availableLevel1Spells : 
                 rulebook.spells.filter(spell => spell.level === 1 && 
                                           (spell.classes.includes('Paladin') || 
                                            spell.classes.some(c => c.toLowerCase() === 'paladin')))
              ).map(spell => {
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

              {availableLevel1Spells.length === 0 && 
               rulebook.spells.filter(spell => spell.level === 1 && 
                                      (spell.classes.includes('Paladin') ||
                                       spell.classes.some(c => c.toLowerCase() === 'paladin'))).length === 0 && (
                <p className={styles.noSpellsMessage}>
                  No level 1 spells found for {className}. 
                  Please select at least one to continue or contact the administrator.
                </p>
              )}
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
            onClick={nextStep}
            className={styles.buttonPrimary}
            disabled={maxSpells.level1 > 0 && selectedSpells.length === 0}
          >
            Next: Review Character
          </button>
        </div>
      </div>
    );
  };

  // EquipmentSelection component for selecting weapons and armor
  const EquipmentSelection = ({ character, rulebook, updateCharacter }) => {
    // Get weapons and armor from rulebook
    const weapons = rulebook.items.filter(item => item.type === 'weapon');
    const armors = rulebook.items.filter(item => item.type === 'armor');
    
    // Toggle weapon selection
    const toggleWeapon = (weaponId) => {
      setCharacter(prev => {
        if (prev.weapons.includes(weaponId)) {
          return {
            ...prev,
            weapons: prev.weapons.filter(id => id !== weaponId)
          };
        } else {
          // Limit to 2 weapons
          if (prev.weapons.length >= 2) {
            return {
              ...prev,
              weapons: [...prev.weapons.slice(1), weaponId]
            };
          }
          return {
            ...prev,
            weapons: [...prev.weapons, weaponId]
          };
        }
      });
    };
    
    // Select armor
    const selectArmor = (armorId) => {
      setCharacter(prev => ({
        ...prev,
        armor: armorId
      }));
    };
    
    return (
      <div className={styles.creatorStep}>
        <h2>Equipment Selection</h2>
        <p>Choose weapons and armor for your character.</p>
        
        <div className={styles.equipmentSection}>
          <h3>Weapons (Select up to 2)</h3>
          <div className={styles.itemsGrid}>
            {weapons.map(weapon => (
              <div 
                key={weapon.id} 
                className={`${styles.itemCard} ${character.weapons.includes(weapon.id) ? styles.selected : ''}`}
                onClick={() => toggleWeapon(weapon.id)}
              >
                <h4>{weapon.name}</h4>
                <p className={styles.itemType}>Weapon, {weapon.rarity}</p>
                <p className={styles.description}>{weapon.description}</p>
                
                <div className={styles.itemDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Damage:</span> 
                    <span className={styles.detailValue}>{weapon.damageAmount} {weapon.damageType}</span>
                  </div>
                  
                  {weapon.range && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Range:</span> 
                      <span className={styles.detailValue}>{weapon.range.normal}/{weapon.range.long} ft</span>
                    </div>
                  )}
                  
                  {weapon.properties && weapon.properties.length > 0 && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Properties:</span> 
                      <span className={styles.detailValue}>{weapon.properties.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.equipmentSection}>
          <h3>Armor (Select one)</h3>
          <div className={styles.itemsGrid}>
            {armors.map(armor => (
              <div 
                key={armor.id} 
                className={`${styles.itemCard} ${character.armor === armor.id ? styles.selected : ''}`}
                onClick={() => selectArmor(armor.id)}
              >
                <h4>{armor.name}</h4>
                <p className={styles.itemType}>Armor, {armor.rarity}</p>
                <p className={styles.description}>{armor.description}</p>
                
                <div className={styles.itemDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Armor Class:</span> 
                    <span className={styles.detailValue}>AC {armor.armorClass}</span>
                  </div>
                  
                  {armor.stealthDisadvantage && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Stealth:</span> 
                      <span className={styles.detailValue}>Disadvantage</span>
                    </div>
                  )}
                  
                  {armor.requirements && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Requirements:</span> 
                      <span className={styles.detailValue}>
                        {Object.entries(armor.requirements)
                          .map(([stat, value]) => `${stat.charAt(0).toUpperCase() + stat.slice(1)} ${value}`)
                          .join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
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
            onClick={nextStep}
            className={styles.buttonPrimary}
          >
            Next: {isSpellcaster() ? "Spells" : "Review Character"}
          </button>
        </div>
      </div>
    );
  };

  // Character summary for final review
  const renderCharacterSummary = () => {
    // Get race and class objects
    const race = rulebook.races.find(r => r.id === character.race);
    const characterClass = rulebook.classes.find(c => c.id === character.class);
    
    // Get selected languages
    const selectedLanguages = character.languages.map(langId => 
      rulebook.languages.find(lang => lang.id === langId)?.name
    ).filter(Boolean);
    
    // Get selected weapons and armor
    const selectedWeapons = character.weapons.map(weaponId => 
      rulebook.items.find(item => item.id === weaponId)
    ).filter(Boolean);
    
    const selectedArmor = rulebook.items.find(item => item.id === character.armor);
    
    // Get selected spells if spellcaster
    const selectedCantrips = character.cantrips.map(spellId => 
      rulebook.spells.find(spell => spell.id === spellId)
    ).filter(Boolean);
    
    const selectedSpells = character.spells.map(spellId => 
      rulebook.spells.find(spell => spell.id === spellId)
    ).filter(Boolean);
    
    return (
      <div className={styles.creatorStep}>
        <h2>Character Summary</h2>
        <p>Review your character before finalizing.</p>
        
        <div className={styles.characterSummary}>
          <div className={styles.summarySection}>
            <h3>Basic Information</h3>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Name:</span>
                <span className={styles.summaryValue}>{character.name}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Gender:</span>
                <span className={styles.summaryValue}>{character.gender.charAt(0).toUpperCase() + character.gender.slice(1)}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Race:</span>
                <span className={styles.summaryValue}>{race?.name}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Class:</span>
                <span className={styles.summaryValue}>{characterClass?.name}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.summarySection}>
            <h3>Abilities</h3>
            <div className={styles.summaryGrid}>
              {Object.entries(character.abilities).map(([ability, score]) => (
                <div key={ability} className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>{ability.charAt(0).toUpperCase() + ability.slice(1)}:</span>
                  <span className={styles.summaryValue}>
                    {score} ({formatModifier(getModifier(score))})
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.summarySection}>
            <h3>Languages</h3>
            {selectedLanguages.length > 0 ? (
              <ul className={styles.summaryList}>
                {selectedLanguages.map(lang => (
                  <li key={lang}>{lang}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyMessage}>No languages selected</p>
            )}
          </div>
          
          <div className={styles.summarySection}>
            <h3>Equipment</h3>
            <div className={styles.equipmentSummary}>
              <div className={styles.weaponsSummary}>
                <h4>Weapons</h4>
                {selectedWeapons.length > 0 ? (
                  <ul className={styles.summaryList}>
                    {selectedWeapons.map(weapon => (
                      <li key={weapon.id}>
                        <strong>{weapon.name}</strong> - {weapon.damageAmount} {weapon.damageType} damage
                        {weapon.properties.length > 0 && ` (${weapon.properties.join(', ')})`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.emptyMessage}>No weapons selected</p>
                )}
              </div>
              
              <div className={styles.armorSummary}>
                <h4>Armor</h4>
                {selectedArmor ? (
                  <div className={styles.summaryItem}>
                    <strong>{selectedArmor.name}</strong> - AC {selectedArmor.armorClass}
                    {selectedArmor.stealthDisadvantage && ' (Stealth Disadvantage)'}
                  </div>
                ) : (
                  <p className={styles.emptyMessage}>No armor selected</p>
                )}
              </div>
            </div>
          </div>
          
          {isSpellcaster() && (
            <div className={styles.summarySection}>
              <h3>Spells</h3>
              <div className={styles.spellsSummary}>
                <div className={styles.cantripsSummary}>
                  <h4>Cantrips</h4>
                  {selectedCantrips.length > 0 ? (
                    <ul className={styles.summaryList}>
                      {selectedCantrips.map(spell => (
                        <li key={spell.id}>{spell.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.emptyMessage}>No cantrips selected</p>
                  )}
                </div>
                
                <div className={styles.level1SpellsSummary}>
                  <h4>Level 1 Spells</h4>
                  {selectedSpells.length > 0 ? (
                    <ul className={styles.summaryList}>
                      {selectedSpells.map(spell => (
                        <li key={spell.id}>{spell.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.emptyMessage}>No level 1 spells selected</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {character.background && (
            <div className={styles.summarySection}>
              <h3>Background</h3>
              <p className={styles.backgroundText}>{character.background}</p>
            </div>
          )}
        </div>
        
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
            onClick={saveCharacter}
            className={styles.buttonPrimary}
          >
            Create Character
          </button>
        </div>
      </div>
    );
  };

  // Render the step content based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className={styles.creatorStep}>
            <h2>Character Basics</h2>
            <p>Begin your journey by choosing your character's name, race, and class.</p>
            
            <div className={styles.formGroup}>
              <label htmlFor="name">Character Name</label>
              <input
                type="text"
                id="name"
                value={character.name}
                onChange={(e) => updateCharacter('name', e.target.value)}
                placeholder="Enter your character's name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={character.gender}
                onChange={(e) => updateCharacter('gender', e.target.value)}
                required
              >
                <option value="">Select a gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="race">Race</label>
              <select
                id="race"
                value={character.race}
                onChange={(e) => updateCharacter('race', e.target.value)}
                required
              >
                <option value="">Select a race</option>
                {rulebook.races.map(race => (
                  <option key={race.id} value={race.id}>{race.name}</option>
                ))}
              </select>
            </div>

            {character.race && (
              <div className={styles.infoCard}>
                <h3>{rulebook.races.find(r => r.id === character.race)?.name}</h3>
                <p>{rulebook.races.find(r => r.id === character.race)?.description}</p>
                
                <h4>Racial Traits</h4>
                <ul>
                  {rulebook.races.find(r => r.id === character.race)?.traits.map(trait => (
                    <li key={trait}>{trait}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="class">Class</label>
              <select
                id="class"
                value={character.class}
                onChange={(e) => updateCharacter('class', e.target.value)}
                required
              >
                <option value="">Select a class</option>
                {rulebook.classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>

            {character.class && (
              <div className={styles.infoCard}>
                <h3>{rulebook.classes.find(c => c.id === character.class)?.name}</h3>
                <p>{rulebook.classes.find(c => c.id === character.class)?.description}</p>
                
                <h4>Class Features</h4>
                <ul>
                  {rulebook.classes.find(c => c.id === character.class)?.features.map(feature => (
                    <li key={feature.name}>
                      <strong>{feature.name}:</strong> {feature.description}
                    </li>
                  ))}
                </ul>
                
                {isSpellcaster() && (
                  <div className={styles.spellcasterNote}>
                    <h4>Spellcasting</h4>
                    <p>As a {rulebook.classes.find(c => c.id === character.class)?.name}, you have the ability to cast spells. You will be able to select your spells after setting up your character's abilities and skills.</p>
                  </div>
                )}
              </div>
            )}
            
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => router.back()}
                className={styles.buttonSecondary}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={nextStep}
                className={styles.buttonPrimary}
                disabled={!character.name || !character.race || !character.class}
              >
                Next: Abilities
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className={styles.creatorStep}>
            <h2>Ability Scores</h2>
            <p>Distribute your character's ability scores. Starting from 8, you can increase each ability up to 15.</p>
            
            <div className={styles.pointsIndicator}>
              <div className={styles.pointsLabel}>
                Available Points: <span className={styles.pointsValue}>{MAX_ABILITY_POINTS - usedAbilityPoints}</span>/{MAX_ABILITY_POINTS}
              </div>
              <div className={styles.pointsBar}>
                <div 
                  className={styles.pointsFill} 
                  style={{ width: `${(usedAbilityPoints / MAX_ABILITY_POINTS) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className={styles.abilitiesGrid}>
              {Object.keys(character.abilities).map(ability => (
                <div key={ability} className={styles.abilityItem}>
                  <label htmlFor={ability}>
                    {ability.charAt(0).toUpperCase() + ability.slice(1)}
                  </label>
                  <div className={styles.abilityControls}>
                    <button
                      type="button"
                      onClick={() => updateAbility(ability, Math.max(3, character.abilities[ability] - 1))}
                      disabled={character.abilities[ability] <= 3}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id={ability}
                      value={character.abilities[ability]}
                      onChange={(e) => updateAbility(ability, Math.max(3, Math.min(15, parseInt(e.target.value) || 0)))}
                      min="3"
                      max="15"
                    />
                    <button
                                      type="button"
                                      onClick={() => updateAbility(ability, Math.min(15, character.abilities[ability] + 1))}
                                      disabled={character.abilities[ability] >= 15 || usedAbilityPoints >= MAX_ABILITY_POINTS}
                                    >
                                      +
                                    </button>
                                  </div>
                                  <div className={styles.abilityModifier}>
                                    Modifier: {formatModifier(getModifier(character.abilities[ability]))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
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
                                onClick={nextStep}
                                className={styles.buttonPrimary}
                              >
                                Next: Skills & Languages
                              </button>
                            </div>
                          </div>
                        );
                      
                      case 3:
                        return (
                          <div className={styles.creatorStep}>
                            <h2>Skills & Languages</h2>
                            <p>Choose the languages your character knows and specify any background details.</p>
                            
                            <div className={styles.formGroup}>
                              <label>Languages</label>
                              <div className={styles.languagesGrid}>
                                {rulebook.languages.map(language => (
                                  <div key={language.id} className={styles.languageItem}>
                                    <input
                                      type="checkbox"
                                      id={`lang-${language.id}`}
                                      checked={character.languages.includes(language.id)}
                                      onChange={() => toggleLanguage(language.id)}
                                    />
                                    <label htmlFor={`lang-${language.id}`}>{language.name}</label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className={styles.formGroup}>
                              <label htmlFor="background">Character Background</label>
                              <textarea
                                id="background"
                                value={character.background}
                                onChange={(e) => updateCharacter('background', e.target.value)}
                                rows="4"
                                placeholder="Describe your character's background and history..."
                              ></textarea>
                            </div>
                              
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
                                onClick={nextStep}
                                className={styles.buttonPrimary}
                              >
                                Next: Equipment
                              </button>
                            </div>
                          </div>
                        );
                      
                      case 4:
                        return (
                          <EquipmentSelection
                            character={character}
                            rulebook={rulebook}
                            updateCharacter={updateCharacter}
                          />
                        );
                      
                      case 5:
                        // If spellcaster, show spell selection, otherwise show character summary
                        return isSpellcaster() ? (
                          <SpellSelection
                            character={character}
                            rulebook={rulebook}
                            updateCharacter={updateCharacter}
                          />
                        ) : renderCharacterSummary();
                      
                      case 6:
                        // Final step with character summary
                        return renderCharacterSummary();
                      
                      default:
                        return null;
                    }
                  };
                
                  return (
                    <Layout>
                      <Head>
                        <title>Create Character | SAGAI</title>
                        <meta name="description" content="Create your character for your next adventure" />
                      </Head>
                      
                      <div className={styles.container}>
                        <div className={styles.creatorHeader}>
                          <h1 className={styles.title}>Forge Your Legend</h1>
                          <p className={styles.subtitle}>Create a character to begin your adventure</p>
                          <div className={styles.divider}></div>
                        </div>
                
                        <div className={styles.stepsProgress}>
                          {steps.map(s => (
                            <div
                              key={s.num}
                              className={`${styles.step} ${step === s.num ? styles.active : ''} ${step > s.num ? styles.completed : ''}`}
                              data-label={s.label}
                            >
                              {step > s.num ? '✓' : s.num}
                            </div>
                          ))}
                        </div>
                        
                        <div className={styles.creatorContent}>
                          {renderStepContent()}
                        </div>
                      </div>
                    </Layout>
                  );
                }
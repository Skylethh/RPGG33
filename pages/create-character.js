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

  // Bu kısmı ekleyin (MAX_ABILITY_POINTS ve usedAbilityPoints state'i)
  const MAX_ABILITY_POINTS = 24;
  const [usedAbilityPoints, setUsedAbilityPoints] = useState(0);

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
    background: '',
    equipment: []
  });

  // Step labels for the progress indicator
  const steps = [
    { num: 1, label: 'Basics' },
    { num: 2, label: 'Abilities' },
    { num: 3, label: 'Skills' },
    { num: 4, label: 'Finalize' }
  ];

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
    // Save character to local storage or database
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
                    <li key={trait}>
                      {trait}
                    </li>
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
            <p>Distribute your character's ability scores. These values represent your character's natural talents and capabilities.</p>
            
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
                      onChange={(e) => updateAbility(ability, Math.max(3, Math.min(18, parseInt(e.target.value) || 0)))}
                      min="3"
                      max="18"
                    />
                    <button
                      type="button"
                      onClick={() => updateAbility(ability, Math.min(18, character.abilities[ability] + 1))}
                      disabled={character.abilities[ability] >= 18}
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
                Review Character
              </button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className={styles.creatorStep}>
            <h2>Character Summary</h2>
            <p>Review your character before finalizing.</p>
            
            <div className={styles.characterSummary}>
              <h3>{character.name}</h3>
              <div className={styles.characterType}>
                {rulebook.races.find(r => r.id === character.race)?.name} {rulebook.classes.find(c => c.id === character.class)?.name}
              </div>
              
              <h4>Abilities</h4>
              <div className={styles.abilitiesSummary}>
                {Object.keys(character.abilities).map(ability => (
                  <div key={ability} className={styles.abilitySummaryItem}>
                    <div className={styles.abilityName}>{ability.substr(0, 3)}</div>
                    <div className={styles.abilityScore}>{character.abilities[ability]}</div>
                    <div className={styles.abilityMod}>{formatModifier(getModifier(character.abilities[ability]))}</div>
                  </div>
                ))}
              </div>
              
              <h4>Languages</h4>
              <ul>
                {character.languages.map(langId => (
                  <li key={langId}>
                    {rulebook.languages.find(l => l.id === langId)?.name}
                  </li>
                ))}
              </ul>
              
              {character.background && (
                <>
                  <h4>Background</h4>
                  <p>{character.background}</p>
                </>
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
      
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Head>
        <title>Create Character | DragonQuestAI</title>
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
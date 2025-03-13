import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
import styles from '../styles/ExistingCharacters.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrash, faPlus, faUser, faGem, faCalendarAlt, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import { initializeRuleBook } from '../data/sampleRuleData';

export default function ExistingCharacters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingCharacter, setViewingCharacter] = useState(null);
  const rulebook = initializeRuleBook();
  
  // Karakter verilerini yükleme
  useEffect(() => {
    // LocalStorage'dan kaydedilmiş karakterleri al
    const savedCharacters = JSON.parse(localStorage.getItem('characters') || '[]');
    
    // Kısa bir gecikme ile karakterleri yükle (yükleme efekti için)
    setTimeout(() => {
      setCharacters(savedCharacters);
      setLoading(false);
    }, 600);
  }, []);
  
  const deleteCharacter = (id) => {
    // Silme işlemini onayla
    if (window.confirm('Bu karakteri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      // State'teki karakteri sil
      const updatedCharacters = characters.filter(char => char.id !== id);
      setCharacters(updatedCharacters);
      
      // LocalStorage'dan da sil
      localStorage.setItem('characters', JSON.stringify(updatedCharacters));
    }
  };

  const viewCharacterDetails = (character) => {
    setViewingCharacter(character);
  };

  const closeCharacterDetails = () => {
    setViewingCharacter(null);
  };
  
  // Calculate modifier from ability score
  const getModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  // Format modifier with + or - sign
  const formatModifier = (mod) => {
    return mod >= 0 ? `+${mod}` : mod.toString();
  };
  
  return (
    <Layout>
      <Head>
        <title>Your Characters | DragonQuest AI</title>
        <meta name="description" content="View and manage your created characters" />
      </Head>
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your Characters</h1>
          <p className={styles.subtitle}>Select a character to continue your adventure or forge a new hero</p>
          <div className={styles.divider}></div>
        </div>
        
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loadingIcon}></div>
            <p>Summoning your characters...</p>
          </div>
        ) : characters.length === 0 ? (
          <div className={styles.noCharacters}>
            <p className={styles.noCharactersText}>
              You haven't created any characters yet!
              <br />Begin your journey by creating your first hero.
            </p>
            <Link href="/create-character" className={`${styles.button} ${styles.primaryButton}`}>
              <FontAwesomeIcon icon={faPlus} /> Create Your First Character
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.charactersList}>
              {characters.map(character => (
                <div className={styles.characterCard} key={character.id}>
                  <div className={styles.characterHeader}>
                    <h2 className={styles.characterName}>{character.name}</h2>
                  </div>
                  
                  <div className={styles.characterInfo}>
                    <div className={styles.characterDetails}>
                      <div className={styles.detailItem}>
                        <FontAwesomeIcon icon={faUser} />
                        <span className={styles.detailLabel}>Identity:</span>
                        <span className={styles.detailValue}>
                          {character.race && character.class ? 
                            `${rulebook.races.find(r => r.id === character.race)?.name} ${rulebook.classes.find(c => c.id === character.class)?.name}` : 
                            character.race || character.class || 'Unknown'}
                        </span>
                      </div>
                      
                      {(character.level || character.level === 0) && (
                        <div className={styles.detailItem}>
                          <FontAwesomeIcon icon={faGem} />
                          <span className={styles.detailLabel}>Level:</span>
                          <span className={styles.detailValue}>{character.level || 1}</span>
                        </div>
                      )}
                      
                      <div className={styles.detailItem}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <span className={styles.detailLabel}>
                          {character.lastPlayed ? 'Last Played:' : 'Created:'}
                        </span>
                        <span className={styles.detailValue}>
                          {character.lastPlayed ? 
                            new Date(character.lastPlayed).toLocaleDateString() : 
                            new Date(character.createdAt || Date.now()).toLocaleDateString()
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.characterActions}>
                    <button className={`${styles.button} ${styles.primaryButton}`}>
                      <FontAwesomeIcon icon={faPlay} /> Play
                    </button>
                    <button 
                      className={`${styles.button} ${styles.secondaryButton}`}
                      onClick={() => viewCharacterDetails(character)}
                    >
                      <FontAwesomeIcon icon={faEye} /> View Details
                    </button>
                    <button 
                      className={`${styles.button} ${styles.dangerButton} ${styles.deleteAction}`}
                      onClick={() => deleteCharacter(character.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete Character
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.createNew}>
              <Link href="/create-character" className={`${styles.button} ${styles.primaryButton}`}>
                <FontAwesomeIcon icon={faPlus} /> Create New Character
              </Link>
            </div>
          </>
        )}
        
        {/* Karakter Özeti Modalı */}
        {viewingCharacter && (
          <div className={styles.modalOverlay} onClick={closeCharacterDetails}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{viewingCharacter.name}</h2>
                <button 
                  className={styles.closeButton} 
                  onClick={closeCharacterDetails}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              <div className={styles.characterSummary}>
                <div className={styles.characterType}>
                  {rulebook.races.find(r => r.id === viewingCharacter.race)?.name} {rulebook.classes.find(c => c.id === viewingCharacter.class)?.name}
                </div>
                
                

                

<h4 className={styles.sectionHeader}>Abilities</h4>
<div className={styles.abilitiesSummary}>
  {Object.keys(viewingCharacter.abilities).map(ability => {
    // Irktan gelen bonus değerini bul
    const raceBonus = rulebook.races.find(r => r.id === viewingCharacter.race)?.statBonuses[ability] || 0;
    // Gerçek değeri hesapla (karakter puan + ırk bonusu)
    const totalValue = viewingCharacter.abilities[ability] + raceBonus;
    
    return (
      <div key={ability} className={styles.abilitySummaryItem}>
        <div className={styles.abilityName}>{ability.substr(0, 3).toUpperCase()}</div>
        <div className={styles.abilityValue}>
          <div className={styles.abilityTotal}>{totalValue}</div>
          <div className={styles.abilityDetails}>
            {viewingCharacter.abilities[ability]} 
            {raceBonus > 0 && <span className={styles.racialBonus}>+{raceBonus}</span>}
          </div>
        </div>
        <div className={styles.abilityMod}>
          <span className={styles.modifierLabel}>MOD</span>
          <span className={styles.modifierValue}>{formatModifier(getModifier(totalValue))}</span>
        </div>
      </div>
    );
  })}
</div>
                
                <h4 className={styles.sectionHeader}>Racial Traits</h4>
                <ul className={styles.traitsList}>
                  {rulebook.races.find(r => r.id === viewingCharacter.race)?.traits.map(trait => (
                    <li key={trait}>{trait}</li>
                  ))}
                </ul>
                
                <h4 className={styles.sectionHeader}>Racial Abilities</h4>
                <ul className={styles.abilitiesList}>
                  {rulebook.races.find(r => r.id === viewingCharacter.race)?.abilities.map(ability => (
                    <li key={ability.name}>
                      <strong>{ability.name}:</strong> {ability.description}
                    </li>
                  ))}
                </ul>
                
                <h4 className={styles.sectionHeader}>Languages</h4>
                <ul className={styles.languagesList}>
                  {viewingCharacter.languages.map(langId => (
                    <li key={langId}>
                      {rulebook.languages.find(l => l.id === langId)?.name}
                    </li>
                  ))}
                </ul>
                
                {viewingCharacter.background && (
  <>
    <h4 className={styles.sectionHeader}>Background</h4>
    <p className={styles.backgroundText}>{viewingCharacter.background}</p>
  </>
)}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
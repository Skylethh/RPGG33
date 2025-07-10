import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faScroll, faPlayCircle, faDiceD20, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Start.module.css';

export default function Start() {
  const [showTips, setShowTips] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  
  useEffect(() => {
    // Animate cards after component mounts
    setTimeout(() => {
      setAnimateCards(true);
    }, 300);
  }, []);
  
  return (
    <Layout title="Begin Your Quest | SAGAI">
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Your Legend Begins</h1>
            <p className={styles.heroSubtitle}>Choose your path, brave adventurer</p>
            <div className={styles.heroDecoration}></div>
          </div>
        </div>
        
        <div className={styles.mainContent}>
          <div className={styles.optionsSection}>
            <div className={`${styles.optionsGrid} ${animateCards ? styles.animated : ''}`}>
              <Link href="/create-character" className={styles.optionCard}>
                <div className={styles.optionCardInner}>
                  <div className={styles.optionImageContainer}>
                    <div className={styles.optionImage}>
                      <FontAwesomeIcon icon={faUserPlus} className={styles.optionIcon} />
                    </div>
                    <div className={styles.optionGlow}></div>
                  </div>
                  <h2 className={styles.optionTitle}>Forge Your Hero</h2>
                  <p className={styles.optionDescription}>Create a unique character with custom abilities, background, and appearance</p>
                  <span className={styles.optionButton}>Begin Creation</span>
                </div>
              </Link>
              
              <Link href="/existing-characters" className={styles.optionCard}>
                <div className={styles.optionCardInner}>
                  <div className={styles.optionImageContainer}>
                    <div className={styles.optionImage}>
                      <FontAwesomeIcon icon={faPlayCircle} className={styles.optionIcon} />
                    </div>
                    <div className={styles.optionGlow}></div>
                  </div>
                  <h2 className={styles.optionTitle}>Continue Quest</h2>
                  <p className={styles.optionDescription}>Return to your adventure with one of your existing characters</p>
                  <span className={styles.optionButton}>Resume Journey</span>
                </div>
              </Link>
              
              <Link href="/rules" className={styles.optionCard}>
                <div className={styles.optionCardInner}>
                  <div className={styles.optionImageContainer}>
                    <div className={styles.optionImage}>
                      <FontAwesomeIcon icon={faScroll} className={styles.optionIcon} />
                    </div>
                    <div className={styles.optionGlow}></div>
                  </div>
                  <h2 className={styles.optionTitle}>Ancient Tomes</h2>
                  <p className={styles.optionDescription}>Study the rulebook to master spells, weapons, and game mechanics</p>
                  <span className={styles.optionButton}>Open Rulebook</span>
                </div>
              </Link>
            </div>
          </div>
          
          <div className={styles.tipsContainer}>
            <button 
              className={styles.tipsToggle} 
              onClick={() => setShowTips(!showTips)}
            >
              <div className={styles.toggleIconContainer}>
                <FontAwesomeIcon icon={faDiceD20} className={styles.diceIcon} spin={showTips} />
              </div>
              <span>Adventurer's Guide</span>
              <FontAwesomeIcon 
                icon={showTips ? faChevronUp : faChevronDown} 
                className={styles.chevronIcon}
              />
            </button>
            
            {showTips && (
              <div className={styles.tipsContent}>
                <h3>Beginner's Wisdom</h3>
                <div className={styles.tipsList}>
                  <div className={styles.tipItem}>
                    <div className={styles.tipIcon}></div>
                    <div className={styles.tipText}>
                      <strong>Choose Your Path Wisely:</strong> Each race and class combination offers unique advantages and playstyles.
                    </div>
                  </div>
                  
                  <div className={styles.tipItem}>
                    <div className={styles.tipIcon}></div>
                    <div className={styles.tipText}>
                      <strong>Balance Your Abilities:</strong> Make sure your ability scores complement your chosen class.
                    </div>
                  </div>
                  
                  <div className={styles.tipItem}>
                    <div className={styles.tipIcon}></div>
                    <div className={styles.tipText}>
                      <strong>Master the Rules:</strong> Familiarize yourself with game mechanics before starting your adventure.
                    </div>
                  </div>
                  
                  <div className={styles.tipItem}>
                    <div className={styles.tipIcon}></div>
                    <div className={styles.tipText}>
                      <strong>Plan Your Growth:</strong> Think about how you want your character to develop over time.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
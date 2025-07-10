import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/Game.module.css';
import { initializeRuleBook } from '../data/sampleRuleData';

// Utility functions
// Check if character is a spellcaster
const isSpellcaster = (characterClass) => {
  return ['wizard', 'bard', 'druid', 'paladin'].includes(characterClass);
};

// Format modifier with + or - sign
const formatModifier = (mod) => {
  return mod >= 0 ? `+${mod}` : mod.toString();
};

// Extract the helper function for global reuse
const getAbilityModifier = (score) => {
  return Math.floor((score - 10) / 2);
};

// Fixed HP values for each class - extract as a constant to avoid duplication
const FIXED_HP_BY_CLASS = {
  'wizard': 6,
  'bard': 8,
  'druid': 8,
  'paladin': 10,
  'rogue': 8,
  'fighter': 10,
  'barbarian': 12
};

export default function Game() {
  const router = useRouter();
  const { character: characterId } = router.query;
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentHealth, setCurrentHealth] = useState(0);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const rulebook = initializeRuleBook();
  
  // Store initial maxHealth value as a ref to check for health decreases
  const maxHealthRef = useRef(0);
  const previousHealthRef = useRef(0);

  // Calculate character's health with improved logic
  const calculateHealth = (characterClass, constitutionScore, level = 1) => {
    try {
      // Get base health from class
      const baseHealth = FIXED_HP_BY_CLASS[characterClass] || 8;
      
      // Calculate constitution modifier
      const conModifier = getAbilityModifier(constitutionScore);
      
      // Maximum health at level 1 is base health + constitution modifier
      const maxHealth = baseHealth + conModifier;
      
      return { maxHealth: Math.max(1, maxHealth) }; // Ensure health is always at least 1
    } catch (error) {
      console.error('Error calculating health:', error);
      return { maxHealth: 8 }; // Default fallback
    }
  };

  // Load character from local storage
  useEffect(() => {
    if (!characterId) return;

    const loadCharacterAndStartGame = async () => {
      try {
        const savedCharacters = JSON.parse(localStorage.getItem('characters') || '[]');
        const foundCharacter = savedCharacters.find(char => char.id === characterId);
        
        if (foundCharacter) {
          setCharacter(foundCharacter);

          const constitutionScore = foundCharacter.abilities.constitution + 
            (rulebook.races.find(r => r.id === foundCharacter.race)?.statBonuses.constitution || 0);
          const { maxHealth } = calculateHealth(foundCharacter.class, constitutionScore);

          setCurrentHealth(maxHealth);
          setMessages([]); // Clear any previous messages

          // Automatically trigger the initial story from the DM
          await handleSendMessage(null, true, foundCharacter);

        } else {
          router.push('/existing-characters');
        }
      } catch (error) {
        console.error('Error loading character:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCharacterAndStartGame();

  }, [characterId, router]);

  // Health change detection effect
  useEffect(() => {
    if (!character) return;
    
    // Calculate max health once
    const constitutionScore = character.abilities.constitution + 
      (rulebook.races.find(r => r.id === character.race)?.statBonuses.constitution || 0);
    const { maxHealth } = calculateHealth(character.class, constitutionScore);
    
    // Set max health ref
    maxHealthRef.current = maxHealth;
    
    // Check if health decreased
    if (previousHealthRef.current > currentHealth) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update previous health ref
    previousHealthRef.current = currentHealth;
  }, [currentHealth, character]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !character) return;
    
    const userMessage = {
      sender: 'player',
      content: inputMessage,
      timestamp: new Date(),
    };
    
    const chatHistory = [...messages, userMessage];
    setMessages(chatHistory);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userMessage: currentInput,
          character, 
          chatHistory: chatHistory.slice(0, -1), // Send history before adding the new user message
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      // Handle the streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let dmResponse = { sender: 'dm', content: '', timestamp: new Date() };
      setMessages(prev => [...prev, dmResponse]);

      const processStream = async () => {
        let buffer = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop(); // Keep the last partial line

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const json = JSON.parse(line.substring(6));
                if (json.content) {
                  setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage && lastMessage.sender === 'dm') {
                      const updatedMessages = [...prev.slice(0, -1), { ...lastMessage, content: lastMessage.content + json.content }];
                      return updatedMessages;
                    }
                    return prev;
                  });
                }
              } catch (e) {
                console.error('Error parsing stream data:', e);
              }
            }
          }
        }
      };

      await processStream();

    } catch (error) {
      console.error('Error sending message to AI:', error);
      const errorMessage = {
        sender: 'dm',
        content: 'Sorry, I am having trouble thinking right now. Please try again in a moment.',
        timestamp: new Date(),
      };
      // Add new error message instead of replacing
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // The simulateDMResponse function is no longer needed and can be removed.

  if (loading) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your adventure...</p>
        </div>
      </Layout>
    );
  }

  if (!character) {
    return (
      <Layout>
        <div className={styles.errorContainer}>
          <h1>Character Not Found</h1>
          <p>We couldn't find your character. Please return to your characters list and try again.</p>
          <button 
            className={styles.returnButton}
            onClick={() => router.push('/existing-characters')}
          >
            Return to Characters
          </button>
        </div>
      </Layout>
    );
  }

  // Calculate character's health and other stats
  const constitutionScore = character.abilities.constitution + 
    (rulebook.races.find(r => r.id === character.race)?.statBonuses.constitution || 0);
  const { maxHealth } = calculateHealth(character.class, constitutionScore);
  
  // Calculate armor class
  const dexModifier = Math.floor((character.abilities.dexterity - 10) / 2);
  let armorClass = 10 + dexModifier; // Base AC
  
  if (character.armor) {
    const armorItem = rulebook.items.find(item => item.id === character.armor);
    if (armorItem) {
      armorClass = armorItem.armorClass;
      // Add DEX modifier for light armor
      if (armorItem.properties && armorItem.properties.includes('light')) {
        armorClass += dexModifier;
      }
      // Add limited DEX modifier (max +2) for medium armor
      else if (armorItem.properties && armorItem.properties.includes('medium')) {
        armorClass += Math.min(dexModifier, 2);
      }
      // Heavy armor doesn't add DEX
    }
  }

  return (
    <Layout>
      <Head>
        <title>{character.name}'s Adventure | SAGAI</title>
        <meta name="description" content="Play your character's adventure with AI Dungeon Master" />
      </Head>
      
      <div className={styles.gameContainer}>
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h2>Adventure Log</h2>
            <button 
              className={styles.exitButton}
              onClick={() => router.push('/existing-characters')}
            >
              Exit Game
            </button>
          </div>
          
          <div className={styles.messagesContainer} ref={messagesContainerRef}>
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`${styles.message} ${message.sender === 'dm' ? styles.dmMessage : styles.playerMessage}`}
              >
                <div className={styles.messageContent}>{message.content}</div>
                <div className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className={`${styles.message} ${styles.dmMessage} ${styles.typingIndicator}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form className={styles.inputContainer} onSubmit={handleSendMessage}>
            <input
              type="text"
              className={styles.messageInput}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="What would you like to do?"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className={styles.sendButton}
              disabled={!inputMessage.trim() || isTyping}
            >
              Send
            </button>
          </form>
        </div>
        
        <div className={styles.characterPanel}>
          <div className={styles.characterHeader}>
            <h2>{character.name}</h2>
            <div className={styles.characterMeta}>
              Level 1 {rulebook.races.find(r => r.id === character.race)?.name || 'Unknown'} {' '}
              {rulebook.classes.find(c => c.id === character.class)?.name || 'Unknown'}
            </div>
          </div>
          
          {/* Health Bar */}
          <div className={styles.healthBarContainer}>
            <div className={styles.healthBarLabel}>
              <span>HP</span>
              <span>{currentHealth}/{maxHealth}</span>
            </div>
            <div className={styles.healthBarOuter}>
              <div 
                className={styles.healthBarInner} 
                style={{ width: `${(currentHealth / maxHealth) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className={styles.characterStats}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>AC</div>
              <div className={styles.statValue}>{armorClass}</div>
            </div>
            
            {Object.entries(character.abilities).map(([ability, value]) => {
              const raceBonus = rulebook.races.find(r => r.id === character.race)?.statBonuses[ability] || 0;
              const totalValue = value + raceBonus;
              const modifier = Math.floor((totalValue - 10) / 2);
              
              return (
                <div key={ability} className={styles.statItem}>
                  <div className={styles.statLabel}>{ability.substr(0, 3).toUpperCase()}</div>
                  <div className={styles.statValue}>
                    {totalValue} ({formatModifier(modifier)})
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className={styles.characterDetails}>
            <div className={styles.detailsSection}>
              <h3>Character Profile</h3>
              <div className={styles.profileInfo}>
                <div className={styles.profileItem}>
                  <span className={styles.profileLabel}>Gender:</span>
                  <span className={styles.profileValue}>
                    {character.gender ? (character.gender.charAt(0).toUpperCase() + character.gender.slice(1)) : 'Unknown'}
                  </span>
                </div>
                <div className={styles.profileItem}>
                  <span className={styles.profileLabel}>Race:</span>
                  <span className={styles.profileValue}>
                    {rulebook.races.find(r => r.id === character.race)?.name || 'Unknown'}
                  </span>
                </div>
                <div className={styles.profileItem}>
                  <span className={styles.profileLabel}>Class:</span>
                  <span className={styles.profileValue}>
                    {rulebook.classes.find(c => c.id === character.class)?.name || 'Unknown'}
                  </span>
                </div>
                <div className={styles.profileItem}>
                  <span className={styles.profileLabel}>Background:</span>
                  <span className={styles.profileValue}>
                    {character.background || 'Adventurer'}
                  </span>
                </div>
                <div className={styles.profileItem}>
                  <span className={styles.profileLabel}>Saving Throws:</span>
                  <span className={styles.profileValue}>
                    {rulebook.classes.find(c => c.id === character.class)?.savingThrows.map(save => 
                      save.charAt(0).toUpperCase() + save.slice(1)
                    ).join(', ')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={styles.detailsSection}>
              <h3>Equipment</h3>
              <div className={styles.equipmentList}>
                {character.weapons && character.weapons.length > 0 ? (
                  <div className={styles.equipmentCategory}>
                    <h4>Weapons</h4>
                    <ul>
                      {character.weapons.map(weaponId => {
                        const weapon = rulebook.items.find(item => item.id === weaponId);
                        return weapon ? (
                          <li key={weaponId}>
                            <strong>{weapon.name}</strong>
                            {weapon.damageAmount && weapon.damageType && (
                              <span className={styles.itemDetail}>
                                {weapon.damageAmount} {weapon.damageType}
                              </span>
                            )}
                            {weapon.properties && weapon.properties.length > 0 && (
                              <span className={styles.itemProperties}>
                                Properties: {weapon.properties.join(', ')}
                              </span>
                            )}
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                ) : null}
                
                {character.armor ? (
                  <div className={styles.equipmentCategory}>
                    <h4>Armor</h4>
                    <ul>
                      {(() => {
                        const armor = rulebook.items.find(item => item.id === character.armor);
                        return armor ? (
                          <li key={character.armor}>
                            <strong>{armor.name}</strong>
                            <span className={styles.itemDetail}>
                              AC {armor.armorClass}
                              {armor.properties && armor.properties.length > 0 && (
                                `, ${armor.properties.join(', ')}`
                              )}
                            </span>
                            {armor.requirements && Object.keys(armor.requirements).length > 0 && (
                              <span className={styles.itemRequirements}>
                                Requirements: {Object.entries(armor.requirements)
                                  .map(([stat, value]) => `${stat.charAt(0).toUpperCase() + stat.slice(1)} ${value}`)
                                  .join(', ')}
                              </span>
                            )}
                          </li>
                        ) : null;
                      })()}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
            
            {character.class && isSpellcaster(character.class) && 
              (character.cantrips?.length > 0 || character.spells?.length > 0) && (
              <div className={styles.detailsSection}>
                <h3>Spells</h3>
                
                {character.cantrips?.length > 0 && (
                  <div className={styles.spellCategory}>
                    <h4>Cantrips</h4>
                    <ul>
                      {character.cantrips.map(spellId => {
                        const spell = rulebook.spells.find(s => s.id === spellId);
                        return spell ? (
                          <li key={spellId}>
                            <strong>{spell.name}</strong>
                            <span className={styles.itemDetail}>{spell.school}</span>
                            <span className={styles.spellDescription}>{spell.description}</span>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                )}
                
                {character.spells?.length > 0 && (
                  <div className={styles.spellCategory}>
                    <h4>Level 1</h4>
                    <ul>
                      {character.spells.map(spellId => {
                        const spell = rulebook.spells.find(s => s.id === spellId);
                        return spell ? (
                          <li key={spellId}>
                            <strong>{spell.name}</strong>
                            <span className={styles.itemDetail}>{spell.school}</span>
                            <span className={styles.spellDescription}>{spell.description}</span>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <div className={styles.detailsSection}>
              <h3>Class Features</h3>
              <div className={styles.classFeatures}>
                {(() => {
                  const characterClass = rulebook.classes.find(c => c.id === character.class);
                  if (!characterClass) return <p>No class features found</p>;
                  
                  return (
                    <>
                      {characterClass.features
                        .filter(feature => feature.level <= 1) // Only show level 1 features
                        .map((feature, index) => (
                          <div key={index} className={styles.featureItem}>
                            <strong>{feature.name}:</strong> {feature.description}
                          </div>
                        ))}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
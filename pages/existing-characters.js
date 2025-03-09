import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function ExistingCharacters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Simulating data loading
  useEffect(() => {
    // In a real app, you would fetch this data from an API or database
    const mockCharacters = [
      { 
        id: 1, 
        name: 'Thordak Ironhammer', 
        race: 'Dwarf', 
        class: 'Fighter', 
        level: 3,
        lastPlayed: '2025-02-28'
      },
      { 
        id: 2, 
        name: 'Elyndra Moonwhisper', 
        race: 'Elf', 
        class: 'Wizard', 
        level: 2,
        lastPlayed: '2025-03-05'
      },
      { 
        id: 3, 
        name: 'Baern Goodbarrel', 
        race: 'Halfling', 
        class: 'Rogue', 
        level: 4,
        lastPlayed: '2025-03-07'
      },
    ];
    
    setTimeout(() => {
      setCharacters(mockCharacters);
      setLoading(false);
    }, 500);
  }, []);
  
  const deleteCharacter = (id) => {
    setCharacters(characters.filter(char => char.id !== id));
  };
  
  return (
    <Layout title="Your Characters | DragonQuest AI">
      <div className="existing-characters-page">
        <div className="container">
          <h1>Your Characters</h1>
          
          {loading ? (
            <div className="loading">Loading characters...</div>
          ) : characters.length === 0 ? (
            <div className="no-characters">
              <p>You haven't created any characters yet!</p>
              <Link href="/create-character" className="btn primary-btn">
                Create Your First Character
              </Link>
            </div>
          ) : (
            <>
              <div className="characters-list">
                {characters.map(character => (
                  <div className="character-card" key={character.id}>
                    <div className="character-info">
                      <h2>{character.name}</h2>
                      <p className="character-details">
                        Level {character.level} {character.race} {character.class}
                      </p>
                      <p className="last-played">
                        Last played: {new Date(character.lastPlayed).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="character-actions">
                      <button className="btn primary-btn">Play</button>
                      <button className="btn secondary-btn">Edit</button>
                      <button 
                        className="btn danger-btn" 
                        onClick={() => deleteCharacter(character.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="create-new">
                <Link href="/create-character" className="btn primary-btn">
                  Create New Character
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
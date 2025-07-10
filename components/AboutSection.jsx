import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faBook, faDragon, faUsers } from '@fortawesome/free-solid-svg-icons';

export default function AboutSection() {
  return (
    <section className="about-section" id="about-section">
      <div className="container">
        <h2>About <span className="ai-highlight">SAG</span><span className="ai-color">AI</span></h2>
        <div className="divider"></div>
        
        <div className="about-content">
          <div className="about-text">
            <p>
              <span className="ai-highlight">SAG</span><span className="ai-color">AI</span> is an immersive role-playing game platform that combines the depth of traditional tabletop RPGs with the power of modern AI technology. Our mission is to create accessible, engaging, and dynamic adventures for players of all experience levels.
            </p>
            <p>
              Whether you're a seasoned dungeon master or a curious newcomer to the world of role-playing games, our platform offers tools and experiences to enhance your gameplay and storytelling.
            </p>
          </div>
          
          <div className="about-features">
            <div className="feature-card">
              <FontAwesomeIcon icon={faGamepad} className="feature-icon" />
              <h3>Interactive Gameplay</h3>
              <p>Engage with a responsive AI Dungeon Master that adapts to your choices and creates personalized adventures.</p>
            </div>
            
            <div className="feature-card">
              <FontAwesomeIcon icon={faBook} className="feature-icon" />
              <h3>Comprehensive Rulebook</h3>
              <p>Access detailed rules, character options, spells, and items to build your perfect character.</p>
            </div>
            
            <div className="feature-card">
              <FontAwesomeIcon icon={faDragon} className="feature-icon" />
              <h3>Rich Fantasy World</h3>
              <p>Explore diverse realms filled with unique creatures, ancient mysteries, and epic quests.</p>
            </div>
            
            <div className="feature-card">
              <FontAwesomeIcon icon={faUsers} className="feature-icon" />
              <h3>Community Focus</h3>
              <p>Join a growing community of players and storytellers sharing adventures and creative ideas.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
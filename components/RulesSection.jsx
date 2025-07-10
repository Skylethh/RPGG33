import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage, faUsers, faHatWizard, faScroll } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function RulesSection() {
  return (
    <section className="rules-teaser" id="rules">
      <div className="container">
        <h2>Master The Art of Adventure</h2>
        <p>Our comprehensive rulebook contains everything you need to navigate the realms.</p>
        <div className="rules-grid">
          <div className="rule-card">
            <FontAwesomeIcon icon={faUsers} size="2x" />
            <h3>Races</h3>
            <p>Choose from dozens of unique races, each with special abilities and histories.</p>
          </div>
          <div className="rule-card">
            <FontAwesomeIcon icon={faHatWizard} size="2x" />
            <h3>Classes</h3>
            <p>Become a mighty warrior, cunning rogue, or master of arcane arts.</p>
          </div>
          <div className="rule-card">
            <FontAwesomeIcon icon={faLanguage} size="2x" />
            <h3>Languages</h3>
            <p>Discover the tongues of elves, dwarves, and forgotten ancient civilizations.</p>
          </div>
          <div className="rule-card">
            <FontAwesomeIcon icon={faScroll} size="2x" />
            <h3>Items & Spells</h3>
            <p>Wield legendary weapons and cast powerful enchantments in your adventures.</p>
          </div>
        </div>
        <Link href="/rules" className="btn secondary-btn">View Full Rulebook</Link>
      </div>
    </section>
  );
}
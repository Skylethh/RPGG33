import React, { useState } from 'react';
import { initializeRuleBook } from '../../data/sampleRuleData';
import RacesSection from './RacesSection';
import ClassesSection from './ClassesSection';
import LanguagesSection from './LanguagesSection';
import ItemsSection from './ItemsSection';
import SpellsSection from './SpellsSection';

export default function RulebookPage() {
  const rulebook = initializeRuleBook();
  const [activeTab, setActiveTab] = useState('races');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'races':
        return <RacesSection races={rulebook.races} />;
      case 'classes':
        return <ClassesSection classes={rulebook.classes} />;
      case 'languages':
        return <LanguagesSection languages={rulebook.languages} />;
      case 'items':
        return <ItemsSection items={rulebook.items} />;
      case 'spells':
        return <SpellsSection spells={rulebook.spells} />;
      default:
        return <RacesSection races={rulebook.races} />;
    }
  };

  return (
    <div className="rulebook-container">
      <h1>DragonQuest AI Rulebook</h1>
      <div className="rulebook-tabs">
        <button 
          className={`tab-button ${activeTab === 'races' ? 'active' : ''}`} 
          onClick={() => setActiveTab('races')}
        >
          Races
        </button>
        <button 
          className={`tab-button ${activeTab === 'classes' ? 'active' : ''}`}
          onClick={() => setActiveTab('classes')}
        >
          Classes
        </button>
        <button 
          className={`tab-button ${activeTab === 'languages' ? 'active' : ''}`}
          onClick={() => setActiveTab('languages')}
        >
          Languages
        </button>
        <button 
          className={`tab-button ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Items
        </button>
        <button 
          className={`tab-button ${activeTab === 'spells' ? 'active' : ''}`}
          onClick={() => setActiveTab('spells')}
        >
          Spells
        </button>
      </div>
      <div className="rulebook-content">
        {renderActiveTab()}
      </div>
    </div>
  );
}
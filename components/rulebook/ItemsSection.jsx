import React, { useState } from 'react';

export default function ItemsSection({ items }) {
  const [filter, setFilter] = useState('all');
  
  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter);
  
  const itemTypes = ['all', ...new Set(items.map(item => item.type))];
  
  return (
    <div className="rulebook-section items-section">
      <h2>Items & Equipment</h2>
      <p>Discover the tools, weapons, armor, and magical items available for your adventures.</p>
      
      <div className="item-filters">
        {itemTypes.map(type => (
          <button 
            key={type} 
            className={`filter-button ${filter === type ? 'active' : ''}`}
            onClick={() => setFilter(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="items-grid">
        {filteredItems.map(item => (
          <div className="item-card" key={item.id}>
            <h3>{item.name}</h3>
            <p className="item-type">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}, {item.rarity}</p>
            <p className="description">{item.description}</p>
            
            <div className="item-details">
              <div className="detail-item">
                <span className="detail-label">Value:</span> 
                <span className="detail-value">{item.value} gp</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Weight:</span> 
                <span className="detail-value">{item.weight} lbs</span>
              </div>
              
              {item.properties && item.properties.length > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Properties:</span> 
                  <span className="detail-value">{item.properties.join(', ')}</span>
                </div>
              )}
              
              {item.attunement && (
                <div className="detail-item">
                  <span className="detail-label">Attunement:</span> 
                  <span className="detail-value">Required</span>
                </div>
              )}
              
              {item.requirements && (
                <div className="detail-item">
                  <span className="detail-label">Requirements:</span> 
                  <span className="detail-value">
                    {Object.entries(item.requirements)
                      .map(([stat, value]) => `${stat.charAt(0).toUpperCase() + stat.slice(1)} ${value}`)
                      .join(', ')}
                  </span>
                </div>
              )}
              
              {/* Weapon specific details */}
              {item.damageType && (
                <>
                  <div className="detail-item">
                    <span className="detail-label">Damage:</span> 
                    <span className="detail-value">{item.damageAmount} {item.damageType}</span>
                  </div>
                  
                  {item.range && (
                    <div className="detail-item">
                      <span className="detail-label">Range:</span> 
                      <span className="detail-value">{item.range.normal}/{item.range.long} ft</span>
                    </div>
                  )}
                </>
              )}
              
              {/* Armor specific details */}
              {item.armorClass && (
                <>
                  <div className="detail-item">
                    <span className="detail-label">Armor Class:</span> 
                    <span className="detail-value">AC {item.armorClass}</span>
                  </div>
                  
                  {item.stealthDisadvantage && (
                    <div className="detail-item">
                      <span className="detail-label">Stealth:</span> 
                      <span className="detail-value">Disadvantage</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
class Race {
    constructor(id, name, description, abilities, statBonuses, traits, lore) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.abilities = abilities || []; // Special racial abilities
      this.statBonuses = statBonuses || {}; // e.g., { strength: 2, dexterity: 1 }
      this.traits = traits || []; // Racial traits like darkvision, magic resistance, etc.
      this.lore = lore || ""; // Background story and cultural information
    }
  
    getAbilityDescription(abilityName) {
      const ability = this.abilities.find(a => a.name === abilityName);
      return ability ? ability.description : null;
    }
  
    getStatBonusTotal() {
      return Object.values(this.statBonuses).reduce((sum, bonus) => sum + bonus, 0);
    }
  }
  
  module.exports = Race;
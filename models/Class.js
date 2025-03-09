class Class {
  constructor(id, name, description, primaryAbility, hitDie, savingThrows, skillChoices, features, equipment, spellcasting) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.primaryAbility = primaryAbility; // Main stat for this class
    this.hitDie = hitDie; // e.g., "d8", "d10", "d12"
    this.savingThrows = savingThrows || []; // Stats this class has proficiency in
    this.skillChoices = skillChoices || { choices: [], count: 0 }; // Available skills and how many to choose
    this.features = features || []; // Special abilities gained as the character levels up
    this.equipment = equipment || []; // Starting gear
    this.spellcasting = spellcasting || null; // Spellcasting ability if applicable
  }

  getFeaturesByLevel(level) {
    return this.features.filter(feature => feature.level <= level);
  }
  
  canCastSpells() {
    return this.spellcasting !== null;
  }
  
  getSpellSlots(level) {
    if (!this.canCastSpells() || !this.spellcasting.spellSlots) {
      return null;
    }
    return this.spellcasting.spellSlots[level] || null;
  }
}

export default Class;
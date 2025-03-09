class Spell {
  constructor(id, name, description, level, school, castingTime, range, components, duration, classes, ritual, concentration) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.level = level; // 0 for cantrips, 1-9 for spell levels
    this.school = school; // abjuration, conjuration, divination, etc.
    this.castingTime = castingTime; // action, bonus action, reaction, etc.
    this.range = range; // self, touch, 30 feet, etc.
    this.components = components || { verbal: false, somatic: false, material: null }; 
    this.duration = duration; // instantaneous, 1 minute, etc.
    this.classes = classes || []; // classes that can cast this spell
    this.ritual = ritual || false; // whether the spell can be cast as a ritual
    this.concentration = concentration || false; // whether the spell requires concentration
  }
  
  isCantrip() {
    return this.level === 0;
  }
  
  requiresConcentration() {
    return this.concentration;
  }
  
  isRitual() {
    return this.ritual;
  }
  
  getComponentString() {
    const components = [];
    if (this.components.verbal) components.push('V');
    if (this.components.somatic) components.push('S');
    if (this.components.material) components.push(`M (${this.components.material})`);
    return components.join(', ');
  }
  
  isAvailableTo(className) {
    return this.classes.includes(className);
  }
}

export default Spell;
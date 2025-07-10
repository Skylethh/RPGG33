class Item {
  constructor(id, name, description, type, rarity, value, weight, properties, requirements, attunement) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type; // weapon, armor, potion, scroll, wondrous item, etc.
    this.rarity = rarity || "common"; // common, uncommon, rare, very rare, legendary, artifact
    this.value = value || 0; // in gold pieces
    this.weight = weight || 0; // in pounds
    this.properties = properties || []; // special properties like "finesse", "two-handed", etc.
    this.requirements = requirements || null; // requirements to use the item
    this.attunement = attunement || false; // whether the item requires attunement
  }
  
  isWeapon() {
    return this.type === "weapon";
  }
  
  isArmor() {
    return this.type === "armor";
  }
  
  isConsumable() {
    return ["potion", "scroll", "food", "ammunition"].includes(this.type);
  }
  
  getValue() {
    return this.value;
  }
}

// Weapon subclass
class Weapon extends Item {
  constructor(id, name, description, rarity, value, weight, properties, requirements, attunement, damageType, damageAmount, range) {
    super(id, name, description, "weapon", rarity, value, weight, properties, requirements, attunement);
    this.damageType = damageType; // slashing, piercing, bludgeoning, etc.
    this.damageAmount = damageAmount; // e.g., "1d8", "2d6", etc.
    this.range = range || null; // for ranged weapons, e.g., { normal: 30, long: 120 }
  }
  
  getDamageFormula() {
    return this.damageAmount;
  }
  
  isRanged() {
    return this.range !== null;
  }
}

// Armor subclass
class Armor extends Item {
  constructor(id, name, description, rarity, value, weight, properties, requirements, attunement, armorClass, stealthDisadvantage) {
    super(id, name, description, "armor", rarity, value, weight, properties, requirements, attunement);
    this.armorClass = armorClass; // base AC or formula
    this.stealthDisadvantage = stealthDisadvantage || false;
  }
  
  getBaseAC() {
    return this.armorClass;
  }
  
  hasStealthDisadvantage() {
    return this.stealthDisadvantage;
  }
}

module.exports = { Item, Weapon, Armor };


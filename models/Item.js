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

// Define weapon instances
const DAGGER = new Weapon(
  "weapon_dagger",
  "Dagger",
  "A small, easily concealable blade that can be thrown or used for close combat. Its lightweight design makes it perfect for quick strikes.",
  "common",
  2, // value in gold
  1, // weight in pounds
  ["finesse", "light", "thrown"], // properties
  null, // requirements
  false, // attunement
  "piercing", // damage type
  "1d4", // damage amount
  { normal: 20, long: 60 } // range
);

const HEAVY_AXE = new Weapon(
  "weapon_heavy_axe",
  "Heavy Battle Axe",
  "A massive, two-handed axe with a broad, sharp blade capable of delivering devastating blows. Only the strongest warriors can wield it effectively.",
  "uncommon",
  30, // value in gold
  7, // weight in pounds
  ["heavy", "two-handed"], // properties
  { strength: 15 }, // requires 15 strength
  false, // attunement
  "slashing", // damage type
  "1d12", // damage amount
  null // no range
);

const LONG_BOW = new Weapon(
  "weapon_longbow",
  "Long Bow",
  "A tall bow crafted from flexible yew wood that can launch arrows with tremendous force and accuracy over long distances. Used by skilled archers and hunters.",
  "common",
  50, // value in gold
  2, // weight in pounds
  ["heavy", "two-handed", "ammunition"], // properties
  { dexterity: 12 }, // requires 12 dexterity
  false, // attunement
  "piercing", // damage type
  "1d8", // damage amount
  { normal: 150, long: 600 } // range in feet
);

// Create weapons collection
const WEAPONS = {
  DAGGER,
  HEAVY_AXE,
  LONG_BOW
};

export { Item, Weapon, Armor, WEAPONS };
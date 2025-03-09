import Race from './Race';
import Class from './Class';
import Language from './Language';
import { Item, Weapon, Armor } from './Item';
import Spell from './Spell';

class RuleBook {
  constructor() {
    this.races = [];
    this.classes = [];
    this.languages = [];
    this.items = [];
    this.spells = [];
  }

  // Race methods
  addRace(race) {
    this.races.push(race);
  }

  getRaceById(id) {
    return this.races.find(race => race.id === id);
  }

  getRaceByName(name) {
    return this.races.find(race => race.name.toLowerCase() === name.toLowerCase());
  }

  // Class methods
  addClass(characterClass) {
    this.classes.push(characterClass);
  }

  getClassById(id) {
    return this.classes.find(characterClass => characterClass.id === id);
  }

  getClassByName(name) {
    return this.classes.find(characterClass => characterClass.name.toLowerCase() === name.toLowerCase());
  }

  // Language methods
  addLanguage(language) {
    this.languages.push(language);
  }

  getLanguageById(id) {
    return this.languages.find(language => language.id === id);
  }

  getLanguageByName(name) {
    return this.languages.find(language => language.name.toLowerCase() === name.toLowerCase());
  }

  // Item methods
  addItem(item) {
    this.items.push(item);
  }

  getItemById(id) {
    return this.items.find(item => item.id === id);
  }

  getItemByName(name) {
    return this.items.find(item => item.name.toLowerCase() === name.toLowerCase());
  }

  getItemsByType(type) {
    return this.items.filter(item => item.type === type);
  }

  getWeapons() {
    return this.items.filter(item => item instanceof Weapon);
  }

  getArmor() {
    return this.items.filter(item => item instanceof Armor);
  }

  // Spell methods
  addSpell(spell) {
    this.spells.push(spell);
  }

  getSpellById(id) {
    return this.spells.find(spell => spell.id === id);
  }

  getSpellByName(name) {
    return this.spells.find(spell => spell.name.toLowerCase() === name.toLowerCase());
  }

  getSpellsByLevel(level) {
    return this.spells.filter(spell => spell.level === level);
  }

  getSpellsByClass(className) {
    return this.spells.filter(spell => spell.classes.includes(className));
  }

  getCantrips() {
    return this.getSpellsByLevel(0);
  }
}

export default RuleBook;
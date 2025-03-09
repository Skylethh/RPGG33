class Language {
  constructor(id, name, description, script, speakingRaces, commonality, example) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.script = script; // The writing system used, e.g., "Dwarvish", "Common", etc.
    this.speakingRaces = speakingRaces || []; // Races that commonly speak this language
    this.commonality = commonality || "common"; // rare, uncommon, common, universal
    this.example = example || ""; // Example phrases or words
  }
  
  isCommonlySpokenBy(raceName) {
    return this.speakingRaces.includes(raceName);
  }
  
  getScriptType() {
    return this.script;
  }
}

export default Language;
import Race from '../models/Race';
import Class from '../models/Class';
import Language from '../models/Language';
import { Item, Weapon, Armor } from '../models/Item';
import Spell from '../models/Spell';
import RuleBook from '../models/RuleBook';


// Initialize rulebook with sample data
export function initializeRuleBook() {
  const rulebook = new RuleBook();
  
  // Add sample races
  // İnsan ırkının yeteneklerini güncelleme

rulebook.addRace(new Race(
  "human",
  "Human",
  "Versatile and adaptable, humans are the most widespread race in the realms.",
  [
      
    { name: "Determination", description: "Once per day when you fail an ability check, saving throw, or attack roll, you can reroll the d20 and use the higher result." },
    { name: "Cultural Adaptability", description: "You gain advantage on Charisma checks when interacting with members of other races." }
  ],
  { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
  ["Adaptable", "Ambitious", "Diverse"],
  "Humans are the most adaptable and ambitious people among the common races. They have widely varying tastes, morals, and customs in the many different lands where they have settled."
));
  
  rulebook.addRace(new Race(
    "elf",
    "Elf",
    "Graceful, long-lived, and magically attuned beings with a deep connection to nature and art.",
    [
      { name: "Fey Ancestry", description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep." },
      { name: "Trance", description: "Elves don't need to sleep. Instead, they meditate deeply for 4 hours a day." }
    ],
    { dexterity: 2, intelligence: 1 },
    ["Darkvision", "Keen Senses", "Fey Ancestry", "Trance"],
    "Elves are a magical people of otherworldly grace, living in the world but not entirely part of it."
  ));

  rulebook.addRace(new Race(
    "dwarf",
    "Dwarf",
    "Hardy and steadfast miners and craftspeople with strong ties to mountains and ancient halls.",
    [
      { name: "Dwarven Resilience", description: "You have advantage on saving throws against poison, and you have resistance against poison damage." },
      { name: "Stonecunning", description: "Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient and add double your proficiency bonus." }
    ],
    { constitution: 2, strength: 1 },
    ["Darkvision", "Dwarven Resilience", "Stonecunning", "Tool Proficiency"],
    "Dwarves are solid and enduring like the mountains they love, weathering the centuries with stoic endurance and little change."
  ));
  
  // Add sample classes - Updated to 7 classes
  // 1. WIZARD
  rulebook.addClass(new Class(
    "wizard",
    "Wizard",
    "Masters of arcane magic, scholars who unlock the mysteries of the multiverse through study and practice. With a hit die of d6, wizards have the lowest health pool but compensate with powerful spells.",
    "intelligence",
    "d6",
    ["intelligence", "wisdom"],
    { choices: ["arcana", "history", "insight", "investigation", "medicine", "religion"], count: 2 },
    [
      { name: "Spellcasting", level: 1, description: "You can cast wizard spells using Intelligence as your spellcasting ability." },
      { name: "Arcane Recovery", level: 1, description: "Once per day when you finish a short rest, you can recover spell slots with a combined level equal to half your wizard level (rounded up)." }
    ],
    ["spellbook", "arcane focus OR component pouch", "scholar's pack OR explorer's pack", "dagger"],
    { ability: "intelligence", cantripsKnown: 3, prepared: true }
  ));
  
  // 2. BARD
  rulebook.addClass(new Class(
    "bard",
    "Bard",
    "Masters of song, speech, and the magic they contain, using verbal performances to weave enchantments. With a hit die of d8, bards have moderate health and versatile abilities.",
    "charisma",
    "d8",
    ["dexterity", "charisma"],
    { choices: ["athletics", "acrobatics", "sleight of hand", "stealth", "arcana", "history", "investigation", "nature", "religion", "animal handling", "insight", "medicine", "perception", "survival", "deception", "intimidation", "performance", "persuasion"], count: 3 },
    [
      { name: "Spellcasting", level: 1, description: "You can cast bard spells using Charisma as your spellcasting ability, using a musical instrument as a spellcasting focus." },
      { name: "Bardic Inspiration", level: 1, description: "You can inspire others through stirring words or music. To do so, you use a bonus action to choose one creature other than yourself within 60 feet who can hear you. That creature gains a Bardic Inspiration die (d6)." }
    ],
    ["musical instrument (one of your choice)", "leather armor", "dagger", "diplomat's pack OR entertainer's pack"],
    { ability: "charisma", cantripsKnown: 2, prepared: false }
  ));
  
  // 3. DRUID
  rulebook.addClass(new Class(
    "druid",
    "Druid",
    "Guardians of nature who draw upon primal magic to protect the wild and shape-shift into creatures. With a hit die of d8, druids have moderate health and balance offense with defense.",
    "wisdom",
    "d8",
    ["intelligence", "wisdom"],
    { choices: ["arcana", "animal handling", "insight", "medicine", "nature", "perception", "religion", "survival"], count: 2 },
    [
      { name: "Spellcasting", level: 1, description: "Drawing on the divine essence of nature itself, you can cast spells to shape that essence to your will." },
      { name: "Druidic", level: 1, description: "You know Druidic, the secret language of druids. You can speak the language and use it to leave hidden messages." }
    ],
    ["wooden shield OR any simple weapon", "scimitar OR any simple melee weapon", "leather armor", "explorer's pack", "druidic focus"],
    { ability: "wisdom", cantripsKnown: 2, prepared: true }
  ));
  
  // 4. PALADIN
  rulebook.addClass(new Class(
    "paladin",
    "Paladin",
    "Holy warriors bound by sacred oaths to uphold justice and righteousness, blessed with divine magic. With a hit die of d10, paladins have high health and excel in frontline combat.",
    "strength",
    "d10",
    ["wisdom", "charisma"],
    { choices: ["athletics", "insight", "intimidation", "medicine", "persuasion", "religion"], count: 2 },
    [
      { name: "Divine Sense", level: 1, description: "The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears." },
      { name: "Lay on Hands", level: 1, description: "Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level × 5." }
    ],
    ["martial weapon and shield OR two martial weapons", "javelins OR any simple melee weapon", "priest's pack OR explorer's pack", "chain mail", "holy symbol"],
    { ability: "charisma", cantripsKnown: 2, prepared: true, level: 1 } // cantrip kullanabilir hale getirdik
  ));
  
  // 5. ROGUE
  rulebook.addClass(new Class(
    "rogue",
    "Rogue",
    "Masters of stealth, precision, and skill, using cunning to overcome obstacles and strike from the shadows. With a hit die of d8, rogues have moderate health but excel at avoiding damage.",
    "dexterity",
    "d8",
    ["dexterity", "intelligence"],
    { choices: ["acrobatics", "athletics", "deception", "insight", "intimidation", "investigation", "perception", "performance", "persuasion", "sleight of hand", "stealth"], count: 4 },
    [
      { name: "Expertise", level: 1, description: "Your proficiency bonus is doubled for two skills of your choice." },
      { name: "Sneak Attack", level: 1, description: "Once per turn, you can deal extra damage when you hit a creature with a weapon attack if you have advantage on the attack roll." },
      { name: "Thieves' Cant", level: 1, description: "You have learned thieves' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation." }
    ],
    ["rapier OR shortsword", "shortbow and quiver of 20 arrows OR shortsword", "burglar's pack OR dungeoneer's pack OR explorer's pack", "leather armor", "two daggers", "thieves' tools"],
    null
  ));
  
  // 6. FIGHTER
  rulebook.addClass(new Class(
    "fighter",
    "Fighter",
    "Masters of martial combat, skilled with a variety of weapons and armor to face any battlefield challenge. With a hit die of d10, fighters have high health and are durable frontline combatants.",
    "strength",
    "d10",
    ["strength", "constitution"],
    { choices: ["acrobatics", "animal handling", "athletics", "history", "insight", "intimidation", "perception", "survival"], count: 2 },
    [
      { name: "Fighting Style", level: 1, description: "You adopt a particular style of fighting as your specialty. Choose a Fighting Style from the list available to fighters." },
      { name: "Second Wind", level: 1, description: "You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level." }
    ],
    ["chain mail OR leather armor and longbow and 20 arrows", "martial weapon and shield OR two martial weapons", "light crossbow and 20 bolts OR two handaxes", "dungeoneer's pack OR explorer's pack"],
    null
  ));
  
  // 7. BARBARIAN
  rulebook.addClass(new Class(
    "barbarian",
    "Barbarian",
    "Fierce warriors driven by fury and primal instinct, capable of entering powerful rage states in battle. With a hit die of d12, barbarians have the highest health pool of all classes, making them exceptionally durable.",
    "strength",
    "d12",
    ["strength", "constitution"],
    { choices: ["animal handling", "athletics", "intimidation", "nature", "perception", "survival"], count: 2 },
    [
      { name: "Rage", level: 1, description: "In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action. While raging, you gain advantage on Strength checks and saving throws, bonus damage on melee attacks using Strength, and resistance to bludgeoning, piercing, and slashing damage." },
      { name: "Unarmored Defense", level: 1, description: "While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit." }
    ],
    ["greataxe OR any martial melee weapon", "two handaxes OR any simple weapon", "explorer's pack", "four javelins"],
    null
  ));
  
  // Add sample languages
  rulebook.addLanguage(new Language(
    "common",
    "Common",
    "The standard language of humans and trade throughout the realms.",
    "Common",
    ["Human", "Halfling", "Half-Elf", "Half-Orc"],
    "universal",
    "Hello: 'Greetings', Farewell: 'May fortune smile upon you'"
  ));
  
  rulebook.addLanguage(new Language(
    "elvish",
    "Elvish",
    "The flowing language of elves, full of subtle intonations and intricate grammar.",
    "Elvish",
    ["Elf", "Half-Elf"],
    "common",
    "Hello: 'Vendui', Farewell: 'Tenna' ento lye omenta'"
  ));

  rulebook.addLanguage(new Language(
    "dwarvish",
    "Dwarvish",
    "The rugged language of dwarves, filled with hard consonants and guttural sounds.",
    "Dwarvish",
    ["Dwarf"],
    "uncommon",
    "Hello: 'Khazâd ai-mênu', Farewell: 'Mud askâd'"
  ));
  
  // Add sample items
  // Weapons
  rulebook.addItem(new Weapon(
    "longsword",
    "Longsword",
    "A versatile slashing weapon favored by knights and warriors.",
    "common",
    25, // Gold pieces - equal to heavy axe and longbow
    3, // pounds
    ["versatile"], // properties
    null, // requirements
    false, // attunement
    "slashing", // damage type
    "1d8", // damage amount - equal to heavy axe
    null // range
  ));
  
  rulebook.addItem(new Weapon(
    "heavy-axe",
    "Heavy Battle Axe",
    "A large, two-handed axe capable of dealing devastating blows.",
    "common",
    25, // Gold pieces - equal to longsword and longbow
    5, // pounds
    ["heavy", "two-handed"], // properties
    null, // requirements
    false, // attunement
    "slashing", // damage type
    "1d8", // damage amount - equal to longsword
    null // range
  ));
  
  rulebook.addItem(new Weapon(
    "long-bow",
    "Long Bow",
    "A tall bow that can shoot arrows at great distances.",
    "common",
    25, // Gold pieces - equal to longsword and heavy axe
    2, // pounds
    ["ammunition", "heavy", "two-handed"], // properties
    null, // requirements
    false, // attunement
    "piercing", // damage type
    "1d6", // damage amount - slightly less than longsword/axe
    { normal: 150, long: 600 } // range
  ));
  
  rulebook.addItem(new Weapon(
    "shortbow",
    "Shortbow",
    "A small, lightweight bow used for hunting and warfare.",
    "common",
    10, // Gold pieces - equal to dagger
    2, // pounds
    ["ammunition", "two-handed"], // properties
    null, // requirements
    false, // attunement
    "piercing", // damage type
    "1d3", // damage amount - less than dagger
    { normal: 80, long: 320 } // range
  ));
  
  rulebook.addItem(new Weapon(
    "dagger",
    "Dagger",
    "A small knife with a sharp point, used as a weapon.",
    "common",
    10, // Gold pieces - equal to shortbow
    1, // pounds
    ["finesse", "light", "thrown"], // properties
    null, // requirements
    false, // attunement
    "piercing", // damage type
    "1d4", // damage amount - slightly more than shortbow
    { normal: 20, long: 60 } // range
  ));

  // Armor
  rulebook.addItem(new Armor(
    "leather-armor",
    "Leather Armor",
    "A sturdy but flexible armor made from treated animal hides. Offers excellent mobility and stealth capabilities while providing moderate protection.",
    "common",
    45, // gold pieces - similar to chain mail
    10, // pounds - light weight (advantage)
    ["flexible", "silent"], // properties - added advantages
    null, // requirements - no strength requirement (advantage)
    false, // attunement
    12, // armor class (+ dex modifier) - allows adding dexterity (advantage)
    false // stealth disadvantage - no stealth disadvantage (advantage)
  ));
  
  rulebook.addItem(new Armor(
    "chain-mail",
    "Chain Mail",
    "A suit of interlocking metal rings covering the torso, arms, and legs. Provides superior protection against slashing attacks but limits mobility and makes noise when moving.",
    "common",
    50, // gold pieces - similar to leather armor
    40, // pounds - heavy weight (disadvantage)
    ["reinforced", "slashing-resistant"], // properties - added advantages
    { strength: 13 }, // requirements - strength requirement (disadvantage)
    false, // attunement
    16, // armor class (no dex modifier) - higher base AC (advantage) but no dex bonus
    true // stealth disadvantage - disadvantage on stealth (disadvantage)
  ));
  
  // Regular items
  rulebook.addItem(new Item(
    "potion-healing",
    "Potion of Healing",
    "A magical red fluid that restores 2d4+2 hit points when consumed.",
    "potion",
    "common",
    50, // gold pieces
    0.5, // pounds
    [], // properties
    null, // requirements
    false // attunement
  ));
  
  
  // Add sample spells with updated class lists
   // BÜYÜ BÖLÜMÜ - YENİDEN DENGELENDİ
  
  // CANTRIP BÜYÜLERİ (Level 0)
    // SPELLS SECTION - REBALANCED
  
  // CANTRIPS (Level 0)
  rulebook.addSpell(new Spell(
    "mage-hand",
    "Mage Hand",
    "A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again.",
    0, // level (cantrip)
    "conjuration", // school
    "1 action", // casting time
    "30 feet", // range
    { verbal: true, somatic: true, material: null }, // components
    "1 minute", // duration
    ["Wizard", "Bard"], // classes
    false, // ritual
    false // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "fire-bolt",
    "Fire Bolt",
    "You hurl a mote of fire at a creature or object within range. Make a ranged spell attack. On a hit, the target takes 1d10 fire damage.",
    0, // level
    "evocation", // school
    "1 action", // casting time
    "120 feet", // range
    { verbal: true, somatic: true, material: null }, // components
    "Instantaneous", // duration
    ["Wizard"], // classes - Wizard only for higher damage
    false, // ritual
    false // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "vicious-mockery",
    "Vicious Mockery",
    "You unleash a string of insults laced with subtle enchantments. If the target can hear you, it must make a Wisdom saving throw or take 1d4 psychic damage and have disadvantage on its next attack roll.",
    0, // level (cantrip)
    "enchantment", // school
    "1 action", // casting time
    "60 feet", // range
    { verbal: true, somatic: false, material: null }, // components
    "Instantaneous", // duration
    ["Bard"], // classes
    false, // ritual
    false // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "druidcraft",
    "Druidcraft",
    "You create a tiny, harmless sensory effect that predicts the weather, makes a flower bloom, creates a sensory effect, or snuffs out a small flame.",
    0, // level (cantrip)
    "transmutation", // school
    "1 action", // casting time
    "30 feet", // range
    { verbal: true, somatic: true, material: null }, // components
    "Instantaneous", // duration
    ["Druid"], // classes
    false, // ritual
    false // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "sacred-flame",
    "Sacred Flame",
    "Flame-like radiance descends on a creature. The target must make a Dexterity saving throw or take 1d6 radiant damage.",
    0, // level (cantrip)
    "evocation", // school
    "1 action", // casting time
    "60 feet", // range
    { verbal: true, somatic: true, material: null }, // components
    "Instantaneous", // duration
    ["Paladin"], // classes - Reduced damage for Paladin
    false, // ritual
    false // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "guidance",
    "Guidance",
    "You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice.",
    0, // level (cantrip)
    "divination", // school
    "1 action", // casting time
    "Touch", // range
    { verbal: true, somatic: true, material: null }, // components
    "Concentration, up to 1 minute", // duration
    ["Druid", "Paladin"], // classes
    false, // ritual
    true // concentration
  ));
  
  // LEVEL 1 SPELLS
  rulebook.addSpell(new Spell(
    "cure-wounds",
    "Cure Wounds",
    "A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier.",
    1, // level
    "evocation", // school
    "1 action", // casting time
    "Touch", // range
    { verbal: true, somatic: true, material: null }, // components
    "Instantaneous", // duration
    ["Druid", "Paladin", "Bard"], // classes
    false, // ritual
    false // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "bless",
    "Bless",
    "You bless up to three creatures of your choice. Whenever a target makes an attack roll or a saving throw before the spell ends, it can roll a d4 and add the number rolled to the attack roll or saving throw.",
    1, // level
    "enchantment", // school
    "1 action", // casting time
    "30 feet", // range
    { verbal: true, somatic: true, material: "A sprinkling of holy water" }, // components
    "Concentration, up to 1 minute", // duration
    ["Paladin"], // classes
    false, // ritual
    true // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "healing-word",
    "Healing Word",
    "A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier.",
    1, // level
    "evocation", // school
    "1 bonus action", // casting time
    "60 feet", // range
    { verbal: true, somatic: false, material: null }, // components
    "Instantaneous", // duration
    ["Bard", "Druid"], // classes
    false, // ritual
    false // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "thunderwave",
    "Thunderwave",
    "A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube must make a Constitution saving throw or take 2d8 thunder damage and be pushed 10 feet away.",
    1, // level
    "evocation", // school
    "1 action", // casting time
    "Self (15-foot cube)", // range
    { verbal: true, somatic: true, material: null }, // components
    "Instantaneous", // duration
    ["Bard", "Druid", "Wizard"], // classes
    false, // ritual
    false // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "magic-missile",
    "Magic Missile",
    "You create three glowing darts of magical force. Each dart hits a creature of your choice, dealing 1d4+1 force damage.",
    1, // level
    "evocation", // school
    "1 action", // casting time
    "120 feet", // range
    { verbal: true, somatic: true, material: null }, // components
    "Instantaneous", // duration
    ["Wizard"], // classes - Wizard only for guaranteed damage
    false, // ritual
    false // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "hunters-mark",
    "Hunter's Mark",
    "You choose a creature and mystically mark it as your quarry. You deal an extra 1d4 damage to the target with weapon attacks.",
    1, // level
    "divination", // school
    "1 bonus action", // casting time
    "90 feet", // range
    { verbal: true, somatic: false, material: null }, // components
    "Concentration, up to 1 hour", // duration
    ["Paladin"], // classes - Reduced damage for Paladin
    false, // ritual
    true // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "charm-person",
    "Charm Person",
    "You attempt to charm a humanoid. If it fails a Wisdom saving throw, it is charmed by you until the spell ends.",
    1, // level
    "enchantment", // school
    "1 action", // casting time
    "30 feet", // range
    { verbal: true, somatic: true, material: null }, // components
    "1 hour", // duration
    ["Bard", "Wizard"], // classes
    false, // ritual
    false // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "entangle",
    "Entangle",
    "Grasping weeds and vines sprout from the ground. Creatures in a 20-foot square must succeed on a Strength saving throw or be restrained.",
    1, // level
    "conjuration", // school
    "1 action", // casting time
    "90 feet", // range
    { verbal: true, somatic: true, material: "A pinch of seeds" }, // components
    "Concentration, up to 1 minute", // duration
    ["Druid"], // classes
    false, // ritual
    true // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "shield-of-faith",
    "Shield of Faith",
    "A shimmering field appears and surrounds a creature of your choice, granting it a +1 bonus to AC.",
    1, // level
    "abjuration", // school
    "1 bonus action", // casting time
    "60 feet", // range
    { verbal: true, somatic: true, material: "A small parchment with holy text" }, // components
    "Concentration, up to 10 minutes", // duration
    ["Paladin"], // classes - Reduced bonus for Paladin
    false, // ritual
    true // concentration
  ));
  
  // LEVEL 2 SPELLS
  rulebook.addSpell(new Spell(
    "moonbeam",
    "Moonbeam",
    "A silvery beam of pale light shines down in a 5-foot-radius, 40-foot-high cylinder. Each creature that enters the spell's area takes 2d8 radiant damage.",
    2, // level
    "evocation", // school
    "1 action", // casting time
    "120 feet", // range
    { verbal: true, somatic: true, material: "Several seeds of a moonseed plant and a piece of opalescent feldspar" }, // components
    "Concentration, up to 1 minute", // duration
    ["Druid"], // classes - Druid only for balance
    false, // ritual
    true // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "scorching-ray",
    "Scorching Ray",
    "You create three rays of fire and hurl them at targets within range. Make a ranged spell attack. Each ray deals 2d6 fire damage.",
    2, // level
    "evocation", // school
    "1 action", // casting time
    "120 feet", // range
    { verbal: true, somatic: true, material: null }, // components
    "Instantaneous", // duration
    ["Wizard"], // classes - Wizard only for higher damage potential
    false, // ritual
    false // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "hold-person",
    "Hold Person",
    "You attempt to paralyze a humanoid. The target must succeed on a Wisdom saving throw or be paralyzed for the duration.",
    2, // level
    "enchantment", // school
    "1 action", // casting time
    "60 feet", // range
    { verbal: true, somatic: true, material: "A small, straight piece of iron" }, // components
    "Concentration, up to 1 minute", // duration
    ["Bard", "Wizard"], // classes - Removed Paladin for balance
    false, // ritual
    true // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "lesser-restoration",
    "Lesser Restoration",
    "You touch a creature and can end one disease or condition afflicting it: blinded, deafened, paralyzed, or poisoned.",
    2, // level
    "abjuration", // school
    "1 action", // casting time
    "Touch", // range
    { verbal: true, somatic: true, material: null }, // components
    "Instantaneous", // duration
    ["Bard", "Druid", "Paladin"], // classes
    false, // ritual
    false // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "spiritual-weapon",
    "Spiritual Weapon",
    "You create a floating, spectral weapon that lasts for the duration. When you cast the spell, you can make a melee spell attack against a creature within 5 feet of the weapon. On a hit, the target takes 1d8 force damage.",
    2, // level
    "evocation", // school
    "1 bonus action", // casting time
    "60 feet", // range
    { verbal: true, somatic: true, material: null }, // components
    "1 minute", // duration
    ["Paladin"], // classes - Added for Paladin balance
    false, // ritual
    false // concentration
  ));
  
  // LEVEL 3 SPELLS
  rulebook.addSpell(new Spell(
    "fireball",
    "Fireball",
    "A bright streak flashes from your finger to a point you choose within range and then blossoms into an explosion of flame. Each creature in a 20-foot-radius sphere must make a Dexterity saving throw or take 8d6 fire damage.",
    3, // level
    "evocation", // school
    "1 action", // casting time
    "150 feet", // range
    { verbal: true, somatic: true, material: "A tiny ball of bat guano and sulfur" }, // components
    "Instantaneous", // duration
    ["Wizard"], // classes - Wizard only for highest damage
    false, // ritual
    false // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "call-lightning",
    "Call Lightning",
    "A storm cloud appears overhead and you call down a bolt of lightning, striking a point you choose. Each creature within 5 feet of that point must make a Dexterity saving throw or take 3d8 lightning damage.",
    3, // level
    "conjuration", // school
    "1 action", // casting time
    "120 feet", // range
    { verbal: true, somatic: true, material: null }, // components
    "Concentration, up to 10 minutes", // duration
    ["Druid"], // classes - Druid only for balance
    false, // ritual
    true // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "hypnotic-pattern",
    "Hypnotic Pattern",
    "You create a twisting pattern of colors that weaves through the air. Each creature in a 30-foot cube must make a Wisdom saving throw or become charmed and incapacitated.",
    3, // level
    "illusion", // school
    "1 action", // casting time
    "120 feet", // range
    { verbal: true, somatic: true, material: "A glowing stick of incense or a crystal vial filled with phosphorescent material" }, // components
    "Concentration, up to 1 minute", // duration
    ["Bard", "Wizard"], // classes
    false, // ritual
    true // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "daylight",
    "Daylight",
    "A 60-foot-radius sphere of light spreads out from a point you choose, filling the area with bright light and dim light for an additional 60 feet.",
    3, // level
    "evocation", // school
    "1 action", // casting time
    "60 feet", // range
    { verbal: true, somatic: true, material: null }, // components
    "1 hour", // duration
    ["Paladin", "Druid"], // classes
    false, // ritual
    false // concentration
  ));
  
  rulebook.addSpell(new Spell(
    "counterspell",
    "Counterspell",
    "You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect.",
    3, // level
    "abjuration", // school
    "1 reaction", // casting time
    "60 feet", // range
    { somatic: true, verbal: false, material: null }, // components
    "Instantaneous", // duration
    ["Wizard"], // classes - Wizard only for powerful utility
    false, // ritual
    false // concentration
  ));

  return rulebook;
}


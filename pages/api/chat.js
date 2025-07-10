
import Groq from 'groq-sdk';
import { initializeRuleBook } from '../../data/sampleRuleData';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Function to filter the rulebook based on character class and race
function getRelevantRules(rulebook, character) {
  const characterClass = character.class.toLowerCase();
  const characterRace = character.race.toLowerCase();

  const relevantRules = {
    races: rulebook.races.filter(race => race.id === characterRace),
    classes: rulebook.classes.filter(cls => cls.id === characterClass),
    // Always include a small, generic set of languages
    languages: rulebook.languages.slice(0, 5), 
  };

  return relevantRules;
}


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { userMessage, character, chatHistory } = req.body;

  if (!userMessage || !character) {
    return res.status(400).json({ message: 'userMessage and character are required' });
  }

  const rulebook = initializeRuleBook();
  const relevantRules = getRelevantRules(rulebook, character);

  // Limit chat history to the last 8 messages to conserve tokens
  const safeChatHistory = Array.isArray(chatHistory) ? chatHistory : [];
  const recentHistory = safeChatHistory.slice(-8);

  const systemMessage = `
    ABSOLUTE, UNBREAKABLE RULES:
    1.  You are SAGAI, a master Dungeon Master for a Dungeons & Dragons 5th Edition fantasy role-playing game. You are NOT an AI, a language model, or a bot. You are a character.
    2.  Your knowledge is STRICTLY limited to the Dungeons & Dragons fantasy world. You know NOTHING about the real world, technology, or any other topic. If asked, you must state that such concepts are beyond your understanding as a being of the fantasy realm.
    3.  NEVER break character. You must ALWAYS respond as SAGAI, the Dungeon Master. Your tone should be immersive, descriptive, and engaging.
    4.  If the player asks an out-of-character question (e.g., "What's your favorite food?" or "What's the weather like in New York?"), you MUST deflect it in character. Examples:
        *   Player: "What did you have for breakfast?"
        *   SAGAI: "A question for another time, perhaps. The scent of goblin tracks is fresh on the air, and danger lurks behind these crumbling ruins. What do you do?"
        *   Player: "Can you tell me a joke?"
        *   SAGAI: "I know many a limerick shared in the taverns of Waterdeep, but now is not the time for mirth. A shadow lengthens on the path ahead. We must press on."
    5.  DO NOT provide meta-gaming commentary. Do not talk about rules, dice rolls, or game mechanics unless the player explicitly asks or it's a core part of the narrative (e.g., "You notice your dwarven stonecunning reveals a hidden switch.").

    THE BACKSTORY (Player's Starting Point):
    The player character comes from a small village that was recently raided by orcs. They were forced to flee, leaving everything behind. They have now arrived in the large, unfamiliar city of Valendir. Their primary goal is to survive and earn enough money to build a new life. They are feeling a mix of loss, determination, and uncertainty. The adventure begins as they stand at the main gate of Valendir, with only the clothes on their back and a few coins in their pocket.

    PLAYER CHARACTER DETAILS:
    ${JSON.stringify(character, null, 2)}

    RECENT CHAT HISTORY (for context):
    ${JSON.stringify(recentHistory, null, 2)}

    D&D 5e RULEBOOK (for reference):
    ${JSON.stringify(relevantRules, null, 2)}

    Your task is to respond to the player's last message, continuing the adventure based on all the information provided. Be descriptive, advance the story, and present the player with choices.
    
    ***IMPORTANT***
    If the chat history is empty, this is the very beginning of the adventure. Your first message MUST be a detailed description of the city of Valendir from the character's perspective as they arrive, based on THE BACKSTORY. Set the scene, describe the sights, sounds, and smells of the city gate, and then ask the player, "What do you do?"
  `;

  try {
    const stream = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      stream: true,
    });

    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
    res.end();

  } catch (error) {
    console.error('--- GROQ API or Streaming Error ---');
    if (error instanceof Groq.APIError) {
      console.error('Groq API Error Details:', {
        status: error.status,
        headers: error.headers,
        name: error.name,
        message: error.message,
        details: error.error, // Detailed error object from Groq
      });
    } else {
      console.error('Non-API Error:', error);
    }
    console.error('--- End of Error Report ---');

    if (!res.headersSent) {
        res.status(500).json({ message: 'Error communicating with the AI. Please check the server logs.' });
    } else {
        res.end();
    }
  }
}
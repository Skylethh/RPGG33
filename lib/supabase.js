import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth related functions
export const signUp = async ({ email, password, username, name }) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        name,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (authError) throw authError;
  
  // Kullanıcı profil bilgilerini profiles tablosuna kaydet
  if (authData?.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert([
        {
          id: authData.user.id,
          username,
          full_name: name || username,
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    
    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Profil oluşturma hatası olsa bile kullanıcı kaydını devam ettir
    }
  }
  
  return authData;
};

export const signIn = async ({ email, password }) => {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) throw authError;
  return authData;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Character related functions
export const saveCharacter = async (userId, characterData) => {
  const { data, error } = await supabase
    .from('characters')
    .insert([
      {
        user_id: userId,
        ...characterData
      }
    ])
    .select();

  if (error) throw error;
  return data;
};

export const getCharacters = async (userId) => {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

// Chat history related functions
export const saveChatMessage = async (characterId, message) => {
  const { data, error } = await supabase
    .from('chat_history')
    .insert([
      {
        character_id: characterId,
        message: message.content,
        role: message.role,
        timestamp: new Date().toISOString()
      }
    ])
    .select();

  if (error) throw error;
  return data;
};

export const getChatHistory = async (characterId) => {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('character_id', characterId)
    .order('timestamp', { ascending: true });

  if (error) throw error;
  return data;
}; 
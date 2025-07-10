import { serialize } from 'cookie';
import { query } from './db';

// Set authentication cookie
export function setAuthCookie(res, token, rememberMe = false) {
  const maxAge = rememberMe 
    ? 30 * 24 * 60 * 60 // 30 days
    : 24 * 60 * 60;     // 1 day

  const cookie = serialize('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

// Clear authentication cookie
export function clearAuthCookie(res) {
  const cookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

// Get user from authentication token
export async function getUserFromToken(token) {
  if (!token) return null;

  try {
    // Find session
    const sessions = await query(
      `SELECT * FROM sessions 
       WHERE token = ? AND expires > NOW()`,
      [token]
    );

    if (sessions.length === 0) return null;

    // Get user data
    const users = await query(
      `SELECT id, username, email, image, is_verified, created_at, updated_at
       FROM users WHERE id = ?`,
      [sessions[0].user_id]
    );

    if (users.length === 0) return null;

    return users[0];
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

// Get authentication token from request cookies
export function getTokenFromCookies(req) {
  // Get the cookie header
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  // Split cookies and find auth_token
  const cookieArray = cookies.split(';');
  const tokenCookie = cookieArray.find(cookie => cookie.trim().startsWith('auth_token='));
  
  if (!tokenCookie) return null;
  
  // Extract token value
  const token = tokenCookie.split('=')[1];
  return token;
}
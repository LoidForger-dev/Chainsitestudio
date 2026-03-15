import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to manage current user in localStorage
export function getCurrentUser() {
  const user = localStorage.getItem('chainsite_user');
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(wallet, email = '', telegram = '') {
  localStorage.setItem('chainsite_user', JSON.stringify({ wallet, email, telegram }));
}

export function clearCurrentUser() {
  localStorage.removeItem('chainsite_user');
}

import { supabase, setCurrentUser, clearCurrentUser, getCurrentUser } from './supabase.js';
import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.esm.min.js';

let provider, signer;

export async function connectWallet() {
  if (!window.ethereum) {
    alert('Please install MetaMask!');
    return null;
  }
  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    signer = provider.getSigner();
    const address = await signer.getAddress();

    // Optional: sign a message for authentication (can be expanded)
    // For simplicity, we just store the wallet
    setCurrentUser(address);

    // Check if user exists in Supabase, if not create a record
    const { data: existing } = await supabase
      .from('users')
      .select('wallet_address')
      .eq('wallet_address', address)
      .single();

    if (!existing) {
      await supabase.from('users').insert([{ wallet_address: address }]);
    }

    updateUI(address);
    return address;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function disconnectWallet() {
  clearCurrentUser();
  updateUI(null);
}

export function getWallet() {
  const user = getCurrentUser();
  return user ? user.wallet : null;
}

export function getProvider() {
  return provider;
}

export function getSigner() {
  return signer;
}

// Internal function to update UI elements
function updateUI(address) {
  document.querySelectorAll('.wallet-address').forEach(el => {
    el.textContent = address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'Not connected';
  });
  document.querySelectorAll('.connect-btn').forEach(btn => {
    btn.style.display = address ? 'none' : 'inline-block';
  });
  document.querySelectorAll('.disconnect-btn').forEach(btn => {
    btn.style.display = address ? 'inline-block' : 'none';
  });
}

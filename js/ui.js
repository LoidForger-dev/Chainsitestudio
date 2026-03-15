import { connectWallet, disconnectWallet, getWallet } from './wallet.js';

// Load header and footer components
async function loadComponent(elementId, filePath) {
  const response = await fetch(filePath);
  const html = await response.text();
  document.getElementById(elementId).innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadComponent('header', 'components/header.html');
  await loadComponent('footer', 'components/footer.html');

  // Re-attach wallet listeners after components are loaded
  document.querySelectorAll('.connect-btn').forEach(btn => {
    btn.addEventListener('click', connectWallet);
  });
  document.querySelectorAll('.disconnect-btn').forEach(btn => {
    btn.addEventListener('click', disconnectWallet);
  });

  // Update UI if already connected
  const wallet = getWallet();
  if (wallet) {
    // Trigger the same UI update as connectWallet would
    const event = new CustomEvent('wallet-connected', { detail: wallet });
    window.dispatchEvent(event);
  }
});

// Listen for wallet connection events to update UI
window.addEventListener('wallet-connected', (e) => {
  const address = e.detail;
  document.querySelectorAll('.wallet-address').forEach(el => {
    el.textContent = address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'Not connected';
  });
  document.querySelectorAll('.connect-btn').forEach(btn => {
    btn.style.display = address ? 'none' : 'inline-block';
  });
  document.querySelectorAll('.disconnect-btn').forEach(btn => {
    btn.style.display = address ? 'inline-block' : 'none';
  });
});

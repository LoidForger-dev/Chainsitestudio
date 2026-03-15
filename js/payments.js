import { getSigner, getWallet } from './wallet.js';
import { supabase } from './supabase.js';
import { COMPANY_WALLET } from './config.js';
import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.esm.min.js';

export async function payForOrder(orderId, amountInEth) {
  const wallet = getWallet();
  if (!wallet) throw new Error('Connect wallet first');

  const signer = getSigner();
  if (!signer) throw new Error('Signer not available');

  const tx = await signer.sendTransaction({
    to: COMPANY_WALLET,
    value: ethers.utils.parseEther(amountInEth)
  });

  // Record payment
  const { error } = await supabase
    .from('payments')
    .insert([{
      order_id: orderId,
      wallet_address: wallet,
      tx_hash: tx.hash,
      amount: amountInEth,
      confirmed: false
    }]);

  if (error) throw error;

  // Wait for confirmation (optional)
  await tx.wait();

  // Mark as confirmed and update order
  await supabase
    .from('payments')
    .update({ confirmed: true })
    .eq('tx_hash', tx.hash);

  await supabase
    .from('orders')
    .update({ payment_status: 'paid' })
    .eq('id', orderId);

  return tx;
}

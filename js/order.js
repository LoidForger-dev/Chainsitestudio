import { supabase, getCurrentUser } from './supabase.js';

export async function submitOrder(formData) {
  const user = getCurrentUser();
  if (!user) throw new Error('Wallet not connected');

  const { data, error } = await supabase
    .from('orders')
    .insert([{
      user_wallet: user.wallet,
      project_name: formData.projectName,
      blockchain: formData.blockchain,
      website_type: formData.websiteType,
      pages: parseInt(formData.pages),
      token_name: formData.tokenName,
      token_supply: formData.tokenSupply,
      description: formData.description,
      deadline: formData.deadline,
      budget: formData.budget,
      email: formData.email,
      telegram: formData.telegram,
      payment_status: 'pending',
      order_status: 'new'
    }])
    .select();

  if (error) throw error;
  return data[0];
}

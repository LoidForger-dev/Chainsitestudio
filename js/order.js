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
export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, users(email, telegram)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(orderId, newStatus) {
  const { error } = await supabase
    .from('orders')
    .update({ order_status: newStatus })
    .eq('id', orderId);
  if (error) throw error;
}

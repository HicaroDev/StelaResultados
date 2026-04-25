'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function getCompanyAction(companyId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('base_registry')
      .select('*')
      .eq('id', companyId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Erro ao buscar empresa via Admin:', error.message);
    return { data: null, error: error.message };
  }
}

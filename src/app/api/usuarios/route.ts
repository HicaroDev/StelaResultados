import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  // Verificação de segurança: a chave mestre é obrigatória para esta API
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ 
      message: 'Configuração Incompleta: SUPABASE_SERVICE_ROLE_KEY não encontrada no .env.local' 
    }, { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { email, password, fullName, role, empresa_id, permissions } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ message: 'Dados incompletos' }, { status: 400 });
    }

    // 1. Criar o usuário no Auth do Supabase (O próprio Supabase já valida e-mail duplicado aqui)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });

    if (authError) {
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        return NextResponse.json({ message: 'Este e-mail já está sendo usado por outro usuário.' }, { status: 400 });
      }
      console.error('Erro Auth:', authError);
      return NextResponse.json({ message: `Erro na Autenticação: ${authError.message}` }, { status: 400 });
    }

    // 2. Criar o perfil na tabela 'profiles'
    // Se a coluna 'email' não existir, o upsert ainda funciona nos outros campos
    // 2. Tentar inserir no Profiles com fallback defensivo
    const profileData: any = {
      id: authData.user.id,
      full_name: fullName,
      email: email, // Novo: Salvar e-mail no perfil para facilitar a listagem
      role: role,
    };

    // Só adiciona se existirem no schema (a API vai tentar, se der erro de coluna, fazemos fallback)
    if (empresa_id) profileData.empresa_id = empresa_id;
    if (permissions) profileData.permissions = permissions;

    let { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert(profileData);

    // FALLBACK: Se o erro for de coluna inexistente (PGRST204), tenta inserir apenas o básico
    if (profileError && profileError.code === 'PGRST204') {
      console.warn('Coluna empresa_id ou permissions ausente. Tentando inserção básica...');
      const { error: fallbackError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: fullName,
          role: role
        });
      profileError = fallbackError;
    }

    if (profileError) {
      return NextResponse.json({ message: `Usuário criado no Auth, mas erro no Perfil: ${profileError.message}` }, { status: 500 });
    }

    return NextResponse.json({ message: 'Usuário configurado com sucesso!', user: authData.user });
  } catch (error: any) {
    console.error('Erro na criação de usuário:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

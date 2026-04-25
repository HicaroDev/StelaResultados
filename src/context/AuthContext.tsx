'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { getCompanyAction } from '@/app/actions/empresas';

interface Profile {
  id: string;
  full_name: string | null;
  role: 'admin' | 'common';
  empresa_id?: string | null;
  permissions?: Record<string, boolean>;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  selectedEmpresaId: string | null;
  setSelectedEmpresaId: (id: string | null) => void;
  empresas: any[];
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  selectedEmpresaId: null,
  setSelectedEmpresaId: () => {},
  empresas: [],
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string | null>(null);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchEmpresas = async (userId: string, isAdmin: boolean, linkedEmpresaId?: string | null) => {
    let query = supabase
      .from('base_registry')
      .select('id, name')
      .eq('type', 'empresa');
    
    // Se não for Admin Master, vê apenas as que criou OU a que está vinculada ao perfil
    if (!isAdmin) {
      if (linkedEmpresaId) {
        query = query.or(`created_by.eq.${userId},id.eq.${linkedEmpresaId}`);
      } else {
        query = query.eq('created_by', userId);
      }
    }

    const { data } = await query;
    
    // Fallback de Segurança: Se não retornou nada mas tem uma empresa vinculada, 
    // buscamos via Server Action (ignora RLS do cliente)
    let finalData = data || [];
    if (!isAdmin && linkedEmpresaId && finalData.length === 0) {
      const { data: fallbackData } = await getCompanyAction(linkedEmpresaId);
      if (fallbackData) {
        finalData = [fallbackData];
      }
    }

    setEmpresas(finalData);
    if (finalData.length > 0) {
      setSelectedEmpresaId(prev => prev || finalData[0].id);
    }
  };

  const fetchProfile = async (userId: string, currentSession: Session | null) => {
    // Chave Mestra 2.0: Garante acesso IMEDIATO para o e-mail oficial
    const isMasterEmail = currentSession?.user?.email === 'admin@lemmi.com';
    
    if (isMasterEmail) {
      const masterProfile: Profile = {
        id: userId,
        full_name: 'Administrador Stela',
        role: 'admin',
        permissions: {
          dashboard: true,
          cadastro: true,
          lancamentos: true,
          conciliacao: true,
          fluxo: true,
          relatorios: true,
          usuarios: true
        }
      };
      setProfile(masterProfile);
      return masterProfile; 
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
      // Se for usuário comum, trava na empresa dele
      if (data.role === 'common' && data.empresa_id) {
        setSelectedEmpresaId(data.empresa_id);
      }
      return data;
    } else {
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert([{ id: userId, role: 'common' }])
        .select()
        .single();
      if (newProfile) setProfile(newProfile);
      return newProfile;
    }
  };

  useEffect(() => {
    // Verificação inicial robusta para evitar o erro de "Lock"
    const initAuth = async () => {
      try {
        const { data: { user: initialUser } } = await supabase.auth.getUser();
        if (initialUser) {
          setUser(initialUser);
          const p = await fetchProfile(initialUser.id, null);
          const isMaster = initialUser.email === 'admin@lemmi.com';
          await fetchEmpresas(initialUser.id, isMaster, p?.empresa_id);
        }
      } catch (err) {
        console.error("Erro na inicialização da auth:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Ouvinte para mudanças em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const isMaster = currentUser.email === 'admin@lemmi.com';
        const p = await fetchProfile(currentUser.id, session);
        await fetchEmpresas(currentUser.id, isMaster, p?.empresa_id);
      } else {
        setProfile(null);
        setSelectedEmpresaId(null);
        setEmpresas([]);
      }
      
      setLoading(false);
      
      if (_event === 'SIGNED_IN') router.push('/');
      if (_event === 'SIGNED_OUT') router.push('/login');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Erro ao deslogar do Supabase:', err);
    } finally {
      // Limpa estado local de qualquer forma para destravar a UI
      setProfile(null);
      setSelectedEmpresaId(null);
      setEmpresas([]);
      setSession(null);
      setUser(null);
      window.location.href = '/login'; // Força o redirecionamento bruto se o router falhar
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      selectedEmpresaId, 
      setSelectedEmpresaId, 
      empresas, 
      loading, 
      isAdmin: user?.email === 'admin@lemmi.com' || profile?.role === 'admin',
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

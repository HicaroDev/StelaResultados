'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

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

  const fetchEmpresas = async (userId: string, isAdmin: boolean) => {
    let query = supabase
      .from('base_registry')
      .select('id, name')
      .eq('type', 'empresa');
    
    // Se não for Admin Master, vê apenas as que criou
    if (!isAdmin) {
      query = query.eq('created_by', userId);
    }

    const { data } = await query;
    if (data && data.length > 0) {
      setEmpresas(data);
      // Seleciona a primeira empresa por padrão se nada estiver selecionado
      setSelectedEmpresaId(prev => prev || data[0].id);
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
      return; 
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
    } else {
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert([{ id: userId, role: 'common' }])
        .select()
        .single();
      if (newProfile) setProfile(newProfile);
    }
  };

  useEffect(() => {
    // Pegar sessão inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session);
        // Agora buscamos as empresas passando o ID e se é admin
        const isMaster = session.user.email === 'admin@lemmi.com';
        await fetchEmpresas(session.user.id, isMaster);
      }
      setLoading(false);
    });

    // Ouvir mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const isMaster = session.user.email === 'admin@lemmi.com';
        fetchProfile(session.user.id, session);
        fetchEmpresas(session.user.id, isMaster);
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
    await supabase.auth.signOut();
    setProfile(null);
    setSelectedEmpresaId(null);
    setEmpresas([]);
    router.push('/login');
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

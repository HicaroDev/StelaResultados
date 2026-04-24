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
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async (userId: string, currentSession: Session | null) => {
    // Chave Mestra 2.0: Garante acesso IMEDIATO para o e-mail oficial
    const isMasterEmail = currentSession?.user?.email === 'admin@lemmi.com';
    
    if (isMasterEmail) {
      setProfile({
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
      });
      return; // Ignora o banco de dados para o Admin Master
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
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
      }
      setLoading(false);
    });

    // Ouvir mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id, session);
      } else {
        setProfile(null);
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
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

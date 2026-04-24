'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex bg-white font-sans overflow-hidden">
      {/* Lado Esquerdo: Brand Experience */}
      <div className="hidden lg:flex w-1/2 bg-[#F6ECF0] items-center justify-center p-20 relative">
        <div className="absolute top-12 left-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
            <span className="text-background font-black text-xs">S.</span>
          </div>
          <span className="font-title italic text-2xl tracking-tighter text-foreground">Stela Finance</span>
        </div>
        
        <div className="max-w-md space-y-6">
          <h1 className="text-6xl font-title italic text-foreground leading-[1.1]">
            Inteligência que <br/> transforma seu <br/> patrimônio.
          </h1>
          <p className="text-muted-foreground font-medium text-sm tracking-wide leading-relaxed">
            Gestão financeira de alta performance com a elegância que seu negócio merece.
          </p>
        </div>
        
        <div className="absolute bottom-12 left-12">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">Stela Intelligence v1.20</p>
        </div>
      </div>

      {/* Lado Direito: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <Card className="w-full max-w-sm border-none shadow-none space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-title italic text-foreground leading-none">Bem-vindo</h2>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mt-2">Acesse sua conta corporativa</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <ShieldCheck size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={16} />
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-muted/30 border-none rounded-2xl pl-12 pr-5 py-4 text-xs font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    placeholder="exemplo@stela.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={16} />
                  <input 
                    required
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-muted/30 border-none rounded-2xl pl-12 pr-5 py-4 text-xs font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-foreground text-background h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.01] transition-all shadow-2xl shadow-foreground/10"
            >
              {loading ? 'Autenticando...' : 'Acessar Plataforma'}
            </Button>

            <div className="pt-4 text-center">
              <button type="button" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-foreground transition-all">Esqueceu sua senha?</button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

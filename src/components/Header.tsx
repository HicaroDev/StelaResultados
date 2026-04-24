'use client';

import React from 'react';
import { Search, Bell, CircleHelp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, profile } = useAuth();
  
  // Pegar iniciais para o avatar
  const initials = profile?.full_name 
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : user?.email?.substring(0, 2).toUpperCase() || 'ST';

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-256px)] h-16 z-40 bg-white/80 backdrop-blur-xl border-b border-muted/20 flex justify-between items-center px-8 font-sans">
      <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-xl border border-muted/10 focus-within:bg-white focus-within:ring-2 focus-within:ring-muted/10 transition-all w-[320px] group">
        <Search size={18} className="text-muted-foreground/40 group-focus-within:text-foreground" />
        <input 
          className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-muted-foreground/40 font-medium text-foreground outline-none" 
          placeholder="Pesquisar transações, relatórios..." 
          type="text"
        />
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
           <button onClick={() => alert('Central de Ajuda Stela')} className="text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-muted/50 transition-all">
             <CircleHelp size={20} />
           </button>
           <button onClick={() => alert('Você não tem novas notificações.')} className="relative text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-muted/50 transition-all">
             <Bell size={20} />
             <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
           </button>
        </div>
        
        <div className="h-8 w-px bg-muted/20"></div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-black text-foreground">{profile?.full_name || user?.email?.split('@')[0] || 'Usuário'}</p>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{profile?.role === 'admin' ? 'Administrador' : 'Usuário Comum'}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center text-background font-black text-xs shadow-lg shadow-foreground/5">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import React from 'react';
import { Search, Bell, CircleHelp } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-256px)] h-16 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-50 flex justify-between items-center px-8 font-['Plus_Jakarta_Sans']">
      <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-100 transition-all w-[320px] group">
        <Search size={18} className="text-gray-400 group-focus-within:text-[#1A1A1A]" />
        <input 
          className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-400 font-medium text-[#1A1A1A]" 
          placeholder="Pesquisar transações, relatórios..." 
          type="text"
        />
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
           <button onClick={() => alert('Central de Ajuda Stela')} className="text-gray-400 hover:text-[#1A1A1A] p-2 rounded-xl hover:bg-gray-50 transition-all">
             <CircleHelp size={20} />
           </button>
           <button onClick={() => alert('Você não tem novas notificações.')} className="relative text-gray-400 hover:text-[#1A1A1A] p-2 rounded-xl hover:bg-gray-50 transition-all">
             <Bell size={20} />
             <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
           </button>
        </div>
        
        <div className="h-8 w-px bg-gray-100"></div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-black text-[#1A1A1A]">Stela User</p>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Administrador</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center text-white font-black text-xs shadow-lg shadow-gray-200">
            SU
          </div>
        </div>
      </div>
    </header>
  );
}

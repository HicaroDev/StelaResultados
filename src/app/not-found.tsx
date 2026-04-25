'use client';

import Link from 'next/link';
import { Wallet } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-[24px] flex items-center justify-center text-white shadow-2xl">
            <Wallet size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl font-medium text-[#1a1a1a] tracking-tighter font-title italic">404</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1a1a1a]/60 italic font-title">Página não encontrada</p>
        </div>
        
        <div className="p-8 bg-white/50 backdrop-blur-xl border border-[#1a1a1a]/5 rounded-[32px] shadow-2xl shadow-[#1a1a1a]/5">
          <p className="text-sm text-muted-foreground font-medium mb-8 leading-relaxed">
            A inteligência financeira da Stela não localizou este endereço. 
            Verifique a URL ou retorne ao centro de comando.
          </p>
          
          <Link 
            href="/" 
            className="inline-flex items-center justify-center w-full py-4 bg-[#1a1a1a] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#1a1a1a]/20"
          >
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

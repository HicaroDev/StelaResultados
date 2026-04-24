'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Receipt, 
  BarChart3, 
  Settings, 
  Wallet,
  FileText,
  PieChart,
  TrendingUp
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/lancamentos', label: 'Movimentações', icon: Receipt },
    { href: '/relatorios/fluxo', label: 'Fluxo de Caixa', icon: TrendingUp },
    { href: '/relatorios/dre', label: 'DRE Analítico', icon: FileText },
    { href: '/relatorios/balanco', label: 'Balanço Geral', icon: PieChart },
    { href: '/indicadores', label: 'Inteligência', icon: BarChart3 },
    { href: '/configuracoes', label: 'Preferências', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 z-50 bg-white/90 backdrop-blur-2xl border-r border-primary/20 flex flex-col p-6 gap-2 font-['Plus_Jakarta_Sans']">
      <div className="flex items-center gap-3 px-2 py-4 mb-8">
        <div className="w-11 h-11 rounded-[18px] bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
          <Wallet size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-3xl font-medium text-foreground tracking-tighter font-title italic leading-none">Stela</h1>
          <p className="text-[7px] uppercase tracking-[0.5em] text-primary-foreground/60 font-black mt-1">Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-[20px] transition-all duration-500 group relative ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 -translate-y-0.5 scale-[1.01]' 
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-primary-foreground'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary-foreground'} />
              <span className={`text-[12px] tracking-tight ${isActive ? 'font-black' : 'font-bold'}`}>{link.label}</span>
              {isActive && (
                <div className="absolute right-3 w-1 h-1 bg-primary-foreground rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-5 bg-secondary/50 rounded-[28px] border border-primary/10">
        <p className="text-[9px] font-black text-foreground mb-1 uppercase tracking-widest">Suporte VIP</p>
        <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed font-medium">Consultoria ativa.</p>
        <button 
          onClick={() => alert('Abrindo canal de suporte VIP...')}
          className="w-full py-2.5 bg-white text-foreground border border-primary/20 rounded-xl text-[10px] font-black hover:bg-foreground hover:text-white transition-all shadow-sm"
        >
          Direct
        </button>
      </div>
    </aside>
  );
}

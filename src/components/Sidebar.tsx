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
  TrendingUp,
  Users,
  LogOut,
  FolderTree,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const hasPermission = (module: string) => {
    if (isAdmin) return true;
    if (!profile?.permissions) return true;
    return profile.permissions[module] !== false;
  };

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard, show: hasPermission('dashboard') },
    { href: '/lancamentos', label: 'Lançamentos', icon: Receipt, show: hasPermission('lancamentos') },
    { href: '/conciliacao', label: 'Conciliação', icon: RefreshCw, show: hasPermission('conciliacao') },
    { href: '/relatorios/fluxo', label: 'Fluxo de Caixa', icon: TrendingUp, show: hasPermission('fluxo') },
    { href: '/relatorios/dre', label: 'DRE Analítico', icon: FileText, show: hasPermission('relatorios') },
    { href: '/cadastro', label: 'Cadastros', icon: FolderTree, show: isAdmin || hasPermission('cadastro') },
    { href: '/usuarios', label: 'Usuários', icon: Users, show: isAdmin || hasPermission('usuarios') },
    { href: '/indicadores', label: 'Inteligência', icon: BarChart3, show: hasPermission('dashboard') },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 z-50 bg-white/90 backdrop-blur-2xl border-r border-primary/20 flex flex-col p-6 gap-2 font-sans">
      <div className="flex items-center gap-3 px-2 py-4 mb-8">
        <div className="w-11 h-11 rounded-[18px] bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
          <Wallet size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-3xl font-medium text-foreground tracking-tighter font-title italic leading-none">Stela</h1>
          <p className="text-[7px] uppercase tracking-[0.5em] text-primary-foreground/60 font-black mt-1 uppercase">Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
        {links.filter(l => l.show).map((link) => {
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
                <div className="absolute right-3 w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-4 border-t border-primary/10">
        <div className="p-5 bg-secondary/30 rounded-[28px] border border-primary/5">
          <p className="text-[9px] font-black text-foreground mb-1 uppercase tracking-widest">Suporte VIP</p>
          <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed font-medium">Canal de atendimento direto.</p>
          <button 
            className="w-full py-2.5 bg-white text-foreground border border-primary/20 rounded-xl text-[10px] font-black hover:bg-foreground hover:text-white transition-all shadow-sm"
          >
            DIRECT
          </button>
        </div>
        
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-[20px] bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all font-black text-[10px] uppercase tracking-widest"
        >
          <LogOut size={16} strokeWidth={3} /> Sair do Sistema
        </button>

        <div className="px-5 py-2 text-center">
          <p className="text-[8px] font-black text-foreground uppercase tracking-[0.3em]">Stela v1.20-beta</p>
        </div>
      </div>
    </aside>
  );
}

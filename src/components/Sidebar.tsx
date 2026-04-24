'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  FileText, 
  PieChart, 
  BarChart3, 
  Settings,
  Users,
  Database,
  ShieldCheck,
  UserPlus
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/lancamentos', label: 'Lançamentos', icon: Receipt },
    { href: '/relatorios/fluxo', label: 'Fluxo de Caixa', icon: TrendingUp },
    { href: '/relatorios/dre', label: 'DRE Analítico', icon: FileText },
    { href: '/relatorios/balanco', label: 'Balanço Geral', icon: PieChart },
    { href: '/cadastro', label: 'Cadastros', icon: Database },
    { href: '/indicadores', label: 'Inteligência', icon: BarChart3 },
  ];

  // Links exclusivos para Admin
  const adminLinks = [
    { href: '/usuarios', label: 'Usuários', icon: Users },
    { href: '/configuracoes', label: 'Preferências', icon: Settings },
  ];

  const allLinks = isAdmin ? [...links, ...adminLinks] : links;

  return (
    <aside className="w-64 bg-white border-r border-muted/20 flex flex-col h-screen fixed left-0 top-0 z-40">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-foreground rounded-full flex items-center justify-center shadow-lg">
            <span className="text-background font-black text-xs">S.</span>
          </div>
          <span className="font-title italic text-xl tracking-tighter text-foreground">Stela Finance</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {allLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all group",
                isActive 
                  ? "bg-foreground text-background shadow-xl shadow-foreground/10" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon size={18} className={cn("transition-colors", isActive ? "text-background" : "text-muted-foreground/40 group-hover:text-foreground")} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 space-y-4">
        {isAdmin && (
          <div className="px-4 py-2 bg-emerald-50 rounded-xl flex items-center gap-2 border border-emerald-100">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Modo Administrador</span>
          </div>
        )}
        
        <button 
          onClick={() => alert('Abrindo canal de suporte VIP...')}
          className="w-full py-2.5 bg-white text-foreground border border-primary/20 rounded-xl text-[10px] font-black hover:bg-foreground hover:text-white transition-all shadow-sm uppercase tracking-widest"
        >
          Direct
        </button>
        
        <button 
          onClick={() => signOut()}
          className="w-full py-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black hover:bg-rose-600 hover:text-white transition-all shadow-sm uppercase tracking-widest"
        >
          Sair do Sistema
        </button>
      </div>
      
      <div className="px-5 py-2 text-center">
        <p className="text-[8px] font-black text-foreground uppercase tracking-[0.3em]">Stela v1.20-beta</p>
      </div>
    </aside>
  );
}

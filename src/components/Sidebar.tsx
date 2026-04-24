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
  PieChart
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/lancamentos', label: 'Lançamentos', icon: Receipt },
    { href: '/relatorios/dre', label: 'DRE', icon: FileText },
    { href: '/relatorios/balanco', label: 'Balanço', icon: PieChart },
    { href: '/indicadores', label: 'Indicadores', icon: BarChart3 },
    { href: '/configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 z-50 bg-white border-r border-gray-50 shadow-[4px_0px_20px_rgba(139,126,149,0.02)] flex flex-col p-6 gap-2 font-['Plus_Jakarta_Sans']">
      <div className="flex items-center gap-3 px-2 py-6 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
          <Wallet size={20} />
        </div>
        <div>
          <h1 className="text-3xl font-medium text-[#1A1A1A] tracking-tight font-title">Stela</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Intelligence</p>
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
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 -translate-y-0.5' 
                  : 'text-gray-400 hover:bg-accent hover:text-black'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-sm ${isActive ? 'font-black' : 'font-bold'}`}>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-6 bg-gray-50 rounded-[32px] border border-gray-100">
        <p className="text-[10px] font-black text-[#1A1A1A] mb-2 uppercase tracking-widest">Plano Pro</p>
        <p className="text-[11px] text-gray-400 mb-4 leading-relaxed font-medium">Relatórios avançados e insights de IA liberados.</p>
        <button className="w-full py-3 bg-white text-[#1A1A1A] border border-gray-200 rounded-2xl text-xs font-black hover:bg-[#1A1A1A] hover:text-white transition-all shadow-sm">Upgrade</button>
      </div>
    </aside>
  );
}

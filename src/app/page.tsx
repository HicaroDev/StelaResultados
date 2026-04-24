'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp,
  ArrowDown,
  ArrowUp,
  Plus,
  FileDown,
  Send,
  CreditCard,
  RefreshCcw,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Activity,
  BarChart3
} from 'lucide-react';
import FinancialChart from '@/components/FinancialChart';
import TransactionsTable from '@/components/TransactionsTable';
import Link from 'next/link';
import { Transaction, BalanceItem } from '@/types';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balanceItems, setBalanceItems] = useState<BalanceItem[]>([]);
  
  // Financial States
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netMargin: 0,
    liquidity: 0,
    solvency: 0,
    breakEven: 12500, // Placeholder or calculated
  });

  useEffect(() => {
    const savedTxs = localStorage.getItem('stela_transactions');
    const savedItems = localStorage.getItem('stela_balance_items');
    
    if (savedTxs || savedItems) {
      const txs: Transaction[] = savedTxs ? JSON.parse(savedTxs) : [];
      const bItems: BalanceItem[] = savedItems ? JSON.parse(savedItems) : [];
      
      setTransactions(txs);
      setBalanceItems(bItems);

      const income = txs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const expenses = txs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      
      const ativoCirculante = bItems.filter(i => i.category === 'Ativo Circulante').reduce((acc, i) => acc + i.amount, 0);
      const passivoCirculante = bItems.filter(i => i.category === 'Passivo Circulante').reduce((acc, i) => acc + i.amount, 0);
      const totalAtivo = bItems.filter(i => i.category.startsWith('Ativo')).reduce((acc, i) => acc + i.amount, 0);
      const totalPassivo = bItems.filter(i => i.category.startsWith('Passivo')).reduce((acc, i) => acc + i.amount, 0);

      setStats({
        totalBalance: income - expenses,
        totalIncome: income,
        totalExpenses: expenses,
        netMargin: income > 0 ? ((income - expenses) / income) * 100 : 0,
        liquidity: passivoCirculante > 0 ? ativoCirculante / passivoCirculante : 0,
        solvency: totalPassivo > 0 ? totalAtivo / totalPassivo : 0,
        breakEven: 12500
      });
    }
  }, []);

  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-10 font-['Plus_Jakarta_Sans']">
      {/* Welcome Header */}
      <section className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-medium text-[#1A1A1A] tracking-tight">Central de Indicadores</h2>
          <p className="text-gray-400 font-bold mt-2 uppercase text-[10px] tracking-[0.2em]">Módulo 4 • Business Intelligence & Performance</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="bg-white rounded-2xl font-black text-xs px-6 py-6 h-auto">
            <FileDown size={18} />
            Relatório Consolidado
          </Button>
          <Button asChild className="rounded-2xl font-black text-xs px-6 py-6 h-auto shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
            <Link href="/lancamentos">
              <Plus size={18} />
              Novo Lançamento
            </Link>
          </Button>
        </div>
      </section>

      {/* Primary KPI Row */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Margem Líquida</p>
            <Zap size={16} className="text-purple-500" />
          </div>
          <h4 className="text-3xl font-black text-[#1A1A1A]">{stats.netMargin.toFixed(1)}%</h4>
          <div className="mt-4 h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
             <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(stats.netMargin, 100)}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Liquidez Corrente</p>
            <Activity size={16} className="text-green-500" />
          </div>
          <h4 className="text-3xl font-black text-[#1A1A1A]">{stats.liquidity.toFixed(2)}</h4>
          <p className="text-[9px] text-green-500 font-black mt-2 uppercase">Saúde Financeira: Excelente</p>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ponto de Equilíbrio</p>
            <Target size={16} className="text-orange-500" />
          </div>
          <h4 className="text-3xl font-black text-[#1A1A1A]">R$ {stats.breakEven.toLocaleString('pt-BR', { notation: 'compact' })}</h4>
          <p className="text-[9px] text-gray-400 font-black mt-2 uppercase">Meta de faturamento mensal</p>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Solvência</p>
            <Shield size={16} className="text-blue-500" />
          </div>
          <h4 className="text-3xl font-black text-[#1A1A1A]">{stats.solvency.toFixed(2)}</h4>
          <p className="text-[9px] text-blue-500 font-black mt-2 uppercase">Garantia Patrimonial</p>
        </div>
      </section>

      {/* Main Analysis Section */}
      <section className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[40px] p-10 shadow-[0px_4px_30px_rgba(0,0,0,0.02)] border border-gray-100">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">EVOLUÇÃO DO FLUXO DE CAIXA</p>
              <h3 className="text-5xl font-black text-[#1A1A1A] tracking-tighter">
                {stats.totalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
            <div className="flex bg-gray-50 p-1.5 rounded-2xl">
              <button className="px-4 py-2 text-xs font-black rounded-xl bg-white text-[#1A1A1A] shadow-sm">Mensal</button>
              <button className="px-4 py-2 text-xs font-black rounded-xl text-gray-400 hover:text-[#1A1A1A]">Trimestral</button>
            </div>
          </div>
          <div className="h-72 w-full">
            <FinancialChart />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
           <div className="bg-primary rounded-[40px] p-10 text-primary-foreground flex-1 relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <BarChart3 className="text-primary-foreground/20 mb-6" size={40} />
                <h4 className="text-2xl font-black mb-4 leading-tight">Distribuição de Receita</h4>
                <p className="text-primary-foreground/50 text-sm font-medium leading-relaxed mb-8">Sua receita está concentrada em 70% Serviços e 30% Vendas diretas.</p>
                <div className="space-y-4">
                   <div className="flex justify-between text-[10px] font-black uppercase">
                      <span>Serviços</span>
                      <span>70%</span>
                   </div>
                   <div className="w-full h-1.5 bg-primary-foreground/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[70%]"></div>
                   </div>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
           </div>
        </div>
      </section>

      {/* Transactions Section */}
      <TransactionsTable transactions={transactions} />
    </div>
  );
}

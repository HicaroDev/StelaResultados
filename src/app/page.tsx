'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  FileText,
  Zap,
  Shield,
  Activity,
  Target
} from 'lucide-react';
import { 
  Area,
  AreaChart,
  CartesianGrid, 
  XAxis, 
  YAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';

const chartData = [
  { name: 'Jan', value: 130 },
  { name: 'Fev', value: 110 },
  { name: 'Mar', value: 90 },
  { name: 'Abr', value: 140 },
  { name: 'Mai', value: 135 },
  { name: 'Jun', value: 180 },
];

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types';

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { selectedEmpresaId, user } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    if (user && selectedEmpresaId) {
      fetchDashboardData();
    }
  }, [user, selectedEmpresaId]);

  const fetchDashboardData = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('empresa_id', selectedEmpresaId);
    
    if (data) setTransactions(data);
  };

  if (!isMounted) return null;

  // Filtragem Dinâmica
  const filteredTxs = transactions.filter(t => !selectedEmpresaId || t.empresa_id === selectedEmpresaId);

  // Cálculos de KPIs Reais
  const totalIncomes = filteredTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = filteredTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalIncomes - totalExpenses;
  const netMargin = totalIncomes > 0 ? (netProfit / totalIncomes) * 100 : 0;

  // Preparar dados do gráfico (últimos 6 meses simplificados)
  const chartData = [
    { name: 'Jan', value: totalIncomes * 0.4 },
    { name: 'Fev', value: totalIncomes * 0.3 },
    { name: 'Mar', value: totalIncomes * 0.5 },
    { name: 'Abr', value: totalIncomes * 0.45 },
    { name: 'Mai', value: totalIncomes * 0.7 },
    { name: 'Jun', value: totalIncomes },
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1500px] mx-auto space-y-8 animate-in fade-in duration-1000 bg-[#F9F9F9]/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-[#1A1A1A] font-title italic leading-none">Central de Indicadores</h1>
          <p className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-muted-foreground font-black mt-1">MÓDULO 4 • BUSINESS INTELLIGENCE & PERFORMANCE</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link href="/relatorios/dre" className="flex-1 md:flex-none">
            <Button variant="outline" className="w-full h-12 px-5 rounded-xl font-bold border-none bg-white shadow-sm text-foreground hover:bg-gray-50 flex gap-2 text-xs">
              <FileText size={16} /> Relatório
            </Button>
          </Link>
          <Link href="/lancamentos" className="flex-1 md:flex-none">
            <Button className="w-full h-12 px-6 rounded-xl font-black bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/10 text-xs">
              <Plus className="mr-2 h-4 w-4" strokeWidth={3} /> Lançamento
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'MARGEM LÍQUIDA', value: `${netMargin.toFixed(1)}%`, icon: Zap, color: '#A855F7', progress: netMargin, bg: '#F3E8FF' },
          { label: 'RESULTADO LÍQUIDO', value: netProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), icon: Activity, color: '#22C55E', sub: netProfit >= 0 ? 'LUCRO' : 'PREJUÍZO' },
          { label: 'RECEITA TOTAL', value: totalIncomes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), icon: Target, color: '#F97316', sub: 'ENTRADAS' },
          { label: 'DESPESA TOTAL', value: totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), icon: Shield, color: '#3B82F6', sub: 'SAÍDAS' },
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-[0_10px_30px_rgba(0,0,0,0.02)] rounded-[35px] p-6 bg-white group hover:shadow-xl transition-all duration-500">
            <div className="flex justify-between items-center mb-4">
              <p className="text-[8px] uppercase tracking-[0.2em] font-black text-muted-foreground">{item.label}</p>
              <item.icon size={16} style={{ color: item.color }} />
            </div>
            <h3 className="text-xl font-medium text-[#1A1A1A] mb-1 tracking-tighter font-sans not-italic truncate">{item.value}</h3>
            {item.progress !== undefined ? (
              <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden mt-2">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(Math.max(item.progress, 0), 100)}%`, backgroundColor: item.color }}></div>
              </div>
            ) : (
              <p className="text-[8px] font-black uppercase tracking-widest" style={{ color: item.color }}>{item.sub}</p>
            )}
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-[0_10px_30px_rgba(0,0,0,0.02)] rounded-[40px] p-8 md:p-10 bg-white relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] font-black text-muted-foreground mb-2">EVOLUÇÃO DO FLUXO DE CAIXA</p>
              <h2 className="text-3xl font-medium text-[#1A1A1A] tracking-tighter font-sans leading-none">{netProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
            </div>
            <div className="bg-[#F8F9FA] p-1.5 rounded-xl flex gap-1">
              <Button size="sm" className="bg-white text-[#1A1A1A] shadow-sm rounded-lg px-4 text-[10px] font-bold hover:bg-white">Mensal</Button>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '12px' }} />
                <Area type="monotone" dataKey="value" stroke="#1A1A1A" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-none shadow-[0_10px_30px_rgba(0,0,0,0.02)] rounded-[40px] p-8 md:p-10 bg-primary/10 flex flex-col">
          <div className="mb-6 text-[#1A1A1A]/30">
            <FileText size={32} strokeWidth={1} />
          </div>
          <h2 className="text-2xl font-medium text-[#1A1A1A] mb-3 tracking-tight leading-tight font-title italic">Distribuição de Receita</h2>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-8">
            Análise baseada em {filteredTxs.length} lançamentos.
          </p>
          
          <div className="space-y-8 mt-auto">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]">RECEITAS</p>
                <p className="text-[9px] font-black text-[#1A1A1A]">{totalIncomes > 0 ? '100%' : '0%'}</p>
              </div>
              <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
                <div className="h-full bg-[#1A1A1A]/10 rounded-full w-[100%]"></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end opacity-50">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]">DESPESAS</p>
                <p className="text-[9px] font-black text-[#1A1A1A]">{totalExpenses > 0 ? '100%' : '0%'}</p>
              </div>
              <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
                <div className="h-full bg-[#1A1A1A]/5 rounded-full w-[100%]"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

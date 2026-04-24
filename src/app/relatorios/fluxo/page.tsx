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
  Calendar,
  Filter,
  Download
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
import { Transaction } from '@/types';

export default function FluxoDeCaixaPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [initialBalance, setInitialBalance] = useState(15000);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTx = localStorage.getItem('stela_transactions');
    if (savedTx) setTransactions(JSON.parse(savedTx));

    // Buscar Saldo Inicial do Balanço (Disponibilidades)
    const savedBalance = localStorage.getItem('stela_balance_items');
    if (savedBalance) {
      const balanceItems = JSON.parse(savedBalance);
      const disponibilidades = balanceItems.find((i: any) => i.label.toLowerCase().includes('disponibilidade') || i.label.toLowerCase().includes('caixa'));
      if (disponibilidades) {
        setInitialBalance(disponibilidades.amount);
      }
    }
  }, []);

  if (!isMounted) return null;

  const incomes = transactions.filter(t => t.type === 'income' && t.status === 'pago').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense' && t.status === 'pago').reduce((acc, t) => acc + t.amount, 0);
  const netFlow = incomes - expenses;
  const finalBalance = initialBalance + netFlow;

  const chartData = [
    { name: 'Semana 1', value: initialBalance },
    { name: 'Semana 2', value: initialBalance + (incomes * 0.2) - (expenses * 0.1) },
    { name: 'Semana 3', value: initialBalance + (incomes * 0.5) - (expenses * 0.4) },
    { name: 'Semana 4', value: finalBalance },
  ];

  return (
    <div className="p-6 md:p-8 max-w-[1500px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header - Reduzido */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-medium tracking-tight text-foreground font-title italic leading-none">Fluxo de Caixa</h1>
          <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-black mt-2">Modelo 1.0 • Gestão Real</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-primary/20 bg-white h-11 px-4 font-bold text-xs" onClick={() => alert('Filtro de data em desenvolvimento.')}>
            <Calendar className="mr-2 h-3 w-3" /> Outubro 2023
          </Button>
          <Button className="rounded-xl bg-foreground text-background h-11 px-6 font-black hover:scale-105 transition-all text-xs" onClick={() => alert('Preparando PDF do Fluxo de Caixa...')}>
            <Download className="mr-2 h-3 w-3" /> PDF
          </Button>
        </div>
      </div>

      {/* Resumo - Reduzido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Saldo Inicial', value: initialBalance, color: 'text-foreground', bg: 'bg-muted' },
          { label: 'Total Entradas', value: incomes, color: 'text-primary-foreground', bg: 'bg-primary/20' },
          { label: 'Total Saídas', value: expenses, color: 'text-destructive', bg: 'bg-destructive/5' },
          { label: 'Saldo Final', value: finalBalance, color: 'text-foreground', bg: 'bg-foreground text-white' },
        ].map((item, i) => (
          <Card key={i} className={`border-none shadow-sm rounded-[28px] overflow-hidden ${item.bg}`}>
            <CardContent className="p-6">
              <p className={`text-[8px] uppercase tracking-widest font-black mb-1 ${i === 3 ? 'text-white/60' : 'text-muted-foreground'}`}>{item.label}</p>
              <h3 className={`text-2xl font-black ${i === 3 ? 'text-white' : item.color}`}>
                {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico - Reduzido */}
      <Card className="border-none shadow-[0_10px_30px_rgba(0,0,0,0.02)] rounded-[35px] p-8 md:p-10 bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-black tracking-tight">Evolução do Saldo</h3>
            <p className="text-[10px] text-muted-foreground font-medium">Movimentação real de disponibilidades</p>
          </div>
          <div className="flex bg-muted p-1 rounded-lg">
             <Button variant="ghost" size="sm" className="rounded-md font-bold bg-white shadow-sm text-[10px] px-3 h-8">Diário</Button>
             <Button variant="ghost" size="sm" className="rounded-md font-bold text-muted-foreground text-[10px] px-3 h-8">Mensal</Button>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.88 0.04 340)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="oklch(0.88 0.04 340)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="oklch(0.92 0.01 340)" />
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '12px' }} />
              <Area type="monotone" dataKey="value" stroke="oklch(0.5 0.02 340)" strokeWidth={3} fillOpacity={1} fill="url(#colorWave)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Tabela - Reduzida */}
      <Card className="border-none shadow-[0_10px_30px_rgba(0,0,0,0.02)] rounded-[35px] p-8 bg-white">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-lg font-black tracking-tight">Detalhamento de Caixa</h3>
           <Link href="/lancamentos">
             <Button variant="ghost" size="sm" className="text-primary-foreground font-black text-[9px] uppercase tracking-widest h-8">Ver Todos</Button>
           </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted-foreground text-[8px] uppercase tracking-widest border-b border-muted/50">
                <th className="pb-3 font-black">Data</th>
                <th className="pb-3 font-black">Descrição</th>
                <th className="pb-3 font-black">Categoria</th>
                <th className="pb-3 font-black text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/20">
              {transactions.filter(t => t.status === 'pago').slice(0, 5).map((tx) => (
                <tr key={tx.id} className="group">
                  <td className="py-4 text-[11px] font-bold text-muted-foreground">{tx.date}</td>
                  <td className="py-4 text-[11px] font-black text-foreground">{tx.description}</td>
                  <td className="py-4">
                    <span className="px-2 py-0.5 bg-muted rounded-md text-[8px] font-black uppercase text-muted-foreground">{tx.category}</span>
                  </td>
                  <td className={`py-4 text-right text-[11px] font-black ${tx.type === 'income' ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {tx.type === 'income' ? '+' : '-'} {tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, Calendar, ArrowUpRight, ArrowDownRight, Percent, Info } from 'lucide-react';
import { Transaction } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DREPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [viewMode, setViewMode] = useState<'value' | 'av'>('value');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('stela_transactions');
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  if (!isMounted) return null;

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const currentYear = new Date().getFullYear();

  const getAmount = (monthIndex: number, filter: (tx: Transaction) => boolean) => {
    return transactions
      .filter(tx => {
        const d = new Date(tx.date);
        return d.getMonth() === monthIndex && d.getFullYear() === currentYear && filter(tx);
      })
      .reduce((acc, tx) => acc + tx.amount, 0);
  };

  const calculateDRE = (monthIndex: number) => {
    const receitaBruta = getAmount(monthIndex, tx => tx.type === 'income');
    const impostosVenda = getAmount(monthIndex, tx => tx.category === 'Impostos');
    const receitaLiquida = receitaBruta - impostosVenda;
    const custos = getAmount(monthIndex, tx => ['Custos de Serviços', 'Materiais/Insumos'].includes(tx.category));
    const lucroBruto = receitaLiquida - custos;
    const despesasOperacionais = getAmount(monthIndex, tx => tx.type === 'expense' && !['Custos de Serviços', 'Materiais/Insumos', 'Impostos'].includes(tx.category));
    const ebitda = lucroBruto - despesasOperacionais;
    const lucroLiquido = ebitda; 

    return { receitaBruta, impostosVenda, receitaLiquida, custos, lucroBruto, despesasOperacionais, ebitda, lucroLiquido };
  };

  const rows = [
    { label: 'RECEITA OPERACIONAL BRUTA', key: 'receitaBruta', isTotal: true },
    { label: '(-) Impostos e Deduções', key: 'impostosVenda', indent: true },
    { label: '(=) RECEITA OPERACIONAL LÍQUIDA', key: 'receitaLiquida', isSubtotal: true },
    { label: '(-) Custos Diretos', key: 'custos', indent: true },
    { label: '(=) LUCRO BRUTO', key: 'lucroBruto', isSubtotal: true },
    { label: '(-) Despesas Administrativas', key: 'despesasOperacionais', indent: true },
    { label: '(=) EBITDA / RESULTADO', key: 'ebitda', isTotal: true, highlight: true },
  ];

  const formatValue = (val: number, base: number) => {
    if (viewMode === 'av') {
      if (base <= 0) return '0%';
      return `${((val / base) * 100).toFixed(1)}%`;
    }
    return val === 0 ? '-' : val.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  };

  return (
    <div className="p-6 md:p-8 max-w-[1500px] mx-auto w-full space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-medium tracking-tight text-foreground font-title italic leading-none">DRE Analítico</h2>
          <p className="text-muted-foreground font-black mt-2 uppercase text-[9px] tracking-widest">Visão de Competência • {currentYear}</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-muted p-1 rounded-xl flex border border-primary/5">
             <button onClick={() => setViewMode('value')} className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${viewMode === 'value' ? 'bg-white text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}>R$</button>
             <button onClick={() => setViewMode('av')} className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${viewMode === 'av' ? 'bg-white text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}>AV%</button>
          </div>
          <Button variant="outline" className="rounded-xl border-primary/10 bg-white h-10 px-4 font-black text-[9px] uppercase tracking-widest" onClick={() => alert('Gerando DRE Analítico...')}>
            <Download size={14} className="mr-2" /> PDF
          </Button>
        </div>
      </div>

      <Card className="bg-white rounded-[35px] border-none shadow-[0px_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted-foreground text-[9px] uppercase tracking-widest border-b border-muted/20">
                <th className="px-8 py-6 font-black min-w-[250px] sticky left-0 bg-white">Estrutura de Resultado</th>
                {months.map(m => (
                  <th key={m} className="px-4 py-6 font-black text-right">{m}</th>
                ))}
                <th className="px-8 py-6 font-black text-right bg-muted/30">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {rows.map((row, idx) => (
                <tr key={idx} className={`${row.isTotal ? 'bg-muted/10' : ''} ${row.highlight ? 'bg-primary/5' : ''} hover:bg-muted/20 transition-all group`}>
                  <td className={`px-8 py-4 text-xs sticky left-0 transition-colors ${row.isTotal ? 'font-black text-foreground' : 'font-bold text-muted-foreground'} ${row.indent ? 'pl-12' : ''} ${row.isTotal ? 'bg-muted/10' : row.highlight ? 'bg-primary/5' : 'bg-white'}`}>
                    {row.label}
                  </td>
                  {months.map((_, i) => {
                    const data = calculateDRE(i);
                    const val = data[row.key as keyof typeof data];
                    return (
                      <td key={i} className={`px-4 py-4 text-right text-xs font-black ${val < 0 ? 'text-red-400' : val > 0 && row.isTotal ? 'text-primary-foreground' : 'text-muted-foreground/70'}`}>
                        {formatValue(val, data.receitaBruta)}
                      </td>
                    );
                  })}
                  <td className={`px-8 py-4 text-right font-black text-xs bg-muted/30 ${row.isTotal ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {(() => {
                      const totalVal = months.reduce((acc, _, i) => acc + calculateDRE(i)[row.key as keyof ReturnType<typeof calculateDRE>], 0);
                      const totalReceita = months.reduce((acc, _, i) => acc + calculateDRE(i).receitaBruta, 0);
                      return formatValue(totalVal, totalReceita);
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Margem Líquida', value: '42.5%', sub: 'Eficiência de conversão', icon: Percent },
          { label: 'Custo de Vendas', value: '18.2%', sub: 'Impacto direto', icon: Info },
          { label: 'Ponto de Equilíbrio', value: 'R$ 15.2k', sub: 'Break-even mensal', icon: ArrowUpRight, highlight: true }
        ].map((insight, i) => (
          <Card key={i} className={`p-6 rounded-[30px] border-none shadow-sm flex items-start gap-4 ${insight.highlight ? 'bg-primary text-primary-foreground' : 'bg-white'}`}>
            <div className={`p-3 rounded-xl ${insight.highlight ? 'bg-white/20' : 'bg-muted'}`}>
              <insight.icon size={18} />
            </div>
            <div>
               <p className={`text-[9px] font-black uppercase tracking-widest ${insight.highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{insight.label}</p>
               <h4 className="text-2xl font-black tracking-tighter mt-1">{insight.value}</h4>
               <p className={`text-[10px] mt-1 ${insight.highlight ? 'text-primary-foreground/60' : 'text-muted-foreground/60'}`}>{insight.sub}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

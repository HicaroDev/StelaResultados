'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, Calendar, ArrowUpRight, ArrowDownRight, Percent, Info } from 'lucide-react';
import { Transaction } from '@/types';

export default function DREPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [viewMode, setViewMode] = useState<'value' | 'av'>('value');

  useEffect(() => {
    const saved = localStorage.getItem('stela_transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
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
    const impostosVenda = getAmount(monthIndex, tx => tx.category === 'Impostos sobre Venda');
    const receitaLiquida = receitaBruta - impostosVenda;
    
    const custos = getAmount(monthIndex, tx => ['Custos de Serviços', 'Materiais/Insumos'].includes(tx.category));
    const lucroBruto = receitaLiquida - custos;
    
    const despesasOperacionais = getAmount(monthIndex, tx => 
      tx.type === 'expense' && 
      !['Custos de Serviços', 'Materiais/Insumos', 'Impostos sobre Venda', 'Despesas Financeiras', 'IRPJ/CSLL'].includes(tx.category)
    );
    
    const ebitda = lucroBruto - despesasOperacionais;
    
    const resultadoFinanceiro = getAmount(monthIndex, tx => tx.category === 'Despesas Financeiras');
    const impostosLucro = getAmount(monthIndex, tx => tx.category === 'IRPJ/CSLL');
    
    const lucroLiquido = ebitda - resultadoFinanceiro - impostosLucro;

    return { 
      receitaBruta, 
      impostosVenda, 
      receitaLiquida, 
      custos, 
      lucroBruto, 
      despesasOperacionais, 
      ebitda, 
      resultadoFinanceiro, 
      impostosLucro, 
      lucroLiquido 
    };
  };

  const rows = [
    { label: 'RECEITA OPERACIONAL BRUTA', key: 'receitaBruta', isTotal: true },
    { label: '(-) Deduções e Impostos', key: 'impostosVenda', indent: true },
    { label: '(=) RECEITA OPERACIONAL LÍQUIDA', key: 'receitaLiquida', isSubtotal: true },
    { label: '(-) Custos de Vendas/Serviços', key: 'custos', indent: true },
    { label: '(=) LUCRO BRUTO', key: 'lucroBruto', isSubtotal: true },
    { label: '(-) Despesas Operacionais', key: 'despesasOperacionais', indent: true },
    { label: '(=) EBITDA (Gerencial)', key: 'ebitda', isSubtotal: true, highlight: true },
    { label: '(-) Resultado Financeiro', key: 'resultadoFinanceiro', indent: true },
    { label: '(-) Impostos sobre o Lucro', key: 'impostosLucro', indent: true },
    { label: '(=) LUCRO LÍQUIDO FINAL', key: 'lucroLiquido', isTotal: true, highlight: true },
  ];

  const formatValue = (val: number, base: number) => {
    if (viewMode === 'av') {
      if (base <= 0) return '0%';
      const av = (val / base) * 100;
      return `${av.toFixed(1)}%`;
    }
    return val === 0 ? '-' : val.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  return (
    <div className="p-10 max-w-[1600px] mx-auto w-full space-y-10 font-['Plus_Jakarta_Sans']">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-medium tracking-tight text-[#1A1A1A]">Demonstrativo de Resultado</h2>
          <p className="text-gray-400 font-bold mt-2 uppercase text-[10px] tracking-[0.2em]">P&L Elite • Visão de Competência • {currentYear}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-100 p-1 rounded-2xl flex border border-gray-200">
             <button 
              onClick={() => setViewMode('value')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'value' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-400'}`}
             >
               Valores (R$)
             </button>
             <button 
              onClick={() => setViewMode('av')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'av' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-400'}`}
             >
               Análise Vertical (AV%)
             </button>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-black text-gray-500 shadow-sm hover:shadow-md transition-all">
            <Download size={18} />
            Exportar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0px_4px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-[10px] uppercase tracking-[0.2em] border-b border-gray-50">
                <th className="px-10 py-8 font-black min-w-[350px] sticky left-0 bg-white z-10">Estrutura de Resultado</th>
                {months.map(m => (
                  <th key={m} className="px-6 py-8 font-black text-right">{m.substring(0, 3)}</th>
                ))}
                <th className="px-10 py-8 font-black text-right bg-gray-50/50 text-[#1A1A1A]">Total Ano</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row, idx) => (
                <tr key={idx} className={`${row.isTotal ? 'bg-gray-50/30' : ''} ${row.highlight ? 'bg-primary/10' : ''} hover:bg-gray-50/50 transition-all group`}>
                  <td className={`px-10 py-6 text-sm sticky left-0 z-10 transition-colors group-hover:bg-gray-50/50 ${row.isTotal ? 'font-black text-[#1A1A1A] text-base' : 'font-bold text-gray-500'} ${row.indent ? 'pl-16' : ''} ${row.isTotal ? 'bg-gray-50/30' : row.highlight ? 'bg-primary/10' : 'bg-white'}`}>
                    {row.label}
                  </td>
                  {months.map((_, i) => {
                    const data = calculateDRE(i);
                    const val = data[row.key as keyof typeof data];
                    return (
                      <td key={i} className={`px-6 py-6 text-right text-sm font-black ${val < 0 ? 'text-red-500' : val > 0 && (row.key === 'lucroLiquido' || row.key === 'ebitda') ? 'text-green-600' : 'text-gray-400'}`}>
                        {formatValue(val, data.receitaBruta)}
                      </td>
                    );
                  })}
                  <td className={`px-10 py-6 text-right font-black text-sm bg-gray-50/50 ${row.isTotal ? 'text-[#1A1A1A] text-base' : 'text-gray-600'}`}>
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
      </div>

      {/* DRE Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex items-start gap-5">
           <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
              <Percent size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Margem EBITDA</p>
              <h4 className="text-3xl font-black text-[#1A1A1A]">
                {(() => {
                   const totalEbitda = months.reduce((acc, _, i) => acc + calculateDRE(i).ebitda, 0);
                   const totalReceita = months.reduce((acc, _, i) => acc + calculateDRE(i).receitaBruta, 0);
                   return totalReceita > 0 ? `${((totalEbitda / totalReceita) * 100).toFixed(1)}%` : '0%';
                })()}
              </h4>
              <p className="text-xs text-gray-400 mt-2">Eficiência operacional antes de juros e impostos.</p>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex items-start gap-5">
           <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Info size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Custo de Vendas (AV)</p>
              <h4 className="text-3xl font-black text-[#1A1A1A]">
                {(() => {
                   const totalCustos = months.reduce((acc, _, i) => acc + calculateDRE(i).custos, 0);
                   const totalReceita = months.reduce((acc, _, i) => acc + calculateDRE(i).receitaBruta, 0);
                   return totalReceita > 0 ? `${((totalCustos / totalReceita) * 100).toFixed(1)}%` : '0%';
                })()}
              </h4>
              <p className="text-xs text-gray-400 mt-2">Impacto dos custos diretos sobre o faturamento.</p>
           </div>
        </div>

        <div className="bg-primary p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex items-start gap-5 border border-primary/20">
           <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-[#1A1A1A] shrink-0 z-10">
              <ArrowUpRight size={24} />
           </div>
           <div className="z-10">
              <p className="text-[10px] font-black text-black/50 uppercase tracking-widest mb-1">Lucro Líquido Real</p>
              <h4 className="text-4xl font-black text-[#1A1A1A]">
                R$ {months.reduce((acc, _, i) => acc + calculateDRE(i).lucroLiquido, 0).toLocaleString('pt-BR', { notation: 'compact' })}
              </h4>
              <p className="text-xs text-black/70 font-medium mt-2">O que realmente "sobrou" no bolso após todas as obrigações.</p>
           </div>
           <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
}

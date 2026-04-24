'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Download, TrendingUp, Landmark, Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { BalanceItem, BalanceCategory } from '@/types';

export default function BalancoPage() {
  const [items, setItems] = useState<BalanceItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<BalanceCategory>('Ativo Circulante');

  useEffect(() => {
    const saved = localStorage.getItem('stela_balance_items');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      // Dados iniciais sugeridos
      const initial: BalanceItem[] = [
        { id: '1', label: 'Caixa / Bancos', amount: 45200.00, category: 'Ativo Circulante', updatedAt: new Date().toISOString() },
        { id: '2', label: 'Contas a Receber', amount: 105030.00, category: 'Ativo Circulante', updatedAt: new Date().toISOString() },
        { id: '3', label: 'Imóveis / Sede', amount: 850000.00, category: 'Ativo Não Circulante', updatedAt: new Date().toISOString() },
        { id: '4', label: 'Fornecedores a Pagar', amount: 35400.00, category: 'Passivo Circulante', updatedAt: new Date().toISOString() },
        { id: '5', label: 'Empréstimos Bancários', amount: 350000.00, category: 'Passivo Não Circulante', updatedAt: new Date().toISOString() },
      ];
      setItems(initial);
      localStorage.setItem('stela_balance_items', JSON.stringify(initial));
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: BalanceItem = {
      id: Math.random().toString(36).substr(2, 9),
      label,
      amount: parseFloat(amount),
      category,
      updatedAt: new Date().toISOString()
    };

    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem('stela_balance_items', JSON.stringify(updated));
    
    setLabel('');
    setAmount('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem('stela_balance_items', JSON.stringify(updated));
  };

  const getCategoryTotal = (cat: BalanceCategory) => {
    return items.filter(i => i.category === cat).reduce((acc, i) => acc + i.amount, 0);
  };

  const totalAtivo = getCategoryTotal('Ativo Circulante') + getCategoryTotal('Ativo Não Circulante');
  const totalPassivo = getCategoryTotal('Passivo Circulante') + getCategoryTotal('Passivo Não Circulante');
  const patrimonioLiquido = totalAtivo - totalPassivo;

  return (
    <div className="p-10 max-w-[1400px] mx-auto w-full space-y-10 font-['Plus_Jakarta_Sans']">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-[#1A1A1A]">Balanço Patrimonial</h2>
          <p className="text-gray-400 font-bold mt-2 uppercase text-[10px] tracking-[0.2em]">Módulo 3 • Gestão de Ativos e Passivos</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-black text-gray-500 shadow-sm hover:shadow-md transition-all">
            <Download size={18} />
            Exportar
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-2xl text-sm font-black shadow-2xl shadow-gray-200 hover:-translate-y-1 transition-all"
          >
            <Plus size={18} />
            Novo Item
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descrição do Item</label>
              <input 
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-gray-50 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-gray-100 transition-all" 
                placeholder="Ex: Banco Itaú"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Saldo Atual (R$)</label>
              <input 
                required
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-50 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-gray-100 transition-all" 
                placeholder="0,00"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categoria</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as BalanceCategory)}
                className="w-full bg-gray-50 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-gray-100 transition-all"
              >
                <option value="Ativo Circulante">Ativo Circulante</option>
                <option value="Ativo Não Circulante">Ativo Não Circulante</option>
                <option value="Passivo Circulante">Passivo Circulante</option>
                <option value="Passivo Não Circulante">Passivo Não Circulante</option>
              </select>
            </div>
            <div className="flex gap-3">
               <button type="submit" className="flex-1 bg-[#1A1A1A] text-white py-4 rounded-2xl font-black text-sm hover:shadow-xl transition-all">
                  Adicionar
               </button>
               <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all"
               >
                 <X size={20} />
               </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LADO ESQUERDO: ATIVOS */}
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-green-50/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-green-600" size={24} />
                <h3 className="text-xl font-black text-[#1A1A1A]">Ativos (O que eu tenho)</h3>
              </div>
              <span className="text-lg font-black text-green-600">{totalAtivo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Ativo Circulante */}
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Ativo Circulante</h4>
                <div className="space-y-2">
                  {items.filter(i => i.category === 'Ativo Circulante').map(item => (
                    <div key={item.id} className="flex justify-between items-center py-3 group">
                      <span className="text-sm font-bold text-gray-600">{item.label}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-[#1A1A1A]">{item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between py-4 border-t border-dashed border-gray-100 mt-2">
                    <span className="text-xs font-black text-gray-400 uppercase">Subtotal Circulante</span>
                    <span className="text-xs font-black text-[#1A1A1A]">{getCategoryTotal('Ativo Circulante').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                </div>
              </div>

              {/* Ativo Não Circulante */}
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Ativo Não Circulante</h4>
                <div className="space-y-2">
                  {items.filter(i => i.category === 'Ativo Não Circulante').map(item => (
                    <div key={item.id} className="flex justify-between items-center py-3 group">
                      <span className="text-sm font-bold text-gray-600">{item.label}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-[#1A1A1A]">{item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between py-4 border-t border-dashed border-gray-100 mt-2">
                    <span className="text-xs font-black text-gray-400 uppercase">Subtotal Não Circulante</span>
                    <span className="text-xs font-black text-[#1A1A1A]">{getCategoryTotal('Ativo Não Circulante').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: PASSIVOS E PL */}
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-red-50/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Shield className="text-red-600" size={24} />
                <h3 className="text-xl font-black text-[#1A1A1A]">Passivos (O que eu devo)</h3>
              </div>
              <span className="text-lg font-black text-red-600">{totalPassivo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Passivo Circulante */}
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Passivo Circulante</h4>
                <div className="space-y-2">
                  {items.filter(i => i.category === 'Passivo Circulante').map(item => (
                    <div key={item.id} className="flex justify-between items-center py-3 group">
                      <span className="text-sm font-bold text-gray-600">{item.label}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-[#1A1A1A]">{item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between py-4 border-t border-dashed border-gray-100 mt-2">
                    <span className="text-xs font-black text-gray-400 uppercase">Subtotal Circulante</span>
                    <span className="text-xs font-black text-[#1A1A1A]">{getCategoryTotal('Passivo Circulante').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                </div>
              </div>

              {/* Passivo Não Circulante */}
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Passivo Não Circulante</h4>
                <div className="space-y-2">
                  {items.filter(i => i.category === 'Passivo Não Circulante').map(item => (
                    <div key={item.id} className="flex justify-between items-center py-3 group">
                      <span className="text-sm font-bold text-gray-600">{item.label}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-[#1A1A1A]">{item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between py-4 border-t border-dashed border-gray-100 mt-2">
                    <span className="text-xs font-black text-gray-400 uppercase">Subtotal Não Circulante</span>
                    <span className="text-xs font-black text-[#1A1A1A]">{getCategoryTotal('Passivo Não Circulante').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PATRIMÔNIO LÍQUIDO */}
          <div className="bg-[#1A1A1A] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-2">Patrimônio Líquido (PL)</p>
                <h4 className="text-4xl font-black">{patrimonioLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h4>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-2">Health Score</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">{(patrimonioLiquido > 0 ? 100 : 0)}</span>
                  <span className="text-sm opacity-50">/100</span>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* KPI Footer */}
      <div className="bg-gray-50 rounded-[40px] p-10 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-[#1A1A1A] flex items-center justify-center text-white shadow-xl shadow-gray-200">
            <Landmark size={32} />
          </div>
          <div>
            <h4 className="text-2xl font-black text-[#1A1A1A]">Liquidez Corrente: {(totalAtivo / (getCategoryTotal('Passivo Circulante') || 1)).toFixed(2)}</h4>
            <p className="text-gray-400 text-sm font-medium mt-1">Capacidade de pagamento a curto prazo baseada no seu ativo circulante.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Solvência Total</p>
              <p className="text-xl font-black text-[#1A1A1A]">{(totalAtivo / (totalPassivo || 1)).toFixed(2)}</p>
           </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Download, TrendingUp, Landmark, Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { BalanceItem, BalanceCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function BalancoPage() {
  const [items, setItems] = useState<BalanceItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<BalanceCategory>('Ativo Circulante');

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('stela_balance_items');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      const initial: BalanceItem[] = [
        { id: '1', label: 'Disponibilidades', amount: 45200.00, category: 'Ativo Circulante', updatedAt: new Date().toISOString() },
        { id: '2', label: 'Contas a Receber', amount: 105030.00, category: 'Ativo Circulante', updatedAt: new Date().toISOString() },
        { id: '3', label: 'Sede Própria', amount: 850000.00, category: 'Ativo Não Circulante', updatedAt: new Date().toISOString() },
        { id: '4', label: 'Fornecedores', amount: 35400.00, category: 'Passivo Circulante', updatedAt: new Date().toISOString() },
        { id: '5', label: 'Empréstimos', amount: 350000.00, category: 'Passivo Não Circulante', updatedAt: new Date().toISOString() },
      ];
      setItems(initial);
      localStorage.setItem('stela_balance_items', JSON.stringify(initial));
    }
  }, []);

  if (!isMounted) return null;

  const resetForm = () => {
    setLabel('');
    setAmount('');
    setCategory('Ativo Circulante');
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const updated = items.map(item => {
        if (item.id === editingId) {
          return { ...item, label, amount: parseFloat(amount), category, updatedAt: new Date().toISOString() };
        }
        return item;
      });
      setItems(updated);
      localStorage.setItem('stela_balance_items', JSON.stringify(updated));
    } else {
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
    }
    resetForm();
  };

  const handleEdit = (item: BalanceItem) => {
    setEditingId(item.id);
    setLabel(item.label);
    setAmount(item.amount.toString());
    setCategory(item.category);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja excluir este item?')) {
      const updated = items.filter(item => item.id !== id);
      setItems(updated);
      localStorage.setItem('stela_balance_items', JSON.stringify(updated));
    }
  };

  const getCategoryTotal = (cat: BalanceCategory) => {
    return items.filter(i => i.category === cat).reduce((acc, i) => acc + i.amount, 0);
  };

  const totalAtivo = getCategoryTotal('Ativo Circulante') + getCategoryTotal('Ativo Não Circulante');
  const totalPassivo = getCategoryTotal('Passivo Circulante') + getCategoryTotal('Passivo Não Circulante');
  const patrimonioLiquido = totalAtivo - totalPassivo;

  return (
    <div className="p-6 md:p-8 max-w-[1500px] mx-auto w-full space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-medium tracking-tight text-foreground font-title italic leading-none">Balanço Patrimonial</h2>
          <p className="text-muted-foreground font-black mt-2 uppercase text-[9px] tracking-widest">Módulo 3 • Posição Financeira</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest bg-white border-primary/10" onClick={() => alert('Exportando Balanço Patrimonial...')}>
            <Download size={14} className="mr-2" /> PDF
          </Button>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground h-10 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              <Plus size={14} className="mr-2" /> Novo Item
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <Card className="bg-white p-6 rounded-[30px] border-none shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
               {editingId ? 'Editar Item' : 'Novo Item do Balanço'}
             </h3>
             <button onClick={resetForm} className="p-1 hover:bg-muted rounded-lg transition-all"><X size={18} className="text-muted-foreground" /></button>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Descrição</label>
              <input required value={label} onChange={(e) => setLabel(e.target.value)} className="w-full bg-muted/30 border-transparent rounded-xl px-4 py-2.5 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" placeholder="Ex: Banco Itaú" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Valor (R$)</label>
              <input required type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-muted/30 border-transparent rounded-xl px-4 py-2.5 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" placeholder="0,00" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as BalanceCategory)} className="w-full bg-muted/30 border-transparent rounded-xl px-4 py-2.5 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all appearance-none">
                <option value="Ativo Circulante">Ativo Circulante</option>
                <option value="Ativo Não Circulante">Ativo Não Circulante</option>
                <option value="Passivo Circulante">Passivo Circulante</option>
                <option value="Passivo Não Circulante">Passivo Não Circulante</option>
              </select>
            </div>
            <div className="flex gap-2">
               <Button type="submit" className="flex-1 bg-foreground text-background h-10 rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all">
                 {editingId ? 'Salvar Alteração' : 'Adicionar'}
               </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ATIVOS */}
        <div className="space-y-6">
          <Card className="bg-white rounded-[35px] border-none shadow-[0px_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-8 py-5 border-b border-primary/5 bg-primary/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-primary-foreground" />
                <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Ativos (Tenho)</h3>
              </div>
              <span className="text-sm font-black text-primary-foreground">{totalAtivo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="p-8 space-y-6">
              {['Ativo Circulante', 'Ativo Não Circulante'].map((cat) => (
                <div key={cat}>
                  <h4 className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">{cat}</h4>
                  <div className="space-y-1">
                    {items.filter(i => i.category === cat).map(item => (
                      <div key={item.id} className="flex justify-between items-center py-2 group">
                        <span className="text-xs font-bold text-muted-foreground/80">{item.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-foreground">{item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                             <button onClick={() => handleEdit(item)} className="text-muted-foreground/20 hover:text-primary-foreground p-1.5 rounded-lg transition-all"><Edit3 size={12}/></button>
                             <button onClick={() => handleDelete(item.id)} className="text-muted-foreground/20 hover:text-red-400 p-1.5 rounded-lg transition-all"><Trash2 size={12}/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between py-3 border-t border-dashed border-muted/30 mt-1">
                      <span className="text-[9px] font-black text-muted-foreground uppercase">Subtotal {cat.split(' ')[1]}</span>
                      <span className="text-[9px] font-black text-foreground">{getCategoryTotal(cat as BalanceCategory).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* PASSIVOS */}
        <div className="space-y-6">
          <Card className="bg-white rounded-[35px] border-none shadow-[0px_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-8 py-5 border-b border-muted/10 bg-muted/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-muted-foreground" />
                <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Passivos (Devo)</h3>
              </div>
              <span className="text-sm font-black text-foreground">{totalPassivo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="p-8 space-y-6">
              {['Passivo Circulante', 'Passivo Não Circulante'].map((cat) => (
                <div key={cat}>
                  <h4 className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">{cat}</h4>
                  <div className="space-y-1">
                    {items.filter(i => i.category === cat).map(item => (
                      <div key={item.id} className="flex justify-between items-center py-2 group">
                        <span className="text-xs font-bold text-muted-foreground/80">{item.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-foreground">{item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                             <button onClick={() => handleEdit(item)} className="text-muted-foreground/20 hover:text-primary-foreground p-1.5 rounded-lg transition-all"><Edit3 size={12}/></button>
                             <button onClick={() => handleDelete(item.id)} className="text-muted-foreground/20 hover:text-red-400 p-1.5 rounded-lg transition-all"><Trash2 size={12}/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between py-3 border-t border-dashed border-muted/30 mt-1">
                      <span className="text-[9px] font-black text-muted-foreground uppercase">Subtotal {cat.split(' ')[1]}</span>
                      <span className="text-[9px] font-black text-foreground">{getCategoryTotal(cat as BalanceCategory).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-foreground rounded-[35px] p-8 text-background shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">Patrimônio Líquido</p>
                <h4 className="text-3xl font-black tracking-tighter">{patrimonioLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h4>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">Liquidez</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black">{(totalAtivo / (totalPassivo || 1)).toFixed(1)}</span>
                  <span className="text-[10px] opacity-40">x</span>
                </div>
              </div>
            </div>
            <div className="absolute -right-5 -bottom-5 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          </Card>
        </div>
      </div>
    </div>
  );
}

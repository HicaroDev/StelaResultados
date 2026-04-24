'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Trash2, 
  Edit3, 
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Ban
} from 'lucide-react';
import { Transaction, TransactionType, TransactionStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Categorias Oficiais (Serão movidas para o módulo de Cadastro na Fase 1.2)
const OFFICIAL_CATEGORIES = [
  'Receita de Vendas',
  'Receita de Serviços',
  'Custos de Serviços',
  'Materiais/Insumos',
  'Impostos',
  'Marketing',
  'Pro-labore',
  'Aluguel/Sede',
  'Software/SaaS',
  'Outros'
];

export default function LancamentosPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Form states
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(OFFICIAL_CATEGORIES[0]);
  const [type, setType] = useState<TransactionType>('expense');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<TransactionStatus>('pendente');

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('stela_transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  if (!isMounted) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const txData = {
      description,
      amount: parseFloat(amount),
      category,
      type,
      date: new Date().toISOString().split('T')[0],
      dueDate,
      status
    };

    if (editingId) {
      const updated = transactions.map(t => t.id === editingId ? { ...t, ...txData } : t);
      setTransactions(updated);
      localStorage.setItem('stela_transactions', JSON.stringify(updated));
    } else {
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        ...txData
      };
      const updated = [newTx, ...transactions];
      setTransactions(updated);
      localStorage.setItem('stela_transactions', JSON.stringify(updated));
    }

    resetForm();
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory(OFFICIAL_CATEGORIES[0]);
    setType('expense');
    setDueDate('');
    setStatus('pendente');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (tx: Transaction) => {
    setEditingId(tx.id);
    setDescription(tx.description);
    setAmount(tx.amount.toString());
    setCategory(tx.category);
    setType(tx.type);
    setDueDate(tx.dueDate || '');
    setStatus(tx.status);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja excluir este lançamento?')) {
      const updated = transactions.filter(t => t.id !== id);
      setTransactions(updated);
      localStorage.setItem('stela_transactions', JSON.stringify(updated));
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'pago':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest"><CheckCircle2 size={12}/> Pago</span>;
      case 'atrasado':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest"><AlertCircle size={12}/> Atrasado</span>;
      case 'cancelado':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-[9px] font-black uppercase tracking-widest"><Ban size={12}/> Cancelado</span>;
      default:
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest"><Clock size={12}/> Pendente</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1500px] mx-auto w-full space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-medium tracking-tight text-foreground font-title italic leading-none">Lançamentos</h2>
          <p className="text-muted-foreground font-black mt-2 uppercase text-[9px] tracking-widest">Módulo 1 • Gestão de Fluxo v1.20</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground h-11 px-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-all">
            <Plus size={16} className="mr-2" strokeWidth={3} /> Novo Lançamento
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="bg-white p-8 rounded-[40px] border-none shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em]">{editingId ? 'Editar Lançamento' : 'Novo Lançamento'}</h3>
            <button onClick={resetForm} className="p-2 hover:bg-muted rounded-full transition-all"><X size={20} className="text-muted-foreground" /></button>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Descrição</label>
              <input required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-muted/30 border-none rounded-2xl px-5 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Ex: Assinatura Software" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Valor (R$)</label>
              <input required type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-muted/30 border-none rounded-2xl px-5 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="0,00" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-muted/30 border-none rounded-2xl px-5 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none">
                {OFFICIAL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Tipo</label>
              <div className="flex gap-2 p-1 bg-muted/30 rounded-2xl">
                <button type="button" onClick={() => setType('income')} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Receita</button>
                <button type="button" onClick={() => setType('expense')} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Despesa</button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Vencimento</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full bg-muted/30 border-none rounded-2xl px-5 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as TransactionStatus)} className="w-full bg-muted/30 border-none rounded-2xl px-5 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none">
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="atrasado">Atrasado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div className="md:col-span-3 pt-4">
              <Button type="submit" className="w-full bg-foreground text-background h-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.01] transition-all">
                {editingId ? 'Salvar Alterações' : 'Confirmar Lançamento'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="bg-white rounded-[45px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-muted/20">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input className="w-full bg-muted/30 border-none rounded-2xl pl-12 pr-4 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/10 transition-all" placeholder="Buscar lançamentos..." />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl border-muted/50 h-10 px-4 text-[9px] font-black uppercase tracking-widest"><Filter size={14} className="mr-2"/> Filtros</Button>
            <Button variant="outline" className="rounded-xl border-muted/50 h-10 px-4 text-[9px] font-black uppercase tracking-widest"><Download size={14} className="mr-2"/> Exportar</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground font-black border-b border-muted/10 bg-muted/5">
                <th className="px-10 py-5">Status</th>
                <th className="px-6 py-5">Data / Venc.</th>
                <th className="px-6 py-5">Descrição</th>
                <th className="px-6 py-5">Categoria</th>
                <th className="px-6 py-5 text-right">Valor</th>
                <th className="px-10 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {transactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-muted/5 transition-all">
                  <td className="px-10 py-5">{getStatusBadge(tx.status)}</td>
                  <td className="px-6 py-5">
                    <p className="text-[11px] font-black text-foreground">{tx.date}</p>
                    <p className="text-[9px] text-muted-foreground font-bold">{tx.dueDate || 'Sem data'}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[11px] font-black text-foreground">{tx.description}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-muted/50 rounded-lg text-[9px] font-black uppercase tracking-widest text-muted-foreground">{tx.category}</span>
                  </td>
                  <td className={`px-6 py-5 text-right text-xs font-black ${tx.type === 'income' ? 'text-emerald-600' : 'text-foreground'}`}>
                    {tx.type === 'income' ? '+' : '-'} {tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-10 py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleEdit(tx)} className="p-2 text-muted-foreground hover:text-primary-foreground hover:bg-primary/5 rounded-xl transition-all"><Edit3 size={14}/></button>
                      <button onClick={() => handleDelete(tx.id)} className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center">
                    <p className="text-xs font-bold text-muted-foreground">Nenhum lançamento encontrado.</p>
                    <Button variant="ghost" onClick={() => setShowForm(true)} className="mt-4 text-[9px] font-black uppercase tracking-widest">Criar primeiro lançamento</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

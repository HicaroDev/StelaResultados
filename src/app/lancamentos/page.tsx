'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpCircle, 
  ArrowDownCircle,
  MoreVertical,
  Calendar,
  Tag,
  DollarSign,
  CheckCircle2,
  Clock,
  Trash2,
  Receipt,
  Edit3,
  X
} from 'lucide-react';
import { Transaction } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LancamentosPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'pago' | 'pendente'>('pago');

  useEffect(() => {
    const saved = localStorage.getItem('stela_transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      const initial: Transaction[] = [
        { id: '1', description: 'Assinatura Software', category: 'Tecnologia/Software', amount: 499.00, date: '2023-10-24', dueDate: '2023-10-25', status: 'pago', type: 'expense' },
        { id: '2', description: 'Consultoria Estratégica', category: 'Receita de Serviços', amount: 5000.00, date: '2023-10-23', dueDate: '2023-10-23', status: 'pago', type: 'income' },
      ];
      setTransactions(initial);
      localStorage.setItem('stela_transactions', JSON.stringify(initial));
    }
  }, []);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('');
    setType('expense');
    setDueDate(new Date().toISOString().split('T')[0]);
    setStatus('pago');
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing
      const updated = transactions.map(tx => {
        if (tx.id === editingId) {
          return {
            ...tx,
            description,
            category,
            amount: parseFloat(amount),
            dueDate,
            status,
            type,
            paymentDate: status === 'pago' ? new Date().toISOString().split('T')[0] : undefined
          };
        }
        return tx;
      });
      setTransactions(updated);
      localStorage.setItem('stela_transactions', JSON.stringify(updated));
    } else {
      // Create new
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        description,
        category,
        amount: parseFloat(amount),
        date: new Date().toISOString().split('T')[0],
        dueDate,
        status,
        type,
        paymentDate: status === 'pago' ? new Date().toISOString().split('T')[0] : undefined
      };
      const updated = [newTx, ...transactions];
      setTransactions(updated);
      localStorage.setItem('stela_transactions', JSON.stringify(updated));
    }
    
    resetForm();
  };

  const handleEdit = (tx: Transaction) => {
    setEditingId(tx.id);
    setDescription(tx.description);
    setAmount(tx.amount.toString());
    setCategory(tx.category);
    setType(tx.type);
    setDueDate(tx.dueDate);
    setStatus(tx.status);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja realmente excluir este lançamento?')) {
      const updated = transactions.filter(tx => tx.id !== id);
      setTransactions(updated);
      localStorage.setItem('stela_transactions', JSON.stringify(updated));
    }
  };

  const toggleStatus = (id: string) => {
    const updated = transactions.map(tx => {
      if (tx.id === id) {
        const newStatus = tx.status === 'pago' ? 'pendente' : 'pago';
        return { 
          ...tx, 
          status: newStatus as 'pago' | 'pendente',
          paymentDate: newStatus === 'pago' ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return tx;
    });
    setTransactions(updated);
    localStorage.setItem('stela_transactions', JSON.stringify(updated));
  };

  return (
    <div className="p-6 md:p-8 max-w-[1500px] mx-auto w-full space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-medium tracking-tight text-foreground font-title italic leading-none">Movimentações</h2>
          <p className="text-muted-foreground font-black mt-2 uppercase text-[9px] tracking-widest">Módulo 1 • Gestão de Lançamentos</p>
        </div>
        {!showForm && (
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-primary text-primary-foreground h-11 px-6 rounded-xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all text-xs"
          >
            <Plus size={16} className="mr-2" /> Novo Lançamento
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="bg-white p-8 rounded-[35px] border-none shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-foreground tracking-tight">
              {editingId ? 'Editar Lançamento' : 'Novo Lançamento'}
            </h3>
            <button onClick={resetForm} className="p-2 hover:bg-muted rounded-full transition-all">
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Descrição</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={14} />
                  <input 
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-muted/30 border-transparent rounded-xl pl-11 py-3 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all" 
                    placeholder="Ex: Assinatura Mensal"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Valor (R$)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={14} />
                  <input 
                    required
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-muted/30 border-transparent rounded-xl pl-11 py-3 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all" 
                    placeholder="0,00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Categoria</label>
                <select 
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-muted/30 border-transparent rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                >
                  <option value="">Selecione...</option>
                  <optgroup label="Receitas">
                    <option value="Receita de Serviços">Receita de Serviços</option>
                    <option value="Receita de Vendas">Receita de Vendas</option>
                    <option value="Outras Receitas">Outras Receitas</option>
                  </optgroup>
                  <optgroup label="Custos e Despesas">
                    <option value="Custos de Serviços">Custos de Serviços</option>
                    <option value="Materiais/Insumos">Materiais/Insumos</option>
                    <option value="Salários/Encargos">Salários/Encargos</option>
                    <option value="Aluguel/Infra">Aluguel/Infra</option>
                    <option value="Marketing/Vendas">Marketing/Vendas</option>
                    <option value="Tecnologia/Software">Tecnologia/Software</option>
                    <option value="Impostos">Impostos</option>
                    <option value="Outras Despesas">Outras Despesas</option>
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Data de Vencimento</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={14} />
                  <input 
                    required
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-muted/30 border-transparent rounded-xl pl-11 py-3 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all" 
                  />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Tipo & Status</label>
                <div className="flex gap-2">
                   <div className="flex bg-muted p-1 rounded-xl flex-1 border border-primary/5">
                      <button type="button" onClick={() => setType('income')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${type === 'income' ? 'bg-white text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}>Entrada</button>
                      <button type="button" onClick={() => setType('expense')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${type === 'expense' ? 'bg-white text-red-500 shadow-sm' : 'text-muted-foreground'}`}>Saída</button>
                   </div>
                   <div className="flex bg-muted p-1 rounded-xl flex-1 border border-primary/5">
                      <button type="button" onClick={() => setStatus('pago')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${status === 'pago' ? 'bg-white text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}>Pago</button>
                      <button type="button" onClick={() => setStatus('pendente')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${status === 'pendente' ? 'bg-white text-orange-500 shadow-sm' : 'text-muted-foreground'}`}>Pendente</button>
                   </div>
                </div>
              </div>
              <div className="flex gap-2">
                 <Button type="submit" className="bg-foreground text-background px-8 h-11 rounded-xl font-black text-xs hover:scale-105 transition-all">
                   {editingId ? 'Salvar Alterações' : 'Salvar Registro'}
                 </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      <Card className="bg-white rounded-[35px] border-none shadow-[0px_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-8 border-b border-muted/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary-foreground transition-colors" size={16} />
            <input placeholder="Pesquisar..." className="w-full bg-muted/30 border-none rounded-xl pl-11 py-3 text-xs focus:ring-2 focus:ring-primary/10 font-bold placeholder:text-muted-foreground/50" />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="text-muted-foreground font-black text-[9px] uppercase tracking-widest h-10 px-4 bg-muted/30 hover:bg-muted/50 rounded-lg">
              <Filter size={14} className="mr-2" /> Filtrar
            </Button>
            <Button variant="ghost" className="text-muted-foreground font-black text-[9px] uppercase tracking-widest h-10 px-4 bg-muted/30 hover:bg-muted/50 rounded-lg">
              <Calendar size={14} className="mr-2" /> Outubro
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted-foreground text-[9px] uppercase tracking-widest border-b border-muted/20">
                <th className="px-8 py-4 font-black">Status</th>
                <th className="px-8 py-4 font-black">Descrição</th>
                <th className="px-8 py-4 font-black">Vencimento</th>
                <th className="px-8 py-4 text-right">Valor</th>
                <th className="px-8 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-muted/10 transition-all group">
                  <td className="px-8 py-5">
                    <button onClick={() => toggleStatus(tx.id)} className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${tx.status === 'pago' ? 'bg-primary/20 text-primary-foreground' : 'bg-orange-50 text-orange-500'}`}>
                      {tx.status === 'pago' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      <span className="text-[9px] font-black uppercase tracking-wider">{tx.status}</span>
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-xs text-foreground">{tx.description}</span>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{tx.category}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-muted-foreground">{tx.dueDate}</span>
                  </td>
                  <td className={`px-8 py-5 text-right font-black text-sm ${tx.type === 'income' ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {tx.type === 'income' ? '+' : '-'} {tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(tx)} 
                        title="Editar"
                        className="text-muted-foreground/40 hover:text-primary-foreground p-2 rounded-lg hover:bg-primary/10 transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(tx.id)} 
                        title="Excluir"
                        className="text-muted-foreground/40 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Receipt size={40} className="text-muted/30" />
                      <p className="text-xs font-bold text-muted-foreground">Nenhum lançamento registrado.</p>
                    </div>
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

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
  Trash2
} from 'lucide-react';
import { Transaction } from '@/types';

export default function LancamentosPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'pago' | 'pendente'>('pago');

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('stela_transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      const initial: Transaction[] = [
        { id: '1', description: 'Mensalidade Software', category: 'Tecnologia/Software', amount: 499.00, date: '2023-10-24', dueDate: '2023-10-25', status: 'pago', type: 'expense' },
        { id: '2', description: 'Consultoria Financeira', category: 'Receita de Serviços', amount: 5000.00, date: '2023-10-23', dueDate: '2023-10-23', status: 'pago', type: 'income' },
      ];
      setTransactions(initial);
      localStorage.setItem('stela_transactions', JSON.stringify(initial));
    }
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
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
    
    // Limpar form
    setDescription('');
    setAmount('');
    setCategory('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este lançamento?')) {
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
    <div className="p-10 max-w-[1400px] mx-auto w-full space-y-10 font-['Plus_Jakarta_Sans']">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-[#1A1A1A]">Fluxo de Caixa</h2>
          <p className="text-gray-400 font-bold mt-2 uppercase text-[10px] tracking-[0.2em]">Módulo 1 • Gestão de Lançamentos</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-4 bg-[#1A1A1A] text-white rounded-2xl text-sm font-black shadow-2xl shadow-gray-200 hover:-translate-y-1 transition-all active:scale-95"
        >
          <Plus size={18} />
          Novo Lançamento
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleAdd} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descrição</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-50 border-transparent rounded-2xl pl-12 py-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-gray-100 transition-all" 
                    placeholder="Ex: Pagamento Fornecedor"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Valor (R$)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    required
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-50 border-transparent rounded-2xl pl-12 py-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-gray-100 transition-all" 
                    placeholder="0,00"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categoria</label>
                <select 
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-gray-100 transition-all appearance-none"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
               <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Data de Vencimento</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    required
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-gray-50 border-transparent rounded-2xl pl-12 py-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-gray-100 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tipo & Status</label>
                <div className="flex gap-3">
                   <div className="flex bg-gray-50 p-1.5 rounded-2xl flex-1 border border-gray-100">
                      <button 
                        type="button"
                        onClick={() => setType('income')}
                        className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
                      >
                        Entrada
                      </button>
                      <button 
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}
                      >
                        Saída
                      </button>
                   </div>
                   <div className="flex bg-gray-50 p-1.5 rounded-2xl flex-1 border border-gray-100">
                      <button 
                        type="button"
                        onClick={() => setStatus('pago')}
                        className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${status === 'pago' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                      >
                        Pago
                      </button>
                      <button 
                        type="button"
                        onClick={() => setStatus('pendente')}
                        className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${status === 'pendente' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400'}`}
                      >
                        Pendente
                      </button>
                   </div>
                </div>
              </div>
              <div className="flex gap-4">
                 <button type="submit" className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-black text-sm hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95">
                    Salvar Lançamento
                 </button>
                 <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0px_4px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1A1A1A] transition-colors" size={18} />
            <input 
              placeholder="Pesquisar por descrição..." 
              className="w-full bg-gray-50 border-none rounded-2xl pl-14 py-4 text-sm focus:ring-2 focus:ring-gray-100 font-bold placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-3 px-5 py-3 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-[#1A1A1A] transition-all bg-gray-50 rounded-xl">
              <Filter size={16} />
              Filtrar Status
            </button>
            <button className="flex items-center gap-3 px-5 py-3 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-[#1A1A1A] transition-all bg-gray-50 rounded-xl">
              <Calendar size={16} />
              Outubro 2023
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-[10px] uppercase tracking-[0.2em] border-b border-gray-50">
                <th className="px-10 py-6 font-black">Status</th>
                <th className="px-10 py-6 font-black">Descrição / Categoria</th>
                <th className="px-10 py-6 font-black">Vencimento</th>
                <th className="px-10 py-6 font-black text-right">Valor</th>
                <th className="px-10 py-6 font-black"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-10 py-6">
                    <button 
                      onClick={() => toggleStatus(tx.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                        tx.status === 'pago' 
                          ? 'bg-green-50 text-green-600' 
                          : 'bg-orange-50 text-orange-500'
                      }`}
                    >
                      {tx.status === 'pago' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                      <span className="text-[10px] font-black uppercase tracking-wider">{tx.status}</span>
                    </button>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-sm text-[#1A1A1A]">{tx.description}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{tx.category}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-600">{tx.dueDate}</span>
                      {tx.paymentDate && (
                        <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Pago em: {tx.paymentDate}</span>
                      )}
                    </div>
                  </td>
                  <td className={`px-10 py-6 text-right font-black text-base ${tx.type === 'income' ? 'text-green-600' : 'text-[#1A1A1A]'}`}>
                    {tx.type === 'income' ? '+' : '-'} {tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDelete(tx.id)}
                        className="text-gray-300 hover:text-red-500 transition-all p-2 rounded-xl hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button className="text-gray-300 hover:text-[#1A1A1A] transition-all p-2 rounded-xl hover:bg-gray-100">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-200">
                        <Receipt className="w-10 h-10" />
                      </div>
                      <p className="text-gray-400 font-bold text-sm">Nenhum lançamento encontrado.</p>
                      <button 
                        onClick={() => setShowForm(true)}
                        className="text-xs font-black text-[#1A1A1A] underline decoration-2 underline-offset-4"
                      >
                        Adicionar seu primeiro registro
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import { Receipt } from 'lucide-react';

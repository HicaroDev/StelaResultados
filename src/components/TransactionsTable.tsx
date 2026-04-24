import React from 'react';
import { Cloud, Briefcase, Building2, CreditCard, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Transaction } from '@/types';

interface Props {
  transactions: Transaction[];
}

export default function TransactionsTable({ transactions }: Props) {
  return (
    <section className="bg-white rounded-[40px] shadow-[0px_4px_20px_rgba(139,126,149,0.05)] border border-gray-100 overflow-hidden">
      <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center">
        <h4 className="text-xl font-black text-[#1A1A1A] tracking-tight">Recent Transactions</h4>
        <button className="text-sm font-bold text-gray-400 hover:text-[#1A1A1A] transition-all">View All Activity</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-gray-50">
              <th className="px-10 py-5">ENTITY / DESCRIPTION</th>
              <th className="px-10 py-5">CATEGORY</th>
              <th className="px-10 py-5">DATE</th>
              <th className="px-10 py-5 text-right">AMOUNT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.slice(0, 5).map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/50 transition-all group cursor-pointer">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                      {t.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#1A1A1A]">{t.description}</p>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Transaction ID: {t.id.substring(0, 8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-400">
                    {t.category}
                  </span>
                </td>
                <td className="px-10 py-6 text-sm text-gray-400 font-medium">{t.date}</td>
                <td className={`px-10 py-6 text-right font-black text-sm ${t.type === 'income' ? 'text-green-600' : 'text-[#1A1A1A]'}`}>
                  {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-10 py-20 text-center text-gray-400 font-medium">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

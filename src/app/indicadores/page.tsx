'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  Info,
  Calendar,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';
import { Transaction, BalanceItem } from '@/types';

export default function IndicadoresPage() {
  const [activeTab, setActiveTab] = useState<'relatorio' | 'dashboard'>('relatorio');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balanceItems, setBalanceItems] = useState<BalanceItem[]>([]);

  useEffect(() => {
    const txs = localStorage.getItem('stela_transactions');
    const items = localStorage.getItem('stela_balance_items');
    if (txs) setTransactions(JSON.parse(txs));
    if (items) setBalanceItems(JSON.parse(items));
  }, []);

  // Cálculos Básicos
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const netMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  const ativoCirculante = balanceItems.filter(i => i.category === 'Ativo Circulante').reduce((acc, i) => acc + i.amount, 0);
  const passivoCirculante = balanceItems.filter(i => i.category === 'Passivo Circulante').reduce((acc, i) => acc + i.amount, 0);
  const currentLiquidity = passivoCirculante > 0 ? ativoCirculante / passivoCirculante : 0;

  const breakEven = 15000; // Simulado com base em custos fixos

  const dataChart = [
    { name: 'Jan', receita: 4000, despesa: 2400 },
    { name: 'Fev', receita: 3000, despesa: 1398 },
    { name: 'Mar', receita: 2000, despesa: 9800 },
    { name: 'Abr', receita: 2780, despesa: 3908 },
    { name: 'Mai', receita: 1890, despesa: 4800 },
    { name: 'Jun', receita: 2390, despesa: 3800 },
  ];

  return (
    <div className="p-10 max-w-[1600px] mx-auto w-full space-y-10 font-['Plus_Jakarta_Sans']">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-medium tracking-tight text-[#1A1A1A]">Inteligência de Indicadores</h2>
          <p className="text-gray-400 font-bold mt-2 uppercase text-[10px] tracking-[0.2em]">Módulo 4 • Performance & Dashboards</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-gray-100 p-1.5 rounded-2xl flex border border-gray-200">
              <button 
                onClick={() => setActiveTab('relatorio')}
                className={`flex items-center gap-2 px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'relatorio' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-400'}`}
              >
                <FileText size={14} />
                Relatório
              </button>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-400'}`}
              >
                <BarChart3 size={14} />
                Dashboard
              </button>
           </div>
        </div>
      </div>

      {/* 3 POWER CARDS NO TOPO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Liquidez Corrente</p>
              <h3 className="text-4xl font-black text-[#1A1A1A]">{currentLiquidity.toFixed(2)}</h3>
              <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-green-500 uppercase">
                 <ShieldCheck size={14} /> Segurança Alta
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
          </div>
          <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl"></div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Margem Líquida</p>
              <h3 className="text-4xl font-black text-[#1A1A1A]">{netMargin.toFixed(1)}%</h3>
              <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-purple-500 uppercase">
                 <TrendingUp size={14} /> Rentabilidade Ideal
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-[#1A1A1A] group-hover:scale-110 transition-transform shadow-lg shadow-black/5">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Ponto de Equilíbrio</p>
              <h3 className="text-4xl font-black text-[#1A1A1A]">R$ {breakEven.toLocaleString('pt-BR', { notation: 'compact' })}</h3>
              <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-orange-500 uppercase">
                 <Target size={14} /> Meta Mensal
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
              <Target size={24} />
            </div>
          </div>
          <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-orange-50/50 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* CONTEÚDO DAS ABAS */}
      {activeTab === 'relatorio' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* TEXTO DE ANÁLISE */}
           <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
              <div>
                <h4 className="text-2xl font-black text-[#1A1A1A] mb-4">Análise de Performance</h4>
                <p className="text-gray-500 leading-relaxed font-medium">
                  Com base nos dados atuais, sua empresa apresenta uma **Liquidez Corrente de {currentLiquidity.toFixed(2)}**, 
                  o que significa que para cada R$ 1,00 de dívida, você possui R$ {currentLiquidity.toFixed(2)} em caixa ou bens conversíveis. 
                  Este é um cenário de **Alta Segurança Financeira**.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 italic text-gray-500 text-sm">
                "Sua Margem Líquida está em {netMargin.toFixed(1)}%. O mercado de tecnologia/serviços opera entre 15% e 25%, você está dentro da zona de excelência."
              </div>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-sm font-bold text-[#1A1A1A]">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Fluxo de Caixa Positivo nos últimos 3 meses.
                 </div>
                 <div className="flex items-center gap-3 text-sm font-bold text-[#1A1A1A]">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    Concentração de custos em Materiais (22% da receita).
                 </div>
              </div>
           </div>

           {/* DETALHAMENTO DE INDICADORES */}
           <div className="space-y-6">
              {[
                { label: 'Margem Bruta', val: '65.4%', desc: 'Lucro após custos diretos de serviços.' },
                { label: 'ROI Estimado', val: '12.8%', desc: 'Retorno sobre o patrimônio líquido total.' },
                { label: 'Individamento', val: '14.2%', desc: 'Relação entre Capital de Terceiros e PL.' },
                { label: 'Giro de Ativo', val: '0.8x', desc: 'Eficiência no uso dos ativos para gerar receita.' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 flex justify-between items-center group hover:border-primary/30 transition-all cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <Info size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#1A1A1A]">{item.label}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-[#1A1A1A]">{item.val}</span>
                </div>
              ))}
           </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* GRÁFICO 1: RECEITA VS DESPESA */}
              <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                 <div className="flex justify-between items-center mb-10">
                    <h4 className="text-xl font-black text-[#1A1A1A]">Receita vs Despesa</h4>
                    <Calendar size={18} className="text-gray-300" />
                 </div>
                 <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={dataChart}>
                          <defs>
                            <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#e295a0" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#e295a0" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                          <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 800}} />
                          <Area type="monotone" dataKey="receita" stroke="#e295a0" fillOpacity={1} fill="url(#colorRec)" strokeWidth={3} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* GRÁFICO 2: BREAK-EVEN REACH */}
              <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                 <div className="flex justify-between items-center mb-10">
                    <h4 className="text-xl font-black text-[#1A1A1A]">Progresso Ponto de Equilíbrio</h4>
                    <Target size={18} className="text-gray-300" />
                 </div>
                 <div className="flex flex-col items-center justify-center h-72 space-y-6">
                    <div className="relative w-48 h-48">
                       <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                             <Pie
                                data={[
                                  { name: 'Faturado', value: 75 },
                                  { name: 'Restante', value: 25 },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                             >
                                <Cell fill="#e295a0" />
                                <Cell fill="#f6f6f6" />
                             </Pie>
                          </RePieChart>
                       </ResponsiveContainer>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black text-[#1A1A1A]">75%</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">da Meta</span>
                       </div>
                    </div>
                    <p className="text-sm font-bold text-gray-500 text-center px-10">
                      Você precisa de mais **R$ 3.750,00** para atingir o ponto de equilíbrio deste mês.
                    </p>
                 </div>
              </div>
           </div>

           {/* FOOTER DASHBOARD */}
           <div className="bg-[#1A1A1A] p-10 rounded-[40px] text-white flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <h5 className="text-2xl font-black mb-2 font-title italic">Insight da Stela</h5>
                <p className="text-white/50 text-sm font-medium">"Seu custo operacional caiu 5% este mês. Excelente momento para investir em Marketing."</p>
              </div>
              <button className="px-8 py-4 bg-primary text-[#1A1A1A] rounded-2xl font-black text-xs hover:bg-white transition-all shadow-xl shadow-primary/20">
                 Gerar Planejamento
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

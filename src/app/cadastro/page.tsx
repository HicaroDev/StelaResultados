'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  X,
  Settings,
  Database,
  Building2,
  Tags,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Edit3 } from 'lucide-react';

interface RegistryItem {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
  metadata?: any;
}

export default function CadastroPage() {
  const [activeTab, setActiveTab] = useState('empresa');
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [formData, setFormData] = useState<any>({});
  const { user, selectedEmpresaId, isAdmin, profile, empresas } = useAuth();

  const tabs = [
    { id: 'empresa', label: 'Empresas', icon: Building2 },
    { id: 'cliente', label: 'Clientes', icon: Tags },
    { id: 'fornecedor', label: 'Fornecedores', icon: Tags },
    { id: 'banco', label: 'Bancos', icon: Building2 },
    { id: 'centro_custo', label: 'Centro de Custos', icon: Settings },
    { id: 'plano_contas', label: 'Plano de Contas', icon: Database },
  ];

  useEffect(() => {
    if (user) fetchItems();
  }, [activeTab, selectedEmpresaId, user]);

  const fetchItems = async () => {
    setLoading(true);
    let query = supabase
      .from('base_registry')
      .select('*')
      .eq('type', activeTab);

    // Lógica de Isolamento por Matriz Selecionada
    if (activeTab === 'empresa') {
      // Na aba de empresas, mostramos todas as que o usuário tem permissão
      // Se for admin master, vê todas. Se for cliente, vê as dele.
      if (!isAdmin) {
        const empresaIds = empresas.map(e => e.id);
        if (empresaIds.length > 0) {
          query = query.in('id', empresaIds);
        }
      }
    } else if (selectedEmpresaId) {
      // Nas outras abas, filtramos rigorosamente pela empresa selecionada no menu
      query = query.eq('empresa_id', selectedEmpresaId);
    }

    const { data } = await query.order('created_at', { ascending: false });

    // Se a busca retornar dados, usamos eles. 
    // Caso contrário, se estivermos na aba de empresas e formos um usuário comum, 
    // usamos a empresa que o AuthContext já buscou via Server Action (Plano B).
    if (data && data.length > 0) {
      setItems(data);
    } else if (activeTab === 'empresa' && !isAdmin && empresas.length > 0) {
      setItems(empresas);
    } else {
      setItems([]);
    }
    
    setLoading(false);
  };

  const handleEdit = (item: RegistryItem) => {
    setEditingId(item.id);
    setName(item.name);
    setFormData(item.metadata || {});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { 
      name, 
      type: activeTab,
      metadata: formData,
      updated_at: new Date().toISOString(),
      // Se estiver criando empresa, marca quem criou. 
      // Se for outro item, vincula à empresa selecionada.
      ...(editingId ? {} : { 
        created_by: user?.id,
        empresa_id: activeTab === 'empresa' ? null : selectedEmpresaId 
      })
    };

    if (editingId) {
      const { error } = await supabase
        .from('base_registry')
        .update(payload)
        .eq('id', editingId);
      
      if (error) alert('Erro ao atualizar: ' + error.message);
    } else {
      const { error } = await supabase
        .from('base_registry')
        .insert([payload]);
      
      if (error) alert('Erro ao cadastrar: ' + error.message);
    }

    setName('');
    setFormData({});
    setEditingId(null);
    setShowForm(false);
    fetchItems();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const isEmpresa = activeTab === 'empresa';
    const warning = isEmpresa 
      ? 'ATENÇÃO CRÍTICA: Excluir esta MATRIZ irá apagar permanentemente TODOS os dados (Clientes, Fornecedores, Bancos e Lançamentos) vinculados a ela. Esta ação é irreversível. Deseja prosseguir?'
      : 'Deseja excluir este registro?';

    if (window.confirm(warning)) {
      const { error } = await supabase
        .from('base_registry')
        .delete()
        .eq('id', id);
      
      if (error) {
        alert('Erro ao excluir: ' + error.message);
      } else {
        fetchItems();
      }
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto w-full space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-medium tracking-tight text-foreground font-title italic leading-none">Cadastros</h2>
          <p className="text-muted-foreground font-black mt-2 uppercase text-[9px] tracking-widest">Módulo 1.2 • Inteligência Referencial</p>
        </div>
      </div>

      {/* SUBMENU DE ABAS */}
      <div className="flex flex-wrap gap-2 border-b border-muted/30 pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                : 'bg-white text-muted-foreground hover:bg-muted/50 border border-muted/20'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab)!.icon, { size: 24, className: "text-primary" })}
          <h3 className="text-xl font-medium font-title italic text-foreground capitalize">
            Gestão de {tabs.find(t => t.id === activeTab)?.label}
          </h3>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/10 hover:scale-105 transition-all">
            <Plus size={16} className="mr-2" strokeWidth={3} /> Adicionar {tabs.find(t => t.id === activeTab)?.label.slice(0, -1)}
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="bg-white p-10 rounded-[40px] border-none shadow-[0px_20px_60px_rgba(0,0,0,0.05)] animate-in fade-in slide-in-from-top-4 duration-500 max-w-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">
              {editingId ? 'Editar' : 'Novo'} Registro: {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <button onClick={() => { setShowForm(false); setEditingId(null); setName(''); setFormData({}); }} className="p-2 hover:bg-muted rounded-full transition-all"><X size={20} className="text-muted-foreground" /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                  {activeTab === 'banco' ? 'Instituição Bancária' : 'Nome / Razão Social'}
                </label>
                <input 
                  required 
                  autoFocus
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-muted/30 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  placeholder={`Ex: ${tabs.find(t => t.id === activeTab)?.label}...`} 
                />
              </div>

              {/* CAMPOS DINÂMICOS - EMPRESA */}
              {activeTab === 'empresa' && (
                <>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Nome Fantasia</label>
                    <input value={formData.nome_fantasia || ''} onChange={(e) => setFormData({...formData, nome_fantasia: e.target.value})} className="w-full bg-muted/30 border-none rounded-xl px-5 py-3 text-xs font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">CNPJ</label>
                    <input value={formData.cnpj || ''} onChange={(e) => setFormData({...formData, cnpj: e.target.value})} className="w-full bg-muted/30 border-none rounded-xl px-5 py-3 text-xs font-bold outline-none" placeholder="00.000.000/0000-00" />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <input 
                      type="checkbox" 
                      id="is_matriz"
                      checked={formData.is_matriz || false} 
                      onChange={(e) => setFormData({...formData, is_matriz: e.target.checked})} 
                      className="w-5 h-5 rounded-lg border-primary/20 text-primary focus:ring-primary/20"
                    />
                    <label htmlFor="is_matriz" className="text-[10px] font-black uppercase text-primary tracking-widest cursor-pointer select-none">
                      Esta é a Empresa Matriz / Sede do Grupo
                    </label>
                  </div>
                </>
              )}

              {/* CAMPOS DINÂMICOS - CLIENTE / FORNECEDOR */}
              {(activeTab === 'cliente' || activeTab === 'fornecedor') && (
                <>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">CNPJ / CPF</label>
                    <input value={formData.documento || ''} onChange={(e) => setFormData({...formData, documento: e.target.value})} className="w-full bg-muted/30 border-none rounded-xl px-5 py-3 text-xs font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Telefone</label>
                    <input value={formData.telefone || ''} onChange={(e) => setFormData({...formData, telefone: e.target.value})} className="w-full bg-muted/30 border-none rounded-xl px-5 py-3 text-xs font-bold outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">E-mail Financeiro</label>
                    <input value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-muted/30 border-none rounded-xl px-5 py-3 text-xs font-bold outline-none" />
                  </div>
                </>
              )}

              {/* CAMPOS DINÂMICOS - BANCO */}
              {activeTab === 'banco' && (
                <>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Agência</label>
                    <input value={formData.agencia || ''} onChange={(e) => setFormData({...formData, agencia: e.target.value})} className="w-full bg-muted/30 border-none rounded-xl px-5 py-3 text-xs font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">N. Conta</label>
                    <input value={formData.conta || ''} onChange={(e) => setFormData({...formData, conta: e.target.value})} className="w-full bg-muted/30 border-none rounded-xl px-5 py-3 text-xs font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Saldo Inicial (R$)</label>
                    <input value={formData.saldo_inicial || ''} type="number" step="0.01" onChange={(e) => setFormData({...formData, saldo_inicial: e.target.value})} className="w-full bg-muted/30 border-none rounded-xl px-5 py-3 text-xs font-bold outline-none" placeholder="0,00" />
                  </div>
                </>
              )}

              {/* CAMPOS DINÂMICOS - PLANO DE CONTAS */}
              {activeTab === 'plano_contas' && (
                <>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Classificação</label>
                    <select value={formData.classificacao || 'receita'} onChange={(e) => setFormData({...formData, classificacao: e.target.value})} className="w-full bg-muted/30 border-none rounded-xl px-5 py-3 text-xs font-bold outline-none appearance-none">
                      <option value="receita">Receita</option>
                      <option value="despesa">Despesa</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Grupo (Ex: Impostos, Salários)</label>
                    <input value={formData.grupo || ''} onChange={(e) => setFormData({...formData, grupo: e.target.value})} className="w-full bg-muted/30 border-none rounded-xl px-5 py-3 text-xs font-bold outline-none" />
                  </div>
                </>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground h-16 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.01] transition-all">
              {loading ? 'Processando...' : `Confirmar Cadastro de ${tabs.find(t => t.id === activeTab)?.label}`}
            </Button>
          </form>
        </Card>
      )}

      {/* LISTAGEM DA ABA ATIVA - FORMATO EM LISTA EXECUTIVA */}
      {!showForm && (
        <div className="space-y-3 animate-in fade-in duration-500">
          {items.filter(i => i.type === activeTab).map(item => (
            <div key={item.id} className="group bg-white p-4 md:p-5 rounded-[24px] flex justify-between items-center shadow-sm border border-muted/20 hover:border-primary/40 transition-all hover:shadow-md hover:translate-x-1">
              <div className="flex items-center gap-6 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-110">
                   {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab)!.icon, { size: 20 })}
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 flex-1">
                  <span className="text-[11px] font-bold text-foreground min-w-[200px]">
                    {item.name}
                    {activeTab === 'empresa' && item.metadata?.is_matriz && (
                      <span className="ml-2 bg-primary/20 text-primary text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Matriz</span>
                    )}
                  </span>
                  
                  {item.metadata && (
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                      {item.metadata.cnpj && (
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-tighter">CNPJ</span>
                          <span className="text-[9px] text-muted-foreground font-medium">{item.metadata.cnpj}</span>
                        </div>
                      )}
                      {item.metadata.documento && (
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-tighter">DOC</span>
                          <span className="text-[9px] text-muted-foreground font-medium">{item.metadata.documento}</span>
                        </div>
                      )}
                      {item.metadata.conta && (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 border-r border-muted/30 pr-4">
                            <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-tighter">Agência</span>
                            <span className="text-[9px] text-muted-foreground font-medium">{item.metadata.agencia}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-tighter">Conta</span>
                            <span className="text-[9px] text-muted-foreground font-medium">{item.metadata.conta}</span>
                          </div>
                        </div>
                      )}
                      {item.metadata.classificacao && (
                        <span className="text-[9px] font-black uppercase text-primary/60 tracking-widest px-3 py-1 bg-primary/5 rounded-full">
                          {item.metadata.classificacao} • {item.metadata.grupo}
                        </span>
                      )}
                      {item.metadata.telefone && (
                        <div className="flex items-center gap-2">
                           <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-tighter">Tel</span>
                           <span className="text-[9px] text-muted-foreground font-medium">{item.metadata.telefone}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => handleEdit(item)} className="opacity-0 group-hover:opacity-100 p-2.5 text-primary hover:bg-primary/5 rounded-xl transition-all">
                  <Edit3 size={16}/>
                </button>
                <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          ))}
          {items.filter(i => i.type === activeTab).length === 0 && (
            <div className="py-20 rounded-[40px] border border-dashed border-muted/50 flex flex-col items-center justify-center text-muted-foreground/30">
              <Database size={40} className="mb-4 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Nenhum registro em {tabs.find(t => t.id === activeTab)?.label}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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

interface RegistryItem {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
}

export default function CadastroPage() {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('categoria');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('base_registry')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setItems(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('base_registry')
      .insert([{ name, type }]);

    if (!error) {
      setName('');
      setShowForm(false);
      fetchItems();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Excluir este cadastro?')) {
      const { error } = await supabase
        .from('base_registry')
        .delete()
        .eq('id', id);
      
      if (!error) fetchItems();
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto w-full space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-medium tracking-tight text-foreground font-title italic leading-none">Cadastros</h2>
          <p className="text-muted-foreground font-black mt-2 uppercase text-[9px] tracking-widest">Módulo 1.2 • Inteligência Referencial</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-foreground text-background h-11 px-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-foreground/5 hover:scale-105 transition-all">
            <Plus size={16} className="mr-2" strokeWidth={3} /> Novo Cadastro
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="bg-white p-8 rounded-[40px] border-none shadow-[0px_20px_40px_rgba(0,0,0,0.03)] animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em]">Configurar Novo Registro</h3>
            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-muted rounded-full transition-all"><X size={20} className="text-muted-foreground" /></button>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Nome do Registro</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-muted/30 border-none rounded-2xl px-5 py-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Ex: Marketing Digital, Banco Itaú..." />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Tipo de Cadastro</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-muted/30 border-none rounded-2xl px-5 py-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none">
                <option value="categoria">Categoria (DRE/Fluxo)</option>
                <option value="conta">Conta / Entidade Bancária</option>
              </select>
            </div>
            <div className="md:col-span-2 pt-4">
              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.01] transition-all">
                {loading ? 'Processando...' : 'Finalizar Cadastro'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coluna: Categorias */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Tags className="text-foreground" size={20} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Categorias Ativas</h3>
          </div>
          <div className="space-y-3">
            {items.filter(i => i.type === 'categoria').map(item => (
              <div key={item.id} className="group bg-white p-5 rounded-3xl flex justify-between items-center shadow-sm border border-muted/20 hover:border-primary/30 transition-all">
                <span className="text-[11px] font-black text-foreground">{item.name}</span>
                <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna: Contas */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="text-foreground" size={20} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Contas & Entidades</h3>
          </div>
          <div className="space-y-3">
            {items.filter(i => i.type === 'conta').map(item => (
              <div key={item.id} className="group bg-white p-5 rounded-3xl flex justify-between items-center shadow-sm border border-muted/20 hover:border-primary/30 transition-all">
                <span className="text-[11px] font-black text-foreground">{item.name}</span>
                <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

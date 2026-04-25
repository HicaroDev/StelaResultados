'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Trash2, 
  Shield, 
  Mail, 
  User, 
  CheckCircle2,
  X,
  Search,
  LayoutDashboard,
  Receipt,
  RefreshCw,
  TrendingUp,
  Users,
  FileBarChart,
  Database,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: string;
  full_name: string | null;
  role: 'admin' | 'common';
  created_at: string;
  email?: string;
}

const MODULES = [
  { id: 'dashboard', label: 'Dashboard Inteligente', icon: LayoutDashboard },
  { id: 'cadastro', label: 'Cadastros Master', icon: Database },
  { id: 'lancamentos', label: 'Lançamentos & NF', icon: Receipt },
  { id: 'conciliacao', label: 'Conciliação Bancária', icon: RefreshCw },
  { id: 'fluxo', label: 'Fluxo de Caixa', icon: TrendingUp },
  { id: 'usuarios', label: 'Gestão de Usuários', icon: Users },
  { id: 'relatorios', label: 'Relatórios Executivos', icon: FileBarChart },
];

export default function UsuariosPage() {
  const { profile, isAdmin, selectedEmpresaId: activeEmpresaId } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'admin' | 'common'>('common');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyCNPJ, setNewCompanyCNPJ] = useState('');
  const [newCompanySegment, setNewCompanySegment] = useState('');
  const [customSegments, setCustomSegments] = useState<string[]>([]);
  const [isAddingCustomSegment, setIsAddingCustomSegment] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    dashboard: true,
    cadastro: true,
    lancamentos: true,
    conciliacao: false,
    fluxo: false,
    usuarios: false,
    relatorios: false
  });

  const togglePermission = (modId: string) => {
    setPermissions(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    try {
      console.log('Iniciando busca de dados...');
      
      // 1. Buscar Perfis (Com isolamento)
      let profileQuery = supabase
        .from('profiles')
        .select('*');
      
      // Se não for o admin master, filtra pela empresa ativa
      if (!isAdmin && activeEmpresaId) {
        profileQuery = profileQuery.eq('empresa_id', activeEmpresaId);
      }
      
      const { data: userData, error: userError } = await profileQuery.order('created_at', { ascending: false });

      if (userError) throw userError;
      setUsers(userData || []);

      // 2. Buscar Empresas (Apenas as permitidas)
      let empQuery = supabase
        .from('base_registry')
        .select('id, name')
        .eq('type', 'empresa');

      if (!isAdmin) {
        const empresaIds = empresas.map(e => e.id);
        if (empresaIds.length > 0) {
          empQuery = empQuery.in('id', empresaIds);
        }
      }

      const { data: empData, error: empError } = await empQuery;
      
      if (empError) {
        console.error('ERRO CRÍTICO EMPRESAS:', empError);
      } else {
        console.log('EMPRESAS OK:', empData?.length, 'matrizes');
        setEmpresas(empData || []);
      }

    } catch (e) {
      console.error('ERRO FATAL NA BUSCA:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de Campos
    if (!fullName || !email || (!editingUserId && !password)) {
      alert('Por favor, preencha nome e e-mail. A senha é obrigatória apenas para novos usuários.');
      setLoading(false);
      return;
    }

    if (role === 'common' && !selectedEmpresaId) {
      alert('Para clientes (Dono de Empresa), é obrigatório selecionar ou cadastrar uma Matriz.');
      return;
    }

    setLoading(true);

    try {
      let empresaId = selectedEmpresaId;

      // 2. Se for uma nova empresa, criar primeiro
      if (selectedEmpresaId === 'NEW') {
        const { data: newEmp, error: empErr } = await supabase
          .from('base_registry')
          .insert({
            name: newCompanyName,
            type: 'empresa',
            metadata: { 
              is_matrix: true,
              cnpj: newCompanyCNPJ,
              segment: newCompanySegment
            }
          })
          .select()
          .single();
        
        if (empErr) throw empErr;
        empresaId = newEmp.id;
      }

      // 3. Criar ou Atualizar o usuário
      if (editingUserId) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            email, // Mantém o e-mail sincronizado no perfil
            role,
            empresa_id: empresaId,
            permissions,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingUserId);
        
        if (updateError) throw updateError;
        alert('Acesso atualizado com sucesso!');
      } else {
        const response = await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            password, 
            fullName, 
            role,
            empresa_id: empresaId,
            permissions 
          }),
        });

        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao criar usuário');
          } else {
            // Se recebeu HTML (Erro 404 ou 500 do Next.js), ler como texto
            const errorText = await response.text();
            console.error('Resposta inesperada do servidor:', errorText.substring(0, 500));
            throw new Error(`O servidor retornou um erro inesperado (Status ${response.status}). Verifique os logs do terminal.`);
          }
        }
        // Sucesso na criação via API
      }

      // Sucesso: Fechar e Limpar IMEDIATAMENTE
      setShowForm(false);
      setEditingUserId(null);
      setFullName('');
      setEmail('');
      setPassword('');
      setSelectedEmpresaId('');
      setPermissions({});
      
      // Atualizar lista e avisar
      await fetchData();
      
      // Pequeno aviso de sucesso não bloqueante ou scroll
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      
      // Tradução Amigável de Erros comuns
      let friendlyMessage = err.message || 'Erro de conexão';
      
      if (friendlyMessage.includes('already been registered')) {
        friendlyMessage = 'Este e-mail já está cadastrado no sistema. Tente outro ou edite o usuário existente.';
      } else if (friendlyMessage.includes('invalid email')) {
        friendlyMessage = 'O formato do e-mail é inválido. Verifique se digitou corretamente.';
      } else if (friendlyMessage.includes('Password should be')) {
        friendlyMessage = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
      }

      alert(`Atenção: ${friendlyMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (u: any) => {
    setShowForm(true);
    setEditingUserId(u.id);
    setFullName(u.full_name || '');
    setEmail(u.email || '');
    setRole(u.role || 'common');
    setSelectedEmpresaId(u.empresa_id || '');
    setPermissions(u.permissions || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCustomSegment = (val: string) => {
    if (!val.trim()) return;
    if (!customSegments.includes(val)) {
      setCustomSegments(prev => [...prev, val]);
    }
    setNewCompanySegment(val);
    setIsAddingCustomSegment(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja remover o acesso deste usuário?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      alert('Erro ao excluir: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users
    .filter(u => 
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // 1. O usuário logado (Você) sempre em primeiro
      if (a.id === profile?.id) return -1;
      if (b.id === profile?.id) return 1;
      
      // 2. Admins depois de você
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (a.role !== 'admin' && b.role === 'admin') return 1;
      
      return 0;
    });

  if (profile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <Shield size={48} className="text-rose-500" />
        <h2 className="text-2xl font-medium text-foreground tracking-tight">Acesso Administrativo</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Sessão restrita ao Suporte Stela</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto w-full space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-medium tracking-tight text-black leading-none">Gestão de Acessos</h2>
          <p className="text-black font-black mt-3 uppercase text-[9px] tracking-[0.3em]">Matriz, Suporte & Permissões de Módulo</p>
        </div>
        {!showForm && (
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 group">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou empresa..." 
                className="w-full bg-white border border-muted/20 rounded-2xl pl-11 pr-4 py-3 text-[11px] font-bold outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
              />
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/10 hover:scale-105 transition-all shrink-0">
              <UserPlus size={16} className="mr-2" strokeWidth={3} /> Criar Novo Acesso
            </Button>
          </div>
        )}
      </div>

      {showForm && (
        <Card className="bg-white p-8 md:p-12 rounded-[50px] border border-muted/10 shadow-[0px_40px_80px_rgba(0,0,0,0.06)] animate-in fade-in slide-in-from-top-10 duration-700 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8b2d56]/10 via-[#8b2d56] to-[#8b2d56]/10" />
          
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Shield size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-sm font-black text-black uppercase tracking-[0.2em]">Configuração de Credenciais</h3>
                <p className="text-[9px] text-black font-bold uppercase tracking-widest mt-1">Defina o nível de autoridade e módulos visíveis</p>
              </div>
            </div>
            <button onClick={() => setShowForm(false)} className="p-4 hover:bg-muted rounded-3xl transition-all group">
              <X size={20} className="text-muted-foreground group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <form onSubmit={handleCreateUser} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase text-black tracking-widest ml-1">Nome do Responsável</label>
                <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-muted/20 border-2 border-muted/20 rounded-2xl px-6 py-4 text-xs font-black text-black focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-black/50" placeholder="Nome completo" />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase text-black tracking-widest ml-1">E-mail Corporativo</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-muted/20 border-2 border-muted/20 rounded-2xl px-6 py-4 text-xs font-black text-black focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-black/50" placeholder="email@empresa.com" />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase text-black tracking-widest ml-1">Senha de Acesso</label>
                <div className="relative">
                  <input 
                    required={!editingUserId} 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full bg-muted/20 border-2 border-muted/20 rounded-2xl px-6 py-4 text-xs font-black text-black focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-black/50" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-black/50 hover:text-[#8b2d56] transition-all"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Seção 2: Tipo de Perfil */}
            <div className="space-y-4">
              <label className="text-[9px] font-black uppercase text-black tracking-widest ml-1">Nível de Autoridade no Sistema</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setRole('admin')}
                  className={cn(
                    "p-6 rounded-3xl border-2 text-left transition-all",
                    role === 'admin' ? "border-[#8b2d56] bg-[#8b2d56]/5 shadow-inner" : "border-muted/20 hover:border-muted/40"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Shield size={18} className={role === 'admin' ? "text-[#8b2d56]" : "text-black/40"} strokeWidth={3} />
                    <p className={cn("text-[11px] font-black uppercase tracking-widest", role === 'admin' ? "text-[#8b2d56]" : "text-black/60")}>Suporte / Admin Stela</p>
                  </div>
                  <p className="text-[10px] text-black/40 font-medium italic">Acesso total para gestão de equipe e suporte técnico global.</p>
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('common')}
                  className={cn(
                    "p-6 rounded-3xl border-2 text-left transition-all",
                    role === 'common' ? "border-[#8b2d56] bg-[#8b2d56]/5 shadow-inner" : "border-muted/20 hover:border-muted/40"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <User size={18} className={role === 'common' ? "text-[#8b2d56]" : "text-black/40"} strokeWidth={3} />
                    <p className={cn("text-[11px] font-black uppercase tracking-widest", role === 'common' ? "text-[#8b2d56]" : "text-black/60")}>Dono de Empresa / Cliente</p>
                  </div>
                  <p className="text-[10px] text-black/40 font-medium italic">Visão focada no negócio. Vê apenas os dados da sua matriz.</p>
                </button>
              </div>
            </div>

            {/* Seção 3: Empresa Matriz (Apenas se for Cliente) */}
            {role === 'common' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-4 pt-4 border-t border-muted/10">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[9px] font-black uppercase text-black tracking-widest">Vincular Empresa Matriz</label>
                    <button 
                      type="button"
                      onClick={() => setSelectedEmpresaId(selectedEmpresaId === 'NEW' ? '' : 'NEW')}
                      className="text-[9px] font-black text-[#8b2d56] uppercase tracking-widest hover:brightness-75 transition-all"
                    >
                      {selectedEmpresaId === 'NEW' ? 'X Cancelar Registro' : '+ Cadastrar Nova Matriz Agora'}
                    </button>
                  </div>
                  <div className="relative group/matrix">
                    <div 
                      className="w-full bg-muted/20 border-2 border-muted/20 rounded-2xl px-6 py-4 flex items-center justify-between cursor-pointer hover:border-primary/30 transition-all" 
                      onClick={() => (document.getElementById('matrix-dropdown') as HTMLElement).classList.toggle('hidden')}
                    >
                      <span className={cn("text-xs font-black", selectedEmpresaId === 'NEW' ? "text-[#8b2d56]" : "text-black")}>
                        {selectedEmpresaId === 'NEW' ? '-- CADASTRAR NOVA MATRIZ --' : empresas.find(e => e.id === selectedEmpresaId)?.name || 'Selecione a Matriz'}
                      </span>
                      <div className="flex items-center gap-2">
                        <Database size={14} className="text-black/20" />
                        <ChevronDown size={14} className="text-black/40" />
                      </div>
                    </div>
                    
                    <div id="matrix-dropdown" className="hidden absolute top-[calc(100%+8px)] left-0 w-full bg-white border-2 border-muted/10 rounded-[30px] shadow-2xl z-[100] py-4 overflow-hidden animate-in slide-in-from-top-2">
                      <div className="px-4 pb-2 mb-2 border-b border-muted/5">
                        <p className="text-[9px] font-black uppercase text-black/30 tracking-widest ml-2">Opções de Vínculo</p>
                      </div>
                      
                      <div 
                        onClick={() => {
                          setSelectedEmpresaId('NEW');
                          (document.getElementById('matrix-dropdown') as HTMLElement).classList.add('hidden');
                        }}
                        className="px-6 py-4 text-xs font-black text-[#8b2d56] cursor-pointer hover:bg-[#fff5f5] transition-colors border-l-4 border-transparent hover:border-[#8b2d56]"
                      >
                        -- CADASTRAR NOVA MATRIZ --
                      </div>
                      
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        {empresas.map(emp => (
                          <div 
                            key={emp.id}
                            onClick={() => {
                              setSelectedEmpresaId(emp.id);
                              (document.getElementById('matrix-dropdown') as HTMLElement).classList.add('hidden');
                            }}
                            className="px-6 py-4 text-xs font-black text-black cursor-pointer hover:bg-[#fff5f5] transition-colors border-l-4 border-transparent hover:border-black/10"
                          >
                            {emp.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {selectedEmpresaId === 'NEW' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 bg-primary/5 rounded-[30px] border-2 border-primary/30 animate-in zoom-in-95 duration-500 shadow-sm">
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-black ml-1">Nome da Empresa</label>
                        <input required value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} className="w-full bg-white border border-primary/20 rounded-xl px-4 py-3 text-[11px] font-black text-black outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-black/40" placeholder="Nome Fantasia" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-black ml-1">CNPJ</label>
                        <input value={newCompanyCNPJ} onChange={(e) => setNewCompanyCNPJ(e.target.value)} className="w-full bg-white border border-primary/20 rounded-xl px-4 py-3 text-[11px] font-black text-black outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-black/40" placeholder="00.000.000/0001-00" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-black ml-1">Segmento</label>
                        {!isAddingCustomSegment ? (
                          <select 
                            value={newCompanySegment} 
                            onChange={(e) => {
                              if (e.target.value === 'ADD_NEW') {
                                setIsAddingCustomSegment(true);
                              } else {
                                setNewCompanySegment(e.target.value);
                              }
                            }} 
                            className="w-full bg-white border border-primary/20 rounded-xl px-4 py-3 text-[11px] font-black text-black outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="">Selecione...</option>
                            {['Serviços', 'Varejo', 'Indústria', 'Tecnologia', ...customSegments].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                            <option value="ADD_NEW" className="text-primary font-black">+ ADICIONAR NOVO...</option>
                          </select>
                        ) : (
                          <div className="flex gap-2 animate-in slide-in-from-top-2">
                            <input 
                              autoFocus
                              className="flex-1 bg-white border border-primary/40 rounded-xl px-4 py-3 text-[11px] font-black text-black outline-none focus:ring-2 focus:ring-primary/20"
                              placeholder="Qual o novo segmento?"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCustomSegment((e.target as HTMLInputElement).value);
                                }
                                if (e.key === 'Escape') setIsAddingCustomSegment(false);
                              }}
                              id="customSegmentInput"
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                const input = document.getElementById('customSegmentInput') as HTMLInputElement;
                                handleAddCustomSegment(input.value);
                              }}
                              className="px-4 bg-black text-white rounded-xl text-[10px] font-black uppercase hover:bg-primary transition-all shadow-sm"
                            >
                              Adicionar
                            </button>
                            <button 
                              type="button"
                              onClick={() => setIsAddingCustomSegment(false)}
                              className="px-3 bg-muted/20 text-black rounded-xl text-[10px] font-black uppercase hover:bg-muted/40 transition-all"
                            >
                              X
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Seção 4: Permissões de Módulo */}
                <div className="space-y-6 pt-4 border-t border-muted/10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex justify-between items-end">
                    <div>
                      <label className="text-[9px] font-black uppercase text-black tracking-widest ml-1">Módulos Disponíveis</label>
                      <p className="text-[10px] text-black font-bold mt-1">Marque as áreas permitidas para este cliente.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const allTrue = Object.values(permissions).every(v => v);
                        const newVal = !allTrue;
                        const next = {...permissions};
                        MODULES.forEach(m => next[m.id] = newVal);
                        setPermissions(next);
                      }}
                      className="text-[9px] font-black text-[#8b2d56] uppercase tracking-widest hover:brightness-75 transition-all"
                    >
                      {Object.values(permissions).every(v => v) ? 'Desmarcar Todos' : 'Marcar Todos'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {MODULES.map((mod) => (
                        <button 
                          key={mod.id}
                          type="button"
                          onClick={() => setPermissions({ ...permissions, [mod.id]: !permissions[mod.id] })}
                          className={cn(
                            "p-4 rounded-2xl flex items-center gap-3 border-2 transition-all text-left",
                            permissions[mod.id] 
                              ? "bg-[#8b2d56] text-white border-[#8b2d56] shadow-lg shadow-[#8b2d56]/20" 
                              : "bg-transparent text-black/60 border-muted/40 hover:border-muted/60 hover:bg-muted/5"
                          )}
                        >
                          <mod.icon size={14} className={cn("shrink-0", permissions[mod.id] ? "opacity-100" : "opacity-30")} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{mod.label}</span>
                        </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-8">
              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground h-18 rounded-[30px] font-black text-[12px] uppercase tracking-[0.4em] hover:scale-[1.01] transition-all shadow-2xl shadow-primary/30">
                {loading ? 'Sincronizando Autoridade...' : editingUserId ? 'Salvar Alterações no Acesso' : 'Finalizar e Ativar Acesso'}
              </Button>
              {editingUserId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingUserId(null);
                    setFullName('');
                    setEmail('');
                    setPassword('');
                  }}
                  className="w-full mt-4 text-[9px] font-black text-black/40 uppercase tracking-widest hover:text-rose-500 transition-all"
                >
                  X Cancelar Edição e Criar Novo
                </button>
              )}
            </div>
          </form>
        </Card>
      )}

      {/* Lista de Usuários - Agora com Tags de Luxo */}
      <div className="space-y-4">
        {filteredUsers.map((u: any) => (
          <div 
            key={u.id} 
            onClick={() => handleEdit(u)}
            className="group bg-white p-6 rounded-[35px] flex justify-between items-center shadow-sm border border-muted/20 hover:border-primary/40 transition-all hover:shadow-xl hover:translate-x-2 cursor-pointer"
          >
            <div className="flex items-center gap-8 flex-1">
              <div className={cn(
                "w-16 h-16 rounded-3xl flex items-center justify-center font-black text-xs transition-all group-hover:rotate-3 shadow-lg",
                u.role === 'admin' ? "bg-foreground text-background" : "bg-primary/10 text-[#8b2d56]"
              )}>
                {u.full_name?.substring(0, 2).toUpperCase() || 'ST'}
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-16 flex-1">
                <div className="min-w-[220px]">
                  <p className="text-[13px] font-bold text-black flex items-center gap-2">
                    {u.full_name || 'Usuário Indefinido'}
                    {u.id === profile?.id && (
                      <span className="text-[8px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                        (VOCÊ)
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full",
                      u.role === 'admin' ? "bg-rose-500/10 text-[#8b2d56]" : "bg-emerald-500/10 text-emerald-600"
                    )}>
                      {u.role === 'admin' ? 'Time Stela' : 'Dono de Empresa'}
                    </span>
                    {u.empresa_id && (
                      <span className="text-[9px] font-black text-black uppercase tracking-tighter bg-muted/40 px-3 py-1 rounded-lg">
                        {empresas.find(e => e.id === u.empresa_id)?.name || 'Empresa Vinculada'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center"><Mail size={12} className="text-black" /></div>
                  <span className="text-[11px] font-bold text-black">{u.email || 'acesso@stela.ai'}</span>
                </div>

                <div className="hidden xl:flex flex-wrap gap-1.5 max-w-[300px]">
                  {Object.entries(u.permissions || {}).filter(([_, v]) => v).slice(0, 3).map(([k]) => (
                    <span key={k} className="text-[7px] font-black uppercase text-muted-foreground/30 border border-muted/20 px-2 py-0.5 rounded-md">
                      {k}
                    </span>
                  ))}
                  {Object.values(u.permissions || {}).filter(v => v).length > 3 && (
                    <span className="text-[7px] font-black uppercase text-primary/40 px-2 py-0.5">+ {Object.values(u.permissions || {}).filter(v => v).length - 3}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-10 pr-4">
              <div className="text-right hidden sm:block">
                <p className="text-[8px] font-black text-black/40 uppercase tracking-widest">Desde</p>
                <p className="text-[11px] font-bold text-black">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : 'Data Indisponível'}
                </p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteUser(u.id);
                }}
                className="p-4 text-muted-foreground/20 hover:text-rose-500 hover:bg-rose-50 rounded-3xl transition-all"
              >
                <Trash2 size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

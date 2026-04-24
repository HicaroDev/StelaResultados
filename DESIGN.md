# 💎 Stela Design System - "Muted Luxury"
## 🚫 DESIGN FREEZE - PROIBIDO ALTERAR SEM AUTORIZAÇÃO

Este documento define os padrões visuais imutáveis do Stela Financial SaaS. Nenhuma alteração estrutural, de layout ou de paleta de cores deve ser feita sem a confirmação explícita do usuário.

### 🎨 Paleta de Cores (OKLCH)
A paleta é baseada no conceito **"Silk & Graphite"**:
- **Primária (Rosé Silk):** `oklch(0.88 0.04 340)` -> Usada para botões, estados ativos e destaques elegantes.
- **Background (Soft Pearl):** `oklch(0.98 0.01 340)` / `#F9F9F9` -> Fundo limpo e feminino.
- **Texto (Graphite):** `oklch(0.25 0.02 340)` -> Legibilidade premium.
- **Muted (Fog):** `oklch(0.92 0.01 340)` -> Divisores e inputs.

### 📏 Escala e Layout (Reduced 30%)
- **Sidebar:** Largura fixa de `64` unidades (compacta).
- **Header:** Altura fixa de `16` unidades (`h-16`).
- **Paddings:** Padrão `p-6` ou `p-8` (evitar `p-10` ou superiores).
- **Arredondamento:** `rounded-[30px]` ou `rounded-[35px]` para Cards. `rounded-xl` para botões/inputs.
- **Tipografia:** 
  - Títulos: *Plus Jakarta Sans* (Italic + Light/Medium).
  - Texto: *Plus Jakarta Sans* (Bold/Black para etiquetas em uppercase).

### 🛡️ Regra de Ouro (The Golden Rule)
> **"Antes de modificar uma única classe de CSS ou estrutura de Grid, o agente DEVE perguntar: 'Esta mudança altera o layout congelado em DESIGN.md?'. Se sim, peça autorização."**

---

### 🛠️ Receita para Novos Módulos
Ao criar novos módulos, siga esta estrutura:
1. **Container:** `<div className="p-6 md:p-8 max-w-[1500px] mx-auto w-full space-y-8 animate-in fade-in duration-700">`
2. **Cabeçalho:** Título em `text-4xl font-medium tracking-tight font-title italic`.
3. **Subtítulo:** Texto em `text-[9px] font-black uppercase tracking-widest text-muted-foreground`.
4. **Cards:** Usar `Card` com `shadow-[0px_10px_30px_rgba(0,0,0,0.02)]` e `border-none`.
5. **Botões:** Usar `bg-primary text-primary-foreground` para ações principais.

# Guia de Layout & Design: Stela Financial SaaS

Este documento define a identidade visual e os padrões de interface do sistema, inspirados na referência **[Finnie - Financial Dashboard](https://dribbble.com/shots/26248780-Finnie-Financial-Dashboard)**.

## 🎨 Identidade Visual

### Paleta de Cores
- **Fundo da Página**: `#F8F9FA` (Off-white para suavidade).
- **Cards e Conteúdo**: `#FFFFFF` (Branco puro para destaque).
- **Texto Primário & Botões**: `#1A1A1A` (Preto profundo/Navy para contraste premium).
- **Sucesso (Receitas/Ganhos)**: `#28C76F` (Verde vibrante).
- **Perigo (Despesas/Alertas)**: `#FF4D4F` (Vermelho suave).
- **Gradientes de Destaque**: Roxo para Rosa (`#A855F7` a `#EC4899`) para barras de progresso e KPIs críticos.

### Tipografia
- **Família**: *Inter* ou *Instrument Sans* (Sans-serif modernas).
- **Hierarquia**:
    - Números de destaque: Bold e em tamanho grande.
    - Rótulos e dados de tabela: Regular, peso 400/500, foco em legibilidade.

---

## 🏛️ Estrutura de Telas (Layout)

### 1. Sidebar (Navegação)
- Barra vertical fina à esquerda.
- Ícones de linha (`Lucide-React`) minimalistas.
- Links: Dashboard, Fluxo de Caixa, DRE, Balanço, Configurações.

### 2. Dashboard Principal (Home)
- **Top Row (Stats Cards)**:
    - **Saldo Total**: Valor consolidado do Fluxo de Caixa.
    - **Controle de Orçamento**: Barra de progresso baseada na DRE.
    - **Indicadores Rápidos**: Liquidez Corrente e Capital de Giro.
- **Middle Section**: Gráfico de barras ou linhas mostrando Receita vs Despesa (FC).
- **Bottom Section**: Lista de "Transações Recentes" ou "Resumo da DRE".

### 3. Tabelas e Listas
- **Bordas**: Arredondamento de `16px` (Large border-radius).
- **Sombras**: `shadow-sm` ou `shadow-md` muito sutis para criar profundidade ("Floating cards").
- **Espaçamento**: Generoso (padding `p-6` a `p-8`) para evitar poluição visual.

---

## 🛠️ Instruções para o Agente de Desenvolvimento (UI Expert)

Ao criar ou recriar os componentes:
1.  **Priorize o Espaço em Branco**: Nunca aperte os elementos; a sensação deve ser de leveza.
2.  **Micro-interações**: Adicione efeitos de `hover` suaves nos cards e botões.
3.  **Consistência de Cores**: Use os tons de verde e vermelho apenas para dados financeiros (Entradas/Saídas).
4.  **Componentes Shadcn/UI**: Utilize a base do Shadcn, mas customize o `radius` e as sombras para bater com o estilo "Finnie".

---

## 🔗 Referência Visual
![Finnie Dashboard](https://cdn.dribbble.com/userupload/18320478/file/original-f75f6d77e4d6a7f7d1a5a5e3f4e1f7c5.png)
*(Link para a imagem de referência para o agente consultar)*

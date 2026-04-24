# Documento de Implantação: Stela Financial SaaS

Este documento detalha a arquitetura técnica, as ferramentas e os padrões de desenvolvimento que serão utilizados para construir o SaaS a partir da planilha financeira.

## 🛠️ Stack Tecnológica Recomendada

Para garantir um sistema premium, escalável e de alto desempenho:

- **Frontend**: [Next.js 14+](https://nextjs.org/) (App Router) - Para SEO, performance e rotas inteligentes.
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) - Para um design moderno e responsivo.
- **Componentes de UI**: [Shadcn/UI](https://ui.shadcn.com/) - Para uma interface profissional e consistente.
- **Banco de Dados & Auth**: [Supabase](https://supabase.com/) (PostgreSQL) - Para persistência de dados em tempo real e autenticação segura.
- **Gráficos**: [Recharts](https://recharts.org/) ou [Tremor](https://www.tremor.so/) - Especializado em dashboards financeiros.
- **Ícones**: [Lucide React](https://lucide.dev/) - Ícones limpos e consistentes.

---

## 🏗️ Arquitetura de Dados (Database Schema)

O banco de dados será modelado para refletir a inteligência da planilha:

1.  **Users/Tenants**: Gestão de acesso e multi-empresa.
2.  **Categories**: Categorização de DRE (Receitas, Custos Fixos, Variáveis, etc.).
3.  **Transactions**: Onde o usuário lança as entradas e saídas (Alimenta o FC e DRE).
4.  **Balance_Snapshots**: Para armazenar o histórico do Balanço Patrimonial (BP).
5.  **KPI_Config**: Configuração personalizada dos indicadores de performance.

---

## 📉 Lógica Financeira (O "Motor")

A implementação seguirá as fórmulas extraídas da planilha:

- **DRE**: Cálculo automático de AV% (Análise Vertical) e AH% (Análise Horizontal).
- **Fluxo de Caixa**: Visão direta baseada na data de liquidação das transações.
- **Indicadores**:
    - `Liquidez Corrente = Ativo Circulante / Passivo Circulante`
    - `Margem Líquida = Lucro Líquido / Receita Líquida`

---

## 🚀 Estratégia de Deploy

1.  **Ambiente de Desenvolvimento**: Local com `npm run dev`.
2.  **Hospedagem**: [Vercel](https://vercel.com/) (Integração contínua com GitHub).
3.  **CI/CD**: Testes automatizados de lógica financeira antes de cada deploy.

---

## 🎨 Próximo Passo: Layout & Design
O próximo documento definirá a paleta de cores, tipografia e os protótipos das telas principais (Dashboard, Fluxo de Caixa e DRE).

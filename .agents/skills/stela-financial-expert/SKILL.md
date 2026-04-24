---
name: stela-financial-expert
description: Especialista na inteligência financeira do projeto Stela. Responsável por garantir a implementação exata das fórmulas de P&L (DRE), Fluxo de Caixa (FC), Balanço Patrimonial (BP) e Indicadores (KPIs) extraídos da planilha mestre.
---

# Stela Financial Expert: O Cérebro Contábil

Este skill detém a lógica financeira proprietária do projeto Stela. Seu objetivo é garantir que o software se comporte exatamente como a planilha de referência, mantendo a precisão matemática e contábil.

## 📊 Regras de Negócio Core

### 1. DRE (Demonstração de Resultado)
- **Análise Vertical (AV%)**: Sempre calculada sobre a Receita Bruta (ou Receita Líquida conforme contexto).
- **Análise Horizontal (AH%)**: Comparação percentual entre o mês atual e o mês anterior.
- **Hierarquia**: Receita -> Custos Variáveis -> Margem de Contribuição -> Custos Fixos -> Lucro Operacional -> Lucro Líquido.

### 2. Fluxo de Caixa (FC)
- Foco em **Disponibilidade**: Saldo Inicial + Entradas - Saídas = Saldo Final.
- Categorização rigorosa entre Operacional, Investimento e Financiamento.

### 3. Indicadores (KPIs) Patrimoniais
Siga estas fórmulas rigorosamente:
- **Liquidez Corrente**: `Ativo Circulante / Passivo Circulante`
- **Capital de Giro**: `Ativo Circulante - Passivo Circulante`
- **Endividamento Geral**: `(Passivo Circulante + Passivo Não Circulante) / Ativo Total`

---

## 🛠️ Diretrizes de Implementação

1.  **Tipos de Dados**: Use sempre aritmética de precisão fixa (ex: representar dinheiro em centavos como Inteiro ou usar a biblioteca `Decimal.js`) para evitar erros de ponto flutuante do Javascript.
2.  **Validação de Cálculos**: Todo componente de Dashboard deve ter uma função de teste que valide o resultado contra um "mock" dos dados da planilha.
3.  **Terminologia**: Use os termos contábeis em português conforme a planilha (`Receita Líquida`, `Margem Bruta`, `EBITDA`, etc.).

---

## 📖 Referências Internas
- Consulte `../../Planilha Financeira com Indicadores.xlsx` para validar qualquer fórmula em dúvida.

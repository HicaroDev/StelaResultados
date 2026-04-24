---
name: stela-deploy
description: "Workflow específico para gerenciar o código e o deploy do Stela Financial SaaS (GitHub + Vercel)."
risk: safe
date_added: "2026-04-23"
---

# Stela Deploy Skill 🚀

Esta skill automatiza o ciclo de vida de desenvolvimento e publicação do projeto **Stela Financial**.

## Repositórios e Links
- **GitHub:** `https://github.com/HicaroDev/StelaResultados`
- **Vercel:** `https://stela-intelligence.vercel.app`

## Fluxo de Trabalho de Deploy

### 1. Sincronização com GitHub
Sempre que houver mudanças estruturais nos módulos (Fluxo, DRE, Balanço, Indicadores), realizar o commit com mensagens claras sobre o módulo afetado.
```bash
git add .
git commit -m "feat(modulo): [descrição da melhoria]"
git push origin main
```

### 2. Deploy para Vercel
O deploy deve ser feito usando a versão mais recente do CLI para evitar erros de endpoint.
```bash
npx vercel@latest --prod --yes
```

## Diretrizes de Design (Muted Luxury)
Qualquer nova funcionalidade deve respeitar:
- **Cor Primária:** `#F6ECF0` (Business Pink)
- **Tipografia:** `Cormorant Garamond` para títulos e `Plus Jakarta Sans` para dados.
- **Contraste:** Texto sempre em `#1A1A1A` (Preto) quando o fundo for o rosa primário.

## Manutenção de Dados
O projeto utiliza `localStorage`. Ao migrar para o Supabase no futuro, esta skill deve ser atualizada para incluir os passos de migração de schema do banco de dados.

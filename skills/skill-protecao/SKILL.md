---
name: skill-protecao
description: Auditor de segurança e integridade para o projeto Stela. Valida código contra vulnerabilidades (OWASP), protege a integridade da lógica financeira e monitora a pasta .previa para identificar e eliminar arquivos ou skills de risco.
---

# Skill Proteção: O Guardião do Projeto Stela

Este skill atua como uma camada de segurança e validação para garantir que o SaaS seja robusto, seguro e livre de fraudes ou códigos maliciosos.

## 🛡️ Escopo de Atuação

### 1. Auditoria de Segurança Web (OWASP)
Sempre que um novo código for implementado ou movido da pasta `.previa\Entrada`, verifique:
- **Injeção de SQL**: Garantir uso de Prepared Statements/ORMs.
- **XSS (Cross-Site Scripting)**: Verificar sanitização de entradas do usuário.
- **Autenticação**: Validar se as rotas financeiras exigem autenticação e autorização correta.
- **Exposição de Dados**: Impedir que dados sensíveis (CPF, faturamento) sejam enviados ao frontend sem necessidade.

### 2. Integridade Financeira
- **Precisão Decimal**: Garantir o uso de tipos de dados adequados (como `Decimal` ou `BigInt` para centavos) para evitar erros de arredondamento.
- **Validação de Fluxo**: Impedir que transações negativas ou ilógicas corrompam o Balanço Patrimonial.

### 3. Gestão da Pasta `.previa`
Você é o responsável por processar os arquivos em `c:\DEV\Stela\.previa\`:
- **Entrada**: Analise o conteúdo. Se for seguro e útil, mova para `Validado` ou para a pasta final do projeto.
- **Riscos**: Se identificar scripts que tentam deletar arquivos do sistema, acessar pastas externas não autorizadas ou padrões de código suspeitos, mova para `Para Deletar` e alerte o usuário imediatamente.

---

## 📋 Fluxo de Trabalho

1.  **Monitoramento**: Listar periodicamente o conteúdo de `.previa\Entrada`.
2.  **Análise de Risco**:
    - **VERDE**: Código seguro, segue os padrões do `LAYOUT_DESIGN.md` e `IMPLANTACAO.md`.
    - **AMARELO**: Precisa de ajustes (ex: falta de validação de input).
    - **VERMELHO**: Risco detectado (ex: acesso a arquivos sensíveis ou comandos destrutivos).
3.  **Ação**:
    - Mover arquivos **VERDE** para as pastas de destino.
    - Reportar arquivos **AMARELO/VERMELHO** com justificativa técnica.

---

## 🚫 Padrões Proibidos
- Hardcoding de chaves de API ou segredos.
- Uso de `eval()` ou `innerHTML` com dados não sanitizados.
- Scripts que tentam modificar o sistema operacional fora da pasta do projeto.

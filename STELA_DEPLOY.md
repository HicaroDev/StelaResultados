# Manual de Deploy - Stela Financial SaaS 🚀

Este arquivo documenta o processo de atualização e publicação do projeto.

## 📦 Repositórios e Links Oficiais
- **GitHub:** [https://github.com/HicaroDev/StelaResultados](https://github.com/HicaroDev/StelaResultados)
- **Vercel (Produção):** [https://stela-intelligence.vercel.app](https://stela-intelligence.vercel.app)

## 🛠️ Comandos de Atualização

### 1. Sincronizar com GitHub
Para salvar suas alterações no repositório:
```bash
git add .
git commit -m "feat: atualizações de indicadores e design"
git push origin main
```

### 2. Publicar na Vercel
Para atualizar o site que está no ar:
```bash
npx vercel@latest --prod --yes
```

## 🛡️ Protocolo de Design Freeze & Identidade
O design do Stela está **CONGELADO**. Nenhuma alteração estética ou estrutural pode ser feita sem autorização explícita do usuário.

### 🎨 Tokens de Design (DNA Stela)
- **Visual:** "Muted Luxury / Silk & Graphite"
- **Primária:** `oklch(0.88 0.04 340)` (Rosé Silk)
- **Fundo:** `oklch(0.98 0.01 340)` (Soft Pearl)
- **Escala:** Redução de 30% aplicada (Layout Compacto).
- **Fontes:** Plus Jakarta Sans (Main) & Font Title Italic.

### 🔍 Auditoria Obrigatória
Antes de qualquer deploy ou alteração de código:
1. Invoque a Skill `stela-design-guardian`.
2. Verifique o arquivo `DESIGN.md`.
3. Nunca mude o layout (Sidebar/Header) sem confirmação prévia.

---
*Documentação oficial de integridade visual Stela.*

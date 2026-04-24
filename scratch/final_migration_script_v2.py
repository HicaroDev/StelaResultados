import pandas as pd
import json

file_path = 'Planilha Fluxo de caixa - AF 26 11 2025.xlsm'

def migrate_final():
    payload = []
    
    # 🚚 FORNECEDORES (CAD_FORN)
    try:
        df = pd.read_excel(file_path, sheet_name='CAD_FORN', skiprows=3, header=None)
        for _, row in df.iterrows():
            if pd.isna(row[2]): continue
            payload.append({
                "name": str(row[2]),
                "type": "fornecedor",
                "metadata": {
                    "nome_fornecedor": str(row[3]) if pd.notnull(row[3]) else "",
                    "documento": str(row[4]) if pd.notnull(row[4]) else "",
                    "ramo": str(row[8]) if pd.notnull(row[8]) else "",
                    "contato": str(row[11]) if pd.notnull(row[11]) else ""
                }
            })
    except: pass

    # 🎯 CENTRO DE CUSTO (CAD_CC)
    try:
        df = pd.read_excel(file_path, sheet_name='CAD_CC', skiprows=3, header=None)
        for _, row in df.iterrows():
            if pd.isna(row[1]): continue
            payload.append({
                "name": str(row[1]),
                "type": "centro_custo",
                "metadata": {}
            })
    except: pass

    # 📝 PLANO DE CONTAS (CAD_PL_REC-DESP)
    try:
        df = pd.read_excel(file_path, sheet_name='CAD_PL_REC-DESP', skiprows=4, header=None)
        mappings = [
            (2, 'RECEITA', 'OPERACIONAL'), (5, 'RECEITA', 'NÃO OPERACIONAL'), (8, 'RECEITA', 'OUTRAS'),
            (11, 'DESPESA', 'OPERACIONAL'), (14, 'DESPESA', 'ADMINISTRATIVA'), (17, 'DESPESA', 'COMERCIAL'),
            (20, 'DESPESA', 'PESSOAL'), (23, 'DESPESA', 'FINANCEIRA'), (26, 'DESPESA', 'IMPOSTOS'),
            (29, 'DESPESA', 'INVESTIMENTOS'), (32, 'DESPESA', 'OUTRAS'), (35, 'DESPESA', 'TRANSFERÊNCIAS')
        ]
        
        for col_idx, cat, group in mappings:
            if col_idx >= len(df.columns): continue
            for val in df[col_idx].dropna():
                if str(val).strip() == "" or str(val).strip().upper() == "N/A": continue
                payload.append({
                    "name": str(val),
                    "type": "plano_contas",
                    "metadata": {
                        "classificacao": cat.lower(),
                        "grupo": group
                    }
                })
    except: pass

    with open('scratch/migration_final_payload.json', 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    
    print(f"Sucesso! {len(payload)} registros totais preparados.")

if __name__ == '__main__':
    migrate_final()

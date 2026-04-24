import pandas as pd
import json

file_path = 'Planilha Fluxo de caixa - AF 26 11 2025.xlsm'

def migrate_all():
    payload = []
    
    # 🏢 EMPRESAS
    try:
        df = pd.read_excel(file_path, sheet_name='CAD_EMP', skiprows=3, header=None)
        # Colunas: 1:TIPO, 2:RAZAO SOCIAL, 3:NOME FANTASIA, 4:CNPJ, 5:ENDERECO, 6:CIDADE, 7:UF
        for _, row in df.iterrows():
            if pd.isna(row[2]): continue
            payload.append({
                "name": str(row[2]),
                "type": "empresa",
                "metadata": {
                    "tipo": str(row[1]) if pd.notnull(row[1]) else "",
                    "nome_fantasia": str(row[3]) if pd.notnull(row[3]) else "",
                    "cnpj": str(row[4]) if pd.notnull(row[4]) else "",
                    "endereco": str(row[5]) if pd.notnull(row[5]) else "",
                    "cidade": str(row[6]) if pd.notnull(row[6]) else "",
                    "uf": str(row[7]) if pd.notnull(row[7]) else ""
                }
            })
    except Exception as e: print(f"Erro Empresa: {e}")

    # 🏦 BANCOS
    try:
        df = pd.read_excel(file_path, sheet_name='CAD_BANCOS', skiprows=3, header=None)
        # Colunas: 4:COD BANCO, 5:BANCO, 6:AGENCIA, 7:OP, 8:CONTA, 9:DATA SALDO, 10:R$ SALDO
        for _, row in df.iterrows():
            if pd.isna(row[5]): continue
            payload.append({
                "name": str(row[5]),
                "type": "banco",
                "metadata": {
                    "cod_banco": str(row[4]) if pd.notnull(row[4]) else "",
                    "agencia": str(row[6]) if pd.notnull(row[6]) else "",
                    "op": str(row[7]) if pd.notnull(row[7]) else "",
                    "conta": str(row[8]) if pd.notnull(row[8]) else "",
                    "saldo_inicial": float(row[10]) if pd.notnull(row[10]) and str(row[10]).replace('.','',1).isdigit() else 0
                }
            })
    except Exception as e: print(f"Erro Banco: {e}")

    # 👥 CLIENTES
    try:
        df = pd.read_excel(file_path, sheet_name='CAD_CLIENTES', skiprows=3, header=None)
        # Colunas: 2:NOME, 3:RESPONSAVEL, 4:CNPJ/CPF, 6:CIDADE, 9:TELEFONE
        for _, row in df.iterrows():
            if pd.isna(row[2]): continue
            payload.append({
                "name": str(row[2]),
                "type": "cliente",
                "metadata": {
                    "responsavel": str(row[3]) if pd.notnull(row[3]) else "",
                    "documento": str(row[4]) if pd.notnull(row[4]) else "",
                    "cidade": str(row[6]) if pd.notnull(row[6]) else "",
                    "telefone": str(row[9]) if pd.notnull(row[9]) else ""
                }
            })
    except Exception as e: print(f"Erro Cliente: {e}")

    # Salva o payload para inserção via JS
    with open('scratch/migration_payload.json', 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    
    print(f"Sucesso! {len(payload)} registros preparados para migração.")

if __name__ == '__main__':
    migrate_all()

import pandas as pd
import json

file_path = 'Planilha Fluxo de caixa - AF 26 11 2025.xlsm'

def extract_data():
    results = {}
    
    # 🏢 Empresas
    try:
        df_emp = pd.read_excel(file_path, sheet_name='CAD_EMP', skiprows=1) # Pulando cabeçalho se houver
        results['empresas'] = df_emp.head(20).to_dict(orient='records')
    except: pass

    # 🏦 Bancos
    try:
        df_bancos = pd.read_excel(file_path, sheet_name='CAD_BANCOS', skiprows=1)
        results['bancos'] = df_bancos.head(20).to_dict(orient='records')
    except: pass

    # 👥 Clientes
    try:
        df_clientes = pd.read_excel(file_path, sheet_name='CAD_CLIENTES', skiprows=1)
        results['clientes'] = df_clientes.head(20).to_dict(orient='records')
    except: pass

    print(json.dumps(results, indent=2, default=str))

if __name__ == '__main__':
    extract_data()

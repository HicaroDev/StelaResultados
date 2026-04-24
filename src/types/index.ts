export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pendente' | 'pago' | 'atrasado' | 'cancelado';

export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  dueDate?: string;
  paymentDate?: string;
  status: TransactionStatus;
  type: TransactionType;
}

export interface DRELine {
  label: string;
  values: number[]; // values for each month
  isTotal?: boolean;
  isSubtotal?: boolean;
  indent?: number;
}

export type BalanceCategory = 'Ativo Circulante' | 'Ativo Não Circulante' | 'Passivo Circulante' | 'Passivo Não Circulante' | 'Patrimônio Líquido';

export interface BalanceItem {
  id: string;
  label: string;
  amount: number;
  category: BalanceCategory;
  year: number;
  updatedAt: string;
}

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pendente' | 'pago' | 'atrasado' | 'cancelado';

export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  dueDate?: string;
  due_date?: string; // Supabase compat
  paymentDate?: string;
  payment_date?: string; // Supabase compat
  status: TransactionStatus;
  type: TransactionType;
  empresa_id?: string;
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

export enum PaymentMethod {
  PIX = 'pix',
  BOLETO = 'boleto',
  CREDIT_CARD = 'credit_card'
}

export interface Debt {
  id: string;
  title: string;
  year: number;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
}

export interface InstallmentOption {
  id: string;
  installments: number;
  label: string;
  discountLabel: string;
  totalAmount: number;
  installmentValue: number;
}

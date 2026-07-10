export const PAYSTACK_TRANSACTION_FEE_RATE = 0.02;

export interface PaymentBreakdown {
  orderTotal: number;
  orderTotalPesewas: number;
  transactionFee: number;
  transactionFeePesewas: number;
  chargedAmount: number;
  chargedAmountPesewas: number;
  currency: "GHS";
  feeRate: number;
}

export const toPesewas = (amount: number) => Math.round(Number(amount || 0) * 100);
export const fromPesewas = (amount: number) => Number((Number(amount || 0) / 100).toFixed(2));

export const calculatePaystackPaymentBreakdown = (orderTotal: number): PaymentBreakdown => {
  const orderTotalPesewas = toPesewas(orderTotal);
  const transactionFeePesewas = Math.round(orderTotalPesewas * PAYSTACK_TRANSACTION_FEE_RATE);
  const chargedAmountPesewas = orderTotalPesewas + transactionFeePesewas;

  return {
    orderTotal: fromPesewas(orderTotalPesewas),
    orderTotalPesewas,
    transactionFee: fromPesewas(transactionFeePesewas),
    transactionFeePesewas,
    chargedAmount: fromPesewas(chargedAmountPesewas),
    chargedAmountPesewas,
    currency: "GHS",
    feeRate: PAYSTACK_TRANSACTION_FEE_RATE,
  };
};

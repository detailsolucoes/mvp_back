import type { OrderStatus } from '@/types';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  recebido: 'Recebido',
  em_preparo: 'Em Preparo',
  pronto: 'Pronto / Saiu',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  pix: 'PIX',
  dinheiro: 'Dinheiro',
  cartao: 'Cartão',
  pendente: 'Pendente',
};
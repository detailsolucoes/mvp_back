import { useState } from 'react';
import { mockOrders } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Plus, ChevronRight, User, Phone, MapPin, Clock, CreditCard, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OrderForm } from '@/components/forms/OrderForm';
import type { Order, OrderStatus } from '@/types';
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '@/lib/constants';

const columns: { id: OrderStatus; label: string }[] = [
  { id: 'recebido', label: ORDER_STATUS_LABELS.recebido },
  { id: 'em_preparo', label: ORDER_STATUS_LABELS.em_preparo },
  { id: 'pronto', label: ORDER_STATUS_LABELS.pronto },
  { id: 'entregue', label: ORDER_STATUS_LABELS.entregue },
  { id: 'cancelado', label: ORDER_STATUS_LABELS.cancelado },
];

function OrderDetailsPopup({ order }: { order: Order }) {
  const orderTime = new Date(order.createdAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <User className="h-3 w-3" /> Cliente
          </p>
          <p className="font-medium">{order.customerName}</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
            <Clock className="h-3 w-3" /> Horário
          </p>
          <p className="font-medium">{orderTime}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Phone className="h-3 w-3" /> WhatsApp
          </p>
          <p className="font-medium">{order.customerWhatsapp}</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
            <CreditCard className="h-3 w-3" /> Pagamento
          </p>
          <p className="font-medium">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" /> Endereço de Entrega
        </p>
        <p className="font-medium text-sm">{order.customerAddress}</p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/50 px-4 py-2 border-b">
          <p className="text-xs font-bold uppercase tracking-wider">Itens do Pedido</p>
        </div>
        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="px-4 py-3 flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded text-xs">
                  {item.quantity}x
                </span>
                <span>{item.productName}</span>
              </div>
              <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
            </div>
          ))}
        </div>
        <div className="bg-muted/30 px-4 py-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>R$ {(order.total - 5).toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxa de Entrega</span>
            <span>R$ 5,00</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t font-bold text-lg text-primary">
            <span>Total</span>
            <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="space-y-1 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
          <p className="text-xs text-yellow-700 dark:text-yellow-400 flex items-center gap-1 font-bold">
            <FileText className="h-3 w-3" /> Observações
          </p>
          <p className="text-sm italic">{order.notes}</p>
        </div>
      )}
    </div>
  );
}

function OrderCard({ 
  order, 
  onDragStart,
  onAdvance
}: { 
  order: Order; 
  onDragStart: (e: React.DragEvent, orderId: string) => void;
  onAdvance: (orderId: string, currentStatus: OrderStatus) => void;
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const lastFourDigits = order.customerWhatsapp.slice(-4);
  const orderTime = new Date(order.createdAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const canAdvance = order.status !== 'entregue' && order.status !== 'cancelado';

  return (
    <>
      <Card
        draggable
        onDragStart={(e) => onDragStart(e, order.id)}
        onClick={() => setIsDetailsOpen(true)}
        className="gradient-border-card cursor-grab active:cursor-grabbing hover:bg-muted/30 transition-colors relative group"
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{order.customerName}</p>
              <p className="text-xs text-muted-foreground">****{lastFourDigits}</p>
            </div>
            <span className="text-xs text-muted-foreground">{orderTime}</span>
          </div>

          <div className="text-sm text-muted-foreground">
            {order.items.slice(0, 3).map((item, i) => (
              <p key={item.id}>
                {item.quantity}x {item.productName}
              </p>
            ))}
            {order.items.length > 3 && (
              <p className="text-xs">+{order.items.length - 3} item(s)</p>
            )}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-xs px-2 py-1 bg-muted rounded">
              {PAYMENT_METHOD_LABELS[order.paymentMethod]}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">
                R$ {order.total.toFixed(2).replace('.', ',')}
              </span>
              {canAdvance && (
                <Button
                  variant="default"
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-sm hover:scale-110 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdvance(order.id, order.status);
                  }}
                  title="Avançar etapa"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {order.notes && (
            <p className="text-xs text-muted-foreground italic border-l-2 border-primary pl-2 truncate">
              {order.notes}
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Detalhes do Pedido #{order.id.slice(-4).toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          <OrderDetailsPopup order={order} />
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsDetailsOpen(false)}>
              Fechar
            </Button>
            {canAdvance && (
              <Button className="flex-1 gap-2" onClick={() => {
                onAdvance(order.id, order.status);
                setIsDetailsOpen(false);
              }}>
                Avançar Pedido <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function KanbanColumn({
  column,
  orders,
  onDragStart,
  onDrop,
  onDragOver,
  onAdvance,
}: {
  column: { id: OrderStatus; label: string };
  orders: Order[];
  onDragStart: (e: React.DragEvent, orderId: string) => void;
  onDrop: (e: React.DragEvent, status: OrderStatus) => void;
  onDragOver: (e: React.DragEvent) => void;
  onAdvance: (orderId: string, currentStatus: OrderStatus) => void;
}) {
  return (
    <div
      className="flex-1 min-w-[280px] max-w-[350px]"
      onDrop={(e) => onDrop(e, column.id)}
      onDragOver={onDragOver}
    >
      <Card className="h-full bg-card border-border">
        <CardHeader className="pb-2 border-b border-border">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>{column.label}</span>
            <span className="text-xs px-2 py-1 bg-muted rounded-full">
              {orders.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 space-y-2 min-h-[calc(100vh-300px)] overflow-y-auto">
          {orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onDragStart={onDragStart} 
              onAdvance={onAdvance}
            />
          ))}
          {orders.length === 0 && (
            <div className="py-8 text-center text-muted-foreground text-sm">
              Nenhum pedido
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Pedidos() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    setDraggedOrderId(orderId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: OrderStatus) => {
    e.preventDefault();
    if (!draggedOrderId) return;

    updateOrderStatus(draggedOrderId, newStatus);
    setDraggedOrderId(null);
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const handleAdvance = (orderId: string, currentStatus: OrderStatus) => {
    const statusFlow: OrderStatus[] = ['recebido', 'em_preparo', 'pronto', 'entregue'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    if (currentIndex !== -1 && currentIndex < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIndex + 1];
      updateOrderStatus(orderId, nextStatus);
    }
  };

  const handleCreateOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setIsDialogOpen(false);
  };

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter((order) => order.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold gradient-text">Pedidos</h1>
            <p className="text-muted-foreground">Gerencie o fluxo de pedidos</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Pedido
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Pedido Manual</DialogTitle>
            </DialogHeader>
            <OrderForm onClose={() => setIsDialogOpen(false)} onSubmit={handleCreateOrder} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            orders={getOrdersByStatus(column.id)}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onAdvance={handleAdvance}
          />
        ))}
      </div>
    </div>
  );
}

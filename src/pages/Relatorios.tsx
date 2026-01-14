import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { mockDashboardStats, mockCustomers, mockProducts } from '@/data/mockData';
import { BarChart3 } from 'lucide-react';

// Mock data for charts
const revenueByDay = [
  { day: 'Seg', value: 420 },
  { day: 'Ter', value: 380 },
  { day: 'Qua', value: 510 },
  { day: 'Qui', value: 455 },
  { day: 'Sex', value: 680 },
  { day: 'Sáb', value: 820 },
  { day: 'Dom', value: 750 },
];

const ordersByDay = [
  { day: 'Seg', value: 12 },
  { day: 'Ter', value: 10 },
  { day: 'Qua', value: 15 },
  { day: 'Qui', value: 13 },
  { day: 'Sex', value: 22 },
  { day: 'Sáb', value: 28 },
  { day: 'Dom', value: 25 },
];

function SimpleBarChart({ data, label }: { data: { day: string; value: number }[]; label: string }) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.day} className="flex items-center gap-3">
          <span className="w-8 text-sm text-muted-foreground">{item.day}</span>
          <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] transition-all duration-300"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <span className="w-16 text-sm text-right font-medium">
            {label === 'R$' ? `R$ ${item.value.toFixed(0)}` : item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Relatorios() {
  const [period, setPeriod] = useState('week');

  const totalRevenue = revenueByDay.reduce((sum, d) => sum + d.value, 0);
  const totalOrders = ordersByDay.reduce((sum, d) => sum + d.value, 0);
  const averageTicket = totalRevenue / totalOrders;

  const topCustomers = [...mockCustomers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const topProducts = mockDashboardStats.topProducts.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold gradient-text">Relatórios</h1>
          <p className="text-muted-foreground">Análise de desempenho do seu negócio</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div></div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Esta Semana</SelectItem>
            <SelectItem value="month">Este Mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="gradient-border-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Receita Total</p>
            <p className="text-2xl font-bold">R$ {totalRevenue.toFixed(2).replace('.', ',')}</p>
          </CardContent>
        </Card>
        <Card className="gradient-border-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total de Pedidos</p>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </CardContent>
        </Card>
        <Card className="gradient-border-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Ticket Médio</p>
            <p className="text-2xl font-bold">R$ {averageTicket.toFixed(2).replace('.', ',')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="gradient-border-card">
          <CardHeader>
            <CardTitle className="text-lg">Receita Diária</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={revenueByDay} label="R$" />
          </CardContent>
        </Card>

        <Card className="gradient-border-card">
          <CardHeader>
            <CardTitle className="text-lg">Pedidos por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={ordersByDay} label="" />
          </CardContent>
        </Card>
      </div>

      {/* Rankings */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="gradient-border-card">
          <CardHeader>
            <CardTitle className="text-lg">Melhores Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.orderCount} pedidos</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">
                    R$ {customer.totalSpent.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-border-card">
          <CardHeader>
            <CardTitle className="text-lg">Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.productName} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <p className="font-medium">{product.productName}</p>
                  </div>
                  <span className="font-bold">
                    {product.quantity} un.
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
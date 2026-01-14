import { mockDashboardStats, mockOrders, mockCompanies } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Globe, Building2 } from 'lucide-react';
import { ORDER_STATUS_LABELS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';

function StatCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <Card className="gradient-border-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const stats = mockDashboardStats;
  const recentOrders = mockOrders.slice(0, 5);
  const isSuperAdmin = user?.role === 'super_admin';

  // Dashboard para Super Admin
  if (isSuperAdmin) {
    const totalCompanies = mockCompanies.length;
    const activeCompanies = mockCompanies.filter(c => c.active).length;
    const totalRevenue = mockCompanies.reduce((sum, c) => sum + (c.estimatedMonthlyRevenue || 0), 0);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold gradient-text">Painel Global</h1>
            <p className="text-muted-foreground">Visão geral de todas as empresas do sistema</p>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total de Empresas" 
            value={totalCompanies}
            subtitle="Empresas cadastradas" 
          />
          <StatCard 
            title="Empresas Ativas" 
            value={activeCompanies}
            subtitle={`${((activeCompanies/totalCompanies)*100).toFixed(0)}% do total`}
          />
          <StatCard 
            title="Faturamento Total (Estimado)" 
            value={`R$ ${totalRevenue.toFixed(2).replace('.', ',')}`}
            subtitle="Receita mensal estimada" 
          />
          <StatCard 
            title="Ticket Médio Global" 
            value={`R$ ${(stats.revenueToday / stats.ordersToday).toFixed(2).replace('.', ',')}`}
            subtitle="Valor médio por pedido" 
          />
        </div>

        {/* Empresas Overview */}
        <Card className="gradient-border-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Empresas Cadastradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCompanies.map((company) => (
                <div key={company.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.name} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{company.customName || company.name}</p>
                      <p className="text-xs text-muted-foreground">{company.whatsapp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">R$ {company.estimatedMonthlyRevenue?.toFixed(2).replace('.', ',')}</p>
                    <p className={`text-xs ${company.active ? 'text-green-500' : 'text-red-500'}`}>
                      {company.active ? '✓ Ativa' : '✗ Inativa'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Global Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="gradient-border-card">
            <CardHeader>
              <CardTitle className="text-lg">Pedidos por Status (Global)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS]}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-border-card">
            <CardHeader>
              <CardTitle className="text-lg">Produtos Mais Vendidos (Global)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topProducts.slice(0, 5).map((product, index) => (
                  <div key={product.productName} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {index + 1}. {product.productName}
                    </span>
                    <span className="text-sm font-medium">{product.quantity} un.</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Dashboard para Admin de Empresa
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu negócio</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Pedidos Hoje" 
          value={stats.ordersToday} 
          subtitle="Total de pedidos do dia" 
        />
        <StatCard 
          title="Receita Hoje" 
          value={`R$ ${stats.revenueToday.toFixed(2).replace('.', ',')}`} 
          subtitle="Faturamento do dia" 
        />
        <StatCard 
          title="Clientes Recorrentes" 
          value={stats.returningCustomers} 
          subtitle="Voltaram a comprar" 
        />
        <StatCard 
          title="Ticket Médio" 
          value={`R$ ${(stats.revenueToday / stats.ordersToday).toFixed(2).replace('.', ',')}`} 
          subtitle="Valor médio por pedido" 
        />
      </div>

      {/* Orders by Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="gradient-border-card">
          <CardHeader>
            <CardTitle className="text-lg">Pedidos por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS]}</span>
                  <span className="text-sm font-medium">{count}</span>
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
            <div className="space-y-3">
              {stats.topProducts.slice(0, 5).map((product, index) => (
                <div key={product.productName} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {index + 1}. {product.productName}
                  </span>
                  <span className="text-sm font-medium">{product.quantity} un.</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="gradient-border-card">
        <CardHeader>
          <CardTitle className="text-lg">Últimos Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.map(i => i.productName).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ {order.total.toFixed(2).replace('.', ',')}</p>
                  <p className="text-xs text-muted-foreground">{ORDER_STATUS_LABELS[order.status]}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

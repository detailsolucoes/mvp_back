import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Upload, Building2, Palette } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockCompanies } from '@/data/mockData';

export default function Configuracoes() {
  const { user } = useAuth();
  const company = mockCompanies.find(c => c.id === user?.companyId) || mockCompanies[0];
  
  const [settings, setSettings] = useState({
    businessName: company.name,
    whatsapp: company.whatsapp,
    deliveryFee: company.deliveryFee.toString(),
    minOrderValue: company.minOrderValue.toString(),
    openingHours: company.openingHours,
    autoConfirmOrder: true,
    sendDeliveryNotification: true,
    welcomeMessage: 'Olá! 👋 Bem-vindo à {empresa}. Como posso ajudar?',
    orderConfirmationMessage: 'Seu pedido #{numero} foi recebido! Em breve começaremos a preparar.',
    deliveryMessage: 'Seu pedido #{numero} saiu para entrega! 🛵',
  });

  const handleChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold gradient-text">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações da sua empresa</p>
        </div>
      </div>

      {/* Personalização Visual (Apenas para Admins) */}
      {user?.role === 'admin' && (
        <Card className="gradient-border-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Personalização Visual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customName">Nome Exibido no CRM</Label>
                <Input
                  id="customName"
                  defaultValue={company.customName || company.name}
                  placeholder="Ex: Minha Loja Inc."
                />
                <p className="text-xs text-muted-foreground">Este nome aparecerá na sidebar e nos cabeçalhos.</p>
              </div>
              <div className="space-y-2">
                <Label>Logo da Empresa</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50 overflow-hidden">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-8 w-8 text-muted-foreground/50" />
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" /> Alterar Logo
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Info */}
      <Card className="gradient-border-card">
        <CardHeader>
          <CardTitle className="text-lg">Informações da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nome da Empresa</Label>
              <Input
                id="businessName"
                value={settings.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={settings.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="11999999999"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="openingHours">Horário de Funcionamento</Label>
            <Input
              id="openingHours"
              value={settings.openingHours}
              onChange={(e) => handleChange('openingHours', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery Settings */}
      <Card className="gradient-border-card">
        <CardHeader>
          <CardTitle className="text-lg">Configurações de Entrega</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
              <Input
                id="deliveryFee"
                type="number"
                step="0.01"
                value={settings.deliveryFee}
                onChange={(e) => handleChange('deliveryFee', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minOrderValue">Pedido Mínimo (R$)</Label>
              <Input
                id="minOrderValue"
                type="number"
                step="0.01"
                value={settings.minOrderValue}
                onChange={(e) => handleChange('minOrderValue', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation */}
      <Card className="gradient-border-card">
        <CardHeader>
          <CardTitle className="text-lg">Automações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Confirmar pedido automaticamente</p>
              <p className="text-sm text-muted-foreground">
                Pedidos recebidos via WhatsApp serão confirmados automaticamente
              </p>
            </div>
            <Switch
              checked={settings.autoConfirmOrder}
              onCheckedChange={(checked) => handleChange('autoConfirmOrder', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificação de entrega</p>
              <p className="text-sm text-muted-foreground">
                Enviar mensagem automática quando pedido sair para entrega
              </p>
            </div>
            <Switch
              checked={settings.sendDeliveryNotification}
              onCheckedChange={(checked) => handleChange('sendDeliveryNotification', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card className="gradient-border-card">
        <CardHeader>
          <CardTitle className="text-lg">Modelos de Mensagem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">Mensagem de Boas-Vindas</Label>
            <Textarea
              id="welcomeMessage"
              value={settings.welcomeMessage}
              onChange={(e) => handleChange('welcomeMessage', e.target.value)}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">Use {'{empresa}'} para inserir o nome da empresa</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="orderConfirmationMessage">Confirmação de Pedido</Label>
            <Textarea
              id="orderConfirmationMessage"
              value={settings.orderConfirmationMessage}
              onChange={(e) => handleChange('orderConfirmationMessage', e.target.value)}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">Use {'{numero}'} para inserir o número do pedido</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryMessage">Saiu para Entrega</Label>
            <Textarea
              id="deliveryMessage"
              value={settings.deliveryMessage}
              onChange={(e) => handleChange('deliveryMessage', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={handleSave}>Salvar Alterações</Button>
      </div>
    </div>
  );
}

import React from 'react';
import { NavLink } from '@/components/ui/nav-link';
import { SidebarBody, SidebarLink, useSidebar } from '@/components/ui/sidebar'; // Import useSidebar
import logo from '@/assets/logo.jpeg';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Pizza, 
  Menu, 
  BarChart3, 
  Settings,
  LogOut,
  MessageSquare
} from 'lucide-react';

const menuItems = [
  { 
    title: 'Dashboard', 
    url: '/', 
    icon: LayoutDashboard 
  },
  { 
    title: 'Pedidos', 
    url: '/pedidos', 
    icon: ShoppingCart 
  },
  { 
    title: 'Clientes', 
    url: '/clientes', 
    icon: Users 
  },
  { 
    title: 'Produtos', 
    url: '/produtos', 
    icon: Pizza 
  },
  { 
    title: 'Menu Público', 
    url: '/menu', 
    icon: Menu 
  },
  { 
    title: 'Relatórios', 
    url: '/relatorios', 
    icon: BarChart3 
  },
  { 
    title: 'Chat', 
    url: '/chat', 
    icon: MessageSquare 
  },
  { 
    title: 'Configurações', 
    url: '/configuracoes', 
    icon: Settings 
  },
];

export function AppSidebarContent() {
  const { open } = useSidebar(); // Consome o estado 'open' do contexto fornecido pelo Sidebar pai

  return (
    <SidebarBody className="justify-between gap-10">
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {open ? <Logo /> : <LogoIcon />}
        <div className="mt-8 flex flex-col gap-2">
          {menuItems.map((item, idx) => (
            <SidebarLink key={idx} link={{
              label: item.title,
              href: item.url,
              icon: <item.icon className="text-foreground h-5 w-5 flex-shrink-0" />
            }} />
          ))}
        </div>
      </div>
      <div>
        <SidebarLink
          link={{
            label: "Sair",
            href: "/login",
            icon: (
              <LogOut className="text-foreground h-5 w-5 flex-shrink-0" />
            ),
          }}
        />
      </div>
    </SidebarBody>
  );
}

export const Logo = () => {
  return (
    <div className="flex items-center space-x-2 py-1 relative z-20">
      <img 
        src={logo} 
        alt="Detail Soluções" 
        className="h-8 w-auto object-contain"
      />
      <span className="font-medium text-foreground whitespace-pre">
        Detail Soluções
      </span>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <div className="flex items-center justify-center py-1 relative z-20">
      <img 
        src={logo} 
        alt="Detail Soluções" 
        className="h-10 w-auto object-contain"
      />
    </div>
  );
};
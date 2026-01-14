"use client"
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Pizza,
  Menu as MenuIcon,
  BarChart3,
  Settings,
  LogOut,
  MessageSquare,
  ChevronDown,
  ChevronsRight,
  Moon,
  Sun,
  Bell,
  User,
  ShieldCheck,
  Circle,
} from "lucide-react";
import logo from '@/assets/logo.jpeg';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { mockCompanies } from '@/data/mockData';
import { Switch } from "@/components/ui/switch";

const menuItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Pedidos', url: '/pedidos', icon: ShoppingCart },
  { title: 'Clientes', url: '/clientes', icon: Users },
  { title: 'Produtos', url: '/produtos', icon: Pizza },
  { title: 'Menu Público', url: '/menu', icon: MenuIcon },
  { title: 'Relatórios', url: '/relatorios', icon: BarChart3 },
  { title: 'Chat', url: '/chat', icon: MessageSquare },
  { title: 'Usuários', url: '/usuarios', icon: Users },
  { title: 'Configurações', url: '/configuracoes', icon: Settings },
];

const adminItems = [
  { title: 'Dashboard', url: '/admin-global/dashboard', icon: LayoutDashboard },
  { title: 'Empresas', url: '/admin-global/empresas', icon: Users },
  { title: 'Usuários', url: '/admin-global/usuarios', icon: ShieldCheck }
];

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const setIsDark = (dark: boolean) => setTheme(dark ? 'dark' : 'light');

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Sidebar />
        <ExampleContent isDark={isDark} setIsDark={setIsDark}>
          {children}
        </ExampleContent>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const showStoreStatus = user?.role === 'admin' || user?.role === 'attendant';

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm flex flex-col`}
    >
      <TitleSection open={open} />

      <div className="space-y-1 flex-1 overflow-y-auto overflow-x-hidden">
        {user?.role === 'super_admin' && adminItems.map((item) => (
          <Option
            key={item.url}
            Icon={item.icon}
            title={item.title}
            url={item.url}
            selected={location.pathname === item.url}
            open={open}
          />
        ))}
        
        {user?.role !== 'super_admin' && menuItems
          .filter(item => {
            if (user?.role === 'admin') {
              if (item.url === '/configuracoes') return false;
              return true;
            }
            if (user?.role === 'attendant') {
              if (['/', '/relatorios', '/configuracoes', '/usuarios'].includes(item.url)) {
                return false;
              }
            }
            return true;
          })
          .map((item) => (
            <Option
              key={item.url}
              Icon={item.icon}
              title={item.title}
              url={item.url}
              selected={location.pathname === item.url}
              open={open}
            />
          ))}
      </div>

      <div className="mt-auto border-t border-gray-200 dark:border-gray-800 pt-2">
        {showStoreStatus && (
          <div className={`mb-2 px-2 py-2 rounded-md ${open ? 'bg-gray-50 dark:bg-gray-800/50' : 'flex justify-center'}`}>
            {open ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Circle className={`h-2 w-2 fill-current ${isStoreOpen ? 'text-green-500' : 'text-red-500'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {isStoreOpen ? "Aberto" : "Fechado"}
                  </span>
                </div>
                <Switch 
                  checked={isStoreOpen} 
                  onCheckedChange={setIsStoreOpen}
                  className="scale-75 data-[state=checked]:bg-green-500"
                />
              </div>
            ) : (
              <div 
                className={`h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 shadow-sm ${isStoreOpen ? 'bg-green-500' : 'bg-red-500'}`}
                title={isStoreOpen ? "Aberto" : "Fechado"}
              />
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200`}
        >
          <div className="grid h-full w-12 place-content-center">
            <LogOut className="h-4 w-4" />
          </div>
          {open && <span className="text-sm font-medium">Sair</span>}
        </button>
        <ToggleClose open={open} setOpen={setOpen} />
      </div>
    </nav>
  );
};

const Option = ({ Icon, title, url, selected, open }: any) => {
  return (
    <Link
      to={url}
      className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${
        selected 
          ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm border-l-2 border-blue-500" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      <div className="grid h-full w-12 place-content-center">
        <Icon className="h-4 w-4" />
      </div>
      {open && (
        <span className={`text-sm font-medium transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
          {title}
        </span>
      )}
    </Link>
  );
};

const TitleSection = ({ open }) => {
  const { user } = useAuth();
  const company = mockCompanies.find(c => c.id === user?.companyId) || mockCompanies[0];
  const displayName = user?.role === 'super_admin' ? 'Super Admin' : (company.customName || company.name);

  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex items-center gap-3">
          <Logo open={open} company={company} />
          {open && (
            <div className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-2">
                <div>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
                    {displayName}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    {user?.role === 'super_admin' ? 'Administração Global' : 'Painel da Empresa'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {open && <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
      </div>
    </div>
  );
};

const Logo = ({ open, company }: { open: boolean, company: any }) => {
  return (
    <div className={`grid ${open ? 'size-10' : 'size-8'} shrink-0 place-content-center rounded-lg bg-white shadow-sm overflow-hidden`}>
      <img 
        src={company.logoUrl || logo} 
        alt={company.name} 
        className="h-full w-full object-cover"
      />
    </div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full border-t border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 mt-2"
    >
      <div className="flex items-center h-11">
        <div className="grid h-full w-12 place-content-center">
          <ChevronsRight
            className={`h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        {open && (
          <span className={`text-sm font-medium text-gray-600 dark:text-gray-300 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
            Recolher
          </span>
        )}
      </div>
    </button>
  );
};

const ExampleContent = ({ isDark, setIsDark, children }: any) => {
  const location = useLocation();
  const { user } = useAuth();
  const company = mockCompanies.find(c => c.id === user?.companyId) || mockCompanies[0];
  const pageTitle = [...menuItems, ...adminItems].find(item => item.url === location.pathname)?.title || 'Dashboard';

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-950 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{pageTitle}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {user?.role === 'super_admin' ? 'Gestão de Ecossistema' : `Painel Administrativo - ${company.customName || company.name}`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default MainLayout;

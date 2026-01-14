"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, ShoppingCart, Users, Pizza, Menu, BarChart3, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import logo from '@/assets/logo.jpeg';

export function SidebarDemo() {
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <LayoutDashboard className="text-foreground h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Pedidos",
      href: "/pedidos",
      icon: (
        <ShoppingCart className="text-foreground h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Clientes",
      href: "/clientes",
      icon: (
        <Users className="text-foreground h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Produtos",
      href: "/produtos",
      icon: (
        <Pizza className="text-foreground h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Menu Público",
      href: "/menu",
      icon: (
        <Menu className="text-foreground h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Relatórios",
      href: "/relatorios",
      icon: (
        <BarChart3 className="text-foreground h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Configurações",
      href: "/configuracoes",
      icon: (
        <Settings className="text-foreground h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-background w-full flex-1 max-w-7xl mx-auto border border-border overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
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
      </Sidebar>
      <Dashboard />
    </div>
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
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-foreground whitespace-pre"
      >
        Detail Soluções
      </motion.span>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <div className="flex items-center space-x-2 py-1 relative z-20">
      <img 
        src={logo} 
        alt="Detail Soluções" 
        className="h-8 w-auto object-contain"
      />
    </div>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-border bg-background flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex gap-2">
          {[...new Array(4)].map((i) => (
            <div
              key={"first-array" + i}
              className="h-20 w-full rounded-lg  bg-muted animate-pulse"
            ></div>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          {[...new Array(2)].map((i) => (
            <div
              key={"second-array" + i}
              className="h-full w-full rounded-lg  bg-muted animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link"; // Caminho atualizado
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(
  undefined,
);

export const Sidebar = ({
  children,
  open,
  setOpen,
  className,
  ...props
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}) => {
  const isMobile = useIsMobile();

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <motion.nav
        animate={{
          width: open ? "300px" : "60px",
        }}
        onHoverStart={() => {
          if (!isMobile) setOpen(true);
        }}
        onHoverEnd={() => {
          if (!isMobile) setOpen(false);
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-all duration-300 ease-in-out",
          className,
        )}
        {...props}
      >
        <div className="flex h-14 items-center justify-center border-b border-sidebar-border px-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
            )}
          </Button>
        </div>
        {children}
      </motion.nav>
    </SidebarContext.Provider>
  );
};

export const SidebarBody = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-1 flex-col p-4", className)} {...props}>
      {children}
    </div>
  );
};

interface SidebarLinkProps {
  link: {
    label: string;
    href: string;
    icon: React.ReactNode;
  };
}

export const SidebarLink = ({ link }: SidebarLinkProps) => {
  const { open } = useSidebar();
  return (
    <NavLink
      to={link.href}
    >
      {link.icon}
      <motion.span
        animate={{
          opacity: open ? 1 : 0,
          width: open ? "auto" : 0,
          overflow: "hidden",
        }}
        className="whitespace-pre text-sidebar-foreground"
      >
        {link.label}
      </motion.span>
    </NavLink>
  );
};

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
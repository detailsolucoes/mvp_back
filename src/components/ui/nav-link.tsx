import { NavLink as RouterNavLink, NavLinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';
import React from 'react';

interface CustomNavLinkProps extends NavLinkProps {
  children: React.ReactNode;
}

export const NavLink = React.forwardRef<HTMLAnchorElement, CustomNavLinkProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
            className
          )
        }
        {...props}
      >
        {children}
      </RouterNavLink>
    );
  }
);

NavLink.displayName = "NavLink";
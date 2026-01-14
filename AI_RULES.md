# AI Rules for Detail Soluções CRM

## Tech Stack

- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with strict type checking
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom design tokens
- **shadcn/ui** - High-quality, customizable UI components built on Radix UI
- **React Router DOM** - Declarative routing for React applications
- **TanStack Query (React Query)** - Server state management and caching
- **React Hook Form** - Performant form library with validation
- **Zod** - Schema validation and type inference
- **Lucide React** - Beautiful, consistent icon library

## Library Usage Rules

### UI Components
- **Always use shadcn/ui components** when available
- **Never create custom UI components** if shadcn/ui has an equivalent
- **Import shadcn/ui components** from `@/components/ui/[component]`
- **Use Tailwind CSS classes** for all styling, never inline styles
- **Follow the existing design tokens** defined in `src/index.css`

### Forms
- **Always use React Hook Form** for form handling
- **Always use Zod** for form validation schemas
- **Combine React Hook Form + Zod** using `@hookform/resolvers`
- **Use shadcn/ui form components** (Input, Select, etc.) with form hooks

### Data Fetching & State Management
- **Always use TanStack Query** for server state and API calls
- **Use React state** for local component state only
- **Never use manual useEffect for data fetching** - use TanStack Query instead
- **Create custom hooks** for complex data fetching logic

### Routing
- **Always use React Router DOM** for navigation
- **Define all routes** in `src/App.tsx`
- **Use the `NavLink` component** for navigation links with active state
- **Create page components** in `src/pages/` directory
- **Use lazy loading** for page components if needed

### Icons
- **Always use Lucide React** icons
- **Import icons individually** (tree-shaking)
- **Use consistent icon sizes** (16px, 20px, 24px)

### Styling
- **Use Tailwind CSS utility classes** exclusively
- **Follow the gradient design system** defined in CSS variables
- **Use the gradient-text utility** for headings
- **Use gradient-border-card** for card components
- **Never use custom CSS classes** - extend Tailwind instead

### File Organization
- **Pages go in `src/pages/`** - one file per route
- **Components go in `src/components/`** - organize by feature
- **Types go in `src/types/`** - central type definitions
- **Utils go in `src/lib/`** - helper functions
- **Data goes in `src/data/`** - mock data and constants

### Development Rules
- **Always use TypeScript** - no JavaScript files
- **Follow the existing code style** - use the same patterns
- **Write responsive designs** - use Tailwind responsive classes
- **Add proper error boundaries** for error handling
- **Use the existing mock data** structure for development

### Integration Rules
- **Never add new npm packages** without approval
- **Use existing dependencies** from package.json
- **Follow the existing component patterns** when creating new components
- **Maintain consistency** with existing codebase conventions
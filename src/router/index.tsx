import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/pages/Dashboard";
import Pedidos from "@/pages/Pedidos";
import Clientes from "@/pages/Clientes";
import Produtos from "@/pages/Produtos";
import MenuPublico from "@/pages/MenuPublico";
import Relatorios from "@/pages/Relatorios";
import Configuracoes from "@/pages/Configuracoes";
import EmpresaUsuarios from "@/pages/EmpresaUsuarios";
import Chat from "@/pages/Chat";
import Login from "@/pages/Login";
import AuthCallback from "@/pages/AuthCallback";
import ResetPassword from "@/pages/ResetPassword";
import CompleteSignup from "@/pages/CompleteSignup";
import NotFound from "@/pages/NotFound";
import DashboardGlobal from "@/pages/admin-global/DashboardGlobal";
import Empresas from "@/pages/admin-global/Empresas";
import Usuarios from "@/pages/admin-global/Usuarios";

// Componente para redirecionar usuários que acessam a raiz baseados em seus papéis
const RootRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === 'super_admin') {
    return <Navigate to="/admin-global/dashboard" replace />;
  }
  
  if (user?.role === 'attendant') {
    return <Navigate to="/pedidos" replace />;
  }
  
  // Admin de empresa vai para o Dashboard padrão
  return <Dashboard />;
};

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/complete-signup" element={<CompleteSignup />} />
      
      {/* Protected routes with layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout><RootRedirect /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/pedidos" element={
        <ProtectedRoute>
          <MainLayout><Pedidos /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/clientes" element={
        <ProtectedRoute>
          <MainLayout><Clientes /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/produtos" element={
        <ProtectedRoute>
          <MainLayout><Produtos /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/menu" element={
        <ProtectedRoute>
          <MainLayout><MenuPublico /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/relatorios" element={
        <ProtectedRoute requiredRole="admin">
          <MainLayout><Relatorios /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/usuarios" element={
        <ProtectedRoute requiredRole="admin">
          <MainLayout><EmpresaUsuarios /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/configuracoes" element={
        <ProtectedRoute requiredRole="super_admin">
          <MainLayout><Configuracoes /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/chat" element={
        <ProtectedRoute>
          <MainLayout><Chat /></MainLayout>
        </ProtectedRoute>
      } />

      {/* Admin Global routes - Super Admin only */}
      <Route path="/admin-global/dashboard" element={
        <ProtectedRoute requiredRole="super_admin">
          <MainLayout><DashboardGlobal /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin-global/empresas" element={
        <ProtectedRoute requiredRole="super_admin">
          <MainLayout><Empresas /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin-global/usuarios" element={
        <ProtectedRoute requiredRole="super_admin">
          <MainLayout><Usuarios /></MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

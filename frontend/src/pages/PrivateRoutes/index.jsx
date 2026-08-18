// src/components/PrivateRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function PrivateRoute() {
    // pegando as informações importantes
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // se tiver carregadno
    if (isLoading) {
        // temporário
        return <div>Carregando...</div>;
    }

    // se não tiver autenticado vai pro login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    // se não libera a página
    return <Outlet />;
}
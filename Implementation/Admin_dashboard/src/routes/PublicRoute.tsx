import { ReactNode, useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';
import { ClipLoader } from 'react-spinners';


const PublicRoute = ({ children }: { children: ReactNode }) => {
    const auth = useContext(AuthContext);

    if (!auth) {
        // fallback if context is missing (shouldn't happen if wrapped properly)
        return <>{children}</>;
    }

    const { isAuthenticated, loading } = auth;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader size={50} color="#658F8D" />
            </div>
        );
    }

    return isAuthenticated ? <Navigate to="/aaa" replace /> : children;
};

export default PublicRoute;

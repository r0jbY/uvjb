import { ReactNode, useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';
import { ClipLoader } from 'react-spinners';


const PrivateRoute = ({ children }: {children : ReactNode}) => {
  const auth = useContext(AuthContext);

  if (!auth) {
    // fallback if context is missing (shouldn't happen if wrapped properly)
    return <Navigate to="/" replace />;
  }

  const { isAuthenticated, loading } = auth;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color="#658F8D" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;

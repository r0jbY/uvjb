import './App.css'
import LoginComponent from './Components/LoginComponent'
import NavBarComponent from './Components/NavBarComponent'
import { Route, Routes } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
  

  return (
    <AuthProvider>
      <Routes>
        <Route index element={<PublicRoute><LoginComponent/></PublicRoute>}/>
        <Route path='*' element={<PrivateRoute><NavBarComponent/></PrivateRoute> }/>
      </Routes>
    </AuthProvider>
  );
}

export default App

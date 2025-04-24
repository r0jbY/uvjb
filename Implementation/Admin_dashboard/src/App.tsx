import './App.css'
import LoginComponent from './Components/LoginComponent'
import { Route, Routes } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import UserPage from './Pages/UserPage';
import Modal from 'react-modal';
import ClientPage from './Pages/ClientPage';

Modal.setAppElement('#root');

function App() {
  

  return (
    <AuthProvider>
      <Routes>
        <Route index element={<PublicRoute><LoginComponent/></PublicRoute>}/>
        <Route path='UserOverview' element={<PrivateRoute><UserPage/></PrivateRoute> }/>
        <Route path='*' element={<PrivateRoute><UserPage/></PrivateRoute> }/>
        <Route path='ClientOverview' element={<PrivateRoute><ClientPage/></PrivateRoute> }/>
      </Routes>
    </AuthProvider>
  );
}

export default App

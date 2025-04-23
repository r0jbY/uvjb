import './App.css'
import LoginComponent from './Components/LoginComponent'
import { Route, Routes } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import UserPage from './Pages/UserPage';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {
  

  return (
    <AuthProvider>
      <Routes>
        <Route index element={<PublicRoute><LoginComponent/></PublicRoute>}/>
        <Route path='*' element={<PrivateRoute><UserPage/></PrivateRoute> }/>
      </Routes>
    </AuthProvider>
  );
}

export default App

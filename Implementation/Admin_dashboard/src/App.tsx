import './App.css'
import LoginComponent from './Components/LoginComponent'
import NavBarComponent from './Components/NavBarComponent'
import { Route, Routes } from 'react-router';

function App() {
  

  return (
    <Routes>
      <Route index element={<LoginComponent/>}/>
      <Route path='*' element={<NavBarComponent/>}/>
    </Routes>
    
  );
}

export default App

import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './jsx/components/Login';
import Signup from './jsx/components/Signup';
import UserRoutes from './jsx/routes/UserRoutes';
import FallBack from './jsx/components/FallBack';
import HomePage from './jsx/components/HomePage';

const App = () => {
  return (
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/homepage/*' element={<HomePage />} />
        <Route path='/user/:userid/*' element={<UserRoutes />} />
        
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="*" element={<FallBack />} />
      </Routes>
    )
};

export default App;

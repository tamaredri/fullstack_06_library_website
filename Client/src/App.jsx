import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './jsx/components/LoginPage';
import SignupPage from './jsx/components/SignupPage';
import UserRoutes from './jsx/routes/UserRoutes';
import FallBack from './jsx/components/FallBack';
import HomePage from './jsx/components/HomePage';

const App = () => {
  return (
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/homepage/*' element={<HomePage />} />
        <Route path='/user/:userid/*' element={<UserRoutes />} />
        
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="*" element={<FallBack />} />
      </Routes>
    )
};

export default App;

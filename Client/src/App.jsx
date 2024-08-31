import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import LoginPage from './jsx/components/LoginPage';
import SignupPage from './jsx/components/SignupPage';
import UserRoutes from './jsx/routes/UserRoutes';
import FallBack from './jsx/components/FallBack';
import HomePage from './jsx/components/HomePage';
import { useState } from 'react';

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("currentUser"));

  return (
    <Routes>
      <Route path='/login' element={<LoginPage setUser={setUser} />} />
      <Route path='/signup' element={<SignupPage setUser={setUser} />} />
      <Route path='/homepage/*' element={user === null ? (
        <HomePage />) : (
        <Navigate to={`/user/${user}`} />
      )} />
      <Route path='/user/:userid/*' element={<UserRoutes />} />

      <Route path="/"
        element={user === null ? (
          <Navigate to="/homepage" />) : (
          <Navigate to={`/user/${user}`} />
        )} />
      <Route path="*" element={<FallBack />} />
    </Routes>
  )
};

export default App;

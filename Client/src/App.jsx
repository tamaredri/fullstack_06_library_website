import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import LoginPage from './jsx/components/LoginPage';
import SignupPage from './jsx/components/SignupPage';
import UserRoutes from './jsx/routes/UserRoutes';
import FallBack from './jsx/components/FallBack';
import HomePage from './jsx/components/HomePage';
import { useEffect, useState } from 'react';

const App = () => {

  //const user = localStorage.getItem('currentUser');
  const user =localStorage.getItem('currentUser');

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />

      <Route path='/homepage' element={user === null ? (
        <HomePage />) : (
        <Navigate to='/user' />
      )} />
      <Route path='/user/*' element={<UserRoutes />} />

      <Route path="/"
        element={user === null ? (
          <Navigate to="/homepage" />) : (
          <Navigate to='/user' />
        )} />
      <Route path="*" element={<FallBack />} />
    </Routes>
  )
};

export default App;

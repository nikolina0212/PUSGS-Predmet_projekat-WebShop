import './App.css';
import Login from './components/users/Login';
import SignUp from './components/users/SignUp';
import Dashboard from './components/shared/Dashboard';
import Profile from './components/users/Profile';
import { ThemeProvider } from '@mui/material/styles';
import darkTheme from './styles/theme';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { isTokenExpired, GetUserVerification } from './redux/UserInfo';
import { setUser, clearUser } from './redux/userSlice';
import { PrivateRoutes, Redirect } from './redux/PrivateRoutes';
import { Route, Navigate, Routes } from 'react-router-dom';

function App() {

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const isExpired = isTokenExpired(token);
      if (!isExpired) {
        const user = {
          token,
          isVerified: GetUserVerification(token),
        };
        dispatch(setUser(user));
      } else {
        dispatch(clearUser());
      }
    }
    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return <p >Loading...</p>;
  }
  return (
    <>
    <ThemeProvider theme={darkTheme}>
    <Routes>
          <Route element={<PrivateRoutes/>}>
            <Route path='/' element={<Dashboard/>}/>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<Redirect/>}>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/login' element={<Login/>}/>
          </Route>

          <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </ThemeProvider>
    </>
  );
}

export default App;

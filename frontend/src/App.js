import './App.css';
import Login from './components/users/Login';
import SignUp from './components/users/SignUp';
import Dashboard from './components/shared/Dashboard';
import Map from './components/orders/Map';
import Profile from './components/users/Profile';
import AllUsers from './components/users/AllUsers';
import AdminOrders from './components/orders/AdminOrders';
import { ThemeProvider } from '@mui/material/styles';
import darkTheme from './styles/theme';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { isTokenExpired, GetUserVerification, GetUserRole, GetUserStatus } from './redux/UserInfo';
import { setUser, clearUser } from './redux/userSlice';
import { PrivateRoutes, Redirect } from './redux/PrivateRoutes';
import { Route, Navigate, Routes } from 'react-router-dom';
import AllArticles from './components/articles/AllArticles';
import MyArticles from './components/articles/MyArticles';
import AddArticle from './components/articles/AddArticle';
import Order from './components/orders/Order';

function App() {
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const isExpired = isTokenExpired(token);
      if (!isExpired) {
        const user = {
          token,
          role: GetUserRole(token),
          isVerified: GetUserVerification(token),
          status: GetUserStatus(token)
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
            {user.role === 'Administrator' ? (
              <>
                <Route path="/verification" element={<AllUsers />} />
                <Route path="/admin-orders" element={<AdminOrders />} />
              </>
            ) : (
              <>
                <Route path="/verification" element={<Navigate to="/" />} />
                <Route path="/admin-orders" element={<Navigate to="/" />} />
              </>
            )}
            {user.role === 'Purchaser' ? (
              <>
                <Route path="/available-articles" element={<AllArticles />} />
                <Route path="/order" element={<Order />} />
              </>
            ) : (
              <>
                <Route path="/available-articles" element={<Navigate to="/" />} />
                <Route path="/order" element={<Navigate to="/" />} />
              </>
            )}
            {user.role === 'Seller' ? (
              <>
                <Route path="/my-articles" element={<MyArticles />} />
                <Route path="/add-article" element={<AddArticle />} />
                <Route path="/map" element={<Map />} />
              </>
            ) : (
              <>
                <Route path="/my-articles" element={<Navigate to="/" />} />
                <Route path="/add-article" element={<Navigate to="/" />} />
                <Route path="/map" element={<Navigate to="/" />} />
              </>
            )}
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

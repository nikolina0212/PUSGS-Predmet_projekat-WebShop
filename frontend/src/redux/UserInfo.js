import jwtDecode from 'jwt-decode';

export const GetUserRole = (token) => {
  const decodedToken = jwtDecode(token);
  return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
};

export const GetUserVerification = (token) => {
  const decodedToken = jwtDecode(token);
  return decodedToken['verified'];
};

export const GetUserStatus = (token) => {
  const decodedToken = jwtDecode(token);
  return decodedToken['status'];
};

export const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }

  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; 

  return decodedToken.exp < currentTime;
};
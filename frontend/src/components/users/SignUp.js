import { React, useState, useRef } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { FormHelperText } from "@mui/material";
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { MenuItem, Select } from "@mui/material";
import { SignUpUser } from "../../services/UserService";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { GetUserRole, GetUserStatus, GetUserVerification } from "../../redux/UserInfo";
import { UserSignUp } from "../../models/users/UserSignUp";
import { useNavigate } from "react-router-dom";

function SignUp(){
    const [user, setRegisteredUser] = useState(new UserSignUp());
    const [confirmPass, setConfirmPass] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const currentDate = new Date().toISOString().split('T')[0]; 

    const firstnameRef = useRef(null);
    const lastnameRef = useRef(null);
    const emailRef = useRef(null);
    const usernameRef = useRef(null);
    const addressRef = useRef(null);
    const dateRef = useRef(null);
    const typeRef = useRef(null);
    const passwordRef = useRef(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!validateForm(user)){
            return;
        }

        console.log(user);
        const formData = new FormData();
        formData.append('email', user.email);
        formData.append('username', user.username);
        formData.append('firstName', user.firstname);
        formData.append('lastName', user.lastname);
        formData.append('address', user.address);
        formData.append('userType', user.userType);
        formData.append('dateOfBirth', user.birthDate);
        formData.append('password', user.password);
        formData.append('image', selectedFile);

        try {
          const resp = await SignUpUser(formData);
          dispatch(setUser({token: resp.token, role: GetUserRole(resp.token),
             isVerified: GetUserVerification(resp.token), status: GetUserStatus(resp.token) }));
          navigate('/');
          
        } catch (error) {
          setErrorMessage(error.message);
          setRegisteredUser((prevUser) => ({ ...prevUser, email: ''}));
        }
    };

    function validateForm(user){
        if(user.firstname.trim() === ''){
            setErrorMessage('Please fill out firstname.');
            firstnameRef.current.focus();
            return false;
        }
        if(user.lastname.trim() === ''){
            setErrorMessage('Please fill out lastname.');
            lastnameRef.current.focus();
            return false;
        }
        if(user.email.trim() === ''){
          setErrorMessage('Please fill out email.');
          emailRef.current.focus();
          return false;
        }
        if(user.username.trim() === ''){
          setErrorMessage('Please fill out username.');
          usernameRef.current.focus();
          return false;
        }
        if(user.address.trim() === ''){
            setErrorMessage('Please fill out address.');
            addressRef.current.focus();
            return false;
        }
        if(user.birthDate.trim() === ''){
          setErrorMessage('Please fill out date of birth.');
          addressRef.current.focus();
          return false;
        }
        if(user.password.trim() === ''){
          setErrorMessage('Please fill out password.');
          passwordRef.current.focus();
          return false;
        }
        if (user.password !== confirmPass) {
          setErrorMessage('Passwords does not match. Try again!');
          setConfirmPass('');
          return false; 
        }
        return true;
    }

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
  
      const imageUri = URL.createObjectURL(file);
      setRegisteredUser((prevUser) => ({ ...prevUser, imageUri }));
    };

    return(
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Sign up
            </Typography><br/>
            {errorMessage && (
            <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
               {errorMessage}
          </Typography>
          )}
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField
                    autoComplete="off"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    inputRef={firstnameRef}
                    value={user.firstname}
                    onChange={(e) =>
                        setRegisteredUser((prevUser) => ({ ...prevUser, firstname: e.target.value }))
                    }
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    inputRef={lastnameRef}
                    autoComplete="off"
                    value={user.lastname}
                    onChange={(e) =>
                        setRegisteredUser((prevUser) => ({ ...prevUser, lastname: e.target.value }))
                    }
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    inputRef={emailRef}
                    autoComplete="off"
                    value={user.email}
                    onChange={(e) =>
                        setRegisteredUser((prevUser) => ({ ...prevUser, email: e.target.value }))
                    }
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    inputRef={usernameRef}
                    autoComplete="off"
                    value={user.username}
                    onChange={(e) =>
                        setRegisteredUser((prevUser) => ({ ...prevUser, username: e.target.value }))
                    }
                />
                </Grid>
                <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="address"
              label="Address"
              id="address"
              inputRef={addressRef}
              autoComplete="off"
              value={user.address}
              onChange={(e) =>
                setRegisteredUser((prevUser) => ({ ...prevUser, address: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              type="date"
              fullWidth
              name="birthDate"
              label="Date of birth"
              InputLabelProps={{ shrink: true }}
              id="birthDate"
              inputRef={dateRef}
              value={user.birthDate}
              inputProps={{ max: currentDate }}
              onChange={(e) =>
                setRegisteredUser((prevUser) => ({ ...prevUser, birthDate: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <TextField
            helperText="Upload image"
            type="file"
            InputProps={{
              inputProps: {
                accept: 'image/*',
              },
              startAdornment: selectedFile && (
                <img
                  src={user.imageUri}
                  alt="Selected"
                  style={{ width: '20px', height: '20px', objectFit: 'cover' }}
                />
              ),
            }}
            onChange={handleFileChange}
      />
          </Grid>
          <Grid item xs={12} sm={6}>
          <Select
            id="userType"
            inputRef={typeRef}
            style={{ width: '190px', height: '57px'}} 
            label="Please select your type"
            variant="outlined"
            size="small"
            value={user.userType}
            onChange={(e) => setRegisteredUser((prevUser) => ({ ...prevUser, userType: e.target.value }))}
            ><MenuItem value={1}>Purchaser</MenuItem>
            <MenuItem value={2}>Seller</MenuItem>
          </Select>
          <FormHelperText>Select user type</FormHelperText>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              inputRef={passwordRef}
              autoComplete="off"
              value={user.password}
              onChange={(e) =>
                setRegisteredUser((prevUser) => ({ ...prevUser, password: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="confirmPass"
              name="confirmPass"
              required
              label="Confirm password"
              variant="outlined"
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
          </Grid>
        </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
                <Grid item>
                <Link href="/login" variant="body2">
                    Already have an account? Sign in
                </Link>
                </Grid>
            </Grid>
            </Box>
        </Box>
        </Container>
    );
}

export default SignUp;
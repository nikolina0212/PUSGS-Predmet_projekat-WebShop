import React from 'react';
import { useEffect, useState } from 'react';
import { GetProfile, UpdateProfile, ChangePassword } from '../../services/UserService';
import {Typography, Paper, Grid, TextField, Button, Alert,
  Avatar,Dialog,DialogActions,DialogContent,DialogTitle,Snackbar} from '@mui/material';
import { UserUpdate } from '../../models/users/UserUpdate';
import Dashboard from '../shared/Dashboard';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(new UserUpdate());
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmPass, setConfirmPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorPass, setErrorPass] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];
  const [isChangePassDialogOpen, setIsChangePassDialogOpen] = useState(false);


  const profile = async () => {
    try {
      const resp = await GetProfile();
      setUserProfile(resp);
      const dateObject = new Date(resp.dateOfBirth);
      const formattedDate = dateObject.toISOString().split('T')[0];
      setUserProfile((prevData) => ({
        ...prevData,
        dateOfBirth: formattedDate,
      }));
    } catch (error) {
      console.log(error.message);
    }
  
};

  useEffect(() => {
    profile();
  }, []);

  const handleSubmit = async (e) =>  {
    e.preventDefault();
    if (!validateForm(userProfile)) {
        return;
      }

      const formData = new FormData();
      formData.append("email", userProfile.email);
      formData.append("username", userProfile.username);
      formData.append("firstname", userProfile.firstName);
      formData.append("lastname", userProfile.lastName);
      formData.append("address", userProfile.address);
      formData.append("dateOfBirth", userProfile.dateOfBirth);
      formData.append("image", selectedImage);
      
      try {
        const resp = await UpdateProfile(formData);
        setUserProfile(resp);
        const dateObject = new Date(resp.dateOfBirth);
        const formattedDate = dateObject.toISOString().split('T')[0];
        setUserProfile((prevData) => ({
        ...prevData,
        dateOfBirth: formattedDate,
      }));
        setIsEditMode(false);
        setErrorMessage('');
        setIsSnackbarOpen(true);
        setSnackbarMessage("Successfully updated profile data!");
      } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarMessage(error.message);
      }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswords(newPass, confirmPass)) {
      return;
    }
    try {
      const resp = await ChangePassword({'newPassword': newPass});
      handleCloseChangePassDialog();
      setIsSnackbarOpen(true);
      setSnackbarMessage(resp);

    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarMessage(error.message);
    }
  };
 
  function validatePasswords(newPass, confirmPass) {
    if(newPass.trim() === '' || confirmPass.trim() === ''){
      setErrorPass("Please fill out all required fields.");
      setConfirmPass('');
      setNewPass('');
      return false;
    }
    if(newPass !== confirmPass){
      setErrorPass("Passwords doesn't match. Try again.");
      setConfirmPass('');
      return false;
    }

    return true;
  }

  function validateForm(user) {
    const trimmedFields = ['username', 'firstName', 'lastName', 'address'];
    const hasEmptyRequiredFields = trimmedFields.some((field) => user[field].trim() === '');

    if (hasEmptyRequiredFields) {
      setErrorMessage("Please fill out all required fields.");
      return false;
  }
    return true;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleUpdateProfile = () => {
    setIsEditMode(true);
  };

  const handleDecline = () => {
    profile();
    setIsEditMode(false);
    setErrorMessage('');
  };

  
  const handleOpenChangePassDialog = () => {
    setIsChangePassDialogOpen(true);
  };

  const handleCloseChangePassDialog = () => {
    setIsChangePassDialogOpen(false);
    setConfirmPass('');
    setNewPass('');
    setErrorPass('');
  };
  
return (
  <>
  <Dashboard content={
    <Grid container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
    <Grid item xs={12} sm={10} md={8} lg={6}>
      <Paper elevation={3} style={{ padding: '10px', margin: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <Avatar
                alt="User Avatar"
                src={`https://localhost:44320/${userProfile.image}`}
                sx={{ width: '60px', height: '60px', marginRight: '10px' }}
              />
              <Typography variant="h6" gutterBottom>
                Hello {userProfile.email}
              </Typography>
            </div>
        <form>
          {errorMessage && (
            <Typography color='error'>{errorMessage}</Typography>
          )}
        <TextField
            name="username"
            label="Username"
            autoComplete='off'
            required
            variant="outlined"
            fullWidth
            value={userProfile.username}
            margin="normal"
            disabled={!isEditMode}
            onChange={(e) => setUserProfile((prevUser) => ({ ...prevUser, username: e.target.value }))}
          />
          <TextField
            name="firstName"
            required
            label="First name"
            variant="outlined"
            autoComplete='off'
            fullWidth
            value={userProfile.firstName}
            margin="normal"
            disabled={!isEditMode}
            onChange={(e) => setUserProfile((prevUser) => ({ ...prevUser, firstName: e.target.value }))}
          />
          <TextField
            name="lastName"
            label="Last name"
            variant="outlined"
            required
            autoComplete='off'
            fullWidth
            value={userProfile.lastName}
            margin="normal"
            disabled={!isEditMode}
            onChange={(e) => setUserProfile((prevUser) => ({ ...prevUser, lastName: e.target.value }))}
          />
          <TextField
            name="birthDate"
            label="Date of birth"
            autoComplete='off'
            type='date'
            required
            variant="outlined"
            inputProps={{ max: currentDate }}
            fullWidth
            value={userProfile.dateOfBirth}
            margin="normal"
            disabled={!isEditMode}
            onChange={(e) => setUserProfile((prevUser) => ({ ...prevUser, dateOfBirth: e.target.value }))}
          />
          <TextField
            name="address"
            label="Address"
            variant="outlined"
            autoComplete='off'
            required
            fullWidth
            value={userProfile.address}
            margin="normal"
            disabled={!isEditMode}
            onChange={(e) => setUserProfile((prevUser) => ({ ...prevUser, address: e.target.value }))}
          />
          {!isEditMode && (
            <div>
            <Button variant="contained" color="primary" onClick={handleUpdateProfile} style={{ marginLeft: '30px' }}>
                  Edit Profile
                </Button>
                <Button variant="contained" color="primary" onClick={handleOpenChangePassDialog} style={{ marginLeft: '220px' }}>
                Change Password
              </Button>
            </div>
          )}
          {isEditMode && (
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                  <TextField
                    variant="outlined"
                    helperText="Upload new image"
                    sx={{ width: '300px' }}
                    type="file"
                    InputProps={{
                      inputProps: {
                        accept: 'image/*',
                      },
                    }}
                    onChange={handleFileChange}
                    style={{ marginLeft: '130px' }}
                  />
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <Button variant="contained" color="success" style={{ marginLeft: '40px' }} onClick={handleSubmit}>
                      Confirm
                    </Button>
                    <Button variant="outlined" color="error" style={{ marginLeft: '300px' }} onClick={handleDecline}>
                      Decline
                    </Button>
                  </div>
                </div>
              )}
        </form>
      </Paper>
    </Grid>
    <Dialog open={isChangePassDialogOpen} onClose={handleCloseChangePassDialog}
          fullWidth
          PaperProps={{
            style: {
              maxWidth: '400px',
              textAlign: 'center', // Add this line
            },
          }}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
        <form onSubmit={handleChangePassword}>
          {errorPass && (
            <Typography color='error'>{errorPass}</Typography>
          )}
            <TextField helperText="New password"
            onChange={(e) => setNewPass(e.target.value)} autoComplete='off'
            variant='outlined' type='password' />
            <br/>
            <TextField helperText="Confirm new password"
            onChange={(e) => setConfirmPass(e.target.value)} autoComplete='off'
            variant='outlined' value={confirmPass} type='password' />
          </form>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'flex-end' }}>
          <Button onClick={handleChangePassword} color="success" variant='outlined' style={{ marginRight: '170px' }}>
            Confirm
          </Button>
          <Button onClick={handleCloseChangePassDialog} color="error" variant='outlined' style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setIsSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity="info">{snackbarMessage}</Alert>
      </Snackbar>
  </Grid>
  
  }/>
   </>
  );
}

export default Profile;

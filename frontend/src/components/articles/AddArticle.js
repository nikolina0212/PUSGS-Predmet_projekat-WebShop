import React, { useState, useRef } from "react";
import { ArticleToAdd } from "../../models/articles/ArticleToAdd";
import { AddNewArticle } from "../../services/ArticleService";
import { Typography, TextField, Snackbar, Alert, Grid, Paper, Button } from "@mui/material";
import Dashboard from "../shared/Dashboard";

function AddArticle(){
  const [article, setArticle] = useState(new ArticleToAdd());
  const [selectedImage, setSelectedImage] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const amountRef = useRef(null);
  const priceRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleAdd = async () => {
    if(!validateForm(article)){
      return;
    }

    const formData = new FormData();
    formData.append("name", article.name);
    formData.append("description", article.description);
    formData.append("amount", article.amount);
    formData.append("price", article.price);
    formData.append("image", selectedImage);

    try {
        await AddNewArticle(formData);
        setArticle(new ArticleToAdd());
        setSelectedImage(null);
        setSnackbarMessage("Article is successfully added.");
        setIsSnackbarOpen(true);
      } catch (error) {
        setSnackbarMessage(error.message);
        setIsSnackbarOpen(true);
      }
  };
  const handleCancel = () => {
    setArticle(new ArticleToAdd());
  };

  function validateForm(addedArticle){
    if(addedArticle['name'].trim() === ''){
      setErrorMessage('Please fill out name.');
      nameRef.current.focus();
      return;
    }
    if(addedArticle['description'].trim() === ''){
      setErrorMessage('Please fill out description.');
      descriptionRef.current.focus();
      return;
    }
    if(!addedArticle['amount']){
      setErrorMessage('Please fill out amount.');
      amountRef.current.focus();
      return;
    }
    if(!addedArticle['price']){
      setErrorMessage('Please fill out price.');
      priceRef.current.focus();
      return;
    }
    return true;
  }

  return(<>
  <Dashboard content={
    <Grid container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
    <Grid item xs={12} sm={10} md={8} lg={6}>
      <Paper elevation={3} style={{ padding: '10px', margin: '10px' }}>
        <form>
          {errorMessage && (
            <Typography color='error'>{errorMessage}</Typography>
          )}
        <TextField
            name="name"
            label="Name"
            autoComplete='off'
            required
            inputRef={nameRef}
            variant="outlined"
            fullWidth
            margin="normal"
            value={article.name}
            onChange={(e) => setArticle((prev) => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            name="description"
            required
            label="Description"
            variant="outlined"
            autoComplete='off'
            inputRef={descriptionRef}
            fullWidth
            value={article.description}
            margin="normal"
            onChange={(e) => setArticle((prev) => ({ ...prev, description: e.target.value }))}
          />
          <TextField
            name="amount"
            label="Amount"
            variant="outlined"
            inputRef={amountRef}
            required
            type="number"
            autoComplete='off'
            fullWidth
            value={article.amount}
            margin="normal"
            onChange={(e) => setArticle((prev) => ({ ...prev, amount: e.target.value }))}
          />
          <TextField
            name="price"
            label="Price (USD)"
            autoComplete='off'
            required
            type="number"
            inputRef={priceRef}
            variant="outlined"
            fullWidth
            value={article.price}
            margin="normal"
            onChange={(e) => setArticle((prev) => ({ ...prev, price: e.target.value }))}
          />
            <TextField
              variant="outlined"
              fullWidth
                helperText="Upload image"
                type="file"
                InputProps={{
                  inputProps: {
                    accept: 'image/*',
                  }}}
                onChange={handleFileChange}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={handleAdd}  color="success" variant="outlined" >
                  Add
                </Button>
                <Button onClick={handleCancel} color="error" variant="outlined">Cancel</Button>
                </div>
          </form>
      </Paper>
    </Grid>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setIsSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info">{snackbarMessage}</Alert>
      </Snackbar>
  </Grid>
  
  }/>
  </>);
}

export default AddArticle;
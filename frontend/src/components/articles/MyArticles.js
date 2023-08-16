import React, { useState, useEffect, useRef } from "react";
import { GetSellerArticles, DeleteArticle, EditArticle } from "../../services/ArticleService";
import Dashboard from "../shared/Dashboard";
import { Card, Grid, CardMedia, Alert, CardContent, Snackbar, Typography, Dialog, DialogActions, DialogTitle,
DialogContent, CardActions, Button, Container, TextField }
from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Article } from "../../models/articles/Article";

function MyArticles(){
  const [articles, setArticles] = useState(null);
  const [errorMess, setErrorMess] = useState('');
  const [errorFields, setErrorFields] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editArticle, setEditArticle] = useState(new Article());
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const amountRef = useRef(null);
  const priceRef = useRef(null);

  const getArticles = async () => {
    try {
      const resp = await GetSellerArticles();
      setArticles(resp);
    } catch (error) {
      setErrorMess(error.message);
    }
  
};

  useEffect(() => {
    getArticles();
  }, []);

  const handleDelete = async (articleid) => {
    try {
        await DeleteArticle(articleid);
        const updated = articles.filter((article) => article.id !== articleid);
        setArticles(updated);
        setSnackbarMessage("Article is successfully deleted.");
        setIsSnackbarOpen(true);
      } catch (error) {
        setSnackbarMessage(error.message);
        setIsSnackbarOpen(true);
      }
  }

  const handleEdit = async () => {
    if (!validateForm(editArticle)) {
      return;
    }

    const formData = new FormData();
    formData.append("id", editArticle.id);
    formData.append("name", editArticle.name);
    formData.append("description", editArticle.description);
    formData.append("amount", editArticle.amount);
    formData.append("price", editArticle.price);
    formData.append("image", selectedImage);

    try {
        const resp = await EditArticle(formData);
        const indx = articles.findIndex((article) => article.id === editArticle.id);
        if (indx !== -1) {
            const edited = [...articles];
            edited[indx] = resp; 
            setArticles(edited); 
          }
          handleClose();
          setSnackbarMessage("Article is successfully edited.");
          setIsSnackbarOpen(true);
      } catch (error) {
        setErrorFields(error.message);
      }
  };

  function validateForm(editedArticle){
    if(editedArticle['name'].trim() === ''){
      setErrorFields('Please fill out name.');
      nameRef.current.focus();
      return;
    }
    if(editedArticle['description'].trim() === ''){
      setErrorFields('Please fill out description.');
      descriptionRef.current.focus();
      return;
    }
    if(!editedArticle['amount']){
      setErrorFields('Please fill out amount.');
      amountRef.current.focus();
      return;
    }
    if(!editedArticle['price']){
      setErrorFields('Please fill out price.');
      priceRef.current.focus();
      return;
    }
    return true;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleOpen = (article) => {
    setEditArticle(article);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrorFields('');
  };

  return (
  <Dashboard content={
    <>
    {articles === null && !errorMess && (<h3>Loading...</h3>)}
    {errorMess && (<h3>{errorMess}</h3>)}
    {articles && (
    <Container sx={{ py: 8 }} maxWidth="md">
    <Grid container spacing={4}>
      {articles.map((article, index) => (
        <Grid item key={article.id} xs={12} sm={6} md={4}>
          <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <CardMedia
                  component="div"
                  sx={{
                    pt: '10.25%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <img
                      src={`https://localhost:44320/${article.image}`}
                      alt=""
                      style={{ width: '120px',height: '120px' }}
                    />
                </CardMedia>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                <b>{article.name}</b>
              </Typography>
              <Typography>
                {article.description}
              </Typography>
              <Typography>
                <b>Price:</b> {article.price}
              </Typography>
              <Typography>
                <b>Available amount:</b> {article.amount}
              </Typography>
            </CardContent>
            <CardActions sx={{
                display: 'flex',
                justifyContent: 'space-between', 
                marginTop: 'auto',
                paddingTop: '16px',
              }}>
              <Button  variant="outlined" onClick={() => handleOpen(article)} startIcon={<EditIcon/>} size="small">Edit</Button>
              <Button  variant="outlined" onClick={() => handleDelete(article.id)} startIcon={<DeleteIcon/>}   size="small">Delete</Button>
              <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit article</DialogTitle>
            <DialogContent>
            {errorFields && (
                <Typography variant="body1" color="error">
                  {errorFields}
                </Typography>
              )}
              <form onSubmit={handleEdit}>
                
                <TextField label="Name" required autoComplete="off" margin="normal"
                variant='outlined' value={editArticle.name} inputRef={nameRef} fullWidth
                onChange={(e) => setEditArticle((prev) => ({ ...prev, name: e.target.value }))}
                />
                <br/>
                <TextField label="Description" required fullWidth autoComplete="off" margin="normal"
                variant='outlined' value={editArticle.description}  inputRef={descriptionRef}
                onChange={(e) => setEditArticle((prev) => ({ ...prev, description: e.target.value }))}
                /><br/>
                <TextField label="Amount"
                variant='outlined' type="number" required fullWidth autoComplete="off" margin="normal"
                value={editArticle.amount} inputRef={amountRef}
                onChange={(e) => setEditArticle((prev) => ({ ...prev, amount: e.target.value }))}
                inputProps={{
                  min: 0,
                }}
                /><br/>
                <TextField label="Price" required  type="number" fullWidth autoComplete="off" margin="normal"
                variant='outlined' value={editArticle.price} inputRef={priceRef}
                onChange={(e) => setEditArticle((prev) => ({ ...prev, price: e.target.value }))}
                inputProps={{
                  min: 0,
                }}
                /><br/>
                 <TextField
              variant="outlined"
              fullWidth
                helperText="Change image"
                sx={{ width: "400px" }}
                type="file"
                InputProps={{
                  inputProps: {
                    accept: 'image/*',
                  }}}
                onChange={handleFileChange}
              />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleEdit} type='submit' color="primary" variant="contained">
                Change
              </Button>
            </DialogActions>
          </Dialog>
            </CardActions>
          </Card>
        </Grid>
      ))}
      <Snackbar
      open={isSnackbarOpen}
      autoHideDuration={5000}
      onClose={() => setIsSnackbarOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert severity="info">{snackbarMessage}</Alert>
    </Snackbar>
    </Grid>
    </Container>
          )}
    </>
  }/>
);
}

export default MyArticles;
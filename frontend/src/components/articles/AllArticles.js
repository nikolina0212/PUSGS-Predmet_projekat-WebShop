import React from "react";
import Dashboard from "../shared/Dashboard";
import { useState, useEffect } from "react";
import { Card, Grid, CardMedia, Alert, CardContent, Snackbar, Typography, CardActions, Button, Container, TextField }
 from "@mui/material";
import { GetAllArticles, AddToCart } from "../../services/ArticleService";

function AllArticles(){
  const [articles, setArticles] = useState(null);
  const [amounts, setAmounts] = useState({});
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errorMess, setErrorMess] = useState('');

  const getAllArticles = async () => {
    try {
      const resp = await GetAllArticles();
      setArticles(resp);
      const initialAmounts = {};
      resp.forEach((article) => {
        initialAmounts[article.id] = 0;
      });
      setAmounts(initialAmounts);
    } catch (error) {
      setErrorMess(error.message);
    }
};

  useEffect(() => {
    getAllArticles();
  }, []);

  const handleAddToCart = async (articleId) => {
    const amount = amounts[articleId] || 0;
    try {
      const resp = await AddToCart(articleId, amount);

      setArticles((prevArticles) => {
        return prevArticles.map((article) => {
          if (article.id === articleId) {
            return {
              ...article,
              amount: article.amount - amount,
            };
          }
          return article;
        });
      });

      setAmounts((prevAmounts) => ({
        ...prevAmounts,
        [articleId]: 0, 
      }));

      setIsSnackbarOpen(true);
      setSnackbarMessage(resp);
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarMessage(error.message);
    }
  };

  const handleAmountChange = (articleId, value) => {
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      [articleId]: value,
    }));
  };

  return (
    <Dashboard content={
      <>
      {articles === null && (<h3>Loading...</h3>)}
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
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 'auto',
                paddingTop: '16px',
              }}>
              <TextField
              margin="normal"
              required
              variant="standard"
              id="amount"
              label="Enter amount:"
              name="amount"
              autoComplete='off'
              value={amounts[article.id]} 
              onChange={(e) => handleAmountChange(article.id, e.target.value)}
              sx={{ width: '150px', marginRight: '6px' }}
            />
                <Button  variant="outlined" onClick={() => handleAddToCart(article.id)}  size="small">Add to cart</Button>
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

export default AllArticles;